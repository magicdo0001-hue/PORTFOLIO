import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const url = new URL('/rhine-lab/index.html', process.env.PORTFOLIO_URL || 'http://127.0.0.1:4175');
const errors = [];
async function openPage(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, ...options });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && !message.location().url.endsWith('/favicon.ico')) errors.push(message.text());
  });
  await page.addInitScript(() => {
    window.bootStates = [];
    window.welcomeShown = false;
    const sample = () => {
      const stage = document.querySelector('#stage');
      const welcome = document.querySelector('.welcome');
      const boot = document.querySelector('#boot');
      if (stage && welcome && boot) {
        const state = `${stage.dataset.mode}:${stage.dataset.boot}`;
        if (window.bootStates.at(-1) !== state) window.bootStates.push(state);
        window.welcomeShown ||= getComputedStyle(welcome).opacity > 0.01 &&
          getComputedStyle(boot).visibility !== 'hidden' && getComputedStyle(boot).opacity > 0.01;
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  return page;
}
async function archiveReady(page) {
  await page.waitForFunction(() => window.rhine?.stats().ready && rhine.stats().mode === 'archive', null, { timeout: 30000 });
  assert.equal(await page.evaluate(() => window.welcomeShown), false, 'Welcome must never flash');
  assert.equal(await page.evaluate(() => rhine.stats().audio.scene), 'archive');
  assert.equal(await page.locator('.callout-rule').evaluate(node => node.style.transform), '', 'Boot must release the archive callout transform');
  const states = await page.evaluate(() => window.bootStates);
  assert(!states.some(state => /welcome|inspect|select|array/.test(state)), states.join(', '));
}
async function screenshot(page, name) {
  if (process.env.QA_OUTPUT) await page.screenshot({ path: join(process.env.QA_OUTPUT, `${name}.png`) });
}
try {
  if (process.env.QA_OUTPUT) await mkdir(process.env.QA_OUTPUT, { recursive: true });
  const page = await openPage();
  await page.goto(url.href);
  await page.locator('#stage[data-boot="scan"]').waitFor();
  await screenshot(page, 'boot-ring-only');
  await archiveReady(page);
  assert((await page.evaluate(() => window.bootStates)).includes('boot:scan'));
  await page.waitForTimeout(1200);
  await screenshot(page, 'boot-direct-archive');
  await page.locator('[data-action="next"]').click();
  assert.equal(await page.evaluate(() => rhine.stats().selected), 'X1-02');
  await page.locator('[data-action="settings"]').click();
  await page.locator('[data-action="restart"]').click();
  await page.locator('#stage[data-mode="boot"][data-boot="scan"]').waitFor();
  await archiveReady(page);
  assert.equal(await page.evaluate(() => rhine.stats().selected), 'X1-01');
  await page.reload();
  await archiveReady(page);
  assert(!(await page.evaluate(() => window.bootStates)).includes('boot:scan'), 'Session return skips the ring');
  await page.context().close();

  const slow = await openPage();
  let releaseAsset;
  const assetGate = new Promise(resolve => { releaseAsset = resolve; });
  await slow.route('**/assets/archive-cassette.glb', async route => { await assetGate; await route.continue(); });
  await slow.goto(url.href, { waitUntil: 'domcontentloaded' });
  await slow.locator('#stage[aria-busy="true"][data-boot="scan"]').waitFor();
  await slow.waitForTimeout(4000);
  assert.equal(await slow.evaluate(() => rhine.stats().ready), false);
  assert.equal(await slow.locator('#stage').getAttribute('data-boot'), 'scan');
  assert.equal(await slow.evaluate(() => window.welcomeShown), false);
  releaseAsset();
  await archiveReady(slow);
  await slow.context().close();

  const reduced = await openPage({ reducedMotion: 'reduce' });
  await reduced.goto(url.href);
  await archiveReady(reduced);
  assert(!(await reduced.evaluate(() => window.bootStates)).includes('boot:scan'));
  await reduced.context().close();
  assert.deepEqual(errors, []);
  console.log('Ring-only startup, replay, slow loading, session return and reduced motion: passed');
} finally {
  await browser.close();
}

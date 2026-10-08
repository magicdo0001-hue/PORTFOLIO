import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4175';
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem('rhine-archive-session-v1', JSON.stringify({ selected: 'X2-01', columns: [] })));
  // Control model readiness without depending on GPU speed or a large model download.
  const fixture = route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Project</title><main><h1>Project</h1><div data-testid="model-viewport" data-status="loading"></div></main>' });
  await page.route('**/work/bambino', fixture);
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector('.rhine-experience__frame')?.contentWindow?.rhine?.stats().ready, null, { timeout: 60000 });
  const archive = page.frames().find(frame => frame.url().includes('/rhine-lab/'));
  await page.locator('.rhine-experience__frame[data-project-portal="ready"]').waitFor();
  await archive.locator('.read-file').click();
  await archive.locator('[data-action="project-details"]').click();
  const progress = page.getByRole('progressbar', { name: '项目加载进度' });
  await progress.waitFor();
  await page.waitForFunction(() => document.querySelector('.archive-project-portal__status progress')?.value === 3);
  await page.waitForTimeout(350);
  assert.equal(await progress.evaluate(node => node.value), 3, 'Unfinished model must hold preparation below full');
  if (process.env.QA_OUTPUT) {
    await mkdir(process.env.QA_OUTPUT, { recursive: true });
    await page.screenshot({ path: join(process.env.QA_OUTPUT, 'project-loading-progress.png') });
  }
  const project = page.frames().find(frame => frame.url().endsWith('/work/bambino'));
  await project.locator('[data-testid="model-viewport"]').evaluate(node => { node.dataset.status = 'ready'; });
  await page.locator('.archive-project-portal[data-phase="open"]').waitFor({ timeout: 15000 });
  assert.equal(await page.locator('.archive-project-portal progress').evaluate(node => node.value), 4);
  assert.equal(await page.locator('.archive-project-portal__status').isVisible(), false);
  await page.keyboard.press('Escape');
  await page.locator('.archive-project-portal').waitFor({ state: 'detached' });

  await page.setViewportSize({ width: 390, height: 844 });
  await archive.evaluate(() => parent.postMessage({ type: 'rhine-open-project', href: '/en/work/bambino' }, location.origin));
  const english = page.getByRole('progressbar', { name: 'Project preparation progress' });
  await english.waitFor();
  const box = await page.locator('.archive-project-portal__status').boundingBox();
  assert(box.x >= 0 && box.x + box.width <= 390, 'Loading panel must fit a narrow viewport');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.locator('.archive-project-portal').waitFor({ state: 'detached' });
  await page.waitForTimeout(250);
  assert.equal(await archive.evaluate(() => rhine.stats().mode), 'archive');
  assert.equal(await page.locator('main').getAttribute('inert'), null);
  assert.deepEqual(errors, []);
  console.log('Preparation stages, pending model, completion, mobile layout, English label and cancellation: passed');
} finally {
  await browser.close();
}

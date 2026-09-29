// The in-app browser failed sandbox initialization; use installed Playwright against a static server.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const output = await mkdtemp(join(tmpdir(), 'quiet-focus-qa-'));
const errors = [];
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4186/templates/quiet-focus/index.html';
const payload = '</script><img src=x onerror="window.__portfolioXss=1">';
const watch = page => {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
};
async function healthy(page) {
  const images = await page.evaluate(async () => Promise.all([...document.images].map(async image => {
    image.loading = 'eager';
    try { await image.decode(); return image.naturalWidth > 0; } catch { return false; }
  })));
  assert(images.length >= 2 && images.every(Boolean), 'Every displayed and retained image must load');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No horizontal overflow');
  assert.equal(await page.locator('vite-error-overlay, nextjs-portal').count(), 0, 'No framework error overlay');
  assert.equal(await page.evaluate(() => window.__portfolioXss), undefined, 'Text must not execute HTML');
}
async function exportPage(page, name) {
  await page.locator('#edit-button').click();
  const downloaded = page.waitForEvent('download');
  await page.locator('#export-button').click();
  const download = await downloaded;
  const path = join(output, name);
  await download.saveAs(path);
  assert.equal(await download.failure(), null);
  await page.locator('#close-editor').click();
  return pathToFileURL(path).href;
}

try {
  if (process.env.QA_OUTPUT) await mkdir(process.env.QA_OUTPUT, { recursive: true });
  for (const viewport of [{ width: 1448, height: 1086 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, acceptDownloads: true });
    const page = await context.newPage(); watch(page);
    await page.goto(url);
    assert.match(await page.title(), /FORM \/ FOCUS/);
    assert.equal(await page.locator('#project-grid .project').count(), 3);
    await healthy(page);
    if (process.env.QA_OUTPUT) await page.screenshot({ path: join(process.env.QA_OUTPUT, `quiet-focus-${viewport.width}.png`), fullPage: true });
    for (const [filter, count] of [['physical', 2], ['digital', 1], ['all', 3]]) {
      await page.locator(`[data-filter="${filter}"]`).click();
      assert.equal(await page.locator('#project-grid .project').count(), count);
      assert.equal(await page.locator(`[data-filter="${filter}"]`).getAttribute('aria-pressed'), 'true');
      assert.match(await page.locator('#filter-status').textContent(), new RegExp(String(count)));
      await healthy(page);
    }
    for (let index = 0; index < 3; index++) {
      await page.locator('#project-grid .project').nth(index).click();
      assert(await page.locator('#detail-dialog').isVisible());
      assert.equal(await page.locator('.detail-steps section').count(), 3);
      await healthy(page);
      await page.getByRole('button', { name: '关闭案例', exact: true }).click();
      assert.equal(await page.locator('#detail-dialog').isVisible(), false);
    }
    for (const kind of ['method', 'about']) {
      await page.locator(`[data-info="${kind}"]`).click();
      assert(await page.locator('#info-dialog').isVisible());
      assert((await page.locator('#info-content').textContent()).length > 100);
      if (kind === 'method') await page.getByRole('button', { name: '关闭', exact: true }).click();
      else await page.keyboard.press('Escape');
      assert.equal(await page.locator('#info-dialog').isVisible(), false);
    }
    await page.locator('#edit-button').click();
    await page.locator('[name="brand"]').fill(`QA Portfolio ${viewport.width}`);
    await page.locator('[name="headline1"]').fill(payload);
    await page.locator('[name="project-0-title"]').fill(payload);
    await page.getByRole('button', { name: '保存修改' }).click();
    await page.reload();
    assert.equal(await page.locator('[data-copy="headline1"]').textContent(), payload);
    assert.equal(await page.locator('.project-title').first().textContent(), payload);
    assert.match(await page.title(), new RegExp(`QA Portfolio ${viewport.width}`));
    assert.equal(await page.locator('[data-copy="headline1"] img, .project-title img').count(), 0);
    await healthy(page);
    await page.locator('#edit-button').click();
    await page.locator('[name="headline1"]').fill('UNSAVED CHANGE');
    await page.locator('#close-editor').click();
    await page.reload();
    assert.equal(await page.locator('[data-copy="headline1"]').textContent(), payload);
    await page.locator('#edit-button').click();
    const upload=page.locator('[name="project-2-image"]');
    await upload.setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('not an image')});
    assert.match(await page.locator('#editor-status').textContent(), /请选择/);
    await upload.setInputFiles({name:'replacement.webp',mimeType:'image/webp',buffer:await readFile(new URL('../public/templates/quiet-focus/assets/arc-light.webp',import.meta.url))});
    await page.waitForFunction(()=>document.querySelector('#editor-status').textContent.includes('图片已替换'));
    await page.getByRole('button', { name: '保存修改' }).click();
    await page.reload();
    assert.match(await page.locator('#project-grid .project').nth(2).locator('img').getAttribute('src'), /^data:image\/webp/);
    await page.locator('[data-filter="digital"]').click();
    const exported = await exportPage(page, `portfolio-${viewport.width}.html`);
    const offlineContext = await browser.newContext({ viewport, offline: true, acceptDownloads: true });
    const offline = await offlineContext.newPage(); watch(offline);
    await offline.goto(exported);
    assert.equal(await offline.locator('[data-copy="headline1"]').textContent(), payload);
    assert.equal(await offline.locator('[data-filter="all"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await offline.locator('#project-grid .project').count(), 3);
    await healthy(offline);
    assert(await offline.locator('img').evaluateAll(images => images.every(image => image.src.startsWith('data:image/'))));
    await offline.locator('#edit-button').click();
    await offline.locator('[name="headline1"]').fill('离线继续编辑');
    await offline.getByRole('button', { name: '保存修改' }).click();
    const reexported = await exportPage(offline, `portfolio-${viewport.width}-edited.html`);
    await offline.goto(reexported);
    assert.equal(await offline.locator('[data-copy="headline1"]').textContent(), '离线继续编辑');
    await healthy(offline);
    await offline.locator('#edit-button').click();
    offline.once('dialog', dialog => dialog.accept());
    await offline.locator('#reset-button').click();
    await offline.locator('#close-editor').click();
    await healthy(offline);
    await offlineContext.close();
    await context.close();
  }
  assert.deepEqual(errors, [], 'No browser runtime or console errors');
  console.log('PASS quiet-focus: desktop/mobile, images, filters, dialogs, save/cancel, XSS, offline export and re-export');
} finally {
  await browser.close();
  await rm(output, { recursive: true, force: true });
}

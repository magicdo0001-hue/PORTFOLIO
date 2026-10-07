import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.LOCAL_URL || 'http://127.0.0.1:4175';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const reading = await browser.newPage();
  const models = [];
  reading.on('request', request => { if (/\.glb(?:\?|$)/.test(request.url())) models.push(request.url()); });
  await reading.goto(`${base}/work/sangre#story`);
  await reading.waitForTimeout(2500);
  assert(await reading.locator('#story').isVisible());
  assert.deepEqual(models, [], 'Direct case reading must not start hidden 3D assets');
  await reading.locator('a[href="#showcase"]').click();
  await reading.locator('.sangre-showcase[data-status="ready"]').waitFor({ timeout: 60000 });
  assert(models.some(url => url.endsWith('/sangre-display.glb')), 'Returning to the showcase must load the product');
  await reading.close();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  const archive = page.frames().find(frame => frame.url().includes('/rhine-lab/'));
  await archive.waitForFunction(() => window.rhine?.stats().ready, null, { timeout: 90000 });
  for (const exit of ['logo', 'escape']) {
    // Send from the real archive window, exercising a newly pushed portal entry.
    await archive.evaluate(() => window.parent.postMessage({ type: 'rhine-open-project', href: '/work/sangre' }, location.origin));
    await page.locator('.archive-project-portal[data-phase="open"]').waitFor({ timeout: 90000 });
    const project = page.frames().find(frame => frame.url().includes('/work/sangre'));
    const showcase = page.frames().find(frame => frame.url().includes('/sangre-showcase/'));
    await showcase.locator('html.sangre-ready.is-ready').waitFor({ timeout: 60000 });
    await showcase.locator('.indicator-w').click();
    await project.locator('#story').waitFor({ state: 'visible' });
    await project.locator('a[href="#showcase"]').click();
    if (exit === 'logo') await showcase.locator('.nav__logo-w').filter({ visible: true }).first().click();
    else {
      await showcase.locator('#menu-toggle').click();
      await showcase.locator('#menu-toggle').focus();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      assert.equal(await page.locator('.archive-project-portal[data-phase="open"]').count(), 1, 'Escape closes the menu before the project');
      await page.keyboard.press('Escape');
    }
    await page.locator('.archive-project-portal').waitFor({ state: 'detached', timeout: 10000 });
    await page.waitForTimeout(500);
    assert(!page.url().includes('#project'));
    assert.equal(await page.locator('.archive-project-portal').count(), 0);
  }
  assert.deepEqual(errors, []);
  console.log('PASS deferred model loading, portfolio reading modes, owned iframe history, return and Escape');
} finally { await browser.close(); }

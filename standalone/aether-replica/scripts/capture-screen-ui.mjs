// Capture the live dashboard for the GPU-only loop/menu transition frames.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1200},deviceScaleFactor:2});
  await page.goto(process.env.LOCAL_URL||'http://127.0.0.1:4191');
  await page.locator('html.sangre-ready').waitFor({timeout:60000});
  await page.evaluate(()=>{window.__sangre.bridge.ScrollController.isIdleScrollAllowed=false;});
  for(const [progress,name] of [[0,'compact'],[.125,'expanded']]){
    await page.evaluate(p=>{
      const {bridge}=window.__sangre;
      bridge.Scroll.scrollTo(p*bridge.Scroll.limit,{immediate:true,force:true});
    },progress);
    await page.waitForTimeout(1000);
    await page.evaluate(async()=>{
      document.querySelector('#screen-ui-capture')?.remove();
      const root=document.querySelector('.sangre-screen-overlay');
      const capture=document.createElement('div');capture.id='screen-ui-capture';
      const height=Math.ceil(parseFloat(root.style.getPropertyValue('--screen-height')));
      capture.style.cssText=`${root.style.cssText};position:fixed;top:0;left:0;z-index:99999;width:600px;height:${height}px;overflow:hidden;background:#f0f1f1;`;
      capture.append(document.querySelector('.screen-live .device-ui').cloneNode(true));
      document.body.append(capture);
      await document.fonts.ready;
    });
    await page.locator('#screen-ui-capture').screenshot({
      path:fileURLToPath(new URL(`../public/assets/sangre/ui-${name}.png`,import.meta.url)),animations:'disabled',
    });
  }
} finally {await browser.close();}

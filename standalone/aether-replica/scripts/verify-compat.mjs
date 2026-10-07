import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.LOCAL_URL||'http://localhost:4190';
const dir=process.env.QA_DIR;if(!dir)throw new Error('Set QA_DIR to an external evidence directory');
await fs.mkdir(dir,{recursive:true});const records=[];
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  for(const [name,width,height]of [['desktop',1440,900],['mobile',390,844],['small',320,740]]){
    for(const mode of ['missing','null','throws','renderer']){
      const page=await browser.newPage({viewport:{width,height}}),errors=[],requests=[];
      page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
      await page.addInitScript(mode=>{
        if(mode==='missing')Object.defineProperty(window,'WebGL2RenderingContext',{value:undefined});
        const original=HTMLCanvasElement.prototype.getContext;let calls=0;
        HTMLCanvasElement.prototype.getContext=function(type,...args){
          if(type==='webgl2'){
            calls++;
            if(mode==='throws')throw new Error('WebGL2 blocked');
            if(mode==='null'||(mode==='renderer'&&calls>2))return null;
          }
          return original.call(this,type,...args);
        };
      },mode);
      await page.goto(base);await page.locator('.static-project').waitFor();
      await page.locator('.static-hero img').evaluate(img=>img.decode());
      assert.equal(await page.locator('vite-error-overlay').count(),0);
      assert.match(await page.title(),/SANGRE/);assert.match(await page.locator('h1').innerText(),/Health/);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      if(mode!=='renderer')assert(!requests.some(u=>/\.glb|aether-runtime|draco_/.test(u)),'Unsupported browsers must not load the 3D pipeline');
      await page.screenshot({path:path.join(dir,`${name}-${mode}.png`)});
      await page.getByRole('navigation',{name:'Project navigation'}).getByRole('link',{name:'Display',exact:true}).click();
      assert.equal(new URL(page.url()).hash,'#display');await page.waitForFunction(()=>document.querySelector('#display').getBoundingClientRect().top<innerHeight);
      await page.getByRole('button',{name:'Retry 3D preview'}).click();await page.locator('.static-project').waitFor();
      assert.deepEqual(errors,[]);
      records.push({name,mode,errors,requests});await page.close();console.log('PASS',name,mode);
    }
  }
  for(const route of ['/specs','/preorder']){
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.addInitScript(()=>Object.defineProperty(window,'WebGL2RenderingContext',{value:undefined}));
    await page.goto(base+route);await page.locator('.static-authored').waitFor();
    assert(await page.locator('.static-authored').innerText().then(t=>route==='/specs'?t.includes('£399'):t.includes('feels real, but is not.')));
    assert.equal(await page.locator('.static-authored h1').first().evaluate(el=>getComputedStyle(el).maskImage),'none','Static headings must not depend on scroll-animation reveal masks');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:path.join(dir,`static-${route.slice(1)}.png`),fullPage:true});await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.route('**/sangre-display.glb',async route=>{await new Promise(resolve=>setTimeout(resolve,2500));await route.continue();});
  await page.goto(base);await page.locator('.sangre-startup img').evaluate(img=>img.decode());
  assert(await page.locator('.sangre-startup').isVisible());await page.screenshot({path:path.join(dir,'loading-poster.png')});
  await page.locator('html.sangre-ready.is-ready').waitFor({timeout:60000});await page.waitForTimeout(1000);
  assert.equal(requests.filter(u=>u.endsWith('/sangre-display.glb')).length,1,'Preload and GLTF loader must reuse one model transfer');
  assert(await page.locator('.sangre-startup').evaluate(el=>getComputedStyle(el).visibility==='hidden'));
  await page.evaluate(()=>{const b=window.__sangre.bridge;b.ScrollController.isIdleScrollAllowed=false;b.Scroll.scrollTo(.81*b.Scroll.limit,{immediate:true,force:true});});
  await page.waitForFunction(()=>Math.abs(window.__sangre.bridge.gl.world.activeScenes.current.sangre?.progress-.81)<.003);
  await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.locator('.static-project').waitFor();assert.deepEqual(errors,[]);
  await page.waitForFunction(()=>!document.querySelector('.sangre-callouts'));
  await page.screenshot({path:path.join(dir,'context-lost.png')});
  await page.getByRole('button',{name:'Retry 3D preview'}).click();await page.locator('html.sangre-ready.is-ready').waitFor({timeout:60000});
  assert.equal(await page.locator('.static-project').count(),0);
  await page.locator('#menu-toggle').click();await page.locator('.nav__link[href="/specs"]').click();await page.waitForURL(base+'/specs');await page.locator('main[data-page="specs"]').waitFor();await page.waitForTimeout(4500);
  await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.locator('.static-authored').waitFor();assert.match(await page.locator('.static-authored').innerText(),/£399/,'Fallback must preserve the current route after client navigation');
  await page.screenshot({path:path.join(dir,'navigated-specs-context-lost.png'),fullPage:true});
  records.push({name:'mobile',mode:'context-lost-retry-and-navigated-route',errors,requests});await page.close();
  await fs.writeFile(path.join(dir,'results.json'),JSON.stringify(records,null,2));
  console.log('PASS static routes, loading poster, one GLB transfer, context loss and reload recovery');
} finally {await browser.close();}

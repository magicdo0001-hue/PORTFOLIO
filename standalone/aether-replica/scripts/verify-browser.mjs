import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const out = process.env.QA_DIR || path.join(root, 'qa');
const compare = process.argv.includes('--compare');
const local = process.env.LOCAL_URL || 'http://localhost:4190';
const targets = compare ? [['reference','https://www.aether1.ai'], ['implementation',local]] : [['implementation',local]];
const all = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const styles = async page => page.locator('h1,h2,h3,.nav__header,.ae__btn,.indicator-w,.preorder__cta,.specs__cta').evaluateAll(elements => elements.filter(e => {
  const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden';
}).map(e => {const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {selector:e.className,text:e.textContent.trim().replace(/\s+/g,' '),font:c.fontFamily,size:c.fontSize,weight:c.fontWeight,line:c.lineHeight,color:c.color,width:r.width,height:r.height,left:r.left,top:r.top};}));
try {
 for (const [kind, base] of targets) {
  const dir = path.join(out,kind);await fs.mkdir(dir,{recursive:true});
  for (const [device, viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]) {
   const sangre=kind==='implementation';
   if (kind === 'reference' && process.argv.includes('--resume') && await fs.stat(path.join(dir, `${device}-results.json`)).then(() => true, () => false)) { all.push(JSON.parse(await fs.readFile(path.join(dir, `${device}-results.json`), 'utf8')));console.log('REUSE',kind,device);continue; }
   const page = await browser.newPage({viewport,deviceScaleFactor:1});
   await page.addInitScript(() => { let seed=14817;Math.random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}; });
   const record={kind,device,viewport,states:[],errors:[],external:[],failed:[],assertions:[]};
   page.on('pageerror',e=>record.errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')record.errors.push(m.text());});
   page.on('response',r=>{if(r.status()>=400)record.failed.push({url:r.url(),status:r.status()});if(/^https?:/.test(r.url())&&!r.url().startsWith(base))record.external.push(r.url());});
   const snap = async name => {await page.screenshot({path:path.join(dir,`${device}-${name}.png`)});record.states.push({name,url:page.url(),y:await page.evaluate(()=>scrollY),height:await page.evaluate(()=>document.documentElement.scrollHeight),styles:await styles(page)});};
   const check = (condition,message) => {assert(condition,`${kind}/${device}: ${message}`);record.assertions.push(message);};
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('html.is-ready').waitFor({timeout:60000});await page.waitForTimeout(4000);await snap('home');
   check(await page.locator('canvas').count()===1,'WebGL canvas loaded');
   check((await page.locator('h1').first().innerText()).replace(/\s/g,'')===(sangre?'Health,infocus.':'SoundWithoutBoundaries'),'Homepage heading');
   if(sangre){await page.locator('html.sangre-ready').waitFor();check(await page.evaluate(()=>!!window.__sangre.bridge.gl.world.activeScenes.current.sangre),'SANGRE installed');check(await page.evaluate(()=>!window.__sangre.bridge.gl.world.activeScenes.current.caseModel.visible),'Homepage earbuds hidden');}
   if(sangre)check(await page.evaluate(()=>{
    const {bridge}=window.__sangre,T=bridge.THREE,s=bridge.gl.world.activeScenes.current.sangre;
    const pixels=s.device.getObjectByName('display-lower-pixels'),n=pixels.geometry.attributes.normal;
    const normal=new T.Vector3(n.getX(0),n.getY(0),n.getZ(0)).transformDirection(pixels.matrixWorld);
    const center=new T.Box3().setFromObject(pixels).getCenter(new T.Vector3());
    return center.z<0&&normal.z<-.6&&normal.y>.6&&normal.dot(s.camera.position.clone().sub(center).normalize())>.6;
   }),'Homepage UI is on the CAD front slope and faces the camera');
   await page.locator('#menu-toggle').click();await page.waitForTimeout(1400);await snap('menu');
   await page.locator('.nav__link[data-anchor="1"]').click();await page.waitForTimeout(4200);await snap('sound');
   for (const [anchor,name] of [['2','craft'],['4','controls'],['5','power']]) {await page.locator('#menu-toggle').click();await page.waitForTimeout(650);await page.locator(`.nav__link[data-anchor="${anchor}"]`).click();await page.waitForTimeout(4200);await snap(name);}
   const limit=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
   for(const [progress,name] of [[.375,'internal'],[.81,'core']]){
    await page.evaluate(y=>window.scrollTo(0,y),limit*progress);await page.waitForTimeout(4200);await snap(name);
    if(sangre&&name==='core')check(await page.evaluate(()=>{
     const {bridge}=window.__sangre,T=bridge.THREE,s=bridge.gl.world.activeScenes.current.sangre;
     const objects=[...s.device.getObjectByName('interior').children,s.display];
     const rects=Object.fromEntries(objects.map(o=>{
      const box=new T.Box3().setFromObject(o),points=[];
      for(const x of[box.min.x,box.max.x])for(const y of[box.min.y,box.max.y])for(const z of[box.min.z,box.max.z]){
       const v=new T.Vector3(x,y,z).project(s.camera);points.push([(v.x+1)*innerWidth/2,(1-v.y)*innerHeight/2]);
      }
      return[o.name,{left:Math.min(...points.map(v=>v[0])),right:Math.max(...points.map(v=>v[0])),top:Math.min(...points.map(v=>v[1])),bottom:Math.max(...points.map(v=>v[1]))}];
     }));
     return Object.values(rects).every(r=>r.left>=8&&r.right<=innerWidth-8&&r.top>=64&&r.bottom<=innerHeight*(innerWidth<768?.76:.99))&&
      ['storage-cover','upper-shell','photometer','lower-shell'].every((name,i)=>rects['internal-'+name].bottom+6<rects['internal-'+['upper-shell','photometer','lower-shell','pads'][i]].top);
    }),'Exploded layers have visible gaps and all parts fit the viewport');
   }
   if(device==='desktop') {await page.locator('.sound-w').click();await page.waitForTimeout(800);check(await page.locator('.sound-w').getAttribute('aria-label')==='Mute audio','Sound enabled');await snap('sound-enabled');await page.locator('.sound-w').click();await page.waitForTimeout(500);check(await page.locator('.sound-w').getAttribute('aria-label')==='Play audio','Sound muted');}
   if(!sangre){
   await page.locator('[data-ai="button"]').click();await page.waitForTimeout(1000);await snap('ask-open');
   await page.locator('[data-ai="question"]').press('Enter');await page.waitForTimeout(500);check(!(await page.locator('html.has-ai-thinking').count()),'Empty question prevented');
   await page.locator('[data-ai="question"]').fill('What materials are used?');await page.locator('[data-ai="question"]').press('Enter');await page.locator('html.has-ai-error').waitFor({timeout:65000});await page.waitForTimeout(800);await snap('ask-error');check((await page.locator('[data-ai="buttonLabel"]').innerText()).includes('Error'),'Unavailable AI error surfaced');
   await page.locator('[data-ai="button"]').click();await page.waitForTimeout(900);check(await page.locator('[data-ai="question"]').isVisible(),'AI retry reopens input');
   await page.mouse.click(20,viewport.height*.6);await page.waitForTimeout(900);
   }
   await page.locator('#menu-toggle').click();await page.waitForTimeout(800);await page.locator('.nav__link[href="/specs"]').click();await page.waitForURL(base+'/specs');await page.locator('main[data-page="specs"]').waitFor();await page.waitForTimeout(4500);await snap('specs-top');
   check((await page.locator('body').innerText()).includes('£399'),'Specs content and price');
   if(sangre)check(await page.evaluate(()=>document.documentElement.dataset.sangrePage==='original'&&!window.__sangre.bridge.gl.world.activeScenes.current.sangre),'Discover content retains original scene');
   const maxY=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
   for(let y=Math.min(viewport.height*.72,maxY),i=1;true;y=Math.min(maxY,y+viewport.height*.72),i++){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(2200);await snap(`specs-${i}`);if(y===maxY)break;}
   await page.locator('.specs__cta').click();await page.waitForURL(base+'/preorder');await page.locator('main[data-page="easter-egg"]').waitFor();await page.waitForTimeout(4000);await snap('preorder');
   check((await page.locator('body').innerText()).includes('not a real product')|| (await page.locator('body').innerText()).includes('feels real'),'Fictional product disclosure');
   check(await page.locator('.preorder__cta').getAttribute('href')==='https://www.itsoffbrand.com/','Original studio CTA');
   check(await page.locator('.preorder__footer-link').count()===7,'All footer links');
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(1000);await snap('preorder-footer');
   await page.locator('.nav__logo-w').filter({visible:true}).first().click();await page.waitForURL(base+'/');await page.waitForTimeout(4500);await snap('home-return');
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(7000);await snap('loop-return');check(await page.evaluate(()=>scrollY)<500,'End of page loops back to homepage');
   if(kind==='implementation'){check(record.external.length===0,'No external runtime asset or analytics requests');check(record.failed.every(r=>r.url.endsWith('/api/agent')),'No failed local asset requests');check(record.errors.every(e=>/503|Submission failed|HTTP 503|original private AI/.test(e)),'No unexpected browser errors');}
   await fs.writeFile(path.join(dir,`${device}-results.json`),JSON.stringify(record,null,2));all.push(record);
   console.log('PASS',kind,device,record.states.length,'states',record.assertions.length,'assertions');await page.close();
  }
 }
 await fs.writeFile(path.join(out,'results.json'),JSON.stringify(all,null,2));
 console.log('All checked',all.reduce((n,x)=>n+x.states.length,0),'states');
} finally { await browser.close(); }

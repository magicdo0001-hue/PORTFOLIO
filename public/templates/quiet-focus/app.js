const defaults = {
  brand: 'FORM / FOCUS', discipline: '工业设计 × 数字体验', headline1: '让专注，', headline2: '有形可循。',
  intro1: '一份关于效率、秩序与日常物件的设计探索。', intro2: '从数字体验到实体触感，让复杂回归简单。',
  byline: '独立设计 · 2026', caption: '专注，从一个转动开始。',
  projects: [
    {code:'FOCUS TIMER',title:'把时间，握在手里',category:'工业设计 / 交互原型',type:'physical',image:'assets/focus-timer.webp',alt:'银色铝合金专注计时器，圆形深灰表盘搭配橙色按键',problem:'在开始专注之前，我们往往已经被屏幕上的消息打断。如何让进入专注成为一个简单、明确的动作？',approach:'以旋转设定时间，以单次按压开始。将时间进度转化为环形光带，用触感与可见反馈建立操作信心。',outcome:'概念方案与外观表达。下一步通过实体原型，验证旋钮阻尼、读数角度和桌面使用体验。'},
    {code:'FLOW APP',title:'给每一天，一点秩序',category:'数字产品 / 用户体验',type:'digital',image:'assets/flow-app.webp',alt:'深灰石座上的手机，屏幕显示橙色圆环的专注计时界面',problem:'任务越记越多，真正重要的事情却容易被淹没。开始行动之前，不应该先整理一套复杂的系统。',approach:'围绕「选一件事、进入专注、回看进展」组织体验。收起低频选项，让当下的任务与时间占据视觉中心。',outcome:'交互方向与界面概念。可在此替换为你的流程图、可用性观察和经过验证的迭代结果。'},
    {code:'ARC LIGHT',title:'一束光的恰好分寸',category:'产品设计 / CMF',type:'physical',image:'assets/arc-light.webp',alt:'鼠尾草灰色金属悬臂台灯，在浅色桌面投下柔和暖白光',problem:'桌面的工具应当帮助注意力停留，而不是制造更多视觉噪声。怎样让照明自然融入工作空间？',approach:'用一条连续的弧线连接底座与灯头，缩减外露结构。雾面表面控制反光，细长光源明确照亮工作区域。',outcome:'造型与材质概念。下一步验证光照范围、眩光控制与结构稳定性，再收敛最终的尺寸与工艺。'}
  ]
};
const $ = (selector, root=document) => root.querySelector(selector);
const storageKey = 'form-focus-portfolio-v1';
const embedded = JSON.parse($('#portfolio-data').textContent);
let data = structuredClone(defaults), draft, filter = 'all', toastTimer;
const validImage = value => typeof value === 'string' && (Object.values(defaults.projects).some(p => p.image === value) || /^data:image\/(png|jpeg|webp|avif);base64,[A-Za-z0-9+/=]+$/.test(value));
function validData(value) {
  return value && Object.keys(defaults).filter(k => k !== 'projects').every(k => typeof value[k] === 'string' && value[k].length <= 200)
    && Array.isArray(value.projects) && value.projects.length === 3 && value.projects.every(p => p && ['code','title','category','alt','problem','approach','outcome'].every(k => typeof p[k] === 'string' && p[k].length <= 2000) && ['physical','digital'].includes(p.type) && validImage(p.image));
}
// Exported copies use their embedded content; browser drafts stay local to the original template.
try { const saved = embedded || JSON.parse(localStorage.getItem(storageKey)); if (validData(saved)) data = saved; } catch { /* Storage may be disabled; the template still works. */ }
function notify(message) { const el=$('#toast'); el.textContent=message; el.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.hidden=true,4000); }
function textElement(tag, value, className) { const el=document.createElement(tag); el.textContent=value; if(className) el.className=className; return el; }
function render() {
  document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===filter)));
  document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=data[el.dataset.copy]);
  document.title=`${data.brand} — 工业设计作品集`;
  $('#hero-image').src=data.projects[0].image; $('#hero-image').alt=data.projects[0].alt;
  $('#hero-caption').textContent=`01 / ${data.projects[0].code}`;
  const grid=$('#project-grid'); grid.replaceChildren(); grid.classList.toggle('filtered',filter!=='all');
  data.projects.forEach((project,index)=>{
    if(filter!=='all' && project.type!==filter) return;
    const card=document.createElement('button'); card.type='button'; card.className='project'; card.setAttribute('aria-label',`查看项目：${project.title}`);
    card.innerHTML='<span class="project-image"><img width="800" height="600" loading="lazy"><span class="project-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></svg></span></span>';
    $('img',card).src=project.image; $('img',card).alt=project.alt;
    card.append(textElement('span',`${String(index+1).padStart(2,'0')} — ${project.code}`,'project-code'),textElement('h3',project.title,'project-title'),textElement('span',project.category,'project-category'));
    card.addEventListener('click',()=>openProject(index)); grid.append(card);
  });
  $('#filter-status').textContent=`显示 ${grid.children.length} 个项目`;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter; document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button))); render();}));
function openProject(index) {
  const project=data.projects[index], content=$('#detail-content'); content.replaceChildren();
  $('#detail-label').textContent=`0${index+1} / ${project.code}`;
  const img=document.createElement('img'); img.className='detail-image'; img.src=project.image; img.alt=project.alt;
  const title=textElement('h2',project.title,'detail-heading'); title.id='detail-title';
  const steps=document.createElement('div'); steps.className='detail-steps';
  [['problem','01 / 问题'],['approach','02 / 设计回应'],['outcome','03 / 验证与下一步']].forEach(([key,label])=>{const section=document.createElement('section'); section.append(textElement('h3',label),textElement('p',project[key])); steps.append(section);});
  content.append(img,title,textElement('p',project.category,'detail-meta'),steps,textElement('p','模板中的项目为概念示例，替换为真实项目后请补充相应验证依据。','concept-note'));
  $('#detail-dialog').showModal();
}
document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=>{
  const content=$('#info-content'); content.replaceChildren(); const title=textElement('h2',button.dataset.info==='method'?'从日常出发，回到使用。':'好的设计，让注意力回归。'); title.id='info-title'; content.append(title);
  if(button.dataset.info==='method') {
    [['01 / 观察','从实际使用场景出发，记录困扰、习惯与环境限制。先明确问题，再决定做什么。'],['02 / 推敲','在草图、界面与实体原型之间反复切换。让形态、材质和交互共同回应同一个问题。'],['03 / 验证','把方案交回真实场景，观察它是否更容易理解、更自然地被使用。用证据推动下一次修改。']].forEach(([heading,copy])=>{const section=document.createElement('section');section.className='method-item';section.append(textElement('h3',heading),textElement('p',copy));content.append(section);});
  } else content.append(textElement('p','FORM / FOCUS 是一份连接工业设计与数字体验的作品集模板。以实体产品的触感、数字界面的秩序和日常环境的尺度，呈现一条完整的设计思路。\n\n点击「编辑模板」即可替换封面文案、项目介绍与图片。你也可以导出包含图片的完整网页，独立打开或上传至自己的站点。\n\n当前展示均为概念示例，不代表已量产产品或经过验证的研究成果。','about-copy'));
  $('#info-dialog').showModal();
}));
const generalFields=[['brand','作品集名称'],['discipline','设计领域'],['headline1','封面标题 · 第一行'],['headline2','封面标题 · 第二行'],['intro1','简介 · 第一行'],['intro2','简介 · 第二行'],['byline','署名 / 年份'],['caption','封面图注']];
function field(key,label,value,container,change,multiline=false) {
  const wrap=document.createElement('label');wrap.className=`field${multiline?' wide':''}`;wrap.append(textElement('span',label));
  const input=document.createElement(multiline?'textarea':'input');input.name=key;input.value=value;input.maxLength=multiline?2000:200;input.required=true;
  input.addEventListener('input',()=>change(input.value));wrap.append(input);container.append(wrap);
}
function showEditor() {
  draft=structuredClone(data); $('#editor-status').textContent=''; $('#general-fields').replaceChildren(); $('#project-fields').replaceChildren();
  generalFields.forEach(([key,label])=>field(key,label,draft[key],$('#general-fields'),value=>draft[key]=value));
  draft.projects.forEach((project,index)=>{
    const set=document.createElement('fieldset'); set.append(textElement('legend',`0${index+1} / ${project.code}`)); const grid=document.createElement('div');grid.className='field-grid';set.append(grid);
    [['code','项目名称'],['title','项目标题'],['category','项目领域'],['alt','图片描述']].forEach(([key,label])=>field(`project-${index}-${key}`,label,project[key],grid,value=>project[key]=value));
    const imageWrap=document.createElement('div');imageWrap.className='image-field';const preview=document.createElement('img');preview.src=project.image;preview.alt='当前项目图片';const label=document.createElement('label');label.className='field';label.append(textElement('span','替换项目图片'));
    const input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp,image/avif';input.name=`project-${index}-image`;
    input.addEventListener('change',async()=>{
      const file=input.files[0];if(!file)return;
      if(file.size>4*1024*1024 || !['image/png','image/jpeg','image/webp','image/avif'].includes(file.type)){input.value='';$('#editor-status').textContent='请选择 4 MB 以内的 PNG、JPG、WebP 或 AVIF 图片。';return;}
      input.disabled=true;
      try { const image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});const check=new Image();check.src=image;await check.decode();project.image=image;preview.src=image;$('#editor-status').textContent='图片已替换，保存后生效。'; }
      catch { $('#editor-status').textContent='这张图片无法读取，请换一个文件。';input.value=''; } finally {input.disabled=false;}
    });
    label.append(input,textElement('small','PNG / JPG / WebP / AVIF · 单张不超过 4 MB'));imageWrap.append(preview,label);grid.append(imageWrap);
    [['problem','问题与背景'],['approach','设计回应'],['outcome','验证与下一步']].forEach(([key,label])=>field(`project-${index}-${key}`,label,project[key],grid,value=>project[key]=value,true));$('#project-fields').append(set);
  });
  if(!$('#editor').open) $('#editor').showModal();
}
$('#edit-button').addEventListener('click',showEditor);
$('#close-editor').addEventListener('click',()=>$('#editor').close());
$('#editor-form').addEventListener('submit',event=>{
  event.preventDefault();if($('#editor-form input:disabled')){$('#editor-status').textContent='请等待图片读取完成。';return;}
  if(!validData(draft)){$('#editor-status').textContent='请检查所有文字与图片后重试。';return;}
  data=structuredClone(draft);render();
  try { if(embedded) $('#portfolio-data').textContent=JSON.stringify(data).replace(/</g,'\\u003c'); else localStorage.setItem(storageKey,JSON.stringify(data)); $('#editor').close();notify(embedded?'修改已应用，请导出网页以保存到文件。':'修改已保存到当前浏览器。'); }
  catch { $('#editor-status').textContent='修改已应用，但浏览器存储空间不足或不可用。请点击「导出完整网页」保留修改。'; }
});
$('#reset-button').addEventListener('click',()=>{if(confirm(embedded?'恢复为此文件导出时的内容？当前修改将被替换。':'恢复默认示例？当前已保存的文字与图片将被替换。')){data=structuredClone(embedded||defaults);try{if(!embedded)localStorage.removeItem(storageKey);}catch{}render();showEditor();}});
$('#export-button').addEventListener('click',async()=>{
  if(!$('#editor-form').reportValidity())return;
  if($('#editor-form input:disabled')){$('#editor-status').textContent='请等待图片读取完成。';return;}
  const button=$('#export-button');button.disabled=true;$('#editor-status').textContent='正在打包文字与图片…';
  try {
    const exported=structuredClone(draft);
    await Promise.all(exported.projects.map(async project=>{if(project.image.startsWith('data:'))return;const response=await fetch(project.image);if(!response.ok)throw Error('图片加载失败');const blob=new Blob([await response.arrayBuffer()],{type:'image/webp'});project.image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});}));
    const getSource=async(selector)=>{const el=$(selector);if(!el.href&&!el.src)return el.textContent;const response=await fetch(el.href||el.src);if(!response.ok)throw Error('模板文件加载失败');return response.text();};
    const [css,js]=await Promise.all([getSource('link[rel="stylesheet"],style[data-template]'),getSource('script[src="app.js"],script[data-template]')]);
    const clone=document.documentElement.cloneNode(true);const sheet=$('link[rel="stylesheet"],style[data-template]',clone);const style=document.createElement('style');style.dataset.template='';style.textContent=css;sheet.replaceWith(style);
    const oldScript=$('script[src="app.js"],script[data-template]',clone);const script=document.createElement('script');script.dataset.template='';script.textContent=js.replace(/<\/script/gi,'<\\/script');oldScript.replaceWith(script);
    $('#portfolio-data',clone).textContent=JSON.stringify(exported).replace(/</g,'\\u003c');clone.querySelectorAll('dialog').forEach(d=>d.removeAttribute('open'));$('#toast',clone).hidden=true;
    clone.querySelectorAll('img').forEach(img=>{const index=data.projects.findIndex(p=>p.image===img.getAttribute('src'));if(index>=0)img.src=exported.projects[index].image;});
    $('#hero-image',clone).src=exported.projects[0].image;$('#general-fields',clone).replaceChildren();$('#project-fields',clone).replaceChildren();$('#detail-content',clone).replaceChildren();$('#info-content',clone).replaceChildren();$('#editor-status',clone).textContent='';$('#export-button',clone).disabled=false;
    const url=URL.createObjectURL(new Blob(['<!doctype html>\n'+clone.outerHTML],{type:'text/html;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='form-focus-portfolio.html';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('#editor-status').textContent='已导出完整网页，文字和图片均已包含，可离线打开。';
  } catch {$('#editor-status').textContent='导出未完成，请确认所有图片已加载后重试。当前修改仍保留在编辑器中。';} finally {button.disabled=false;}
});
render();

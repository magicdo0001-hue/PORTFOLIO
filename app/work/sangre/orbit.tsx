"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SangreScene } from "./orbit-scene";
import { chapterStops, storyAt, textAt } from "./story-timeline.mjs";
import "./orbit.css";

const partLabels = [
  [["折叠显示屏", "FOLDING DISPLAY"], ["透明收纳罩", "CLEAR STORAGE"]],
  [["细腻哑光 · PP", "SATIN FINISH / PP"], ["透亮边缘 · PET", "CLEAR EDGES / PET"]],
  [["完整阅读视野", "FULL-HEIGHT VIEW"], ["柔性折叠区域", "FLEXIBLE DISPLAY"]],
  [["移开收纳上盖", "LIFT TO ACCESS"], ["三孔测试条", "THREE-WELL STRIP"]],
  [["铜线圈", "COPPER WINDING"], ["壳体分层", "LAYERED ENCLOSURE"]],
];
const calloutPositions=[[[.48,.21],[.84,.18]],[[.45,.20],[.84,.145]],[[.79,.18],[.88,.29]],[[.47,.20],[.52,.77]],[[.47,.46],[.84,.18]]];
const chapters = [
  { label: ["整体", "Form"], title: ["让关怀，\n回到日常。", "Care belongs\nat home."], body: ["一台设备，连接检测、读取与收纳。为家庭健康，留出一个自然的位置。", "Testing, reading and storage, brought together. A considered place for everyday health."], detail: ["一体之间，各有位置", "Together, with a place for everything"], note: ["倾斜屏幕与透明收纳并置。158 × 100 × 59 mm，让桌面上的每一处空间都有意义。", "An angled display beside clear storage. A considered 158 × 100 × 59 mm footprint."], tag: "A QUIETER KIND OF CARE" },
  { label: ["材质", "Material"], title: ["温和的触感。\n清晰的边界。", "Soft to touch.\nClear by design."], body: ["暖白壳体、深色玻璃与透明上盖。通过质感的差异，自然区分握持、读取和收纳。", "Warm ivory, dark glass and a clear cover. Material contrast gives every surface its own role."], detail: ["暖白 PP，与透明 PET", "Warm ivory PP. Clear PET."], note: ["漫反射的暖白外壳，搭配透亮的收纳上盖。柔和圆角与细分件缝保留清楚的轮廓。", "Satin ivory meets clear storage. Soft radii and fine seams preserve a precise silhouette."], tag: "COLOUR / MATERIAL / FINISH" },
  { label: ["展开", "Unfold"], title: ["轻轻展开，\n看见全貌。", "Unfold.\nThe full picture."], body: ["倾斜短屏展开为完整长屏。从当下读数，到一段时间的变化，让信息随着动作展开。", "A compact angled screen unfolds into a full dashboard, from a quick reading to a longer view."], detail: ["同一块屏幕，两种阅读状态", "One display. Two reading states."], note: ["连续屏面沿柔性区域弯折，展开后呈现完整竖屏。屏幕内容为界面设计示意。", "A continuous display curves through the fold and opens into a full-height view. The dashboard is an illustrative interface."], tag: "INTERACTION / FOLDING DISPLAY" },
  { label: ["操作", "Routine"], title: ["顺着动作，\n有序发生。", "A natural\nsequence of care."], body: ["取下上盖，移出测试条，沿插槽定位。将准备与操作，整理成一条清楚的路径。", "Lift the cover, take the strip and align it with the slot. A clear path from preparation to placement."], detail: ["三孔测试条，与专属收纳", "Three wells. Dedicated storage."], note: ["独立重建测试条孔位、黑色底托与活动件。动画展示取用和定位关系。", "Reconstructed wells, carrier and sliding detail. Motion illustrates access and positioning."], tag: "WORKFLOW / TEST STRIP" },
  { label: ["结构", "Inside"], title: ["向内一层，\n理解设计。", "Look inside.\nDesign, revealed."], body: ["外壳逐层抬起，支撑、线圈与电路空间显露。让不可见的结构，也成为设计的叙述。", "The shell lifts away to reveal supports, coil and circuit space. The unseen becomes part of the story."], detail: ["由外到内，层次清晰", "An assembly, revealed in layers"], note: ["根据工图与结构渲染重建。电子元件和拆解路径用于设计说明，不代表已验证电路。", "Rebuilt from drawings and structural renders. Electronics and assembly motion are design illustrations."], tag: "CONSTRUCTION / LAYER BY LAYER" },
] as const;

export default function SangreOrbit({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const language=locale==="en"?1:0, t=(zh:string,en:string)=>language?en:zh;
  const section=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),host=useRef<HTMLDivElement>(null);
  const slider=useRef<HTMLInputElement>(null),reference=useRef<HTMLDialogElement>(null),detail=useRef<HTMLElement>(null);
  const leader=useRef<SVGPolylineElement>(null),dot=useRef<SVGCircleElement>(null);
  const copies=useRef<(HTMLDivElement|null)[]>([]),calloutLabels=useRef<(HTMLSpanElement|null)[]>([]),calloutLines=useRef<(SVGPolylineElement|null)[]>([]);
  const scene=useRef<SangreScene|null>(null),progress=useRef(0),active=useRef(0),motionRef=useRef(true);
  const [chapter,setChapter]=useState(0),[motion,setMotion]=useState(true),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[reload,setReload]=useState(0);
  const current=chapters[chapter];
  useEffect(()=>{
    const preference=matchMedia("(prefers-reduced-motion: reduce)"),update=()=>setMotion(!preference.matches);
    update();preference.addEventListener("change",update);return()=>preference.removeEventListener("change",update);
  },[]);
  useEffect(()=>{motionRef.current=motion;scene.current?.motion(motion);},[motion]);
  useEffect(()=>{
    let cancelled=false;
    void import("./orbit-scene").then(({createSangreScene})=>{
      if(cancelled||!host.current)return;
      try {
        scene.current=createSangreScene(host.current,{
          ready:()=>{if(!cancelled){setReady(true);setFailed(false);}},
          error:()=>{if(!cancelled){setReady(false);setFailed(true);}},
          frame:(p,intro)=>{
            const next=storyAt(p).chapter;
            if(next!==active.current){active.current=next;setChapter(next);}
            copies.current.forEach((copy,index)=>{
              if(!copy)return;const v=textAt(p,index,intro),still=!motionRef.current;
              copy.style.visibility=(still?index===next:v.visible)?"visible":"hidden";
              copy.style.setProperty("--line-a",String(still?1:v.line1));copy.style.setProperty("--line-b",String(still?1:v.line2));
              copy.style.setProperty("--body",String(still?1:v.body));copy.style.setProperty("--out",String(still?0:v.leave));
            });
            stage.current?.style.setProperty("--note",String(motionRef.current?textAt(p,next,intro).note:1));
          },
          callouts:(points)=>{
            if(!host.current)return;const w=host.current.clientWidth,h=host.current.clientHeight;
            const positions=calloutPositions[active.current];
            points.forEach(([x,y],index)=>{const label=calloutLabels.current[index],line=calloutLines.current[index];if(!label||!line)return;
              const [px,py]=positions[index],lx=Math.min(w-170,w*px),ly=h*py;
              label.style.transform=`translate3d(${lx}px,${ly}px,0)`;
              line.setAttribute("points",`${x},${y} ${lx+20},${ly+22} ${lx},${ly+22}`);
            });
          },
          marker:(x,y)=>{
            if(!stage.current||!host.current||!detail.current||!leader.current||!dot.current)return;
            const s=stage.current.getBoundingClientRect(),h=host.current.getBoundingClientRect(),d=detail.current.getBoundingClientRect();
            const px=x+h.left-s.left,py=y+h.top-s.top,ex=d.left-s.left,ey=d.top-s.top+9;
            leader.current.setAttribute("points",`${px},${py} ${ex-30},${ey} ${ex},${ey}`);
            dot.current.setAttribute("cx",String(px));dot.current.setAttribute("cy",String(py));
          }
        });scene.current.motion(motionRef.current);scene.current.progress(progress.current);
      } catch {setFailed(true);}
    }).catch(()=>{if(!cancelled)setFailed(true);});
    return()=>{cancelled=true;scene.current?.dispose();scene.current=null;};
  },[reload]);
  useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;if(!section.current||!stage.current)return;
      const rect=section.current.getBoundingClientRect(),p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-stage.current.offsetHeight)));
      progress.current=p;scene.current?.progress(p);stage.current.style.setProperty("--story-progress",`${p*100}%`);
      if(slider.current)slider.current.value=String(Math.round(p*1000));
      const next=storyAt(p).chapter;if(!scene.current&&next!==active.current){active.current=next;setChapter(next);}
    };
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};const resize=new ResizeObserver(scroll);if(section.current)resize.observe(section.current);
    window.addEventListener("scroll",scroll,{passive:true});window.addEventListener("resize",scroll);update();
    return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener("scroll",scroll);window.removeEventListener("resize",scroll);};
  },[]);
  function go(p:number,smooth=true){if(!section.current||!stage.current)return;const rect=section.current.getBoundingClientRect();window.scrollTo({top:window.scrollY+rect.top+(rect.height-stage.current.offsetHeight)*p,behavior:smooth&&motion?"smooth":"instant"});}
  return <section ref={section} className="sg-orbit" aria-label={t("SANGRE 产品展示","SANGRE product story")}>
    <div ref={stage} className="sg-stage" data-chapter={chapter} data-motion={motion?"scroll":"still"} data-ready={ready&&!failed} data-failed={failed}>
      <header className="sg-header">
        <Link href={language?"/en?archive=X1-01":"/?archive=X1-01"} className="sg-back"><span aria-hidden="true">↖</span>{t("返回档案","Back to archive")}</Link>
        <h1>SANGRE<span> / HOME HEALTH</span></h1>
        <div><a className="sg-skip" href="#story">{t("研究与原型","Research & prototypes")} <span aria-hidden="true">↘</span></a><Link href={language?"/work/sangre":"/en/work/sangre"} hrefLang={language?"zh-CN":"en"} aria-label={t("Switch to English","切换至中文")}>{language?"中文":"EN"}</Link></div>
      </header>
      <div ref={host} className="sg-visual" role="img" aria-label={t("SANGRE 三维产品：暖白楔形机身、黑色折叠屏与透明收纳罩","SANGRE in 3D: an ivory wedge enclosure, black folding screen and clear storage cover")} />
      {failed&&<img className="sg-fallback" src="/sangre/material-reference.jpg" alt={t("SANGRE 原始设计渲染","Original SANGRE design render")} />}
      {chapters.map((item,index)=><div ref={el=>{copies.current[index]=el;}} className="sg-copy" data-copy={index} key={item.tag} aria-hidden={chapter!==index}>
        <p className="sg-eyebrow"><span>0{index+1} / 05</span>{item.tag}</p>
        <h2 aria-label={item.title[language].replace("\n"," ")}>{item.title[language].split("\n").map((line,i)=><span className="sg-title-line" aria-hidden="true" key={i}><span>{line}</span></span>)}</h2>
        <p className="sg-intro">{item.body[language]}</p>
      </div>)}
      <p className="sg-sr-only" aria-live="polite">{current.title[language].replace("\n"," ")}</p>
      <div className="sg-callouts" aria-hidden="true">
        <svg>{[0,1].map(i=><polyline key={i} ref={el=>{calloutLines.current[i]=el;}} pathLength="1" fill="none"/>)}</svg>
        {[0,1].map(i=><span key={i} ref={el=>{calloutLabels.current[i]=el;}}>{partLabels[chapter][i][language]}</span>)}
      </div>
      <svg className="sg-leader" aria-hidden="true"><polyline ref={leader} fill="none"/><circle ref={dot} r="3"/></svg>
      <aside ref={detail} className="sg-detail"><p>{t("设计观察","DESIGN NOTE")} / 0{chapter+1}</p><h3>{current.detail[language]}</h3><p>{current.note[language]}</p></aside>
      <div className="sg-bottom">
        <div className="sg-utility"><span className="sg-scroll-cue">{motion?t("滚动探索","SCROLL TO EXPLORE"):t("静态阅读 · 按章节切换","STILL VIEWS · CHAPTER BY CHAPTER")}<span aria-hidden="true">↓</span></span><div><button onClick={()=>setMotion(v=>!v)} aria-pressed={!motion}>{motion?t("减少动态","Reduce motion"):t("启用动画","Enable motion")}</button><button onClick={()=>reference.current?.showModal()}>{t("渲染参考","Design references")}</button></div></div>
        <label className="sg-progress"><span className="sg-sr-only">{t("展示进度","Story progress")}</span><input ref={slider} type="range" min="0" max="1000" step="1" defaultValue="0" onChange={e=>go(Number(e.target.value)/1000,false)}/></label>
        <nav className="sg-chapters" aria-label={t("产品展示章节","Product story chapters")}>
          {chapters.map((item,index)=><button key={item.tag} aria-current={chapter===index?"step":undefined} onClick={()=>go(chapterStops[index])}><span>0{index+1}</span>{item.label[language]}<i aria-hidden="true"/></button>)}
          <a href="#story">{t("设计过程","Design process")}<span aria-hidden="true">↘</span></a>
        </nav>
      </div>
      {(!ready||failed)&&<div className="sg-status" role="status">{failed?t("三维展示暂不可用，已显示原始渲染。","3D is unavailable. Showing the original render."):t("正在准备三维展示…","Preparing the product view…")}{failed&&<button onClick={()=>{setFailed(false);setReady(false);setReload(v=>v+1);}}>{t("重试","Retry")}</button>}</div>}
      <dialog ref={reference} className="sg-reference" aria-label={t("原始渲染参考","Original design references")} onClick={e=>{if(e.target===e.currentTarget)reference.current?.close();}}>
        <button autoFocus onClick={()=>reference.current?.close()}>{t("关闭","Close")} ×</button>
        <img src="/sangre/material-reference.jpg" alt={t("SANGRE 外观与展开状态原始渲染","Original SANGRE appearance and unfolded display render")} loading="lazy"/>
        <img src="/sangre/structure-reference.jpg" alt={t("SANGRE 原始结构渲染","Original SANGRE structural render")} loading="lazy"/>
        <p>{t("原始产品与结构渲染 · 材质与形态参考","ORIGINAL PRODUCT & STRUCTURAL RENDERS")}</p>
      </dialog>
    </div>
  </section>;
}

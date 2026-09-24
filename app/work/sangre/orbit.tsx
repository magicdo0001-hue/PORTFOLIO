"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SangreScene } from "./orbit-scene";
import "./orbit.css";

const chapters = [
  { label: ["整体", "Overview"], title: ["把日常健康，放回生活。", "Care, at home."], intro: ["一台围绕检测、读取与收纳设计的家庭健康设备。", "A home-health concept bringing testing, reading and storage into one considered object."], left: ["一个连续的流程", "One connected routine"], leftBody: ["从准备耗材，到读取结果。让每个动作都有自己的位置。", "From preparing consumables to reading results, each action has a place."], right: ["融入居家环境", "Made for the everyday"], rightBody: ["暖白色机身、柔和转角与透明收纳，让设备自然留在日常视线里。", "Warm ivory, soft edges and transparent storage bring a quieter presence to the home."] },
  { label: ["读取", "Read"], title: ["让信息，靠近视线。", "Clarity, within sight."], intro: ["倾斜屏幕承接操作与结果，界面按指标组织信息。", "An angled display connects the physical routine with a clearly organised dashboard."], left: ["倾斜式显示面", "An angled display"], leftBody: ["以自然的桌面视角读取信息，减少操作与查看之间的切换。", "A tabletop viewing angle keeps information close to the physical interaction."], right: ["清晰的信息分组", "Information in groups"], rightBody: ["以不同色彩区分指标与趋势。屏幕展示为设计界面示意。", "Colour separates metrics and trends. The screen shows an illustrative interface."] },
  { label: ["收纳", "Store"], title: ["下一次使用，也已准备好。", "Ready for the next routine."], intro: ["让采样组件与耗材有序归位，完整考虑使用前后。", "A place for sampling tools and consumables, before and after use."], left: ["透明收纳区域", "Visible storage"], leftBody: ["透过上盖看见内部空间，把整理与取用纳入同一套体验。", "A transparent cover makes the storage space visible and access more deliberate."], right: ["紧凑的桌面布局", "A compact arrangement"], rightBody: ["显示与收纳并排组织，减少零散物件对桌面空间的占用。", "Display and storage sit alongside one another to keep the routine together."] },
  { label: ["结构", "Structure"], title: ["打开外壳，看见内部。", "Open the shell. See within."], intro: ["透明外壳抬升，供电、线圈与检测组件在底座上展开。", "The transparent enclosure lifts away to reveal power, coil and sensing components on the base."], left: ["透明外壳 · 整体抬升", "Enclosure · lifted as one"], leftBody: ["沿装配方向分离外壳，呈现内部支撑、空间分配与底座的关系。", "Separating the enclosure reveals the supports, internal spaces and their relationship to the base."], right: ["供电与检测 · 分区布局", "Power & sensing · zoned layout"], rightBody: ["电池、线圈与主板分区排列。内部电子组件按结构渲染图作展示示意。", "Battery, coil and boards occupy distinct zones. Electronic components are illustrated from the structural render."] },
] as const;

export default function SangreOrbit({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const language = locale === "en" ? 1 : 0;
  const t = (zh: string, en: string) => language ? en : zh;
  const section = useRef<HTMLElement>(null), viewport = useRef<HTMLDivElement>(null);
  const api = useRef<SangreScene | null>(null), active = useRef(0);
  const marker0 = useRef<SVGPolylineElement>(null), marker1 = useRef<SVGPolylineElement>(null);
  const dot0 = useRef<SVGCircleElement>(null), dot1 = useRef<SVGCircleElement>(null);
  const [chapter, setChapter] = useState(0), [free, setFree] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const [reference, setReference] = useState(false);
  const current = chapters[chapter];
  useEffect(() => {
    if (!viewport.current) return;
    const host = viewport.current; let cancelled = false; let instance: SangreScene | null = null;
    import("./orbit-scene").then(({ createSangreScene }) => {
      if (cancelled) return;
      instance = createSangreScene(host, {
        ready: () => { if (!cancelled) setStatus("ready"); },
        error: () => { if (!cancelled) setStatus("error"); },
        marker: (index, x, y, visible) => {
          const line = index === 0 ? marker0.current : marker1.current;
          const dot = index === 0 ? dot0.current : dot1.current;
          if (!line || !dot) return;
          const end = index === 0 ? 0 : host.clientWidth;
          const note = section.current?.querySelector(index === 0 ? ".sg-note--left" : ".sg-note--right");
          const endY = note ? note.getBoundingClientRect().top + 45 - host.getBoundingClientRect().top : y - 35;
          line.setAttribute("points", x + "," + y + " " + (x + (index === 0 ? -35 : 35)) + "," + endY + " " + end + "," + endY);
          line.style.opacity = visible ? "1" : "0";
          dot.setAttribute("cx", String(x)); dot.setAttribute("cy", String(y)); dot.style.opacity = visible ? "1" : "0";
        },
      });
      api.current = instance; instance.chapter(active.current);
    }).catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; instance?.dispose(); api.current = null; };
  }, [retry]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      const next = Math.min(3, Math.floor(progress * 4));
      if (next !== active.current) { active.current = next; setChapter(next); setFree(false); setReference(false); api.current?.chapter(next); }
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll); update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); };
  }, []);
  function go(index: number) {
    if (!section.current) return;
    const rect = section.current.getBoundingClientRect();
    const top = window.scrollY + rect.top + (rect.height - window.innerHeight) * (index / 4 + (index ? 0.035 : 0));
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section ref={section} className="sg-orbit" aria-label={t("SANGRE 三维产品讲解", "SANGRE 3D product story")}>
    <div className="sg-stage" data-chapter={chapter} data-reference={reference}>
      <header className="sg-header">
        <Link href={language ? "/en?archive=X1-01" : "/?archive=X1-01"} className="sg-back"><span aria-hidden="true">↖</span> {t("返回档案架", "Back to archive")}</Link>
        <span className="sg-header-name">WENHOU YAN <i>/</i> PRODUCT DESIGN</span>
        <Link href={language ? "/work/sangre" : "/en/work/sangre"} hrefLang={language ? "zh-CN" : "en"} aria-label={t("Switch to English", "切换至中文")}>{language ? "中文" : "EN"}</Link>
      </header>
      <div className="sg-heading"><p>01 — HOME HEALTH CONCEPT</p><h1>SANGRE</h1><div className="sg-project-meta">{t("医疗产品", "Healthcare product")}<span>14 {t("周", "weeks")}</span>{t("主导设计", "Lead designer")}</div></div>
      <div className="sg-summary" key={chapter} aria-live="polite"><span>0{chapter + 1} / 04</span><h2>{current.title[language]}</h2><p>{current.intro[language]}</p></div>
      <div className="sg-ground" aria-hidden="true"><div /><span>SANGRE / DESIGN STUDY</span></div>
      <div className={"sg-visual " + (free ? "sg-visual--free" : "")}>
        {chapter === 3 && reference && <figure className="sg-structure-reference"><img src="/sangre/structure-reference.jpg" alt={t("SANGRE 原始结构渲染图：透明外壳、线圈、电池、主板和底座的分层关系", "Original SANGRE structural render showing enclosure, coil, battery, boards and base")} /><figcaption>{t("原始结构渲染 · 设计参考", "ORIGINAL STRUCTURAL RENDER")}</figcaption></figure>}
        <div ref={viewport} className="sg-canvas" tabIndex={free ? 0 : -1} role="group" aria-label={t("三维产品。自由查看时可拖动或用方向键旋转，Home 重置", "3D product. In explore mode, drag or use arrow keys to rotate; Home resets")} data-status={status} />
        <svg className="sg-leaders" aria-hidden="true"><polyline ref={marker0} /><polyline ref={marker1} /><circle ref={dot0} r="4" /><circle ref={dot1} r="4" /></svg>
        {status !== "ready" && <div className="sg-fallback"><img src="/portfolio/sangre-hero.webp" alt={t("SANGRE 暖白色机身与透明收纳区的渲染图", "SANGRE render with ivory housing and transparent storage")} /><div role="status">{status === "loading" ? t("正在加载三维模型…", "Loading the 3D model…") : t("三维暂不可用，可继续阅读项目。", "3D is unavailable. The project remains readable.")}{status === "error" && <button onClick={() => { setStatus("loading"); setRetry(value => value + 1); }}>{t("重新加载", "Retry")}</button>}</div></div>}
      </div>
      <div className={"sg-annotations " + (free || reference ? "sg-annotations--hidden" : "")} key={"notes-" + chapter}>
        <aside className="sg-note sg-note--left"><span>0{chapter * 2 + 1} / {t("设计观察", "DESIGN NOTE")}</span><h3>{current.left[language]}</h3><p>{current.leftBody[language]}</p></aside>
        <aside className="sg-note sg-note--right"><span>0{chapter * 2 + 2} / {t("设计观察", "DESIGN NOTE")}</span><h3>{current.right[language]}</h3><p>{current.rightBody[language]}</p></aside>
      </div>
      <div className="sg-controls"><span className="sg-live"><i />{t("交互式产品展示", "INTERACTIVE PRODUCT STUDY")}</span><div>{chapter === 3 && <button aria-pressed={reference} onClick={() => { setReference(value => !value); setFree(false); api.current?.explore(false); }}>{reference ? t("返回三维结构", "Back to 3D") : t("对照原始渲染", "View reference")}</button>}<button disabled={status !== "ready" || reference} aria-pressed={free} onClick={() => { const next = !free; setFree(next); api.current?.explore(next); }}>{free ? t("返回讲解", "Back to story") : t("自由查看 ↗", "Explore in 3D ↗")}</button>{free && <button onClick={() => api.current?.reset()}>{t("重置视角", "Reset view")}</button>}</div><span className="sg-hint">{free ? t("拖动或方向键旋转", "DRAG OR USE ARROW KEYS") : t("向下滚动，环绕探索 ↓", "SCROLL TO EXPLORE ↓")}</span></div>
      <nav className="sg-chapters" aria-label={t("三维展示章节", "3D story chapters")}>{chapters.map((item, index) => <button key={index} aria-current={chapter === index ? "step" : undefined} onClick={() => go(index)}><span>0{index + 1}</span>{item.label[language]}<i /></button>)}<a href="#story">{t("研究与原型", "Research & prototypes")} <span>↘</span></a></nav>
    </div>
  </section>;
}

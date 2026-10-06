"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { chapterStops, storyAt } from "./story-timeline.mjs";
import "./orbit.css";

const chapters = [
  { label: ["整体", "Overview"], title: ["把日常健康，\n放回生活。", "Care,\nat home."], body: ["检测、读取与收纳，围绕日常动作设计的一台家庭健康设备。", "Testing, reading and storage. A home-health concept shaped around everyday routines."], detail: ["让设备自然留在生活里", "Made for the everyday"], note: ["暖白机身与透明收纳，让每个物件都有自己的位置。", "Warm ivory and clear storage give every part of the routine a place."], tag: "FORM / EVERYDAY CARE" },
  { label: ["展开", "Unfold"], title: ["展开屏幕，\n看见全貌。", "Unfold.\nSee the whole picture."], body: ["从紧凑的倾斜屏，展开为完整长屏。让信息随着使用动作靠近视线。", "A compact, angled display unfolds into a full-height dashboard, bringing information into view."], detail: ["同一块屏幕，两种阅读状态", "One display. Two reading states."], note: ["折叠状态便于日常读取，展开后容纳完整的指标与趋势。界面为设计示意。", "An angled view for quick reading; a full dashboard for metrics and trends. Illustrative interface."], tag: "INTERACTION / FOLDING DISPLAY" },
  { label: ["操作", "Routine"], title: ["每个动作，\n都有位置。", "A place for\nevery action."], body: ["移开透明上盖，测试条沿预设路径靠近设备，让准备、定位与收纳连成一体。", "The clear cover moves aside. The test strip approaches its position, connecting preparation and storage."], detail: ["从取用，到有序归位", "From access to a considered routine"], note: ["采用实际测试条模型展示接近与定位。动画说明操作关系，不模拟检测过程。", "The supplied test-strip model demonstrates approach and positioning, without simulating a test."], tag: "WORKFLOW / TEST STRIP" },
  { label: ["结构", "Assembly"], title: ["向内一层，\n理解设计。", "Look inside.\nUnderstand the design."], body: ["沿装配方向逐层展开，让外壳、支撑与内部空间的关系清晰可见。", "The assembly separates in layers, revealing how the enclosure, supports and internal spaces fit together."], detail: ["真实装配，清晰分层", "An assembly, revealed in layers"], note: ["上下壳与固定件来自实际 CAD。主板、线圈依照结构图作展示示意。", "Enclosure and fixing parts come from the supplied CAD. Boards and coil are reference-based illustrations."], tag: "CONSTRUCTION / LAYER BY LAYER" },
] as const;

export default function SangreOrbit({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const language = locale === "en" ? 1 : 0;
  const t = (zh: string, en: string) => language ? en : zh;
  const section = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null), slider = useRef<HTMLInputElement>(null);
  const reference = useRef<HTMLDialogElement>(null);
  const desiredTime = useRef(0), active = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [motion, setMotion] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const current = chapters[chapter];

  function seek() {
    const media = video.current;
    if (!media || media.readyState < 2 || media.seeking || !Number.isFinite(media.duration)) return;
    const time = Math.min(media.duration - 1 / 24, desiredTime.current);
    if (Math.abs(media.currentTime - time) > 1 / 48) media.currentTime = time;
  }

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!preference.matches);
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current || !stage.current) return;
      const rect = section.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - stage.current.offsetHeight)));
      const next = storyAt(progress);
      desiredTime.current = next.time;
      stage.current.style.setProperty("--story-progress", `${progress * 100}%`);
      if (slider.current) slider.current.value = String(Math.round(progress * 1000));
      if (next.chapter !== active.current) { active.current = next.chapter; setChapter(next.chapter); }
      if (motion) seek();
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(scroll);
    if (section.current) resize.observe(section.current);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll); update();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); };
  }, [motion]);

  useEffect(() => {
    const media = video.current;
    if (!media || !motion) return;
    const source = matchMedia("(max-width: 760px)").matches ? "/sangre/film/structure-960.mp4" : "/sangre/film/structure-1440.mp4";
    const abort = new AbortController();
    let objectUrl: string | null = null, disposed = false;
    // Reuse the previous player's Range fallback: some hosts return an entire,
    // otherwise unseekable response. One pending seek always lands on the latest scroll.
    void (async () => {
      try {
        const response = await fetch(source, { headers: { Range: "bytes=0-0" }, signal: abort.signal });
        if (!response.ok) throw new Error(`Video response ${response.status}`);
        if (response.status === 206) {
          await response.body?.cancel();
          if (disposed) return;
          media.src = source;
        } else {
          const blob = await response.blob();
          if (disposed) return;
          objectUrl = URL.createObjectURL(blob); media.src = objectUrl;
        }
        media.load();
      } catch {
        if (!disposed && !abort.signal.aborted) { setFailed(true); setReady(false); }
      }
    })();
    const resume = () => { if (!document.hidden) seek(); };
    document.addEventListener("visibilitychange", resume);
    return () => {
      disposed = true; abort.abort(); document.removeEventListener("visibilitychange", resume);
      media.pause(); media.removeAttribute("src"); media.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [motion, reload]);

  function go(progress: number, smooth = true) {
    if (!section.current || !stage.current) return;
    const rect = section.current.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top + (rect.height - stage.current.offsetHeight) * progress,
      behavior: smooth && motion ? "smooth" : "instant" });
  }

  function toggleMotion() { setReady(false); setFailed(false); setMotion(value => !value); }

  return <section ref={section} className="sg-orbit" aria-label={t("SANGRE 产品展示", "SANGRE product story")}>
    <div ref={stage} className="sg-stage" data-chapter={chapter} data-motion={motion ? "scroll" : "still"}>
      <header className="sg-header">
        <Link href={language ? "/en?archive=X1-01" : "/?archive=X1-01"} className="sg-back"><span aria-hidden="true">↖</span>{t("返回档案", "Back to archive")}</Link>
        <h1>SANGRE<span> / HOME HEALTH</span></h1>
        <div><a className="sg-skip" href="#story">{t("研究与原型", "Research & prototypes")} <span aria-hidden="true">↘</span></a><Link href={language ? "/work/sangre" : "/en/work/sangre"} hrefLang={language ? "zh-CN" : "en"} aria-label={t("Switch to English", "切换至中文")}>{language ? "中文" : "EN"}</Link></div>
      </header>

      <div className="sg-visual" data-ready={ready} data-failed={failed}>
        <div className="sg-film-frame">
          <div className="sg-still" role="img" aria-label={current.title[language].replace("\n", " ")} style={{ backgroundPosition: `${chapter % 2 * 100}% ${Math.floor(chapter / 2) * 100}%` }} />
          <video ref={video} preload="auto" playsInline muted tabIndex={-1}
            aria-label={t("随滚动展示折叠屏、测试条与装配结构", "Scroll-controlled folding display, test strip and assembly")}
            onLoadedData={() => { setReady(true); setFailed(false); seek(); }} onCanPlay={seek} onSeeked={seek}
            onError={() => { setFailed(true); setReady(false); }} />
        </div>
      </div>

      <div className="sg-copy" key={`copy-${chapter}`} aria-live="polite">
        <p className="sg-eyebrow"><span>0{chapter + 1} / 04</span>{current.tag}</p>
        <h2>{current.title[language]}</h2>
        <p className="sg-intro">{current.body[language]}</p>
      </div>
      <aside className="sg-detail" key={`detail-${chapter}`}>
        <span className="sg-detail-line" aria-hidden="true" />
        <p>{t("设计观察", "DESIGN NOTE")} / 0{chapter + 1}</p>
        <h3>{current.detail[language]}</h3><p>{current.note[language]}</p>
      </aside>

      <div className="sg-bottom">
        <div className="sg-utility">
          <span className="sg-scroll-cue">{motion ? t("向下滚动，逐层展开", "SCROLL TO REVEAL") : t("静帧阅读 · 滚动切换章节", "STILL FRAMES · SCROLL THROUGH CHAPTERS")}<span aria-hidden="true">↓</span></span>
          <div><button onClick={toggleMotion} aria-pressed={motion === false}>{motion ? t("静帧阅读", "Still frames") : t("启用滚动动画", "Enable motion")}</button><button onClick={() => reference.current?.showModal()}>{t("结构参考", "View reference")}</button></div>
        </div>
        <label className="sg-progress"><span className="sg-sr-only">{t("展示进度", "Story progress")}</span><input ref={slider} type="range" min="0" max="1000" step="1" defaultValue="0" onChange={event => go(Number(event.target.value) / 1000, false)} /></label>
        <nav className="sg-chapters" aria-label={t("产品展示章节", "Product story chapters")}>
          {chapters.map((item, index) => <button key={item.tag} aria-current={chapter === index ? "step" : undefined} onClick={() => go(chapterStops[index])}><span>0{index + 1}</span>{item.label[language]}<i aria-hidden="true" /></button>)}
          <a href="#story">{t("进入设计过程", "Explore the process")}<span aria-hidden="true">↘</span></a>
        </nav>
      </div>
      {motion && !ready && <div className="sg-status" role="status">{failed ? t("动画暂不可用，已显示关键帧。", "Video unavailable. Showing key frames.") : t("正在准备动画，仍可滚动阅读。", "Preparing motion. You can keep exploring.")}{failed && <button onClick={() => { setFailed(false); setReload(value => value + 1); }}>{t("重试", "Retry")}</button>}</div>}
      <dialog ref={reference} className="sg-reference" aria-label={t("原始结构渲染参考", "Original structural reference")} onClick={event => { if (event.target === event.currentTarget) reference.current?.close(); }}>
        <button autoFocus onClick={() => reference.current?.close()}>{t("关闭", "Close")} ×</button>
        <img src="/sangre/structure-reference.jpg" alt={t("原始 SANGRE 结构渲染图", "Original SANGRE structural render")} loading="lazy" />
        <p>{t("原始结构渲染 · 设计参考", "ORIGINAL STRUCTURAL RENDER")}</p>
      </dialog>
    </div>
  </section>;
}

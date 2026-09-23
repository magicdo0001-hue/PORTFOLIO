"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SiteHeader } from "../../project-shell";
import { districts, type DistrictId } from "./city-data";
import type { createCity } from "./city-scene";
import "./city-hero.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => true;

function Arrow({ down = false }: { down?: boolean }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={down ? { transform: "rotate(90deg)" } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

export function UniLifeCityHero({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const en = locale === "en";
  const [selected, setSelected] = useState<DistrictId>("search");
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, serverMotion);
  const paused = motionOverride ?? reduced;
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const controls = useRef<ReturnType<typeof createCity> | null>(null);
  const current = useRef({ selected, paused });
  const district = districts.find((item) => item.id === selected)!;
  const copy = district[locale];

  useEffect(() => {
    current.current = { selected, paused };
    controls.current?.select(selected);
    controls.current?.pause(paused);
  }, [selected, paused]);

  useEffect(() => {
    let cancelled = false;
    import("./city-scene").then(({ createCity }) => {
      if (cancelled || !host.current) return;
      try {
        controls.current = createCity({ host: host.current, labels: labels.current, onSelect: setSelected, onReady: () => setStatus("ready"), onError: () => setStatus("fallback") });
        controls.current.select(current.current.selected);
        controls.current.pause(current.current.paused);
      } catch { setStatus("fallback"); }
    }).catch(() => { if (!cancelled) setStatus("fallback"); });
    return () => { cancelled = true; controls.current?.dispose(); controls.current = null; };
  }, []);

  function explore() {
    setSelected("search");
    labels.current[0]?.focus({ preventScroll: true });
    document.getElementById("unilife-town")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "nearest" });
  }

  return (
    <section className="uni-city" aria-label={en ? "Simple Uni Life: explore the campus" : "Simple Uni Life：探索留学小城"}>
      <SiteHeader darkText locale={locale} showLanguage languageHref={en ? "/work/simple-uni-life" : "/en/work/simple-uni-life"} />
      <div className="uni-city__copy">
        <p className="uni-city__brand" aria-label="SIMPLE UNI LIFE">UniLife<span>.</span></p>
        <h1>{en ? <>A little campus.<br /><em>A world of possibility.</em></> : <>把留学生活，<br /><em>过成你的主场。</em></>}</h1>
        <p className="uni-city__intro">{en ? "Start with a course. Find your own direction." : "从一门课开始，找到自己的方向。"}</p>
        <div className="uni-city__actions">
          <button type="button" onClick={explore}>{en ? "Explore the town" : "探索这座小城"}<Arrow /></button>
          <a href="#story">{en ? "The project story" : "查看项目故事"}<Arrow down /></a>
        </div>
      </div>
      <div id="unilife-town" className={`uni-city__world is-${status}`} role="group" aria-label={en ? "Interactive campus districts" : "可交互的校园街区"}>
        <img className="uni-city__fallback" src="/portfolio/unilife-city-fallback.webp" alt={en ? "An isometric campus with a library, planning hall, student café and course pavilion" : "等距校园小城：课程图书馆、钟楼规划站、交流咖啡馆与选课导航台"} fetchPriority="high" />
        <div ref={host} className="uni-city__canvas" role="group" tabIndex={status === "ready" ? 0 : -1} aria-label={en ? "3D model. Drag to rotate, right-drag to pan, scroll to zoom. Keyboard: arrows rotate, Shift and arrows pan, plus or minus zoom, Home resets." : "3D 微缩模型。拖动旋转，右键拖动平移，滚轮缩放。键盘方向键旋转，Shift 加方向键平移，加减号缩放，Home 复位。"} />
        <div className="uni-city__labels">
          {districts.map((item, index) => (
            <button key={item.id} ref={(node) => { labels.current[index] = node; }} type="button" className={`uni-city__label uni-city__label--${item.id}`} aria-pressed={selected === item.id} aria-controls="unilife-district-detail" onClick={() => setSelected(item.id)}>
              <span className="uni-city__pin" style={{ backgroundColor: item.color }} />{item[locale].name}<Arrow />
            </button>
          ))}
        </div>
        {status === "ready" && <div className="uni-city__view-controls">
          <p><span className="uni-city__desktop-hint">{en ? "Drag to rotate · Right-drag to move · Scroll to zoom" : "拖动旋转 · 右键平移 · 滚轮缩放"}</span><span className="uni-city__touch-hint">{en ? "Drag to rotate · Two fingers to move / zoom" : "单指旋转 · 双指移动 / 缩放"}</span></p>
          <button type="button" onClick={() => controls.current?.resetView()}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6" /></svg>{en ? "Reset view" : "复位视角"}</button>
        </div>}
      </div>
      <div className="uni-city__directory">
        <div className="uni-city__districts" role="group" aria-label={en ? "Choose a district" : "选择功能街区"}>
          {districts.map((item, i) => (
            <button type="button" key={item.id} aria-pressed={selected === item.id} aria-controls="unilife-district-detail" onClick={() => setSelected(item.id)}><span aria-hidden="true">0{i + 1}</span>{item[locale].feature}</button>
          ))}
        </div>
        <div className="uni-city__detail" id="unilife-district-detail" aria-live="polite" aria-atomic="true">
          <p>{copy.description}</p><a href={`#${district.target}`}>{copy.link}<Arrow /></a>
        </div>
        <button type="button" className="uni-city__motion" onClick={() => setMotionOverride(!paused)} disabled={status !== "ready"} aria-pressed={paused}>
          <span aria-hidden="true">{paused ? <svg viewBox="0 0 20 20" fill="currentColor"><path d="m7 4 9 6-9 6z" /></svg> : <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4h3v12H6zm5 0h3v12h-3z" /></svg>}</span>
          {status === "fallback" ? (en ? "Still view" : "静态视图") : status === "loading" ? (en ? "Opening the town" : "小城加载中") : paused ? (en ? "Play motion" : "播放动画") : (en ? "Pause motion" : "暂停动画")}
        </button>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { cityProjects, type CityTheme } from "./city-data";
import type { createCity } from "./city-world";
import "../simple-uni-life/city-hero.css";
import "./city-theme.css";

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

export function ProjectCityHero({ theme, locale = "zh" }: { theme: CityTheme; locale?: "zh" | "en" }) {
  const project = cityProjects[theme];
  const districts = project.districts;
  const overview = project[locale];
  const en = locale === "en";
  const [reading, setReading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, serverMotion);
  const paused = reading || (motionOverride ?? reduced);
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const controls = useRef<ReturnType<typeof createCity> | null>(null);
  const current = useRef({ selected, paused });
  const district = districts.find((item) => item.id === selected);
  const copy = district?.[locale];
  const chooseDistrict = useCallback((id: string | null) => {
    current.current.selected = id;
    setSelected(id);
    controls.current?.select(id);
  }, []);

  useEffect(() => {
    const sync = () => setReading(window.location.hash === "#reading");
    const frame = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", sync); };
  }, []);

  function toggleReading() {
    const next = !reading;
    setReading(next);
    if (next) setMotionOverride(true);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next ? "#reading" : ""}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  useEffect(() => {
    current.current.paused = paused;
    controls.current?.pause(paused);
  }, [paused]);
  useEffect(() => {
    let cancelled = false;
    import("./city-world").then(({ createCity }) => {
      if (cancelled || !host.current) return;
      try {
        controls.current = createCity({ project, host: host.current, labels: labels.current, onSelect: chooseDistrict, onReady: () => setStatus("ready"), onError: () => setStatus("fallback") });
        if (current.current.selected) controls.current.select(current.current.selected);
        controls.current.pause(current.current.paused);
      } catch { setStatus("fallback"); }
    }).catch(() => { if (!cancelled) setStatus("fallback"); });
    return () => { cancelled = true; controls.current?.dispose(); controls.current = null; };
  }, [chooseDistrict, project]);

  return (
    <section className={`uni-city project-city project-city--${theme}${selected ? " is-focused" : ""}${reading ? " uni-city--reading" : ""}`} data-district={selected ?? "overview"} aria-label={overview.scene}>
      <header className="uni-project-header">
        <Link className="uni-project-back" href={`${en ? "/en" : "/"}?archive=${project.archive}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ transform: "rotate(180deg)" }}><path d="M4 12h15M13 5l7 7-7 7" /></svg>
          <span>{en ? "Back to archive" : "返回档案架"}</span>
        </Link>
        <Link className="uni-project-name" href={en ? "/en" : "/"}>WENHOU YAN<span> / {project.title}</span></Link>
        <div className="uni-project-header-actions">
          <button type="button" onClick={toggleReading} aria-pressed={reading}>{reading ? (en ? "3D city" : "返回小城") : (en ? "Reading mode" : "阅读模式")}</button>
          <Link href={`${en ? "/work/" : "/en/work/"}${project.slug}${reading ? "#reading" : ""}`} hrefLang={en ? "zh-CN" : "en"} aria-label={en ? "切换至中文" : "Switch to English"}>{en ? "中文" : "EN"}</Link>
        </div>
      </header>
      <div id="project-town" className={`uni-city__world is-${status}`} role="group" aria-label={overview.scene}>
        <Image unoptimized loading="eager" className="uni-city__fallback" src={project.fallback} alt={overview.scene} fetchPriority="high" />
        <div ref={host} className="uni-city__canvas" role="group" tabIndex={status === "ready" ? 0 : -1} aria-label={en ? "3D model. Select a building to focus. Drag to rotate, right-drag to pan, scroll to zoom. Arrow keys rotate, Shift and arrows pan, plus or minus zoom, Home returns to overview." : "3D 微缩模型。点击建筑聚焦。拖动旋转，右键拖动平移，滚轮缩放。方向键旋转，Shift 加方向键平移，加减号缩放，Home 返回全景。"} />
        <div className="uni-city__labels">
          {districts.map((item, index) => (
            <button key={item.id} ref={(node) => { labels.current[index] = node; }} type="button" className={`uni-city__label uni-city__label--${item.id}`} data-building={item.id} aria-pressed={selected === item.id} aria-controls="project-district-detail" onClick={() => chooseDistrict(item.id)}>
              <span className="uni-city__pin" />{item[locale].name}<Arrow />
            </button>
          ))}
        </div>
      </div>
      <div className="uni-city__copy" id="project-district-detail" aria-live="polite" aria-atomic="true">
        <p className="uni-city__brand" aria-label={project.title}>{project.brand}<span>.</span></p>
        <h1>{copy ? copy.name : <>{overview.headline[0]}<br /><em>{overview.headline[1]}</em></>}</h1>
        <p className="uni-city__intro">{copy ? copy.description : overview.intro}</p>
        <div className="uni-city__actions">
          {district && copy ? <a className="uni-city__primary" href={`#${district.target}`}>{copy.link}<Arrow /></a> : <button type="button" onClick={() => chooseDistrict(districts[0].id)}>{overview.explore}<Arrow /></button>}
          <a href="#story">{en ? "The project story" : "查看项目故事"}<Arrow down /></a>
        </div>
      </div>
      {status === "ready" && <div className="uni-city__view-controls">
        <p><span className="uni-city__desktop-hint">{en ? "Drag to rotate · Right-drag to move · Scroll to zoom" : "拖动旋转 · 右键平移 · 滚轮缩放"}</span><span className="uni-city__touch-hint">{en ? "Drag to rotate · Two fingers to move / zoom" : "单指旋转 · 双指移动 / 缩放"}</span></p>
        <button type="button" onClick={() => chooseDistrict(null)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6" /></svg>{en ? "Back to overview" : "返回全景"}</button>
      </div>}
      <div className="uni-city__directory">
        <div className="uni-city__districts" role="group" aria-label={en ? "Choose a district" : "选择功能街区"}>
          {districts.map((item, i) => (
            <button type="button" key={item.id} data-building={item.id} aria-pressed={selected === item.id} aria-controls="project-district-detail" onClick={() => chooseDistrict(item.id)}><span aria-hidden="true">0{i + 1}</span>{item[locale].feature}</button>
          ))}
        </div>
        <button type="button" className="uni-city__motion" onClick={() => setMotionOverride(!paused)} disabled={status !== "ready"} aria-pressed={paused}>
          <span aria-hidden="true">{paused ? <svg viewBox="0 0 20 20" fill="currentColor"><path d="m7 4 9 6-9 6z" /></svg> : <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4h3v12H6zm5 0h3v12h-3z" /></svg>}</span>
          {status === "fallback" ? (en ? "Still view" : "静态视图") : status === "loading" ? (en ? "Opening the town" : "小城加载中") : paused ? (en ? "Play motion" : "播放动画") : (en ? "Pause motion" : "暂停动画")}
        </button>
      </div>
    </section>
  );
}

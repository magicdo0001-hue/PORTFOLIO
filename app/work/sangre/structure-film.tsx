"use client";

import { useEffect, useRef, useState } from "react";
import "./structure-film.css";

const stages = [
  { at: 0, zh: "折叠形态", en: "Folded", zhBody: "倾斜屏幕与桌面操作连在一起，先以紧凑形态读取信息。", enBody: "The folded display offers a compact, angled view for the tabletop routine." },
  { at: 1.3, zh: "展开长屏", en: "Unfold", zhBody: "同一屏幕沿折线展开，界面切换到完整长屏布局。", enBody: "The same display unfolds along its crease, revealing the full-height dashboard." },
  { at: 4.4, zh: "测试条", en: "Test strip", zhBody: "移开透明盖后，使用真实测试条模型展示接近与定位。", enBody: "The clear cover moves aside before the supplied test strip approaches the device." },
  { at: 7, zh: "结构展开", en: "Assembly", zhBody: "真实上下壳与固定件逐层分离；主板和线圈按参考图作展示示意。", enBody: "The supplied enclosure and fixing parts separate in layers; boards and coil are reference-based illustrations." },
] as const;
const sources = { desktop: "/sangre/film/structure-1440.mp4", mobile: "/sangre/film/structure-960.mp4" };

export default function StructureFilm({ locale }: { locale: "zh" | "en" }) {
  const en = locale === "en";
  const t = (zh: string, english: string) => en ? english : zh;
  const video = useRef<HTMLVideoElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const timeLabel = useRef<HTMLOutputElement>(null);
  const desiredTime = useRef<number | null>(null);
  const seekFrame = useRef(0);
  const playTicket = useRef(0);
  const stageRef = useRef(0);
  const autoplayAttempted = useRef(false);
  const visible = useRef(false);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  // Keep frame-rate updates out of React and the surrounding Three.js workbench.
  function paint(time: number) {
    const duration = video.current?.duration;
    const length = Number.isFinite(duration) && duration! > 0 ? duration! : 12;
    const progress = Math.max(0, Math.min(1, time / length));
    if (slider.current) {
      slider.current.value = String(progress * 1000);
      slider.current.style.setProperty("--film-progress", `${progress * 100}%`);
      slider.current.setAttribute("aria-valuetext", `${time.toFixed(1)} / ${length.toFixed(1)} ${en ? "seconds" : "秒"}`);
    }
    if (timeLabel.current) timeLabel.current.value = `${time.toFixed(1)} / ${length.toFixed(1)} s`;
    const next = time >= stages[3].at ? 3 : time >= stages[2].at ? 2 : time >= stages[1].at ? 1 : 0;
    if (stageRef.current !== next) { stageRef.current = next; setStage(next); }
  }

  function autoplay() {
    const media = video.current;
    if (!media || media.readyState < 2 || autoplayAttempted.current || !visible.current || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayAttempted.current = true;
    void media.play().catch(() => undefined);
  }

  function pause() {
    playTicket.current++;
    video.current?.pause();
    setPlaying(false);
    setBusy(false);
  }

  function requestSeek(time: number) {
    const media = video.current;
    if (!media || !Number.isFinite(media.duration) || !ready) return;
    pause();
    desiredTime.current = Math.max(0, Math.min(media.duration - 1 / 24, time));
    paint(time);
    // Coalesce rapid pointer/keyboard events; one outstanding decode, latest seek wins.
    if (seekFrame.current) return;
    seekFrame.current = requestAnimationFrame(() => {
      seekFrame.current = 0;
      if (!media.seeking && desiredTime.current !== null) {
        const target = desiredTime.current; desiredTime.current = null;
        media.currentTime = target;
      }
    });
  }

  function settled() {
    const media = video.current;
    if (!media) return;
    if (desiredTime.current !== null) {
      const target = desiredTime.current; desiredTime.current = null;
      if (Math.abs(media.currentTime - target) > 1 / 60) { media.currentTime = target; return; }
    }
    paint(media.currentTime);
    setBusy(false);
  }

  async function play() {
    const media = video.current;
    if (!media || !ready) return;
    if (!media.paused) { pause(); return; }
    const ticket = ++playTicket.current;
    setMessage("");
    if (seekFrame.current) { cancelAnimationFrame(seekFrame.current); seekFrame.current = 0; }
    const pending = desiredTime.current;
    desiredTime.current = null;
    if (pending !== null) media.currentTime = pending;
    else if (media.ended || media.currentTime >= media.duration - .06) media.currentTime = 0;
    try {
      await media.play();
      if (ticket !== playTicket.current) media.pause();
    } catch (error) {
      if (ticket !== playTicket.current || (error instanceof DOMException && error.name === "AbortError")) return;
      setPlaying(false); setBusy(false);
      setMessage(t("播放未开始，请再次点击播放。", "Playback did not start. Please try again."));
    }
  }

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const source = matchMedia("(max-width: 760px)").matches ? sources.mobile : sources.desktop;
    const abort = new AbortController();
    let objectUrl: string | null = null;
    let callback = 0;
    let raf = 0;
    let disposed = false;
    const ticketCounter = playTicket;
    // Some local asset servers ignore Range and expose an unseekable video.
    // Probe one byte; reuse a full 200 response as a seekable Blob, without
    // downloading it twice. A 206 server keeps native progressive streaming.
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
          objectUrl = URL.createObjectURL(blob);
          media.src = objectUrl;
        }
        media.load();
      } catch {
        if (!disposed && !abort.signal.aborted) { setFailed(true); setReady(false); }
      }
    })();
    const frame = () => {
      if (disposed) return;
      if (desiredTime.current === null && !media.seeking) paint(media.currentTime);
      if (typeof media.requestVideoFrameCallback === "function") callback = media.requestVideoFrameCallback(frame);
      else if (!media.paused) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (typeof media.requestVideoFrameCallback !== "function") { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } };
    if (typeof media.requestVideoFrameCallback === "function") callback = media.requestVideoFrameCallback(frame);
    const hide = () => { if (document.hidden) { playTicket.current++; media.pause(); } };
    const visibility = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (!entry.isIntersecting) { playTicket.current++; media.pause(); }
      else autoplay();
    });
    visibility.observe(media);
    document.addEventListener("visibilitychange", hide);
    media.addEventListener("playing", start);
    return () => {
      disposed = true; ticketCounter.current++; visibility.disconnect(); abort.abort();
      cancelAnimationFrame(raf); cancelAnimationFrame(seekFrame.current);
      if (callback) media.cancelVideoFrameCallback?.(callback);
      document.removeEventListener("visibilitychange", hide); media.removeEventListener("playing", start);
      media.pause(); media.removeAttribute("src"); media.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // Locale is fixed for this mount. All media events use the current element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return <div className="sg-film" data-testid="structure-film" data-ready={ready} data-stage={stage}>
    <div className="sg-film-picture">
      <video ref={video} poster="/sangre/film/poster.webp" preload="auto" playsInline muted
        aria-label={t("SANGRE 预渲染动画：折叠屏展开、测试条定位与内部结构展示。", "SANGRE rendered film: folding display, test-strip positioning and internal assembly.")}
        onLoadedMetadata={() => { setFailed(false); paint(0); }}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => { setReady(true); setBusy(false); autoplay(); }}
        onPlaying={() => { setPlaying(true); setBusy(false); }}
        onPause={() => { setPlaying(false); setBusy(false); }}
        onWaiting={() => setBusy(true)}
        onSeeked={settled}
        onEnded={() => { setPlaying(false); setBusy(false); paint(video.current?.duration ?? 12); }}
        onError={() => { pause(); desiredTime.current = null; cancelAnimationFrame(seekFrame.current); seekFrame.current = 0; setFailed(true); setReady(false); }} />
      <div className="sg-film-caption"><span>04 / SANGRE</span><span>{t("结构影片", "ASSEMBLY FILM")}</span></div>
      {(busy || !ready || failed) && <p className="sg-film-status" role="status">{failed ? t("动画加载失败，可重试或查看关键帧。", "Video unavailable. Retry or view the key frames.") : busy ? t("正在缓冲…", "Buffering…") : t("正在准备动画…", "Preparing animation…")}</p>}
    </div>
    <div className="sg-film-controls">
      <nav className="sg-film-chapters" aria-label={t("动作阶段", "Motion stages")}>
        {stages.map((item, index) => <button key={item.at} onClick={() => requestSeek(item.at)} disabled={!ready} aria-current={stage === index ? "step" : undefined}><span>0{index + 1}</span>{en ? item.en : item.zh}</button>)}
      </nav>
      <label className="sg-film-timeline"><span>{t("拖动查看动作", "Scrub the motion")}<output ref={timeLabel}>0.0 / 12.0 s</output></span>
        <input ref={slider} aria-label={t("动画进度", "Animation progress")} type="range" min="0" max="1000" step="1" defaultValue="0" disabled={!ready} onPointerDown={pause} onChange={event => requestSeek(Number(event.target.value) / 1000 * (video.current?.duration ?? 12))} />
      </label>
      <div className="sg-film-actions">
        <button className="sg-primary" onClick={play} disabled={!ready} aria-label={playing ? t("暂停动画", "Pause animation") : t("播放动画", "Play animation")}>{playing ? t("暂停", "Pause") : t("播放", "Play")}<span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button>
        <button className="sg-text-button" onClick={() => requestSeek(0)} disabled={!ready}>{t("回到起点", "Reset")}</button>
        <span className="sg-film-hint">{t("拖动后停留 · 播放继续", "Scrub to pause · play to continue")}</span>
      </div>
      <p className="sg-film-description" aria-live="polite">{en ? stages[stage].enBody : stages[stage].zhBody}</p>
      {message && <p role="status" className="sg-note">{message}</p>}
      {failed && <div className="sg-film-recovery"><button className="sg-text-button" onClick={() => { setReady(false); setFailed(false); autoplayAttempted.current = false; setReload(value => value + 1); }}>{t("重新加载动画", "Retry video")}</button><a href="/sangre/film/keyframes.webp" target="_blank" rel="noreferrer">{t("查看动作关键帧", "View key frames")}</a></div>}
    </div>
  </div>;
}

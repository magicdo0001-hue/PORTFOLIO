"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import "./showcase.css";

export default function SangreShowcase({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const viewport = useRef<HTMLElement>(null);
  useEffect(() => {
    const load = () => {
      const iframe = frame.current;
      if (location.hash !== "#story" && iframe && !iframe.getAttribute("src")) iframe.src = iframe.dataset.src!;
    };
    load();
    window.addEventListener("hashchange", load);
    if (viewport.current) {
      const html = frame.current?.contentDocument?.documentElement;
      const currentLocale = new URLSearchParams(frame.current?.contentWindow?.location.search).get("lang");
      viewport.current.dataset.status = currentLocale === locale && (html?.classList.contains("sangre-ready") || html?.classList.contains("sangre-static")) ? "ready" : "loading";
    }
    const message = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "sangre:story") location.hash = "story";
      else if (event.data?.type === "sangre:ready" && viewport.current) viewport.current.dataset.status = "ready";
      else if (event.data?.type === "sangre:home") {
        const href = locale === "en" ? "/en" : "/";
        if (window.parent !== window) window.parent.postMessage({ type: "sangre-navigate", href }, location.origin);
        else location.assign(href);
      } else if (event.data?.type === "sangre:escape") {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      }
    };
    window.addEventListener("message", message);
    const observer = new IntersectionObserver(([entry]) => {
      frame.current?.contentWindow?.postMessage({ type: "sangre:visibility", visible: entry.isIntersecting }, location.origin);
    });
    if (viewport.current) observer.observe(viewport.current);
    return () => { window.removeEventListener("hashchange", load); window.removeEventListener("message", message); observer.disconnect(); };
  }, [locale]);
  return <section ref={viewport} id="showcase" className="sangre-showcase" data-testid="model-viewport" data-status="loading" aria-label={locale === "en" ? "SANGRE interactive showcase" : "SANGRE 交互展示"}>
    <h1 className="sr-only">SANGRE</h1>
    <a className="sangre-showcase__skip" href="#story">{locale === "en" ? "Read the case study" : "阅读项目案例"}</a>
    <iframe ref={frame} loading="lazy" data-src={`/sangre-showcase/index.html?lang=${locale}`} title={locale === "en" ? "SANGRE product experience" : "SANGRE 产品交互体验"} />
    <div className="sangre-showcase__poster" role="status">
      <div><p className="sangre-showcase__title">Health,<br />in focus.</p><p>{locale === "en" ? "Preparing the product experience…" : "正在准备产品展示…"}</p><a href="#story">{locale === "en" ? "Read the case study" : "先阅读项目案例"}</a></div>
      <Image unoptimized src="/sangre-showcase/assets/sangre/hero.webp" width={2000} height={2000} alt={locale === "en" ? "SANGRE product render" : "SANGRE 产品渲染"} priority />
    </div>
  </section>;
}

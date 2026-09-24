"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { installArchiveProjectPortal } from "./archive-project-portal";
import "./archive-project-portal.css";
import "./rhine-lab-experience.css";

export default function RhineLabExperience({
  locale = "zh",
}: {
  locale?: "zh" | "en";
}) {
  const english = locale === "en";
  const archive = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (archive.current) return installArchiveProjectPortal(archive.current);
  }, []);
  return (
    <section className="rhine-experience" aria-label="Rhine Lab interactive experience">
      <div className="rhine-experience__bar">
        <span>RHINE LAB <span aria-hidden="true">/</span> {english ? "INTERACTIVE EXPERIENCE" : "交互体验"}</span>
        <nav aria-label={english ? "Experience navigation" : "体验导航"}>
          <a href="/rhine-lab/index.html" target="_blank" rel="noopener noreferrer">
            {english ? "Open separately ↗" : "独立打开 ↗"}
          </a>
          <Link href={english ? "/en/work" : "/work"}>
            {english ? "Projects" : "项目"}
          </Link>
          <Link
            href={english ? "/" : "/en"}
            hrefLang={english ? "zh-CN" : "en"}
            aria-label={english ? "切换至中文" : "Switch to English"}
          >
            {english ? "中" : "EN"}
          </Link>
        </nav>
      </div>
      <iframe
        ref={archive}
        className="rhine-experience__frame"
        src="/rhine-lab/index.html"
        title={english ? "Rhine Lab — original interactive 3D archive" : "Rhine Lab 原版三维档案交互"}
        allow="fullscreen; autoplay"
        allowFullScreen
      />
    </section>
  );
}

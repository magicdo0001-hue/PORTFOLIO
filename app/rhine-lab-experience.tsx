"use client";

import "./rhine-lab-experience.css";

export default function RhineLabExperience({
  locale = "zh",
  standalone = false,
}: {
  locale?: "zh" | "en";
  standalone?: boolean;
}) {
  const english = locale === "en";
  return (
    <section className="rhine-experience" aria-label="Rhine Lab interactive experience">
      <div className="rhine-experience__bar">
        <span>RHINE LAB <span aria-hidden="true">/</span> {english ? "INTERACTIVE EXPERIENCE" : "交互体验"}</span>
        <nav aria-label={english ? "Experience navigation" : "体验导航"}>
          <a href="/rhine-lab/index.html" target="_blank" rel="noopener noreferrer">
            {english ? "Open separately ↗" : "独立打开 ↗"}
          </a>
          <a href={standalone ? "/#top" : "#top"} onClick={(event) => {
            event.preventDefault();
            if (standalone) {
              window.location.assign("/#top");
            } else {
              window.history.replaceState(window.history.state, "", "#top");
              document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
            }
          }}>
            {english ? "Explore portfolio ↓" : "继续浏览作品集 ↓"}
          </a>
        </nav>
      </div>
      <iframe
        className="rhine-experience__frame"
        src="/rhine-lab/index.html"
        title={english ? "Rhine Lab — original interactive 3D archive" : "Rhine Lab 原版三维档案交互"}
        allow="fullscreen; autoplay"
        allowFullScreen
      />
    </section>
  );
}

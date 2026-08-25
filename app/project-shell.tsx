"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import GlassSurface from "./glass-surface";

const projectShortcuts = [
  { index: "01", title: "SANGRE", href: "/work/sangre", enHref: "/en/work/sangre" },
  { index: "02", title: "BAMBINO V2", href: "/work/bambino", enHref: "/en/work/bambino" },
  { index: "03", title: "SIMPLE UNI LIFE", href: "/work/simple-uni-life", enHref: "/en/work/simple-uni-life" },
  { index: "04", title: "ENERGIZER", href: "/work/battery-packaging" },
  { index: "05", title: "ARTI64", href: "/work/vertical-car-park" },
] as const;

export function SiteHeader({
  darkText = false,
  locale = "zh",
  showLanguage = false,
  languageHref,
}: {
  darkText?: boolean;
  locale?: "zh" | "en";
  showLanguage?: boolean;
  languageHref?: string;
}) {
  const isEnglish = locale === "en";
  const homeHref = isEnglish ? "/en" : "/";
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setProjectsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!projectsOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setProjectsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProjectsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [projectsOpen]);

  const closeProjects = () => setProjectsOpen(false);

  return (
    <header
      ref={headerRef}
      className={`site-nav shell${darkText ? " site-nav--dark-text" : ""}${projectsOpen ? " site-nav--projects-open" : ""}`}
    >
      <GlassSurface
        className="site-nav__surface"
        width="100%"
        height="100%"
        borderRadius={999}
        borderWidth={0.07}
        brightness={50}
        opacity={0.93}
        blur={11}
        displace={0.5}
        backgroundOpacity={0.1}
        saturation={1}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
      >
        <Link
          className="site-nav__brand site-nav__glass"
          href={homeHref}
          aria-label={isEnglish ? "Portfolio home" : "作品集首页"}
          onClick={closeProjects}
        >
          <span>WY</span>
          <strong>{isEnglish ? "Home" : "首页"}</strong>
        </Link>
        <nav aria-label={isEnglish ? "Main navigation" : "主导航"}>
          <Link className="site-nav__glass" href={`${homeHref}#profile`} onClick={closeProjects}>
            {isEnglish ? "About" : "关于"}
          </Link>
          <div className="site-nav__projects">
            <Link
              className="site-nav__glass site-nav__projects-link"
              href={isEnglish ? "/en/work" : "/work"}
              onClick={closeProjects}
            >
              {isEnglish ? "Projects" : "项目"}
            </Link>
            <button
              className="site-nav__glass site-nav__projects-toggle"
              type="button"
              aria-label={isEnglish ? "Show project shortcuts" : "展开项目快捷入口"}
              aria-expanded={projectsOpen}
              aria-controls="site-project-shortcuts"
              onClick={() => setProjectsOpen((open) => !open)}
            >
              <span aria-hidden="true">›</span>
            </button>
            <div
              id="site-project-shortcuts"
              className={`site-nav__project-shortcuts${projectsOpen ? " is-open" : ""}`}
              aria-hidden={!projectsOpen}
            >
              {projectShortcuts.map((project) => (
                <Link
                  key={project.index}
                  href={isEnglish && "enHref" in project ? project.enHref : project.href}
                  tabIndex={projectsOpen ? 0 : -1}
                  title={project.title}
                  aria-label={
                    isEnglish
                      ? `Open ${project.title} project`
                      : `打开 ${project.title} 项目`
                  }
                  onClick={closeProjects}
                >
                  <span>{project.index}</span>
                  <strong>{project.title}</strong>
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="site-nav__actions">
          {showLanguage && (
            <Link
              className="site-nav__glass site-nav__language"
              href={languageHref ?? (isEnglish ? "/" : "/en")}
              hrefLang={isEnglish ? "zh-CN" : "en"}
              lang={isEnglish ? "zh-CN" : "en"}
              aria-label={isEnglish ? "切换至中文" : "Switch to English"}
              onClick={closeProjects}
            >
              {isEnglish ? "中" : "EN"}
            </Link>
          )}
          <a
            className="site-nav__download site-nav__glass"
            href="/wenhou-yan-portfolio-cn.pdf"
            download
            aria-label={isEnglish ? "Download portfolio PDF" : "下载PDF作品集"}
            onClick={closeProjects}
          >
            <span className="site-nav__action-label">
              {isEnglish ? "Portfolio PDF" : "下载PDF作品集"}
            </span>
            <span aria-hidden="true">↓</span>
          </a>
          <Link
            className="site-nav__contact site-nav__glass"
            href={`${homeHref}#contact`}
            onClick={closeProjects}
          >
            <span className="site-nav__action-label">
              {isEnglish ? "Contact" : "联系我"}
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </GlassSurface>
    </header>
  );
}

export function ProjectHero({
  index,
  title,
  category,
  period,
  role,
  lede,
  image,
  tone,
  locale = "zh",
}: {
  index: string;
  title: string;
  category: string;
  period: string;
  role: string;
  lede: string;
  image: string;
  tone: "sangre" | "bambino" | "unilife" | "battery" | "frame";
  locale?: "zh" | "en";
}) {
  const isEnglish = locale === "en";
  const bilingualPaths = {
    sangre: "/work/sangre",
    bambino: "/work/bambino",
    unilife: "/work/simple-uni-life",
  } as const;
  const bilingualPath = tone in bilingualPaths
    ? bilingualPaths[tone as keyof typeof bilingualPaths]
    : null;
  return (
    <section className={`project-hero project-hero--${tone}`}>
      <SiteHeader
        darkText={tone === "unilife" || tone === "battery"}
        locale={locale}
        showLanguage={bilingualPath !== null}
        languageHref={
          bilingualPath
            ? isEnglish
              ? bilingualPath
              : `/en${bilingualPath}`
            : undefined
        }
      />
      <img
        className="project-hero__image"
        src={image}
        alt={isEnglish ? `${title} project hero` : `${title} 项目主视觉`}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="project-hero__veil" />
      <div className="project-hero__content shell">
        <div className="project-hero__meta">
          <span>{index} / 05</span>
          <span>{category}</span>
          <span>{period}</span>
          <span>{role}</span>
        </div>
        <div className="project-hero__title">
          <p>{isEnglish ? "Selected project" : "精选项目案例"}</p>
          <h1>{title}</h1>
        </div>
        <p className="project-hero__lede">{lede}</p>
        <a className="scroll-cue" href="#story">
          {isEnglish ? "View case study" : "查看详情"} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

export function ProjectEnd({
  nextHref,
  nextIndex,
  nextTitle,
  locale = "zh",
}: {
  nextHref: string;
  nextIndex: string;
  nextTitle: string;
  locale?: "zh" | "en";
}) {
  const isEnglish = locale === "en";
  return (
    <section className="next-project">
      <Link href={nextHref}>
        <span>{isEnglish ? "Next project" : "下一个项目"} / {nextIndex}</span>
        <strong>{nextTitle}</strong>
        <i aria-hidden="true">↗</i>
      </Link>
    </section>
  );
}

export function FactRail({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="fact-rail shell">{children}</div>;
}

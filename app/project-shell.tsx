import Link from "next/link";
import type { ReactNode } from "react";
import GlassSurface from "./glass-surface";

export function SiteHeader({ light = false }: { light?: boolean }) {
  return (
    <header className={`site-nav shell${light ? " site-nav--light" : ""}`}>
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
        href="/"
        aria-label="作品集首页"
      >
        <span>WY</span>
        <strong>首页</strong>
      </Link>
      <nav aria-label="主导航">
        <Link className="site-nav__glass" href="/#profile">
          关于
        </Link>
        <Link className="site-nav__glass" href="/work">
          项目
        </Link>
        <a
          className="site-nav__glass"
          href="/wenhou-yan-portfolio-cn.pdf"
          download
        >
          下载PDF作品集
        </a>
      </nav>
      <a
        className="site-nav__contact site-nav__glass"
        href="mailto:wyan39702@gmail.com"
      >
        联系我 <span aria-hidden="true">↗</span>
      </a>
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
}: {
  index: string;
  title: string;
  category: string;
  period: string;
  role: string;
  lede: string;
  image: string;
  tone: "sangre" | "bambino" | "unilife" | "battery" | "frame";
}) {
  return (
    <section className={`project-hero project-hero--${tone}`}>
      <SiteHeader light={tone !== "bambino"} />
      <img
        className="project-hero__image"
        src={image}
        alt={`${title} 项目主视觉`}
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
          <p>精选项目案例</p>
          <h1>{title}</h1>
        </div>
        <p className="project-hero__lede">{lede}</p>
        <a className="scroll-cue" href="#story">
          查看详情 <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

export function ProjectEnd({
  nextHref,
  nextIndex,
  nextTitle,
}: {
  nextHref: string;
  nextIndex: string;
  nextTitle: string;
}) {
  return (
    <section className="next-project">
      <Link href={nextHref}>
        <span>下一个项目 / {nextIndex}</span>
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

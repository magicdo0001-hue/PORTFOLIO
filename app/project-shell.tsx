import Link from "next/link";
import type { ReactNode } from "react";

export function SiteHeader({ light = false }: { light?: boolean }) {
  return (
    <header className={`site-nav shell${light ? " site-nav--light" : ""}`}>
      <Link className="site-nav__brand" href="/" aria-label="严文厚作品集首页">
        <span>WY</span>
        <strong>WENHOU YAN</strong>
      </Link>
      <nav aria-label="主导航">
        <Link href="/#work">项目</Link>
        <Link href="/#profile">关于</Link>
        <a href="/wenhou-yan-resume.pdf" download>
          简历
        </a>
      </nav>
      <a className="site-nav__contact" href="mailto:wyan39702@gmail.com">
        联系我 <span aria-hidden="true">↗</span>
      </a>
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
  tone: "sangre" | "bambino" | "unilife";
}) {
  return (
    <section className={`project-hero project-hero--${tone}`}>
      <SiteHeader light={tone !== "bambino"} />
      <img className="project-hero__image" src={image} alt={`${title} 项目主视觉`} />
      <div className="project-hero__veil" />
      <div className="project-hero__content shell">
        <div className="project-hero__meta">
          <span>{index} / 03</span>
          <span>{category}</span>
          <span>{period}</span>
          <span>{role}</span>
        </div>
        <div className="project-hero__title">
          <p>SELECTED CASE STUDY</p>
          <h1>{title}</h1>
        </div>
        <p className="project-hero__lede">{lede}</p>
        <a className="scroll-cue" href="#story">
          EXPLORE <span aria-hidden="true">↓</span>
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
    <>
      <section className="next-project">
        <Link href={nextHref}>
          <span>NEXT CASE / {nextIndex}</span>
          <strong>{nextTitle}</strong>
          <i aria-hidden="true">↗</i>
        </Link>
      </section>
      <ContactFooter />
    </>
  );
}

export function ContactFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <p>AVAILABLE FOR PRODUCT DESIGN OPPORTUNITIES</p>
        <a href="mailto:wyan39702@gmail.com">wyan39702@gmail.com ↗</a>
        <div>
          <span>© 2026 WENHOU YAN</span>
          <a
            href="https://www.linkedin.com/in/wenhou-yan-3546653b8"
            target="_blank"
            rel="noreferrer"
          >
            LINKEDIN
          </a>
          <Link href="/">BACK HOME ↑</Link>
        </div>
      </div>
    </footer>
  );
}

export function AssetPlaceholder({
  label,
  spec,
  className = "",
}: {
  label: string;
  spec: string;
  className?: string;
}) {
  return (
    <figure
      className={`asset-placeholder${className ? ` ${className}` : ""}`}
      aria-label={`${label} image pending replacement`}
    >
      <span>IMAGE PENDING</span>
      <strong>{label}</strong>
      <small>{spec}</small>
    </figure>
  );
}

export function FactRail({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="fact-rail shell">{children}</div>;
}

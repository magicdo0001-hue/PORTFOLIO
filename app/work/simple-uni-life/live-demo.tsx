"use client";

import { useState } from "react";

const PRODUCT_URL = "https://simpleunilife.com/";

const copy = {
  zh: {
    aria: "Simple Uni Life 在线产品体验",
    chapter: "03 / 真实线上产品",
    open: "新标签页打开 ↗",
    exit: "退出体验",
    posterAlt: "Simple Uni Life 线上产品首页预览",
    frameTitle: "Simple Uni Life 在线产品体验",
    real: "真实线上产品",
    start: "开始在线体验",
    hint: "点击后，滚轮与键盘将用于操作产品",
    ready: "体验已启用 · 使用上方按钮退出",
    loading: "正在载入线上产品…",
  },
  en: {
    aria: "Simple Uni Life live product experience",
    chapter: "03 / LIVE PRODUCT",
    open: "Open in new tab ↗",
    exit: "Exit experience",
    posterAlt: "Preview of the Simple Uni Life live product",
    frameTitle: "Simple Uni Life live product experience",
    real: "Live product",
    start: "Launch interactive demo",
    hint: "Once launched, the mouse wheel and keyboard control the product",
    ready: "Experience active · use the button above to exit",
    loading: "Loading the live product…",
  },
} as const;

export function SimpleUniLifeLiveDemo({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const [isActive, setIsActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const text = copy[locale];

  const enterDemo = () => {
    setIsLoaded(false);
    setIsActive(true);
  };

  const leaveDemo = () => {
    setIsActive(false);
  };

  return (
    <section id="online-product" className="unilife-live" aria-label={text.aria}>
      <div className="unilife-live__intro shell">
        <p className="chapter-label">{text.chapter}</p>
      </div>
      <div className={`unilife-live__browser${isActive ? " is-active" : ""}`}>
        <div className="unilife-live__toolbar">
          <div className="unilife-live__traffic" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="unilife-live__address">
            <span aria-hidden="true">⌁</span>
            simpleunilife.com
          </div>
          <div className="unilife-live__actions">
            <a href={PRODUCT_URL} target="_blank" rel="noreferrer">
              {text.open}
            </a>
            {isActive && (
              <button type="button" onClick={leaveDemo}>
                {text.exit}
              </button>
            )}
          </div>
        </div>

        <div className="unilife-live__viewport">
          {!isActive && (
            <img
              className="unilife-live__poster"
              src="/portfolio/unilife-menu-search.png"
              alt={text.posterAlt}
            />
          )}

          {isActive && (
            <iframe
              className={isLoaded ? "is-loaded" : ""}
              src={PRODUCT_URL}
              title={text.frameTitle}
              onLoad={() => setIsLoaded(true)}
              sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-read; clipboard-write"
            />
          )}

          {!isActive ? (
            <div className="unilife-live__gate">
              <p>{text.real}</p>
              <button type="button" onClick={enterDemo} aria-pressed="false">
                <span>{text.start}</span>
                <b aria-hidden="true">↗</b>
              </button>
              <small>{text.hint}</small>
            </div>
          ) : (
            <div className="unilife-live__active-note" aria-live="polite">
              {isLoaded ? text.ready : text.loading}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
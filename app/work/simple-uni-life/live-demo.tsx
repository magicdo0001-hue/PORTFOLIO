"use client";

import { useState } from "react";

const PRODUCT_URL = "https://simpleunilife.com/";

export function SimpleUniLifeLiveDemo() {
  const [isActive, setIsActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const enterDemo = () => {
    setIsLoaded(false);
    setIsActive(true);
  };

  const leaveDemo = () => {
    setIsActive(false);
  };

  return (
    <section id="online-product" className="unilife-live" aria-label="Simple Uni Life 在线产品体验">
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
              新标签页打开 ↗
            </a>
            {isActive && (
              <button type="button" onClick={leaveDemo}>
                退出体验
              </button>
            )}
          </div>
        </div>

        <div className="unilife-live__viewport">
          {!isActive && (
            <img
              className="unilife-live__poster"
              src="/portfolio/unilife-menu-search.png"
              alt="Simple Uni Life 线上产品首页预览"
            />
          )}

          {isActive && (
            <iframe
              className={isLoaded ? "is-loaded" : ""}
              src={PRODUCT_URL}
              title="Simple Uni Life 在线产品体验"
              onLoad={() => setIsLoaded(true)}
              sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-read; clipboard-write"
            />
          )}

          {!isActive ? (
            <div className="unilife-live__gate">
              <p>真实线上产品</p>
              <button type="button" onClick={enterDemo} aria-pressed="false">
                <span>开始在线体验</span>
                <b aria-hidden="true">↗</b>
              </button>
              <small>点击后，滚轮与键盘将用于操作产品</small>
            </div>
          ) : (
            <div className="unilife-live__active-note" aria-live="polite">
              {isLoaded ? "体验已启用 · 使用上方按钮退出" : "正在载入线上产品…"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

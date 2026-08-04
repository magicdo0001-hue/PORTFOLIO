import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";

export const metadata = {
  title: "ENERGIZER PACKAGING | 严文厚",
  description: "电池包装与开启体验项目，详细内容待补充。",
};

export default function BatteryPackagingPage() {
  return (
    <main className="project project--placeholder project--battery">
      <ProjectHero
        index="04"
        title="ENERGIZER PACKAGING"
        category="包装设计"
        period="待补充"
        role="待补充"
        lede="围绕电池包装、信息识别与开启体验的设计项目。"
        image="/portfolio/battery-museum-02.jpeg"
        tone="battery"
      />

      <section className="project-brief" id="story">
        <div className="shell">
          <p className="chapter-label">01 / 项目概要</p>
          <h2>
            项目叙事与研究结论
            <br />
            <span>将在此处补充。</span>
          </h2>
          <p>
            此页面已经建立完整展示结构。后续可补充项目背景、用户问题、设计过程、
            包装结构验证及最终成果。
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>研究目标</strong>
          <p>内容待补充</p>
        </div>
        <div>
          <span>02</span>
          <strong>包装结构</strong>
          <p>内容待补充</p>
        </div>
        <div>
          <span>03</span>
          <strong>使用验证</strong>
          <p>内容待补充</p>
        </div>
      </FactRail>

      <section className="placeholder-gallery shell" aria-label="电池包装项目图片">
        <figure>
          <img
            src="/portfolio/battery-museum-01.jpeg"
            alt="电池包装结构细节"
          />
          <figcaption>结构细节 · 说明待补充</figcaption>
        </figure>
        <figure>
          <img
            src="/portfolio/battery-museum-04.jpeg"
            alt="电池包装开启方式"
          />
          <figcaption>开启体验 · 说明待补充</figcaption>
        </figure>
      </section>

      <section className="placeholder-copy">
        <div className="shell">
          <p className="chapter-label">02 / 后续内容</p>
          <h2>研究、迭代与最终方案待补充。</h2>
          <p>
            当前页面作为内容占位框架保留，后续可以直接替换文字并继续添加过程图片。
          </p>
        </div>
      </section>

      <ProjectEnd
        nextHref="/work/vertical-car-park"
        nextIndex="05"
        nextTitle="VERTICAL CAR PARK"
      />
    </main>
  );
}

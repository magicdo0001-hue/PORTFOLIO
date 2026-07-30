import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";

export const metadata = {
  title: "VERTICAL CAR PARK — 严文厚",
  description: "模块化车架与空间系统项目，详细内容待补充。",
};

export default function VerticalCarParkPage() {
  return (
    <main className="project project--placeholder">
      <ProjectHero
        index="05"
        title="VERTICAL CAR PARK"
        category="工业设计 / 空间系统"
        period="待补充"
        role="待补充"
        lede="围绕模块化车架、垂直收纳与空间效率展开的设计项目。"
        image="/portfolio/frame-museum-02.jpg"
        tone="frame"
      />

      <section className="project-brief project-brief--dark" id="story">
        <div className="shell">
          <p className="chapter-label">01 / 项目概要</p>
          <h2>
            从结构原型到空间系统，
            <br />
            <span>完整过程待补充。</span>
          </h2>
          <p>
            此页面已经预留研究、结构设计、模型制作和验证成果的位置，后续可直接填入项目资料。
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>空间问题</strong>
          <p>内容待补充</p>
        </div>
        <div>
          <span>02</span>
          <strong>模块结构</strong>
          <p>内容待补充</p>
        </div>
        <div>
          <span>03</span>
          <strong>模型验证</strong>
          <p>内容待补充</p>
        </div>
      </FactRail>

      <section className="placeholder-gallery shell" aria-label="车架项目图片">
        <figure>
          <img
            src="/portfolio/frame-museum-01.jpg"
            alt="模块化车架展示模型"
          />
          <figcaption>展示模型 · 说明待补充</figcaption>
        </figure>
        <figure>
          <img
            src="/portfolio/frame-museum-03.jpg"
            alt="车架结构原型细节"
          />
          <figcaption>结构原型 · 说明待补充</figcaption>
        </figure>
      </section>

      <section className="placeholder-copy placeholder-copy--dark">
        <div className="shell">
          <p className="chapter-label">02 / 后续内容</p>
          <h2>结构逻辑、尺寸与测试结果待补充。</h2>
          <p>
            当前页面作为内容占位框架保留，后续可以直接替换文字并继续添加过程图片。
          </p>
        </div>
      </section>

      <ProjectEnd
        nextHref="/work/sangre"
        nextIndex="01"
        nextTitle="SANGRE"
      />
    </main>
  );
}

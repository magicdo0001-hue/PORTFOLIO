import {
  AssetPlaceholder,
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";

export const metadata = {
  title: "Bambino V2 — Wenhou Yan",
  description: "围绕机械锁定和动态反馈的家用意式咖啡机再设计。",
};

export default function BambinoPage() {
  return (
    <main className="project project--bambino">
      <ProjectHero
        index="02"
        title="BAMBINO V2"
        category="PRODUCT REDESIGN"
        period="12 WEEKS"
        role="INDIVIDUAL PROJECT"
        lede="让锁定更稳，让每一次操作都得到清晰回应。"
        image="/portfolio/bambino-hero.jpg"
        tone="bambino"
      />

      <section className="project-brief project-brief--dark" id="story">
        <div className="shell">
          <p className="chapter-label">01 / THE TENSION</p>
          <h2>
            一台小型咖啡机，
            <br />
            不该在锁定手柄时<span>被自己推走。</span>
          </h2>
          <p>
            以 Breville Bambino 为基础，重新设计冲煮头的机械锁定逻辑与动态反馈，在效率、稳定性和感官参与之间建立新的平衡。
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>降低扭矩</strong>
          <p>减少锁定导致的机身位移</p>
        </div>
        <div>
          <span>02</span>
          <strong>动态反馈</strong>
          <p>让机械状态清楚可见</p>
        </div>
        <div>
          <span>03</span>
          <strong>1:1 粗模</strong>
          <p>验证高度、角度与动作</p>
        </div>
      </FactRail>

      <section className="bambino-balance chapter">
        <div className="bambino-balance__copy">
          <p className="chapter-label">02 / USER MOTION</p>
          <h2>先观察动作，再改变机器。</h2>
          <p>
            研究暴露出三个紧密相连的问题：旋转扭矩、操作视角和状态反馈。设计将锁定动作重新分配给结构，并为用户保留清晰的触觉与视觉回应。
          </p>
        </div>
        <figure className="bambino-balance__interaction">
          <img
            src="/portfolio/bambino-interaction.webp"
            alt="Bambino 泡沫模型操作测试"
          />
        </figure>
        <figure className="bambino-balance__build">
          <img src="/portfolio/bambino-build.webp" alt="Bambino 原型制作" />
        </figure>
      </section>

      <section className="bambino-lock">
        <AssetPlaceholder
          className="bambino-lock__visual"
          label="BAMBINO / LOCKING MECHANISM"
          spec="MIN 2000 × 1400 PX · PORTRAIT CROP SAFE"
        />
        <div className="bambino-lock__copy">
          <p className="chapter-label">03 / MECHANISM</p>
          <span className="display-number">↓</span>
          <h2>
            The feedback
            <br />
            is built in.
          </h2>
          <p>
            独立细节模型缩短结构与触感的验证周期；锁定、释放与完成状态通过同一机械语言被感知。
          </p>
        </div>
      </section>

      <section className="bambino-resolution chapter shell">
        <p className="chapter-label">04 / RESOLUTION</p>
        <figure className="bambino-resolution__profile">
          <img
            src="/portfolio/bambino-profile.webp"
            alt="Bambino 侧面产品渲染"
          />
        </figure>
        <figure className="bambino-resolution__hero">
          <img
            src="/portfolio/bambino-prototype.jpg"
            alt="Bambino 一比一实体模型"
          />
        </figure>
        <figure className="bambino-resolution__parts">
          <img
            src="/portfolio/bambino-parts.webp"
            alt="Bambino 结构零件分解"
          />
        </figure>
        <h2>
          One machine.
          <br />
          One coherent action.
        </h2>
      </section>

      <ProjectEnd
        nextHref="/work/simple-uni-life"
        nextIndex="03"
        nextTitle="SIMPLE UNI LIFE"
      />
    </main>
  );
}

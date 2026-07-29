import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";

export const metadata = {
  title: "Simple Uni Life — Wenhou Yan",
  description: "帮助留学生比较课程信息并建立决策信心的数字产品。",
};

export default function SimpleUniLifePage() {
  return (
    <main className="project project--unilife">
      <ProjectHero
        index="03"
        title="SIMPLE UNI LIFE"
        category="DIGITAL PRODUCT"
        period="14 WEEKS"
        role="PRODUCT / UIUX / FRONTEND"
        lede="把散落的学生经验，变成可以比较和判断的信息。"
        image="/portfolio/unilife-hero.webp"
        tone="unilife"
      />

      <section className="project-brief project-brief--orange" id="story">
        <div className="shell">
          <p className="chapter-label">01 / THE CONTEXT</p>
          <h2>
            选课不是搜索问题，
            <br />
            而是一个<span>高风险的小决策。</span>
          </h2>
          <p>
            官方页面告诉学生课程是什么，却很少回答难度、工作量、考核方式和真实体验。平台将这些分散经验组织成可比较的信息。
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>四个决策场景</strong>
          <p>价值最大化、避雷、评分、路径</p>
        </div>
        <div>
          <span>02</span>
          <strong>完整流程</strong>
          <p>搜索、理解、判断、行动</p>
        </div>
        <div>
          <span>03</span>
          <strong>真实上线</strong>
          <p>产品、UI/UX 与前端协作</p>
        </div>
      </FactRail>

      <section className="unilife-problem chapter">
        <div>
          <p className="chapter-label">02 / RESEARCH</p>
          <h2>
            Information everywhere.
            <br />
            Confidence nowhere.
          </h2>
          <p>
            访谈与情境研究显示，学生必须跨越课程官网、社交平台和零散评价，才能拼出一个勉强可用的判断。
          </p>
        </div>
        <figure>
          <img
            src="/portfolio/unilife-layer-01.png"
            alt="Simple Uni Life 留学生选课研究情境"
            loading="lazy"
          />
          <figcaption>RESEARCH CONTEXT · DECISION FRICTION</figcaption>
        </figure>
      </section>

      <section className="unilife-flow chapter">
        <div className="unilife-flow__copy">
          <p className="chapter-label">03 / PRODUCT LOGIC</p>
          <h2>从“找到信息”推进到“完成判断”。</h2>
          <p>
            信息架构围绕学生真实决策顺序展开：输入课程、理解结构、比较体验，最终建立足够的行动信心。
          </p>
        </div>
        <figure>
          <img
            src="/portfolio/unilife-context.webp"
            alt="Simple Uni Life 产品场景"
          />
        </figure>
      </section>

      <section className="screen-rail" aria-label="Simple Uni Life 界面展示">
        <div className="screen-rail__intro">
          <span>04 / INTERFACE SYSTEM</span>
          <strong>DRAG / SCROLL →</strong>
        </div>
        <div className="screen-rail__track">
          <figure>
            <img
              src="/portfolio/unilife-course-search.png"
              alt="Simple Uni Life 移动端课程搜索"
              loading="lazy"
            />
            <figcaption>COURSE SEARCH · MOBILE</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-structured-results.png"
              alt="Simple Uni Life 结构化课程结果"
              loading="lazy"
            />
            <figcaption>STRUCTURED RESULTS</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-layer-04.png"
              alt="Simple Uni Life 课程决策详情页面"
              loading="lazy"
            />
            <figcaption>COURSE DECISION PAGE</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-layer-02.png"
              alt="Simple Uni Life 用户总览界面"
              loading="lazy"
            />
            <figcaption>USER DASHBOARD</figcaption>
          </figure>
        </div>
      </section>

      <section className="unilife-outcome">
        <div className="shell">
          <p className="chapter-label">05 / OUTCOME</p>
          <h2>
            A digital product is complete
            <br />
            when the next decision feels <span>easier.</span>
          </h2>
          <p>
            项目从需求、信息架构和界面规范推进到真实前后端协作，形成可持续迭代的线上产品流程。
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

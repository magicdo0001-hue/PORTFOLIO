import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";
import { SimpleUniLifeLiveDemo } from "./live-demo";

export const metadata = {
  title: "SIMPLE UNI LIFE | 严文厚",
  description: "帮助留学生比较课程信息并建立决策信心的数字产品。",
};

export default function SimpleUniLifePage() {
  return (
    <main className="project project--unilife">
      <ProjectHero
        index="03"
        title="SIMPLE UNI LIFE"
        category="数字产品"
        period="14 周"
        role="产品 / UIUX / 前端"
        lede="把散落的学生经验，变成可以比较和判断的信息。"
        image="/portfolio/unilife-layer-02.png"
        tone="unilife"
      />

      <section className="project-brief project-brief--orange" id="story">
        <div className="shell">
          <p className="chapter-label">01 / 项目背景</p>
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
        <aside className="unilife-problem__copy">
          <p className="chapter-label">02 / 用户研究</p>
          <h2>
            信息无处不在。
            <br />
            信心无处可寻。
          </h2>
          <p>
            访谈与情境研究显示，学生必须跨越课程官网、社交平台和零散评价，才能拼出一个勉强可用的判断。
          </p>
        </aside>
        <div
          className="unilife-problem__media"
          aria-label="Simple Uni Life 用户研究场景"
        >
          <figure className="unilife-problem__lead">
            <img
              src="/portfolio/unilife-friction-search.png"
              alt="留学生在多个课程网站和评价平台之间搜索信息"
              loading="lazy"
            />
            <figcaption>研究情境 · 决策阻力</figcaption>
          </figure>
          <div className="unilife-friction-gallery">
            <figure>
              <img
                src="/portfolio/unilife-friction-paths.png"
                alt="学生面对课程难度、时间冲突和评分信息做选择"
                loading="lazy"
              />
              <figcaption>相互冲突的信息</figcaption>
            </figure>
            <figure>
              <img
                src="/portfolio/unilife-friction-social.png"
                alt="学生被社交平台和群聊中的零散课程信息包围"
                loading="lazy"
              />
              <figcaption>碎片化的社交证据</figcaption>
            </figure>
            <figure>
              <img
                src="/portfolio/unilife-friction-reviews.png"
                alt="学生比较互相矛盾的匿名课程评价"
                loading="lazy"
              />
              <figcaption>不可靠的评价</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="unilife-flow chapter">
        <div className="unilife-flow__copy">
          <p className="chapter-label">03 / 产品逻辑</p>
          <h2>从“找到信息”推进到“完成判断”。</h2>
          <p>
            信息架构围绕学生真实决策顺序展开：输入课程、理解结构、比较体验，最终建立足够的行动信心。
          </p>
        </div>
        <figure>
          <video
            src="/portfolio/unilife-product-story.mp4"
            poster="/portfolio/unilife-video-poster.png"
            aria-label="Simple Uni Life 用户问题情境动画"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
          <figcaption>15 秒产品情境 · 播放 / 暂停</figcaption>
        </figure>
      </section>

      <section className="screen-rail" aria-label="Simple Uni Life 界面展示">
        <div className="screen-rail__intro">
          <span>04 / 界面系统</span>
          <strong>拖动 / 滚动 →</strong>
        </div>
        <div className="screen-rail__track">
          <figure>
            <img
              src="/portfolio/unilife-course-search.png"
              alt="Simple Uni Life 移动端课程搜索"
              loading="lazy"
            />
            <figcaption>课程搜索 · 移动端</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-structured-results.png"
              alt="Simple Uni Life 结构化课程结果"
              loading="lazy"
            />
            <figcaption>结构化结果</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-layer-04.png"
              alt="Simple Uni Life 课程决策详情页面"
              loading="lazy"
            />
            <figcaption>课程决策页</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-course-structure.png"
              alt="Simple Uni Life 课程结构详情界面"
              loading="lazy"
            />
            <figcaption>课程结构</figcaption>
          </figure>
        </div>
      </section>

      <SimpleUniLifeLiveDemo />

      <section className="unilife-outcome">
        <div className="shell">
          <p className="chapter-label">06 / 项目结果</p>
          <h2>
            数字产品真正完成，
            <br />
            是让下一次决定变得 <span>更容易。</span>
          </h2>
          <p>
            项目从需求、信息架构和界面规范推进到真实前后端协作，形成可持续迭代的线上产品流程。
          </p>
        </div>
      </section>

      <ProjectEnd
        nextHref="/work/battery-packaging"
        nextIndex="04"
        nextTitle="ENERGIZER PACKAGING"
      />
    </main>
  );
}

import Link from "next/link";
import HomeProjectWheel from "./home-project-wheel";
import { ContactFooter, SiteHeader } from "./project-shell";
import SphereProjectMenu from "./work/sphere-project-menu";

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero" id="top">
        <SiteHeader />
        <div className="home-hero__layout shell">
          <div className="home-hero__intro">
            <div className="home-hero__proof">
              <span>
                <img src="/portfolio/sangre-hero.webp" alt="" />
                <img src="/portfolio/bambino-hero.jpg" alt="" />
                <img src="/portfolio/unilife-hero.webp" alt="" />
              </span>
              <p>3 个精选项目 · 产品 / UIUX / 工程</p>
            </div>
            <h1>
              把研究推进为
              <br />
              <em>可用的产品。</em>
            </h1>
            <p className="home-hero__statement">
              在工业设计、交互与工程之间，
              <br />
              把复杂问题推进到可制造、可测试、可使用。
            </p>
            <Link className="home-hero__cta" href="/work">
              <span aria-hidden="true">↘</span>
              查看精选项目
            </Link>
          </div>

          <HomeProjectWheel />

          <ol className="home-hero__process" aria-label="设计工作流程">
            <li>
              <i aria-hidden="true">◇</i>
              <span>研究</span>
              <small>01</small>
            </li>
            <li>
              <i aria-hidden="true">⌁</i>
              <span>定义</span>
              <small>02</small>
            </li>
            <li>
              <i aria-hidden="true">◎</i>
              <span>原型</span>
              <small>03</small>
            </li>
            <li>
              <i aria-hidden="true">↗</i>
              <span>落地</span>
              <small>04</small>
            </li>
          </ol>
        </div>
      </section>

      <section className="manifesto">
        <div className="shell">
          <p>
            从问题、证据到可验证的原型。我的工作跨越工业设计、交互与工程，
            关注产品如何真正被理解、制造和使用。
          </p>
          <span className="manifesto__mark" aria-hidden="true">
            WY
          </span>
        </div>
      </section>

      <section className="profile-statement" id="profile">
        <div className="profile-statement__shapes" aria-hidden="true" />
        <div className="shell">
          <p>关于我 / 2026</p>
          <h2>
            研究围绕 <span>目标。</span>
            <br />
            工程依靠 <span>证据。</span>
            <br />
            设计追求 <span>清晰。</span>
          </h2>
          <img src="/portfolio/wenhou-yan.jpg" alt="严文厚个人照片" />
        </div>
      </section>

      <section className="profile-detail shell">
        <div>
          <span>01</span>
          <h3>工业设计与工程</h3>
          <p>CAD、DFM、CMF、结构验证与快速制造。</p>
        </div>
        <div>
          <span>02</span>
          <h3>交互与数字产品</h3>
          <p>用户研究、信息架构、UI/UX 与前端协作。</p>
        </div>
        <div>
          <span>03</span>
          <h3>原型与真实测试</h3>
          <p>FDM、真空成型、装配验证与可用性迭代。</p>
        </div>
        <aside>
          <p>
            USYD 交互设计与电子艺术硕士
            <br />
            UNSW 工业设计学士
          </p>
          <a href="/wenhou-yan-resume.pdf" download>
            下载简历 ↗
          </a>
        </aside>
      </section>

      <section
        className="work-index__hero home-work-index"
        id="work"
        aria-label="精选项目"
      >
        <SphereProjectMenu />
      </section>

      <ContactFooter />
    </main>
  );
}

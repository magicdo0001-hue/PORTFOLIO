import Link from "next/link";
import HomeProjectWheel from "./home-project-wheel";
import { SiteHeader } from "./project-shell";
import SphereProjectMenu from "./work/sphere-project-menu";
import FadeContent from "./fade-content";

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero" id="top">
        <SiteHeader showLanguage />
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
              查看全部项目
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


      <FadeContent>
      <section className="profile-about" id="profile" aria-labelledby="profile-about-title">
        <div className="profile-about__layout shell">
          <figure className="profile-about__portrait">
            <img src="/portfolio/wenhou-yan.jpg" alt="严文厚个人照片" />
          </figure>

          <div className="profile-about__content">
            <p className="profile-about__eyebrow">关于我</p>
            <h2 id="profile-about-title">
              我是严文厚。
              <br />
              一名连接
              <br />
              <span>设计与工程</span>的产品设计师。
            </h2>
            <div className="profile-about__bio">
              <p>
                我目前在 USYD 攻读交互设计与电子艺术硕士，拥有 UNSW
                工业设计背景。我的工作横跨工业设计、数字产品与工程实现。
              </p>
              <p>
                我关注复杂问题如何从研究证据转化为清晰的产品决策，并通过结构模型、交互原型和真实测试，把方案推进到可制造、可维护和可使用。
              </p>
            </div>

            <ul className="profile-about__disciplines" aria-label="软件技能">
              <li>
                <span className="profile-about__software-icon">
                  <img src="/software-icons/solidworks.svg" alt="" aria-hidden="true" />
                </span>
                <span>
                  <strong>SolidWorks</strong>
                  <small>CAD · DFM</small>
                </span>
              </li>
              <li>
                <span className="profile-about__software-icon">
                  <img src="/software-icons/rhino.svg" alt="" aria-hidden="true" />
                </span>
                <span>
                  <strong>Rhino</strong>
                  <small>曲面建模</small>
                </span>
              </li>
              <li>
                <span className="profile-about__software-icon">
                  <img src="/software-icons/figma.svg" alt="" aria-hidden="true" />
                </span>
                <span>
                  <strong>Figma</strong>
                  <small>界面 · 原型</small>
                </span>
              </li>
              <li>
                <span className="profile-about__software-icon">
                  <img src="/software-icons/photoshop.svg" alt="" aria-hidden="true" />
                </span>
                <span>
                  <strong>Photoshop</strong>
                  <small>图像处理</small>
                </span>
              </li>
              <li>
                <span className="profile-about__software-icon">
                  <img src="/software-icons/illustrator.svg" alt="" aria-hidden="true" />
                </span>
                <span>
                  <strong>Illustrator</strong>
                  <small>矢量绘制</small>
                </span>
              </li>
              <li>
                <span className="profile-about__software-icon">
                  <img src="/software-icons/indesign.svg" alt="" aria-hidden="true" />
                </span>
                <span>
                  <strong>InDesign</strong>
                  <small>版式 · 交付</small>
                </span>
              </li>
            </ul>

            <div className="profile-about__footer">
              <a className="profile-about__resume" href="/wenhou-yan-resume.pdf" download>
                下载简历 <span aria-hidden="true">↗</span>
              </a>
              <p>
                USYD 硕士在读
                <br />
                UNSW 工业设计学士
              </p>
            </div>
          </div>
        </div>

      </section>
      </FadeContent>

      <FadeContent delay={80}>
      <section className="profile-capabilities" aria-labelledby="profile-capabilities-title">
        <header className="profile-capabilities__header shell">
          <p>能力范围</p>
          <h2 id="profile-capabilities-title">我能推进的工作</h2>
        </header>

        <div className="profile-capabilities__grid shell">
          <article>
            <span>01</span>
            <h3>产品策略与研究</h3>
            <p>通过访谈、情境观察与任务分析，把模糊问题整理为可验证的设计目标。</p>
          </article>
          <article>
            <span>02</span>
            <h3>工业设计与结构</h3>
            <p>使用 CAD、DFM 与 CMF 推进外观、结构和制造约束之间的平衡。</p>
          </article>
          <article>
            <span>03</span>
            <h3>交互与界面系统</h3>
            <p>构建信息架构、关键流程和高保真界面，让复杂功能更容易被理解。</p>
          </article>
          <article>
            <span>04</span>
            <h3>原型与真实测试</h3>
            <p>通过 FDM、真空成型、交互原型和可用性测试快速验证核心假设。</p>
          </article>
          <article>
            <span>05</span>
            <h3>工程协同与制造</h3>
            <p>围绕结构约束、装配验证与制造沟通持续迭代，让方案能够真正落地。</p>
          </article>
          <article>
            <span>06</span>
            <h3>前端原型与交付</h3>
            <p>把界面设计转化为可操作的网页原型，支持评审、测试和开发协作。</p>
          </article>
        </div>
      </section>
      </FadeContent>

      <FadeContent distance={52}>
      <section
        className="work-index__hero home-work-index"
        id="work"
        aria-label="精选项目"
      >
        <SphereProjectMenu />
      </section>
      </FadeContent>

      <FadeContent distance={36}>
      <section className="profile-contact" id="contact" aria-labelledby="profile-contact-title">
        <div className="profile-contact__inner shell">
          <header className="profile-contact__header">
            <p>联系方式 / CONTACT</p>
            <h2 id="profile-contact-title">
              有新的产品问题，
              <br />
              欢迎与我联系。
            </h2>
          </header>

          <dl className="profile-contact__list">
            <div>
              <dt>邮箱</dt>
              <dd>
                <a href="mailto:18705188117@163.com">
                  18705188117@163.com <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
            <div>
              <dt>手机</dt>
              <dd className="profile-contact__phones">
                <a href="tel:+8618705188117">+86 18705188117</a>
                <a href="tel:+61449923613">+61 449923613</a>
              </dd>
            </div>
            <div>
              <dt>微信</dt>
              <dd><span className="profile-contact__empty" aria-label="待补充">—</span></dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a
                  href="https://www.linkedin.com/in/wenhou-yan-3546653b8"
                  target="_blank"
                  rel="noreferrer"
                >
                  查看个人主页 <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
          </dl>

          <footer className="profile-contact__footer">
            <span>© 2026 严文厚</span>
            <a href="#profile">返回关于 <span aria-hidden="true">↑</span></a>
          </footer>
        </div>
      </section>
      </FadeContent>
    </main>
  );
}

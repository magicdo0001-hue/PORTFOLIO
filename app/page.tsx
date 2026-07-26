import Link from "next/link";
import { ContactFooter, SiteHeader } from "./project-shell";

const projects = [
  {
    index: "01",
    href: "/work/sangre",
    className: "home-case--sangre",
    title: "SANGRE",
    type: "MEDICAL PRODUCT / 14 WEEKS",
    image: "/portfolio/sangre-hero.webp",
    copy: "把血脂、血糖与尿酸检测，组织成更低负担的家庭健康流程。",
  },
  {
    index: "02",
    href: "/work/bambino",
    className: "home-case--bambino",
    title: "BAMBINO V2",
    type: "PRODUCT REDESIGN / 12 WEEKS",
    image: "/portfolio/bambino-hero.jpg",
    copy: "重新设计机械锁定与动态反馈，让每一次操作都更稳、更清楚。",
  },
  {
    index: "03",
    href: "/work/simple-uni-life",
    className: "home-case--unilife",
    title: "SIMPLE UNI LIFE",
    type: "DIGITAL PRODUCT / 14 WEEKS",
    image: "/portfolio/unilife-hero.webp",
    copy: "把散落的学生经验，转化为可以比较、判断和行动的课程信息。",
  },
];

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero" id="top">
        <SiteHeader />
        <div className="home-hero__image" aria-hidden="true">
          <img src="/portfolio/sangre-hero.webp" alt="" />
        </div>
        <div className="home-hero__grid shell">
          <p className="micro">
            PRODUCT DESIGNER
            <br />
            NANJING / SYDNEY
          </p>
          <h1>
            WENHOU
            <br />
            <span>YAN</span>
          </h1>
          <p className="home-hero__statement">
            我在研究、工程与界面之间工作，
            <br />
            把概念推进到<span>真实可用</span>。
          </p>
          <a className="scroll-cue" href="#work">
            SELECTED WORK <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="manifesto">
        <div className="shell">
          <p>
            Industrial design is not the final image. It is the chain of
            decisions that makes an idea manufacturable, testable and useful.
          </p>
          <span className="manifesto__mark" aria-hidden="true">
            ✣
          </span>
        </div>
      </section>

      <section className="project-index" id="work" aria-label="精选项目">
        {projects.map((project) => (
          <article
            className={`home-case ${project.className}`}
            key={project.href}
          >
            <Link href={project.href} aria-label={`查看 ${project.title} 案例`}>
              <div className="home-case__chrome shell">
                <span>{project.index} / 03</span>
                <span>{project.type}</span>
                <span>VIEW CASE ↗</span>
              </div>
              <div className="home-case__stage shell">
                <div className="home-case__copy">
                  <p>{project.copy}</p>
                  <h2>{project.title}</h2>
                </div>
                <figure>
                  <img src={project.image} alt={`${project.title} 项目`} />
                </figure>
                <strong aria-hidden="true">{project.index}</strong>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <section className="profile-statement" id="profile">
        <div className="profile-statement__shapes" aria-hidden="true" />
        <div className="shell">
          <p>PROFILE / 2026</p>
          <h2>
            Research with <span>purpose.</span>
            <br />
            Engineering with <span>evidence.</span>
            <br />
            Design with <span>clarity.</span>
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
            DOWNLOAD RESUME ↗
          </a>
        </aside>
      </section>

      <ContactFooter />
    </main>
  );
}

import Link from "next/link";
import HomeProjectWheel from "./home-project-wheel";
import { SiteHeader } from "./project-shell";
import SphereProjectMenu from "./work/sphere-project-menu";
import FadeContent from "./fade-content";

export type HomeLocale = "zh" | "en";

const copy = {
  zh: {
    proof: "3 个精选项目 · 产品 / UIUX / 工程",
    heroLead: "把研究推进为",
    heroEmphasis: "可用的产品。",
    statement: ["在工业设计、交互与工程之间，", "把复杂问题推进到可制造、可测试、可使用。"],
    viewWork: "查看全部项目",
    processLabel: "设计工作流程",
    process: ["研究", "定义", "原型", "落地"],
    portraitAlt: "严文厚个人照片",
    aboutEyebrow: "关于我",
    aboutTitle: ["我是严文厚。", "一名连接", "设计与工程", "的产品设计师。"],
    bio: [
      "我目前在 USYD 攻读交互设计与电子艺术硕士，拥有 UNSW 工业设计背景。我的工作横跨工业设计、数字产品与工程实现。",
      "我关注复杂问题如何从研究证据转化为清晰的产品决策，并通过结构模型、交互原型和真实测试，把方案推进到可制造、可维护和可使用。",
    ],
    skillsLabel: "软件技能",
    skillNotes: ["CAD · DFM", "曲面建模", "界面 · 原型", "图像处理", "矢量绘制", "版式 · 交付"],
    resume: "下载简历",
    education: ["USYD 硕士在读", "UNSW 工业设计学士"],
    capabilitiesEyebrow: "能力范围",
    capabilitiesTitle: "我能推进的工作",
    capabilities: [
      ["产品策略与研究", "通过访谈、情境观察与任务分析，把模糊问题整理为可验证的设计目标。"],
      ["工业设计与结构", "使用 CAD、DFM 与 CMF 推进外观、结构和制造约束之间的平衡。"],
      ["交互与界面系统", "构建信息架构、关键流程和高保真界面，让复杂功能更容易被理解。"],
      ["原型与真实测试", "通过 FDM、真空成型、交互原型和可用性测试快速验证核心假设。"],
      ["工程协同与制造", "围绕结构约束、装配验证与制造沟通持续迭代，让方案能够真正落地。"],
      ["前端原型与交付", "把界面设计转化为可操作的网页原型，支持评审、测试和开发协作。"],
    ],
    workLabel: "精选项目",
    contactEyebrow: "联系方式 / CONTACT",
    contactTitle: ["有新的产品问题，", "欢迎与我联系。"],
    email: "邮箱",
    phone: "手机",
    wechat: "微信",
    linkedin: "LinkedIn",
    linkedinText: "查看个人主页",
    pending: "待补充",
    copyright: "© 2026 严文厚",
    back: "返回关于",
  },
  en: {
    proof: "3 SELECTED PROJECTS · PRODUCT / UIUX / ENGINEERING",
    heroLead: "Research into",
    heroEmphasis: "usable products.",
    statement: [
      "Working across industrial design, interaction and engineering,",
      "I turn complex problems into products that can be built, tested and used.",
    ],
    viewWork: "View selected work",
    processLabel: "Design process",
    process: ["Research", "Define", "Prototype", "Deliver"],
    portraitAlt: "Portrait of Wenhou Yan",
    aboutEyebrow: "About",
    aboutTitle: ["I'm Wenhou Yan.", "A product designer connecting", "design and engineering", "."],
    bio: [
      "I am completing a Master of Interaction Design and Electronic Arts at USYD, following a background in Industrial Design at UNSW. My practice spans physical products, digital experiences and engineering implementation.",
      "I turn research evidence into clear product decisions, then use structural models, interactive prototypes and real-world testing to make ideas buildable, maintainable and useful.",
    ],
    skillsLabel: "Design software",
    skillNotes: ["CAD · DFM", "Surface modelling", "Interface · Prototyping", "Image editing", "Vector graphics", "Layout · Delivery"],
    resume: "Download résumé",
    education: ["MIDEA candidate · USYD", "BDes Industrial Design · UNSW"],
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "What I can move forward",
    capabilities: [
      ["Product strategy & research", "Interviews, contextual observation and task analysis turn ambiguous problems into testable design goals."],
      ["Industrial design & structure", "CAD, DFM and CMF balance form, structure and manufacturing constraints."],
      ["Interaction & interface systems", "Information architecture, key flows and high-fidelity interfaces make complex products easier to understand."],
      ["Prototyping & real-world testing", "FDM, vacuum forming, interactive prototypes and usability testing quickly validate the assumptions that matter."],
      ["Engineering & manufacturing", "Structural constraints, assembly validation and manufacturer communication keep concepts moving toward production."],
      ["Front-end prototypes & delivery", "Interface designs become working web prototypes for reviews, testing and developer collaboration."],
    ],
    workLabel: "Selected projects",
    contactEyebrow: "CONTACT",
    contactTitle: ["Have a product problem", "worth exploring? Let's talk."],
    email: "Email",
    phone: "Phone",
    wechat: "WeChat",
    linkedin: "LinkedIn",
    linkedinText: "View profile",
    pending: "To be added",
    copyright: "© 2026 Wenhou Yan",
    back: "Back to about",
  },
} as const;

const software = [
  ["solidworks", "SolidWorks"],
  ["rhino", "Rhino"],
  ["figma", "Figma"],
  ["photoshop", "Photoshop"],
  ["illustrator", "Illustrator"],
  ["indesign", "InDesign"],
] as const;

export function HomePage({ locale = "zh" }: { locale?: HomeLocale }) {
  const text = copy[locale];
  const isEnglish = locale === "en";

  return (
    <main className={`home home--${locale}`} lang={isEnglish ? "en" : "zh-CN"}>
      <section className="home-hero" id="top">
        <SiteHeader locale={locale} showLanguage />
        <div className="home-hero__layout shell">
          <div className="home-hero__intro">
            <div className="home-hero__proof">
              <span>
                <img src="/portfolio/sangre-hero.webp" alt="" />
                <img src="/portfolio/bambino-hero.jpg" alt="" />
                <img src="/portfolio/unilife-hero.webp" alt="" />
              </span>
              <p>{text.proof}</p>
            </div>
            <h1>
              {text.heroLead}
              <br />
              <em>{text.heroEmphasis}</em>
            </h1>
            <p className="home-hero__statement">
              {text.statement[0]}
              <br />
              {text.statement[1]}
            </p>
            <Link className="home-hero__cta" href={isEnglish ? "/en#work" : "/work"}>
              <span aria-hidden="true">↘</span>
              {text.viewWork}
            </Link>
          </div>

          <HomeProjectWheel locale={locale} />

          <ol className="home-hero__process" aria-label={text.processLabel}>
            {text.process.map((label, index) => (
              <li key={label}>
                <i aria-hidden="true">{["◇", "⌁", "◎", "↗"][index]}</i>
                <span>{label}</span>
                <small>0{index + 1}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FadeContent>
        <section className="profile-about" id="profile" aria-labelledby="profile-about-title">
          <div className="profile-about__layout shell">
            <figure className="profile-about__portrait">
              <img src="/portfolio/wenhou-yan.jpg" alt={text.portraitAlt} />
            </figure>

            <div className="profile-about__content">
              <p className="profile-about__eyebrow">{text.aboutEyebrow}</p>
              <h2 id="profile-about-title">
                {text.aboutTitle[0]}
                <br />
                {text.aboutTitle[1]}
                <br />
                <span>{text.aboutTitle[2]}</span>{text.aboutTitle[3]}
              </h2>
              <div className="profile-about__bio">
                {text.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <ul className="profile-about__disciplines" aria-label={text.skillsLabel}>
                {software.map(([icon, name], index) => (
                  <li key={name}>
                    <span className="profile-about__software-icon">
                      <img src={`/software-icons/${icon}.svg`} alt="" aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{name}</strong>
                      <small>{text.skillNotes[index]}</small>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="profile-about__footer">
                <a className="profile-about__resume" href="/wenhou-yan-resume.pdf" download>
                  {text.resume} <span aria-hidden="true">↗</span>
                </a>
                <p>
                  {text.education[0]}
                  <br />
                  {text.education[1]}
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeContent>

      <FadeContent delay={80}>
        <section className="profile-capabilities" aria-labelledby="profile-capabilities-title">
          <header className="profile-capabilities__header shell">
            <p>{text.capabilitiesEyebrow}</p>
            <h2 id="profile-capabilities-title">{text.capabilitiesTitle}</h2>
          </header>

          <div className="profile-capabilities__grid shell">
            {text.capabilities.map(([title, description], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </FadeContent>

      <FadeContent distance={52}>
        <section className="work-index__hero home-work-index" id="work" aria-label={text.workLabel}>
          <SphereProjectMenu locale={locale} />
        </section>
      </FadeContent>

      <FadeContent distance={36}>
        <section className="profile-contact" id="contact" aria-labelledby="profile-contact-title">
          <div className="profile-contact__inner shell">
            <header className="profile-contact__header">
              <p>{text.contactEyebrow}</p>
              <h2 id="profile-contact-title">
                {text.contactTitle[0]}
                <br />
                {text.contactTitle[1]}
              </h2>
            </header>

            <dl className="profile-contact__list">
              <div>
                <dt>{text.email}</dt>
                <dd>
                  <a href="mailto:18705188117@163.com">
                    18705188117@163.com <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt>{text.phone}</dt>
                <dd className="profile-contact__phones">
                  <a href="tel:+8618705188117">+86 18705188117</a>
                  <a href="tel:+61449923613">+61 449923613</a>
                </dd>
              </div>
              <div>
                <dt>{text.wechat}</dt>
                <dd><span className="profile-contact__empty" aria-label={text.pending}>—</span></dd>
              </div>
              <div>
                <dt>{text.linkedin}</dt>
                <dd>
                  <a href="https://www.linkedin.com/in/wenhou-yan-3546653b8" target="_blank" rel="noreferrer">
                    {text.linkedinText} <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
            </dl>

            <footer className="profile-contact__footer">
              <span>{text.copyright}</span>
              <a href="#profile">{text.back} <span aria-hidden="true">↑</span></a>
            </footer>
          </div>
        </section>
      </FadeContent>
    </main>
  );
}


const projects = [
  {
    index: "01",
    id: "sangre",
    title: "SANGRE",
    subtitle: "家庭心血管监测设备",
    period: "14 周",
    role: "主设计师",
    tools: "SolidWorks · KeyShot · Figma · FDM",
    hero: "/portfolio/sangre-hero.jpg",
    supporting: [
      "/portfolio/sangre-prototype.jpg",
      "/portfolio/sangre-exploded.jpg",
    ],
    statement: "把复杂血检，收进一台愿意长期使用的家庭设备。",
    description:
      "将血脂四项、血糖与尿酸检测整合进紧凑的桌面设备，把试纸、采血组件、结果读取与收纳组织为一条更低负担的家庭检测流程。",
    highlights: [
      "研究慢性病管理、反射光度法与竞品工作流",
      "完成草图、泡沫模型、FDM 与真空成型迭代",
      "制作具备完整操作动作的 1:1 功能模型",
    ],
  },
  {
    index: "02",
    id: "bambino",
    title: "BAMBINO V2",
    subtitle: "家用意式咖啡机再设计",
    period: "12 周",
    role: "个人项目",
    tools: "SolidWorks · Rhino · KeyShot · Prototyping",
    hero: "/portfolio/bambino-hero.jpg",
    supporting: [
      "/portfolio/bambino-prototype.jpg",
      "/portfolio/bambino-detail.png",
    ],
    statement: "让锁定更稳，让每一次操作都得到清晰回应。",
    description:
      "以 Breville Bambino 为基础，重新设计冲煮头的机械锁定逻辑与动态交互反馈，在效率、稳定性与感官参与之间建立新的平衡。",
    highlights: [
      "降低手柄接合时导致机身位移的旋转扭矩",
      "以 1:1 粗模验证高度、屏幕角度与操作习惯",
      "用独立细节模型加速结构与触感迭代",
    ],
  },
  {
    index: "03",
    id: "unilife",
    title: "SIMPLE UNI LIFE",
    subtitle: "留学生选课决策平台",
    period: "14 周",
    role: "产品 / UI/UX / 前端协作",
    tools: "Figma · Codex · User Research",
    hero: "/portfolio/unilife-hero.png",
    supporting: [
      "/portfolio/unilife-context.png",
      "/portfolio/unilife-mobile.png",
    ],
    statement: "把散落的学生经验，变成可以比较和判断的信息。",
    description:
      "围绕课程搜索、结构化评分与真实评价，补足官方课程页之外的学生视角，让用户不必跨平台搜集信息也能完成高风险的小决策。",
    highlights: [
      "将碎片化信息组织为搜索、理解、判断、行动",
      "围绕难度、工作量、评分与考核方式设计详情页",
      "协同前后端把概念推进到真实上线流程",
    ],
  },
];

const experience = [
  {
    date: "2025.09 — 至今",
    company: "独立增材制造工作室",
    role: "独立设计与制造负责人",
    note: "从需求沟通、模型修复到 FDM 生产，累计完成数百项定制制造订单。",
  },
  {
    date: "2026.01 — 2026.06",
    company: "海客谈网络科技有限公司",
    role: "UI 设计师 · 产品协调",
    note: "负责 Simple Uni Life 的产品 0→1 UI/UX、规范搭建与跨团队落地。",
  },
  {
    date: "2025.04 — 2025.07",
    company: "Sunswift 太阳能车队",
    role: "产品设计与制造支持",
    note: "参与赛车驾驶系统周边零部件的建模、装配验证、制造与持续迭代。",
  },
  {
    date: "2023.10 — 2024.01",
    company: "华设设计集团",
    role: "效果图渲染实习",
    note: "完成三维场景搭建、方案可视化与 AI 辅助概念表达。",
  },
];

const capabilities = [
  ["01", "研究与策略", "用户研究 · 市场调研 · 需求分析 · 系统分析"],
  ["02", "设计与工程", "工业设计 · CAD 建模 · DFM · CMF"],
  ["03", "原型与制造", "FDM 3D 打印 · 真空成型 · 装配验证 · 车间加工"],
  ["04", "数字与表达", "UI/UX · Figma · Blender · KeyShot · ComfyUI"],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <header className="nav shell">
          <a className="brand" href="#top" aria-label="返回首页">
            <span>WY</span>
            <small>WENHOU YAN</small>
          </a>
          <nav aria-label="主导航">
            <a href="#work">项目</a>
            <a href="#about">关于</a>
            <a href="#experience">经历</a>
          </nav>
          <a className="nav-contact" href="#contact">
            联系我 <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="hero-visual" aria-hidden="true">
          <img src="/portfolio/sangre-hero.jpg" alt="" />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content shell">
          <p className="eyebrow">
            <span className="status-dot" />
            PRODUCT DESIGNER · NANJING / SYDNEY
          </p>
          <h1>
            把研究与工程，
            <br />
            做成<span>可用的产品。</span>
          </h1>
          <div className="hero-footer">
            <p>
              严文厚 / Wenhou Yan
              <br />
              工业设计 · UI/UX · 快速原型
            </p>
            <a href="#work">
              SELECTED WORK <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section className="intro section shell" id="about">
        <div className="section-label">
          <span>01</span>
          <p>PROFILE / 关于</p>
        </div>
        <div className="intro-grid">
          <div className="portrait">
            <img src="/portfolio/wenhou-yan.jpg" alt="严文厚个人照片" />
            <p>WENHOU “TOMIC” YAN</p>
          </div>
          <div className="intro-copy">
            <p className="kicker">PHYSICAL × DIGITAL</p>
            <h2>
              从用户需求出发，
              <br />
              让概念经得起<span>制造与使用</span>。
            </h2>
            <p className="intro-text">
              我拥有新南威尔士大学工业设计学士背景，并于悉尼大学完成交互设计与电子艺术硕士学习。
              我的工作覆盖产品研究、CAD 建模、快速原型、制造验证与数字界面，擅长把用户需求转化为可制造、可测试、可持续迭代的产品方案。
            </p>
            <div className="education">
              <div>
                <time>2025.02 — 2026.05</time>
                <strong>悉尼大学 USYD</strong>
                <span>交互设计与电子艺术 · 硕士</span>
              </div>
              <div>
                <time>2021.09 — 2024.07</time>
                <strong>新南威尔士大学 UNSW</strong>
                <span>工业设计 · 学士</span>
              </div>
            </div>
          </div>
        </div>
        <div className="metrics" aria-label="个人概览">
          <div>
            <strong>03</strong>
            <span>核心案例</span>
          </div>
          <div>
            <strong>100+</strong>
            <span>定制制造订单</span>
          </div>
          <div>
            <strong>02</strong>
            <span>设计相关学位</span>
          </div>
          <div>
            <strong>CN / EN</strong>
            <span>双语工作</span>
          </div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell work-heading">
          <div className="section-label">
            <span>02</span>
            <p>SELECTED WORK / 精选项目</p>
          </div>
          <h2>Three projects.<br />One complete process.</h2>
          <p>从研究与概念，到结构、原型、界面与真实落地。</p>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <article className="case" id={project.id} key={project.id}>
              <div className="case-head shell">
                <span className="case-index">{project.index}</span>
                <div>
                  <p>{project.subtitle}</p>
                  <h3>{project.title}</h3>
                </div>
                <p className="case-statement">{project.statement}</p>
              </div>

              <figure className="case-hero">
                <img src={project.hero} alt={`${project.title} 项目主视觉`} />
              </figure>

              <div className="case-body shell">
                <div className="case-meta">
                  <div>
                    <span>周期</span>
                    <strong>{project.period}</strong>
                  </div>
                  <div>
                    <span>角色</span>
                    <strong>{project.role}</strong>
                  </div>
                  <div>
                    <span>工具</span>
                    <strong>{project.tools}</strong>
                  </div>
                </div>
                <div className="case-summary">
                  <p>{project.description}</p>
                  <ul>
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="case-gallery shell">
                <figure>
                  <img
                    src={project.supporting[0]}
                    alt={`${project.title} 原型与验证`}
                  />
                </figure>
                <figure>
                  <img
                    src={project.supporting[1]}
                    alt={`${project.title} 设计细节`}
                  />
                </figure>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience section shell" id="experience">
        <div className="section-label">
          <span>03</span>
          <p>EXPERIENCE / 经历</p>
        </div>
        <div className="experience-heading">
          <h2>Design, make,<br />test, repeat.</h2>
          <p>
            从企业协作到独立制造，我把设计决策放回真实的工程、生产和用户反馈中检验。
          </p>
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article key={`${item.date}-${item.company}`}>
              <time>{item.date}</time>
              <div>
                <h3>{item.company}</h3>
                <p>{item.role}</p>
              </div>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities section shell" id="capabilities">
        <div className="section-label">
          <span>04</span>
          <p>CAPABILITIES / 能力</p>
        </div>
        <div className="capability-grid">
          {capabilities.map(([index, title, text]) => (
            <article key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-inner shell">
          <p className="eyebrow">
            <span className="status-dot" />
            OPEN TO PRODUCT DESIGN OPPORTUNITIES
          </p>
          <h2>
            Let&apos;s make
            <br />
            something <span>real.</span>
          </h2>
          <div className="contact-row">
            <a href="mailto:wyan39702@gmail.com">
              wyan39702@gmail.com <span aria-hidden="true">↗</span>
            </a>
            <div className="contact-links">
              <a href="/wenhou-yan-resume.pdf" download>
                下载简历 ↓
              </a>
              <a href="tel:+8618705188117">+86 187 0518 8117</a>
              <a href="tel:+61449923613">+61 0449 923 613</a>
              <a
                href="https://www.linkedin.com/in/wenhou-yan-3546653b8"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
          <footer>
            <span>© 2026 WENHOU YAN</span>
            <span>PRODUCT · INTERACTION · PROTOTYPING</span>
            <a href="#top">BACK TO TOP ↑</a>
          </footer>
        </div>
      </section>
    </main>
  );
}

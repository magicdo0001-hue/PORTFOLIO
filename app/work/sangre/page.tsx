import Image from "next/image";
import Link from "next/link";
import SangreShowcase from "./showcase";
import {
  FactRail,
  ProjectEnd,
} from "../../project-shell";

export const metadata = {
  title: "SANGRE | 严文厚",
  description: "家庭心血管监测设备设计：从研究、结构到一比一实体交互原型。",
};

export default function SangrePage() {
  return (
    <main className="project project--sangre">
      <SangreShowcase />

      <div className="sangre-case-study" id="story">
        <header className="sangre-case-nav">
          <Link href="/" aria-label="SANGRE，返回作品集">SANGRE</Link>
          <nav aria-label="案例导航">
            <a href="#showcase">产品展示</a>
            <a href="/en/work/sangre#story" hrefLang="en">EN</a>
          </nav>
        </header>
      <section className="project-brief">
        <div className="shell">
          <p className="chapter-label">01 / 项目概要</p>
          <h2>
            慢性病管理需要的，
            <br />
            不是更多设备，而是<span>更少负担。</span>
          </h2>
          <div className="sangre-case-intro"><p>
            SANGRE 将血脂四项、血糖与尿酸检测整合进紧凑的桌面设备，
            把试纸、采血组件、结果读取与收纳组织成一条连续流程。
          </p>
          <p>1:1 实体交互原型用于验证操作与结构；网页读数为界面演示数据。</p></div>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>六项指标</strong>
          <p>血脂四项、血糖、尿酸</p>
        </div>
        <div>
          <span>02</span>
          <strong>1:1 原型</strong>
          <p>完整操作动作验证</p>
        </div>
        <div>
          <span>03</span>
          <strong>制造闭环</strong>
          <p>FDM、真空成型、装配</p>
        </div>
      </FactRail>

      <section className="sangre-discovery chapter">
        <aside>
          <p className="chapter-label">02 / 研究发现</p>
          <h2>把研究转化成产品结构。</h2>
          <p>
            从慢性病管理与反射光度法出发，设计不只回答外观，还要同时处理试纸路径、采血动作、耗材收纳和清洁维护。
          </p>
        </aside>
        <div className="sangre-discovery__media">
          <figure>
            <Image unoptimized width={1586} height={992}
              src="/portfolio/sangre-form-studies.png"
              alt="SANGRE 外观形态与功能分区研究"
              loading="lazy"
            />
            <figcaption>形态研究 · 产品架构</figcaption>
          </figure>
          <figure>
            <Image unoptimized width={2000} height={2000}
              src="/portfolio/sangre-volume-iteration.jpg"
              alt="SANGRE 机身体量与耗材区域迭代"
              loading="lazy"
            />
            <figcaption>体量迭代 · 细节研究</figcaption>
          </figure>
          <figure>
            <Image unoptimized width={3648} height={2736}
              src="/portfolio/sangre-vacuum-forming.jpg"
              alt="SANGRE 实体模型制作与体量验证"
              loading="lazy"
            />
            <figcaption>实体制作 · 体量验证</figcaption>
          </figure>
        </div>
      </section>

      <section className="sangre-prototype chapter">
        <div className="sangre-prototype__image">
          <Image unoptimized width={2400} height={1600}
            src="/portfolio/sangre-prototype.webp"
            alt="SANGRE 一比一实体交互原型"
          />
        </div>
        <div className="sangre-prototype__copy">
          <p className="chapter-label">03 / 原型验证</p>
          <span className="display-number">1:1</span>
          <h2>从体量模型，到可完整操作的交互原型。</h2>
          <p>
            多轮实体模型用于验证屏幕角度、耗材接近性、试纸操作和收纳逻辑。每一次制造，都直接改变下一轮设计决策。
          </p>
          <figure>
            <Image unoptimized width={2000} height={2000}
              src="/portfolio/sangre-interaction-test.jpg"
              alt="用户操作 SANGRE 原型进行交互测试"
              loading="lazy"
            />
            <figcaption>交互测试 · 流程验证</figcaption>
          </figure>
        </div>
      </section>

      <section className="technical-proof">
        <div className="shell">
          <p className="chapter-label">04 / 工程验证</p>
          <figure className="technical-proof__drawing">
            <Image unoptimized width={1352} height={939}
              src="/portfolio/sangre-drawing.webp"
              alt="SANGRE 技术图纸"
            />
          </figure>
          <figure className="technical-proof__exploded">
            <Image unoptimized width={1024} height={1024}
              src="/portfolio/sangre-exploded.jpg"
              alt="SANGRE 爆炸结构图"
            />
          </figure>
          <h2>
            形态服从
            <br />
            <span>使用流程。</span>
          </h2>
        </div>
      </section>

      <ProjectEnd
        nextHref="/work/bambino"
        nextIndex="02"
        nextTitle="BAMBINO V2"
      />
      </div>
    </main>
  );
}

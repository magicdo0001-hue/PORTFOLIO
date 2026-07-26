import {
  AssetPlaceholder,
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";

export const metadata = {
  title: "SANGRE — Wenhou Yan",
  description: "家庭心血管监测设备：从研究、结构到一比一功能原型。",
};

export default function SangrePage() {
  return (
    <main className="project project--sangre">
      <ProjectHero
        index="01"
        title="SANGRE"
        category="MEDICAL PRODUCT"
        period="14 WEEKS"
        role="LEAD DESIGNER"
        lede="把复杂血检收进一台愿意长期使用的家庭设备。"
        image="/portfolio/sangre-hero.webp"
        tone="sangre"
      />

      <section className="project-brief" id="story">
        <div className="shell">
          <p className="chapter-label">01 / THE BRIEF</p>
          <h2>
            慢性病管理需要的，
            <br />
            不是更多设备，而是<span>更少负担。</span>
          </h2>
          <p>
            SANGRE 将血脂四项、血糖与尿酸检测整合进紧凑的桌面设备，
            把试纸、采血组件、结果读取与收纳组织成一条连续流程。
          </p>
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
          <p className="chapter-label">02 / DISCOVERY</p>
          <h2>把研究转化成产品结构。</h2>
          <p>
            从慢性病管理与反射光度法出发，设计不只回答外观，还要同时处理试纸路径、采血动作、耗材收纳和清洁维护。
          </p>
        </aside>
        <div className="sangre-discovery__media">
          <AssetPlaceholder
            label="SANGRE / FORM STUDIES"
            spec="MIN 1800 × 1160 PX · LANDSCAPE"
          />
          <AssetPlaceholder
            label="SANGRE / VOLUME ITERATION"
            spec="MIN 1400 × 900 PX · LANDSCAPE"
          />
          <AssetPlaceholder
            label="SANGRE / VACUUM FORMING"
            spec="MIN 1400 × 900 PX · LANDSCAPE"
          />
        </div>
      </section>

      <section className="sangre-prototype chapter">
        <div className="sangre-prototype__image">
          <img
            src="/portfolio/sangre-prototype.webp"
            alt="SANGRE 一比一功能原型"
          />
        </div>
        <div className="sangre-prototype__copy">
          <p className="chapter-label">03 / PROTOTYPE</p>
          <span className="display-number">1:1</span>
          <h2>从体量模型，到可完整操作的功能原型。</h2>
          <p>
            多轮实体模型用于验证屏幕角度、耗材接近性、试纸操作和收纳逻辑。每一次制造，都直接改变下一轮设计决策。
          </p>
          <AssetPlaceholder
            label="SANGRE / INTERACTION TEST"
            spec="MIN 1400 × 1040 PX · LANDSCAPE"
          />
        </div>
      </section>

      <section className="technical-proof">
        <div className="shell">
          <p className="chapter-label">04 / ENGINEERING PROOF</p>
          <figure className="technical-proof__drawing">
            <img
              src="/portfolio/sangre-drawing.webp"
              alt="SANGRE 技术图纸"
            />
          </figure>
          <figure className="technical-proof__exploded">
            <img
              src="/portfolio/sangre-exploded.jpg"
              alt="SANGRE 爆炸结构图"
            />
          </figure>
          <h2>
            Form follows
            <br />
            <span>the workflow.</span>
          </h2>
        </div>
      </section>

      <ProjectEnd
        nextHref="/work/bambino"
        nextIndex="02"
        nextTitle="BAMBINO V2"
      />
    </main>
  );
}

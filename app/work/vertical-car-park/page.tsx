import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";

export const metadata = {
  title: "Arti64 模型车展示系统 | 严文厚",
  description:
    "从草图、CAD、3D 打印到真实销售，记录 Arti64 一比六十四模型车展示系统的完整设计过程。",
};

export default function VerticalCarParkPage() {
  return (
    <main className="project project--frame project--arti64">
      <ProjectHero
        index="05"
        title="ARTI64"
        category="工业设计 / 3D 打印"
        period="2025"
        role="共同创立 / 产品设计"
        lede="把一辆模型车的收纳问题，发展成可以持续扩展的展示系统。"
        image="/portfolio/arti64-display-wall.jpg"
        tone="frame"
      />

      <section className="project-brief project-brief--dark" id="story">
        <div className="shell">
          <p className="chapter-label">项目起点</p>
          <h2>
            做出一个产品不难。
            <br />
            难的是建立一个<span>真实运转的系统。</span>
          </h2>
          <p>
            一比六十四合金车是小众却遍布全球的收藏文化。收藏数量增加后，车辆往往散落在包装盒、透明展示盒与桌面之间，既难以整理，也无法形成清晰统一的展示。Arti64 从这个具体问题出发，为收藏者设计一种紧凑、模块化且适合小批量生产的车架。
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>约 15 克</span>
          <strong>单个停车单元</strong>
          <p>减少耗材与打印时间，让小批量生产成本保持合理。</p>
        </div>
        <div>
          <span>模块化</span>
          <strong>自由扩展</strong>
          <p>根据收藏数量横向连接、纵向叠加。</p>
        </div>
        <div>
          <span>易制造</span>
          <strong>快速装配</strong>
          <p>零件结构简单，打印后即可进入组合与使用。</p>
        </div>
      </FactRail>

      <section className="arti64-context chapter">
        <div className="arti64-context__copy">
          <p className="chapter-label">真实收藏场景</p>
          <h2>收纳方式很多，展示语言却彼此割裂。</h2>
          <p>
            收藏者会同时使用原包装、透明盒、开放式支架与临时堆叠。我们没有把问题理解为“再做一个盒子”，而是寻找一种能随着收藏持续生长，同时保持视觉秩序的基础单元。
          </p>
        </div>
        <figure className="arti64-context__wide">
          <img
            src="/portfolio/arti64-collector-context.jpg"
            alt="收藏者桌面上并存的多种模型车收纳方式"
            loading="lazy"
          />
          <figcaption>收藏环境观察：包装、展示盒与开放式车架并存</figcaption>
        </figure>
        <figure className="arti64-context__portrait">
          <img
            src="/portfolio/arti64-collection.jpg"
            alt="Arti64 模块化车架组成的模型车展示墙"
            loading="lazy"
          />
          <figcaption>模块组合后形成连续、清晰的收藏界面</figcaption>
        </figure>
      </section>

      <section className="arti64-process">
        <div className="shell arti64-process__intro">
          <p className="chapter-label">设计与制造</p>
          <h2>草图、CAD、打印、测试，再回到下一轮。</h2>
          <p>
            结构必须真正承重，零件必须容易生产，成本也必须适合小规模销售。每轮原型都围绕立柱刚度、层间连接、车辆进出空间和打印方向展开，外观由制造逻辑逐步收敛。
          </p>
        </div>
        <div className="shell arti64-process__grid">
          <figure className="arti64-process__printing">
            <img
              src="/portfolio/arti64-printing.jpg"
              alt="3D 打印机平台上的白色 Arti64 车架原型"
              loading="lazy"
            />
            <figcaption>早期白色原型用于检查支撑结构与车辆净空</figcaption>
          </figure>
          <div className="arti64-process__principles" aria-label="设计原则">
            <div>
              <strong>结构可靠</strong>
              <p>交叉支撑控制侧向变形，叠放后仍保持稳定。</p>
            </div>
            <div>
              <strong>制造直接</strong>
              <p>减少复杂零件和后处理，让打印与装配更快。</p>
            </div>
            <div>
              <strong>成本可控</strong>
              <p>以约 15 克材料完成一个单元，适合小批量验证。</p>
            </div>
          </div>
          <figure className="arti64-process__production">
            <img
              src="/portfolio/arti64-production.jpg"
              alt="成批打印并分类整理的 Arti64 车架零件"
              loading="lazy"
            />
            <figcaption>从单件原型进入批量打印、分类与组装</figcaption>
          </figure>
        </div>
      </section>

      <section className="arti64-system">
        <div className="shell arti64-system__copy">
          <p className="chapter-label">从产品到系统</p>
          <h2>车架只是起点，品牌、价格与销售同样属于设计。</h2>
          <p>
            项目逐渐扩展到 Arti64 的命名与视觉方向、海报、价格组合、包装和现场陈列。我们与真实收藏者交流，并在线下尝试销售，用实际反馈检验产品是否容易理解、愿意购买并能继续扩展。
          </p>
          <dl>
            <div>
              <dt>合作伙伴</dt>
              <dd>Tomic Yan、Fengyuan Liu</dd>
            </div>
            <div>
              <dt>我的工作</dt>
              <dd>产品设计、3D 打印、视觉方向、定价与销售验证</dd>
            </div>
          </dl>
        </div>
        <figure className="arti64-system__poster">
          <img
            src="/portfolio/arti64-poster.jpg"
            alt="Arti64 车架产品海报与组合定价"
            loading="lazy"
          />
        </figure>
        <figure className="arti64-system__market">
          <img
            src="/portfolio/arti64-market-table.jpg"
            alt="Arti64 在线下活动中的产品、海报与价格陈列"
            loading="lazy"
          />
          <figcaption>线下陈列把产品、价格与品牌放进同一个真实场景验证</figcaption>
        </figure>
      </section>

      <section className="arti64-outcome chapter shell">
        <figure>
          <img
            src="/portfolio/arti64-display-wall.jpg"
            alt="装满一比六十四模型车的 Arti64 模块化展示架"
            loading="lazy"
          />
        </figure>
        <div>
          <p className="chapter-label">项目结果</p>
          <h2>让一个想法离开电脑，进入收藏者的真实世界。</h2>
          <p>
            Arti64 仍在持续迭代。这个项目最重要的成果不只是车架本身，而是完整走过了从问题、结构、制造到品牌与销售的路径。它让我理解，产品设计的边界并不止于物体，而在于所有环节能否共同形成可信的使用体验。
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

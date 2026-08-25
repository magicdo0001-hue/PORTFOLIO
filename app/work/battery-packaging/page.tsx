import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../project-shell";

export const metadata = {
  title: "CR2032 纽扣电池可回收包装 | 严文厚",
  description:
    "兼顾儿童安全、单颗取用与纸塑分离回收的模块化 CR2032 纽扣电池包装设计，入围澳大利亚 PIDA 学生组决赛。",
};

const safetyGoals = [
  {
    index: "01",
    title: "防止儿童误开",
    body: "以儿童防护包装要求为设计边界，避免依靠直觉即可完成的单一步骤开启。",
  },
  {
    index: "02",
    title: "一次释放一颗",
    body: "控制单次取用数量，减少多颗电池同时暴露、散落或被儿童接触的机会。",
  },
  {
    index: "03",
    title: "成人能够操作",
    body: "在安全约束下保留清晰的操作反馈，使目标用户能够理解并完成取用。",
  },
];

export default function BatteryPackagingPage() {
  return (
    <main className="project project--battery">
      <ProjectHero
        index="04"
        title="CR2032 循环安全包装"
        category="包装设计 · 循环设计"
        period="PIDA 学生组决赛入围"
        role="产品设计"
        lede="兼顾儿童安全、单颗便捷取用与纸塑分离回收的模块化纽扣电池包装。"
        image="/portfolio/battery-museum-02.jpeg"
        tone="battery"
      />

      <section className="project-brief" id="story">
        <div className="shell">
          <p className="chapter-label">01 / 项目目标</p>
          <h2>
            安全取用，
            <br />
            <span>也为回收而设计。</span>
          </h2>
          <p>
            CR2032 纽扣电池体积小、易被误吞，包装必须在儿童防护与成人可操作性之间取得平衡。
            本项目进一步把使用后的材料分离纳入设计目标，让安全结构不再以牺牲可回收性为代价。
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>法规驱动</strong>
          <p>依据澳大利亚纽扣电池强制安全标准定义设计边界。</p>
        </div>
        <div>
          <span>02</span>
          <strong>单颗释放</strong>
          <p>一次仅开放一颗电池，降低多颗暴露与散落风险。</p>
        </div>
        <div>
          <span>03</span>
          <strong>纸塑分离</strong>
          <p>优化纸质背板与 PET 保护盖的连接方式，便于分类回收。</p>
        </div>
      </FactRail>

      <section className="battery-regulation chapter">
        <div className="battery-regulation__copy">
          <p className="chapter-label">02 / 法规研究</p>
          <h2>先定义不能妥协的安全边界。</h2>
          <p>
            研究以澳大利亚纽扣电池强制安全标准为基础，并参考 EN 862:2016 与
            IEC 60086-4:2019 中的儿童防护包装要求，将防误开、单颗释放和成人可操作性
            转化为可以指导结构设计的目标。
          </p>
          <dl>
            <div>
              <dt>AU</dt>
              <dd>澳大利亚纽扣电池强制安全标准</dd>
            </div>
            <div>
              <dt>EN 862:2016</dt>
              <dd>儿童防护包装的开启与再封闭要求参考</dd>
            </div>
            <div>
              <dt>IEC 60086-4:2019</dt>
              <dd>锂电池安全与包装相关要求参考</dd>
            </div>
          </dl>
        </div>
        <figure>
          <img
            src="/portfolio/battery-museum-01.jpeg"
            alt="CR2032 纽扣电池包装的结构研究图"
          />
          <figcaption>法规要求被转化为结构、开启顺序与单颗释放条件</figcaption>
        </figure>
      </section>

      <section className="battery-safety chapter">
        <header>
          <p className="chapter-label">03 / 安全取用</p>
          <h2>不是更难打开，而是更难被误打开。</h2>
        </header>
        <div className="battery-safety__layout">
          <figure>
            <img
              src="/portfolio/battery-museum-03.jpeg"
              alt="纽扣电池包装开启机制原型"
            />
            <figcaption>开启机制与成人操作路径的原型探索</figcaption>
          </figure>
          <div className="battery-safety__goals">
            {safetyGoals.map((goal) => (
              <article key={goal.index}>
                <span>{goal.index}</span>
                <h3>{goal.title}</h3>
                <p>{goal.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="battery-circular chapter">
        <div className="battery-circular__media">
          <figure>
            <img
              src="/portfolio/battery-museum-04.jpeg"
              alt="CR2032 纽扣电池可回收包装方案"
            />
            <figcaption>模块化包装方案与材料连接关系</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/battery-museum-05.jpeg"
              alt="纽扣电池包装的纸塑分离演示"
            />
            <figcaption>使用后可相对便捷地分离纸质背板与 PET 保护盖</figcaption>
          </figure>
        </div>
        <div className="battery-circular__copy">
          <p className="chapter-label">04 / 循环设计</p>
          <h2>让两种材料，在使用后各自回到循环。</h2>
          <p>
            常见吸塑包装会把纸质背板与塑料保护盖不可逆地粘合，使用后难以分类处理。
            本方案围绕真实回收场景优化材料连接方式，减少不可逆结合，使纸与 PET
            能够相对便捷地分离，从而提高该类包装的可回收率。
          </p>
          <aside>
            <span>项目认可</span>
            <strong>澳大利亚包装创新与设计学生奖（PIDA）学生组决赛入围</strong>
          </aside>
        </div>
      </section>

      <ProjectEnd
        nextHref="/work/vertical-car-park"
        nextIndex="05"
        nextTitle="ARTI64"
      />
    </main>
  );
}
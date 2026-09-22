import type { Metadata } from "next";
import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../../project-shell";

export const metadata: Metadata = {
  title: "CR2032 Recyclable Battery Packaging | Wenhou Yan",
  description:
    "A modular CR2032 battery package balancing child safety, single-cell access and paper-plastic separation, shortlisted for the PIDA Student Award.",
};

const safetyGoals = [
  {
    index: "01",
    title: "Resist child access",
    body: "Child-resistant packaging requirements define the structural boundary, preventing a single intuitive action from opening the pack.",
  },
  {
    index: "02",
    title: "Release one cell",
    body: "Only one battery is exposed at a time, reducing the risk of loose cells, multiple-cell access and accidental contact.",
  },
  {
    index: "03",
    title: "Remain usable for adults",
    body: "Clear feedback and a legible operating sequence preserve adult usability within the safety constraints.",
  },
];

export default function BatteryPackagingEnglishPage() {
  return (
    <main className="project project--battery project--en" lang="en">
      <ProjectHero
        index="04"
        title="CR2032 CIRCULAR SAFETY PACKAGING"
        category="Packaging design · Circular design"
        period="PIDA Student finalist"
        role="Product designer"
        lede="A modular button-cell package balancing child safety, convenient single-cell access and paper-plastic separation."
        image="/portfolio/battery-museum-02.jpeg"
        tone="battery"
        locale="en"
      />

      <section className="project-brief" id="story">
        <div className="shell">
          <p className="chapter-label">01 / PROJECT GOAL</p>
          <h2>
            Safe access,
            <br />
            <span>designed for recovery.</span>
          </h2>
          <p>
            CR2032 cells are small and hazardous when swallowed, so their package
            must balance child resistance with adult usability. This project also
            treats material separation after use as a core design goal, so safety
            does not come at the expense of recyclability.
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>Regulation-led</strong>
          <p>Australian mandatory safety standards establish the design boundary.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Single-cell release</strong>
          <p>One battery is exposed at a time to reduce loose-cell risk.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Paper-plastic separation</strong>
          <p>The paperboard and PET cover can be separated for material recovery.</p>
        </div>
      </FactRail>

      <section className="battery-regulation chapter">
        <div className="battery-regulation__copy">
          <p className="chapter-label">02 / REGULATORY RESEARCH</p>
          <h2>Define the safety boundaries that cannot be compromised.</h2>
          <p>
            The research began with Australia&apos;s mandatory button-battery
            safety standards and referenced the child-resistant packaging
            requirements in EN 862:2016 and IEC 60086-4:2019. These requirements
            became practical goals for child resistance, single-cell release and
            adult operability.
          </p>
          <dl>
            <div>
              <dt>AU</dt>
              <dd>Australian mandatory button-battery safety standards</dd>
            </div>
            <div>
              <dt>EN 862:2016</dt>
              <dd>Reference for child-resistant opening and reclosure</dd>
            </div>
            <div>
              <dt>IEC 60086-4:2019</dt>
              <dd>Reference for lithium-battery safety and packaging</dd>
            </div>
          </dl>
        </div>
        <figure>
          <img
            src="/portfolio/battery-museum-01.jpeg"
            alt="Structural research for the CR2032 button-cell package"
          />
          <figcaption>
            Regulatory requirements translated into structure, opening sequence
            and single-cell release conditions
          </figcaption>
        </figure>
      </section>

      <section className="battery-safety chapter">
        <header>
          <p className="chapter-label">03 / SAFE ACCESS</p>
          <h2>Not simply harder to open—harder to open by accident.</h2>
        </header>
        <div className="battery-safety__layout">
          <figure>
            <img
              src="/portfolio/battery-museum-03.jpeg"
              alt="Prototype of the button-cell package opening mechanism"
            />
            <figcaption>
              Exploring the opening mechanism and the intended adult action
            </figcaption>
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
              alt="Recyclable CR2032 button-cell packaging concept"
            />
            <figcaption>Modular packaging and material connections</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/battery-museum-05.jpeg"
              alt="Paper and PET separation demonstration"
            />
            <figcaption>
              The paperboard backing and PET cover separate after use
            </figcaption>
          </figure>
        </div>
        <div className="battery-circular__copy">
          <p className="chapter-label">04 / CIRCULAR DESIGN</p>
          <h2>Let each material return to its own recovery stream.</h2>
          <p>
            Conventional blister packs permanently bond paperboard to the plastic
            cover, making sorting difficult after use. This proposal reduces
            irreversible joins and responds to real recycling conditions, allowing
            the paper and PET components to separate more easily and improving the
            package&apos;s recovery potential.
          </p>
          <aside>
            <span>Recognition</span>
            <strong>
              Finalist · Packaging Innovation &amp; Design Awards (PIDA), Student
              category
            </strong>
          </aside>
        </div>
      </section>

      <ProjectEnd
        nextHref="/en/work/vertical-car-park"
        nextIndex="05"
        nextTitle="ARTI64"
        locale="en"
      />
    </main>
  );
}

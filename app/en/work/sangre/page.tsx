import type { Metadata } from "next";
import { FactRail, ProjectEnd, ProjectHero } from "../../../project-shell";

export const metadata: Metadata = {
  title: "SANGRE | Wenhou Yan",
  description: "A home cardiovascular monitoring device developed from research through a functional 1:1 prototype.",
};

export default function EnglishSangrePage() {
  return (
    <main className="project project--sangre project--en" lang="en">
      <ProjectHero
        index="01"
        title="SANGRE"
        category="Healthcare product"
        period="14 weeks"
        role="Lead designer"
        lede="A home blood-testing device designed to reduce the burden of long-term monitoring."
        image="/portfolio/sangre-hero.webp"
        tone="sangre"
        locale="en"
      />

      <section className="project-brief" id="story">
        <div className="shell">
          <p className="chapter-label">01 / PROJECT OVERVIEW</p>
          <h2>
            Chronic care does not need more devices.
            <br />
            It needs <span>less friction.</span>
          </h2>
          <p>
            SANGRE combines a lipid panel, blood glucose and uric acid testing in one compact desktop device. Test strips, sampling tools, result reading and storage become one continuous workflow.
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>Six biomarkers</strong>
          <p>Lipid panel, blood glucose and uric acid</p>
        </div>
        <div>
          <span>02</span>
          <strong>1:1 prototype</strong>
          <p>A complete operating sequence</p>
        </div>
        <div>
          <span>03</span>
          <strong>Manufacturing loop</strong>
          <p>FDM, vacuum forming and assembly</p>
        </div>
      </FactRail>

      <section className="sangre-discovery chapter">
        <aside>
          <p className="chapter-label">02 / RESEARCH TO ARCHITECTURE</p>
          <h2>Turning research into product architecture.</h2>
          <p>
            Starting with chronic-care routines and reflectance photometry, the design had to resolve more than form: strip routing, blood sampling, consumable storage and cleaning all shaped the architecture.
          </p>
        </aside>
        <div className="sangre-discovery__media">
          <figure>
            <img src="/portfolio/sangre-form-studies.png" alt="SANGRE form and functional zoning studies" loading="lazy" />
            <figcaption>Form studies · Product architecture</figcaption>
          </figure>
          <figure>
            <img src="/portfolio/sangre-volume-iteration.jpg" alt="SANGRE volume and consumable-area iterations" loading="lazy" />
            <figcaption>Volume iteration · Detail study</figcaption>
          </figure>
          <figure>
            <img src="/portfolio/sangre-vacuum-forming.jpg" alt="SANGRE physical model fabrication" loading="lazy" />
            <figcaption>Physical build · Volume validation</figcaption>
          </figure>
        </div>
      </section>

      <section className="sangre-prototype chapter">
        <div className="sangre-prototype__image">
          <img src="/portfolio/sangre-prototype.webp" alt="SANGRE functional 1:1 prototype" />
        </div>
        <div className="sangre-prototype__copy">
          <p className="chapter-label">03 / PROTOTYPE VALIDATION</p>
          <span className="display-number">1:1</span>
          <h2>From volume studies to a fully operable prototype.</h2>
          <p>
            Successive physical models tested the screen angle, access to consumables, strip handling and storage logic. Every build directly informed the next design decision.
          </p>
          <figure>
            <img src="/portfolio/sangre-interaction-test.jpg" alt="User testing the SANGRE prototype" loading="lazy" />
            <figcaption>Interaction test · Workflow validation</figcaption>
          </figure>
        </div>
      </section>

      <section className="technical-proof">
        <div className="shell">
          <p className="chapter-label">04 / ENGINEERING VALIDATION</p>
          <figure className="technical-proof__drawing">
            <img src="/portfolio/sangre-drawing.webp" alt="SANGRE technical drawing" />
          </figure>
          <figure className="technical-proof__exploded">
            <img src="/portfolio/sangre-exploded.jpg" alt="Exploded view of SANGRE" />
          </figure>
          <h2>
            Form follows
            <br />
            <span>the user flow.</span>
          </h2>
        </div>
      </section>

      <ProjectEnd nextHref="/en/work/bambino" nextIndex="02" nextTitle="BAMBINO V2" locale="en" />
    </main>
  );
}
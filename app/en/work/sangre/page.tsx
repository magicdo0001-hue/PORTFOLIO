import Image from "next/image";
import Link from "next/link";
import SangreShowcase from "../../../work/sangre/showcase";
import type { Metadata } from "next";
import { FactRail, ProjectEnd } from "../../../project-shell";

export const metadata: Metadata = {
  title: "SANGRE | Wenhou Yan",
  description: "A home cardiovascular monitoring concept developed from research through a physical 1:1 interaction prototype.",
};

export default function EnglishSangrePage() {
  return (
    <main className="project project--sangre project--en" lang="en">
      <SangreShowcase locale="en" />

      <div className="sangre-case-study" id="story">
        <header className="sangre-case-nav">
          <Link href="/en" aria-label="SANGRE, back to portfolio">SANGRE</Link>
          <nav aria-label="Case study navigation">
            <a href="#showcase">Product experience</a>
            <a href="/work/sangre#story" hrefLang="zh-CN">中</a>
          </nav>
        </header>
      <section className="project-brief">
        <div className="shell">
          <p className="chapter-label">01 / PROJECT OVERVIEW</p>
          <h2>
            Chronic care does not need more devices.
            <br />
            It needs <span>less friction.</span>
          </h2>
          <div className="sangre-case-intro"><p>
            SANGRE combines a lipid panel, blood glucose and uric acid testing in one compact desktop device. Test strips, sampling tools, result reading and storage become one continuous workflow.
          </p>
          <p>The physical 1:1 interaction prototype validates handling and structure. On-screen readings are demonstration data.</p></div>
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
            <Image unoptimized width={1586} height={992} src="/portfolio/sangre-form-studies.png" alt="SANGRE form and functional zoning studies" loading="lazy" />
            <figcaption>Form studies · Product architecture</figcaption>
          </figure>
          <figure>
            <Image unoptimized width={2000} height={2000} src="/portfolio/sangre-volume-iteration.jpg" alt="SANGRE volume and consumable-area iterations" loading="lazy" />
            <figcaption>Volume iteration · Detail study</figcaption>
          </figure>
          <figure>
            <Image unoptimized width={3648} height={2736} src="/portfolio/sangre-vacuum-forming.jpg" alt="SANGRE physical model fabrication" loading="lazy" />
            <figcaption>Physical build · Volume validation</figcaption>
          </figure>
        </div>
      </section>

      <section className="sangre-prototype chapter">
        <div className="sangre-prototype__image">
          <Image unoptimized width={2400} height={1600} src="/portfolio/sangre-prototype.webp" alt="SANGRE physical 1:1 interaction prototype" />
        </div>
        <div className="sangre-prototype__copy">
          <p className="chapter-label">03 / PROTOTYPE VALIDATION</p>
          <span className="display-number">1:1</span>
          <h2>From volume studies to a fully operable interaction prototype.</h2>
          <p>
            Successive physical models tested the screen angle, access to consumables, strip handling and storage logic. Every build directly informed the next design decision.
          </p>
          <figure>
            <Image unoptimized width={2000} height={2000} src="/portfolio/sangre-interaction-test.jpg" alt="User testing the SANGRE prototype" loading="lazy" />
            <figcaption>Interaction test · Workflow validation</figcaption>
          </figure>
        </div>
      </section>

      <section className="technical-proof">
        <div className="shell">
          <p className="chapter-label">04 / ENGINEERING VALIDATION</p>
          <figure className="technical-proof__drawing">
            <Image unoptimized width={1352} height={939} src="/portfolio/sangre-drawing.webp" alt="SANGRE technical drawing" />
          </figure>
          <figure className="technical-proof__exploded">
            <Image unoptimized width={1024} height={1024} src="/portfolio/sangre-exploded.jpg" alt="Exploded view of SANGRE" />
          </figure>
          <h2>
            Form follows
            <br />
            <span>the user flow.</span>
          </h2>
        </div>
      </section>

      <ProjectEnd nextHref="/en/work/bambino" nextIndex="02" nextTitle="BAMBINO V2" locale="en" />
      </div>
    </main>
  );
}

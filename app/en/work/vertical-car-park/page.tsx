import type { Metadata } from "next";
import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../../project-shell";

export const metadata: Metadata = {
  title: "ARTI64 Model Car Display System | Wenhou Yan",
  description:
    "The complete journey of a modular 1:64 model-car display system—from sketching, CAD and 3D printing to branding and real-world sales.",
};

export default function VerticalCarParkEnglishPage() {
  return (
    <main className="project project--frame project--arti64 project--en" lang="en">
      <ProjectHero
        index="05"
        title="ARTI64"
        category="Industrial design / 3D printing"
        period="2025"
        role="Co-founder / Product designer"
        lede="Turning the storage of one model car into a display system that can keep growing."
        image="/portfolio/arti64-display-wall.jpg"
        tone="frame"
        locale="en"
      />

      <section className="project-brief project-brief--dark" id="story">
        <div className="shell">
          <p className="chapter-label">PROJECT ORIGIN</p>
          <h2>
            Making one product is straightforward.
            <br />
            The challenge is building a <span>system that works in reality.</span>
          </h2>
          <p>
            Collecting 1:64 die-cast cars is a niche but global hobby. As a
            collection grows, cars become scattered across original packages,
            clear cases and desktops, making both organisation and display
            inconsistent. ARTI64 began with this specific problem: a compact,
            modular rack suitable for small-batch production.
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>≈ 15 g</span>
          <strong>Per parking unit</strong>
          <p>Lower material use and print time keep small-batch costs practical.</p>
        </div>
        <div>
          <span>Modular</span>
          <strong>Expandable system</strong>
          <p>Units connect horizontally and stack vertically as collections grow.</p>
        </div>
        <div>
          <span>Production-ready</span>
          <strong>Fast assembly</strong>
          <p>Simple parts move directly from printing into assembly and use.</p>
        </div>
      </FactRail>

      <section className="arti64-context chapter">
        <div className="arti64-context__copy">
          <p className="chapter-label">REAL COLLECTIONS</p>
          <h2>Many storage formats, but no shared display language.</h2>
          <p>
            Collectors combine original packaging, clear cases, open racks and
            temporary stacks. Instead of designing another box, we looked for a
            base unit that could grow with the collection while maintaining a
            consistent visual order.
          </p>
        </div>
        <figure className="arti64-context__wide">
          <img
            src="/portfolio/arti64-collector-context.jpg"
            alt="Multiple storage formats in a model-car collection"
            loading="lazy"
          />
          <figcaption>
            Collection study · Packaging, display cases and open racks coexist
          </figcaption>
        </figure>
      </section>

      <section className="arti64-process">
        <div className="shell arti64-process__intro">
          <p className="chapter-label">DESIGN &amp; MANUFACTURING</p>
          <h2>Sketch, CAD, print, test—and return to the next iteration.</h2>
          <p>
            The structure had to carry real loads, the parts had to be easy to
            produce, and the cost had to suit small-scale sales. Each prototype
            tested column stiffness, inter-layer connections, vehicle clearance
            and print orientation, allowing the form to emerge from the
            manufacturing logic.
          </p>
        </div>
        <div className="shell arti64-process__grid">
          <figure className="arti64-process__printing">
            <img
              src="/portfolio/arti64-printing.jpg"
              alt="White ARTI64 rack prototypes on a 3D-printer bed"
              loading="lazy"
            />
            <figcaption>
              Early white prototypes tested bracing and vehicle clearance
            </figcaption>
          </figure>
          <div className="arti64-process__principles" aria-label="Design principles">
            <div>
              <strong>Structural reliability</strong>
              <p>Cross bracing limits lateral movement and keeps stacked units stable.</p>
            </div>
            <div>
              <strong>Direct manufacturing</strong>
              <p>Fewer complex parts and finishing steps make printing and assembly faster.</p>
            </div>
            <div>
              <strong>Controlled cost</strong>
              <p>About 15 grams of material per unit supports small-batch validation.</p>
            </div>
          </div>
          <figure className="arti64-process__production">
            <img
              src="/portfolio/arti64-production.jpg"
              alt="Batches of ARTI64 rack components prepared for assembly"
              loading="lazy"
            />
            <figcaption>
              Moving from one prototype into batch printing, sorting and assembly
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="arti64-system">
        <div className="shell arti64-system__copy">
          <p className="chapter-label">FROM PRODUCT TO SYSTEM</p>
          <h2>The rack was only the beginning—brand, price and sales were design too.</h2>
          <p>
            ARTI64 expanded into naming and visual direction, posters, product
            bundles, packaging and market display. We spoke with real collectors
            and tested in-person sales, using their responses to judge whether the
            product was easy to understand, worth purchasing and capable of
            growing with a collection.
          </p>
          <dl>
            <div>
              <dt>Collaborators</dt>
              <dd>Ziqian Chen, Fengyuan Liu</dd>
            </div>
            <div>
              <dt>My contribution</dt>
              <dd>Product design, 3D printing, visual direction, pricing and sales validation</dd>
            </div>
          </dl>
        </div>
        <figure className="arti64-system__poster">
          <img
            src="/portfolio/arti64-poster.jpg"
            alt="ARTI64 product poster and bundle pricing"
            loading="lazy"
          />
        </figure>
        <figure className="arti64-system__market">
          <img
            src="/portfolio/arti64-market-table.jpg"
            alt="ARTI64 products, posters and pricing at an in-person market"
            loading="lazy"
          />
          <figcaption>
            A market display tested product, price and brand together in a real setting
          </figcaption>
        </figure>
      </section>

      <section className="arti64-outcome chapter shell">
        <div className="arti64-outcome__media">
          <figure>
            <img
              src="/portfolio/arti64-display-wall.jpg"
              alt="ARTI64 modular display racks filled with 1:64 model cars"
              loading="lazy"
            />
          </figure>
          <figure>
            <img
              src="/portfolio/arti64-collection.jpg"
              alt="A model-car display wall assembled from ARTI64 modules"
              loading="lazy"
            />
            <figcaption>
              Connected modules form a continuous, legible collection display
            </figcaption>
          </figure>
        </div>
        <div>
          <p className="chapter-label">OUTCOME</p>
          <h2>Moving an idea off the computer and into a collector&apos;s world.</h2>
          <p>
            ARTI64 is still evolving. Its most important result is not only the
            rack, but the complete path from problem and structure to
            manufacturing, brand and sales. The project showed me that product
            design extends beyond the object: every part of the system must work
            together to create a credible experience.
          </p>
        </div>
      </section>

      <ProjectEnd
        nextHref="/en/work/sangre"
        nextIndex="01"
        nextTitle="SANGRE"
        locale="en"
      />
    </main>
  );
}

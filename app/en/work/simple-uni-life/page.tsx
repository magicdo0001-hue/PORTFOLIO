import type { Metadata } from "next";
import {
  FactRail,
  ProjectEnd,
  ProjectHero,
} from "../../../project-shell";
import { SimpleUniLifeLiveDemo } from "../../../work/simple-uni-life/live-demo";

export const metadata: Metadata = {
  title: "SIMPLE UNI LIFE | Wenhou Yan",
  description:
    "A digital product that helps international students compare course information and make decisions with confidence.",
};

export default function SimpleUniLifeEnglishPage() {
  return (
    <main className="project project--unilife project--en" lang="en">
      <ProjectHero
        index="03"
        title="SIMPLE UNI LIFE"
        category="Digital product"
        period="14 weeks"
        role="Product / UI/UX / Front-end"
        lede="Turning fragmented student experiences into information that can be compared and acted on."
        image="/portfolio/unilife-layer-02.png"
        tone="unilife"
        locale="en"
      />

      <section className="project-brief project-brief--orange" id="story">
        <div className="shell">
          <p className="chapter-label">01 / PROJECT CONTEXT</p>
          <h2>
            Course selection is not a search problem.
            <br />
            It is a <span>small decision with high stakes.</span>
          </h2>
          <p>
            Official pages explain what a course is, but rarely answer questions
            about difficulty, workload, assessment or lived experience. The
            platform turns those scattered signals into comparable information.
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>Four decision modes</strong>
          <p>Value, risk, grades and pathway</p>
        </div>
        <div>
          <span>02</span>
          <strong>End-to-end flow</strong>
          <p>Search, understand, compare and act</p>
        </div>
        <div>
          <span>03</span>
          <strong>Live product</strong>
          <p>Product, UI/UX and front-end collaboration</p>
        </div>
      </FactRail>

      <section id="research" className="unilife-problem unilife-research-flow chapter">
        <aside className="unilife-problem__copy">
          <p className="chapter-label">02 / RESEARCH &amp; PRODUCT LOGIC</p>
          <h2>
            Information is everywhere.
            <br />
            Confidence is hard to find.
          </h2>
          <p>
            Interviews and contextual research showed that students must move
            between official course pages, social platforms and scattered reviews
            to assemble a decision they can barely trust.
          </p>
          <div className="unilife-problem__logic">
            <h3>Move from finding information to making a decision.</h3>
            <p>
              The information architecture follows the real decision sequence:
              enter a course, understand its structure, compare experiences and
              build enough confidence to act.
            </p>
          </div>
        </aside>
        <div
          className="unilife-problem__media"
          aria-label="Simple Uni Life research and product logic"
        >
          <figure className="unilife-problem__video">
            <video
              src="/portfolio/unilife-product-story.mp4"
              poster="/portfolio/unilife-video-poster.png"
              aria-label="Animation of the Simple Uni Life problem context"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
            <figcaption>Product logic · From fragments to a decision path</figcaption>
          </figure>
          <div className="unilife-friction-gallery" aria-label="Research situations">
            <figure>
              <img
                src="/portfolio/unilife-friction-search.png"
                alt="Student searching across multiple course and review websites"
                loading="lazy"
              />
              <figcaption>Decision friction</figcaption>
            </figure>
            <figure>
              <img
                src="/portfolio/unilife-friction-paths.png"
                alt="Student weighing course difficulty, timetable and grading information"
                loading="lazy"
              />
              <figcaption>Conflicting signals</figcaption>
            </figure>
            <figure>
              <img
                src="/portfolio/unilife-friction-social.png"
                alt="Student surrounded by fragmented course information from social platforms"
                loading="lazy"
              />
              <figcaption>Fragmented social proof</figcaption>
            </figure>
            <figure>
              <img
                src="/portfolio/unilife-friction-reviews.png"
                alt="Student comparing contradictory anonymous course reviews"
                loading="lazy"
              />
              <figcaption>Unreliable reviews</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <SimpleUniLifeLiveDemo locale="en" />

      <section className="screen-rail" aria-label="Simple Uni Life interface system">
        <div className="screen-rail__intro">
          <span>04 / INTERFACE SYSTEM</span>
          <strong>DRAG / SCROLL →</strong>
        </div>
        <div className="screen-rail__track">
          <figure>
            <img
              src="/portfolio/unilife-course-search.png"
              alt="Simple Uni Life mobile course search"
              loading="lazy"
            />
            <figcaption>Course search · Mobile</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-structured-results.png"
              alt="Simple Uni Life structured course results"
              loading="lazy"
            />
            <figcaption>Structured results</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-layer-04.png"
              alt="Simple Uni Life course decision page"
              loading="lazy"
            />
            <figcaption>Course decision page</figcaption>
          </figure>
          <figure>
            <img
              src="/portfolio/unilife-course-structure.png"
              alt="Simple Uni Life course structure interface"
              loading="lazy"
            />
            <figcaption>Course structure</figcaption>
          </figure>
        </div>
      </section>

      <section className="unilife-outcome">
        <div className="shell">
          <p className="chapter-label">05 / OUTCOME</p>
          <h2>
            A digital product is finished when the next decision becomes
            <span> easier.</span>
          </h2>
          <p>
            The project moved from requirements, information architecture and
            interface rules into real front- and back-end collaboration, creating
            a product workflow that can continue to evolve.
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

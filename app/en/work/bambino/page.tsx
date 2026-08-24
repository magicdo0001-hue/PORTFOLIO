import type { Metadata } from "next";
import { FactRail, ProjectEnd, ProjectHero } from "../../../project-shell";

export const metadata: Metadata = {
  title: "BAMBINO V2 | Wenhou Yan",
  description: "A compact espresso-machine redesign focused on mechanical locking and legible physical feedback.",
};

export default function EnglishBambinoPage() {
  return (
    <main className="project project--bambino project--en" lang="en">
      <ProjectHero
        index="02"
        title="BAMBINO V2"
        category="Product redesign"
        period="12 weeks"
        role="Independent project"
        lede="A steadier lock and clearer feedback for every step of the espresso workflow."
        image="/portfolio/bambino-hero.jpg"
        tone="bambino"
        locale="en"
      />

      <section className="project-brief project-brief--dark" id="story">
        <div className="shell">
          <p className="chapter-label">01 / CORE TENSION</p>
          <h2>
            A compact espresso machine should not
            <br />
            <span>push itself away</span> while the portafilter locks.
          </h2>
          <p>
            Based on the Breville Bambino, this redesign rethinks the brew-head locking mechanism and physical feedback to balance speed, stability and sensory engagement.
          </p>
        </div>
      </section>

      <FactRail>
        <div>
          <span>01</span>
          <strong>Lower torque</strong>
          <p>Less machine movement during locking</p>
        </div>
        <div>
          <span>02</span>
          <strong>Physical feedback</strong>
          <p>Mechanical states become visible and tactile</p>
        </div>
        <div>
          <span>03</span>
          <strong>1:1 studies</strong>
          <p>Testing height, angle and user motion</p>
        </div>
      </FactRail>

      <section className="bambino-balance chapter">
        <aside className="bambino-balance__copy">
          <p className="chapter-label">02 / USER MOTION</p>
          <h2>Observe the action before changing the machine.</h2>
          <p>
            Research revealed three connected problems: rotational torque, viewing angle and state feedback. The mechanism absorbs the locking force while preserving clear tactile and visual responses for the user.
          </p>
        </aside>
        <div className="bambino-balance__media">
          <figure className="bambino-balance__interaction">
            <img src="/portfolio/bambino-interaction.webp" alt="Foam-model interaction study for Bambino" />
            <figcaption>Motion study · Viewing angle</figcaption>
          </figure>
          <figure className="bambino-balance__build">
            <img src="/portfolio/bambino-build.webp" alt="Building the Bambino prototype" />
            <figcaption>Prototype build · Structural validation</figcaption>
          </figure>
          <figure className="bambino-balance__detail">
            <img src="/portfolio/bambino-detail.webp" alt="Bambino interface and body-angle study" loading="lazy" />
            <figcaption>Interface angle · Visual feedback</figcaption>
          </figure>
        </div>
      </section>

      <section className="bambino-lock">
        <figure className="bambino-lock__visual">
          <img src="/portfolio/bambino-layer-04.jpg" alt="Detail of the Bambino brew-head locking mechanism" loading="lazy" />
        </figure>
        <div className="bambino-lock__copy">
          <p className="chapter-label">03 / MECHANICAL SYSTEM</p>
          <span className="display-number">↓</span>
          <h2>
            Feedback comes
            <br />
            from structure.
          </h2>
          <p>
            Focused detail models shortened the loop between mechanical design and feel. Locking, release and completion are communicated through one coherent physical language.
          </p>
        </div>
      </section>

      <section className="bambino-resolution chapter shell">
        <p className="chapter-label">04 / FINAL DIRECTION</p>
        <figure className="bambino-resolution__profile">
          <img src="/portfolio/bambino-profile.webp" alt="Bambino side-profile product render" />
        </figure>
        <figure className="bambino-resolution__hero">
          <img src="/portfolio/bambino-prototype.jpg" alt="Bambino 1:1 physical prototype" />
        </figure>
        <figure className="bambino-resolution__parts">
          <img src="/portfolio/bambino-parts.webp" alt="Bambino mechanical components" />
        </figure>
        <h2>
          One machine.
          <br />
          One coherent action.
        </h2>
      </section>

      <ProjectEnd nextHref="/en/work/simple-uni-life" nextIndex="03" nextTitle="SIMPLE UNI LIFE" locale="en" />
    </main>
  );
}
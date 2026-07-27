import InfiniteProjectMenu from "./infinite-project-menu";
import { ContactFooter, SiteHeader } from "../project-shell";

export default function WorkIndex() {
  return (
    <main className="work-index">
      <section className="work-index__hero">
        <SiteHeader />
        <div className="work-index__heading shell">
          <p>SELECTED WORK / 2024—2026</p>
          <h1>
            Projects in
            <br />
            <em>continuous orbit.</em>
          </h1>
        </div>
        <InfiniteProjectMenu />
      </section>
      <ContactFooter />
    </main>
  );
}

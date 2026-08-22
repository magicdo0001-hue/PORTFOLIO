import SphereProjectMenu from "./sphere-project-menu";
import MuseumSection from "./museum-section";
import { SiteHeader } from "../project-shell";
import FadeContent from "../fade-content";

export default function WorkIndex() {
  return (
    <main className="work-index">
      <section className="work-index__hero">
        <SiteHeader />
        <FadeContent
          className="fade-content--hero"
          duration={1050}
          distance={30}
        >
          <SphereProjectMenu />
        </FadeContent>
      </section>
      <FadeContent distance={56}>
        <MuseumSection />
      </FadeContent>
    </main>
  );
}
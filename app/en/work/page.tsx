import FadeContent from "../../fade-content";
import { SiteHeader } from "../../project-shell";
import MuseumSection from "../../work/museum-section";
import SphereProjectMenu from "../../work/sphere-project-menu";

export default function EnglishWorkIndex() {
  return (
    <main className="work-index" lang="en">
      <section className="work-index__hero">
        <SiteHeader
          locale="en"
          showLanguage
          languageHref="/work"
        />
        <FadeContent
          className="fade-content--hero"
          duration={1050}
          distance={30}
        >
          <SphereProjectMenu locale="en" />
        </FadeContent>
      </section>
      <FadeContent distance={56}>
        <MuseumSection locale="en" />
      </FadeContent>
    </main>
  );
}

import SphereProjectMenu from "./sphere-project-menu";
import { ContactFooter, SiteHeader } from "../project-shell";

export default function WorkIndex() {
  return (
    <main className="work-index">
      <section className="work-index__hero">
        <SiteHeader />
        <SphereProjectMenu />
      </section>
      <ContactFooter />
    </main>
  );
}

import './static-project.css';

export function StaticProject({markup}) {
  const home=location.pathname==='/';
  let content;
  if(!home){
    const page=new DOMParser().parseFromString(markup,'text/html');
    page.querySelectorAll('.navigation-w,.modal-w,.ae__btn-w,.cursor,.indicator-w,.loader-w').forEach(el=>el.remove());
    page.querySelectorAll('a').forEach(el=>el.setAttribute('data-taxi-ignore',''));
    content=page.querySelector('main')?.innerHTML||markup;
  }
  return <div className="static-project">
    <header className="static-nav"><a data-taxi-ignore="" href="/" className="static-brand">SANGRE</a><nav aria-label="Project navigation">
      <a data-taxi-ignore="" href="/#display">Display</a><a data-taxi-ignore="" href="/#form">Form</a><a data-taxi-ignore="" href="/#testing">Testing</a><a data-taxi-ignore="" href="/#inside">Inside</a><a data-taxi-ignore="" href="/specs">Specs</a>
    </nav></header>
    <p className="static-notice" role="status">You’re viewing the image edition. The full 3D experience needs WebGL 2.</p>
    {home?<main>
      <section className="static-hero" aria-labelledby="static-title"><div><h1 id="static-title">Health,<br/>in focus.</h1><p>A home monitoring concept, designed around everyday care.</p><a data-taxi-ignore="" className="static-link" href="#display">Explore the project</a></div><img src="/assets/sangre/hero.webp" width="2000" height="2000" fetchPriority="high" alt="SANGRE concept device with its folded screen and clear storage cover"/></section>
      <section id="display" className="static-section static-display"><div><h2>A clearer view.</h2><p>A compact display unfolds into a longer view for readings, trends and your next check-in.</p><p className="static-caption">Interface and readings shown are design demonstrations.</p></div><img src="/assets/sangre/unfolded-ui.png" alt="The expanded display’s dashboard and trend interface" loading="lazy"/></section>
      <section id="form" className="static-section"><h2>Considered,<br/>inside out.</h2><p>Soft surfaces, clear storage, and purposeful details. The transparent cover keeps consumables in view.</p></section>
      <section id="testing" className="static-section"><h2>A simple gesture.</h2><p>The cartridge slides horizontally into the front guide, with its flat end entering first and the beveled end staying outside.</p></section>
      <section id="inside" className="static-section static-inside"><div><h2>Every part,<br/>revealed.</h2><p>Explore the enclosure, battery and photometer assembly in the supplied CAD.</p></div><img src="/assets/sangre/exploded.jpg" width="1024" height="1024" alt="SANGRE exploded assembly showing its enclosure and internal components" loading="lazy"/></section>
    </main>:<main className="static-authored" dangerouslySetInnerHTML={{__html:content}}/>}
    <footer className="static-footer"><p>Industrial design and interaction prototype.</p><a data-taxi-ignore="" href="/">Back to SANGRE</a><button type="button" onClick={()=>location.reload()}>Retry 3D preview</button></footer>
  </div>;
}

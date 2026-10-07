import { useEffect, useRef, useState } from 'react';
import { StaticProject } from './StaticProject.jsx';
import { SangreScreen } from './SangreScreen.jsx';
import { startSangre } from './sangre.js';
import './sangre.css';
const scripts = ['/assets/vendor/e6417c516f861e.js', '/assets/vendor/f0195f84b6adfa.js', '/assets/vendor/cda587f07d4e13.js', '/assets/vendor/aether-runtime.js'];
export function App({ markup, supported }) {
  const screen=useRef(null);
  const [fallback,setFallback]=useState(supported?null:markup);
  useEffect(() => {
    if(fallback){
      const runtime=window.__AetherRuntime;
      if(runtime){runtime.ScrollController.isIdleScrollAllowed=false;runtime.Scroll.reset();runtime.Scroll.destroy();runtime.Scroll.scrollTo=()=>{};}
      document.documentElement.classList.remove('has-menu-open');
      document.documentElement.classList.add('sangre-static','is-loaded','is-ready');return;
    }
    // The authored runtime owns the DOM after this single React mount.
    let cancelled = false;
    const fail=()=>{if(!cancelled){const gl=window.__AetherRuntime?.gl;if(gl)gl.isLoaded=false;setFallback(document.querySelector('main[data-taxi-view]')?.outerHTML||markup);}};
    const contextError=event=>{if(/error creating webgl context/i.test(event.message||event.reason?.message||'')){event.preventDefault();fail();}};
    document.addEventListener('webglcontextlost',fail,true);
    window.addEventListener('error',contextError);
    window.addEventListener('unhandledrejection',contextError);
    const stopSangre = startSangre(screen);
    (async () => {
      for (const src of scripts) {
        if (cancelled) return;
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = () => reject(new Error(`Unable to load ${src}`));
          document.body.appendChild(script);
        });
      }
      if(document.documentElement.classList.contains('webgl-not-available'))fail();
    })().catch(error => {
      if(!cancelled){console.warn(error.message);fail();}
    });
    return () => {cancelled=true;stopSangre();document.removeEventListener('webglcontextlost',fail,true);window.removeEventListener('error',contextError);window.removeEventListener('unhandledrejection',contextError);};
  }, [fallback,markup]);
  if(fallback)return <StaticProject markup={fallback}/>;
  return <><div id="aether-document" style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: markup }} /><SangreScreen ref={screen}/>
    {location.pathname==='/'&&<div className="sangre-startup" role="status"><div><p className="startup-title">Health,<br/>in focus.</p><p>Preparing the interactive view…</p></div><img src="/assets/sangre/hero.webp" width="2000" height="2000" alt="SANGRE product render" fetchPriority="high"/></div>}
  </>;
}

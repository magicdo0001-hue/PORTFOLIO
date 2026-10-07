import { useEffect, useRef } from 'react';
import { SangreScreen } from './SangreScreen.jsx';
import { startSangre } from './sangre.js';
import './sangre.css';
const scripts = ['/assets/vendor/e6417c516f861e.js', '/assets/vendor/f0195f84b6adfa.js', '/assets/vendor/cda587f07d4e13.js', '/assets/vendor/aether-runtime.js'];
export function App({ markup }) {
  const screen=useRef(null);
  useEffect(() => {
    // The authored runtime owns the DOM after this single React mount.
    let cancelled = false;
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
    })().catch(error => {
      document.documentElement.classList.add('is-loaded');
      document.querySelector('.indicator__label').textContent = '[ Reload to retry ]';
      console.error(error);
    });
    return () => { cancelled = true; stopSangre(); };
  }, []);
  return <><div id="aether-document" style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: markup }} /><SangreScreen ref={screen}/></>;
}

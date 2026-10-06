import { useEffect } from 'react';
const scripts = ['/assets/vendor/e6417c516f861e.js', '/assets/vendor/f0195f84b6adfa.js', '/assets/vendor/cda587f07d4e13.js', '/assets/vendor/aether-runtime.js'];
export function App({ markup }) {
  useEffect(() => {
    // The authored runtime owns the DOM after this single React mount.
    let cancelled = false;
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
    return () => { cancelled = true; };
  }, []);
  return <div id="aether-document" style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: markup }} />;
}

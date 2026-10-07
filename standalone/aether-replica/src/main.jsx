import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { supportsWebGL2 } from './capabilities.js';
import { installPortfolioNavigation, portfolioMarkup } from './portfolio.js';
document.documentElement.classList.toggle('w-mod-touch', 'ontouchstart' in window);
installPortfolioNavigation();
const markup = portfolioMarkup(document.getElementById('aether-document').innerHTML);
const supported=supportsWebGL2()&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!supported)document.documentElement.classList.add('sangre-static','is-loaded','is-ready');
else {
  document.documentElement.classList.add('has-sangre-startup');
  const preload=document.createElement('link');preload.rel='preload';preload.as='fetch';
  preload.href='/assets/sangre/sangre-display.glb';preload.crossOrigin='anonymous';document.head.append(preload);
}
createRoot(document.getElementById('root')).render(<App markup={markup} supported={supported} />);

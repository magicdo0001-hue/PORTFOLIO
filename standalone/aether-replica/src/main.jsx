import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
document.documentElement.classList.toggle('w-mod-touch', 'ontouchstart' in window);
const markup = document.getElementById('aether-document').innerHTML;
createRoot(document.getElementById('root')).render(<App markup={markup} />);

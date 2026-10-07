import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
function middleware(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (/^\/(?:en\/)?work\/sangre$/.test(url.pathname) || ['/specs', '/preorder', '/specs.html', '/preorder.html'].includes(url.pathname)) {
    const path = url.pathname.startsWith('/en/') ? '/en/work/sangre' : '/work/sangre';
    res.writeHead(302, { Location: `http://127.0.0.1:4175${path}#story` });
    res.end(); return;
  }
  if (url.pathname === '/api/agent') {
    // ponytail: the author's private AI backend is unavailable; preserve the observed error state.
    res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'The original private AI backend is not included in this local replica.' }));
    return;
  }
  next();
}
export default defineConfig({
  plugins: [react(), {
    name: 'aether-pages',
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  }],
  server: { host: '127.0.0.1', port: 4190, strictPort: true },
  preview: { host: '127.0.0.1', port: 4190, strictPort: true },
  build: {
    outDir: 'dist/client',
  },
});

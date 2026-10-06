import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
const routes = { '/specs': '/specs.html', '/preorder': '/preorder.html' };
function middleware(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/agent') {
    // ponytail: the author's private AI backend is unavailable; preserve the observed error state.
    res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'The original private AI backend is not included in this local replica.' }));
    return;
  }
  if (routes[url.pathname]) req.url = routes[url.pathname] + url.search;
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
    rollupOptions: { input: Object.fromEntries(['index', 'specs', 'preorder'].map(name => [name, fileURLToPath(new URL(`./${name}.html`, import.meta.url))])) },
  },
});

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from '../RhineLabUI/node_modules/vite/dist/node/index.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const server = await createServer({ root: fileURLToPath(new URL('../RhineLabUI', import.meta.url)), configFile: false, css: { postcss: { plugins: [] } }, server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.route('**/picking-test.html', route => route.fulfill({ contentType: 'text/html', body: '<body style="margin:0"><div id="scene" style="width:1600px;height:1000px"></div></body>' }));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/picking-test.html`);
  const checked = await page.evaluate(async () => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const { ArchiveScene } = await import('/src/scene.ts');
    const { fileAtCell } = await import('/src/archive-loop.ts');
    const { records, columnFiles } = await import('/src/data.ts');
    const scene = new ArchiveScene(document.querySelector('#scene'));
    await scene.load(); scene.setReduced(true);
    let hover = -1, selected = -1, time = 1;
    scene.onHover = index => { hover = index; };
    scene.onSelect = index => { selected = index; };
    const canvas = scene.renderer.domElement;
    const checked = [];
    for (let lane = 0; lane < 5; lane++) for (let ordinal = 0; ordinal < 2; ordinal++) {
      const files = columnFiles(lane);
      const wanted = files[ordinal];
      scene.setMode("hidden"); scene.select(files[ordinal ? 0 : 1]); scene.restoreArchive(); scene.update(time++);
      let point;
      const ray = new THREE.Raycaster();
      const matrix = new THREE.Matrix4();
      // Project exposed tops of actual instances; ignore occluded copies.
      for (let slot = 0; slot < scene.cells.length && !point; slot++) {
        if (fileAtCell(scene.cells[slot]) !== wanted) continue;
        const mesh = scene.instances[ordinal ? 0 : 1];
        mesh.getMatrixAt(slot, matrix);
        for (const x of [-2, -1, 0, 1, 2]) {
          const p = new THREE.Vector3(x, 3.69, 0.19).applyMatrix4(matrix).project(scene.camera);
          if (Math.abs(p.x) > .95 || Math.abs(p.y) > .95) continue;
          ray.setFromCamera(p, scene.camera);
          const hit = ray.intersectObjects(scene.pickTargets, true)[0];
          if (hit?.instanceId !== undefined && fileAtCell(scene.cells[hit.instanceId]) === wanted) { point = { clientX: (p.x + 1) * 800, clientY: (1 - p.y) * 500 }; break; }
        }
      }
      if (!point) throw new Error(`No hittable instance for ${records[wanted].id}`);
      canvas.dispatchEvent(new PointerEvent('pointermove', point));
      canvas.dispatchEvent(new PointerEvent('pointerdown', point));
      canvas.dispatchEvent(new PointerEvent('pointerup', point));
      if (hover !== wanted || selected !== wanted) throw new Error(`Picking mismatch for ${records[wanted].id}: hover=${hover}, selected=${selected}`);
      checked.push(records[wanted].id);
    }
    return checked;
  });
  assert.equal(checked.length, 10);
  console.log('Hover and click passed:', checked.join(', '));
} finally {
  await browser?.close();
  await server.close();
}


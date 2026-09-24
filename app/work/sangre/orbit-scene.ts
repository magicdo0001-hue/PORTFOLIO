import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type Hooks = { ready: () => void; error: () => void; marker: (index: number, x: number, y: number, visible: boolean) => void };
export type SangreScene = { chapter: (index: number) => void; explore: (enabled: boolean) => void; reset: () => void; dispose: () => void };
const views = [[3.8, 3.3, -5.2], [0.5, 3.7, -5.6], [-4.5, 3.4, -4.4], [4.0, 3.4, -5.5]];
// SolidWorks coordinates in metres. These points are on the display and storage lid.
const anchors = [[0.109, 0.089, 0.112], [0.029, 0.104, 0.13]];

export function createSangreScene(host: HTMLElement, hooks: Hooks): SangreScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setClearColor(0xeeeae2, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
  camera.position.fromArray(views[0]);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
  controls.enabled = false; renderer.domElement.style.touchAction = "pan-y"; controls.minPolarAngle = 0.25; controls.maxPolarAngle = Math.PI * 0.63;
  const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture; scene.environmentIntensity = 0.6;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0x64645a, 1.25));
  const key = new THREE.DirectionalLight(0xfff5df, 2.2); key.position.set(-3, 6, -4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.3); rim.position.set(4, 2, 4); scene.add(rim);
  const root = new THREE.Group(); scene.add(root);
  const center = new THREE.Vector3(0.071875, 0.08060, 0.12908);
  const scale = 24;
  const parts: THREE.Object3D[] = [];
  const base = new Map<THREE.Object3D, THREE.Vector3>();
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  let disposed = false, frame = 0, chapter = 0, free = false, visible = true, loaded = false, ticks = 90, explosion = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const destination = new THREE.Vector3().fromArray(views[0]);
  const invalidate = () => { ticks = 80; };
  controls.addEventListener("change", invalidate);
  const toScene = (point: number[]) => new THREE.Vector3().fromArray(point).sub(center).multiplyScalar(scale);
  const disposeObject = (object: THREE.Object3D) => object.traverse(child => {
    if (child instanceof THREE.Mesh) { child.geometry.dispose(); for (const material of Array.isArray(child.material) ? child.material : [child.material]) material.dispose(); }
  });
  new GLTFLoader().load("/sangre/sangre.glb", gltf => {
    if (disposed) { disposeObject(gltf.scene); return; }
    gltf.scene.updateMatrixWorld(true);
    const names = ["battery", "display", "housing", "chassis", "switch", "storage-lid"];
    const meshes: THREE.Mesh[] = [];
    gltf.scene.traverse(object => { if (object instanceof THREE.Mesh) meshes.push(object); });
    meshes.forEach((source, index) => {
      const m = new THREE.MeshPhysicalMaterial({ color: 0xd8d3c3, roughness: 0.32, metalness: 0.02, clearcoat: 0.18 });
      if (index === 0) { m.color.set(0x334c43); m.roughness = 0.45; m.metalness = 0.25; }
      if (index === 1) { m.color.set(0xdfdacb); m.roughness = 0.25; }
      if (index === 3) { m.color.set(0x949992); m.metalness = 0.75; m.roughness = 0.35; }
      if (index === 4) { m.color.set(0x292e2b); m.roughness = 0.6; }
      if (index === 5) { m.color.set(0xc5d1c6); m.transparent = true; m.opacity = 0.26; m.depthWrite = false; m.roughness = 0.12; m.metalness = 0.08; m.clearcoat = 0.8; m.side = THREE.DoubleSide; }
      materials.push(m);
      const mesh = new THREE.Mesh(source.geometry, m);
      source.matrixWorld.decompose(mesh.position, mesh.quaternion, mesh.scale);
      mesh.position.sub(center).multiplyScalar(scale); mesh.scale.multiplyScalar(scale);
      const group = new THREE.Group(); group.name = names[index]; group.add(mesh); root.add(group);
      parts.push(group); base.set(group, group.position.clone());
      for (const old of Array.isArray(source.material) ? source.material : [source.material]) old.dispose();
    });
    // The display face slopes toward -Z. A separate decal preserves the original CAD geometry.
    const right = new THREE.Vector3(-1, 0, 0), up = new THREE.Vector3(0, 0.671, 0.741).normalize();
    const normal = new THREE.Vector3().crossVectors(right, up);
    const rotation = new THREE.Matrix4().makeBasis(right, up, normal);
    const screenGroup = parts[1];
    const bezelMaterial = new THREE.MeshStandardMaterial({ color: 0x121b1b, roughness: 0.22, metalness: 0.1 }); materials.push(bezelMaterial);
    const bezel = new THREE.Mesh(new THREE.PlaneGeometry(0.067 * scale, 0.058 * scale), bezelMaterial);
    bezel.position.copy(toScene([0.1030, 0.0861, 0.1135])).addScaledVector(normal, 0.006);
    bezel.quaternion.setFromRotationMatrix(rotation); screenGroup.add(bezel);
    const screenMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }); materials.push(screenMaterial);
    const display = new THREE.Mesh(new THREE.PlaneGeometry(0.050 * scale, 0.050 * scale), screenMaterial);
    display.position.copy(bezel.position).addScaledVector(normal, 0.003); display.quaternion.copy(bezel.quaternion); screenGroup.add(display);
    new THREE.TextureLoader().load("/sangre/screen.png", texture => {
      if (disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      textures.push(texture); screenMaterial.map = texture; screenMaterial.needsUpdate = true; invalidate();
    }, undefined, () => { if (!disposed) { screenMaterial.color.set(0x223e3c); invalidate(); } });
    loaded = true; hooks.ready(); invalidate();
  }, undefined, () => { if (!disposed) hooks.error(); });
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); invalidate();
  };
  const ro = new ResizeObserver(resize); ro.observe(host); resize();
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; invalidate(); }); io.observe(host);
  const onContextLost = (event: Event) => { event.preventDefault(); hooks.error(); };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  const onKey = (event: KeyboardEvent) => {
    if (!free || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") { camera.position.copy(destination); controls.target.set(0, 0, 0); }
    else { const spherical = new THREE.Spherical().setFromVector3(camera.position); spherical.theta += event.key === "ArrowLeft" ? -0.13 : event.key === "ArrowRight" ? 0.13 : 0; spherical.phi = THREE.MathUtils.clamp(spherical.phi + (event.key === "ArrowUp" ? -0.1 : event.key === "ArrowDown" ? 0.1 : 0), 0.25, Math.PI * 0.63); camera.position.setFromSpherical(spherical); }
    controls.update(); invalidate();
  };
  host.addEventListener("keydown", onKey);
  const point = new THREE.Vector3();
  function render() {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    if (!visible || document.hidden || ticks <= 0) return;
    ticks--;
    if (!free) camera.position.lerp(destination, reduced.matches ? 1 : 0.08);
    const targetExplosion = chapter === 3 ? 1 : 0;
    explosion = THREE.MathUtils.lerp(explosion, targetExplosion, reduced.matches ? 1 : 0.075);
    parts.forEach((part, index) => { part.position.copy(base.get(part)!); if (index === 1) part.position.y += explosion * 0.9; if (index === 5) part.position.y += explosion * 0.6; if (index === 3) part.position.y -= explosion * 0.4; });
    controls.update(); renderer.render(scene, camera);
    anchors.forEach((anchor, index) => {
      point.copy(toScene(anchor)); point.y += explosion * (index === 0 ? 0.9 : 0.6); point.project(camera);
      hooks.marker(index, (point.x * 0.5 + 0.5) * host.clientWidth, (-point.y * 0.5 + 0.5) * host.clientHeight, !free && loaded && point.z < 1);
    });
  }
  render();
  return {
    chapter(index) { chapter = index; free = false; controls.enabled = false; renderer.domElement.style.touchAction = "pan-y"; destination.fromArray(views[index]); invalidate(); },
    explore(enabled) { free = enabled; controls.enabled = enabled; renderer.domElement.style.touchAction = enabled ? "none" : "pan-y"; invalidate(); },
    reset() { camera.position.copy(destination); controls.target.set(0, 0, 0); controls.update(); invalidate(); },
    dispose() { disposed = true; cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); host.removeEventListener("keydown", onKey); renderer.domElement.removeEventListener("webglcontextlost", onContextLost); controls.dispose(); disposeObject(root); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); environment.dispose(); renderer.dispose(); renderer.domElement.remove(); },
  };
}

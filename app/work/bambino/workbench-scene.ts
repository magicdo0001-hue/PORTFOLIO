import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { partLabels, type Finish } from "./workbench-data";

export type WorkbenchState = { chapter: number; finish: Finish; explosion: number; lock: number; focus: boolean; active: boolean };
export type WorkbenchApi = { update: (state: WorkbenchState) => void; reset: () => void; selectPart: (name: string) => void; dispose: () => void };
type Hooks = { onReady: () => void; onError: () => void; onPart: (name: string) => void; onMarker: (x: number, y: number, visible: boolean) => void };
const initial: WorkbenchState = { chapter: 0, finish: "steel", explosion: 0, lock: 0, focus: false, active: true };

export async function createWorkbench(host: HTMLElement, hooks: Hooks): Promise<WorkbenchApi> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setClearColor(0x0d110e, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-label", "BAMBINO interactive 3D model");
  renderer.domElement.setAttribute("role", "img");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.02, 100);
  camera.position.set(-5, 2.7, 7);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.085;
  controls.minDistance = 2;
  controls.maxDistance = 17;
  controls.maxPolarAngle = Math.PI * 0.87;
  controls.enablePan = true;
  controls.zoomSpeed = 0.7;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.035);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.85;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x263629, 1.25));
  const key = new THREE.DirectionalLight(0xffffff, 4.2); key.position.set(-3, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -6; key.shadow.camera.right = 6;
  key.shadow.camera.top = 6; key.shadow.camera.bottom = -6; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.025;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xedf6ed, 3); rim.position.set(4, 3, -4); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(6.5, 96), new THREE.MeshBasicMaterial({ color: 0x111912 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.65; floor.receiveShadow = true; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.608, 128), new THREE.MeshBasicMaterial({ color: 0x58734a, transparent: true, opacity: 0.28, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = -1.644; scene.add(ring);
  const textureData = new Uint8Array(256 * 128 * 4);
  let seed = 42;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < 128; y++) {
    const stripe = 222 + random() * 18;
    for (let x = 0; x < 256; x++) { const i = (y * 256 + x) * 4; const v = stripe + random() * 4; textureData[i] = v; textureData[i + 1] = v; textureData[i + 2] = v; textureData[i + 3] = 255; }
  }
  const brush = new THREE.DataTexture(textureData, 256, 128); brush.wrapS = brush.wrapT = THREE.RepeatWrapping;
  brush.repeat.set(2, 10); brush.magFilter = THREE.LinearFilter; brush.minFilter = THREE.LinearMipmapLinearFilter;
  brush.generateMipmaps = true; brush.needsUpdate = true;
  const materials = new Map<string, THREE.MeshPhysicalMaterial>();
  const finishMaterials: THREE.MeshPhysicalMaterial[] = [];
  const parts = new Map<string, THREE.Group>();
  const partOffsets = new Map<THREE.Group, THREE.Vector3>();
  const ownedGeometries = new Set<THREE.BufferGeometry>();
  const roots: THREE.Group[] = [];
  let state = { ...initial }, disposed = false, pending = 80, frame = 0, previous = 0, movingCamera = false, selected = "";
  let explosionValue = 0, lockValue = 0;
  const destination = new THREE.Vector3(-5, 2.7, 7), target = new THREE.Vector3();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const invalidate = () => { pending = Math.max(pending, 4); };
  controls.addEventListener("change", invalidate);
  controls.addEventListener("start", () => { movingCamera = false; });
  const pickMaterial = (source: THREE.Material) => {
    if (materials.has(source.name)) return materials.get(source.name)!;
    const original = source as THREE.MeshStandardMaterial;
    const m = new THREE.MeshPhysicalMaterial({ name: source.name, color: original.color ?? 0xbababa, metalness: original.metalness ?? 0, roughness: original.roughness ?? 0.3 });
    if (/clear|tank/i.test(source.name)) { m.color.set(0xffffff); m.metalness = 0; m.roughness = 0.04; m.transmission = 1; m.ior = 1.49; m.thickness = 0.035; m.attenuationDistance = Infinity; m.envMapIntensity = 1; m.side = THREE.DoubleSide; }
    if (/natural brushed|satin control/.test(source.name)) { m.color.set(0xc7c9c7); m.metalness = 1; m.roughness = 0.4; m.roughnessMap = brush; m.anisotropy = 0.4; finishMaterials.push(m); }
    if (/polished/i.test(source.name)) { m.color.set(0xd3d6d4); m.metalness = 1; m.roughness = 0.12; }
    if (/screen black/.test(source.name)) { m.color.set(0x030504); m.metalness = 0; m.roughness = 0.19; }
    materials.set(source.name, m); return m;
  };
  function flatten(source: THREE.Group, trackParts: boolean, normalize = true) {
    const root = new THREE.Group(); source.updateMatrixWorld(true);
    const keys = Object.keys(partLabels);
    source.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const mesh = new THREE.Mesh(object.geometry, Array.isArray(object.material) ? object.material.map(pickMaterial) : pickMaterial(object.material));
      ownedGeometries.add(object.geometry); object.matrixWorld.decompose(mesh.position, mesh.quaternion, mesh.scale);
      const surface = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const transparent = surface.some(material => (material as THREE.MeshPhysicalMaterial).transmission > 0);
      mesh.castShadow = !transparent; mesh.receiveShadow = !transparent;
      let name = object.name; let parent = object.parent;
      while (parent && parent !== source) { if (keys.some(key => (parent!.name.includes(key) || parent!.name.includes(key.replaceAll(" ", "_"))))) name = parent.name; parent = parent.parent; }
      const key = keys.find(key => name.includes(key) || name.includes(key.replaceAll(" ", "_"))) ?? name;
      if (trackParts) {
        if (!parts.has(key)) { const group = new THREE.Group(); group.name = key; parts.set(key, group); root.add(group); }
        mesh.userData.partKey = key; parts.get(key)!.add(mesh);
      } else root.add(mesh);
    });
    if (normalize) {
      const bounds = new THREE.Box3().setFromObject(root); const center = bounds.getCenter(new THREE.Vector3());
      root.scale.setScalar(10); root.position.copy(center).multiplyScalar(-10);
    }
    roots.push(root); return root;
  }
  const loader = new GLTFLoader();
  let v2: THREE.Group, original: THREE.Group, handle: THREE.Group, originalHandle: THREE.Group;
  let brewCenter = new THREE.Vector3(0, 0.2, 1.1); const thumb = new THREE.Vector3(0.6, 0.3, 1.5);
  const selectionBox = new THREE.BoxHelper(new THREE.Object3D(), 0x9bdd2a); selectionBox.visible = false; scene.add(selectionBox);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), new THREE.MeshBasicMaterial({ color: 0xc3ff6e })); scene.add(marker); marker.visible = false;
  const offsets: Record<string, [number, number, number]> = {
    "左侧": [-1.45, 0.1, 0], "顶部": [0, 1.2, 0.45], "方水箱": [0.65, 0.5, -1.2], "后盖板": [0, 0, -1.5],
    "group head": [0, 0.25, 1.5], "污水池": [0, -0.3, 1.8], "wand": [1.2, 0, 0.5], "main but": [0.8, 0.85, 1.4],
    "泵": [-0.6, 0, -0.5], "PCB": [1.8, 0.1, 0], "水箱提杆": [0.65, 1.1, -1.2], "漂浮子": [0, 0.1, 1.8],
    "底板": [0, -0.65, 0], "加热块": [0, 0.9, -0.6], "电磁阀": [-0.8, 0.2, -0.2], "屏幕": [-0.6, 1, 1.3], "按钮": [0.3, 1.15, 1.3],
  };
  function setFinish(finish: Finish) {
    const colors = { steel: 0xc7c9c7, white: 0xe6e5e0, black: 0x151719, blue: 0x101d4b };
    finishMaterials.forEach(m => { m.color.set(colors[finish]); m.metalness = finish === "steel" ? 1 : finish === "white" ? 0.05 : 0.45; m.roughness = finish === "steel" ? 0.4 : 0.28; m.roughnessMap = finish === "steel" ? brush : null; m.anisotropy = finish === "steel" ? 0.4 : 0; m.clearcoat = finish === "steel" ? 0 : 0.22; m.needsUpdate = true; });
  }
  function reset() {
    if (state.chapter === 4) { destination.set(-6.6, 3.8, 9.2); target.set(0, 0.1, 0); }
    else if (state.chapter === 3 || (state.chapter === 1 && state.focus)) { target.copy(state.chapter === 1 ? new THREE.Vector3(0, 0.45, 0.65) : brewCenter); destination.copy(target).add(new THREE.Vector3(-2.7, 1.1, 4.5)); }
    else { destination.set(-5, 2.7, 7); target.set(0, 0, 0); }
    movingCamera = true; pending = 100;
    if (reduced.matches) { camera.position.copy(destination); controls.target.copy(target); movingCamera = false; }
  }
  function update(next: WorkbenchState) {
    const changed = next.chapter !== state.chapter || next.focus !== state.focus;
    if (next.finish !== state.finish) setFinish(next.finish);
    state = { ...next };
    if (v2) { v2.visible = state.chapter !== 1; original.visible = state.chapter === 1; handle.visible = state.chapter === 3; originalHandle.visible = state.chapter === 1; }
    if (changed) reset();
    marker.visible = state.chapter === 3 && state.active;
    controls.enabled = state.active;
    selectionBox.visible = !!selected && state.chapter === 4;
    pending = 100;
  }
  function selectPart(key: string) {
    selected = key;
    if (parts.has(key)) { selectionBox.setFromObject(parts.get(key)!); selectionBox.visible = state.chapter === 4; }
    else selectionBox.visible = false;
    invalidate();
  }
  const resize = () => { const { width, height } = host.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); invalidate(); };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(); let downX = 0, downY = 0;
  const pointerDown = (event: PointerEvent) => { downX = event.clientX; downY = event.clientY; };
  const pointerUp = (event: PointerEvent) => {
    if (state.chapter !== 4 || Math.hypot(event.clientX - downX, event.clientY - downY) > 6 || !v2) return;
    const box = host.getBoundingClientRect(); pointer.set((event.clientX - box.left) / box.width * 2 - 1, -(event.clientY - box.top) / box.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObject(v2, true)[0];
    if (hit?.object.userData.partKey) { selectPart(hit.object.userData.partKey); hooks.onPart(hit.object.userData.partKey); }
  };
  host.addEventListener("pointerdown", pointerDown); host.addEventListener("pointerup", pointerUp);
  const keyboard = (event: KeyboardEvent) => {
    if (!state.active) return;
    const offset = camera.position.clone().sub(controls.target);
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), event.key === "ArrowLeft" ? 0.12 : -0.12);
    else if (event.key === "+" || event.key === "=") offset.multiplyScalar(0.9);
    else if (event.key === "-") offset.multiplyScalar(1.1);
    else if (event.key === "Home") { reset(); event.preventDefault(); return; }
    else return;
    event.preventDefault(); movingCamera = false; camera.position.copy(controls.target).add(offset); invalidate();
  };
  host.addEventListener("keydown", keyboard);
  const lost = (event: Event) => { event.preventDefault(); hooks.onError(); };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  function render(time: number) {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    if (!state.active || document.hidden || time - previous < 28) return;
    const dt = Math.min((time - previous) / 1000, 0.06); previous = time;
    const goalExplosion = state.chapter === 4 ? state.explosion : 0;
    if (movingCamera || Math.abs(explosionValue - goalExplosion) > 0.001 || Math.abs(lockValue - state.lock) > 0.001) pending = Math.max(pending, 3);
    if (pending <= 0) return;
    pending--;
    const speed = reduced.matches ? 1 : 1 - Math.exp(-7 * dt);
    if (movingCamera) { camera.position.lerp(destination, speed); controls.target.lerp(target, speed); if (camera.position.distanceTo(destination) < 0.005) movingCamera = false; }
    explosionValue = THREE.MathUtils.lerp(explosionValue, goalExplosion, speed); lockValue = THREE.MathUtils.lerp(lockValue, state.lock, speed);
    partOffsets.forEach((offset, part) => part.position.copy(offset).multiplyScalar(explosionValue / 10));
    if (handle) {
      handle.position.copy(brewCenter); handle.position.y += 0.025 - Math.max(0, 1 - lockValue / 0.35) * 0.48;
      handle.rotation.y = THREE.MathUtils.lerp(-0.6, 0, THREE.MathUtils.clamp((lockValue - 0.35) / 0.65, 0, 1));
      marker.position.copy(thumb);
    }
    controls.update(); scene.updateMatrixWorld(true);
    if (selectionBox.visible && parts.has(selected)) selectionBox.setFromObject(parts.get(selected)!);
    renderer.render(scene, camera);
    if (marker.visible) { const point = marker.position.clone().project(camera); hooks.onMarker((point.x * 0.5 + 0.5) * host.clientWidth, (-point.y * 0.5 + 0.5) * host.clientHeight, point.z < 1); }
    else hooks.onMarker(0, 0, false);
  }
  function dispose() {
    if (disposed) return; disposed = true; cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
    host.removeEventListener("pointerdown", pointerDown); host.removeEventListener("pointerup", pointerUp); host.removeEventListener("keydown", keyboard);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    ownedGeometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); brush.dispose(); environment.dispose();
    floor.geometry.dispose(); floor.material.dispose(); ring.geometry.dispose(); ring.material.dispose(); marker.geometry.dispose(); marker.material.dispose(); selectionBox.geometry.dispose(); (selectionBox.material as THREE.Material).dispose();
    renderer.dispose(); renderer.domElement.remove();
  }
  try {
    const [a, b, c] = await Promise.all([loader.loadAsync("/bambino/bambino-v2.glb"), loader.loadAsync("/bambino/bambino-original-reference.glb"), loader.loadAsync("/bambino/portafilter-reference.glb")]);
    v2 = flatten(a.scene, true); original = flatten(b.scene, false); handle = flatten(c.scene, false, false); handle.scale.setScalar(10);
    originalHandle = handle.clone(true); originalHandle.position.set(0, 0.32, 0.65); originalHandle.rotation.y = -0.4;
    scene.add(v2, original, handle, originalHandle); scene.updateMatrixWorld(true);
    const brew = parts.get("group head");
    if (brew) { const box = new THREE.Box3().setFromObject(brew); brewCenter = box.getCenter(new THREE.Vector3()); brewCenter.y = box.min.y; thumb.set(box.max.x - 0.22, brewCenter.y - 0.02, brewCenter.z + 0.08); }
    parts.forEach((part, key) => partOffsets.set(part, new THREE.Vector3(...(offsets[key] ?? [1, 0, 0]))));
    setFinish(state.finish); update(state); reset(); hooks.onReady(); frame = requestAnimationFrame(render);
    return { update, reset, selectPart, dispose };
  } catch (error) { dispose(); throw error; }
}

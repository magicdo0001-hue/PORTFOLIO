import * as THREE from "three";
import { createCityNavigation } from "./city-navigation";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { districts, type DistrictId } from "./city-data";

type CityOptions = {
  host: HTMLElement;
  labels: (HTMLButtonElement | null)[];
  onSelect: (id: DistrictId) => void;
  onReady: () => void;
  onError: () => void;
};

// All architecture is actual geometry. Static geometry is merged by material
// per district, so the town stays inexpensive while buildings remain pickable.
export function createCity({ host, labels, onSelect, onReady, onError }: CityOptions) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-12, 12, 10, -10, .1, 100);
  const target = new THREE.Vector3(0, 1.1, 0);
  camera.position.set(13, 14, 20);
  camera.lookAt(target);
  scene.add(new THREE.HemisphereLight(0xfff7e8, 0x8b9886, 1.9));
  const sun = new THREE.DirectionalLight(0xfff4df, 3.0);
  sun.position.set(-9, 18, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 55 });
  sun.shadow.normalBias = .04;
  sun.shadow.bias = -.0002;
  sun.shadow.radius = 3;
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .15 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -.48;
  ground.receiveShadow = true;
  scene.add(ground);

  const colors = {
    stone: 0xe6decd, cream: 0xf3e8ce, sage: 0x78927b, green: 0x354f43,
    glass: 0x536f68, wood: 0x967256, gold: 0xdab76e, terra: 0xbf775e,
    roof: 0xb36348, road: 0x8d918b, white: 0xf8f1df, leaf: 0x6f8750,
    dark: 0x3e4843, water: 0x81b4b3,
  };
  const materials = new Map<number, THREE.MeshStandardMaterial>();
  const geometries = new Set<THREE.BufferGeometry>();
  const material = (color: number) => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .85 }));
    return materials.get(color)!;
  };
  function mesh(parent: THREE.Object3D, geo: THREE.BufferGeometry, color: number, x: number, y: number, z: number) {
    geometries.add(geo);
    const item = new THREE.Mesh(geo, material(color));
    item.position.set(x, y, z);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }
  function box(p: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, d: number, c: number, radius = 0) {
    return mesh(p, radius ? new RoundedBoxGeometry(w, h, d, 2, radius) : new THREE.BoxGeometry(w, h, d), c, x, y, z);
  }
  function cylinder(p: THREE.Object3D, x: number, y: number, z: number, r: number, h: number, c: number, top = r, sides = 12) {
    return mesh(p, new THREE.CylinderGeometry(top, r, h, sides), c, x, y, z);
  }
  function sphere(p: THREE.Object3D, x: number, y: number, z: number, r: number, c: number) {
    return mesh(p, new THREE.IcosahedronGeometry(r, 1), c, x, y, z);
  }
  function arch(p: THREE.Object3D, x: number, y: number, z: number, w: number, h: number) {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(w / 2, h - w / 2);
    shape.absarc(0, h - w / 2, w / 2, 0, Math.PI, false);
    shape.lineTo(-w / 2, 0);
    mesh(p, new THREE.ExtrudeGeometry(shape, { depth: .035, bevelEnabled: false, curveSegments: 10 }), colors.glass, x, y, z);
    box(p, x, y + (h - w / 2) / 2, z + .04, .035, h - w / 2, .04, colors.cream);
    box(p, x, y + h * .42, z + .04, w, .045, .04, colors.cream);
    box(p, x, y - .015, z + .025, w + .12, .08, .12, colors.cream);
  }
  function roof(p: THREE.Object3D, x: number, y: number, z: number, w: number, d: number, h: number) {
    const geo = new THREE.ConeGeometry(1, h, 4);
    geo.rotateY(Math.PI / 4);
    geo.scale(w / Math.SQRT2, 1, d / Math.SQRT2);
    mesh(p, geo, colors.roof, x, y, z);
    // Delicate standing seams make the low-poly roofs read as architecture.
    for (let i = 0; i < 17; i++) {
      const px = (i / 16 - .5) * w * .94;
      const start = Math.abs(px) / w * d + .025;
      const end = d / 2 - .025;
      const midpoint = (start + end) / 2;
      const angle = Math.atan2(h * 2, d);
      const seam = box(p, x + px, y + h / 2 - h * 2 / d * midpoint + .015, z + midpoint, .022, .015, (end - start) / Math.cos(angle), 0xd38e69);
      seam.rotation.x = angle;
    }
  }
  let seed = 19;
  function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function tree(p: THREE.Object3D, x: number, z: number, size = 1, tall = false) {
    cylinder(p, x, .65, z, .33 * size, .22, colors.stone);
    cylinder(p, x, 1.05, z, .055 * size, 1.05 * size, colors.wood);
    if (tall) {
      const leaf = sphere(p, x, 1.7 * size, z, .4 * size, colors.leaf);
      leaf.scale.y = 2.8;
    } else {
      for (let i = 0; i < 7; i++) {
        const angle = i * 2.4;
        sphere(p, x + Math.cos(angle) * .29 * size, 1.6 * size + random() * .4, z + Math.sin(angle) * .29 * size, (.32 + random() * .15) * size, [0x809154, 0x6f8750, 0x93a566][i % 3]);
      }
    }
  }
  function planter(p: THREE.Object3D, x: number, z: number, w: number, d: number) {
    box(p, x, .68, z, w, .28, d, colors.stone, .04);
    box(p, x, .85, z, w * .94, .25, d * .9, colors.leaf, .07);
    for (let i = 0; i < 6; i++) sphere(p, x + (random() - .5) * w * .9, 1, z + (random() - .5) * d * .8, .065, i % 2 ? colors.white : colors.gold);
  }
  function steps(p: THREE.Object3D, x: number, z: number, width: number) {
    for (let i = 0; i < 4; i++) box(p, x, .61 + .08 * i, z - .15 * i, width, .12, .75 - .15 * i, colors.cream);
  }
  function lamp(p: THREE.Object3D, x: number, z: number) {
    cylinder(p, x, .69, z, .1, .24, colors.dark);
    cylinder(p, x, 1.37, z, .035, 1.2, colors.dark);
    sphere(p, x, 2.02, z, .12, 0xffdda0);
    cylinder(p, x, 2.15, z, .17, .11, colors.dark, .015);
  }
  function bench(p: THREE.Object3D, x: number, z: number, angle = 0) {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = angle; p.add(group);
    for (const side of [-.38, .38]) box(group, side, .76, 0, .06, .36, .36, colors.dark);
    for (let j = 0; j < 3; j++) box(group, 0, .95, -.12 + j * .13, 1, .045, .09, colors.wood);
    box(group, 0, 1.17, -.2, 1, .27, .05, colors.wood);
  }
  const environment = new THREE.Group(); scene.add(environment);
  box(environment, 0, 0, 0, 15.5, .85, 15.5, colors.stone, .35);
  box(environment, 0, .435, 0, 15.25, .04, 15.25, colors.road, .24);
  // Four generous sidewalks and an open crossroad.
  for (const x of [-3.25, 3.25]) for (const z of [-3.25, 3.25]) {
    box(environment, x, .52, z, 5.35, .18, 5.35, colors.cream, .22);
    for (let i = -2; i <= 2; i++) {
      box(environment, x + i, .615, z, .014, .003, 5, 0xd8d0bf);
      box(environment, x, .615, z + i, 5, .003, .014, 0xd8d0bf);
    }
  }
  for (let i = -7; i <= 7; i++) {
    if (Math.abs(i) > 1) {
      box(environment, i, .468, 0, .43, .012, .055, colors.white);
      box(environment, 0, .468, i, .055, .012, .43, colors.white);
    }
    box(environment, i, .468, 6.62, .43, .012, .055, colors.white);
    box(environment, -6.62, .468, i, .055, .012, .43, colors.white);
  }
  for (const direction of [-1, 1]) for (let i = -3; i <= 3; i++) {
    box(environment, i * .16, .474, direction * 1.28, .09, .014, .55, colors.white);
    box(environment, direction * 1.28, .474, i * .16, .55, .014, .09, colors.white);
  }
  for (const x of [-5.6, 5.6]) for (const z of [-5.5, -1.15, 1.15, 5.5]) lamp(environment, x, z);
  for (const [x, z, scale, tall] of [
    [-5.4,-4.8,1,0],[-5.5,-2.3,.85,0],[-1.2,-5.4,.9,1],[-1.2,-2.1,.8,1],
    [1.2,-5.2,.9,1],[5.4,-4.9,1,0],[5.5,-2.7,.9,1],[1.3,-1.5,.8,0],
    [-5.4,1.5,1,0],[-5.5,4.8,.9,0],[-1.25,1.5,.8,1],[-1.25,5.2,.8,1],
    [1.3,1.4,.9,0],[5.3,2,1,1],[5.3,5.2,1,0],[2.2,5.5,.8,0],
  ]) tree(environment, x, z, scale, !!tall);
  bench(environment, -2.5, -1.1); bench(environment, 4.3, 5.4); bench(environment, 5.4, -1.5, Math.PI / 2);

  const blocks = districts.map((district) => {
    const group = new THREE.Group();
    group.position.set(district.position[0], 0, district.position[1]);
    group.userData.district = district.id;
    scene.add(group);
    return group;
  });
  const library = blocks[0];
  box(library, 0, 2.32, 0, 3.65, 3.4, 3.15, colors.sage, .08);
  box(library, 0, 2.3, 1.59, 2.7, 2.9, .08, colors.glass);
  for (let i = 0; i < 7; i++) box(library, -1.45 + i * .48, 2.37, 1.68, .13, 3.5, .25, colors.cream);
  for (let i = 0; i < 7; i++) box(library, 1.89, 2.37, -1.35 + i * .45, .19, 3.5, .12, colors.cream);
  for (const y of [1.1, 2.05, 3.1]) box(library, 0, y, 1.66, 3.4, .065, .07, colors.wood);
  box(library, 0, 4.1, 0, 3.95, .18, 3.4, colors.cream);
  box(library, 0, 4.22, 0, 3.6, .1, 3.1, colors.sage);
  for (const x of [-1.82, 1.82]) box(library, x, 4.3, 0, .12, .35, 3.2, colors.sage);
  box(library, 0, 4.3, -1.55, 3.7, .35, .12, colors.sage);
  // Open book sculpture.
  for (const side of [-1, 1]) {
    const cover = box(library, side * .4, 4.45, 0, .86, .11, 1.03, colors.wood);
    cover.rotation.z = side * .2;
    const pages = box(library, side * .4, 4.53, 0, .8, .12, .97, colors.white);
    pages.rotation.z = side * .2;
    for (let i = 0; i < 5; i++) box(library, side * .4, 4.48 + i * .025, .49, .77, .008, .015, colors.stone).rotation.z = side * .2;
  }
  steps(library, 0, 1.97, 2.5);
  planter(library, -1.65, 1.92, .55, .65); planter(library, 1.65, 1.92, .55, .65);

  const hall = blocks[1];
  box(hall, 0, 2.05, -.65, 3.85, 2.85, 2.2, colors.gold, .055);
  for (const x of [-1.43, 1.43]) {
    box(hall, x, 1.95, .58, 1, 2.65, 2.05, colors.gold);
    roof(hall, x, 3.59, .25, 1.2, 3, .65);
    arch(hall, x, .85, 1.625, .6, 1.25);
    box(hall, x, 2.65, 1.62, .56, .6, .04, colors.glass);
    box(hall, x, 2.25, 1.66, .74, .1, .13, colors.cream);
  }
  roof(hall, 0, 3.83, -.65, 4.1, 2.5, .85);
  for (const x of [-1.3, 0, 1.3]) arch(hall, x, 1, .48, .65, 1.35);
  box(hall, 0, 3.85, -.44, 1.05, 3.25, .92, colors.gold);
  for (const y of [2.8, 4.5, 5.05]) box(hall, 0, y, -.44, 1.2, .12, 1.06, colors.cream);
  for (const x of [-.36, .36]) box(hall, x, 4.8, .07, .1, .65, .13, colors.cream);
  const dome = mesh(hall, new THREE.SphereGeometry(.59, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), colors.sage, 0, 5.12, -.44);
  dome.scale.z = .9;
  cylinder(hall, 0, 5.79, -.44, .025, .32, colors.green);
  const face = cylinder(hall, 0, 3.92, .047, .4, .045, colors.cream, .4, 32);
  face.rotation.x = Math.PI / 2;
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * Math.PI * 2;
    const tick = box(hall, Math.sin(angle) * .31, 3.92 + Math.cos(angle) * .31, .075, .027, .065, .02, colors.dark);
    tick.rotation.z = -angle;
  }
  box(hall, 0, 4.02, .1, .035, .21, .025, colors.dark).rotation.z = -.4;
  box(hall, .09, 3.91, .11, .23, .027, .025, colors.dark).rotation.z = -.25;
  cylinder(hall, 0, .76, 1.27, .5, .25, colors.cream, .5, 24);
  cylinder(hall, 0, .9, 1.27, .4, .04, colors.water, .4, 24);
  cylinder(hall, 0, 1.14, 1.27, .08, .5, colors.cream);
  cylinder(hall, 0, 1.4, 1.27, .24, .08, colors.cream);
  steps(hall, 0, 2, 2.4);

  const cafe = blocks[2];
  box(cafe, 0, 1.63, -.4, 3.55, 2.05, 2.45, colors.terra, .06);
  box(cafe, 0, 2.68, -.4, 3.8, .13, 2.65, colors.cream);
  roof(cafe, 0, 3.05, -.4, 3.95, 2.85, .8);
  for (const x of [-1.15, 0, 1.15]) arch(cafe, x, .77, .845, .72, 1.55);
  box(cafe, 0, 2.17, 1.18, 1.95, .07, .87, colors.cream).rotation.x = .17;
  for (let i = 0; i < 9; i++) {
    const stripe = box(cafe, -.86 + i * .215, 2.19, 1.18, .105, .028, .89, colors.roof);
    stripe.rotation.x = .17;
    box(cafe, -.86 + i * .215, 2.04, 1.6, .105, .22, .04, colors.roof);
  }
  for (const x of [-1.08, 1.08]) {
    cylinder(cafe, x, .85, 1.98, .04, .6, colors.wood);
    cylinder(cafe, x, 1.13, 1.98, .36, .065, colors.cream, .36, 20);
    for (const side of [-1, 1]) {
      cylinder(cafe, x + side * .49, .81, 1.98, .14, .36, colors.wood);
      box(cafe, x + side * .57, 1.07, 1.98, .07, .32, .28, colors.wood);
    }
  }
  cylinder(cafe, -1.08, 1.65, 1.98, .025, 1.3, colors.wood);
  cylinder(cafe, -1.08, 2.22, 1.98, .72, .28, colors.cream, .04, 8);
  planter(cafe, -1.85, .85, .5, .75);

  const compass = blocks[3];
  box(compass, 0, 1.56, 0, 3.55, 1.86, 3, colors.cream, .32);
  box(compass, 0, 1.55, 1.505, 2.78, 1.55, .05, colors.glass);
  for (let i = 0; i < 6; i++) box(compass, -1.4 + i * .56, 1.54, 1.56, .065, 1.73, .08, colors.wood);
  box(compass, 0, 2.53, 0, 3.78, .22, 3.23, colors.stone, .32);
  box(compass, 0, 2.66, 0, 3.4, .08, 2.85, colors.leaf, .27);
  const compassRing = mesh(compass, new THREE.TorusGeometry(.83, .09, 6, 32, Math.PI * 1.7), colors.cream, 0, 2.78, 0);
  compassRing.rotation.x = -Math.PI / 2;
  box(compass, .42, 2.84, -.12, .82, .07, .2, colors.cream).rotation.y = -.7;
  steps(compass, 0, 1.9, 2.1);
  planter(compass, -1.72, 1.67, .46, .65);
  planter(compass, 1.72, 1.67, .46, .65);

  // The model can turn through 360 degrees, so every façade has detail.
  for (const side of [-1, 1]) {
    box(library, 0, 2.3, side * 1.59, 2.7, 2.9, .06, colors.glass);
    for (let i = 0; i < 7; i++) box(library, -1.45 + i * .48, 2.37, side * 1.68, .13, 3.5, .25, colors.cream);
    box(library, side * 1.84, 2.3, 0, .06, 2.9, 2.6, colors.glass);
    for (let i = 0; i < 7; i++) box(library, side * 1.89, 2.37, -1.35 + i * .45, .19, 3.5, .12, colors.cream);
    for (let i = 0; i < 3; i++) {
      box(hall, side * 1.94, 2.2, -1.15 + i * .9, .04, .9, .48, colors.glass);
      box(hall, side * 1.97, 1.73, -1.15 + i * .9, .09, .07, .62, colors.cream);
      box(cafe, side * 1.79, 1.6, -.95 + i * .65, .04, .95, .38, colors.glass);
      box(compass, side * 1.78, 1.54, -.8 + i * .8, .035, 1.36, .55, colors.glass);
    }
  }
  for (let i = 0; i < 5; i++) {
    box(hall, -1.5 + i * .75, 2.23, -1.77, .45, .84, .04, colors.glass);
    box(hall, -1.5 + i * .75, 1.78, -1.8, .6, .07, .12, colors.cream);
    box(cafe, -1.3 + i * .65, 1.65, -1.64, .42, 1.1, .04, colors.glass);
    box(compass, -1.2 + i * .6, 1.56, -1.51, .44, 1.4, .035, colors.glass);
  }
  function batch(group: THREE.Group, id?: DistrictId) {
    group.updateMatrixWorld(true);
    const inverse = group.matrixWorld.clone().invert();
    const byMaterial = new Map<THREE.Material, THREE.BufferGeometry[]>();
    const oldMeshes: THREE.Mesh[] = [];
    group.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      oldMeshes.push(child);
      const geo = (child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone()).applyMatrix4(inverse.clone().multiply(child.matrixWorld));
      const mat = child.material as THREE.Material;
      const list = byMaterial.get(mat) ?? [];
      list.push(geo); byMaterial.set(mat, list);
    });
    for (const item of oldMeshes) item.removeFromParent();
    for (const [mat, parts] of byMaterial) {
      const merged = mergeGeometries(parts);
      for (const part of parts) part.dispose();
      if (!merged) continue;
      geometries.add(merged);
      const item = new THREE.Mesh(merged, mat);
      item.castShadow = true; item.receiveShadow = true;
      if (id) item.userData.district = id;
      group.add(item);
    }
  }
  batch(environment);
  blocks.forEach((block, i) => batch(block, districts[i].id));

  const vehicles = [colors.sage, colors.terra, colors.cream].map((color) => {
    const car = new THREE.Group(); scene.add(car);
    box(car, 0, .7, 0, .46, .25, .82, color, .1);
    box(car, 0, .9, -.03, .38, .23, .43, color, .08);
    box(car, 0, .93, .2, .32, .12, .025, colors.glass);
    box(car, 0, .93, -.255, .32, .12, .025, colors.glass);
    for (const x of [-.245, .245]) for (const z of [-.25, .25]) {
      const wheel = cylinder(car, x, .61, z, .1, .065, colors.dark);
      wheel.rotation.z = Math.PI / 2;
    }
    for (const x of [-.15, .15]) box(car, x, .72, .415, .09, .07, .025, colors.white);
    batch(car); return car;
  });
  const people = Array.from({ length: 9 }, (_, i) => {
    const person = new THREE.Group(); scene.add(person);
    const c = [colors.sage, colors.roof, colors.gold, colors.glass][i % 4];
    cylinder(person, 0, .88, 0, .07, .25, c, .1, 8);
    sphere(person, 0, 1.08, 0, .072, 0xd4ae85);
    for (const x of [-.04, .04]) cylinder(person, x, .67, 0, .025, .2, colors.dark, .025, 6);
    batch(person); return person;
  });

  const selection = mesh(scene, new THREE.RingGeometry(2.12, 2.17, 64), colors.green, -3.2, .627, -3.2);
  selection.rotation.x = -Math.PI / 2;
  selection.castShadow = false;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projected = new THREE.Vector3();
  let selected: DistrictId = "search";
  let hovering: DistrictId | null = null;
  let paused = true;
  let visible = true;
  let disposed = false;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let dirty = true;
  let width = 1;
  let height = 1;
  const invalidate = () => { dirty = true; schedule(); };
  const navigation = createCityNavigation(camera, host, invalidate);
  const press = new THREE.Vector2();
  let dragged = false;
  const pointerDown = (event: PointerEvent) => {
    press.set(event.clientX, event.clientY);
    dragged = false;
  };
  const pick = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(blocks, true).find((hit) => hit.object.userData.district)?.object.userData.district as DistrictId | undefined;
  };
  const move = (event: PointerEvent) => {
    if (event.buttons && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5) dragged = true;
    hovering = event.buttons ? null : pick(event) ?? null;
    host.style.cursor = event.buttons ? "grabbing" : hovering ? "pointer" : "grab";
    dirty = true;
  };
  const leave = () => { hovering = null; dirty = true; };
  const click = (event: PointerEvent) => { if (dragged || event.button !== 0) return; const id = pick(event); if (id) onSelect(id); };
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("click", click);
  host.addEventListener("pointerdown", pointerDown);
  const resize = () => {
    width = host.clientWidth; height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height);
    const aspect = width / height;
    const half = Math.max(8.8, 11.4 / aspect);
    camera.left = -half * aspect; camera.right = half * aspect;
    camera.top = half; camera.bottom = -half;
    camera.updateProjectionMatrix(); dirty = true;
  };
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; lastTime = 0; schedule(); });
  intersectionObserver.observe(host);
  const visibilityChange = () => { lastTime = 0; schedule(); };
  document.addEventListener("visibilitychange", visibilityChange);
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const motionChange = () => { dirty = true; schedule(); };
  media.addEventListener("change", motionChange);
  const contextLost = (event: Event) => { event.preventDefault(); onError(); dispose(); };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);

  function render(time: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    navigation.update();
    const moving = !paused;
    if (moving) elapsed += delta;
    if (moving || dirty) {
      blocks.forEach((block, i) => { block.position.y = hovering === districts[i].id && moving ? .1 : 0; });
      vehicles.forEach((car, i) => {
        const distance = (elapsed * .8 + i * 16) % 53.6;
        const side = Math.floor(distance / 13.4), t = distance % 13.4;
        if (side === 0) car.position.set(-6.7 + t, 0, 6.95);
        if (side === 1) car.position.set(6.7, 0, 6.7 - t);
        if (side === 2) car.position.set(6.7 - t, 0, -6.7);
        if (side === 3) car.position.set(-6.7, 0, -6.7 + t);
        car.rotation.y = [Math.PI / 2, Math.PI, -Math.PI / 2, 0][side];
      });
      people.forEach((person, i) => {
        const t = Math.sin(elapsed * .12 + i * 2.1);
        person.position.set(i % 2 ? -1.05 : 1.05, moving ? Math.sin(elapsed * 5 + i) * .015 : 0, t * 5.4);
        person.rotation.y = Math.cos(elapsed * .12 + i * 2.1) > 0 ? 0 : Math.PI;
      });
      const active = districts.find((d) => d.id === selected)!;
      selection.position.set(active.position[0], .627, active.position[1]);
      scene.updateMatrixWorld(); camera.updateMatrixWorld();
      labels.forEach((label, i) => {
        if (!label) return;
        projected.set(districts[i].position[0], districts[i].height + .32, districts[i].position[1]).project(camera);
        label.style.left = `${(projected.x * .5 + .5) * width}px`;
        label.style.top = `${(-projected.y * .5 + .5) * height}px`;
      });
      renderer.render(scene, camera); dirty = false;
    }
    if (moving) schedule();
  }
  function schedule() { if (!frame && !disposed) frame = requestAnimationFrame(render); }
  // Event-driven rendering also supports a fully still reduced-motion view.
  host.addEventListener("pointermove", invalidate);
  host.addEventListener("pointerleave", invalidate);
  const renderResize = new ResizeObserver(invalidate); renderResize.observe(host);
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect(); renderResize.disconnect(); intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", visibilityChange);
    media.removeEventListener("change", motionChange);
    host.removeEventListener("pointermove", move); host.removeEventListener("pointermove", invalidate);
    host.removeEventListener("pointerleave", leave); host.removeEventListener("pointerleave", invalidate);
    host.removeEventListener("click", click);
    host.removeEventListener("pointerdown", pointerDown);
    navigation.dispose();
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    for (const geo of geometries) geo.dispose();
    ground.geometry.dispose(); (ground.material as THREE.Material).dispose();
    for (const mat of materials.values()) mat.dispose();
    renderer.dispose(); renderer.domElement.remove();
  }
  render(0); onReady(); schedule();
  return {
    select(id: DistrictId) { selected = id; invalidate(); },
    pause(value: boolean) { paused = value; invalidate(); },
    resetView() { navigation.reset(); },
    dispose,
  };
}

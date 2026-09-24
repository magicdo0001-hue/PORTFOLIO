import * as THREE from "three";

/** Visual reconstruction from the user's structural render, not manufacturing geometry. */
export function createStructureDetails(toScene: (point: number[]) => THREE.Vector3, scale: number) {
  const group = new THREE.Group();
  group.name = "reference-derived-internal-illustration";
  const pcb = new THREE.MeshStandardMaterial({ color: 0x183d30, roughness: 0.65, metalness: 0.1 });
  const chip = new THREE.MeshStandardMaterial({ color: 0x151919, roughness: 0.65 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xb7bdb8, metalness: 0.8, roughness: 0.3 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xb39958, metalness: 0.7, roughness: 0.35 });
  const copper = new THREE.MeshStandardMaterial({ color: 0xb7783d, metalness: 0.65, roughness: 0.36 });
  const ferrite = new THREE.MeshStandardMaterial({ color: 0x333838, roughness: 0.75 });
  const box = (size: number[], point: number[], material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0] * scale, size[1] * scale, size[2] * scale), material);
    mesh.position.copy(toScene(point)); group.add(mesh); return mesh;
  };
  const ivory = new THREE.MeshStandardMaterial({ color: 0xcac8b8, roughness: 0.42, metalness: 0.02 });
  const halfWidth = 0.079 * scale, halfDepth = 0.050 * scale, radius = 0.007 * scale;
  const outline = new THREE.Shape();
  outline.moveTo(-halfWidth + radius, -halfDepth);
  outline.lineTo(halfWidth - radius, -halfDepth); outline.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + radius);
  outline.lineTo(halfWidth, halfDepth - radius); outline.quadraticCurveTo(halfWidth, halfDepth, halfWidth - radius, halfDepth);
  outline.lineTo(-halfWidth + radius, halfDepth); outline.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - radius);
  outline.lineTo(-halfWidth, -halfDepth + radius); outline.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + radius, -halfDepth);
  const baseGeometry = new THREE.ExtrudeGeometry(outline, { depth: 0.003 * scale, bevelEnabled: true, bevelThickness: 0.0005 * scale, bevelSize: 0.0006 * scale, bevelSegments: 2, steps: 1 });
  baseGeometry.rotateX(-Math.PI / 2);
  const base = new THREE.Mesh(baseGeometry, ivory); base.position.copy(toScene([0.0715, 0.047, 0.129])); group.add(base);
  for (const x of [0.003, 0.059, 0.140]) for (const z of [0.092, 0.165]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.003 * scale, 0.0035 * scale, 0.005 * scale, 20), ivory);
    post.position.copy(toScene([x, 0.0525, z])); group.add(post);
    const opening = new THREE.Mesh(new THREE.CircleGeometry(0.0017 * scale, 16), ferrite);
    opening.rotation.x = -Math.PI / 2; opening.position.copy(toScene([x, 0.0551, z])); group.add(opening);
  }
  for (const x of [0.067, 0.141]) {
    const profile = new THREE.Shape(); profile.moveTo(0, 0); profile.lineTo(0.029 * scale, 0); profile.lineTo(0.004 * scale, 0.031 * scale); profile.closePath();
    const support = new THREE.Mesh(new THREE.ExtrudeGeometry(profile, { depth: 0.002 * scale, bevelEnabled: false }).rotateY(Math.PI / 2), ivory);
    support.position.copy(toScene([x, 0.05, 0.142])); group.add(support);
  }
  box([0.065, 0.0014, 0.045], [0.101, 0.064, 0.12], pcb);
  box([0.046, 0.0014, 0.038], [0.033, 0.062, 0.128], pcb);
  // Broad functional zones and a few components establish scale without inventing a circuit.
  for (const [x, z, width] of [[0.082, 0.106, 0.010], [0.104, 0.106, 0.013], [0.12, 0.13, 0.009], [0.027, 0.116, 0.010]]) {
    box([width, 0.002, width * 0.75], [x, 0.066, z], chip);
    for (let pin = 0; pin < 5; pin++) {
      box([0.001, 0.0007, 0.002], [x - width * 0.4 + pin * width * 0.2, 0.0655, z - width * 0.45], metal);
      box([0.001, 0.0007, 0.002], [x - width * 0.4 + pin * width * 0.2, 0.0655, z + width * 0.45], metal);
    }
  }
  for (let i = 0; i < 7; i++) {
    box([0.0022, 0.0018, 0.003], [0.076 + i * 0.007, 0.066, 0.137], gold);
    box([0.003, 0.002, 0.002], [0.015 + i * 0.005, 0.064, 0.142], metal);
  }
  box([0.036, 0.016, 0.026], [0.033, 0.075, 0.131], chip);
  box([0.003, 0.001, 0.022], [0.033, 0.0836, 0.131], metal);
  const coil = new THREE.Group(); coil.name = "illustrative-wireless-power-coil";
  coil.position.copy(toScene([0.106, 0.082, 0.122]));
  const right = new THREE.Vector3(-1, 0, 0), up = new THREE.Vector3(0, 0.671, 0.741).normalize();
  const normal = new THREE.Vector3().crossVectors(right, up);
  coil.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, normal));
  coil.add(new THREE.Mesh(new THREE.CylinderGeometry(0.0235 * scale, 0.0235 * scale, 0.001 * scale, 64).rotateX(Math.PI / 2), ferrite));
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 1800; i++) {
    const theta = i / 1800 * Math.PI * 2 * 17;
    const radius = (0.009 + i / 1800 * 0.014) * scale;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0.00075 * scale));
  }
  coil.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 1800, 0.00027 * scale, 5, false), copper));
  group.add(coil);
  return group;
}

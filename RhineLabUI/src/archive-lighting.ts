import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type LightingLook = "baseline" | "refined";

// The archive and its independent viewer use the same studio illumination.
// Each renderer needs its own PMREM render target / WebGL texture.
export function createArchiveLighting(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  look: LightingLook = "baseline",
) {
  const refined = look === "refined";
  renderer.toneMappingExposure = 1.0;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();
  scene.environmentIntensity = refined ? 0.52 : 0.55;
  scene.add(
    new THREE.HemisphereLight(
      "#edf4e8",
      "#1b2a1a",
      refined ? 0.5 : 0.65,
    ),
  );
  const key = new THREE.DirectionalLight(
    "#f1f7ed",
    refined ? 1.7 : 1.65,
  );
  key.position.set(
    ...((refined ? [-8, 14, 4] : [-6, 14, -5]) as [number, number, number]),
  );
  const fill = new THREE.DirectionalLight("#ffffff", refined ? 0.3 : 0.7);
  fill.position.set(7, 8, -10);
  scene.add(key, fill);
  return key;
}

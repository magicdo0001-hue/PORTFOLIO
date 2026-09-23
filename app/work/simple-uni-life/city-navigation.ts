import { MathUtils, Spherical, Vector3, type OrthographicCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/** Turntable rotation with a fixed elevation; panning stays on the ground plane. */
export function createCityNavigation(camera: OrthographicCamera, host: HTMLElement, invalidate: () => void) {
  const orbit = new OrbitControls(camera, host);
  orbit.target.set(0, 1.1, 0);
  orbit.cursor.copy(orbit.target);
  const elevation = new Spherical().setFromVector3(camera.position.clone().sub(orbit.target)).phi;
  orbit.minPolarAngle = elevation;
  orbit.maxPolarAngle = elevation;
  orbit.minZoom = .75;
  orbit.maxZoom = 2;
  orbit.maxTargetRadius = 6;
  orbit.screenSpacePanning = false;
  orbit.rotateSpeed = .5;
  orbit.panSpeed = .8;
  orbit.zoomSpeed = .65;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  orbit.enableDamping = !reduced.matches;
  orbit.dampingFactor = .09;
  orbit.update();
  orbit.saveState();
  const onMotionChange = () => { orbit.enableDamping = !reduced.matches; invalidate(); };
  reduced.addEventListener("change", onMotionChange);
  orbit.addEventListener("change", invalidate);
  const onStart = () => { host.classList.add("is-dragging"); };
  const onEnd = () => { host.classList.remove("is-dragging"); };
  orbit.addEventListener("start", onStart);
  orbit.addEventListener("end", onEnd);

  const reset = () => {
    // Flush residual damping before restoring the saved view.
    const damping = orbit.enableDamping;
    orbit.enableDamping = false;
    orbit.update();
    orbit.reset();
    orbit.enableDamping = damping;
    invalidate();
  };
  const keydown = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") { reset(); return; }
    if (["+", "=", "-", "_"].includes(event.key)) {
      camera.zoom = MathUtils.clamp(camera.zoom * (["+", "="].includes(event.key) ? 1.12 : 1 / 1.12), orbit.minZoom, orbit.maxZoom);
      camera.updateProjectionMatrix();
    } else if (event.shiftKey) {
      const right = new Vector3().setFromMatrixColumn(camera.matrix, 0).setY(0).normalize();
      const forward = new Vector3().crossVectors(camera.up, right).normalize();
      const delta = event.key === "ArrowLeft" ? right.multiplyScalar(-.5) : event.key === "ArrowRight" ? right.multiplyScalar(.5) : forward.multiplyScalar(event.key === "ArrowUp" ? .5 : -.5);
      orbit.target.add(delta); camera.position.add(delta);
    } else {
      const offset = camera.position.clone().sub(orbit.target);
      offset.applyAxisAngle(camera.up, event.key === "ArrowLeft" || event.key === "ArrowUp" ? -.16 : .16);
      camera.position.copy(orbit.target).add(offset);
    }
    orbit.update(); invalidate();
  };
  host.addEventListener("keydown", keydown);
  return {
    update: () => orbit.update(),
    reset,
    dispose: () => {
      reduced.removeEventListener("change", onMotionChange);
      host.removeEventListener("keydown", keydown);
      orbit.removeEventListener("change", invalidate);
      orbit.removeEventListener("start", onStart);
      orbit.removeEventListener("end", onEnd);
      orbit.dispose();
    },
  };
}

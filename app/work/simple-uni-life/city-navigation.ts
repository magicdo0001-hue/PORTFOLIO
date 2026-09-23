import { MathUtils, Spherical, Vector3, type OrthographicCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/** Fixed-elevation turntable with interruptible, photographic focus moves. */
export function createCityNavigation(camera: OrthographicCamera, host: HTMLElement, invalidate: () => void, onOverview: () => void) {
  const orbit = new OrbitControls(camera, host);
  const home = new Vector3(0, 1.1, 0);
  orbit.target.copy(home);
  orbit.cursor.copy(home);
  const homeOffset = camera.position.clone().sub(home);
  const elevation = new Spherical().setFromVector3(homeOffset).phi;
  orbit.minPolarAngle = elevation;
  orbit.maxPolarAngle = elevation;
  orbit.minZoom = .7;
  orbit.maxZoom = 3.6;
  orbit.maxTargetRadius = 14;
  orbit.screenSpacePanning = false;
  orbit.rotateSpeed = .45;
  orbit.panSpeed = .8;
  orbit.zoomSpeed = .65;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  orbit.enableDamping = !reduced.matches;
  orbit.dampingFactor = .09;
  camera.zoom = .9;
  camera.updateProjectionMatrix();
  orbit.update();
  let focused = false;
  let frameX = .54;
  let frameY = host.clientWidth < 761 ? .35 : .47;
  let transition: { start: number; from: Vector3; to: Vector3; offset: Vector3; endOffset: Vector3; zoom: number; endZoom: number; x: number; y: number; endX: number; endY: number } | null = null;
  const frame = () => {
    const width = host.clientWidth, height = host.clientHeight;
    camera.setViewOffset(width, height, (.5 - frameX) * width, (.5 - frameY) * height, width, height);
  };
  frame();
  const onMotionChange = () => { orbit.enableDamping = !reduced.matches; invalidate(); };
  reduced.addEventListener("change", onMotionChange);
  orbit.addEventListener("change", invalidate);
  const onStart = () => {
    transition = null;
    orbit.enableDamping = !reduced.matches;
    host.classList.add("is-dragging");
  };
  const onEnd = () => { host.classList.remove("is-dragging"); };
  orbit.addEventListener("start", onStart);
  orbit.addEventListener("end", onEnd);

  const focus = (point: Vector3 | null, buildingHeight = 4) => {
    orbit.enableDamping = false;
    orbit.update();
    focused = !!point;
    const mobile = host.clientWidth < 761;
    transition = {
      start: performance.now(), from: orbit.target.clone(), to: point?.clone() ?? home.clone(),
      offset: camera.position.clone().sub(orbit.target),
      endOffset: point ? camera.position.clone().sub(orbit.target) : homeOffset.clone(),
      zoom: camera.zoom, endZoom: point ? (mobile ? 2.65 : MathUtils.clamp(2.05 - buildingHeight * .075, 1.55, 1.9)) : .9,
      x: frameX, y: frameY, endX: mobile ? .5 : point ? .64 : .54, endY: mobile ? .32 : point ? .43 : .47,
    };
    invalidate();
  };
  const reset = () => focus(null);
  const keydown = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "Home", "Escape"].includes(event.key)) return;
    event.preventDefault();
    if (["Home", "Escape"].includes(event.key)) { reset(); onOverview(); return; }
    transition = null;
    orbit.enableDamping = !reduced.matches;
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
    focus, reset,
    resize() {
      const mobile = host.clientWidth < 761;
      frameX = mobile ? .5 : focused ? .64 : .54;
      frameY = mobile ? .32 : focused ? .43 : .47;
      frame(); invalidate();
    },
    update(time: number) {
      if (transition) {
        const t = reduced.matches ? 1 : MathUtils.clamp((time - transition.start) / 1050, 0, 1);
        const eased = t * t * (3 - 2 * t);
        orbit.target.lerpVectors(transition.from, transition.to, eased);
        const offset = transition.offset.clone().lerp(transition.endOffset, eased);
        camera.position.copy(orbit.target).add(offset);
        camera.zoom = MathUtils.lerp(transition.zoom, transition.endZoom, eased);
        frameX = MathUtils.lerp(transition.x, transition.endX, eased);
        frameY = MathUtils.lerp(transition.y, transition.endY, eased);
        frame();
        if (t === 1) { transition = null; orbit.enableDamping = !reduced.matches; }
        invalidate();
      }
      orbit.update();
      return !!transition;
    },
    dispose() {
      reduced.removeEventListener("change", onMotionChange);
      host.removeEventListener("keydown", keydown);
      orbit.removeEventListener("change", invalidate);
      orbit.removeEventListener("start", onStart);
      orbit.removeEventListener("end", onEnd);
      orbit.dispose();
    },
  };
}

import * as THREE from "three";

/** Depth-aware miniature lens. The selected building's footprint stays sharp. */
export function createCityLens(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.OrthographicCamera) {
  const target = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    samples: 4,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthTexture: new THREE.DepthTexture(1, 1, THREE.UnsignedIntType),
  });
  const focus = new THREE.Vector3(0, 1.8, 0);
  const destination = focus.clone();
  let strength = 0;
  let desiredStrength = 0;
  const material = new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      image: { value: target.texture },
      depth: { value: target.depthTexture },
      resolution: { value: new THREE.Vector2(1, 1) },
      inverseProjection: { value: camera.projectionMatrixInverse },
      cameraWorld: { value: camera.matrixWorld },
      worldToView: { value: camera.matrixWorldInverse },
      focus: { value: focus },
      strength: { value: 0 },
    },
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      uniform sampler2D image;
      uniform sampler2D depth;
      uniform vec2 resolution;
      uniform mat4 inverseProjection;
      uniform mat4 cameraWorld;
      uniform mat4 worldToView;
      uniform vec3 focus;
      uniform float strength;
      varying vec2 vUv;

      void main() {
        float z = texture2D(depth, vUv).r;
        vec4 view = inverseProjection * vec4(vUv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0);
        view /= view.w;
        vec3 world = (cameraWorld * view).xyz;
        float focusZ = (worldToView * vec4(focus, 1.0)).z;
        float depthDistance = abs(view.z - focusZ);
        vec2 footprint = abs(world.xz - focus.xz) - vec2(2.03, 1.85);
        float outside = max(footprint.x, footprint.y);
        float selectedBlur = smoothstep(-0.12, 3.4, outside);
        // Broad focus plane in overview; stronger falloff around a selected model.
        float overviewBlur = smoothstep(3.0, 13.0, depthDistance) * 0.24;
        float amount = mix(overviewBlur, selectedBlur, strength);
        float radius = amount * min(18.0, resolution.x * 0.013);
        vec4 color = texture2D(image, vUv);
        float total = 1.0;
        if (radius > 0.4) {
          for (int i = 0; i < 28; i++) {
            float fi = float(i) + 0.5;
            float angle = fi * 2.39996323;
            float r = sqrt(fi / 28.0);
            vec2 offset = vec2(cos(angle), sin(angle)) * r * radius / resolution;
            vec2 sampleUv = clamp(vUv + offset, vec2(0.001), vec2(0.999));
            float weight = 1.0 - r * 0.35;
            color += texture2D(image, sampleUv) * weight;
            total += weight;
          }
        }
        gl_FragColor = color / total;
        gl_FragColor.a = 1.0;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const screen = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  screen.add(quad);
  const screenCamera = new THREE.Camera();
  return {
    setFocus(point: THREE.Vector3 | null) {
      destination.copy(point ?? new THREE.Vector3(0, 1.8, 0));
      desiredStrength = point ? 1 : 0;
    },
    update(delta: number, immediate: boolean) {
      const factor = immediate ? 1 : 1 - Math.exp(-delta * 7);
      focus.lerp(destination, factor);
      strength = THREE.MathUtils.lerp(strength, desiredStrength, factor);
      material.uniforms.strength.value = strength;
      return Math.abs(strength - desiredStrength) > .002 || focus.distanceToSquared(destination) > .0001;
    },
    resize(width: number, height: number) {
      const dpr = renderer.getPixelRatio();
      target.setSize(Math.round(width * dpr), Math.round(height * dpr));
      material.uniforms.resolution.value.set(width * dpr, height * dpr);
    },
    render() {
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(screen, screenCamera);
    },
    dispose() {
      target.depthTexture?.dispose(); target.dispose();
      quad.geometry.dispose(); material.dispose();
    },
  };
}

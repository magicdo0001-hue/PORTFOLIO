import * as T from "three";
import { createSangreModel } from "./procedural-model";
import { storyAt, chapterStops } from "./story-timeline.mjs";

type Hooks = { ready: () => void; error: () => void; marker: (x: number, y: number) => void; frame: (progress: number, intro: number) => void; callouts: (points: number[][]) => void };
export type SangreScene = { progress: (value: number) => void; motion: (enabled: boolean) => void; dispose: () => void };

export function createSangreScene(host: HTMLElement, hooks: Hooks): SangreScene {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  const mobile=host.clientWidth<700;
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.65));
  renderer.setClearColor(0x171a1b,0);renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden","true");host.appendChild(renderer.domElement);
  const scene=new T.Scene(), camera=new T.PerspectiveCamera(34,1,.03,80);
  const model=createSangreModel();scene.add(model.root);
  // Transmission must sample the actual studio background. An alpha canvas
  // otherwise gives Three's refraction pass a white clear colour.
  const backdrop=document.createElement("canvas");backdrop.width=1024;backdrop.height=1024;
  const bg=backdrop.getContext("2d")!;const gradient=bg.createRadialGradient(740,440,20,630,460,700);
  gradient.addColorStop(0,"#424a4c");gradient.addColorStop(.5,"#282f32");gradient.addColorStop(1,"#141a1e");bg.fillStyle=gradient;bg.fillRect(0,0,1024,1024);
  const backdropTexture=new T.CanvasTexture(backdrop);backdropTexture.colorSpace=T.SRGBColorSpace;scene.background=backdropTexture;
  // A neutral photographic light tent: broad panels make the clear PET edges
  // readable without tinting the warm-white polymer green or blue.
  const studio=new T.Scene();studio.background=new T.Color(0x74777b);
  function card(w:number,h:number,position:number[],power:number) {
    const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color().setScalar(power),side:T.DoubleSide}));
    m.position.fromArray(position);m.lookAt(0,0,0);studio.add(m);
  }
  card(5,7,[-4,5,3],2.5);card(2,6,[4,3,-3],2);card(5,2,[0,5,-1],2.3);card(3,4,[1,1,6],1.1);
  const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(studio,.035);
  scene.environment=environment.texture;scene.environmentIntensity=.45;
  studio.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose();}});pmrem.dispose();
  scene.add(new T.HemisphereLight(0xe8edf3,0x56504a,.45));
  const key=new T.DirectionalLight(0xfff9ef,2.4);key.position.set(-3.5,6,5);key.castShadow=true;
  key.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=5;key.shadow.camera.bottom=-3;key.shadow.normalBias=.012;key.shadow.bias=-.0002;key.shadow.radius=4;scene.add(key);
  const rim=new T.DirectionalLight(0xe3edff,1.0);rim.position.set(3,3,-4);scene.add(rim);
  const fill=new T.DirectionalLight(0xffffff,.3);fill.position.set(3,1,5);scene.add(fill);
  const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({color:0x000000,opacity:.19}));floor.rotation.x=-Math.PI/2;floor.position.y=-.08;floor.receiveShadow=true;scene.add(floor);
  const textures:T.Texture[]=[model.materials.plastic.bumpMap!];
  let disposed=false,frame=0,shown=true,moving=!matchMedia("(prefers-reduced-motion: reduce)").matches;
  let desired=0,current=0,ticks=0,last=performance.now(),drawn=0,frameTotal=0,frameSamples=0,intro=0;
  const pointer=new T.Vector2(),parallax=new T.Vector2(),target=new T.Vector3(),point=new T.Vector3();
  const wake=()=>{if(!frame&&!disposed&&shown&&!document.hidden){frame=requestAnimationFrame(render);}};
  const loader=new T.TextureLoader();
  function texture(url:string,material:T.MeshBasicMaterial) {loader.load(url,t=>{if(disposed){t.dispose();return;}t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(t);material.map=t;material.color.setScalar(.88);material.needsUpdate=true;ticks=0;wake();},undefined,()=>{if(!disposed){material.color.set(0xc8cccb);wake();}});}
  texture("/sangre/screen.png",model.materials.displayMaterial);texture("/sangre/unfolded-ui.png",model.materials.fullMaterial);
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;
    camera.setViewOffset(w,h,w>700?-w*.205:0,w>700?h*.065:0,w,h);camera.updateProjectionMatrix();ticks=0;wake();}
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  const io=new IntersectionObserver(([entry])=>{shown=entry.isIntersecting;if(shown)wake();else{cancelAnimationFrame(frame);frame=0;}});io.observe(host);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};document.addEventListener("visibilitychange",visibility);
  const mouse=(e:PointerEvent)=>{if(e.pointerType!=="mouse"||!moving)return;const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5);ticks=0;wake();};
  const leave=()=>{pointer.set(0,0);ticks=0;wake();};host.addEventListener("pointermove",mouse);host.addEventListener("pointerleave",leave);
  const contextLost=(e:Event)=>{e.preventDefault();hooks.error();};renderer.domElement.addEventListener("webglcontextlost",contextLost);
  function render(now:number) {
    frame=0;if(disposed||!shown||document.hidden)return;
    const elapsed=now-last,dt=Math.max(.001,Math.min(.05,elapsed/1000));last=now;
    const p=moving?desired:chapterStops[storyAt(desired).chapter];
    intro=moving?Math.min(1,intro+dt/2):1;
    current=moving?T.MathUtils.lerp(current,p,1-Math.exp(-dt*7)):p;
    if(Math.abs(current-p)<.00003)current=p;
    parallax.lerp(moving?pointer:new T.Vector2(),1-Math.exp(-dt*4));
    const pose=storyAt(current);model.pose(pose.unfold,pose.access,pose.explode);
    const narrow=host.clientWidth<700;
    // Portrait uses the complete product silhouette, including the opened screen.
    const enter=desired<.02?Math.pow(1-intro,3):0;
    const focus=T.MathUtils.smoothstep(current,.17,.23)*(1-T.MathUtils.smoothstep(current,.30,.38));
    const w=host.clientWidth,h=host.clientHeight,top=h<740?225:260,bottom=h<740?170:186;
    camera.setViewOffset(w,h,narrow?0:-w*(.205+focus*.10),narrow?(bottom-top)/2:h*.065,w,h);
    const distance=pose.distance*(narrow?.83*h/Math.max(165,h-top-bottom):1.25)*(1+enter*.12),yaw=pose.yaw+parallax.x*.08-enter*.24,elevation=pose.elevation-parallax.y*.035;
    target.set(pose.x,pose.y,0);
    camera.position.set(target.x+Math.sin(yaw)*Math.cos(elevation)*distance,target.y+Math.sin(elevation)*distance,Math.cos(yaw)*Math.cos(elevation)*distance);
    camera.lookAt(target);
    if(narrow)camera.fov=45;else camera.fov=34;camera.updateProjectionMatrix();
    renderer.render(scene,camera);hooks.frame(current,intro);drawn++;if(elapsed>0&&elapsed<100){frameTotal+=elapsed;frameSamples++;}
    if(pose.chapter===0)point.set(.89,1.14,.70);
    else if(pose.chapter===1)point.set(1.47,.51,.60);
    else if(pose.chapter===2){point.set(0,2.35,.04);model.display.localToWorld(point);}
    else if(pose.chapter===3){point.set(0,.05,.13);model.strip.localToWorld(point);}
    else {point.set(0,0,.035);model.coil.localToWorld(point);}
    point.project(camera);hooks.marker((point.x*.5+.5)*host.clientWidth,(-point.y*.5+.5)*host.clientHeight);
    const calloutPoints:T.Vector3[]=[];
    if(pose.chapter===0){calloutPoints.push(model.display.localToWorld(new T.Vector3(0,1.5,0)),model.lid.localToWorld(new T.Vector3(.57,.48,0)));}
    else if(pose.chapter===1){calloutPoints.push(new T.Vector3(-1.44,.44,.58),model.lid.localToWorld(new T.Vector3(.57,.48,.70)));}
    else if(pose.chapter===2){calloutPoints.push(model.display.localToWorld(new T.Vector3(.6,2.7,.04)),model.display.localToWorld(new T.Vector3(.65,1.5,.04)));}
    else if(pose.chapter===3){calloutPoints.push(model.lid.localToWorld(new T.Vector3(-.5,.48,.5)),model.strip.localToWorld(new T.Vector3(0,.08,0)));}
    else {calloutPoints.push(model.coil.localToWorld(new T.Vector3(-.25,0,.03)),model.shell.localToWorld(new T.Vector3(.7,.6,.6)));}
    hooks.callouts(calloutPoints.map(p=>{p.project(camera);return[(p.x*.5+.5)*host.clientWidth,(-p.y*.5+.5)*host.clientHeight];}));
    if(drawn===1)hooks.ready();
    if(drawn%20===0||current===p) {host.dataset.renderStats=JSON.stringify({frames:drawn,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,dpr:renderer.getPixelRatio(),averageFrameMs:+(frameTotal/Math.max(1,frameSamples)).toFixed(1),progress:+current.toFixed(4)});}
    ticks++;
    if(current!==p||parallax.distanceTo(pointer)>.001||ticks<3||intro<1)wake();
  }
  wake();
  return {
    progress(value){desired=T.MathUtils.clamp(Number.isFinite(value)?value:0,0,1);ticks=0;wake();},
    motion(enabled){moving=enabled;pointer.set(0,0);ticks=0;wake();},
    dispose(){disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();document.removeEventListener("visibilitychange",visibility);host.removeEventListener("pointermove",mouse);host.removeEventListener("pointerleave",leave);renderer.domElement.removeEventListener("webglcontextlost",contextLost);
      const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.LineSegments){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});
      Object.values(model.materials).forEach(m=>materials.add(m));geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment.dispose();backdropTexture.dispose();key.shadow.map?.dispose();renderer.dispose();renderer.domElement.remove();}
  };
}

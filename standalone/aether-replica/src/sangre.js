// SANGRE uses the author's renderer, background, audio and loop transitions.
// Only the two homepage product scenes are adapted; specs / Discover Space stay authored.
// The authored runtime owns the DOM and WebGL singleton; its scene edits need a full reload.
if(import.meta.hot)import.meta.hot.accept(()=>location.reload());
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => { const t=clamp((x-a)/(b-a)); return t*t*(3-2*t); };
const keys = [
  [0,.48,.38,13.2,-.55,0], [.125,-.12,.30,15.8,0,1.0],
  [.25,.58,.26,15.0,-.45,.45], [.375,.65,.34,13.7,0,.15],
  [.5,-.60,.64,12.2,.45,-.15], [.64,-.45,.62,12.6,.3,-.1],
  [.742,.38,.38,17.8,0,.8], [.81,.70,.40,17.5,0,.9],
  [.94,.42,.36,14.5,-.45,0], [1,.48,.38,13.2,-.55,0],
];
export function poseAt(progress) {
  const p=clamp(progress);
  const index=Math.max(0,keys.findIndex((k,i)=>i<keys.length-1 && p>=k[0] && p<=keys[i+1][0]));
  const a=keys[index],b=keys[Math.min(index+1,keys.length-1)],t=smooth(a[0],b[0],p);
  const camera=a.slice(1).map((v,i)=>v+(b[i+1]-v)*t);
  camera[0]+=Math.PI; // The reference Front view faces -Z in the exported GLB.
  return {camera, unfold:smooth(.025,.115,p)*(1-smooth(.22,.31,p)),
    explode:smooth(.655,.79,p)*(1-smooth(.88,.97,p)),
    inserted:smooth(.46,.60,p), stripVisible:p>.425&&p<.66};
}

function environment(T, renderer) {
  const studio=new T.Scene(); studio.background=new T.Color('#252a31');
  for (const [position,size,color] of [
    [[-5,6,4],[9,8],[3.2,3.1,2.9]], [[5,2,-3],[5,9],[1.8,2.1,2.4]],
    [[0,8,-2],[8,8],[2.2,2.2,2.2]], [[0,-3,5],[6,3],[.2,.25,.32]],
  ]) {
    const material=new T.MeshBasicMaterial();material.color.setRGB(...color);
    const card=new T.Mesh(new T.PlaneGeometry(...size),material);
    card.position.set(...position);card.lookAt(0,0,0);studio.add(card);
  }
  const generator=new T.PMREMGenerator(renderer);
  const target=generator.fromScene(studio,.025,.01,100);
  studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});generator.dispose();
  return target;
}

function installScene(scene, bridge, metadata, env) {
  const {THREE:T,gl}=bridge;
  const device=gl.assets.models.sangre.scene.clone(true);
  device.name='sangre-product';device.scale.setScalar(28);
  const exterior=device.getObjectByName('exterior'),interior=device.getObjectByName('interior');
  const strip=device.getObjectByName('test-strip'),display=device.getObjectByName('display-rig');
  const upper=device.getObjectByName('display-upper');
  const initialDisplay=display.position.clone(),initialStrip=strip.position.clone();
  const up=new T.Vector3(...metadata.screenUp),travel=new T.Vector3(...metadata.travel);
  initialStrip.addScaledVector(travel,metadata.stripEndOffset);
  device.traverse(o=>{
    if(!o.isMesh)return;
    o.material=o.material.clone();o.castShadow=true;o.receiveShadow=true;
    if(o.name==='outer-shell'){o.material.roughness=.28;o.material.clearcoat=.18;o.material.clearcoatRoughness=.3;}
    if(o.name==='base-shell'){o.material.color.set('#d8d1bc');o.material.roughness=.32;}
    if(o.name==='test-strip-4'){o.material.color.set('#d5d9d8');o.material.roughness=.38;}
    if(o.name==='test-strip-5'){o.material=new T.MeshStandardMaterial({color:'#e5e2d7',roughness:.75,side:2});}
    if(o.name==='test-strip-6'){o.material=new T.MeshStandardMaterial({color:'#e5e2d7',roughness:.45,side:2});}
    if(o.name==='test-strip-7'){o.material=new T.MeshStandardMaterial({color:'#9b2934',roughness:.3,side:2});}
    if(/^test-strip-[567]$/.test(o.name))o.position.y+=metadata.sampleLevelOffset;
    if(o.name.startsWith('storage-')){o.material.ior=1.47;o.material.thickness=.0016;o.material.roughness=.10;o.material.envMapIntensity=.7;}
  });
  const ui=[];
  for(const [name,offset]of[['display-lower-pixels',.5],['display-upper-pixels',0]]){
    const pixels=device.getObjectByName(name);
    const opening={value:0};ui.push(opening);
    pixels.material=new T.MeshBasicMaterial({map:gl.assets.textures.sangreFolded,toneMapped:false});
    pixels.material.onBeforeCompile=shader=>{
      shader.uniforms.uExpanded={value:gl.assets.textures.sangreExpanded};shader.uniforms.uOpening=opening;
      shader.fragmentShader='uniform sampler2D uExpanded; uniform float uOpening;\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',
        `diffuseColor *= mix(texture2D(map,vMapUv),texture2D(uExpanded,vec2(vMapUv.x,vMapUv.y*.5+${offset.toFixed(1)})),uOpening);`);
    };
    pixels.material.customProgramCacheKey=()=>`sangre-ui-${offset}`;
    pixels.castShadow=false;
  }
  const internal=[];
  interior.children.forEach(o=>{
    const initial=o.position.clone();
    const displacement=new T.Vector3();
    if(o.name.endsWith('upper-shell'))displacement.set(0,.075,0);
    else if(o.name.endsWith('retainer'))displacement.set(0,.10,0);
    else if(o.name.endsWith('storage-cover'))displacement.set(.025,.12,0);
    else if(o.name.endsWith('battery'))displacement.set(.110,.100,.028);
    else if(o.name.endsWith('photometer'))displacement.set(.047,.027,.022);
    else if(o.name.endsWith('pads'))displacement.set(0,-.018,0);
    else if(o.name.endsWith('switch'))displacement.set(-.025,.01,0);
    internal.push({o,initial,displacement});
  });
  const camera=new T.PerspectiveCamera(34,gl.sizes.width/gl.sizes.height,.03,150);
  const productScene=new T.Scene();productScene.add(camera,device);
  productScene.environment=env.texture;productScene.environmentIntensity=.65;
  const keyLight=new T.DirectionalLight('#f5f3ea',2.2);keyLight.position.set(-4,8,-7);keyLight.castShadow=true;
  keyLight.shadow.mapSize.set(1024,1024);keyLight.shadow.camera.left=-5;keyLight.shadow.camera.right=5;
  keyLight.shadow.camera.top=6;keyLight.shadow.camera.bottom=-4;keyLight.shadow.camera.near=.1;keyLight.shadow.camera.far=30;
  keyLight.shadow.normalBias=.018;keyLight.shadow.bias=-.0003;
  const rim=new T.DirectionalLight('#b5d9f5',1.0);rim.position.set(5,3,5);
  productScene.add(keyLight,rim);scene.renderTarget.samples=4;
  scene.caseModel.visible=false;scene.tube.visible=false;
  // Keep the authored camera for the background; overlay the product with its own camera.
  const originalRender=scene.renderPipeline.bind(scene);
  scene.renderPipeline=()=>{
    originalRender();if(!scene.isRendering)return;
    gl.renderer.instance.clearDepth();gl.renderer.instance.render(productScene,camera);
  };
  const originalUpdate=scene.update.bind(scene),originalScroll=scene.updateScroll.bind(scene);
  scene.sangre={device,camera,progress:0,strip,display,upper};
  scene.updateScroll=p=>{originalScroll(p);scene.sangre.progress=clamp(p??0);};
  scene.update=()=>{
    originalUpdate();if(!scene.isRendering)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p=scene.sangre.progress,mobile=gl.sizes.width<768;
    const pose=poseAt(reduced?[0,.125,.375,.5,.81].reduce((a,b)=>Math.abs(b-p)<Math.abs(a-p)?b:a):p);
    const [yaw,pitch,distance,tx,ty]=pose.camera;
    const d=distance*(mobile?(p>.69&&p<.88?1.28:p>.10&&p<.23?1.08:1.18):1);
    const pointer=mobile||reduced?0:gl.world.mouse.eased.camera.value.x*.055;
    camera.position.set(Math.sin(yaw+pointer)*Math.cos(pitch)*d,Math.sin(pitch)*d,Math.cos(yaw+pointer)*Math.cos(pitch)*d);
    camera.lookAt(mobile?pose.explode*.7:tx,ty+(mobile?.2:0),0);
    camera.aspect=gl.sizes.width/gl.sizes.height;camera.fov=mobile?45:34;camera.updateProjectionMatrix();
    device.position.set(0,mobile?0:-.35,0);
    const e=pose.explode,u=pose.unfold;
    exterior.visible=e<.10;interior.visible=e>=.10;
    internal.forEach(({o,initial,displacement})=>o.position.copy(initial).addScaledVector(displacement,e));
    // ponytail: supplied display endpoints have different sizes; use a CAD hinge rig if engineering accuracy is needed.
    display.position.copy(initialDisplay).addScaledVector(up,(metadata.panelHeight-metadata.compactHeight)*u);
    display.position.x+=e*.100;display.position.y+=e*.013;display.position.z-=e*.018;
    // Blender's local screen height exports as Z and the screen normal as Y.
    display.scale.z=metadata.compactHeight/metadata.panelHeight+(1-metadata.compactHeight/metadata.panelHeight)*u;
    upper.rotation.x=-Math.PI*(1-u);upper.position.y=-.0025*(1-u);
    ui.forEach(x=>{x.value=smooth(.24,.85,u);});
    strip.visible=pose.stripVisible;
    // A presentation cutaway makes the supplied internal cartridge path visible, without inventing a lid mechanism.
    for(const name of ['storage-lid','storage-tray'])device.getObjectByName(name).visible=!pose.stripVisible;
    let insertion=reduced?1:pose.inserted;
    // The recorded gesture plays once when the Testing chapter settles, then holds its inserted end state.
    if(p>.47&&p<.54&&!reduced){
      scene.sangre.started??=gl.time.elapsed;
      insertion=smooth(.55,2.8,gl.time.elapsed-scene.sangre.started);
    }else scene.sangre.started=null;
    strip.position.copy(initialStrip).addScaledVector(travel,.074*(1-insertion));
    scene.caseModel.visible=false;scene.tube.visible=false;
    scene.sangre.pose={...pose,inserted:insertion};
  };
  return scene.sangre;
}

export function startSangre() {
  window.__sangreEnabled=true;
  let stopped=false;
  const onReady=async()=>{
    try {
      const bridge=window.__AetherRuntime;
      if(window.__sangreLoadError||!bridge?.gl?.assets.models.sangre)throw new Error('SANGRE assets did not finish loading');
      const metadata=await fetch('/assets/sangre/metadata.json').then(r=>{if(!r.ok)throw new Error('SANGRE metadata unavailable');return r.json();});
      if(stopped)return;
      const {gl,THREE:T}=bridge;
      const env=environment(T,gl.renderer.instance);
      gl.renderer.instance.shadowMap.enabled=true;
      for(const name of ['mainA','mainB'])installScene(gl.world.scenes[name],bridge,metadata,env);
      const labels=document.createElement('div');labels.className='sangre-callouts';labels.setAttribute('aria-hidden','true');
      labels.innerHTML='<div class="sangre-callout"><span>Foldable display</span><small>A fuller view, in one movement.</small></div><div class="sangre-callout"><span>Clear storage cover</span><small>Consumables, kept in view.</small></div><div class="sangre-callout"><span>Slide to insert</span><small>Cover omitted to reveal the guide.</small></div><div class="sangre-callout"><span>18650 battery</span><small>The power module.</small></div><div class="sangre-callout"><span>Photometer assembly</span><small>The sensing module in the CAD.</small></div><div class="sangre-callout"><span>Enclosure</span><small>Separate shells reveal the assembly.</small></div>';
      document.body.append(labels);
      const elements=[...labels.children];
      const update=()=>{
        const current=gl.world.activeScenes.current;
        const home=!!current.sangre && !!document.querySelector('main[data-page="homepage"]');
        document.documentElement.dataset.sangrePage=home?'home':'original';
        if(!home)return;
        const p=current.sangre.progress,mobile=gl.sizes.width<768;
        elements.forEach((element,i)=>{
          const active=(i===0?p>.10&&p<.22:i===1?p>.27&&p<.43:i===2?p>.44&&p<.64:p>.69&&p<.88&&(!mobile||i===3))&&(!mobile||i!==2||current.sangre.pose?.inserted>.95);
          element.classList.toggle('is-active',active&&!gl.world.isTransitioning);
          if(!active)return;
          const rightSide=i===0||i===2||i===4;
          const left=mobile?20:(rightSide?gl.sizes.width*.72:gl.sizes.width*.28);
          const top=mobile?gl.sizes.height*.72:(i===3?gl.sizes.height*.36:i===4?gl.sizes.height*.70:i===5?gl.sizes.height*.22:gl.sizes.height*.76);
          element.style.transform=`translate3d(${left}px,${top}px,0)`;
        });
      };
      bridge.Raf.subscribe(update);
      window.__sangre={bridge,poseAt,metadata};
      document.documentElement.classList.add('sangre-ready');
      update();
    } catch(error) {
      console.error('SANGRE scene failed',error);
      document.documentElement.classList.add('sangre-failed');
      const notice=document.createElement('div');notice.className='sangre-load-error';notice.setAttribute('role','alert');
      notice.innerHTML='<p>The 3D preview could not load.</p><button type="button">Reload preview</button>';
      notice.querySelector('button').onclick=()=>location.reload();document.body.append(notice);
      const gl=window.__AetherRuntime?.gl;
      for(const name of ['mainA','mainB'])if(gl?.world.scenes[name]){gl.world.scenes[name].caseModel.visible=false;gl.world.scenes[name].tube.visible=false;}
    }
  };
  window.addEventListener('aether:ready',onReady);
  return()=>{stopped=true;window.removeEventListener('aether:ready',onReady);};
}

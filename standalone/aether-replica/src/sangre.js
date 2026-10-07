// SANGRE uses the author's renderer, background, audio and loop transitions.
// The two product scenes use SANGRE CAD; Discover now opens the portfolio case study.
// The authored runtime owns the DOM and WebGL singleton; its scene edits need a full reload.
if(import.meta.hot)import.meta.hot.accept(()=>location.reload());
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => { const t=clamp((x-a)/(b-a)); return t*t*(3-2*t); };
const keys = [
  [0,.48,.38,13.2,-.55,0], [.125,-.12,.30,15.8,0,1.0],
  [.25,.58,.26,15.0,-.45,.45], [.375,.65,.34,13.7,0,.15],
  [.5,-.60,.64,12.2,.45,-.15], [.64,-.45,.62,12.6,.3,-.1],
  [.742,.38,.32,25.0,1.3,.60], [.81,.55,.32,25.0,1.3,.60],
  [.94,.42,.36,14.5,-.45,0], [1,.48,.38,13.2,-.55,0],
];
export function poseAt(progress) {
  const p=clamp(progress);
  const index=Math.max(0,keys.findIndex((k,i)=>i<keys.length-1 && p>=k[0] && p<=keys[i+1][0]));
  const a=keys[index],b=keys[Math.min(index+1,keys.length-1)],t=smooth(a[0],b[0],p);
  const camera=a.slice(1).map((v,i)=>v+(b[i+1]-v)*t);
  camera[0]+=Math.PI; // The reference Front view faces -Z in the exported GLB.
  const explode=smooth(.655,.79,p)*(1-smooth(.88,.97,p));
  return {camera, unfold:smooth(.055,.115,p)*(1-smooth(.22,.31,p)),
    closeup:smooth(.018,.052,p)*(1-smooth(.20,.255,p)),
    explode, interiorOpacity:smooth(.02,.36,explode),
    inserted:smooth(.46,.60,p), stripOpacity:smooth(.41,.45,p)*(1-smooth(.62,.66,p)),
    coverOpacity:1-smooth(.395,.43,p)*(1-smooth(.63,.665,p))};
}

function fadeGroup(root, excluded=[]) {
  const materials=[];
  root.traverse(o=>{
    if(!o.isMesh||excluded.includes(o))return;
    for(const material of Array.isArray(o.material)?o.material:[o.material]){
      materials.push({material,opacity:material.opacity,alphaTest:material.alphaTest,
        transparent:material.transparent,depthWrite:material.depthWrite});
    }
  });
  return alpha=>{
    root.visible=alpha>0;
    for(const {material,opacity,alphaTest,transparent,depthWrite} of materials){
      const fading=alpha>0&&alpha<1,blended=transparent||fading;
      if(material.transparent!==blended){material.transparent=blended;material.needsUpdate=true;}
      material.depthWrite=fading?false:depthWrite;
      material.opacity=opacity*alpha;material.alphaTest=alphaTest*alpha;
    }
  };
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
  const theme=getComputedStyle(document.documentElement);
  const colors={COLOR_BASE:theme.getPropertyValue('--sangre-scene').trim(),COLOR_HIGHLIGHT:theme.getPropertyValue('--sangre-highlight').trim(),COLOR_LIGHT:theme.getPropertyValue('--sangre-light').trim(),COLOR_DASH:theme.getPropertyValue('--sangre-accent').trim()};
  scene.scene.background.set(colors.COLOR_BASE);
  // LineMaterial binds these controller uniforms inside onBeforeCompile.
  scene.circles?.uniforms.COLOR_DASH.value.set(colors.COLOR_DASH);
  scene.scene.traverse(object=>{
    for(const [name,color] of Object.entries(colors))object.material?.uniforms?.[name]?.value?.set(color);
    if(object.material?.uniforms?.COLOR_BASE){
      object.material.fragmentShader=object.material.fragmentShader.replace('vec3(0.5, 0.75, 1.0)','COLOR_LIGHT').replaceAll('* uLightIntensity','* uLightIntensity * 0.3');
      object.material.needsUpdate=true;
    }
  });
  const device=gl.assets.models.sangre.scene.clone(true);
  device.name='sangre-product';device.scale.setScalar(28);
  const exterior=device.getObjectByName('exterior'),interior=device.getObjectByName('interior');
  const strip=device.getObjectByName('test-strip'),display=device.getObjectByName('display-assembly');
  const rig=device.getObjectByName('display-rig');
  const upper=device.getObjectByName('display-upper');
  const initialDisplay=display.position.clone(),initialRig=rig.position.clone(),initialStrip=strip.position.clone();
  const up=new T.Vector3(...metadata.screenUp),travel=new T.Vector3(...metadata.travel);
  // Keep the CAD orientation: the flat +Z end leads, the bevel stays outside at -Z.
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
  const covers=['storage-lid','storage-tray'].map(name=>device.getObjectByName(name));
  const fadeExterior=fadeGroup(exterior,covers),fadeInterior=fadeGroup(interior),fadeStrip=fadeGroup(strip);
  const fadeCovers=covers.map(cover=>fadeGroup(cover));
  const internal=[];
  interior.children.forEach(o=>{
    const initial=o.position.clone();
    const displacement=new T.Vector3();
    if(o.name.endsWith('upper-shell'))displacement.set(0,.150,0);
    else if(o.name.endsWith('retainer'))displacement.set(0,.065,-.075);
    else if(o.name.endsWith('storage-cover'))displacement.set(-.040,.225,0);
    else if(o.name.endsWith('battery'))displacement.set(.140,.155,.028);
    else if(o.name.endsWith('photometer'))displacement.set(-.050,.080,-.070);
    else if(o.name.endsWith('lower-shell'))displacement.set(0,-.060,0);
    else if(o.name.endsWith('pads'))displacement.set(0,-.160,0);
    else if(o.name.endsWith('switch'))displacement.set(.140,-.055,-.080);
    internal.push({o,initial,displacement});
  });
  const camera=new T.PerspectiveCamera(34,gl.sizes.width/gl.sizes.height,.03,150);
  const productScene=new T.Scene();productScene.add(camera,device);
  productScene.environment=env.texture;productScene.environmentIntensity=.65;
  const keyLight=new T.DirectionalLight('#f5f3ea',2.2);keyLight.position.set(-4,8,-7);keyLight.castShadow=true;
  keyLight.shadow.mapSize.set(1024,1024);keyLight.shadow.camera.left=-5;keyLight.shadow.camera.right=5;
  keyLight.shadow.camera.top=6;keyLight.shadow.camera.bottom=-4;keyLight.shadow.camera.near=.1;keyLight.shadow.camera.far=30;
  keyLight.shadow.normalBias=.018;keyLight.shadow.bias=-.0003;
  const rim=new T.DirectionalLight('#dbe4d8',1.0);rim.position.set(5,3,5);
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
    // Keep spread parts framed while the camera returns to the assembled view.
    const testing=mobile?smooth(.395,.425,p)*(1-smooth(.66,.70,p)):0;
    const d=Math.max(distance,12.2+12.8*pose.explode)*(mobile?(p>.10&&p<.23?1.08:1.18+.20*pose.explode):1)+8.2*testing;
    const pointer=mobile||reduced?0:gl.world.mouse.eased.camera.value.x*.055;
    camera.position.set(Math.sin(yaw+pointer)*Math.cos(pitch)*d,Math.sin(pitch)*d,Math.cos(yaw+pointer)*Math.cos(pitch)*d);
    const look=new T.Vector3(mobile?pose.explode*1.1:tx,ty+(mobile?.2:0),0);
    // Include the cartridge outside the front lip, not only the assembled enclosure.
    look.x-=.8*testing;look.z-=.65*testing;
    camera.lookAt(look);
    camera.aspect=gl.sizes.width/gl.sizes.height;camera.fov=mobile?45:34;camera.updateProjectionMatrix();
    device.position.set(0,mobile?0:-.35,0);
    const e=pose.explode,u=pose.unfold;
    const exteriorOpacity=1-pose.interiorOpacity;
    fadeExterior(exteriorOpacity);fadeInterior(pose.interiorOpacity);
    internal.forEach(({o,initial,displacement})=>o.position.copy(initial).addScaledVector(displacement,e));
    // ponytail: supplied display endpoints have different sizes; use a CAD hinge rig if engineering accuracy is needed.
    display.position.copy(initialDisplay);
    display.position.x+=e*(mobile?.095:.140);display.position.y+=e*.005;display.position.z-=e*.075;
    // Blender's local screen height exports as Z and the screen normal as Y.
    rig.position.copy(initialRig).addScaledVector(up,(metadata.panelHeight-metadata.compactHeight)*u);
    rig.scale.z=metadata.compactHeight/metadata.panelHeight+(1-metadata.compactHeight/metadata.panelHeight)*u;
    upper.rotation.x=-Math.PI*(1-u);upper.position.y=-.0025*(1-u);
    if(pose.closeup>0){
      device.updateMatrixWorld(true);
      const lower=device.getObjectByName('display-lower-pixels'),upperPixels=device.getObjectByName('display-upper-pixels');
      const center=new T.Box3().setFromObject(lower).getCenter(new T.Vector3());
      if(u>.5)center.lerp(new T.Box3().setFromObject(upperPixels).getCenter(new T.Vector3()),smooth(.5,1,u)*.5);
      const normal=new T.Vector3(...metadata.screenFront);
      const screenHeight=(metadata.compactHeight+(metadata.panelHeight*2-metadata.compactHeight)*u)*28;
      // Readable screen framing holds while the physical upper half opens.
      const tangent=Math.tan(camera.fov*Math.PI/360);
      const closeDistance=Math.max(screenHeight/(2*tangent*(mobile?.61:.73)),metadata.screenWidth*28/(2*tangent*camera.aspect*(mobile?.86:.34)));
      camera.position.lerp(center.clone().addScaledVector(normal,closeDistance),pose.closeup);
      camera.lookAt(look.lerp(center,pose.closeup));
      camera.setViewOffset(gl.sizes.width,gl.sizes.height,-gl.sizes.width*(mobile?0:.12)*pose.closeup,gl.sizes.height*.02*pose.closeup,gl.sizes.width,gl.sizes.height);
    }else camera.clearViewOffset();
    ui.forEach(x=>{x.value=smooth(.24,.85,u);});
    fadeStrip(pose.stripOpacity);
    // A presentation cutaway makes the supplied internal cartridge path visible, without inventing a lid mechanism.
    fadeCovers.forEach(fade=>fade(exteriorOpacity*pose.coverOpacity));
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

export function startSangre(screen) {
  window.__sangreEnabled=true;
  let stopped=false,labels;
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
      labels=document.createElement('div');labels.className='sangre-callouts';labels.setAttribute('aria-hidden','true');
      labels.innerHTML='<div class="sangre-callout"><span>Clear storage cover</span><small>Consumables, kept in view.</small></div><div class="sangre-callout"><span>Slide in from the front</span><small>Cover omitted to reveal the guide.</small></div><div class="sangre-callout"><span>18650 battery</span><small>The power module.</small></div><div class="sangre-callout"><span>Photometer assembly</span><small>The sensing module in the CAD.</small></div><div class="sangre-callout"><span>Enclosure</span><small>Separate shells reveal the assembly.</small></div>';
      document.body.append(labels);
      const elements=[...labels.children];
      const update=()=>{
        if(stopped)return;
        const current=gl.world.activeScenes.current;
        const home=!!current.sangre && !!document.querySelector('main[data-page="homepage"]');
        document.documentElement.dataset.sangrePage=home?'home':'original';
        if(!home){screen?.current?.hide();return;}
        const enabled=!gl.world.isTransitioning&&!document.documentElement.classList.contains('has-menu-open');
        if(enabled)screen?.current?.update(current.sangre,bridge,true);
        else screen?.current?.hide(current.sangre);
        const p=current.sangre.progress,mobile=gl.sizes.width<768;
        elements.forEach((element,i)=>{
          const active=(i===0?p>.27&&p<.43:i===1?p>.44&&p<.64:p>.69&&p<.88&&(!mobile||i===2))&&(!mobile||i!==1||current.sangre.pose?.inserted>.95);
          element.classList.toggle('is-active',active&&!gl.world.isTransitioning);
          if(!active)return;
          const rightSide=i===1||i===3;
          const left=mobile?20:(rightSide?gl.sizes.width*.72:gl.sizes.width*.28);
          const top=mobile?gl.sizes.height*(i>=2?.77:.72):(i===2?gl.sizes.height*.36:i===3?gl.sizes.height*.70:i===4?gl.sizes.height*.22:gl.sizes.height*.76);
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
  return()=>{stopped=true;labels?.remove();window.removeEventListener('aether:ready',onReady);};
}

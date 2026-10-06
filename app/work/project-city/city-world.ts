import * as THREE from "three";
import { createCityLens } from "../simple-uni-life/city-lens";
import { createCityNavigation } from "../simple-uni-life/city-navigation";
import { buildCityModels } from "./city-models";
import type { CityProject } from "./city-data";

type Options = { project: CityProject; host: HTMLElement; labels: (HTMLButtonElement | null)[]; onSelect: (id: string | null) => void; onReady: () => void; onError: () => void };

export function createCity({ project,host,labels,onSelect,onReady,onError }: Options) {
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.4));
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.98;
  renderer.domElement.setAttribute("aria-hidden","true"); host.appendChild(renderer.domElement);
  const scene=new THREE.Scene(); const background=project.slug==="battery-packaging" ? 0x869a97 : 0x82928f;
  scene.background=new THREE.Color(background); scene.fog=new THREE.Fog(background,42,95);
  const camera=new THREE.OrthographicCamera(-12,12,10,-10,.1,110);
  camera.position.set(13,14,23); camera.lookAt(0,1.1,0);
  scene.add(new THREE.HemisphereLight(0xfff8e9,0x809185,1.95));
  const sun=new THREE.DirectionalLight(0xfff4e6,3); sun.position.set(-10,19,9); sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-17,right:17,top:15,bottom:-15,near:1,far:60});
  sun.shadow.normalBias=.035; sun.shadow.bias=-.0002; sun.shadow.radius=3; scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:background,roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-.42; ground.receiveShadow=true; scene.add(ground);
  const models=buildCityModels(scene,project);
  const selection=new THREE.Mesh(new THREE.RingGeometry(2.06,2.095,64),new THREE.MeshBasicMaterial({color:project.slug==="battery-packaging" ? 0xd59578 : 0xc9ac76,side:THREE.DoubleSide}));
  selection.rotation.x=-Math.PI/2; selection.position.y=.594; scene.add(selection);
  let selected: string | null=null,paused=true,visible=true,disposed=false,frame=0,lastTime=0,elapsed=0,dirty=true;
  const invalidate=()=>{dirty=true;schedule();};
  const lens=createCityLens(renderer,scene,camera);
  const navigation=createCityNavigation(camera,host,invalidate,()=>onSelect(null));
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),projected=new THREE.Vector3(),press=new THREE.Vector2();
  let dragged=false;
  const pick=(event: PointerEvent)=>{
    const rect=host.getBoundingClientRect(); pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    return raycaster.intersectObjects(models.blocks,true).find(hit=>hit.object.userData.district)?.object.userData.district as string | undefined;
  };
  const down=(event: PointerEvent)=>{press.set(event.clientX,event.clientY);dragged=false;};
  const move=(event: PointerEvent)=>{if(event.buttons&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>5)dragged=true;host.style.cursor=event.buttons ? "grabbing" : pick(event) ? "pointer" : "grab";invalidate();};
  const click=(event: PointerEvent)=>{if(dragged||event.button!==0)return;const id=pick(event);if(id)onSelect(id);};
  host.addEventListener("pointerdown",down);host.addEventListener("pointermove",move);host.addEventListener("click",click);
  const resize=()=>{
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
    renderer.setSize(w,h);const aspect=w/h,half=Math.max(7.6,10.4/aspect);
    camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;
    camera.updateProjectionMatrix();navigation.resize();lens.resize(w,h);invalidate();
  };
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
  const intersectionObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;lastTime=0;invalidate();});intersectionObserver.observe(host);
  const visibilityChange=()=>{lastTime=0;invalidate();};document.addEventListener("visibilitychange",visibilityChange);
  const media=matchMedia("(prefers-reduced-motion: reduce)");media.addEventListener("change",invalidate);
  const contextLost=(event: Event)=>{event.preventDefault();dispose();onError();};renderer.domElement.addEventListener("webglcontextlost",contextLost);

  function render(time: number) {
    frame=0;if(disposed||!visible||document.hidden)return;
    const delta=lastTime ? Math.min((time-lastTime)/1000,.05) : 1/60;lastTime=time;
    const cameraMoving=navigation.update(time),lensMoving=lens.update(delta,media.matches);
    if(!paused)elapsed+=delta;
    if(!paused||dirty||cameraMoving||lensMoving) {
      models.update(elapsed,selected);
      const active=project.districts.find(d=>d.id===selected);selection.visible=!!active;
      if(active)selection.position.set(active.position[0],.594,active.position[1]);
      scene.updateMatrixWorld();camera.updateMatrixWorld();
      labels.forEach((label,i)=>{if(!label)return;const d=project.districts[i];projected.set(d.position[0],d.height+.32,d.position[1]).project(camera);label.style.left=`${(projected.x*.5+.5)*host.clientWidth}px`;label.style.top=`${(-projected.y*.5+.5)*host.clientHeight}px`;});
      lens.render();dirty=false;
    }
    if(!paused||cameraMoving||lensMoving)schedule();
  }
  function schedule(){if(!frame&&!disposed)frame=requestAnimationFrame(render);}
  function dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);
    resizeObserver.disconnect();intersectionObserver.disconnect();document.removeEventListener("visibilitychange",visibilityChange);media.removeEventListener("change",invalidate);
    host.removeEventListener("pointerdown",down);host.removeEventListener("pointermove",move);host.removeEventListener("click",click);
    renderer.domElement.removeEventListener("webglcontextlost",contextLost);navigation.dispose();lens.dispose();models.dispose();
    ground.geometry.dispose();ground.material.dispose();selection.geometry.dispose();selection.material.dispose();sun.shadow.map?.dispose();renderer.dispose();renderer.domElement.remove();
  }
  render(0);onReady();schedule();
  return {
    select(id: string | null){selected=id;const d=project.districts.find(item=>item.id===id);const point=d ? new THREE.Vector3(d.position[0],d.height*.46+.3,d.position[1]) : null;navigation.focus(point,d?.height);lens.setFocus(point);invalidate();},
    pause(value: boolean){paused=value;invalidate();},dispose,
  };
}

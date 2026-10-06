import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { CityProject } from "./city-data";

/** Small architectural models, batched per material and selectable district. */
export function buildCityModels(scene: THREE.Scene, project: CityProject) {
  const battery = project.slug === "battery-packaging";
  const c = {
    paper: 0xe7e2d5, white: 0xf1ecdf, road: 0x78827d, concrete: 0xc2c8bd,
    red: 0xa44c3f, orange: 0xc3834e, silver: 0xb9c5c6, glass: 0x4e7776,
    teal: 0x729d91, dark: 0x333e3d, brick: 0x99715a, sage: 0x7b907e,
    leaf: 0x77875e, wood: 0x987d59, gold: 0xe2b86b, blue: 0x526e85,
  };
  const materials = new Map<number, THREE.MeshStandardMaterial>();
  const geometries = new Set<THREE.BufferGeometry>();
  function material(color: number) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: color === c.silver ? .38 : .78, metalness: color === c.silver ? .6 : color === c.dark ? .18 : 0 }));
    return materials.get(color)!;
  }
  function mesh(p: THREE.Object3D, geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number) {
    geometries.add(geometry);
    const m = new THREE.Mesh(geometry, material(color));
    m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = true; p.add(m); return m;
  }
  function box(p: THREE.Object3D,x: number,y: number,z: number,w: number,h: number,d: number,color: number,r = 0) {
    return mesh(p,r ? new RoundedBoxGeometry(w,h,d,2,r) : new THREE.BoxGeometry(w,h,d),color,x,y,z);
  }
  function cylinder(p: THREE.Object3D,x: number,y: number,z: number,r: number,h: number,color: number,sides = 24) {
    return mesh(p,new THREE.CylinderGeometry(r,r,h,sides),color,x,y,z);
  }
  function beam(p: THREE.Object3D,from: [number,number,number],to: [number,number,number],width: number,color: number) {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const m = box(p,0,0,0,width,a.distanceTo(b),width,color);
    m.position.copy(a).add(b).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());
    return m;
  }
  function ring(p: THREE.Object3D,x: number,y: number,z: number,r: number,t: number,color: number) {
    return mesh(p,new THREE.TorusGeometry(r,t,6,40),color,x,y,z);
  }
  function tree(p: THREE.Object3D,x: number,z: number,size = 1) {
    cylinder(p,x,.63,z,.23,.14,c.paper);
    cylinder(p,x,1,z,.05,.8*size,c.wood,8);
    for(let i=0;i<4;i++) {
      const m = mesh(p,new THREE.IcosahedronGeometry(.32*size,1),i%2 ? c.leaf : c.sage,x+Math.sin(i*2.4)*.22,1.55*size+(i%2)*.16,z+Math.cos(i*2.4)*.22);
      m.scale.y = 1.2;
    }
  }
  function lamp(p: THREE.Object3D,x: number,z: number) {
    cylinder(p,x,.7,z,.09,.23,c.dark,8); cylinder(p,x,1.32,z,.024,1.1,c.dark,8);
    box(p,x,1.88,z,.3,.07,.22,c.dark,.02); box(p,x,1.83,z,.23,.035,.16,c.gold);
  }
  function bench(p: THREE.Object3D,x: number,z: number) {
    for(const side of [-.36,.36]) box(p,x+side,.75,z,.07,.32,.4,c.dark);
    for(let i=0;i<3;i++) box(p,x,.93,z+i*.12,.95,.055,.085,c.wood);
    box(p,x,1.12,z-.1,.95,.3,.05,c.wood);
  }
  function steps(p: THREE.Object3D,width = 1.5) {
    for(let i=0;i<3;i++) box(p,0,.65+i*.06,1.62-i*.12,width,.1,.65-i*.14,c.paper);
  }
  function building(p: THREE.Object3D,w: number,h: number,d: number,color: number,flat = true) {
    box(p,0,.56+h/2,0,w,h,d,color,.06);
    if(flat) {
      box(p,0,.56+h+.09,0,w+.2,.18,d+.2,c.paper,.05);
      box(p,0,.56+h+.2,0,w-.2,.07,d-.2,c.concrete);
      for(const side of [-1,1]) box(p,side*w/2,.56+h+.29,0,.09,.22,d+.1,color);
      box(p,0,.56+h+.29,-d/2,w+.1,.22,.09,color);
    }
    for(const side of [-1,1]) {
      for(let row=0;row<Math.max(1,Math.floor(h/1.1));row++) {
        for(let col=0;col<4;col++) box(p,(col-1.5)*w/4,1.18+row*1.06,side*(d/2+.015),w/4*.57,.65,.04,c.glass);
        for(let col=0;col<3;col++) box(p,side*(w/2+.015),1.18+row*1.06,(col-1)*d/3,.04,.65,d/3*.57,c.glass);
      }
    }
    box(p,0,1.23,d/2+.04,.65,1.3,.05,c.dark);
    box(p,0,1.23,d/2+.08,.025,1.2,.025,c.paper);
    steps(p);
  }
  function gable(p: THREE.Object3D,x: number,y: number,z: number,w: number,d: number,h: number,color: number) {
    const shape = new THREE.Shape(); shape.moveTo(-w/2,0); shape.lineTo(w/2,0); shape.lineTo(0,h); shape.closePath();
    mesh(p,new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false}),color,x,y,z-d/2);
    for(const side of [-1,1]) box(p,x+side*w/4,y+h/2+.035,z,Math.hypot(w/2,h),.055,d+.1,color).rotation.z = -side*Math.atan2(h,w/2);
  }
  function car(p: THREE.Object3D,x: number,y: number,z: number,color: number,scale = 1) {
    const g = new THREE.Group(); g.position.set(x,y,z); g.scale.setScalar(scale); p.add(g);
    box(g,0,.14,0,.48,.17,.92,color,.055); box(g,0,.27,-.05,.4,.19,.46,color,.045);
    box(g,0,.3,.2,.34,.11,.03,c.glass).rotation.x = -.28;
    box(g,0,.3,-.29,.34,.11,.03,c.glass).rotation.x = .25;
    for(const side of [-1,1]) {
      box(g,side*.205,.3,-.05,.018,.095,.34,c.glass);
      for(const dz of [-.29,.29]) {
        cylinder(g,side*.25,.105,dz,.105,.07,c.dark,12).rotation.z = Math.PI/2;
        cylinder(g,side*.288,.105,dz,.065,.009,c.silver,12).rotation.z = Math.PI/2;
      }
      box(g,side*.17,.16,.465,.095,.052,.014,c.white);
      box(g,side*.17,.16,-.465,.095,.044,.014,c.red);
    }
    box(g,0,.2,-.4,.5,.035,.1,c.dark); return g;
  }
  function batch(g: THREE.Group,id?: string) {
    g.updateMatrixWorld(true); const inverse = g.matrixWorld.clone().invert();
    const groups = new Map<THREE.Material,THREE.BufferGeometry[]>(), old: THREE.Mesh[] = [];
    g.traverse(child=>{ if(!(child instanceof THREE.Mesh)) return; old.push(child); const geo=(child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone()).applyMatrix4(inverse.clone().multiply(child.matrixWorld)); const key=child.material as THREE.Material; const list=groups.get(key)??[]; list.push(geo); groups.set(key,list); });
    old.forEach(m=>m.removeFromParent());
    for(const [mat,parts] of groups) { const geo=mergeGeometries(parts); parts.forEach(p=>p.dispose()); if(!geo)continue; geometries.add(geo); const m=new THREE.Mesh(geo,mat); m.castShadow=true; m.receiveShadow=true; if(id)m.userData.district=id; g.add(m); }
  }
  const environment = new THREE.Group(); scene.add(environment);
  box(environment,0,0,0,20.5,.8,14.5,c.concrete,.3);
  box(environment,0,.415,0,20.25,.045,14.25,c.road,.25);
  for(const x of [-5.1,0,5.1]) for(const z of [-3.1,3.1]) {
    box(environment,x,.5,z,4.65,.16,4.65,c.paper,.18);
    for(let j=-2;j<=2;j++) { box(environment,x+j,.588,z,.012,.003,4.4,c.concrete); box(environment,x,.588,z+j,4.4,.003,.012,c.concrete); }
  }
  for(let x=-9;x<=9;x++) { box(environment,x,.453,0,.36,.01,.035,c.white); box(environment,x,.453,6.55,.36,.01,.035,c.white); box(environment,x,.453,-6.55,.36,.01,.035,c.white); }
  for(const side of [-1,1]) for(let z=-6;z<=6;z++) box(environment,side*9.65,.453,z,.035,.01,.36,c.white);
  for(const x of [-2.55,2.55]) for(const side of [-1,1]) for(let j=-3;j<=3;j++) box(environment,x+j*.17,.455,side*1.04,.095,.012,.5,c.white);
  for(const x of [-7.1,-2.95,2.95,7.1]) for(const z of [-5.05,5.05]) { tree(environment,x,z,.75); lamp(environment,x+.6,z); }
  for(const x of [-7.2,-2.95,2.95,7.2]) { tree(environment,x,-1.35,.7); tree(environment,x,1.35,.72); }
  for(const x of [-8,8]) for(const z of [-3,0,3]) tree(environment,x,z,.95);
  const blocks=project.districts.map(d=>{ const g=new THREE.Group(); g.position.set(d.position[0],0,d.position[1]); scene.add(g); return g; });
  let releaseCoin: THREE.Mesh | null = null;
  let printHead: THREE.Mesh | null = null;
  if(battery) {
    const [archive,vault,release,recovery,exhibition]=blocks;
    building(archive,3.6,2.4,2.9,c.paper,false);
    gable(archive,0,2.97,0,3.85,3.15,.73,c.red);
    for(const x of [-1.45,1.45]) box(archive,x,1.9,1.48,.16,2.6,.18,c.white);
    box(archive,0,3.3,0,.95,.07,.9,c.silver).rotation.x = .2;
    cylinder(vault,0,.7,0,1.95,.23,c.concrete,48);
    cylinder(vault,0,2.46,0,1.55,3.25,c.silver,48);
    for(let j=0;j<20;j++) { const r=ring(vault,0,.95+j*.158,0,1.57,.026,j%3===0 ? c.white : c.dark); r.rotation.x=-Math.PI/2; }
    cylinder(vault,0,4.18,0,1.68,.15,c.silver,48);
    ring(vault,0,4.28,0,1.49,.027,c.white).rotation.x=-Math.PI/2;
    box(vault,0,4.28,0,.85,.022,.18,c.dark); box(vault,0,4.28,0,.18,.022,.85,c.dark);
    for(let j=0;j<6;j++) { const angle=j*Math.PI/3; const m=box(vault,Math.sin(angle)*1.69,2.37,Math.cos(angle)*1.69,.23,3.6,.36,c.red,.015); m.rotation.y=angle; }
    box(vault,0,1.26,1.66,.94,1.35,.25,c.paper); box(vault,0,1.21,1.805,.65,1.18,.045,c.dark); steps(vault,1.25);
    building(release,3.6,2.1,2.8,c.white);
    for(const x of [-1.12,0,1.12]) box(release,x,2.93,-.2,.75,.09,1.4,c.glass).rotation.x=.22;
    box(release,0,1.46,1.45,2.7,1.1,.05,c.dark);
    for(const x of [-1.1,0,1.1]) box(release,x,1.46,1.53,.065,1.15,.08,c.silver);
    box(release,0,.93,1.95,1.2,.14,1.6,c.silver,.05);
    for(const side of [-1,1]) box(release,side*.55,1.14,1.96,.045,.24,1.62,c.dark);
    releaseCoin=cylinder(release,0,1.13,2.08,.34,.1,c.silver,40);
    // A single visible cell sits on the release tray, isolated from the storage bays.
    for(const x of [-1,1]) {
      box(recovery,x,1.54,0,1.68,1.95,2.8,x<0 ? c.paper : c.teal,.045);
      gable(recovery,x,2.51,0,1.85,3,.58,x<0 ? c.white : c.teal);
      box(recovery,x,1.53,1.42,1.36,1.63,.04,c.glass);
      for(let j=-1;j<=1;j++) box(recovery,x+j*.5,1.52,1.48,.043,1.75,.07,c.white);
      for(let j=0;j<3;j++) box(recovery,x+(j-1)*.41,.95,1.84,.29,.55,.4,x<0 ? c.white : c.teal,.035);
    }
    box(recovery,0,2.05,-.6,.55,.15,1.15,c.silver); steps(recovery,1.4);
    building(exhibition,3.5,1.75,2.85,c.white);
    for(const side of [-1,1]) {
      box(exhibition,0,1.53,side*1.45,3.14,1.75,.045,c.glass);
      for(let j=-3;j<=3;j++) box(exhibition,j*.48,1.53,side*1.5,.055,1.86,.08,c.paper);
    }
    const ribbon=ring(exhibition,0,2.49,0,.63,.1,c.red); ribbon.scale.set(1,1.2,1);
    for(const side of [-1,1]) beam(exhibition,[side*.44,2.14,0],[side*.72,1.45,0],.18,c.red);
    box(exhibition,0,1.08,1.66,1,.45,.5,c.paper,.02);
    // Open landscaped square, giving the safety campus a quieter sixth plot.
    box(environment,-5.1,.59,3.1,3.9,.06,3.9,c.sage,.35);
    for(const side of [-1,1]) { tree(environment,-5.1+side*1.25,3.1+side,.95); bench(environment,-5.1+side*.8,3.5); }
    cylinder(environment,-5.1,.68,2.6,.88,.17,c.paper,32);
    ring(environment,-5.1,.81,2.6,.68,.04,c.silver).rotation.x=-Math.PI/2;
  } else {
    const [collector,tower,studio,printer,assembly,market]=blocks;
    building(collector,3.65,2.45,3,c.brick);
    box(collector,0,1.9,1.52,3.17,2.1,.045,c.dark);
    for(const y of [1.15,2.05]) { box(collector,0,y,1.62,3.15,.08,.82,c.silver); for(let i=0;i<4;i++) car(collector,(i-1.5)*.72,y+.055,1.5,[c.white,c.orange,c.blue,c.red][i],.6); }
    for(const x of [-1.57,0,1.57]) box(collector,x,1.87,1.92,.06,2.3,.07,c.paper);
    for(let level=0;level<4;level++) {
      const y=.72+level*1.08;
      box(tower,0,y,0,3.65,.14,3,c.dark,.035);
      for(const x of [-1.68,0,1.68]) for(const z of [-1.35,1.35]) box(tower,x,y+.49,z,.1,1.07,.1,c.dark);
      for(const x of [-1.7,1.7]) { beam(tower,[x,y+.13,-1.35],[x,y+1.03,1.35],.065,c.silver); beam(tower,[x,y+.13,1.35],[x,y+1.03,-1.35],.065,c.silver); }
      for(let i=0;i<3;i++) for(const z of [-.68,.68]) car(tower,(i-1)*1.08,y+.08,z,[c.blue,c.red,c.white,c.orange,c.sage][(level+i)%5],.82);
    }
    box(tower,0,4.62,0,3.82,.15,3.12,c.dark,.025);
    building(studio,3.7,1.9,2.9,c.white,false);
    for(let i=0;i<3;i++) { gable(studio,-1.23+i*1.23,2.48,0,1.25,3.12,.61,c.white); box(studio,-1.35+i*1.23,2.82,0,.63,.055,2.7,c.glass).rotation.z=.45; }
    box(studio,0,1.43,1.48,2.95,1.42,.03,c.glass);
    for(const x of [-1.45,-.48,.48,1.45]) box(studio,x,1.43,1.54,.055,1.5,.08,c.silver);
    building(printer,3.4,1.9,2.85,c.dark);
    box(printer,0,1.54,1.45,2.65,1.67,.05,c.glass);
    // Rooftop cutaway printer: frame, bed, carriage and a filament spool.
    box(printer,-.45,2.79,0,1.52,.13,1.45,c.silver);
    for(const x of [-1.15,.25]) box(printer,x,3.23,0,.08,.83,.08,c.dark);
    box(printer,-.45,3.61,0,1.52,.08,.08,c.dark);
    printHead=box(printer,-.4,3.45,0,.21,.25,.24,c.orange,.03);
    box(printer,-.45,2.92,0,.62,.22,.82,c.white,.025);
    ring(printer,1.12,2.95,.12,.36,.11,c.orange).rotation.y=Math.PI/2;
    building(assembly,3.75,1.5,2.85,c.brick);
    box(assembly,0,1.39,1.46,3.05,1.25,.05,c.dark);
    for(const x of [-1.03,0,1.03]) { box(assembly,x,.9,1.57,.74,.07,.85,c.silver); car(assembly,x,.96,1.55,[c.white,c.red,c.sage][Math.round(x+1)],.58); }
    for(let i=0;i<3;i++) box(assembly,-1.26+i*1.2,2.28,-.15,.8,.09,1.3,c.glass).rotation.x=.14;
    for(const x of [-1.68,1.68]) for(let j=0;j<3;j++) box(assembly,x,.75+j*.2,1.6,.25,.17,.4,c.paper,.02);
    building(market,3.65,1.8,2.65,c.dark);
    box(market,0,1.59,1.35,3.15,1.5,.045,c.glass);
    for(let i=0;i<14;i++) box(market,-1.67+i*.258,2.36,1.68,.255,.05,1,i%2 ? c.white : c.orange).rotation.x=.18;
    for(const x of [-1.08,0,1.08]) { box(market,x,.8,1.85,.58,.42,.63,c.paper,.025); car(market,x,1.03,1.85,[c.red,c.blue,c.orange][Math.round(x+1)],.55); }
    for(const x of [-1.68,1.68]) cylinder(market,x,1.45,2.03,.024,1.8,c.dark,8);
    bench(environment,-8,4); bench(environment,8,-1);
  }
  releaseCoin?.removeFromParent(); printHead?.removeFromParent();
  batch(environment);
  blocks.forEach((g,i)=>batch(g,project.districts[i].id));
  if(releaseCoin) blocks[2].add(releaseCoin);
  if(printHead) blocks[3].add(printHead);
  const vehicles=[c.sage,c.orange,c.paper,c.blue].map((color,i)=>{ const g=car(scene,0,.5,0,color,battery ? .85 : 1); g.userData.start=i*16; batch(g); return g; });
  return {
    blocks,
    update(elapsed: number,selected: string | null) {
      const a=9.65,b=6.55,perimeter=4*(a+b);
      vehicles.forEach((g,i)=>{ let t=(elapsed*.65+i*perimeter/4)%perimeter; if(t<2*a){g.position.set(-a+t,.5,b);g.rotation.y=Math.PI/2;}else if((t-=2*a)<2*b){g.position.set(a,.5,b-t);g.rotation.y=Math.PI;}else if((t-=2*b)<2*a){g.position.set(a-t,.5,-b);g.rotation.y=-Math.PI/2;}else{t-=2*a;g.position.set(-a,.5,-b+t);g.rotation.y=0;} });
      if(releaseCoin) releaseCoin.position.z=2.08+(selected==="release" ? Math.sin(elapsed*.65)*.18 : 0);
      if(printHead) printHead.position.x=-.45+Math.sin(elapsed*1.4)*.44;
    },
    dispose() { geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose()); },
  };
}

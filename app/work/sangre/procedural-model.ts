import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// 1 unit = 50 mm. Envelope follows the supplied 158 × 100 × 59 mm drawing.
// Presentation reconstruction: the electronics and hinge are not manufacturing CAD.
export function createSangreModel() {
  const root = new T.Group(); root.name = "sangre-procedural";
  const group = (name: string, parent = root) => { const g = new T.Group(); g.name = name; parent.add(g); return g; };
  const plastic = new T.MeshPhysicalMaterial({ name: "warm-ivory-PP", color: 0xe4e1d2, roughness: .32, metalness: 0, clearcoat: .16, clearcoatRoughness: .34 });
  const black = new T.MeshPhysicalMaterial({ name: "black-screen-surround", color: 0x111315, roughness: .22, metalness: .12, clearcoat: .4, clearcoatRoughness: .16 });
  const rubber = new T.MeshStandardMaterial({ name: "soft-black-elastomer", color: 0x252727, roughness: .78 });
  const clear = new T.MeshPhysicalMaterial({ name: "clear-PET", color: 0xffffff, roughness: .03, transmission: 1, thickness: .032, ior: 1.57, metalness: 0, envMapIntensity: 8, transparent: true, opacity: .66, depthWrite: false });
  const shellClear = plastic.clone(); shellClear.name = "cutaway-shell";shellClear.transmission=.001;shellClear.thickness=.035;shellClear.ior=1.49;shellClear.transparent=true;
  const silver = new T.MeshStandardMaterial({ name: "brushed-metal", color: 0x9da5a7, metalness: .85, roughness: .28 });
  const copper = new T.MeshStandardMaterial({ name: "copper-winding", color: 0xb98553, metalness: .88, roughness: .3 });
  const boardMat = new T.MeshStandardMaterial({ name: "black-PCB", color: 0x202b28, roughness: .65, metalness: .18 });
  const green = new T.MeshStandardMaterial({ name: "battery-wrap", color: 0x558e3d, roughness: .43, metalness: .06 });
  const gold = new T.MeshStandardMaterial({ name: "contacts", color: 0xcaa976, metalness: .8, roughness: .29 });
  const stripWhite = new T.MeshStandardMaterial({ name: "test-strip-polymer", color: 0xe8e9e6, roughness: .34 });
  const displayMaterial = new T.MeshBasicMaterial({ name: "compact-dashboard", color: 0xffffff, toneMapped: false });
  const grain=new Uint8Array(64*64*4);let seed=17;for(let i=0;i<64*64;i++){seed=(seed*1664525+1013904223)>>>0;const v=115+(seed>>>27);grain.set([v,v,v,255],i*4);}
  const microtexture=new T.DataTexture(grain,64,64);microtexture.wrapS=microtexture.wrapT=T.RepeatWrapping;microtexture.repeat.set(7,7);microtexture.needsUpdate=true;
  plastic.bumpMap=microtexture;plastic.bumpScale=.0015;shellClear.bumpMap=microtexture;shellClear.bumpScale=.0015;
  const fullMaterial = displayMaterial.clone(); fullMaterial.name = "expanded-dashboard";
  const shellMeshes: T.Mesh[] = [];
  const lidEdge=new T.LineBasicMaterial({color:0xd7e0df,transparent:true,opacity:.10,depthWrite:false});
  const shellEdge=lidEdge.clone();shellEdge.opacity=0;
  const mesh = (parent: T.Group, geometry: T.BufferGeometry, material: T.Material, position = [0, 0, 0]) => {
    const m = new T.Mesh(geometry, material); m.position.fromArray(position); m.castShadow = material !== clear && material !== shellClear; m.receiveShadow = true; parent.add(m); return m;
  };
  const box = (parent: T.Group, w: number, h: number, d: number, r: number, material: T.Material, position: number[]) => mesh(parent, new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)), material, position);
  const outline = (w: number, h: number, r: number) => {
    const s = new T.Shape(), x = w / 2, y = h / 2;
    s.moveTo(-x + r, -y); s.lineTo(x - r, -y); s.quadraticCurveTo(x, -y, x, -y + r);
    s.lineTo(x, y - r); s.quadraticCurveTo(x, y, x - r, y); s.lineTo(-x + r, y); s.quadraticCurveTo(-x, y, -x, y - r);
    s.lineTo(-x, -y + r); s.quadraticCurveTo(-x, -y, -x + r, -y); return s;
  };
  const extrude = (s: T.Shape, depth: number, bevel = .014) => new T.ExtrudeGeometry(s, { depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3, curveSegments: 16, steps: 1 });
  const plate = (parent: T.Group, s: T.Shape, thickness: number, material: T.Material, position: number[], bevel = .012) => mesh(parent, extrude(s, thickness, bevel).rotateX(-Math.PI / 2), material, position);
  const ring = (w: number, d: number, radius: number, wall: number) => { const s = outline(w, d, radius); s.holes.push(outline(w - wall * 2, d - wall * 2, Math.max(.01, radius - wall))); return s; };
  const cylinder = (parent: T.Group, radius: number, height: number, material: T.Material, position: number[]) => mesh(parent, new T.CylinderGeometry(radius, radius, height, 40), material, position);
  const tube = (parent: T.Group, points: T.Vector3[], radius: number, material: T.Material, segments = 100) => mesh(parent, new T.TubeGeometry(new T.CatmullRomCurve3(points), segments, radius, 6, false), material);

  const base = group("lower-shell");
  plate(base, outline(3.13, 1.97, .16), .07, plastic, [0, .04, 0], .016);
  plate(base, ring(3.08, 1.92, .14, .043), .07, plastic, [0, .11, 0], .009);
  // The dark parting line is a narrow gasket, never a metallic band around the PP.
  plate(base, ring(3.10, 1.94, .145, .035), .016, rubber, [0, .105, 0], .002);
  for (const x of [-1.33, 1.33]) for (const z of [-.77, .77]) cylinder(base, .1, .035, rubber, [x, .023, z]);
  for (const z of [-.82, .82]) box(base, 1.5, .025, .11, .045, rubber, [0, .015, z]);
  const switchGroup = group("power-switch", base);
  box(switchGroup, .31, .035, .14, .065, black, [1.08, .005, .48]);
  box(switchGroup, .13, .032, .105, .04, new T.MeshStandardMaterial({ color: 0x9b463b, roughness: .6 }), [1.13, -.014, .48]);
  for (const [x, z] of [[-1.34,-.75],[-1.34,.73],[-.02,-.75],[-.02,.73],[1.31,-.75],[1.31,.75],[.78,.73],[.34,-.7]]) {
    const post = new T.Shape(); post.absarc(0, 0, .055, 0, Math.PI * 2, false);
    const hole = new T.Path(); hole.absarc(0, 0, .026, 0, Math.PI * 2, true); post.holes.push(hole);
    plate(base, post, .12, plastic, [x, .12, z], .004);
  }
  for (const x of [-1.36, -.03]) {
    const rib = new T.Shape(); rib.moveTo(-.5,.13); rib.lineTo(.7,.13); rib.lineTo(-.25,.7); rib.quadraticCurveTo(-.37,.76,-.4,.6); rib.closePath();
    mesh(base, extrude(rib,.042,.008).rotateY(-Math.PI/2), plastic, [x,0,0]);
    for (let i=0;i<3;i++) { const gusset = new T.Shape(); gusset.moveTo(0,0); gusset.lineTo(.19,0); gusset.lineTo(0,.2+i*.09); gusset.closePath(); mesh(base,extrude(gusset,.025,.002),plastic,[x < -1 ? x : x-.18,.13,.39-i*.22]); }
  }

  const shell = group("upper-shell");
  // Hollow left wedge and right enclosure. No opaque block fills the interior.
  plate(shell, ring(3.12,1.96,.15,.055), .06, plastic, [0,.13,0]);
  const side = new T.Shape();
  side.moveTo(-.9,.20); side.quadraticCurveTo(-.96,.2,-.94,.29); side.lineTo(-.49,1.03); side.quadraticCurveTo(-.36,1.25,-.23,1.09);
  side.lineTo(.87,.29); side.quadraticCurveTo(.96,.22,.86,.2); side.closePath();
  for (const x of [-1.40,.13]) mesh(shell,extrude(side,.095,.026).rotateY(-Math.PI/2),plastic,[x,0,0]);
  const rearWall=box(shell,1.43,1.02,.055,.025,plastic,[-.68,.68,-.67]);rearWall.rotation.x=.49;
  const support = group("sloped-screen-support",shell); support.position.set(-.68,.23,.80); support.rotation.x = -.9273;
  box(support,1.43,1.46,.072,.035,plastic,[0,.73,-.067]);
  const trackPoints = Array.from({length:81},(_,i)=>{const a=(-.22+i/80*1.44)*Math.PI;return new T.Vector3(Math.cos(a)*.51,.75+Math.sin(a)*.51,-.02);});
  tube(support,trackPoints,.023,silver,100);
  const rightTop = outline(1.32,1.88,.12), slotHole = outline(.18,1.18,.043);
  rightTop.holes.push(new T.Path(slotHole.getPoints().map(p=>new T.Vector2(p.x+.24,p.y-.08))));
  plate(shell,rightTop,.055,plastic,[.85,.55,0],.026);
  plate(shell,ring(1.32,1.89,.13,.056),.36,plastic,[.85,.18,0],.012);
  // Recessed insertion slot, with a broad chamfer opening and a narrower bottom.
  const slotRim = ring(.22,1.23,.045,.043);
  plate(shell,slotRim,.075,plastic,[1.09,.46,.08],.02);
  box(shell,.1,.018,1.10,.04,black,[1.09,.451,.08]);
  const arrow = new T.Shape(); arrow.moveTo(-.013,-.38);arrow.lineTo(.013,-.38);arrow.lineTo(.013,.31);arrow.lineTo(.068,.24);arrow.lineTo(.082,.255);arrow.lineTo(0,.37);arrow.lineTo(-.082,.255);arrow.lineTo(-.068,.24);arrow.lineTo(-.013,.31);arrow.closePath();
  plate(shell,arrow,.001,black,[.84,.636,.10],0);

  const display = group("folding-display"); display.position.set(-.68,.24,.85); display.rotation.x = -.9273;
  box(display,1.45,1.50,.062,.045,black,[0,.75,0]);
  const compactScreen = mesh(display,new T.PlaneGeometry(1.26,1.30),displayMaterial,[0,.75,.033]);
  const bottomScreen = mesh(display,new T.PlaneGeometry(1.26,1.40),fullMaterial,[0,.80,.034]); bottomScreen.visible = false;
  const uv = bottomScreen.geometry.getAttribute("uv"); for(let i=0;i<uv.count;i++) uv.setY(i,uv.getY(i)*.5);
  const hinge = group("screen-hinge",display); hinge.position.y = 1.50;
  const axle = cylinder(display,.042,1.37,black,[0,1.5,-.012]); axle.rotation.z = Math.PI/2;
  const leaf = group("upper-screen-leaf",hinge);
  box(leaf,1.45,1.50,.062,.045,black,[0,.75,0]);
  const upperScreen = mesh(leaf,new T.PlaneGeometry(1.26,1.40),fullMaterial,[0,.70,.033]);
  const topUv = upperScreen.geometry.getAttribute("uv"); for(let i=0;i<topUv.count;i++) topUv.setY(i,topUv.getY(i)*.5+.5);
  hinge.rotation.x = -Math.PI;
  // Thin black joint remains at the crease when the two leaves align.
  box(display,1.28,.015,.008,.003,rubber,[0,1.5,.038]);

  const lid = group("clear-storage-cover"); lid.position.set(.86,.63,0);
  plate(lid,ring(1.29,1.87,.105,.034),.48,clear,[0,0,0],.01);
  plate(lid,outline(1.29,1.87,.105),.026,clear,[0,.48,0],.011);
  plate(lid,ring(1.25,1.82,.095,.023),.037,clear,[0,.013,0],.005);
  // A molded thumb tab, clear as the lid, with a softer radius than the shell.
  box(lid,.25,.055,.085,.026,clear,[0,.014,.942]);
  const tray = group("removable-storage-tray"); tray.position.set(.86,.631,0);
  plate(tray,outline(1.15,1.72,.105),.022,rubber,[0,0,0],.012);
  plate(tray,ring(1.16,1.73,.105,.036),.12,rubber,[0,.02,0],.008);

  const internals = group("reference-based-electronics");
  const board = group("logic-board",internals);
  box(board,1.17,.027,1.22,.035,boardMat,[-.65,.30,-.06]);
  box(board,1.01,.027,1.20,.03,boardMat,[.80,.3,-.03]);
  for(const [x,z,w] of [[-.88,.20,.23],[-.42,-.35,.19],[-.9,-.36,.17],[.56,.35,.22],[1.1,-.4,.2],[.50,-.22,.15]]) {
    box(board,w,.041,w*.83,.008,black,[x,.337,z]);
    for(let i=0;i<8;i++) for(const side of [-1,1]) box(board,.012,.012,.056,.003,silver,[x-w*.4+i*w*.114,.329,z+side*w*.43]);
  }
  for(let i=0;i<44;i++) {
    const x = (i<22?-.65:.80)+Math.sin(i*4.13)*.46, z=Math.cos(i*2.73)*.50;
    box(board,.035,.033,.057,.004,i%3?black:gold,[x,.337,z]);
    for(const dz of [-.035,.035]) box(board,.042,.009,.019,.002,silver,[x,.317,z+dz]);
  }
  for(const [x,z] of [[-.27,.40],[-1.03,.4],[.41,-.44],[1.15,.43]]) { cylinder(board,.047,.10,black,[x,.365,z]);cylinder(board,.041,.006,silver,[x,.418,z]); }
  // Screen-printed tracks on the solder mask, kept subtle rather than glowing.
  for(let i=0;i<18;i++) {
    const x = -.65+(i%6-.5)*.11, z = -.48+Math.floor(i/6)*.24;
    tube(board,[new T.Vector3(x,.318,z),new T.Vector3(x+.06,.318,z+.09),new T.Vector3(x+.23,.318,z+.09)],.0025,silver,8);
  }
  const battery = group("18650-battery",internals); battery.position.set(-.65,.43,-.40);
  const cell = cylinder(battery,.173,1.28,green,[0,0,0]);cell.rotation.z=Math.PI/2;
  for(const x of [-.65,.65]) {const cap=cylinder(battery,.161,.026,silver,[x,0,0]);cap.rotation.z=Math.PI/2;}
  const coil = group("copper-coil",internals); coil.position.set(-.65,.65,.19);coil.rotation.x=-.78;
  box(coil,1.02,.94,.029,.08,silver,[0,0,-.033]);
  const ferrite = cylinder(coil,.458,.025,rubber,[0,0,0]);ferrite.rotation.x=Math.PI/2;
  const winding = Array.from({length:1501},(_,i)=>{const a=i/1500*Math.PI*2*16,r=.175+i/1500*.265;return new T.Vector3(Math.cos(a)*r,Math.sin(a)*r,.025);});
  tube(coil,winding,.0065,copper,1500);
  const center=cylinder(coil,.169,.014,black,[0,0,.02]);center.rotation.x=Math.PI/2;
  for (const sign of [-1,1]) { const arcs=Array.from({length:25},(_,i)=>{const a=(-.32+i/24*.64)*Math.PI;return new T.Vector3(sign*Math.cos(a)*.097,Math.sin(a)*.097,.03);});tube(coil,arcs,.004,silver,25); }
  const sensor = group("optical-module",internals);sensor.position.set(.86,.34,.04);
  const sensorShape=new T.Shape(); sensorShape.moveTo(-.455,-.535);sensorShape.lineTo(.455,-.535);sensorShape.lineTo(.455,-.31);sensorShape.quadraticCurveTo(.26,0,.455,.31);sensorShape.lineTo(.455,.535);sensorShape.lineTo(-.455,.535);sensorShape.closePath();
  plate(sensor,sensorShape,.18,black,[0,0,0],.01);
  box(sensor,.072,.017,.87,.03,silver,[.16,.196,0]);
  const retainer=group("screen-retainer");retainer.position.copy(support.position);retainer.rotation.copy(support.rotation);
  tube(retainer,trackPoints.map(p=>new T.Vector3(p.x,p.y,.005)),.026,rubber,100);

  function testStrip(name:string) {
    const g=group(name);const s=outline(.36,1.19,.041);
    for(const z of [-.3,0,.3]) {const h=new T.Path();h.absarc(0,z,.057,0,Math.PI*2,true);s.holes.push(h);}
    plate(g,s,.075,stripWhite,[0,0,0],.013);
    plate(g,outline(.35,1.17,.04),.027,black,[0,-.03,0],.008);
    const rim=ring(.255,.88,.025,.023);plate(g,rim,.012,stripWhite,[0,.084,0],.005);
    for(const z of [-.3,0,.3]) cylinder(g,.047,.005,rubber,[0,.015,z]);
    box(g,.035,.019,.51,.009,black,[.185,.009,.03]);
    box(g,.042,.028,.15,.006,silver,[.184,.015,.12]);return g;
  }
  const strip=testStrip("test-strip");strip.position.set(.69,.80,0);strip.rotation.y=.10;
  const spare=testStrip("stored-test-strip");spare.position.set(1.03,.8,-.04);spare.rotation.y=-.10;

  // Merge static meshes by material inside each moving group. Detail does not cost
  // a draw call per pin, screw or component. The two display planes stay separate.
  const keep = new Set<T.Object3D>([compactScreen,bottomScreen,upperScreen]);
  root.traverse(object=>{
    if(!(object instanceof T.Group))return;
    const batches = new Map<T.Material,T.Mesh[]>();
    for(const child of object.children)if(child instanceof T.Mesh && !keep.has(child)) {const mat=child.material as T.Material; const list=batches.get(mat)||[];list.push(child);batches.set(mat,list);}
    for(const [mat,list] of batches) {
      if(list.length<2)continue;
      const geometries=list.map(m=>{m.updateMatrix();const g=m.geometry.clone().applyMatrix4(m.matrix);const flat=g.index?g.toNonIndexed():g;if(flat!==g)g.dispose();return flat;});
      const merged=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());
      if(!merged)continue;
      list.forEach(m=>{object.remove(m);m.geometry.dispose();});mesh(object,merged,mat);
    }
  });
  shell.traverse(o=>{if(o instanceof T.Mesh&&o.material===plastic)shellMeshes.push(o);});
  for(const parent of [lid,shell])for(const child of [...parent.children])if(child instanceof T.Mesh&&(child.material===clear||child.material===plastic)) {
    const edge=new T.LineSegments(new T.EdgesGeometry(child.geometry,24),parent===lid?lidEdge:shellEdge);edge.position.copy(child.position);edge.quaternion.copy(child.quaternion);parent.add(edge);
  }
  const marker = group("annotation-anchor");
  function pose(unfold:number,access:number,explode:number) {
    display.position.set(-.68,.24+explode*5.8,.85-explode*.7);
    display.rotation.x=-.9273+unfold*.17;
    display.visible=explode<.9;
    hinge.rotation.x=-Math.PI*(1-unfold);hinge.position.z=-.072*(1-unfold);
    compactScreen.visible=unfold<.1;bottomScreen.visible=unfold>=.1;
    const open=T.MathUtils.smoothstep(access,0,.40),lift=T.MathUtils.smoothstep(access,.40,.58),travel=T.MathUtils.smoothstep(access,.58,.86),settle=T.MathUtils.smoothstep(access,.86,1);
    lid.position.set(.86+open*.60,.63+open*.90+explode*5,-open*.90);
    lid.rotation.z=-open*.08;lid.visible=explode<.85;
    tray.position.set(.86+open*.30,.631+open*.20+explode*5,-open*1.60);
    tray.visible=explode<.85;
    spare.position.set(1.03+open*.30,.815+open*.20+explode*5,-.04-open*1.60);spare.visible=explode<.85;
    strip.position.set(T.MathUtils.lerp(.69+open*.30,1.09,travel),T.MathUtils.lerp(.685+open*.20+lift*.36,.72,settle)+explode*5,T.MathUtils.lerp(-open*1.60,.03,travel));
    strip.rotation.set(0,.10*(1-travel),-travel*Math.PI/2);strip.visible=explode<.85;
    shell.position.y=explode*1.36;
    const reveal=T.MathUtils.smoothstep(explode,.16,.70);
    shellClear.transmission=.001+reveal*.999;shellClear.roughness=.32-reveal*.285;shellClear.envMapIntensity=1+reveal*7;shellClear.opacity=1-reveal*.32;shellClear.depthWrite=reveal<.1;shellEdge.opacity=reveal*.12;shellClear.bumpScale=.0015*(1-reveal);shellClear.color.copy(plastic.color).lerp(new T.Color(0xffffff),reveal);
    shellMeshes.forEach(m=>{m.material=shellClear;m.castShadow=reveal<.2;});
    // Cull electronics behind the closed enclosure; reveal them as the shell lifts.
    internals.visible=explode>.03;internals.position.y=explode*.14;coil.position.y=.65+explode*.21;sensor.position.y=.34+explode*.36;battery.position.y=.43+explode*.3;
    retainer.visible=explode>.25;retainer.position.y=.23+explode*1.68;
  }
  pose(0,0,0);
  return { root, base, shell, display, lid, strip, coil, marker, materials:{plastic,black,clear,shellClear,displayMaterial,fullMaterial}, pose };
}

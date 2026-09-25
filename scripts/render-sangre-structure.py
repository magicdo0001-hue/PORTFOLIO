"""Offline SANGRE chapter 04. Source CAD is preserved; electronics are illustrative.
Blender -b --factory-startup --python scripts/render-sangre-structure.py -- --preview
"""
import argparse, json, math, struct, sys, shutil, time
from pathlib import Path
import bpy, bmesh
import numpy as np
from mathutils import Vector, Matrix, Quaternion

ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--preview',action='store_true');p.add_argument('--frames',default='');p.add_argument('--width',type=int,default=1440);p.add_argument('--samples',type=int,default=48);p.add_argument('--output',default=str(ROOT/'tmp/sangre-film'))
a=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
OUT=Path(a.output);OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=20 if a.preview else a.samples;s.cycles.use_denoising=True;s.cycles.denoiser='OPTIX';s.cycles.denoising_use_gpu=True;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.035 if a.preview else .018;s.cycles.max_bounces=10;s.cycles.transmission_bounces=8;s.cycles.transparent_max_bounces=12;s.cycles.seed=17;s.cycles.use_animated_seed=False
prefs=bpy.context.preferences.addons['cycles'].preferences
try:
 prefs.compute_device_type='OPTIX';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='OPTIX'
 s.cycles.device='GPU'
except Exception:s.cycles.device='CPU'
s.render.resolution_x=720 if a.preview else a.width;s.render.resolution_y=int(s.render.resolution_x*.75);s.render.resolution_percentage=100;s.render.fps=24;s.frame_start=1;s.frame_end=288;s.render.use_persistent_data=True
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.image_settings.compression=15;s.render.film_transparent=False
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-1.05
C=Matrix(((1,0,0),(0,0,-1),(0,1,0)));center=C@Vector((.0719,.072,.129))
def P(v):return C@Vector(v)-center

def material(name,color,metal=0,rough=.3):
 m=bpy.data.materials.new(name);m.use_nodes=True;bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough;return m
ivory=material('Warm ivory ABS',(.68,.65,.55),0,.27);rubber=material('Silicone charcoal',(.015,.02,.018),0,.7);aluminium=material('Satin aluminium',(.48,.51,.48),.9,.25);battery_mat=material('18650 green sleeve',(.13,.38,.08),.25,.3);black=material('Display bezel',(.007,.01,.009),.15,.2);copper=material('Copper winding',(.46,.235,.10),.8,.27);pcbmat=material('Circuit board',(.018,.085,.047),.15,.52);chipmat=material('Electronic packages',(.011,.014,.013),.1,.55);gold=material('Contacts',(.58,.36,.10),.8,.28)
glass=material('Clear moulded polymer',(.96,.985,.97),0,.06);glass.node_tree.nodes.get('Principled BSDF').inputs['Transmission Weight'].default_value=1;glass.node_tree.nodes.get('Principled BSDF').inputs['IOR'].default_value=1.47
shellmat=ivory.copy();shellmat.name='Enclosure to cutaway';nodes=shellmat.node_tree.nodes;links=shellmat.node_tree.links;opaque=nodes.get('Principled BSDF');glassnode=nodes.new('ShaderNodeBsdfPrincipled');glassnode.inputs['Base Color'].default_value=(.96,.985,.97,1);glassnode.inputs['Roughness'].default_value=.065;glassnode.inputs['Transmission Weight'].default_value=1;glassnode.inputs['IOR'].default_value=1.47;mix=nodes.new('ShaderNodeMixShader');links.new(opaque.outputs[0],mix.inputs[1]);links.new(glassnode.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],nodes.get('Material Output').inputs['Surface'])

def glb(path):
 b=path.read_bytes();n=struct.unpack_from('<I',b,12)[0];d=json.loads(b[20:20+n]);raw=b[28+n:]
 def acc(i):
  item=d['accessors'][i];view=d['bufferViews'][item['bufferView']];dtype={5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1'}[item['componentType']];width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[item['type']]
  return np.frombuffer(raw,dtype=dtype,count=item['count']*width,offset=view.get('byteOffset',0)+item.get('byteOffset',0)).reshape(-1,width).copy()
 return d,acc

def objmesh(name,verts,faces,mat):
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.update();o=bpy.data.objects.new(name,data);s.collection.objects.link(o);data.materials.append(mat)
 for f in data.polygons:f.use_smooth=True
 return o
D,A=glb(ROOT/'art/sangre/source/assembly-exploded.glb')
roles=['switch','storage-lid','battery','folded-display','chassis','flat-display','base-pads','upper-shell','screen-retainer','lower-shell'];mats=[rubber,glass,battery_mat,ivory,aluminium,black,rubber,shellmat,rubber,ivory];parts={}
for node in D['nodes']:
 if 'mesh' not in node:continue
 i=node['mesh'];prim=D['meshes'][i]['primitives'][0];v=A(prim['attributes']['POSITION']);ids=A(prim['indices']).flatten().reshape(-1,3)
 q=node.get('rotation',[0,0,0,1]);rot=Quaternion((q[3],q[0],q[1],q[2])).to_matrix();scale=Vector(node.get('scale',[1,1,1]));translation=Vector(node.get('translation',[0,0,0]));world=[P(rot@Vector(tuple(x*scale[k] for k,x in enumerate(row)))+translation) for row in v]
 o=objmesh(roles[i],world,ids.tolist(),mats[i]);parts[roles[i]]=o
 if 'NORMAL' in prim['attributes']:
  normals=[(C@rot@Vector(n)).normalized() for n in A(prim['attributes']['NORMAL'])];o.data.normals_split_custom_set_from_vertices(normals)
parts['folded-display'].hide_render=True;parts['flat-display'].hide_render=True
# Split the actual flat display at its midline; the hinge motion is a presentation rig.
prim=D['meshes'][5]['primitives'][0];raw=A(prim['attributes']['POSITION']);ids=A(prim['indices']).flatten().reshape(-1,3)
right=Vector((-1,0,0));up=Vector((0,.697,.717)).normalized();normal=right.cross(up)
coords=np.array([[Vector(v).dot(right),Vector(v).dot(up),Vector(v).dot(normal)] for v in raw]);lo=coords.min(0);hi=coords.max(0);mid=(lo+hi)/2;coords-=mid;width=hi[0]-lo[0];height=hi[1]-lo[1];front=coords[:,2].max()+.00015
rig=bpy.data.objects.new('Folding display rig',None);s.collection.objects.link(rig)
r= C@right;u=C@Vector((0,.671,.741)).normalized();n=r.cross(u);rig.rotation_euler=Matrix((r,u,n)).transposed().to_euler();hinge=P((.105,.105,.137));rig.location=hinge
panels=[]
for upper in [False,True]:
 o=objmesh('Display upper' if upper else 'Display lower',coords.tolist(),ids.tolist(),black)
 bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.000001,plane_co=(0,0,0),plane_no=(0,1,0),clear_inner=upper,clear_outer=not upper);bm.to_mesh(o.data);bm.free();o.parent=rig;panels.append(o)

def screen_material():
 m=bpy.data.materials.new('Adaptive foldable display UI');m.use_nodes=True;nd=m.node_tree.nodes;lk=m.node_tree.links;nd.clear();out=nd.new('ShaderNodeOutputMaterial');em=nd.new('ShaderNodeEmission');em.inputs[1].default_value=1.2;blend=nd.new('ShaderNodeMixRGB');uv1=nd.new('ShaderNodeUVMap');uv1.uv_map='Folded';uv2=nd.new('ShaderNodeUVMap');uv2.uv_map='Expanded'
 for path,uv,slot in [(ROOT/'public/sangre/screen.png',uv1,1),(ROOT/'art/sangre/source/unfolded-ui.png',uv2,2)]:
  tex=nd.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(path));lk.new(uv.outputs[0],tex.inputs['Vector']);lk.new(tex.outputs['Color'],blend.inputs[slot])
 lk.new(blend.outputs[0],em.inputs[0]);lk.new(em.outputs[0],out.inputs[0]);return m,blend
screenmat,ui_mix=screen_material()
for i,panel in enumerate(panels):
 y0=-height/2+.004 if i==0 else .0002;y1=-.0002 if i==0 else height/2-.004;x0=-width/2+.004;x1=width/2-.004
 o=objmesh('Display pixels '+str(i),[(x0,y0,front),(x1,y0,front),(x1,y1,front),(x0,y1,front)],[(0,1,2,3)],screenmat);o.parent=panel
 for name in ['Folded','Expanded']:
  uv=o.data.uv_layers.new(name=name)
  for poly in o.data.polygons:
   for loop in poly.loop_indices:
    v=o.data.vertices[o.data.loops[loop].vertex_index].co
    uv.data[loop].uv=((v.x-x0)/(x1-x0),(v.y-y0)/(y1-y0) if name=='Folded' else (v.y+height/2-.004)/(height-.008))
# The supplied cartridge retains its two material regions; no unprovided latch motion is invented.
TD,TA=glb(ROOT/'art/sangre/source/test-strip.glb');strip=bpy.data.objects.new('Test strip travel',None);s.collection.objects.link(strip)
for i,prim in enumerate(TD['meshes'][0]['primitives']):
 v=TA(prim['attributes']['POSITION']);verts=[C@Vector((row[1],row[2],row[0])) for row in v];faces=TA(prim['indices']).flatten().reshape(-1,3).tolist();o=objmesh('Test strip region '+str(i),verts,faces,rubber if i==0 else ivory);o.parent=strip
# Reference-derived electronics supplement the supplied mechanical assembly.
electronics=[]
def box(name,point,size,mat,bevel=.0004):
 bpy.ops.mesh.primitive_cube_add(size=1,location=P(point));o=bpy.context.object;o.name=name;o.dimensions=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
 if bevel:mod=o.modifiers.new('Manufactured edges','BEVEL');mod.width=bevel;mod.segments=2;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 electronics.append(o);return o
box('Main circuit board',(.103,.061,.12),(.064,.0014,.046),pcbmat);box('Secondary board',(.029,.06,.129),(.041,.0014,.04),pcbmat);box('Sensing block',(.029,.077,.13),(.035,.019,.027),chipmat);box('Strip guide',(.029,.087,.13),(.003,.001,.024),aluminium)
for x,z,size in [(.082,.106,.01),(.104,.108,.013),(.12,.132,.008),(.021,.115,.009)]:
 box('IC package',(x,.063,z),(size,.0017,size*.7),chipmat,.0001)
 for j in range(6):
  for side in [-1,1]:box('IC lead',(x-size*.4+j*size*.16,.0627,z+side*size*.43),(.0007,.0004,.002),aluminium,0)
for i in range(9):box('Surface component',(.075+i*.006,.063,.138),(.0022,.0017,.0028),gold,.00015)
coilrot=Matrix((r,u,n)).transposed().to_quaternion();coilcenter=P((.105,.08,.123))
bpy.ops.mesh.primitive_cylinder_add(vertices=80,radius=.024,depth=.001,location=coilcenter);o=bpy.context.object;o.name='Coil ferrite';o.rotation_mode='QUATERNION';o.rotation_quaternion=coilrot;o.data.materials.append(rubber);electronics.append(o)
curve=bpy.data.curves.new('Copper spiral','CURVE');curve.dimensions='3D';curve.bevel_depth=.00029;curve.bevel_resolution=2;sp=curve.splines.new('POLY');sp.points.add(1700)
for i,pt in enumerate(sp.points):
 t=i/1700;angle=t*17*math.tau;radius=.009+t*.014;v=coilrot@Vector((radius*math.cos(angle),radius*math.sin(angle),.0008))+coilcenter;pt.co=(*v,1)
o=bpy.data.objects.new('Copper coil',curve);s.collection.objects.link(o);curve.materials.append(copper);electronics.append(o)
# Studio: actual reflections, refraction and soft contact shadows are baked into the film.
world=bpy.data.worlds.new('SANGRE studio');world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.055,.065,.057,1);world.node_tree.nodes['Background'].inputs[1].default_value=.4;s.world=world
floor=material('Charcoal studio',(.008,.012,.009),.05,.55);bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.0257));bpy.context.object.data.materials.append(floor)
def aim(o,target):o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
def light(name,pos,power,size,target):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=pos;aim(o,target)
light('Large softbox',(-.23,.12,.40),18,.34,(0,0,.04));light('Strip rim',(.22,-.16,.30),24,.22,(0,0,.05));light('Front fill',(.08,.34,.18),6,.3,(0,0,.035))
bpy.ops.object.camera_add();cam=bpy.context.object;s.camera=cam;cam.data.lens=52;cam.data.clip_start=.002;cam.data.clip_end=1000;cam.data.dof.use_dof=False
base_locations={o.name:o.location.copy() for o in parts.values()}
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
def pose(frame):
 t=(frame-1)/24;opening=smooth((t-1.3)/2.4);travel=smooth((t-4.4)/1.2);exit=smooth((t-6.2)/1);explode=smooth((t-7.0)/2.4)
 leave=smooth((t-6.8)/1.2);rig.location=hinge+Vector((-.045*leave,0,.012*opening+.22*leave));panels[1].rotation_euler.x=math.radians(-103)*(1-opening);ui_mix.inputs[0].default_value=smooth((opening-.68)/.3)
 for name,o in parts.items():o.location=base_locations[name].copy()
 parts['upper-shell'].location.z+=explode*.066;parts['screen-retainer'].location.z+=explode*.088;cover=smooth((t-3.65)/.7);parts['storage-lid'].location+=Vector((-.033*cover,-.045*cover,.100*cover));mix.inputs[0].default_value=smooth((t-7)/1.4)
 strip.location=P((.019,.20-.065*travel+.12*exit,.124));strip.rotation_euler.z=math.radians(-8)*(1-travel);strip.hide_render=t<4.2 or t>7.3
 for o in strip.children:o.hide_render=strip.hide_render
 # The display leaves the structure area after its unfolding demonstration.
 for o in [*panels,*[child for panel in panels for child in panel.children]]:o.hide_render=t>8.2
 yaw=.17+.06*smooth(t/4)-.025*explode;target=Vector((0,0,.025+.036*explode));cam.location=target+(Vector((yaw,.27+.075*explode,.18+.04*explode))-target)*1.23;aim(cam,target);s.frame_set(frame)
pose(1);bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'sangre-scene.blend'))
(OUT/'metadata.json').write_text(json.dumps({'fps':24,'frames':288,'duration':12,'stages':[0,1.3,4.4,7.0],'render_engine':'Cycles','motion_samples':s.cycles.samples,'held_frame_samples':96,'width':s.render.resolution_x,'height':s.render.resolution_y,'mechanical_geometry':'user CAD','electronics':'reference-derived illustration','fold_hinge':'presentation rig inferred from supplied folded and flat states'},indent=2))
frames=[int(x) for x in a.frames.split(',')] if a.frames else ([1,91,137,240] if a.preview else range(1,289))
for f in frames:
 target=OUT/('frame-%04d.png'%f)
 if target.exists():continue
 if f>240 and (OUT/'frame-0240.png').exists():shutil.copyfile(OUT/'frame-0240.png',target);continue
 s.cycles.samples=max(a.samples,96) if f==240 else (20 if a.preview else a.samples)
 pose(f);s.render.filepath=str(target);start=time.time();bpy.ops.render.render(write_still=True);print('FRAME_DONE',f,round(time.time()-start,2),flush=True)

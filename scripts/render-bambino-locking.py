"""Render chapter 04 from the supplied V2, preserving the source blend.
blender -b --factory-startup --python scripts/render-bambino-locking.py -- --preview
The hand and portafilter are explanatory geometry, fitted to the user's operation
video and prototype photos; neither asserts OEM tolerances or force validation.
"""
import argparse, json, math, sys, shutil
from pathlib import Path
import bpy
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--preview', action='store_true')
p.add_argument('--frames', default='')
p.add_argument('--output', default=str(ROOT / 'tmp' / 'bambino-locking-render'))
p.add_argument('--samples', type=int, default=80)
p.add_argument('--width', type=int, default=1600)
a = p.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
OUT = Path(a.output).resolve(); OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'art/bambino/material-study.blend'))
s = bpy.context.scene
s.render.engine = 'CYCLES'
s.cycles.samples = 24 if a.preview else a.samples
s.cycles.use_denoising = True
s.cycles.denoiser = "OPTIX"
s.cycles.denoising_use_gpu = True
s.cycles.use_adaptive_sampling = True
s.cycles.adaptive_threshold = .025 if a.preview else .008
s.cycles.use_animated_seed = False
s.cycles.seed = 31
s.cycles.max_bounces = 8
s.cycles.transmission_bounces = 6
s.cycles.transparent_max_bounces = 12
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
for d in prefs.devices: d.use = d.type == 'OPTIX'
s.cycles.device = 'GPU'
s.render.resolution_x = 960 if a.preview else a.width
s.render.resolution_y = int(s.render.resolution_x * .75)
s.render.resolution_percentage = 100
s.render.fps = 30; s.frame_start = 1; s.frame_end = 300
s.render.image_settings.file_format = 'PNG'; s.render.image_settings.color_mode = 'RGB'
s.render.image_settings.color_depth = '8'; s.render.image_settings.compression = 20
s.render.film_transparent = False
s.render.use_persistent_data = True
s.view_settings.view_transform = 'AgX'
s.view_settings.look = 'AgX - Medium High Contrast'
s.view_settings.exposure = -1.1

# Keep the approved product materials and geometry. Hide the distant tank from
# this close-up only: it is outside the narrative and outside the camera framing.
for o in list(s.objects):
 if o.type == 'LIGHT' or o.name.startswith('STUDIO'):
  bpy.data.objects.remove(o, do_unlink=True)

def mat(name, color, metallic=0, roughness=.3):
 m=bpy.data.materials.new(name);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Metallic'].default_value=metallic;bs.inputs['Roughness'].default_value=roughness
 return m
steel=mat('LOCK / brushed basket',(.37,.40,.39),1,.24)
polish=mat('LOCK / edge steel',(.6,.62,.61),1,.16)
grip=mat('LOCK / grip polymer',(.012,.016,.014),0,.3)
# A translucent neutral hand; no green emission, opaque bones or skin texture.
ghost=bpy.data.materials.new('LOCK / translucent explanatory hand');ghost.use_nodes=True
nodes=ghost.node_tree.nodes;nodes.clear();out=nodes.new('ShaderNodeOutputMaterial');mix=nodes.new('ShaderNodeMixShader');mix.inputs[0].default_value=.17
trans=nodes.new('ShaderNodeBsdfTransparent');bs=nodes.new('ShaderNodeBsdfPrincipled');bs.inputs['Base Color'].default_value=(.08,.13,.105,1);bs.inputs['Roughness'].default_value=.42
for source,socket in [(trans,1),(bs,2)]:ghost.node_tree.links.new(source.outputs[0],mix.inputs[socket])
ghost.node_tree.links.new(mix.outputs[0],out.inputs[0])
world=bpy.data.worlds.new('LOCK / dark studio');world.use_nodes=True;s.world=world
world.node_tree.nodes['Background'].inputs[0].default_value=(.045,.055,.047,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.35

def aim(o, target):o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,position,power,size,target,size_y=None):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='RECTANGLE';d.size=size;d.size_y=size_y or size
 o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=position;aim(o,target);return o
center=Vector((-.0404,-.1944,-.105))
support=Vector((-.034,-.254,-.091))
area('LOCK / key',(-.35,-.55,.35),22,.45,center,.6)
area('LOCK / rim',(.27,.04,.22),28,.26,center,.5)
area('LOCK / front',(.15,-.7,.02),12,.32,center,.48)
area('LOCK / fill',(-.3,-.18,-.18),4,.22,center,.25)
# Camera from the user's left-front detail angle, with the support clear of the grip.
bpy.ops.object.camera_add(location=(-.285,-.68,.015))
cam=bpy.context.object;cam.name='LOCK / detail camera';cam.data.lens=72;cam.data.clip_start=.005;cam.data.clip_end=20
focus=Vector((-.043,-.245,-.121));aim(cam,focus);s.camera=cam
cam.data.dof.use_dof=False  # Keep the thumb, basket and support in focus while scrubbing.

# Lathed grip and basket retain the rounded grip/chrome end seen in the photos.
bpy.ops.object.empty_add();handle=bpy.context.object;handle.name='LOCK / portafilter movement'
def lathe(name,profile,material,axis='z',origin=(0,0,0),segments=80,parent=handle):
 verts=[]
 for radius,length in profile:
  for j in range(segments):
   t=j*math.tau/segments
   v=(radius*math.cos(t),radius*math.sin(t),length) if axis=='z' else (radius*math.cos(t),length,radius*math.sin(t))
   verts.append(tuple(Vector(v)+Vector(origin)))
 faces=[]
 for i in range(len(profile)-1):
  for j in range(segments):faces.append((i*segments+j,i*segments+(j+1)%segments,(i+1)*segments+(j+1)%segments,(i+1)*segments+j))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);s.collection.objects.link(o);o.data.materials.append(material);o.parent=parent
 for f in mesh.polygons:f.use_smooth=True
 return o
lathe('LOCK / basket',[(0,-.023),(.022,-.023),(.027,-.018),(.029,-.005),(.029,0),(.027,0),(.026,-.004),(.024,-.018),(0,-.020)],steel)
lathe('LOCK / basket rim',[(.029,-.005),(.031,-.003),(.031,0),(.029,.001)],polish)
lathe('LOCK / neck',[(.008,-.023),(.009,-.030),(.01,-.053)],polish,'y',(0,0,-.013))
lathe('LOCK / black handle',[(.009,-.043),(.013,-.048),(.015,-.061),(.0155,-.09),(.016,-.138),(.016,-.157),(.014,-.162),(0,-.163)],grip,'y',(0,0,-.013))
lathe('LOCK / handle end',[(.014,-.157),(.016,-.159),(.016,-.165),(.014,-.167),(0,-.167)],polish,'y',(0,0,-.013))

def smooth(v):v=max(0,min(1,v));return v*v*(3-2*v)
def motion(frame):
 t=(frame-1)/30
 lift=smooth((t-.7)/2.1);turn=smooth((t-3.1)/3.4);leave=smooth((t-8.1)/1.3)
 angle=math.radians(-42+30*turn)
 z=-.042*(1-lift)
 return angle,z,leave

def transform(v,angle,origin):
 c=math.cos(angle);sn=math.sin(angle);return Vector((v[0]*c-v[1]*sn,v[0]*sn+v[1]*c,v[2]))+origin

# MIT-licensed WebXR right hand: clean anatomical topology, fitted with
# independent joint transforms to the photographed grip (no skin textures).
existing=set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'art/bambino/hand/right.glb'))
imported=[o for o in bpy.data.objects if o not in existing]
rig=next(o for o in imported if o.type=='ARMATURE')
for o in imported:
 if o.type=='MESH':
  if o.name.startswith('Icosphere'):bpy.data.objects.remove(o,do_unlink=True);continue
  o.data.materials.clear();o.data.materials.append(ghost)
  for poly in o.data.polygons:poly.use_smooth=True
  sub=o.modifiers.new('Smooth anatomical silhouette','SUBSURF');sub.levels=2;sub.render_levels=2
  if hasattr(o,'visible_shadow'):o.visible_shadow=False
rest={b.name:b.head_local.copy() for b in rig.data.bones}
wrist=rest['wrist']
# Original hand axes: X normal to palm, Y across fingers, -Z toward fingers.
basis=Matrix(((0,.6,.8),(0,.8,-.6),(-1,0,0)))
chains={}
for finger in ['index','middle','ring','pinky']:
 chains[finger]=[finger+'-finger-'+suffix for suffix in ['metacarpal','phalanx-proximal','phalanx-intermediate','phalanx-distal','tip']]
chains['thumb']=['thumb-metacarpal','thumb-phalanx-proximal','thumb-phalanx-distal','thumb-tip']

def pose_hand(frame):
 angle,z,leave=motion(frame)
 release=smooth(((frame-1)/30-7.7)/.65)
 origin=center+Vector((.14*leave,-.15*leave,z-.04*leave))
 rot=Matrix.Rotation(angle,3,'Z')
 base=rot@basis
 wrist_local=Vector((.097,-.143,-.029))
 target_wrist=transform(wrist_local,angle,origin)
 def palm(v):return target_wrist+base@((v-wrist)*.94)
 def tr(v):return transform(v,angle,origin)
 targets={'wrist':target_wrist}
 for idx,finger in enumerate(['index','middle','ring','pinky']):
  names=chains[finger];y=-.061-idx*.020
  targets[names[0]]=palm(rest[names[0]])
  points=[(.029-idx*.002,y,-.025),(-.009,y,-.031),(-.021,y,-.011),(-.011,y,.005)]
  for j,(name,point) in enumerate(zip(names[1:],points)):
   closed=tr(point);opened=palm(rest[name])
   targets[name]=closed.lerp(opened,release*.24)
 names=chains['thumb'];targets[names[0]]=palm(rest[names[0]])
 targets[names[1]]=tr((.048,-.053,-.003))
 lift=smooth(((frame-1)/30-.9)/2.0)
 target_tip=support+Vector((.006,0,.004))
 free=tr((.037,-.023,.008))
 tip=free.lerp(target_tip,lift*(1-release))
 targets[names[2]]=tr((.026,-.039,.013)).lerp(tip+Vector((.014,-.004,-.003)),lift*(1-release))
 targets[names[3]]=tip
 nexts={names[j]:names[j+1] for names in chains.values() for j in range(len(names)-1)}
 prevs={names[-1]:names[-2] for names in chains.values()}
 for bone in rig.pose.bones:
  name=bone.name;r=base@bone.bone.matrix_local.to_3x3()
  if name in nexts:
   n=nexts[name];src=(base@(rest[n]-rest[name])).normalized();dst=(targets[n]-targets[name]).normalized();r=src.rotation_difference(dst).to_matrix()@r
  elif name in prevs:
   n=prevs[name];src=(base@(rest[name]-rest[n])).normalized();dst=(targets[name]-targets[n]).normalized();r=src.rotation_difference(dst).to_matrix()@r
  bone.matrix=Matrix.Translation(targets[name])@r.to_4x4()@Matrix.Scale(.94,4)
  bone.keyframe_insert('location',frame=frame);bone.keyframe_insert('rotation_quaternion',frame=frame);bone.keyframe_insert('scale',frame=frame)
for frame in range(1,301):pose_hand(frame)
for frame in range(1,301):
 angle,z,_=motion(frame);handle.location=center+Vector((0,0,z));handle.rotation_euler=(0,0,angle)
 handle.keyframe_insert('location',frame=frame);handle.keyframe_insert('rotation_euler',frame=frame)
# Camera projected hotspot, used by crisp HTML labels in both locales.
s.frame_set(100);pt=world_to_camera_view(s,cam,support)
(OUT/'metadata.json').write_text(json.dumps({'fps':30,'frames':300,'duration':10,'support':[round(pt.x,4),round(1-pt.y,4)],'stages':[0,3.1,6.5]},indent=2))
s.render.filepath=str(OUT/'frame-')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'locking-scene.blend'))
frames=[int(f) for f in a.frames.split(',')] if a.frames else ([1,120,220] if a.preview else range(1,301))
previous_state=None
previous_path=None
for frame in frames:
 t=(frame-1)/30
 state=(*motion(frame),smooth((t-.9)/2.0),smooth((t-7.7)/.65))
 path=OUT/('frame-%04d.png'%frame)
 if state==previous_state:
  shutil.copyfile(previous_path,path)
 else:
  s.frame_set(frame);s.render.filepath=str(path);bpy.ops.render.render(write_still=True)
 previous_state=state;previous_path=path


"""Export the authored V2 and make reference-only interaction geometry.
Run: blender -b --python scripts/build-bambino-assets.py
"""
import bpy, math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'public'/'bambino'
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'art'/'bambino'/'material-study.blend'))
product=[o for o in bpy.context.scene.objects if o.type=='MESH' and not o.name.startswith('STUDIO')]
for m in bpy.data.materials:
 if not m.name.startswith('V2 /'):continue
 name=m.name;m.node_tree.nodes.clear();n=m.node_tree.nodes;p=n.new('ShaderNodeBsdfPrincipled');output=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs[0],output.inputs[0])
 p.inputs['Base Color'].default_value=(.56,.56,.56,1);p.inputs['Metallic'].default_value=1;p.inputs['Roughness'].default_value=.25
 if 'polished' in name:p.inputs['Roughness'].default_value=.09
 if 'clear' in name:
  p.inputs['Base Color'].default_value=(1,1,1,1);p.inputs['Metallic'].default_value=0;p.inputs['Transmission Weight'].default_value=1;p.inputs['IOR'].default_value=1.49;p.inputs['Roughness'].default_value=.035
 if 'black' in name or 'charcoal' in name:
  p.inputs['Base Color'].default_value=(.006,.007,.006,1);p.inputs['Metallic'].default_value=0;p.inputs['Roughness'].default_value=.27
 if 'red float' in name:p.inputs['Base Color'].default_value=(.45,.004,.003,1);p.inputs['Metallic'].default_value=0
for o in product:
 uv=o.data.uv_layers.new(name='BrushUV') if not o.data.uv_layers else o.data.uv_layers.active
 for f in o.data.polygons:
  normal=o.matrix_world.to_3x3()@f.normal
  for index in f.loop_indices:
   v=o.matrix_world@o.data.vertices[o.data.loops[index].vertex_index].co
   uv.data[index].uv=(v.y*4 if abs(normal.x)>.5 else v.x*4, v.z*4 if abs(normal.z)<.9 else v.y*4)
def export(path,objects):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_animations=False)
export(OUT/'bambino-v2.glb',product)
# The following models are deliberately labeled as reference approximations.
bpy.ops.wm.read_factory_settings(use_empty=True)
def material(name,color,metal=0,rough=.3):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough;return m
steel=material('Reference stainless',(.55,.55,.55),1,.24);polished=material('Reference polished',(.65,.65,.65),1,.1);black=material('Reference black',(.01,.01,.01));clear=material('Reference tank',(1,1,1),0,.06);p=clear.node_tree.nodes.get('Principled BSDF');p.inputs['Transmission Weight'].default_value=1;p.inputs['IOR'].default_value=1.49
objects=[]
def cube(name,loc,size,mat,bevel=.008):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
 mod=o.modifiers.new('Soft manufactured edges','BEVEL');mod.width=bevel;mod.segments=5;o.modifiers.new('Surface normals','WEIGHTED_NORMAL');objects.append(o);return o
def cylinder(name,loc,radius,depth,mat,rot=None):
 bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=radius,depth=depth,location=loc);o=bpy.context.object;o.name=name;o.data.materials.append(mat)
 if rot:o.rotation_euler=rot
 for f in o.data.polygons:f.use_smooth=True
 mod=o.modifiers.new('Machined edges','BEVEL');mod.width=.001;mod.segments=3;o.modifiers.new('Surface normals','WEIGHTED_NORMAL');objects.append(o);return o
def tube(name,points,radius,mat):
 cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.bevel_depth=radius;cu.bevel_resolution=4;sp=cu.splines.new('BEZIER');sp.bezier_points.add(len(points)-1)
 for b,pt in zip(sp.bezier_points,points):b.co=pt;b.handle_left_type='AUTO';b.handle_right_type='AUTO'
 o=bpy.data.objects.new(name,cu);bpy.context.collection.objects.link(o);o.data.materials.append(mat);objects.append(o);return o
cube('Original / lower body',(0,.005,.014),(.16,.275,.028),black,.012)
cube('Original / rear body',(0,.075,.155),(.15,.1,.28),steel,.025)
cube('Original / brew housing',(0,-.045,.25),(.155,.16,.11),steel,.025)
cube('Original / tray',(0,-.06,.038),(.148,.17,.018),polished,.025)
cube('Original / removable tank',(0,.143,.163),(.126,.05,.26),clear,.012)
cube('Original / tank lid',(0,.143,.30),(.13,.053,.009),black,.008)
for i in range(9):cube('Original / grille slot '+str(i),(0,-.12+i*.014,.048),(.11,.004,.0015),black,.001)
for x,z,r in [(-.042,.258,.010),(-.011,.258,.010),(.027,.269,.006),(.027,.247,.006)]:cylinder('Original / front control',(x,-.126,z),r,.004,polished,(math.pi/2,0,0))
cylinder('Original / brew collar',(0,-.07,.193),.035,.018,black)
tube('Original / steam wand',[(.058,-.065,.197),(.065,-.072,.17),(.065,-.103,.155),(.069,-.12,.065)],.004,polished)
for i in range(5):cube('Original / cup rail '+str(i),(0,-.09+i*.025,.307),(.12,.002,.002),polished,.001)
export(OUT/'bambino-original-reference.glb',objects)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art'/'bambino'/'original-reference.blend'))
# A nominal 54 mm basket and handle for motion explanation; not an OEM CAD asset.
bpy.ops.wm.read_factory_settings(use_empty=True);objects=[]
steel=material('Basket stainless',(.65,.65,.65),1,.12);black=material('Handle polymer',(.012,.012,.012),0,.32)
# Open basket with inner and outer walls.
verts=[];rings=[(.029,0),(.029,-.020),(.025,-.027),(.023,-.025),(.027,-.019),(.027,0)]
for r,z in rings:
 for j in range(64):a=j*math.tau/64;verts.append((r*math.cos(a),r*math.sin(a),z))
faces=[]
for i in range(len(rings)):
 for j in range(64):faces.append((i*64+j,i*64+(j+1)%64,((i+1)%len(rings))*64+(j+1)%64,((i+1)%len(rings))*64+j))
mesh=bpy.data.meshes.new('54mm basket');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('54 mm basket / nominal reference',mesh);bpy.context.collection.objects.link(o);o.data.materials.append(steel);objects.append(o)
for f in mesh.polygons:f.use_smooth=True
cylinder('Handle / metal neck',(0,-.036,-.012),.009,.035,steel,(math.pi/2,0,0))
cube('Handle / grip',(0,-.091,-.013),(.025,.087,.026),black,.009)
for x in [-.029,.029]:cube('Basket / support ear',(x,0,-.005),(.007,.015,.004),steel,.001)
export(OUT/'portafilter-reference.glb',objects)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art'/'bambino'/'portafilter-reference.blend'))

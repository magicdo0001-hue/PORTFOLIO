"""Prepare the user's KeyShot exterior and CAD exploded assembly for the existing Aether renderer.
Run with Blender --background --python scripts/prepare-sangre.py. Source files remain untouched.
"""
from pathlib import Path
import json, math
import bpy
import numpy as np
from mathutils import Vector, Matrix

ROOT = Path(__file__).resolve().parents[1]
PORTFOLIO = ROOT.parents[1]
OUT = ROOT / 'public/assets/sangre'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath='E:/Codex File/三视图+特写.glb')
main = bpy.data.objects['最终']
strip_source = bpy.data.objects['测试条，带活动部件版']
flat_source = bpy.data.objects['屏幕展平']
inverse = main.matrix_world.inverted()
points = [inverse @ (o.matrix_world @ v.co) for o in main.children_recursive if o.type == 'MESH' for v in o.data.vertices]
lo = Vector([min(p[i] for p in points) for i in range(3)])
hi = Vector([max(p[i] for p in points) for i in range(3)])
center = (lo + hi) * .5

def group(name):
    o = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(o)
    return o

root = group('sangre')
exterior = group('exterior'); exterior.parent = root
strip = group('test-strip'); strip.parent = root
flat = group('flat-source'); flat.parent = root
kept = [root, exterior, strip, flat]
screen = None
folded_bezel = None
for source, target in [(main, exterior), (strip_source, strip), (flat_source, flat)]:
    for i, o in enumerate(list(source.children_recursive)):
        if o.type != 'MESH':
            continue
        transform = inverse @ o.matrix_world
        mesh = o.data.copy()
        for v in mesh.vertices:
            v.co = (transform @ v.co - center) * .001
        o.data = mesh
        o.parent = target
        o.matrix_world = Matrix.Identity(4)
        original_name = o.name
        o.name = target.name + '-' + str(i)
        material_name = mesh.materials[0].name if mesh.materials else ''
        # The 90-gloss plane is the rear panel (engineering drawing: Back view).
        # The thin .016 panel faces the front; .014 is its original graphite bezel.
        if source == main and '20光泽' in material_name and original_name.endswith('.016'):
            screen = o; o.name = 'folded-screen-source'
        if source == main and '20光泽' in material_name and original_name.endswith('.014'):
            folded_bezel = o
        if '白色坚硬' in material_name:
            o.name = 'outer-shell'
        elif '40光泽' in material_name:
            o.name = 'base-shell'
        elif '半透明塑料 #2' in material_name:
            o.name = 'storage-lid'
        elif '半透明塑料 #1' in material_name:
            o.name = 'storage-tray'
        # CAD tessellation is dense; retain silhouette and custom normals while reducing hidden detail.
        if len(mesh.polygons) > 12000:
            bpy.context.view_layer.objects.active = o
            mod = o.modifiers.new('Web tessellation', 'DECIMATE')
            mod.ratio = .38 if o.name == 'outer-shell' else .55
            bpy.ops.object.modifier_apply(modifier=mod.name)
        kept.append(o)

assert screen is not None, 'Expected the front display surface from the supplied KeyShot scene'
# Make a local coordinate frame from the actual screen surface, rather than guess its orientation.
coords = np.array([tuple(v.co) for v in screen.data.vertices])
_, eig = np.linalg.eigh(np.cov(coords.T))
normal = Vector(eig[:, 0]); normal *= 1 if normal.y > 0 else -1
assert normal.y > .6 and normal.z > .6, 'Front display must face native +Y/up, not the rear -Y panel'
right = Vector((1, 0, 0)); right = (right - normal * right.dot(normal)).normalized()
up = normal.cross(right).normalized()
if up.z < 0:
    up = -up; right = -right
projected = np.array([[Vector(v).dot(right), Vector(v).dot(up), Vector(v).dot(normal)] for v in coords])
minimum, maximum = projected.min(0), projected.max(0)
screen_center = right * float((minimum[0]+maximum[0])*.5) + up * float((minimum[1]+maximum[1])*.5) + normal * float(maximum[2]+.0002)
width = float(maximum[0]-minimum[0])
compact_height = float(maximum[1]-minimum[1])
flat_pixels = next(o for o in flat.children if '100光泽' in o.data.materials[0].name)
flat_coords = np.array([tuple(v.co) for v in flat_pixels.data.vertices])
_, flat_axes = np.linalg.eigh(np.cov(flat_coords.T))
flat_projected = flat_coords @ flat_axes
half_height = float((flat_projected.max(0)-flat_projected.min(0)).max() * .5)
screen.hide_render = True
if folded_bezel:
    folded_bezel.hide_render = True

def material(name, color, rough=.3, metal=0):
    m = bpy.data.materials.new(name); m.diffuse_color = (*color, 1)
    m.use_nodes = True
    shader = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = rough
    shader.inputs['Metallic'].default_value = metal
    return m

def mesh_object(name, vertices, faces, mat, parent):
    m = bpy.data.meshes.new(name); m.from_pydata(vertices, [], faces); m.update()
    o = bpy.data.objects.new(name, m); bpy.context.scene.collection.objects.link(o)
    o.parent = parent; m.materials.append(mat); kept.append(o)
    return o

bezel_mat = material('Display graphite', (.008, .012, .016), .25)
display = group('display-rig'); display.parent = root
display.location = screen_center + up * (compact_height * .5)
display.rotation_euler = Matrix((right, up, normal)).transposed().to_euler()
kept.append(display)
panels = []
for upper in [False, True]:
    panel = group('display-upper' if upper else 'display-lower'); panel.parent = display; kept.append(panel)
    y0, y1 = (0, half_height) if upper else (-half_height, 0)
    # The supplied front surface determines dimensions and tilt. The finite thickness keeps edge highlights visible.
    verts = [(x,y,z) for z in [-.002,0] for y in [y0,y1] for x in [-width*.5,width*.5]]
    box = mesh_object(panel.name+'-bezel', verts, [(0,2,3,1),(4,5,7,6),(0,1,5,4),(2,6,7,3),(0,4,6,2),(1,3,7,5)], bezel_mat, panel)
    bevel = box.modifiers.new('Display edge', 'BEVEL'); bevel.width = .0018; bevel.segments = 3
    bpy.context.view_layer.objects.active = box; bpy.ops.object.modifier_apply(modifier=bevel.name)
    # UI texture is inserted by the existing runtime loader, including the folded/expanded transition.
    pad=.0035; px0=-width*.5+pad;px1=width*.5-pad
    py0=y0 if upper else y0+pad;py1=y1-pad if upper else y1
    pixels = mesh_object(panel.name+'-pixels', [(px0,py0,.0001),(px1,py0,.0001),(px1,py1,.0001),(px0,py1,.0001)], [(0,1,2,3)], material(panel.name+'-UI',(1,1,1),.8), panel)
    uv = pixels.data.uv_layers.new(name='UVMap')
    for polygon in pixels.data.polygons:
        for li in polygon.loop_indices:
            v=pixels.data.vertices[pixels.data.loops[li].vertex_index].co
            uv.data[li].uv=((v.x-px0)/(px1-px0),(v.y-py0)/(py1-py0))
    panels.append(panel)
panels[1].rotation_euler.x = math.pi
display.scale.y = compact_height / half_height

# Infer only a straight translation from the recorded gesture. No latch or dosing animation is invented.
strip_points=np.array([tuple(v.co) for o in strip.children for v in o.data.vertices])
values, vectors=np.linalg.eigh(np.cov(strip_points.T)); travel=Vector(vectors[:, -1]);travel.z=0;travel.normalize()
if travel.y>0:travel=-travel

excluded = {o for o in bpy.data.objects if o not in kept or o in [screen, folded_bezel] or o.parent == flat or o == flat}
kept = [o for o in kept if o not in excluded]
for o in list(bpy.data.objects):
    if o in excluded:
        bpy.data.objects.remove(o, do_unlink=True)
# Existing exploded CAD is a second representation for the interior chapter.
before=set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=str(PORTFOLIO/'art/sangre/source/assembly-exploded.glb'))
imported=set(bpy.data.objects)-before
cadparts=[o for o in imported if o.type=='MESH']
cad_points=[o.matrix_world@v.co for o in cadparts if any(k in o.name for k in ['上盖','下盖']) for v in o.data.vertices]
cad_lo=Vector([min(v[i]for v in cad_points)for i in range(3)]);cad_hi=Vector([max(v[i]for v in cad_points)for i in range(3)]);cad_center=(cad_lo+cad_hi)*.5
interior=group('interior');interior.parent=root
ivory=material('Ivory enclosure',(.70,.66,.55),.27)
rubber=material('Silicone',(.014,.02,.024),.7)
metal=material('Satin aluminium',(.46,.50,.54),.28,.88)
battery=material('18650 sleeve',(.08,.27,.07),.38)
clear=material('Clear storage cover',(.93,.97,1),.08)
shader=next(n for n in clear.node_tree.nodes if n.type=='BSDF_PRINCIPLED');shader.inputs['Transmission Weight'].default_value=1;shader.inputs['IOR'].default_value=1.47
for o in cadparts:
    if '屏幕' in o.name:
        continue
    world=o.matrix_world.copy();m=o.data.copy()
    for v in m.vertices:v.co=world@v.co-cad_center
    o.data=m;o.parent=interior;o.matrix_world=Matrix.Identity(4)
    role='internal-'+o.name
    for key,name in [('上盖','upper-shell'),('下盖','lower-shell'),('18650','battery'),('光度计','photometer'),('覆盖','storage-cover'),('垫板','pads'),('固定','retainer'),('开关','switch')]:
        if key in o.name:role='internal-'+name;break
    o.name=role;m.materials.clear();m.materials.append(battery if role.endswith('battery') else metal if role.endswith('photometer') else clear if role.endswith('cover') else rubber if role.endswith(('pads','switch','retainer')) else ivory)
    kept.append(o)
for o in imported:
    if o not in kept:bpy.data.objects.remove(o,do_unlink=True)
kept.append(interior)
bpy.ops.object.select_all(action='DESELECT')
for o in kept:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'sangre-display.glb'),export_format='GLB',use_selection=True,export_cameras=False,export_lights=False,export_animations=False,export_extras=True)
metadata={'source':'User KeyShot GLB and exploded CAD','travel':[travel.x,travel.z,-travel.y],'stripEndOffset':.040,'sampleLevelOffset':.0021,'screenWidth':width,'panelHeight':half_height,'compactHeight':compact_height,'screenUp':[up.x,up.z,-up.y],'screenFront':[normal.x,normal.z,-normal.y],'screenCenter':[screen_center.x,screen_center.z,-screen_center.y],'screenSource':'最终.016 front; 最终.012 rear retained without UI','geometry':'user CAD exterior/interior; presentation display rig','folding':'presentation interpolation between differently sized supplied folded/flat end states, not manufacturing hinge simulation','ui':'illustrative design UI, not validated clinical readings','bytes':(OUT/'sangre-display.glb').stat().st_size}
(OUT/'metadata.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf-8')
assert width>.03 and half_height>.02
assert len([o for o in interior.children if o.type=='MESH'])>=7
assert abs(travel.z)<1e-6
print('SANGRE_PREPARED',json.dumps(metadata))

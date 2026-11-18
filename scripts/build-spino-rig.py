import bpy
import os
import math
import json
import shutil
from collections import defaultdict
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, '.tmp-assets', 'spino-bind', 'spineBind.fbx')
TEX = os.path.join(ROOT, '.tmp-assets', 'spino', 'textures')
WORK = os.path.join(ROOT, '.tmp-assets', 'spino-rigged')
PUBLIC = os.path.join(ROOT, 'public', 'assets', 'model', 'spinosaurus')
RENDERS = os.path.join(ROOT, '.tmp-assets', 'spino-bind', 'rig')
os.makedirs(WORK, exist_ok=True)
os.makedirs(RENDERS, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=SRC, use_anim=True, use_custom_normals=True)
bpy.context.view_layer.update()

for name in ('low',):
    obj = bpy.data.objects.get(name)
    if obj:
        bpy.data.objects.remove(obj, do_unlink=True)
for obj in list(bpy.context.scene.objects):
    if obj.type == 'EMPTY':
        bpy.data.objects.remove(obj, do_unlink=True)

high = bpy.data.objects.get('high')
teeth_top = bpy.data.objects.get('teethtop1')
teeth_bot = bpy.data.objects.get('teethbot1')
claws = bpy.data.objects.get('claws')
if not high:
    raise RuntimeError('Bind-pose high mesh is missing')

for obj in (high, teeth_top, teeth_bot, claws):
    if obj:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        obj.select_set(False)
        # FBX custom split normals force the exporter to duplicate a vertex for
        # almost every triangle. The sculpt is organic, so smooth shared normals
        # preserve the look and cut the web payload roughly in half.
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.mesh.customdata_custom_splitnormals_clear()
        for edge in obj.data.edges:
            edge.use_edge_sharp = False
        bpy.ops.object.shade_smooth()
        obj.select_set(False)

mesh = high.data


def load_material(name, filename, roughness):
    image = bpy.data.images.load(os.path.join(TEX, filename), check_existing=True)
    image.name = f'spino-{name}'
    image.colorspace_settings.name = 'sRGB'
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (1, 1, 1, 1)
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = roughness
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = image
    tex.interpolation = 'Linear'
    tex.extension = 'EXTEND'
    tex.location = (-420, 180)
    nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    return mat


SKINS = {
    0: ('head', 'head_filled.jpeg'),
    1: ('body', 'body_filled.jpeg'),
    2: ('tails', 'tails_filled.jpeg'),
    3: ('legs', 'legs_filled.jpeg'),
}
UV = high.data.uv_layers.get('map1')
if UV is None:
    raise RuntimeError('map1 UV layer missing')

high.data.materials.clear()
skin_slots = {}
for tile, (name, filename) in SKINS.items():
    slot = len(high.data.materials)
    high.data.materials.append(load_material(name, filename, 0.56))
    skin_slots[tile] = slot

# Remove the UDIM offset and assign the corresponding independent 4K map.
for poly in mesh.polygons:
    us = [UV.data[li].uv.x for li in poly.loop_indices]
    tile = max(0, min(3, math.floor(sum(us) / len(us))))
    poly.material_index = skin_slots[tile]
    for li in poly.loop_indices:
        u = UV.data[li].uv.x - tile
        UV.data[li].uv.x = max(0.001, min(0.999, u))

# The bind-pose UVs run a few seam loops into the unpainted left edge of the
# leg sheet and the pale bottom edge of the body sheet. Pull those loops onto
# the adjacent painted skin; this removes the pale shoulder/tail-base strips.
for poly in mesh.polygons:
    material = high.data.materials[poly.material_index].name
    if material == 'legs':
        for li in poly.loop_indices:
            if UV.data[li].uv.x < 0.065:
                UV.data[li].uv.x = 0.065
    elif material == 'body' and (high.matrix_world @ poly.center).y > 2.0:
        for li in poly.loop_indices:
            if UV.data[li].uv.y < 0.09:
                UV.data[li].uv.y = 0.09

bits_mat = load_material('bits', 'bits_baseColor.jpeg', 0.42)
for obj in (teeth_top, teeth_bot, claws):
    if not obj:
        continue
    obj.data.materials.clear()
    obj.data.materials.append(bits_mat)
    uv = obj.data.uv_layers.get('DirtSet')
    if uv:
        obj.data.uv_layers.remove(uv)
    if obj.data.uv_layers:
        obj.data.uv_layers.active_index = 0

eye_mat = load_material('eye', 'eye1_baseColor.jpeg', 0.2)


def create_eye(side):
    name = 'Eye.L' if side > 0 else 'Eye.R'
    centre = Vector((side * 0.99, -13.95, 10.58))
    ry, rz = 0.255, 0.225
    segments = 40
    verts = [centre + Vector((side * 0.018, 0, 0))]
    uvs = [(0.5, 0.5)]
    for i in range(segments):
        a = (i / segments) * math.tau
        verts.append(centre + Vector((side * 0.008, math.cos(a) * ry, math.sin(a) * rz)))
        uvs.append((0.5 + math.cos(a) * 0.47, 0.5 + math.sin(a) * 0.47))
    faces = []
    for i in range(segments):
        faces.append((0, 1 + i, 1 + ((i + 1) % segments)))
    eye_mesh = bpy.data.meshes.new(name)
    eye_mesh.from_pydata([v[:] for v in verts], [], faces)
    eye_mesh.materials.append(eye_mat)
    uv_layer = eye_mesh.uv_layers.new(name='map1')
    for loop in eye_mesh.loops:
        uv_layer.data[loop.index].uv = uvs[loop.vertex_index]
    eye_obj = bpy.data.objects.new(name, eye_mesh)
    bpy.context.scene.collection.objects.link(eye_obj)
    bpy.context.view_layer.objects.active = eye_obj
    eye_obj.select_set(True)
    bpy.ops.object.shade_smooth()
    eye_obj.select_set(False)
    return eye_obj


eyes = [create_eye(1), create_eye(-1)]

# Join the skin, teeth, claws and eyes into a single skinned mesh.
bpy.ops.object.select_all(action='DESELECT')
high.select_set(True)
for obj in (teeth_top, teeth_bot, claws, *eyes):
    if obj:
        obj.select_set(True)
bpy.context.view_layer.objects.active = high
bpy.ops.object.join()
high = bpy.context.object
high.name = 'Spinosaurus'
mesh = high.data

# Part per vertex, from the material assigned to its faces.
part_priority = {'eye': 5, 'bits': 4, 'head': 3, 'body': 2, 'tails': 1, 'legs': 0}
material_parts = {}
for i, mat in enumerate(mesh.materials):
    material_parts[i] = mat.name if mat else 'body'

vertex_parts = {}
for poly in mesh.polygons:
    part = material_parts.get(poly.material_index, 'body')
    rank = part_priority.get(part, 0)
    for vi in poly.vertices:
        existing = vertex_parts.get(vi)
        if existing is None or rank > part_priority.get(existing, 0):
            vertex_parts[vi] = part

print('mesh', high.name, 'verts', len(mesh.vertices), 'polys', len(mesh.polygons), 'materials', [m.name for m in mesh.materials])
print('parts', {p: list(vertex_parts.values()).count(p) for p in set(vertex_parts.values())})

# ---------------------------------------------------------------------------
# Skeleton
# ---------------------------------------------------------------------------
# Coordinates are in the applied bind-pose mesh's world space: head at -Y,
# tail at +Y, +Z up, +X the animal's left.
BONES = [
    ('root', (0, 0, 0), (0, 0, 2.5), None, False, False),
    ('hips', (0, 1.8, 10.0), (0, 0.2, 10.2), 'root', False, True),
    ('spine_01', (0, 0.2, 10.2), (0, -3.8, 10.15), 'hips', True, True),
    ('spine_02', (0, -3.8, 10.15), (0, -7.4, 10.2), 'spine_01', True, True),
    ('chest', (0, -7.4, 10.2), (0, -10.2, 10.35), 'spine_02', True, True),
    ('neck', (0, -10.2, 10.35), (0, -12.4, 10.35), 'chest', True, True),
    ('head', (0, -12.4, 10.35), (0, -17.3, 9.8), 'neck', True, True),
    ('jaw', (0, -12.4, 9.55), (0, -17.4, 9.35), 'head', False, True),
    ('tail_01', (0, 3.8, 9.4), (0, 6.0, 9.0), 'hips', False, True),
    ('tail_02', (0, 6.0, 9.0), (0, 8.2, 8.7), 'tail_01', True, True),
    ('tail_03', (0, 8.2, 8.7), (0, 10.6, 8.5), 'tail_02', True, True),
    ('tail_04', (0, 10.6, 8.5), (0, 13.0, 8.25), 'tail_03', True, True),
    ('tail_05', (0, 13.0, 8.25), (0, 15.5, 8.15), 'tail_04', True, True),
    ('tail_06', (0, 15.5, 8.15), (0, 18.0, 8.05), 'tail_05', True, True),
    ('tail_07', (0, 18.0, 8.05), (0, 20.0, 7.7), 'tail_06', True, True),
    ('tail_08', (0, 20.0, 7.7), (0, 21.5, 7.2), 'tail_07', True, True),
    ('thigh.L', (1.9, 1.1, 10.2), (1.95, 0.2, 5.5), 'hips', False, True),
    ('shin.L', (1.95, 0.2, 5.5), (1.65, 1.25, 1.5), 'thigh.L', True, True),
    ('foot.L', (1.65, 1.25, 1.5), (1.8, -0.3, 0.35), 'shin.L', True, True),
    ('toe.L', (1.8, -0.3, 0.35), (1.8, -1.45, 0.2), 'foot.L', True, True),
    ('thigh.R', (-1.9, 1.1, 10.2), (-1.95, 0.2, 5.5), 'hips', False, True),
    ('shin.R', (-1.95, 0.2, 5.5), (-1.65, 1.25, 1.5), 'thigh.R', True, True),
    ('foot.R', (-1.65, 1.25, 1.5), (-1.8, -0.3, 0.35), 'shin.R', True, True),
    ('toe.R', (-1.8, -0.3, 0.35), (-1.8, -1.45, 0.2), 'foot.R', True, True),
    ('upper_arm.L', (2.1, -7.2, 9.0), (2.2, -7.4, 6.4), 'chest', False, True),
    ('forearm.L', (2.2, -7.4, 6.4), (2.15, -8.7, 4.4), 'upper_arm.L', True, True),
    ('hand.L', (2.15, -8.7, 4.4), (2.0, -9.3, 3.7), 'forearm.L', True, True),
    ('upper_arm.R', (-2.1, -7.2, 9.0), (-2.2, -7.4, 6.4), 'chest', False, True),
    ('forearm.R', (-2.2, -7.4, 6.4), (-2.15, -8.7, 4.4), 'upper_arm.R', True, True),
    ('hand.R', (-2.15, -8.7, 4.4), (-2.0, -9.3, 3.7), 'forearm.R', True, True),
]

arm_data = bpy.data.armatures.new('SpinosaurusArmature')
rig = bpy.data.objects.new('SpinosaurusRig', arm_data)
bpy.context.scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='EDIT')
for name, head, tail, parent, connect, deform in BONES:
    bone = arm_data.edit_bones.new(name)
    bone.head = head
    bone.tail = tail
    bone.use_deform = deform
    if parent:
        bone.parent = arm_data.edit_bones[parent]
        bone.use_connect = connect
    direction = (Vector(tail) - Vector(head)).normalized()
    reference = Vector((0, 0, 1)) if abs(direction.z) < 0.94 else Vector((1, 0, 0))
    bone.align_roll(reference)
bpy.ops.object.mode_set(mode='OBJECT')

print('bones', len(rig.data.bones))

segment = {name: (Vector(head), Vector(tail)) for name, head, tail, *_ in BONES}
TAIL = [f'tail_{i:02d}' for i in range(1, 9)]
BODY = ['hips', 'spine_01', 'spine_02', 'chest', 'neck', 'head'] + TAIL[:2]
HEAD = ['neck', 'head', 'jaw']
LEG_ENDS = ['hand.L', 'hand.R', 'toe.L', 'toe.R', 'foot.L', 'foot.R']


def distance_to_segment(point, a, b):
    ab = b - a
    denom = ab.dot(ab)
    if denom < 1e-9:
        return (point - a).length
    t = max(0.0, min(1.0, (point - a).dot(ab) / denom))
    return (point - (a + ab * t)).length


def pick_weights(point, part):
    if part == 'eye':
        return {'head': 1.0}
    if part == 'bits':
        if point.y < -10.5:
            candidates = ['head', 'jaw']
        else:
            candidates = LEG_ENDS
    elif part == 'head':
        candidates = HEAD
    elif part == 'tails':
        candidates = ['hips'] + TAIL
    elif part == 'legs':
        side = 'L' if point.x > 0 else 'R'
        fore = point.y < -4.2
        if fore:
            candidates = ['chest', f'upper_arm.{side}', f'forearm.{side}', f'hand.{side}']
        else:
            candidates = ['hips', f'thigh.{side}', f'shin.{side}', f'foot.{side}', f'toe.{side}']
    else:
        candidates = BODY
        if point.y < -10.2:
            candidates = ['neck', 'chest', 'spine_02']
        elif point.y > 2.0:
            candidates = ['tail_01', 'tail_02', 'hips', 'spine_01']

    scores = []
    for name in candidates:
        a, b = segment[name]
        d = distance_to_segment(point, a, b)
        scores.append((1.0 / ((d + 0.12) ** 3), name))
    scores.sort(reverse=True)
    scores = scores[:3]
    total = sum(w for w, _ in scores)
    if total <= 0:
        return {'hips': 1.0}
    return {name: w / total for w, name in scores}


groups = {}
for name, *_ in BONES:
    if name == 'root':
        continue
    groups[name] = high.vertex_groups.new(name=name)

for vi, vertex in enumerate(mesh.vertices):
    part = vertex_parts.get(vi, 'body')
    weights = pick_weights(vertex.co, part)
    for name, weight in weights.items():
        if name in groups and weight > 0.0001:
            groups[name].add([vi], weight, 'REPLACE')

modifier = high.modifiers.new('SpinosaurusArmature', 'ARMATURE')
modifier.object = rig
modifier.use_vertex_groups = True
high.parent = rig
high.matrix_parent_inverse = rig.matrix_world.inverted()
high.data.update()

print('rigged', high.name, 'bones', len(rig.data.bones), 'groups', len(high.vertex_groups))

# ---------------------------------------------------------------------------
# Rest and deformation preview renders
# ---------------------------------------------------------------------------
scene = bpy.context.scene
world = bpy.data.worlds.new('RigPreviewWorld')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.025, 0.03, 0.028, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.3
scene.world = world
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1000
scene.render.resolution_y = 750
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 86
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'

key_data = bpy.data.lights.new('Key', 'AREA')
key_data.energy = 2800
key_data.shape = 'DISK'
key_data.size = 12
key = bpy.data.objects.new('Key', key_data)
scene.collection.objects.link(key)
key.location = (13, -7, 22)
key.rotation_euler = (Vector((0, 0, 9)) - key.location).to_track_quat('-Z', 'Y').to_euler()

fill_data = bpy.data.lights.new('Fill', 'AREA')
fill_data.energy = 900
fill_data.size = 10
fill = bpy.data.objects.new('Fill', fill_data)
scene.collection.objects.link(fill)
fill.location = (-15, -10, 11)
fill.rotation_euler = (Vector((0, 0, 9)) - fill.location).to_track_quat('-Z', 'Y').to_euler()

rim_data = bpy.data.lights.new('Rim', 'AREA')
rim_data.energy = 2100
rim_data.size = 8
rim = bpy.data.objects.new('Rim', rim_data)
scene.collection.objects.link(rim)
rim.location = (3, 20, 19)
rim.rotation_euler = (Vector((0, 0, 10)) - rim.location).to_track_quat('-Z', 'Y').to_euler()

cam_data = bpy.data.cameras.new('Camera')
cam = bpy.data.objects.new('Camera', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam.data.lens = 58
cam.data.sensor_width = 36

meshes = [o for o in scene.objects if o.type == 'MESH']
corners = []
for obj in meshes:
    for corner in obj.bound_box:
        corners.append(obj.matrix_world @ Vector(corner))
mn = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
mx = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
centre = (mn + mx) * 0.5
size = mx - mn


def set_camera(direction, fraction, target_z):
    target = Vector((centre.x, centre.y, target_z))
    cam.location = target + Vector(direction).normalized() * max(size) * fraction
    cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()


def render(name, direction=(1, -1.1, 0.32), fraction=1.85, target_z=None):
    set_camera(direction, fraction, centre.z + 0.5 if target_z is None else target_z)
    scene.render.filepath = os.path.join(RENDERS, name + '.jpg')
    bpy.ops.render.render(write_still=True)
    print('rendered', scene.render.filepath)


render('rest-three-quarter')
render('rest-side', (1, 0, 0.12), 1.7, centre.z)
render('rest-head', (0.55, -1, 0.22), 0.52, 10.3)

# A deliberately visible test pose: tail sweep, head turn, lifted forelimb.
for pb in rig.pose.bones:
    pb.rotation_mode = 'XYZ'
for i, name in enumerate(TAIL):
    rig.pose.bones[name].rotation_euler[2] = 0.11
rig.pose.bones['neck'].rotation_euler[2] = 0.12
rig.pose.bones['head'].rotation_euler[2] = 0.16
rig.pose.bones['upper_arm.L'].rotation_euler[0] = 0.22
rig.pose.bones['thigh.R'].rotation_euler[0] = -0.16
render('pose-three-quarter')
render('pose-side', (1, 0, 0.12), 1.7, centre.z)

for pb in rig.pose.bones:
    pb.rotation_euler = (0, 0, 0)

bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'spinosaurus-rigged.blend'))

# ---------------------------------------------------------------------------
# Export web asset
# ---------------------------------------------------------------------------
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True)
high.select_set(True)
bpy.context.view_layer.objects.active = rig

out_gltf = os.path.join(WORK, 'spinosaurus-rigged.gltf')
bpy.ops.export_scene.gltf(
    filepath=out_gltf,
    export_format='GLTF_SEPARATE',
    use_selection=True,
    export_yup=True,
    export_apply=False,
    export_texcoords=True,
    export_normals=True,
    export_tangents=False,
    export_materials='EXPORT',
    export_image_format='AUTO',
    export_texture_dir='textures',
    export_cameras=False,
    export_lights=False,
    export_extras=False,
    export_animations=False,
    export_skins=True,
    export_morph=False,
    export_def_bones=False,
    export_all_influences=False,
)
print('exported', out_gltf)

with open(out_gltf, 'r', encoding='utf8') as f:
    data = json.load(f)

map_order = ['head', 'legs', 'body', 'tails', 'bits', 'eye']
files = ['head.webp', 'legs.webp', 'body.webp', 'tails.webp', 'bits.webp', 'eye.webp']
data['images'] = [{'uri': uri} for uri in files]
data['samplers'] = [{'magFilter': 9729, 'minFilter': 9987, 'wrapS': 33071, 'wrapT': 33071}]
data['textures'] = [{'sampler': 0, 'source': i} for i in range(len(files))]

for material in data.get('materials', []):
    name = (material.get('name') or '').lower()
    index = None
    for i, key in enumerate(map_order):
        if key in name:
            index = i
            break
    if index is None:
        index = 0
    material['pbrMetallicRoughness'] = {
        'baseColorTexture': {'index': index},
        'metallicFactor': 0,
        'roughnessFactor': 0.2 if 'eye' in name else 0.56,
    }
    for key in ('normalTexture', 'occlusionTexture', 'emissiveTexture', 'emissiveFactor'):
        material.pop(key, None)
    material['doubleSided'] = 'eye' in name

for key in ('extensionsUsed', 'extensionsRequired'):
    data.pop(key, None)

with open(out_gltf, 'w', encoding='utf8') as f:
    json.dump(data, f, indent=1)

bin_name = data.get('buffers', [{}])[0].get('uri')
if not bin_name:
    raise RuntimeError('No external bin in export')
bin_path = os.path.join(WORK, bin_name)
shutil.copyfile(bin_path, os.path.join(PUBLIC, 'spinosaurus-rigged.bin'))
shutil.copyfile(out_gltf, os.path.join(PUBLIC, 'spinosaurus-rigged.gltf'))
textures_dir = os.path.join(WORK, 'textures')
if os.path.isdir(textures_dir):
    shutil.rmtree(textures_dir)
print('copied public asset', os.path.join(PUBLIC, 'spinosaurus-rigged.gltf'))
print('DONE')

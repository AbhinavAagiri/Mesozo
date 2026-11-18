import bpy
import os
import math
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, '.tmp-assets', 'spino-bind', 'spineBind.fbx')
TEX = os.path.join(ROOT, '.tmp-assets', 'spino', 'textures')
OUT = os.path.join(ROOT, '.tmp-assets', 'spino-bind')
RENDERS = os.path.join(OUT, 'textured')
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
    raise RuntimeError('Missing high mesh')

for obj in (high, teeth_top, teeth_bot, claws):
    if not obj:
        continue
    mesh = obj.data
    if len(mesh.materials) == 0:
        mesh.materials.append(None)

def make_material(name, image_path):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes.get('Principled BSDF')
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.58
    image = bpy.data.images.load(image_path, check_existing=True)
    image.colorspace_settings.name = 'sRGB'
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = image
    tex.interpolation = 'Linear'
    tex.location = (-420, 180)
    nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    return mat, tex

tile_info = {
    0: ('head', 'head_baseColor.jpeg'),
    1: ('body', 'body_baseColor.jpeg'),
    2: ('tails', 'tails_baseColor.jpeg'),
    3: ('legs', 'legs_baseColor.jpeg'),
}
uv = high.data.uv_layers.get('map1')
if uv is None:
    raise RuntimeError('Missing map1 UV layer')

# Replace the imported placeholder with the four atlas materials.
high.data.materials.clear()
slot = {}
for tile, (name, filename) in tile_info.items():
    mat, _ = make_material(name, os.path.join(TEX, filename))
    slot[tile] = len(high.data.materials)
    high.data.materials.append(mat)

for poly in high.data.polygons:
    u = sum(uv.data[li].uv.x for li in poly.loop_indices) / len(poly.loop_indices)
    tile = max(0, min(3, math.floor(u)))
    poly.material_index = slot[tile]
    for li in poly.loop_indices:
        uv.data[li].uv.x -= tile

# Teeth and claws use the bits map on their own UV atlas.
bits_mat, _ = make_material('bits', os.path.join(TEX, 'bits_baseColor.jpeg'))
for obj in (teeth_top, teeth_bot, claws):
    if not obj:
        continue
    obj.data.materials.clear()
    obj.data.materials.append(bits_mat)
    if obj.data.uv_layers:
        obj.data.uv_layers.active_index = 0

scene = bpy.context.scene
world = bpy.data.worlds.new('PreviewWorld')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.03, 0.035, 0.032, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.25
scene.world = world

scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1200
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'

key_data = bpy.data.lights.new('Key', 'AREA')
key_data.energy = 2600
key_data.shape = 'DISK'
key_data.size = 12
key = bpy.data.objects.new('Key', key_data)
scene.collection.objects.link(key)
key.location = (12, -6, 22)
key.rotation_euler = (Vector((0, 0, 9)) - key.location).to_track_quat('-Z', 'Y').to_euler()

fill_data = bpy.data.lights.new('Fill', 'AREA')
fill_data.energy = 900
fill_data.size = 10
fill = bpy.data.objects.new('Fill', fill_data)
scene.collection.objects.link(fill)
fill.location = (-14, -10, 10)
fill.rotation_euler = (Vector((0, 0, 9)) - fill.location).to_track_quat('-Z', 'Y').to_euler()

rim_data = bpy.data.lights.new('Rim', 'AREA')
rim_data.energy = 1800
rim_data.size = 8
rim = bpy.data.objects.new('Rim', rim_data)
scene.collection.objects.link(rim)
rim.location = (2, 18, 18)
rim.rotation_euler = (Vector((0, 0, 10)) - rim.location).to_track_quat('-Z', 'Y').to_euler()

meshes = [o for o in scene.objects if o.type == 'MESH']
corners = []
for obj in meshes:
    for corner in obj.bound_box:
        corners.append(obj.matrix_world @ Vector(corner))
mn = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
mx = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
centre = (mn + mx) * 0.5
size = mx - mn

cam_data = bpy.data.cameras.new('PreviewCamera')
cam = bpy.data.objects.new('PreviewCamera', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam.data.lens = 58
cam.data.sensor_width = 36
cam.data.type = 'PERSP'

def frame(direction, distance_factor=2.0, target_z=None):
    target = Vector((centre.x, centre.y, centre.z if target_z is None else target_z))
    cam.location = target + direction.normalized() * max(size) * distance_factor
    cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()

views = {
    'side': (Vector((1, 0, 0.12)), 1.7, centre.z),
    'three-quarter': (Vector((1, -1.1, 0.32)), 1.85, centre.z + 0.5),
    'head': (Vector((0.55, -1.0, 0.22)), 0.52, 10.2),
}
for name, (direction, factor, target_z) in views.items():
    frame(direction, factor, target_z)
    scene.render.filepath = os.path.join(RENDERS, f'texture-{name}.png')
    bpy.ops.render.render(write_still=True)
    print('rendered', scene.render.filepath)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'spineBind-textured.blend'))
print('DONE')

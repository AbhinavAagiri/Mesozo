import bpy
import os
import math
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, '.tmp-assets', 'spino-bind', 'spineBind.fbx')
OUT = os.path.join(ROOT, '.tmp-assets', 'spino-bind')
RENDERS = os.path.join(OUT, 'renders')
os.makedirs(RENDERS, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=SRC, use_anim=True, use_custom_normals=True)
bpy.context.view_layer.update()

high = bpy.data.objects.get('high')
if high is None:
    raise RuntimeError('High mesh not found')

# Drop the low cage from the working scene.
low = bpy.data.objects.get('low')
if low:
    bpy.data.objects.remove(low, do_unlink=True)

mesh = high.data
uv = mesh.uv_layers.get('map1')
if uv is None:
    raise RuntimeError('map1 UV layer missing')

umin = 1e9
umax = -1e9
vmin = 1e9
vmax = -1e9
tiles = {}

for poly in mesh.polygons:
    us = []
    vs = []
    for li in poly.loop_indices:
        co = uv.data[li].uv
        us.append(co.x)
        vs.append(co.y)
        umin = min(umin, co.x)
        umax = max(umax, co.x)
        vmin = min(vmin, co.y)
        vmax = max(vmax, co.y)
    u = sum(us) / len(us)
    v = sum(vs) / len(vs)
    tile = math.floor(u)
    record = tiles.setdefault(tile, {'faces': 0, 'verts': set(), 'umin': 9, 'umax': -9, 'vmin': 9, 'vmax': -9})
    record['faces'] += 1
    record['umin'] = min(record['umin'], min(us))
    record['umax'] = max(record['umax'], max(us))
    record['vmin'] = min(record['vmin'], min(vs))
    record['vmax'] = max(record['vmax'], max(vs))
    for vi in poly.vertices:
        record['verts'].add(vi)

print('=== UV RANGE ===')
print('u', round(umin, 5), round(umax, 5), 'v', round(vmin, 5), round(vmax, 5))

print('=== UDIM TILES ===')
for tile in sorted(tiles):
    rec = tiles[tile]
    pts = [high.matrix_world @ mesh.vertices[i].co for i in rec['verts']]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    c = (mn + mx) * 0.5
    print(
        'tile',
        tile,
        'faces',
        rec['faces'],
        'verts',
        len(rec['verts']),
        'uv',
        (round(rec['umin'], 3), round(rec['umax'], 3), round(rec['vmin'], 3), round(rec['vmax'], 3)),
        'world-centre',
        tuple(round(v, 2) for v in c),
        'world-min',
        tuple(round(v, 2) for v in mn),
        'world-max',
        tuple(round(v, 2) for v in mx),
    )

# Assign a distinct clay colour to each UDIM tile so the render shows which
# region of the animal lives in each tile.
mesh.materials.clear()
colors = [
    (0.7, 0.2, 0.1, 1),
    (0.1, 0.45, 0.7, 1),
    (0.15, 0.6, 0.25, 1),
    (0.75, 0.55, 0.1, 1),
    (0.55, 0.2, 0.65, 1),
]
for i, color in enumerate(colors):
    mat = bpy.data.materials.new(f'Tile{i + 1}')
    mat.diffuse_color = color
    mesh.materials.append(mat)

for poly in mesh.polygons:
    us = [uv.data[li].uv.x for li in poly.loop_indices]
    poly.material_index = max(0, min(4, math.floor(sum(us) / len(us))))

# Remove empties and low meshes from the render, keep teeth/claws so their
# position is readable.
for obj in list(bpy.context.scene.objects):
    if obj.type == 'EMPTY':
        bpy.data.objects.remove(obj, do_unlink=True)

scene = bpy.context.scene
world = bpy.data.worlds.new('InspectWorld')
world.color = (0.06, 0.06, 0.06)
scene.world = world
scene.render.engine = 'BLENDER_WORKBENCH'
scene.display.shading.light = 'STUDIO'
scene.display.shading.color_type = 'MATERIAL'
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = 'BOTH'
scene.display.shading.show_shadows = True
scene.render.resolution_x = 1200
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'

meshes = [o for o in scene.objects if o.type == 'MESH']
corners = []
for obj in meshes:
    for corner in obj.bound_box:
        corners.append(obj.matrix_world @ Vector(corner))
mn = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
mx = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
centre = (mn + mx) * 0.5
size = mx - mn
print('world size', tuple(round(v, 3) for v in size))

cam_data = bpy.data.cameras.new('InspectCamera')
cam = bpy.data.objects.new('InspectCamera', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam.data.type = 'ORTHO'
distance = max(size) * 4

views = {
    'side-pos-x': (Vector((1, 0, 0)), max(size.y, size.z) * 1.06, 1200, 900),
    'side-neg-x': (Vector((-1, 0, 0)), max(size.y, size.z) * 1.06, 1200, 900),
    'front-pos-y': (Vector((0, 1, 0)), max(size.x, size.z) * 1.15, 900, 900),
    'front-neg-y': (Vector((0, -1, 0)), max(size.x, size.z) * 1.15, 900, 900),
    'top': (Vector((0, 0, 1)), max(size.x, size.y) * 1.06, 1200, 900),
    'three-quarter': (Vector((1, -1, 0.55)).normalized(), max(size.y, size.z) * 1.1, 1200, 900),
}
for name, (direction, ortho, width, height) in views.items():
    cam.location = centre + direction * distance
    cam.rotation_euler = (-direction).to_track_quat('-Z', 'Y').to_euler()
    cam.data.ortho_scale = ortho
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.filepath = os.path.join(RENDERS, f'uv-{name}.png')
    bpy.ops.render.render(write_still=True)
    print('rendered', scene.render.filepath)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'spineBind-uv.blend'))
print('DONE')

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

print('=== OBJECTS ===')
for obj in bpy.context.scene.objects:
    print(
        obj.name,
        'type=' + obj.type,
        'parent=' + (obj.parent.name if obj.parent else '-'),
        'loc=' + str(tuple(round(v, 4) for v in obj.location)),
        'rot=' + str(tuple(round(math.degrees(v), 2) for v in obj.rotation_euler)),
        'scale=' + str(tuple(round(v, 4) for v in obj.scale)),
        'dims=' + str(tuple(round(v, 4) for v in obj.dimensions)),
    )
    if obj.type == 'MESH':
        mesh = obj.data
        print(
            '  mesh',
            mesh.name,
            'verts=' + str(len(mesh.vertices)),
            'polys=' + str(len(mesh.polygons)),
            'uvs=' + str([uv.name for uv in mesh.uv_layers]),
            'materials=' + str([m.name if m else None for m in mesh.materials]),
            'attrs=' + str([a.name for a in mesh.attributes]),
        )
    if obj.type == 'ARMATURE':
        print('  bones=' + str([b.name for b in obj.data.bones]))

print('=== MATERIALS ===')
for mat in bpy.data.materials:
    print('MAT', mat.name, 'nodes=' + str([n.type for n in mat.node_tree.nodes]) if mat.use_nodes else 'no-nodes')
    if mat.use_nodes:
        for node in mat.node_tree.nodes:
            if node.type == 'TEX_IMAGE':
                print('  image', node.image.name if node.image else None, node.image.filepath if node.image else None)

meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
if not meshes:
    raise RuntimeError('No meshes imported')

for obj in meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]

# Report world bounds and mesh centers.
corners = []
for obj in meshes:
    for corner in obj.bound_box:
        corners.append(obj.matrix_world @ Vector(corner))
mn = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
mx = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
centre = (mn + mx) * 0.5
size = mx - mn
print('=== WORLD BOUNDS ===')
print('min', tuple(round(v, 4) for v in mn))
print('max', tuple(round(v, 4) for v in mx))
print('centre', tuple(round(v, 4) for v in centre))
print('size', tuple(round(v, 4) for v in size))

# Simple neutral viewport material for orientation renders.
clay = bpy.data.materials.new('InspectClay')
clay.diffuse_color = (0.42, 0.38, 0.3, 1)
for obj in meshes:
    if obj.data.materials:
        obj.data.materials[0] = clay
    else:
        obj.data.materials.append(clay)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_WORKBENCH'
scene.display.shading.light = 'STUDIO'
scene.display.shading.color_type = 'MATERIAL'
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = 'BOTH'
scene.display.shading.show_shadows = True
scene.render.resolution_x = 1000
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.world.color = (0.12, 0.12, 0.12)
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'

cam_data = bpy.data.cameras.new('InspectCamera')
cam = bpy.data.objects.new('InspectCamera', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam.data.type = 'ORTHO'
cam.data.ortho_scale = max(size) * 1.12
distance = max(size) * 4

views = {
    'x': Vector((1, 0, 0)),
    'y': Vector((0, 1, 0)),
    'z': Vector((0, 0, 1)),
    'three-quarter': Vector((1, -1, 0.7)).normalized(),
}
for name, direction in views.items():
    cam.location = centre + direction * distance
    cam.rotation_euler = (-direction).to_track_quat('-Z', 'Y').to_euler()
    scene.render.filepath = os.path.join(RENDERS, f'view-{name}.png')
    bpy.ops.render.render(write_still=True)
    print('rendered', scene.render.filepath)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'spineBind-inspect.blend'))
print('DONE')

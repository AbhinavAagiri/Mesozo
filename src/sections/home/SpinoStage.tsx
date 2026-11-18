import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

type Props = {
  progressRef: { current: number };
};

// A Meshopt-compressed GLB with optimised 1024px textures and the original
// materials, meshes and head group. The source archive was reduced from
// roughly 38 MiB to 9.2 MiB; Meshopt brings the runtime payload to about 3.2
// MiB without removing any geometry.
const MODEL_URL = '/assets/model/spinosaurus/scene.glb';

type Pose = {
  look: THREE.Vector3;
  position: THREE.Vector3;
};

/**
 * Full-bleed hero specimen. The animal is lit as a museum object in a dark
 * hall; the canvas is transparent so the page's atmosphere, not a box, is the
 * background. The head pose is derived from the head mesh's own bounds.
 */
export default function SpinoStage({ progressRef }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl2') && !probe.getContext('webgl')) return;

    let disposed = false;
    let ready = false;
    let visible = true;
    let raf = 0;
    let progress = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.005, 30);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1.5 : 1.9));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    // Broad, soft exhibition key from the public side of the animal.
    const key = new THREE.DirectionalLight(0xfff2df, 4.1);
    key.position.set(2.4, 3.6, 4.2);
    key.castShadow = true;
    key.shadow.mapSize.set(window.innerWidth < 760 ? 512 : 1024, window.innerWidth < 760 ? 512 : 1024);
    key.shadow.camera.left = -0.9;
    key.shadow.camera.right = 0.9;
    key.shadow.camera.top = 0.9;
    key.shadow.camera.bottom = -0.9;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 12;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.012;
    scene.add(key);

    // Cool fill keeps the shadow side readable instead of black.
    const fill = new THREE.DirectionalLight(0x9db4c4, 0.9);
    fill.position.set(-4.2, 1.8, 2.6);
    scene.add(fill);

    // Low warm rim separates the sail and neck from the hall.
    const rim = new THREE.DirectionalLight(0xffb37a, 2.1);
    rim.position.set(-1.6, 2.4, -4.8);
    scene.add(rim);

    const under = new THREE.DirectionalLight(0x8a7358, 0.35);
    under.position.set(0.5, -2.5, 1.4);
    scene.add(under);

    scene.add(new THREE.HemisphereLight(0xc9c2b2, 0x171815, 0.42));

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.4 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.002;
    ground.receiveShadow = true;
    scene.add(ground);

    const root = new THREE.Group();
    scene.add(root);

    const fullBox = new THREE.Box3();
    const headBox = new THREE.Box3();
    const size = new THREE.Vector3();
    const centre = new THREE.Vector3();
    const headCentre = new THREE.Vector3();
    const poses: Pose[] = [];
    const lookAt = new THREE.Vector3();
    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const right = new THREE.Vector3();
    let hasModel = false;

    const ease = (t: number) => t * t * (3 - 2 * t);

    const poseInView = (
      target: THREE.Vector3,
      distance: number,
      direction: THREE.Vector3,
      screenShift: number,
      screenLift: number,
      fovRad: number,
      aspect: number,
    ): Pose => {
      const position = target.clone().addScaledVector(direction, distance);
      const look = target.clone();

      if (screenShift) {
        const width = 2 * distance * Math.tan(fovRad / 2) * aspect;
        right.crossVectors(new THREE.Vector3(0, 1, 0), direction).normalize();
        const shift = width * screenShift;
        position.addScaledVector(right, -shift);
        look.addScaledVector(right, -shift);
      }

      const lift = screenLift * 2 * distance * Math.tan(fovRad / 2);
      if (lift) {
        position.y -= lift;
        look.y -= lift;
      }

      return { position, look };
    };

    const configure = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const aspect = rect.width / rect.height;
      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);

      fullBox.setFromObject(root);
      fullBox.getSize(size);
      fullBox.getCenter(centre);

      if (headBox.isEmpty()) {
        headBox.setFromCenterAndSize(
          new THREE.Vector3(centre.x, fullBox.min.y + size.y * 0.55, fullBox.max.z - size.z * 0.08),
          new THREE.Vector3(size.x * 0.35, size.y * 0.3, size.z * 0.3),
        );
      }
      headBox.getCenter(headCentre);

      const headSize = headBox.getSize(new THREE.Vector3());
      const headSpan = Math.max(headSize.x, headSize.y, headSize.z);

      // Opening: the skull fills roughly half the viewport height, offset to
      // the right so the headline owns the left field.
      const headDistance = Math.max(
        headSize.y / 0.7 / (2 * Math.tan(Math.min(fovRad, hFov) / 2)),
        0.5,
      );
      const headTarget = headCentre.clone().add(new THREE.Vector3(0, headSize.y * 0.04, -headSpan * 0.04));
      const headDirection = new THREE.Vector3(0.62, 0.13, 0.85).normalize();

      poses.push(
        poseInView(
          headTarget,
          headDistance * (aspect < 0.9 ? 1.45 : 1),
          headDirection,
          0.12,
          aspect < 0.9 ? 0.12 : 0.01,
          fovRad,
          aspect,
        ),
      );

      // Middle: the neck and forebody enter, head drifting left of centre.
      const midTarget = new THREE.Vector3(
        centre.x + size.x * 0.06,
        fullBox.min.y + size.y * 0.48,
        centre.z + size.z * 0.16,
      );
      const midDistance = headDistance * (aspect < 0.9 ? 1.5 : 1.55);
      poses.push(poseInView(midTarget, midDistance, headDirection, 0.04, 0, fovRad, aspect));

      // Full: the animal is measured as a whole against the viewport width.
      // A portrait frame needs a more frontal angle: a side-on animal is only
      // a thin band across a tall screen.
      const portrait = aspect < 0.9;
      const fullTarget = new THREE.Vector3(
        centre.x,
        fullBox.min.y + size.y * 0.47,
        centre.z + (portrait ? size.z * 0.04 : 0),
      );
      const fullDirection = portrait
        ? new THREE.Vector3(0.5, 0.14, 0.88).normalize()
        : new THREE.Vector3(0.6, 0.11, 0.95).normalize();
      const fullDistance = portrait
        ? size.z * 1.05 / (2 * Math.tan(hFov / 2))
        : size.z / 0.84 / (2 * Math.tan(hFov / 2));
      poses.push(poseInView(fullTarget, fullDistance, fullDirection, portrait ? 0.04 : 0.04, 0, fovRad, aspect));

      const t = ease(progress);
      const segment = t < 0.5 ? 0 : 1;
      const local = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
      const blended = ease(local);
      const from = poses[segment];
      const to = poses[Math.min(segment + 1, poses.length - 1)];
      camera.position.lerpVectors(from.position, to.position, blended);
      lookAt.lerpVectors(from.look, to.look, blended);
      camera.lookAt(lookAt);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      if (!hasModel) return;
      poses.length = 0;
      configure();
      renderer.render(scene, camera);
    };

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }
        const model = gltf.scene;

        model.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = false;

          const materialList = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materialList.forEach((material) => {
            if (!(material instanceof THREE.MeshStandardMaterial)) return;
            material.envMapIntensity = 0.55;
            material.roughness = Math.min(1, Math.max(material.roughness, 0.82));
            material.metalness = 0;
            if (material.name.includes('eye')) {
              material.roughness = 0.24;
              material.envMapIntensity = 0.9;
            }
            if (material.map) {
              material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
            }
            material.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>
                 float lum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
                 gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(lum) * vec3(1.04, 0.95, 0.84), 0.16);
                `,
              );
            };
            material.customProgramCacheKey = () => 'mesozo-exhibit-skin';
            material.needsUpdate = true;
          });
        });

        root.add(model);

        const rawBox = new THREE.Box3().setFromObject(model);
        const rawCentre = rawBox.getCenter(new THREE.Vector3());
        model.position.sub(new THREE.Vector3(rawCentre.x, rawBox.min.y, rawCentre.z));

        const rawSize = rawBox.getSize(new THREE.Vector3());
        root.scale.setScalar(1 / Math.max(rawSize.x, rawSize.y, rawSize.z));
        root.updateMatrixWorld(true);

        // The head mesh is a separate material group; measure it rather than
        // guessing the skull's position from body proportions.
        model.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          if (materials.some((material) => material.name === 'head')) {
            headBox.expandByObject(mesh);
          }
        });

        hasModel = true;
        renderer.shadowMap.needsUpdate = true;
        resize();
        renderer.render(scene, camera);
        ready = true;
        host.classList.add('is-ready');
      },
      undefined,
      (error) => {
        if (disposed) return;
        console.warn('Spinosaurus exhibit failed to load', error);
        host.dataset.failed = 'true';
      },
    );

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const onPointer = (event: PointerEvent) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    const resetPointer = () => pointer.set(0, 0);

    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '80px' },
    );
    intersection.observe(host);

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('blur', resetPointer);

    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!ready || !visible) {
        clock.getDelta();
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      progress = THREE.MathUtils.damp(progress, Math.min(1, Math.max(0, progressRef.current)), 4, delta);
      smoothPointer.lerp(pointer, 1 - Math.exp(-3.2 * delta));

      const t = ease(progress);
      const segment = t < 0.5 ? 0 : 1;
      const local = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
      const blended = ease(local);
      const from = poses[segment];
      const to = poses[Math.min(segment + 1, poses.length - 1)];
      if (!from || !to) return;

      camera.position.lerpVectors(from.position, to.position, blended);
      lookAt.lerpVectors(from.look, to.look, blended);
      camera.position.x += smoothPointer.x * 0.012;
      camera.position.y -= smoothPointer.y * 0.008;
      camera.lookAt(lookAt);
      renderer.render(scene, camera);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('blur', resetPointer);

      disposeModel(scene);
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [progressRef]);

  return <div className="exhibit-stage" ref={hostRef} />;
}

/** Release every texture slot, not only the base colour map. */
function disposeModel(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const textures = new Set<THREE.Texture>();
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value);
      }
      textures.forEach((texture) => texture.dispose());
      material.dispose();
    });
  });
}

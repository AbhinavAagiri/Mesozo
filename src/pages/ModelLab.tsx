import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import '../styles/model-lab.css';

/**
 * Isolated 3D laboratory. Deliberately not linked from the exhibition: this is
 * the calibration and alignment checkpoint before the hero is touched.
 *
 * URL parameters (all optional):
 *   mode   live | skull | both | reveal
 *   cam    head | full | side
 *   rig    1 loads the skinned bind-pose study instead of the posed hero mesh
 *   reveal 0..1,0..1   fixed reveal point, for reproducible captures
 *   radius 0..1        reveal radius
 *   ss sx sy sz rx ry rz   skull scale, position and rotation overrides
 */

type Mode = 'live' | 'skull' | 'both' | 'reveal';

type LoadState = { living: boolean; skull: boolean; error: string | null };

const params = new URLSearchParams(window.location.search);
const num = (key: string, fallback: number) => {
  const raw = params.get(key);
  return raw === null ? fallback : Number(raw);
};

const IS_SPINO = params.get('model') === 'spino';
const CLEAN = params.get('clean') === '1';
const BARE = params.get('bare') === '1';
const RIGGED = params.get('rig') === '1';

const ASSET = IS_SPINO
  ? {
      living: RIGGED
        ? '/assets/model/spinosaurus/spinosaurus-rigged.gltf'
        : '/assets/model/spinosaurus/scene.gltf',
      skull: '/assets/model/oxalaia-skull.glb',
      label: 'Spinosaurus aegyptiacus',
      skullLabel: 'Oxalaia quilombensis — related spinosaurine',
    }
  : {
      living: '/assets/model/triceratops/scene.gltf',
      skull: '/assets/model/triceratops-skull.glb',
      label: 'Triceratops horridus',
      skullLabel: 'Triceratops skull — AMNH photogrammetry',
    };

// Calibration values: skull is centred on its own bounding box, then scaled
// into the living model's units and placed inside the head.
// The living scene is normalised to one unit of body length. These values are
// expressed in the living model's own world units (about 91.7 long) so the
// skull's centring transform stays readable.
const SKULL = IS_SPINO
  ? {
      scale: num('ss', 1.0),
      x: num('sx', -1.0),
      y: num('sy', 2.1),
      z: num('sz', 3.5),
      rx: num('rx', 0),
      ry: num('ry', -Math.PI / 2),
      rz: num('rz', 0),
    }
  : {
      scale: num('ss', 3.3),
      x: num('sx', 0),
      y: num('sy', 27),
      z: num('sz', -40),
      rx: num('rx', 0),
      ry: num('ry', Math.PI),
      rz: num('rz', 0),
    };

const SKULL_COLOR = 0x9c9078;

function makeRevealUniforms() {
  return {
    uPointer: { value: new THREE.Vector2(0.5, 0.42) },
    uRadius: { value: 0.19 },
    uAspect: { value: 1 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uActive: { value: 0 },
    uSkinOpacity: { value: 1 },
    uGrade: { value: num('grade', 0.55) },
    uTime: { value: 0 },
  };
}

function injectMask(
  material: THREE.MeshStandardMaterial,
  uniforms: ReturnType<typeof makeRevealUniforms>,
  mode: 'skin' | 'bone',
) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLabWorld;')
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
         vec4 labWorld = vec4(transformed, 1.0);
         #ifdef USE_INSTANCING
           labWorld = instanceMatrix * labWorld;
         #endif
         vLabWorld = (modelMatrix * labWorld).xyz;
        `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 vLabWorld;
         uniform vec2 uPointer;
         uniform float uRadius;
         uniform float uAspect;
         uniform vec2 uResolution;
         uniform float uActive;
         uniform float uSkinOpacity;
         uniform float uGrade;
         uniform float uTime;

         float hash21(vec2 p) {
           p = fract(p * vec2(123.34, 456.21));
           p += dot(p, p + 45.32);
           return fract(p.x * p.y);
         }

         float vnoise(vec2 p) {
           vec2 i = floor(p);
           vec2 f = fract(p);
           f = f * f * (3.0 - 2.0 * f);
           float a = hash21(i);
           float b = hash21(i + vec2(1.0, 0.0));
           float c = hash21(i + vec2(0.0, 1.0));
           float d = hash21(i + vec2(1.0, 1.0));
           return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
         }

         float maskAt(vec2 fragCoord) {
           vec2 uv = fragCoord / uResolution;
           vec2 d = uv - uPointer;
           d.x *= uAspect;
           float n = vnoise(uv * 9.0 + 3.7) * 0.6 + vnoise(uv * 23.0 - 8.1) * 0.4;
           float edge = length(d) / uRadius + (n - 0.5) * 0.42;
           return smoothstep(1.05, 0.45, edge);
         }
        `,
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         float labMask = maskAt(gl_FragCoord.xy) * uActive;
         ${
           mode === 'skin'
             ? 'gl_FragColor.a *= uSkinOpacity * (1.0 - labMask);'
             : 'gl_FragColor.a *= mix(1.0, labMask, step(0.5, uActive));'
         }
         if (${mode === 'skin' ? 'true' : 'false'}) {
           float lum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
           gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(lum) * vec3(1.06, 0.93, 0.78), uGrade);
         }
        `,
      );
  };
  material.customProgramCacheKey = () => `lab-${mode}`;
  material.transparent = true;
  material.depthWrite = true;
}

function boneFinish(material: THREE.MeshStandardMaterial) {
  material.color = new THREE.Color(SKULL_COLOR);
  material.roughness = 0.86;
  material.metalness = 0;
      material.envMapIntensity = 0.25;
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBonePos;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvBonePos = position;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBonePos;')
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         float mottle = sin(vBonePos.x * 7.0 + sin(vBonePos.z * 5.0)) * 0.5 + 0.5;
         float pits = sin(vBonePos.y * 31.0 + vBonePos.z * 17.0) * 0.5 + 0.5;
         gl_FragColor.rgb *= 0.88 + mottle * 0.07 + pits * 0.035;
        `,
      );
  };
  material.customProgramCacheKey = () => 'lab-bone';
}

function ModelLab() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fitRef = useRef<(preset: string) => void>(() => {});
  const [mode, setMode] = useState<Mode>((params.get('mode') as Mode) || 'reveal');
  const [loaded, setLoaded] = useState<LoadState>({ living: false, skull: false, error: null });
  const [values, setValues] = useState(SKULL);
  const [progress, setProgress] = useState(0);
  const stateRef = useRef({ mode, values });
  stateRef.current = { mode, values };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d0e0c');
    scene.fog = new THREE.Fog('#0d0e0c', 4.5, 18);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.02, 60);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
    scene.environment = env;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 0.4;
    controls.maxDistance = 18;

    const key = new THREE.DirectionalLight(0xffe7c8, 3.35);
    key.position.set(2.6, 4.4, 5.2);
    key.castShadow = params.get('shadows') === '1';
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 22;
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.012;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x89a8bd, 0.35);
    fill.position.set(-5, 2.2, 3.4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xff9c5e, 2.3);
    rim.position.set(-1.2, 3.4, -5.6);
    scene.add(rim);

    scene.add(new THREE.HemisphereLight(0x9aa39c, 0x1a1713, 0.28));

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(6, 64),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.28 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const uniforms = makeRevealUniforms();

    const root = new THREE.Group();
    scene.add(root);
    // Debug handle for the isolated lab only (never used by the exhibition).
    (window as unknown as Record<string, unknown>).__lab = {
      scene,
      camera,
      controls,
      root,
      renderer,
      THREE,
      setSkull: (next: Partial<typeof SKULL>) => {
        Object.assign(stateRef.current.values, next);
        applySkullTransform();
      },
      setMode: (next: Mode) => setMode(next),
      boxes: () => {
        const b = (o: THREE.Object3D | null) => {
          if (!o) return null;
          const box = new THREE.Box3().setFromObject(o);
          return {
            size: box.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(2)),
            min: box.min.toArray().map((v) => +v.toFixed(2)),
            max: box.max.toArray().map((v) => +v.toFixed(2)),
          };
        };
        return { living: b(livingRoot), skull: b(skullWrapper), root: b(root) };
      },
    };

    const loader = new GLTFLoader();
    let livingRoot: THREE.Object3D | null = null;
    let skullRoot: THREE.Object3D | null = null;
    let livingBox = new THREE.Box3();
    let skullWrapper: THREE.Group | null = null;
    let disposed = false;

    const applySkullTransform = () => {
      if (!skullWrapper) return;
      const { scale, x, y, z, rx, ry, rz } = stateRef.current.values;
      skullWrapper.scale.setScalar(scale);
      skullWrapper.position.set(x, y, z);
      skullWrapper.rotation.set(rx, ry, rz);
    };

    const fitCamera = (preset: string) => {
      if (!livingRoot) return;
      const size = livingBox.getSize(new THREE.Vector3());
      const center = livingBox.getCenter(new THREE.Vector3());
      if (preset === 'head') {
        const head = IS_SPINO
          ? new THREE.Vector3(livingBox.min.x + size.x * 0.28, livingBox.min.y + size.y * 0.52, livingBox.max.z - size.z * 0.08)
          : new THREE.Vector3(center.x + size.x * 0.02, livingBox.min.y + size.y * 0.7, center.z + size.z * 0.44);
        controls.target.copy(head);
        if (IS_SPINO) {
          controls.target.set(head.x - size.x * 0.16, head.y + size.y * 0.05, head.z);
          camera.position.set(
            head.x - size.x * 0.16 + size.x * 0.68,
            head.y + size.y * 0.14,
            head.z + size.z * 0.31,
          );
          camera.fov = 28;
        } else {
          camera.position.set(head.x - size.x * 0.9, head.y + size.y * 0.1, head.z + size.z * 0.5);
          camera.fov = 30;
        }
      } else if (preset === 'side') {
        controls.target.copy(center);
        camera.position.set(center.x + size.x * 2.4, center.y + size.y * 0.15, center.z);
        camera.fov = 32;
      } else {
        controls.target.set(center.x, center.y * 0.9, center.z);
        camera.position.set(
          center.x + size.z * 0.55,
          center.y + size.y * (IS_SPINO ? 0.35 : 0.2),
          center.z + size.z * (IS_SPINO ? 0.95 : 0.78),
        );
        camera.fov = 34;
      }
      if (camera.aspect < 0.85) {
        camera.position.sub(controls.target).multiplyScalar(1.55).add(controls.target);
      }
      camera.updateProjectionMatrix();
      controls.update();
    };

    loader.load(
      ASSET.living,
      (gltf) => {
        if (disposed) return;
        livingRoot = gltf.scene;
        livingRoot.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            // The author ships two nearly coincident skinned shells; drawing
            // both produces a patchwork. Object_7 carries the normal map.
            if (mesh.name === 'Object_8') mesh.visible = false;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const material of materials) {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.envMapIntensity = 0.5;
                material.roughness = Math.min(1, material.roughness + 0.06);
                if (material.map) {
                  material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  material.needsUpdate = true;
                }
                if (params.get('plain') === '1') {
                  material.map = null;
                  material.normalMap = null;
                  material.color.set('#c9b9a4');
                  material.needsUpdate = true;
                }
                injectMask(material, uniforms, 'skin');
              }
            }
          }
        });
        root.add(livingRoot);

        const rawBox = new THREE.Box3().setFromObject(livingRoot);
        const rawCenter = rawBox.getCenter(new THREE.Vector3());
        livingRoot.position.sub(new THREE.Vector3(rawCenter.x, rawBox.min.y, rawCenter.z));

        // Normalise the whole scene to one unit of body length so camera,
        // fog and shadow distances are independent of the source scale.
        const rawSize = rawBox.getSize(new THREE.Vector3());
        const unit = 1 / Math.max(rawSize.x, rawSize.y, rawSize.z);
        root.scale.setScalar(unit);
        root.updateMatrixWorld(true);

        livingBox.setFromObject(livingRoot);

        const shadowTarget = new THREE.Object3D();
        shadowTarget.position.copy(livingBox.getCenter(new THREE.Vector3()));
        scene.add(shadowTarget);
        key.target = shadowTarget;

        fitCamera(params.get('cam') || 'full');
        fitRef.current = fitCamera;
        setLoaded((prev) => ({ ...prev, living: true }));
      },
      (event) => {
        if (event.total) setProgress(Math.min(0.99, event.loaded / event.total));
      },
      (error) => {
        console.error('Living model failed', error);
        setLoaded((prev) => ({ ...prev, error: 'Living model failed to load.' }));
      },
    );

    loader.load(
      ASSET.skull,
      (gltf) => {
        if (disposed) return;
        skullRoot = gltf.scene;
        const box = new THREE.Box3().setFromObject(skullRoot);
        const center = box.getCenter(new THREE.Vector3());
        skullRoot.position.sub(center);

        skullRoot.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const material of materials) {
              if (material instanceof THREE.MeshStandardMaterial) {
                boneFinish(material);
                injectMask(material, uniforms, 'bone');
              }
            }
          }
        });

        skullWrapper = new THREE.Group();
        skullWrapper.add(skullRoot);
        applySkullTransform();
        root.add(skullWrapper);
        setLoaded((prev) => ({ ...prev, skull: true }));
      },
      undefined,
      (error) => {
        console.error('Skull failed', error);
        setLoaded((prev) => ({ ...prev, error: 'Skull failed to load.' }));
      },
    );

    const pointerTarget = new THREE.Vector2(0.5, 0.42);
    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerTarget.x = (event.clientX - rect.left) / rect.width;
      pointerTarget.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      uniforms.uAspect.value = clientWidth / clientHeight;
      const size = renderer.getDrawingBufferSize(new THREE.Vector2());
      uniforms.uResolution.value.set(size.x, size.y);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const fixed = params.get('reveal');
    if (fixed) {
      const [px, py] = fixed.split(',').map(Number);
      pointerTarget.set(px, py);
      uniforms.uPointer.value.set(px, py);
      uniforms.uActive.value = 1;
    }
    uniforms.uRadius.value = num('radius', 0.19);

    let frame = 0;
    let running = true;
    const clock = new THREE.Clock();
    const tick = () => {
      if (!running) return;
      clock.getDelta();
      uniforms.uTime.value += 0.016;
      uniforms.uPointer.value.lerp(pointerTarget, 0.14);
      const current = stateRef.current;
      const revealOn = current.mode === 'reveal';
      uniforms.uActive.value = revealOn
        ? fixed
          ? 1
          : THREE.MathUtils.lerp(uniforms.uActive.value, 1, 0.08)
        : 0;
      uniforms.uSkinOpacity.value = current.mode === 'both' ? 0.3 : 1;
      if (livingRoot) livingRoot.visible = current.mode !== 'skull';
      if (skullWrapper) skullWrapper.visible = current.mode !== 'live';
      applySkullTransform();
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      renderer.dispose();
      env.dispose();
      pmrem.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  const setPreset = (key: string, value: number) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <div className={`lab${CLEAN ? ' lab--clean' : ''}${BARE ? ' lab--bare' : ''}${params.get('mirror') === '1' ? ' lab--mirror' : ''}`}>
      <div className="lab__stage" ref={mountRef} />
      <div className="lab__vignette" aria-hidden="true" />

      {CLEAN && (
        <div className="lab__overlay">
          <header className="lab__overlay-head">
            <span className="lab__mark">Mesozo</span>
            <span className="mono">The world before us</span>
          </header>
          <div className="lab__overlay-copy">
            <p className="mono">Specimen plate 01 — theropoda</p>
            <h1 className="serif">
              Spinosaurus <em>aegyptiacus</em>
            </h1>
            <p className="mono lab__meta">
              Late Cretaceous · 99–94 Ma · Egypt, Morocco · ≈14 m
            </p>
            <p className="lab__lede">
              A reconstruction argued from fragmentary bones — an interpretation of the animal, not
              the animal itself. The skull beneath this skin is not yet known.
            </p>
          </div>
          <footer className="lab__overlay-foot">
            <p className="mono">
              Reconstruction — Julian Johnson-Mortimer, CC BY 4.0
              <br />
              Fossil skull — no licensed <em>Spinosaurus</em> specimen
            </p>
            <p className="mono">Drag to orbit · move to reveal</p>
          </footer>
        </div>
      )}

      <header className="lab__bar">
        <div>
          <p className="mono">MESOZO / MODEL LABORATORY</p>
          <p className="lab__sub mono">
            Spinosaurus aegyptiacus — hero study. Not published.
          </p>
        </div>
        <Link className="lab__exit mono" to="/">
          ← Back to the exhibition
        </Link>
      </header>

      <div className="lab__panel">
        <div className="lab__modes">
          {(['live', 'skull', 'both', 'reveal'] as Mode[]).map((item) => (
            <button
              key={item}
              type="button"
              className={mode === item ? 'is-active' : ''}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="lab__row">
          <span className="mono">Camera</span>
          <span className="lab__cameras">
            {(['head', 'full', 'side'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                className="lab__ghost"
                onClick={() => fitRef.current(preset)}
              >
                {preset}
              </button>
            ))}
          </span>
        </div>

        <details className="lab__calib">
          <summary className="mono">Skull transform</summary>
          {(['scale', 'x', 'y', 'z', 'ry'] as const).map((key) => (
            <label key={key} className="lab__slider">
              <span className="mono">{key}</span>
              <input
                type="range"
                min={key === 'scale' ? 0.4 : key === 'ry' ? -Math.PI : -80}
                max={key === 'scale' ? 9 : key === 'ry' ? Math.PI : 80}
                step={key === 'scale' ? 0.05 : key === 'ry' ? 0.02 : 0.5}
                value={values[key]}
                onChange={(event) => setPreset(key, Number(event.target.value))}
              />
              <em className="mono">{values[key].toFixed(key === 'scale' ? 1 : 0)}</em>
            </label>
          ))}
        </details>

        <p className="lab__status mono">
          {loaded.error
            ? loaded.error
            : loaded.living && loaded.skull
              ? 'Both assets loaded · drag to orbit · move to reveal'
              : `Loading ${Math.round(progress * 100)}%`}
        </p>
      </div>

            <div className="lab__caption">
        <p className="mono">Specimen plate 01 · Spinosaurus aegyptiacus</p>
        <p className="mono">
          Living reconstruction: Julian Johnson-Mortimer (CC BY 4.0) · Skull: none licensed for Spinosaurus; Oxalaia cast held for study only
        </p>
      </div>
    </div>
  );
}

export default ModelLab;

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Shell } from './Shell'
import { B, Cyl, Sph, Plane, InstancedCyl } from '../furniture/primitives'
import { Rug, Books } from '../furniture/living'
import { ArcFloorLamp, PendantGlobe, WallSconce } from '../furniture/lighting'
import { Curtain } from '../furniture/decor'
import { getMat } from '../materials'
import { TF, styleMix } from '../transformTimeline'

/*
 * PROGRESSIVE TRANSFORMATION ROOM — photoreal assets
 * Furniture: real scanned/modelled pieces from Poly Haven (CC0, public/models).
 * Surfaces: photographic PBR textures (CC0, public/textures).
 * Window view and artwork: real photographs (Unsplash licence).
 * Everything is animated by the GSAP timeline in ../transformTimeline.js.
 */

/* ------------------------------------------------------------------ Anim */
function Anim({ k, from = {}, children, ...props }) {
  const g = useRef()
  useFrame(() => {
    const el = g.current
    if (!el) return
    const v = TF[k]
    el.visible = v > 0.002
    if (!el.visible) return
    const u = 1 - v
    el.position.set((from.x || 0) * u, (from.y || 0) * u, (from.z || 0) * u)
    el.rotation.set((from.rx || 0) * u, (from.ry || 0) * u, (from.rz || 0) * u)
    const c = Math.min(1, Math.max(0, v))
    const s = from.s !== undefined ? from.s + (1 - from.s) * v : 1
    const ax = (a) => Math.max(0.001, from[a] !== undefined ? from[a] + (1 - from[a]) * c : s)
    el.scale.set(ax('sx'), ax('sy'), ax('sz'))
  })
  return (
    <group {...props}>
      <group ref={g}>{children}</group>
    </group>
  )
}

/* ------------------------------------------------- deferred texture loading
 * Textures are created up-front (so shaders compile once) and their images are
 * fetched a few seconds after start-up, so the hero section loads first. */
const imgLoader = new THREE.ImageLoader()
const queue = []
function lazyTex(url, { repeat = [1, 1], color = false } = {}) {
  const t = new THREE.Texture()
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.anisotropy = 8
  if (color) t.colorSpace = THREE.SRGBColorSpace
  queue.push(() =>
    imgLoader.load(url, (img) => {
      t.image = img
      t.needsUpdate = true
    }),
  )
  return t
}
function pbr(dir, repeat, extra = {}) {
  return new THREE.MeshStandardMaterial({
    map: lazyTex(`/textures/${dir}/diff.jpg`, { repeat, color: true }),
    normalMap: lazyTex(`/textures/${dir}/nor.jpg`, { repeat }),
    roughnessMap: lazyTex(`/textures/${dir}/rough.jpg`, { repeat }),
    ...extra,
  })
}
function photo(file, extra = {}) {
  const map = lazyTex(`/textures/photos/${file}`, { color: true })
  map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping
  return new THREE.MeshStandardMaterial({ map, roughness: 0.85, ...extra })
}

/* ------------------------------------------------------------- real models */
const MODEL = (id) => `/models/${id}/${id}_1k.gltf`

/**
 * A Poly Haven model, re-centred on its footprint and resting on the floor.
 * size: { w } or { h } scales uniformly to that width/height; scale overrides.
 * mats: optional array that receives this instance's (cloned) materials so the
 * style timeline can tint them.
 */
function Model({ id, w, h, scale, rotY = 0, mats }) {
  const { scene } = useGLTF(MODEL(id))
  const obj = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = true
      o.receiveShadow = true
      o.material = o.material.clone()
      o.material.envMapIntensity = 0.9
      if (mats) mats.push(o.material)
    })
    root.rotation.y = rotY
    root.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    root.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2)
    const g = new THREE.Group()
    g.add(root)
    const s = scale ?? (w ? w / Math.max(size.x, size.z) : h ? h / size.y : 1)
    if (Array.isArray(s)) g.scale.set(...s)
    else g.scale.setScalar(s)
    return g
  }, [scene]) // eslint-disable-line react-hooks/exhaustive-deps
  return <primitive object={obj} />
}

const Real = ({ children }) => <Suspense fallback={null}>{children}</Suspense>

/* soft contact shadow — grounds pieces even where the AO pass is off (mobile) */
let blobMat
function Blob({ w = 1, d = 1 }) {
  if (!blobMat) {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const x = c.getContext('2d')
    const g = x.createRadialGradient(64, 64, 4, 64, 64, 64)
    g.addColorStop(0, 'rgba(0,0,0,0.8)')
    g.addColorStop(0.55, 'rgba(0,0,0,0.3)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    x.fillStyle = g
    x.fillRect(0, 0, 128, 128)
    blobMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, opacity: 0.5 })
  }
  return <Plane s={[w, d]} p={[0, 0.008, 0]} r={[-Math.PI / 2, 0, 0]} m={blobMat} renderOrder={1} />
}

function Artwork({ mat, w, h }) {
  return (
    <group>
      <B s={[w + 0.08, h + 0.08, 0.045]} p={[0, 0, 0.022]} m="blackMetal" />
      <Plane s={[w, h]} p={[0, 0, 0.047]} m={mat} />
    </group>
  )
}

// three looks per surface: [Warm Minimal, Walnut Luxe, Bama Blush]
const C = (...h) => h.map((x) => new THREE.Color(x))
const STYLE = {
  wall: C('#e9e1d6', '#5a514b', '#ecd3d6'),
  panel: C('#ffffff', '#6b4a35', '#f4e3dc'),
  floor: C('#ffffff', '#9a7b66', '#f5ece6'),
  ceil: C('#f6f3ee', '#3a322e', '#f8eeec'),
  rug: C('#d9cdbd', '#4a3d35', '#e2bcc1'),
  curtain: C('#efe7db', '#4d3b30', '#efd2d5'),
  wood: C('#ffffff', '#8a7465', '#ffffff'),
  pillow: C('#d9c3a0', '#8e3b26', '#e7aab4'),
}
const RAW_WALL = new THREE.Color('#a19e99')
const LED_ON = new THREE.Color('#ffd49a').multiplyScalar(3)

function useRoomMaterials() {
  return useMemo(() => {
    const m = {
      concrete: pbr('concrete_floor_worn_001', [3, 2.5], { color: '#bdb8b1' }),
      wall: pbr('plastered_wall_02', [2.5, 1.2]),
      floor: pbr('herringbone_parquet', [4, 3.4]),
      ceil: new THREE.MeshStandardMaterial({ color: '#f4f0ea', roughness: 0.95 }),
      panel: getMat('oak').clone(),
      // woven texture from the photo scan, colour from the style palette
      rug: new THREE.MeshStandardMaterial({ normalMap: lazyTex('/textures/fabric_pattern_07/nor.jpg', { repeat: [3, 2.2] }), roughnessMap: lazyTex('/textures/fabric_pattern_07/rough.jpg', { repeat: [3, 2.2] }), roughness: 1 }),
      curtain: new THREE.MeshPhysicalMaterial({
        normalMap: lazyTex('/textures/rough_linen/nor.jpg', { repeat: [2, 3] }),
        roughness: 0.95,
        sheen: 1,
        sheenColor: new THREE.Color('#ffffff'),
        sheenRoughness: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.94,
      }),
      sky: new THREE.MeshBasicMaterial({ map: lazyTex('/textures/photos/window-view.jpg', { color: true }), toneMapped: false }),
      art1: photo('art-neutral.jpg'),
      art2: photo('art-blush.jpg'),
      led: new THREE.MeshBasicMaterial({ color: '#000000', toneMapped: false }),
      bulb: getMat('lampWarm').clone(),
      // filled by <Model mats={…}> once the real pieces load
      woodModels: [],
      pillows: [],
    }
    m.sky.map.wrapS = m.sky.map.wrapT = THREE.ClampToEdgeWrapping
    return m
  }, [])
}

/* =================== EMPTY ROOM → DREAM ROOM =================== */
export function TransformRoom({ shell = {}, assetDelay = 0 }) {
  const m = useRoomMaterials()
  const tmp = useMemo(() => new THREE.Color(), [])
  const [loadReal, setLoadReal] = useState(false)

  // start fetching the photographic assets shortly after the site has loaded
  useEffect(() => {
    const id = setTimeout(() => {
      queue.splice(0).forEach((f) => f())
      setLoadReal(true)
    }, assetDelay)
    return () => clearTimeout(id)
  }, [assetDelay])

  // material morphs: raw → finished, then the room changes style
  useFrame(() => {
    const s = TF.style
    m.wall.color.lerpColors(RAW_WALL, styleMix(STYLE.wall, s, tmp), Math.min(1, TF.walls))
    for (const key of ['panel', 'floor', 'ceil', 'rug', 'curtain']) styleMix(STYLE[key], s, m[key].color)
    styleMix(STYLE.wood, s, tmp)
    for (const mat of m.woodModels) mat.color.copy(tmp)
    styleMix(STYLE.pillow, s, tmp)
    for (const mat of m.pillows) mat.color.copy(tmp)
    m.led.color.copy(LED_ON).multiplyScalar(Math.min(1, TF.cove))
    m.bulb.emissiveIntensity = 2.4 * Math.min(1, TF.bulb)
  })

  const slats = (x0, x1) => {
    const out = []
    for (let x = x0; x <= x1 + 1e-6; x += 0.09) out.push([x, 1.95, -4.86])
    return out
  }
  const leftSlats = useMemo(() => slats(-5.85, -2.55), [])
  const rightSlats = useMemo(() => slats(2.55, 5.85), [])

  return (
    <group>
      {/* stage 1 · raw concrete shell, a single bare bulb */}
      <Shell floor={m.concrete} wall={m.wall} ceilingMat={m.ceil} windows={[{ x: 0, w: 4.6, sill: 0.3, top: 3.5 }]} sky={m.sky} skirting={false} {...shell} />
      <Anim k="bulb" from={{ y: 1.4 }} position={[0, 0, -1.5]}>
        <Cyl rt={0.005} h={1.1} p={[0, 3.45, 0]} m="blackMetal" seg={6} shadow={false} />
        <Sph radius={0.065} p={[0, 2.86, 0]} m={m.bulb} shadow={false} seg={16} />
      </Anim>

      {/* stage 2 · herringbone parquet rolls out, walls plastered, timber slats rise */}
      <Anim k="floor" from={{ sz: 0 }} position={[0, 0.004, -5]}>
        <Plane s={[12, 10]} r={[-Math.PI / 2, 0, 0]} p={[0, 0, 5]} m={m.floor} />
      </Anim>
      <Anim k="skirt" from={{ sy: 0 }}>
        <B s={[12, 0.1, 0.025]} p={[0, 0.05, -4.98]} m={m.panel} shadow={false} />
        <B s={[0.025, 0.1, 10]} p={[-5.98, 0.05, 0]} m={m.panel} shadow={false} />
      </Anim>
      <Anim k="panels" from={{ sy: 0 }}>
        <InstancedCyl rt={0.034} h={3.9} m={m.panel} items={leftSlats} shadow />
        <InstancedCyl rt={0.034} h={3.9} m={m.panel} items={rightSlats} shadow />
      </Anim>

      {/* stage 3 · real furniture glides in and settles */}
      <Anim k="rug" from={{ sx: 0.02 }} position={[0, 0, -1.7]}>
        <Rug w={4.4} d={3.0} m={m.rug} />
      </Anim>
      {loadReal && (
        <>
          <Anim k="sofa" from={{ x: 7, ry: -0.5 }} position={[0, 0, -3.35]}>
            <Blob w={3.4} d={1.4} />
            <Real>
              <Model id="sofa_02" scale={[1.42, 1.12, 1.12]} mats={m.woodModels} />
            </Real>
          </Anim>
          {/* stage 5 · cushions drop onto the sofa */}
          <Anim k="pillows" from={{ y: 0.8, s: 0.6 }} position={[0, 0, -3.35]}>
            <Real>
              <group position={[-0.75, 0.52, 0.12]} rotation={[-1.25, 0.25, 0]}>
                <Model id="throw_pillows_01" scale={1.15} mats={m.pillows} />
              </group>
            </Real>
          </Anim>
          <Anim k="books" from={{ y: 0.4, s: 0.5 }} position={[-5.5, 0.68, -2.0]} rotation={[0, Math.PI / 2, 0]}>
            <Books count={5} seed={9} />
          </Anim>
          <Anim k="chairL" from={{ x: -4, ry: 1.4 }} position={[-2.45, 0, -1.35]} rotation={[0, Math.PI / 2.6, 0]}>
            <Blob w={1.2} d={1.2} />
            <Real>
              <Model id="modern_arm_chair_01" scale={1.05} />
            </Real>
          </Anim>
          <Anim k="chairR" from={{ x: 4, ry: -1.4 }} position={[2.45, 0, -1.35]} rotation={[0, -Math.PI / 2.6, 0]}>
            <Blob w={1.2} d={1.2} />
            <Real>
              <Model id="modern_arm_chair_01" scale={1.05} />
            </Real>
          </Anim>
          <Anim k="table" from={{ y: 0.9, ry: 0.6 }} position={[0, 0, -1.65]}>
            <Blob w={1.7} d={1.7} />
            <Real>
              <Model id="coffee_table_round_01" scale={0.95} />
            </Real>
          </Anim>
          <Anim k="side" from={{ y: 0.7 }} position={[1.95, 0, -3.5]}>
            <Real>
              <Model id="side_table_tall_01" scale={0.85} mats={m.woodModels} />
            </Real>
          </Anim>
          <Anim k="console" from={{ z: 3 }} position={[-5.5, 0, -1.3]} rotation={[0, Math.PI / 2, 0]}>
            <Blob w={2.8} d={0.9} />
            <Real>
              <Model id="modern_wooden_cabinet" w={2.6} mats={m.woodModels} />
            </Real>
          </Anim>
          <Anim k="lounge" from={{ x: 3, ry: -1 }} position={[4.3, 0, -1.3]} rotation={[0, -0.85, 0]}>
            <Blob w={1.2} d={1.3} />
            <Real>
              <Model id="mid_century_lounge_chair" scale={1} />
            </Real>
          </Anim>
          <Anim k="ottoman" from={{ y: 0.6 }} position={[3.5, 0, -0.15]}>
            <Blob w={0.9} d={0.8} />
            <Real>
              <Model id="Ottoman_01" scale={0.85} rotY={0.4} />
            </Real>
          </Anim>
          <Anim k="shelf" from={{ s: 0 }} position={[4.75, 0, -4.2]}>
            <Blob w={1} d={1} />
            <Real>
              <Model id="potted_plant_01" h={1.9} />
            </Real>
          </Anim>
        </>
      )}

      {/* stage 4 · floating ceiling with hidden LED cove, fixtures, curtains */}
      <Anim k="ceiling" from={{ y: 0.45, s: 0.85 }} position={[0, 0, -1.4]}>
        <B s={[7.4, 0.1, 5.4]} p={[0, 3.74, 0]} m={m.ceil} />
        <B s={[7.2, 0.02, 0.03]} p={[0, 3.68, 2.66]} m={m.led} shadow={false} />
        <B s={[7.2, 0.02, 0.03]} p={[0, 3.68, -2.66]} m={m.led} shadow={false} />
        <B s={[0.03, 0.02, 5.3]} p={[3.66, 3.68, 0]} m={m.led} shadow={false} />
        <B s={[0.03, 0.02, 5.3]} p={[-3.66, 3.68, 0]} m={m.led} shadow={false} />
      </Anim>
      {loadReal && (
        <Anim k="chandelier" from={{ y: 2.2 }} position={[0, 2.62, -1.6]}>
          <Real>
            <Model id="Chandelier_01" h={1.0} />
          </Real>
          <Cyl rt={0.006} h={0.12} p={[0, 1.06, 0]} m="brass" seg={6} shadow={false} />
        </Anim>
      )}
      <Anim k="pendant" from={{ y: 1.6 }} position={[4.3, 0, -3.4]}>
        <PendantGlobe drop={1.45} radius={0.12} ceiling={3.69} />
      </Anim>
      <Anim k="arc" from={{ x: -2, ry: 0.8 }} position={[-3.85, 0, -3.4]} rotation={[0, -0.5, 0]}>
        <ArcFloorLamp />
      </Anim>
      {/* wall lights on the side walls */}
      <Anim k="sconces" from={{ s: 0 }} position={[-5.86, 2.3, -3.6]} rotation={[0, Math.PI / 2, 0]}>
        <WallSconce />
      </Anim>
      <Anim k="sconces" from={{ s: 0 }} position={[5.86, 2.3, -3.6]} rotation={[0, -Math.PI / 2, 0]}>
        <WallSconce />
      </Anim>
      <Anim k="curtains" from={{ x: -1.1, sx: 0.08 }} position={[-2.85, 3.62, -4.7]}>
        <Curtain w={1.15} h={3.45} m={m.curtain} />
      </Anim>
      <Anim k="curtains" from={{ x: 1.1, sx: 0.08 }} position={[2.85, 3.62, -4.7]}>
        <Curtain w={1.15} h={3.45} m={m.curtain} />
      </Anim>

      {/* stage 5 · artwork (real paintings), plants, ceramics */}
      <Anim k="art1" from={{ x: 0.9, s: 0.7 }} position={[-5.88, 2.15, -1.3]} rotation={[0, Math.PI / 2, 0]}>
        <Artwork mat={m.art1} w={1.5} h={1.0} />
      </Anim>
      <Anim k="art2" from={{ x: -0.9, s: 0.7 }} position={[5.88, 1.95, -1.4]} rotation={[0, -Math.PI / 2, 0]}>
        <Artwork mat={m.art2} w={0.85} h={1.1} />
      </Anim>
      {loadReal && (
        <>
          <Anim k="plant1" from={{ s: 0 }} position={[-5.15, 0, -4.25]}>
            <Blob w={0.9} d={0.9} />
            <Real>
              <Model id="potted_plant_01" h={1.55} rotY={1.2} />
            </Real>
          </Anim>
          <Anim k="plant2" from={{ s: 0, y: 0.3 }} position={[1.95, 0.645, -3.5]}>
            <Real>
              <Model id="potted_plant_04" h={0.38} />
            </Real>
          </Anim>
          <Anim k="vase" from={{ s: 0, y: 0.4 }} position={[-2.1, 0, -4.4]}>
            <Blob w={0.6} d={0.6} />
            <Real>
              <Model id="ceramic_vase_01" h={0.85} />
            </Real>
          </Anim>
          <Anim k="decor" from={{ s: 0, y: 0.3 }} position={[-5.5, 0.68, -0.55]}>
            <Real>
              <Model id="ceramic_vase_03" h={0.42} />
            </Real>
          </Anim>
        </>
      )}
    </group>
  )
}

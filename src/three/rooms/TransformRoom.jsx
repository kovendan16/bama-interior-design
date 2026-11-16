import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, useGLTF } from '@react-three/drei'
import { Shell } from './Shell'
import { B, Cyl, Sph, Plane } from '../furniture/primitives'
import { Rug, Books } from '../furniture/living'
import { ArcFloorLamp, WallSconce } from '../furniture/lighting'
import { Curtain } from '../furniture/decor'
import {
  LuxeSofa,
  SofaSoftFurnishing,
  ClubChair,
  TubChair,
  Pouf,
  NestingTables,
  SideTable,
  ArchConsole,
  RingChandelier,
  CeilingFan,
  FlutedColumn,
  BacklitNiche,
  SunburstMirror,
} from '../furniture/luxe'
import { getMat } from '../materials'
import { luxeMarbleTiles, diamondMirror } from '../textures'
import { TF } from '../transformTimeline'
import { store } from '../../lib/store'

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
function Model({ id, w, h, scale, rotY = 0, mats, tint }) {
  const { scene } = useGLTF(MODEL(id))
  const obj = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = true
      o.receiveShadow = true
      o.material = o.material.clone()
      o.material.envMapIntensity = 0.9
      if (tint) o.material = tint(o.material)
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


/* ======================================================= MODERN LUXURY LOOK
 * Cream walls, polished beige marble, a layered cove-lit ceiling, LED ring
 * chandelier, ceiling fan, leather + velvet seating, bronze diamond mirror and
 * gold accents. Only the *contents* of each <Anim> stage changed — every key,
 * entry motion and timeline position is the same as before. */
const WALL = new THREE.Color('#efe5d6')
const RAW_WALL = new THREE.Color('#a19e99')
const LED_ON = new THREE.Color('#ffd49a').multiplyScalar(3)
const NICHE_OFF = new THREE.Color('#6b5848')
const NICHE_ON = new THREE.Color('#f7d29c')

function washTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 128
  const x = c.getContext('2d')
  const g = x.createLinearGradient(0, 0, 0, 128)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.18)')
  g.addColorStop(1, 'rgba(255,255,255,1)')
  x.fillStyle = g
  x.fillRect(0, 0, 4, 128)
  return new THREE.CanvasTexture(c)
}

function useRoomMaterials() {
  return useMemo(() => {
    const floorTex = luxeMarbleTiles()
    floorTex.repeat.set(12 / 2.4, 10 / 2.4)
    const physical = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, ...extra })
    const m = {
      concrete: pbr('concrete_floor_worn_001', [3, 2.5], { color: '#bdb8b1' }),
      wall: pbr('plastered_wall_02', [2.5, 1.2]),
      floorTex,
      // phones: glossy clear-coat marble lit by the HDRI (no extra reflection pass)
      floor: physical('#ffffff', { map: floorTex, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.3 }),
      ceil: new THREE.MeshStandardMaterial({ color: '#f7f2ea', roughness: 0.95 }),
      trim: new THREE.MeshStandardMaterial({ color: '#3b2a20', roughness: 0.5 }),
      darkWood: (() => {
        const w = getMat('walnut').clone()
        w.color = new THREE.Color('#6d5546')
        return w
      })(),
      rug: new THREE.MeshStandardMaterial({
        color: '#4b3527',
        normalMap: lazyTex('/textures/fabric_pattern_07/nor.jpg', { repeat: [7, 5] }),
        normalScale: new THREE.Vector2(1.6, 1.6),
        roughness: 1,
      }),
      curtain: physical('#efe6d6', {
        normalMap: lazyTex('/textures/rough_linen/nor.jpg', { repeat: [2, 3] }),
        roughness: 0.95,
        sheen: 1,
        sheenColor: new THREE.Color('#ffffff'),
        sheenRoughness: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.62,
      }),
      drape: physical('#9b8664', {
        normalMap: lazyTex('/textures/fabric_pattern_07/nor.jpg', { repeat: [2, 4] }),
        roughness: 0.9,
        sheen: 1,
        sheenColor: new THREE.Color('#e9d2a6'),
        sheenRoughness: 0.4,
        side: THREE.DoubleSide,
      }),
      // sea view (Unsplash licence, photo-1507525428034). Slightly below 1.0 so the
      // hero's Bloom pass (threshold 1) never haloes it into a blur.
      sky: new THREE.MeshBasicMaterial({ map: lazyTex('/textures/photos/sea-view.jpg', { color: true }), color: new THREE.Color(0.93, 0.93, 0.93), toneMapped: false }),
      led: new THREE.MeshBasicMaterial({ color: '#000000', toneMapped: false }),
      ringGlow: new THREE.MeshBasicMaterial({ color: '#000000', toneMapped: false }),
      niche: new THREE.MeshBasicMaterial({ color: NICHE_OFF.clone() }),
      wash: new THREE.MeshBasicMaterial({ color: '#ffcf96', map: washTexture(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
      bulb: getMat('lampWarm').clone(),
      leatherCream: physical('#e7dccb', { roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.45 }),
      leatherCognac: physical('#a95a26', { roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.35 }),
      velvetMustard: physical('#c99a1e', { roughness: 0.85, sheen: 1, sheenColor: new THREE.Color('#ffd56a'), sheenRoughness: 0.35 }),
      velvetCharcoal: physical('#38383c', { roughness: 0.9, sheen: 1, sheenColor: new THREE.Color('#8a8a90'), sheenRoughness: 0.4 }),
      throwM: new THREE.MeshStandardMaterial({ color: '#d2a52c', roughness: 0.95, normalMap: lazyTex('/textures/fabric_pattern_07/nor.jpg', { repeat: [1.5, 1.5] }) }),
      gold: new THREE.MeshStandardMaterial({ color: '#d2a865', metalness: 1, roughness: 0.2 }),
      marble: getMat('marbleWhite'),
      mirror: new THREE.MeshStandardMaterial({ map: diamondMirror(), metalness: 0.85, roughness: 0.06, envMapIntensity: 1.6 }),
      mirrorPlain: new THREE.MeshStandardMaterial({ color: '#dcd6cc', metalness: 1, roughness: 0.03 }),
      fanBody: new THREE.MeshStandardMaterial({ color: '#f4f1ec', roughness: 0.4 }),
    }
    m.sky.map.wrapS = m.sky.map.wrapT = THREE.ClampToEdgeWrapping
    m.mirror.map.repeat.set(2.6 / 0.9, 3.4 / 0.9)
    return m
  }, [])
}

// gold pots for the scanned plants
const goldPot = (gold) => (mat) => (/pot/i.test(mat.name) && !/leaves/i.test(mat.name) ? gold : mat)

/** Polished marble floor: real-time reflections on desktop, glossy clear-coat on phones. */
function LuxeFloor({ m, cutaway }) {
  if (store.isMobile) return <Plane s={[12, 10]} r={[-Math.PI / 2, 0, 0]} p={[0, 0, 5]} m={m.floor} />
  // the overhead showcase view sees mostly empty floor — keep its reflection subtler
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 5]} receiveShadow>
      <planeGeometry args={[12, 10]} />
      <MeshReflectorMaterial
        map={m.floorTex}
        blur={cutaway ? [400, 160] : [280, 90]}
        resolution={1024}
        mixBlur={cutaway ? 1 : 0.85}
        mixStrength={cutaway ? 0.7 : 1.5}
        mixContrast={1}
        mirror={cutaway ? 0.3 : 0.55}
        roughness={0.16}
        metalness={0}
        depthScale={0.35}
        minDepthThreshold={0.6}
        maxDepthThreshold={1.3}
      />
    </mesh>
  )
}

/** Layered false ceiling: a floating band with LED coves on both edges and downlights. */
function TrayCeiling({ m, cutaway }) {
  const X = 4.8
  const Z = 3.8
  // the overhead showcase view gets a slimmer, lighter band so it never hides the room
  const bw = cutaway ? 0.38 : 1.4
  const th = cutaway ? 0.08 : 0.18
  const ox = X - bw
  const oz = Z - bw
  const y = cutaway ? 3.7 : 3.66
  const lights = useMemo(() => {
    const out = []
    const run = (a, b, fn) => {
      const n = Math.max(1, Math.round((b - a) / 1.15))
      for (let i = 0; i <= n; i++) out.push(fn(a + ((b - a) * i) / n))
    }
    run(-X + 0.6, X - 0.6, (x) => [x, -Z + bw / 2])
    run(-X + 0.6, X - 0.6, (x) => [x, Z - bw / 2])
    run(-oz + 0.5, oz - 0.5, (z) => [-X + bw / 2, z])
    run(-oz + 0.5, oz - 0.5, (z) => [X - bw / 2, z])
    return out
  }, [bw, oz])
  const edges = [
    { p: [0, -oz], ry: 0, len: ox * 2 },
    { p: [0, oz], ry: Math.PI, len: ox * 2 },
    { p: [-ox, 0], ry: Math.PI / 2, len: oz * 2 },
    { p: [ox, 0], ry: -Math.PI / 2, len: oz * 2 },
  ]
  return (
    <group>
      <B s={[2 * X, th, bw]} p={[0, y, -Z + bw / 2]} m={m.ceil} />
      <B s={[2 * X, th, bw]} p={[0, y, Z - bw / 2]} m={m.ceil} />
      <B s={[bw, th, 2 * oz]} p={[-X + bw / 2, y, 0]} m={m.ceil} />
      <B s={[bw, th, 2 * oz]} p={[X - bw / 2, y, 0]} m={m.ceil} />
      {/* inner cove (top of the band, facing the recess) */}
      <B s={[2 * ox, 0.02, 0.03]} p={[0, y + th / 2 + 0.01, -oz - 0.05]} m={m.led} shadow={false} />
      <B s={[2 * ox, 0.02, 0.03]} p={[0, y + th / 2 + 0.01, oz + 0.05]} m={m.led} shadow={false} />
      <B s={[0.03, 0.02, 2 * oz]} p={[-ox - 0.05, y + th / 2 + 0.01, 0]} m={m.led} shadow={false} />
      <B s={[0.03, 0.02, 2 * oz]} p={[ox + 0.05, y + th / 2 + 0.01, 0]} m={m.led} shadow={false} />
      {/* outer cove (towards the walls) */}
      <B s={[2 * X, 0.02, 0.03]} p={[0, y + th / 2 + 0.01, -Z + 0.05]} m={m.led} shadow={false} />
      <B s={[2 * X, 0.02, 0.03]} p={[0, y + th / 2 + 0.01, Z - 0.05]} m={m.led} shadow={false} />
      <B s={[0.03, 0.02, 2 * Z]} p={[-X + 0.05, y + th / 2 + 0.01, 0]} m={m.led} shadow={false} />
      <B s={[0.03, 0.02, 2 * Z]} p={[X - 0.05, y + th / 2 + 0.01, 0]} m={m.led} shadow={false} />
      {/* recessed downlights */}
      {lights.map(([x, z], i) => (
        <Cyl key={i} rt={0.05} h={0.012} p={[x, y - th / 2 - 0.006, z]} m={m.led} seg={16} shadow={false} />
      ))}
      {/* warm wash the hidden LEDs throw onto the ceiling (only when there is a ceiling) */}
      {!cutaway &&
        edges.map((e, i) => (
          <group key={i} position={[e.p[0], 3.985, e.p[1]]} rotation={[0, e.ry, 0]}>
            <Plane s={[e.len, 0.9]} p={[0, 0, 0.45]} r={[Math.PI / 2, 0, 0]} m={m.wash} renderOrder={2} />
          </group>
        ))}
    </group>
  )
}

/* =================== EMPTY ROOM → DREAM ROOM =================== */
export function TransformRoom({ shell = {}, assetDelay = 0 }) {
  const m = useRoomMaterials()
  const [loadReal, setLoadReal] = useState(false)
  const cutaway = shell.ceiling === false
  const potTint = useMemo(() => goldPot(m.gold), [m])

  // start fetching the photographic assets shortly after the site has loaded
  useEffect(() => {
    const id = setTimeout(() => {
      queue.splice(0).forEach((f) => f())
      setLoadReal(true)
    }, assetDelay)
    return () => clearTimeout(id)
  }, [assetDelay])

  // material morphs: raw → finished walls, then the lights come up
  useFrame(() => {
    m.wall.color.lerpColors(RAW_WALL, WALL, Math.min(1, TF.walls))
    const lights = Math.min(1, TF.lights)
    m.led.color.copy(LED_ON).multiplyScalar(Math.min(1, TF.cove))
    m.wash.opacity = 0.55 * Math.min(1, TF.cove)
    m.ringGlow.color.copy(LED_ON).multiplyScalar(Math.min(1, TF.chandelier) * (0.15 + 0.85 * lights))
    m.niche.color.lerpColors(NICHE_OFF, NICHE_ON, lights)
    m.bulb.emissiveIntensity = 2.4 * Math.min(1, TF.bulb)
  })

  return (
    <group>
      {/* stage 1 · raw concrete shell, a single bare bulb, glass doors to the sea */}
      <Shell floor={m.concrete} wall={m.wall} ceilingMat={m.ceil} windows={[{ x: 0, w: 4.6, sill: 0.05, top: 3.45 }]} sky={m.sky} skirting={false} {...shell} />
      <Anim k="bulb" from={{ y: 1.4 }} position={[0, 0, -1.5]}>
        <Cyl rt={0.005} h={1.1} p={[0, 3.45, 0]} m="blackMetal" seg={6} shadow={false} />
        <Sph radius={0.065} p={[0, 2.86, 0]} m={m.bulb} shadow={false} seg={16} />
      </Anim>

      {/* stage 2 · polished marble rolls out, walls finished, fluted wood + niches rise */}
      <Anim k="floor" from={{ sz: 0 }} position={[0, 0.004, -5]}>
        <LuxeFloor m={m} cutaway={cutaway} />
      </Anim>
      <Anim k="skirt" from={{ sy: 0 }}>
        <B s={[12, 0.1, 0.025]} p={[0, 0.05, -4.98]} m={m.trim} shadow={false} />
        <B s={[0.025, 0.1, 10]} p={[-5.98, 0.05, 0]} m={m.trim} shadow={false} />
        <B s={[0.025, 0.1, 10]} p={[5.98, 0.05, 0]} m={m.trim} shadow={false} />
      </Anim>
      <Anim k="panels" from={{ sy: 0 }}>
        {[-4.6, 4.6].map((x) => (
          <group key={x} position={[x, 0, -4.93]}>
            <BacklitNiche w={1.15} h={2.9} frame={m.darkWood} glow={m.niche} />
          </group>
        ))}
        {[-2.85, 0.25].map((z) => (
          <group key={z} position={[-5.95, 0, z]} rotation={[0, Math.PI / 2, 0]}>
            <FlutedColumn w={0.5} h={3.95} m={m.darkWood} />
          </group>
        ))}
      </Anim>

      {/* stage 3 · furniture glides in and settles */}
      <Anim k="rug" from={{ sx: 0.02 }} position={[0, 0, -1.7]}>
        <Rug w={4.4} d={3.0} m={m.rug} />
      </Anim>
      <Anim k="sofa" from={{ x: 7, ry: -0.5 }} position={[0, 0, -3.35]}>
        <Blob w={3.6} d={1.4} />
        <LuxeSofa w={3.2} m={m.leatherCream} feet={m.gold} />
      </Anim>
      {/* stage 5 · cushions and a throw drop onto the sofa */}
      <Anim k="pillows" from={{ y: 0.8, s: 0.6 }} position={[0, 0, -3.35]}>
        <SofaSoftFurnishing w={3.2} cushion={m.velvetCharcoal} accent={m.velvetMustard} throwM={m.throwM} />
      </Anim>
      <Anim k="books" from={{ y: 0.4, s: 0.5 }} position={[-5.5, 0.86, -1.95]} rotation={[0, Math.PI / 2, 0]}>
        <Books count={4} seed={9} />
      </Anim>
      <Anim k="chairL" from={{ x: -4, ry: 1.4 }} position={[-2.45, 0, -1.35]} rotation={[0, Math.PI / 2.6, 0]}>
        <Blob w={1.2} d={1.2} />
        <ClubChair m={m.leatherCognac} feet={m.gold} />
      </Anim>
      <Anim k="chairR" from={{ x: 4, ry: -1.4 }} position={[2.45, 0, -1.35]} rotation={[0, -Math.PI / 2.6, 0]}>
        <Blob w={1.2} d={1.2} />
        <ClubChair m={m.leatherCognac} feet={m.gold} />
      </Anim>
      <Anim k="table" from={{ y: 0.9, ry: 0.6 }} position={[-0.2, 0, -1.75]}>
        <Blob w={1.9} d={1.5} />
        <NestingTables top={m.marble} frame={m.gold} />
      </Anim>
      <Anim k="side" from={{ y: 0.7 }} position={[1.95, 0, -3.5]}>
        <SideTable top={m.marble} frame={m.gold} />
      </Anim>
      <Anim k="console" from={{ z: 3 }} position={[-5.5, 0, -1.3]} rotation={[0, Math.PI / 2, 0]}>
        <Blob w={2.2} d={0.7} />
        <ArchConsole top={m.marble} frame={m.gold} />
      </Anim>
      <Anim k="lounge" from={{ x: 3, ry: -1 }} position={[4.3, 0, -1.3]} rotation={[0, -0.85, 0]}>
        <Blob w={1.1} d={1.1} />
        <TubChair m={m.velvetMustard} base={m.gold} />
      </Anim>
      <Anim k="ottoman" from={{ y: 0.6 }} position={[3.5, 0, -0.15]}>
        <Blob w={0.8} d={0.8} />
        <Pouf m={m.velvetCharcoal} r={0.28} h={0.4} />
      </Anim>
      {loadReal && (
        <Anim k="shelf" from={{ s: 0 }} position={[4.75, 0, -4.2]}>
          <Blob w={1} d={1} />
          <Real>
            <Model id="potted_plant_01" h={1.9} tint={potTint} />
          </Real>
        </Anim>
      )}

      {/* stage 4 · layered cove ceiling, ring chandelier, fan, lamps, curtains */}
      <Anim k="ceiling" from={{ y: 0.45, s: 0.85 }} position={[0, 0, -1.0]}>
        <TrayCeiling m={m} cutaway={cutaway} />
      </Anim>
      <Anim k="chandelier" from={{ y: 2.2 }} position={[0, 0, -1.6]}>
        <RingChandelier gold={m.gold} glow={m.ringGlow} />
      </Anim>
      <Anim k="pendant" from={{ y: 1.6 }} position={[2.7, 0, 0.6]}>
        <CeilingFan body={m.fanBody} trim={m.gold} spin={() => Math.min(1, TF.pendant)} />
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
      {[-1, 1].map((sx) => (
        <Anim key={sx} k="curtains" from={{ x: sx * 1.1, sx: 0.08 }} position={[sx * 2.85, 3.62, -4.72]}>
          <Curtain w={1.15} h={3.55} m={m.curtain} />
          <group position={[sx * 0.45, 0, 0.13]}>
            <Curtain w={0.8} h={3.55} m={m.drape} />
          </group>
        </Anim>
      ))}

      {/* stage 5 · bronze diamond mirror, sunburst, plants, ceramics */}
      <Anim k="art1" from={{ x: 0.9, s: 0.7 }} position={[-5.93, 0, -1.3]} rotation={[0, Math.PI / 2, 0]}>
        <B s={[2.6, 3.4, 0.02]} p={[0, 1.95, 0]} m={m.mirror} shadow={false} />
        <B s={[2.6, 0.03, 0.04]} p={[0, 3.665, 0.01]} m={m.gold} shadow={false} />
        <B s={[2.6, 0.03, 0.04]} p={[0, 0.235, 0.01]} m={m.gold} shadow={false} />
      </Anim>
      <Anim k="art2" from={{ x: -0.9, s: 0.7 }} position={[5.93, 2.05, -1.4]} rotation={[0, -Math.PI / 2, 0]}>
        <SunburstMirror gold={m.gold} mirror={m.mirrorPlain} r={0.62} />
      </Anim>
      {loadReal && (
        <>
          <Anim k="plant1" from={{ s: 0 }} position={[-5.15, 0, -4.25]}>
            <Blob w={0.9} d={0.9} />
            <Real>
              <Model id="potted_plant_01" h={1.55} rotY={1.2} tint={potTint} />
            </Real>
          </Anim>
          <Anim k="plant2" from={{ s: 0, y: 0.3 }} position={[1.95, 0.615, -3.5]}>
            <Real>
              <Model id="potted_plant_04" h={0.38} />
            </Real>
          </Anim>
          <Anim k="vase" from={{ s: 0, y: 0.4 }} position={[-2.0, 0, -4.4]}>
            <Blob w={0.6} d={0.6} />
            <Real>
              <Model id="ceramic_vase_01" h={0.85} />
            </Real>
          </Anim>
          <Anim k="decor" from={{ s: 0, y: 0.3 }} position={[-5.5, 0.86, -0.7]}>
            <Real>
              <Model id="ceramic_vase_03" h={0.42} />
            </Real>
          </Anim>
        </>
      )}
    </group>
  )
}

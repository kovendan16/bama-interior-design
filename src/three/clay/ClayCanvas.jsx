import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import { MaterialMode, getMat } from '../materials'
import { LivingRoom } from '../rooms/Rooms'
import { Shell } from '../rooms/Shell'
import { B, RB, Cyl, Sph, Plane } from '../furniture/primitives'
import { Sofa, Armchair, CoffeeTable, Ottoman, Rug } from '../furniture/living'
import { Curtain } from '../furniture/decor'
import { clay, MOODBOARD_STEPS, MOODBOARD_LOGO, CURTAIN_OPEN, GALLERY_LIGHTS, GALLERY_FRAMES } from './state'
import { SERVICES_LIST } from '../../lib/sections'
import { store, damp, range, easeInOutCubic, easeOutCubic } from '../../lib/store'

/*
 * CLAY & STORY SCENES
 *   hero      : white architectural model of a room, drifting fragments
 *   moodboard : swatches fly from a designer's board into a model room and
 *               become its floor, walls, sofa, table, curtains and lamp
 *   curtain   : blush linen curtains draw open on a warmly lit corner
 */

const PINK = () => getMat('clayPink')
const WHITE = () => getMat('clayWhite')
const rnd = (seed) => {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

/* ------------------------------------------------------------- lighting */
function ClayLights() {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#e9dde1', 1.35]} />
      <directionalLight
        position={[8, 14, 9]}
        intensity={2.6}
        color="#fff6f2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[-9, 5, -4]} intensity={0.6} color="#ffe3ea" />
    </>
  )
}

/* ------------------------------------------------------------- fragments (hero) */
function Fragments({ count = 120, radius = [4, 10], seed = 7, spread, pinkRatio = 0.18, speed = 1 }) {
  const white = useRef()
  const pink = useRef()
  const items = useMemo(() => {
    const r = rnd(seed)
    return Array.from({ length: count }, () => {
      const dir = new THREE.Vector3(r() * 2 - 1, (r() * 2 - 1) * 0.6, r() * 2 - 1).normalize()
      const dist = radius[0] + r() * (radius[1] - radius[0])
      const kind = r()
      const size =
        kind < 0.45 ? [0.5 + r() * 0.9, 0.025, 0.3 + r() * 0.6] : kind < 0.75 ? [0.04, 0.6 + r() * 1.2, 0.04] : [0.35 + r() * 0.5, 0.35 + r() * 0.5, 0.025]
      return {
        pink: r() < pinkRatio,
        base: dir.multiplyScalar(dist),
        rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
        spin: new THREE.Vector3((r() - 0.5) * 0.6, (r() - 0.5) * 0.6, (r() - 0.5) * 0.6),
        bob: r() * 10,
        size,
      }
    })
  }, [count, seed]) // eslint-disable-line react-hooks/exhaustive-deps
  const counts = useMemo(() => ({ pink: items.filter((i) => i.pink).length, white: items.filter((i) => !i.pink).length }), [items])
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), p: new THREE.Vector3(), s: new THREE.Vector3() }), [])
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    const k = spread ? spread() : 0
    let wi = 0
    let pi = 0
    for (const it of items) {
      tmp.p.copy(it.base).multiplyScalar(1 + k * 0.9)
      tmp.p.y += Math.sin(t * 0.5 + it.bob) * 0.25 + k * 2
      tmp.e.set(it.rot.x + it.spin.x * t, it.rot.y + it.spin.y * t, it.rot.z + it.spin.z * t)
      tmp.q.setFromEuler(tmp.e)
      tmp.s.set(...it.size)
      tmp.m.compose(tmp.p, tmp.q, tmp.s)
      if (it.pink) pink.current?.setMatrixAt(pi++, tmp.m)
      else white.current?.setMatrixAt(wi++, tmp.m)
    }
    if (white.current) white.current.instanceMatrix.needsUpdate = true
    if (pink.current) pink.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh ref={white} args={[geo, WHITE(), counts.white]} castShadow frustumCulled={false} />
      <instancedMesh ref={pink} args={[geo, PINK(), counts.pink]} castShadow frustumCulled={false} />
    </>
  )
}

/* ------------------------------------------------------------- HERO */
function ModelRoom(props) {
  return (
    <group {...props}>
      <MaterialMode.Provider value="clayWhite">
        <LivingRoom shell={{ ceiling: false, left: { door: false } }} curtainsAnimated={false} />
      </MaterialMode.Provider>
      <MaterialMode.Provider value="clayPink">
        <Armchair position={[3.3, 0, 1.4]} rotation={[0, -2.2, 0]} />
        <Ottoman position={[-3.4, 0, 1.8]} />
      </MaterialMode.Provider>
    </group>
  )
}

function HeroScene() {
  const g = useRef()
  const { size } = useThree()
  const narrow = size.width / size.height < 1
  const sm = useRef(0)
  useFrame(({ clock }, dt) => {
    sm.current = damp(sm.current, clay.hero, 6, Math.min(dt, 0.05))
    const p = sm.current
    const t = clock.elapsedTime
    if (!g.current) return
    g.current.rotation.y = -0.62 + p * 0.9 + Math.sin(t * 0.15) * 0.04 + store.pointer.x * 0.06
    g.current.rotation.x = store.pointer.y * -0.03
    g.current.position.y = Math.sin(t * 0.6) * 0.06 + p * 1.6
  })
  return (
    <group position={narrow ? [0, -0.9, 0] : [2.6, -0.5, 0]}>
      <group ref={g}>
        <ModelRoom scale={0.52} position={[0, -0.7, 0]} />
        <Fragments count={narrow ? 45 : 80} radius={[3.4, 7.5]} seed={11} spread={() => clay.hero} />
      </group>
    </group>
  )
}

/* ================================================================ MOODBOARD
 * Every target material is created once with a map slot (white 1×1 texture), so
 * swapping in the real texture when a swatch lands never recompiles a shader. */
const WHITE_TEX = (() => {
  const t = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1)
  t.needsUpdate = true
  t.colorSpace = THREE.SRGBColorSpace
  return t
})()

function useMoodboardMaterials() {
  const [parquet, plaster, linenN] = useTexture(['/textures/herringbone_parquet/diff.jpg', '/textures/plastered_wall_02/diff.jpg', '/textures/rough_linen/nor.jpg'])
  return useMemo(() => {
    const rep = (src, x, y) => {
      const t = src.clone()
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(x, y)
      t.colorSpace = src === linenN ? THREE.NoColorSpace : THREE.SRGBColorSpace
      t.needsUpdate = true
      return t
    }
    const marbleMap = getMat('marbleWhite').map
    const clayColor = new THREE.Color('#f3efee')
    const m = {
      clayColor,
      tex: { floor: rep(parquet, 4, 3.4), walls: rep(plaster, 2.5, 1.2), table: marbleMap },
      // targets inside the model room
      floor: new THREE.MeshStandardMaterial({ map: WHITE_TEX, color: clayColor.clone(), roughness: 0.6 }),
      walls: new THREE.MeshStandardMaterial({ map: WHITE_TEX, color: clayColor.clone(), roughness: 0.92 }),
      sofa: new THREE.MeshPhysicalMaterial({ color: clayColor.clone(), roughness: 0.85, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color('#ffd9e2') }),
      table: new THREE.MeshPhysicalMaterial({ map: WHITE_TEX, color: clayColor.clone(), roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.1 }),
      curtain: new THREE.MeshPhysicalMaterial({ color: '#efdcd8', normalMap: rep(linenN, 2, 3), roughness: 0.95, sheen: 1, sheenColor: new THREE.Color('#ffffff'), side: THREE.DoubleSide }),
      lamp: new THREE.MeshStandardMaterial({ color: clayColor.clone(), metalness: 0, roughness: 0.6 }),
      bulb: new THREE.MeshStandardMaterial({ color: '#fff4e4', emissive: new THREE.Color('#ffcf8a'), emissiveIntensity: 0, toneMapped: false }),
      sky: new THREE.MeshBasicMaterial({ color: '#f7ecee' }),
      board: new THREE.MeshStandardMaterial({ color: '#d9c4c0', roughness: 1 }),
      frame: new THREE.MeshStandardMaterial({ color: '#d8c6c3', roughness: 0.8 }),
      pencil: new THREE.MeshBasicMaterial({ color: '#8a7d80' }),
      // shadow-only ground: the blush page colour shows through, no horizon line
      ground: new THREE.ShadowMaterial({ opacity: 0.16 }),
    }
    // swatch cards show the finished material
    m.swatch = {
      floor: new THREE.MeshStandardMaterial({ map: rep(parquet, 0.5, 0.5), roughness: 0.55 }),
      walls: new THREE.MeshStandardMaterial({ map: rep(plaster, 0.6, 0.6), color: '#f4e6e2', roughness: 0.95 }),
      sofa: new THREE.MeshPhysicalMaterial({ color: '#d98ca0', roughness: 0.8, sheen: 1, sheenColor: new THREE.Color('#ffd9e2') }),
      table: new THREE.MeshPhysicalMaterial({ map: marbleMap, roughness: 0.2, clearcoat: 0.9 }),
      curtain: new THREE.MeshPhysicalMaterial({ color: '#efdcd8', normalMap: rep(linenN, 0.6, 0.6), roughness: 0.95, sheen: 1 }),
      lamp: new THREE.MeshStandardMaterial({ color: '#c9a45c', metalness: 0.35, roughness: 0.35, emissive: new THREE.Color('#3a2a10') }),
    }
    return m
  }, [parquet, plaster, linenN])
}

const SLOTS = [
  [-1.32, 0.62], [0, 0.62], [1.32, 0.62],
  [-1.32, -0.68], [0, -0.68], [1.32, -0.68],
]
// where each swatch lands, in the model room's local space (metres)
const TARGETS = {
  floor: { p: [0, 0.05, 0.5], flat: true },
  walls: { p: [-1.5, 2.2, -4.9] },
  sofa: { p: [0, 0.7, -3.2] },
  table: { p: [0, 0.45, -1.2], flat: true },
  curtain: { p: [2.7, 2.6, -4.6] },
  lamp: { p: [-3.8, 1.5, -3.3] },
}
const PRESS = 0.86 // fraction of a step window when the swatch lands

function Swatch({ i, step, mat, board, room }) {
  const g = useRef()
  const d = useMemo(
    () => ({ s: new THREE.Vector3(), e: new THREE.Vector3(), c: new THREE.Vector3(), qs: new THREE.Quaternion(), qe: new THREE.Quaternion(), tmp: new THREE.Vector3(), ready: false }),
    [],
  )
  useFrame(({ camera }) => {
    const el = g.current
    if (!el || !board.current || !room.current) return
    if (!d.ready) {
      board.current.updateMatrixWorld(true)
      room.current.updateMatrixWorld(true)
      d.s.set(SLOTS[i][0], SLOTS[i][1], 0.08)
      board.current.localToWorld(d.s)
      board.current.getWorldQuaternion(d.qs)
      d.e.set(...TARGETS[step.key].p)
      room.current.localToWorld(d.e)
      d.c.copy(d.s).lerp(d.e, 0.5)
      d.c.y += 2.4
      d.c.z += 1.6
      if (TARGETS[step.key].flat) d.qe.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
      else d.qe.copy(camera.quaternion)
      d.ready = true
    }
    const raw = range(clay.story, ...step.at) / PRESS
    if (raw >= 1) {
      el.visible = false
      return
    }
    el.visible = true
    const t = easeInOutCubic(Math.max(0, raw))
    const u = 1 - t
    // quadratic bezier arc board → room
    el.position.set(0, 0, 0).addScaledVector(d.s, u * u).addScaledVector(d.c, 2 * u * t).addScaledVector(d.e, t * t)
    el.quaternion.slerpQuaternions(d.qs, d.qe, t)
    const lift = Math.sin(Math.min(1, raw * 3) * Math.PI * 0.5) // pop off the board first
    el.scale.setScalar((1 + lift * 0.12) * (1 - t * 0.65))
  })
  return (
    <group ref={g}>
      <RB s={[1.08, 1.08, 0.04]} m={mat} radius={0.06} />
    </group>
  )
}

function Moodboard({ m, boardRef, roomRef }) {
  const logoTex = useTexture('/logo.jpg')
  const logo = useRef()
  const logoMat = useMemo(() => {
    logoTex.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshStandardMaterial({ map: logoTex, roughness: 0.7, transparent: true, opacity: 0 })
  }, [logoTex])
  useFrame(() => {
    const a = range(clay.story, ...MOODBOARD_LOGO)
    if (!logo.current) return
    logo.current.visible = a > 0.001
    const e = easeOutCubic(a)
    logo.current.scale.setScalar(1.35 - 0.35 * e) // pressed into the board
    logo.current.position.z = 0.09 + (1 - e) * 0.5
    logoMat.opacity = Math.min(1, a * 2)
  })
  return (
    <group ref={boardRef} position={[-3.2, 1.55, -0.8]} rotation={[0, 0.38, 0]}>
      {/* linen pin-board with a thin frame */}
      <B s={[4.3, 3.0, 0.08]} m={m.board} />
      <B s={[4.42, 0.06, 0.1]} p={[0, 1.53, 0]} m={m.frame} />
      <B s={[4.42, 0.06, 0.1]} p={[0, -1.53, 0]} m={m.frame} />
      <B s={[0.06, 3.1, 0.1]} p={[-2.18, 0, 0]} m={m.frame} />
      <B s={[0.06, 3.1, 0.1]} p={[2.18, 0, 0]} m={m.frame} />
      {/* pencil outlines where each swatch was pinned, and a pin */}
      {SLOTS.map(([x, y], i) => (
        <group key={i} position={[x, y, 0.045]}>
          <B s={[1.16, 0.012, 0.002]} p={[0, 0.58, 0]} m={m.pencil} shadow={false} />
          <B s={[1.16, 0.012, 0.002]} p={[0, -0.58, 0]} m={m.pencil} shadow={false} />
          <B s={[0.012, 1.16, 0.002]} p={[-0.58, 0, 0]} m={m.pencil} shadow={false} />
          <B s={[0.012, 1.16, 0.002]} p={[0.58, 0, 0]} m={m.pencil} shadow={false} />
          <Sph radius={0.035} p={[0, 0.5, 0.06]} m="clayPink" seg={10} />
        </group>
      ))}
      <mesh ref={logo} position={[0, 0, 0.09]} material={logoMat} visible={false}>
        <circleGeometry args={[0.95, 64]} />
      </mesh>
    </group>
  )
}

function StudyRoom({ m, roomRef }) {
  const curtains = useRef()
  useFrame(() => {
    // curtains unfold once the linen swatch lands
    const c = range(clay.story, MOODBOARD_STEPS[4].at[0] + (MOODBOARD_STEPS[4].at[1] - MOODBOARD_STEPS[4].at[0]) * PRESS, MOODBOARD_STEPS[4].at[1] + 0.04)
    if (curtains.current) {
      curtains.current.visible = c > 0.001
      curtains.current.scale.set(1, Math.max(0.001, easeOutCubic(c)), 1)
    }
  })
  return (
    <group ref={roomRef} position={[2.5, 0, 0.1]} rotation={[0, -0.62, 0]} scale={0.34}>
      <MaterialMode.Provider value="clayWhite">
        <Shell floor={m.floor} wall={m.walls} ceiling={false} left={{ door: false }} windows={[{ x: 0.6, w: 3.8, sill: 0.4, top: 3.2 }]} sky={m.sky} skirting={false} />
        <Sofa position={[0, 0, -3.25]} w={3} m={m.sofa} leg="clayWhite" pillows={['clayWhite', 'clayWhite', 'clayWhite']} />
        <CoffeeTable position={[0, 0, -1.2]} top={m.table} base="clayWhite" />
        <Armchair position={[-2.5, 0, -0.9]} rotation={[0, 1.1, 0]} />
        <Armchair position={[2.5, 0, -0.9]} rotation={[0, -1.1, 0]} />
        <Rug position={[0, 0, -1.6]} w={4.2} d={2.8} />
        <group ref={curtains} position={[0, 3.55, -4.72]}>
          <Curtain position={[-1.75, 0, 0]} w={1} h={3.2} m={m.curtain} />
          <Curtain position={[2.95, 0, 0]} w={1} h={3.2} m={m.curtain} />
        </group>
        {/* the lamp: clay until the brass swatch lands */}
        <group position={[-3.8, 0, -3.3]}>
          <Cyl rt={0.18} h={0.04} p={[0, 0.02, 0]} m={m.lamp} />
          <Cyl rt={0.02} h={1.7} p={[0, 0.87, 0]} m={m.lamp} seg={10} />
          <Cyl rt={0.2} rb={0.32} h={0.36} p={[0, 1.85, 0]} m={m.lamp} seg={32} open />
          <Sph radius={0.08} p={[0, 1.76, 0]} m={m.bulb} shadow={false} seg={14} />
        </group>
      </MaterialMode.Provider>
    </group>
  )
}

function MoodboardScene() {
  const m = useMoodboardMaterials()
  const boardRef = useRef()
  const roomRef = useRef()
  const lampLight = useRef()
  const brass = useMemo(() => new THREE.Color('#c9a45c'), [])
  const velvet = useMemo(() => new THREE.Color('#d98ca0'), [])
  const plasterTint = useMemo(() => new THREE.Color('#f6ebe7'), [])
  const white = useMemo(() => new THREE.Color('#ffffff'), [])

  useFrame(() => {
    const p = clay.story
    const landed = (s) => range(p, s.at[0] + (s.at[1] - s.at[0]) * PRESS, s.at[1])
    const [floor, walls, sofa, table, , lamp] = MOODBOARD_STEPS.map(landed)
    const pulse = (a) => Math.sin(Math.min(1, a) * Math.PI) * 0.35
    // texture swaps (same shader — only the texture uniform changes)
    m.floor.map = floor > 0 ? m.tex.floor : WHITE_TEX
    m.floor.color.lerpColors(m.clayColor, white, Math.min(1, floor * 2))
    m.walls.map = walls > 0 ? m.tex.walls : WHITE_TEX
    m.walls.color.lerpColors(m.clayColor, plasterTint, Math.min(1, walls * 2))
    m.table.map = table > 0 ? m.tex.table : WHITE_TEX
    m.table.color.lerpColors(m.clayColor, white, Math.min(1, table * 2))
    m.sofa.color.lerpColors(m.clayColor, velvet, easeOutCubic(sofa))
    m.lamp.color.lerpColors(m.clayColor, brass, easeOutCubic(lamp))
    m.lamp.metalness = 0.35 * lamp
    m.lamp.roughness = 0.6 - 0.3 * lamp
    m.bulb.emissiveIntensity = 2.6 * lamp
    if (lampLight.current) lampLight.current.intensity = 3.5 * lamp
    // a soft flash when a material lands
    for (const [mat, a] of [[m.floor, floor], [m.walls, walls], [m.sofa, sofa], [m.table, table]]) mat.emissive.setScalar(pulse(a) * 0.25)
  })

  return (
    <group position={[0, -0.6, 0]}>
      <Plane s={[40, 40]} r={[-Math.PI / 2, 0, 0]} p={[0, 0, 0]} m={m.ground} receiveShadow />
      <Moodboard m={m} boardRef={boardRef} roomRef={roomRef} />
      <StudyRoom m={m} roomRef={roomRef} />
      {MOODBOARD_STEPS.map((s, i) => (
        <Swatch key={s.key} i={i} step={s} mat={m.swatch[s.key]} board={boardRef} room={roomRef} />
      ))}
      <pointLight ref={lampLight} position={[1.0, 1.0, 1.4]} intensity={0} distance={4} color="#ffc98a" />
    </group>
  )
}

/* ================================================================ CURTAIN REVEAL */
const MODEL = (id) => `/models/${id}/${id}_1k.gltf`
function Model({ id, h, scale, rotY = 0 }) {
  const { scene } = useGLTF(MODEL(id))
  const obj = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    root.rotation.y = rotY
    root.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    root.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2)
    const g = new THREE.Group()
    g.add(root)
    g.scale.setScalar(scale ?? (h ? h / size.y : 1))
    return g
  }, [scene]) // eslint-disable-line react-hooks/exhaustive-deps
  return <primitive object={obj} />
}

/*
 * Gallery wall for the closing scene: once the curtains are open, brass picture
 * lights switch on and every service photo appears on the wall, framed.
 */
const WALL_Z = -2.97
function ServiceGallery({ narrow, brass }) {
  const list = narrow ? SERVICES_LIST.slice(0, 4) : SERVICES_LIST
  const tex = useTexture(list.map((s) => s.img))
  const cols = narrow ? 2 : 4
  const w = narrow ? 1.25 : 1.36
  const h = w * 0.68
  const gx = narrow ? 0.26 : 0.34
  const gy = 0.42
  const rows = Math.ceil(list.length / cols)
  const cy = narrow ? 2.75 : 2.62

  const items = useMemo(
    () =>
      list.map((s, i) => {
        const c = i % cols
        const r = Math.floor(i / cols)
        return { x: (c - (cols - 1) / 2) * (w + gx), y: cy + ((rows - 1) / 2 - r) * (h + gy) }
      }),
    [list, cols, rows, w, h, gx, gy, cy],
  )

  const mats = useMemo(() => {
    const photos = tex.map((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      // "cover" crop so every photo fills its frame without stretching
      const ia = t.image ? t.image.width / t.image.height : 1.5
      const fa = w / h
      t.repeat.set(ia > fa ? fa / ia : 1, ia > fa ? 1 : ia / fa)
      t.offset.set((1 - t.repeat.x) / 2, (1 - t.repeat.y) / 2)
      t.needsUpdate = true
      return new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0, roughness: 0.55, transparent: true, opacity: 0 })
    })
    return {
      photos,
      frame: new THREE.MeshStandardMaterial({ color: '#1b1412', roughness: 0.5, metalness: 0.1, transparent: true, opacity: 0 }),
      mat: new THREE.MeshStandardMaterial({ color: '#f6efe9', roughness: 0.9, transparent: true, opacity: 0 }),
      glow: new THREE.MeshStandardMaterial({ color: '#fff3dc', emissive: new THREE.Color('#ffcf8f'), emissiveIntensity: 0, toneMapped: false }),
    }
  }, [tex, w, h])

  // one wall-washing spotlight per column
  const spots = useMemo(
    () =>
      Array.from({ length: cols }, (_, c) => {
        const t = new THREE.Object3D()
        t.position.set((c - (cols - 1) / 2) * (w + gx), cy - 0.3, WALL_Z)
        return t
      }),
    [cols, w, gx, cy],
  )
  const spotRefs = useRef([])
  const fill = useRef()
  const groups = useRef([])
  const sm = useRef(0)

  useFrame((_, dt) => {
    sm.current = damp(sm.current, clay.cta, 6, Math.min(dt, 0.05))
    const L = easeInOutCubic(range(sm.current, ...GALLERY_LIGHTS))
    const F = range(sm.current, ...GALLERY_FRAMES)
    const e = easeOutCubic(F)
    mats.glow.emissiveIntensity = L * 3.2
    spotRefs.current.forEach((s) => s && (s.intensity = L * (narrow ? 26 : 30)))
    if (fill.current) fill.current.intensity = L * 0.5
    mats.frame.opacity = mats.mat.opacity = e
    mats.photos.forEach((m) => {
      m.opacity = e
      m.emissiveIntensity = e * L * 0.22
    })
    groups.current.forEach((g, i) => {
      if (!g) return
      g.visible = F > 0.001
      const k = 0.9 + 0.1 * e
      g.scale.set(k, k, 1)
      g.position.y = items[i].y + (1 - e) * 0.18
    })
  })

  const fw = w + 0.16
  const fh = h + 0.16
  return (
    <group>
      {items.map((it, i) => (
        <group key={i}>
          {/* brass picture light — always on the wall, switches on first */}
          <group position={[it.x, it.y + fh / 2 + 0.16, WALL_Z]}>
            <B s={[0.03, 0.03, 0.14]} p={[0, 0, 0.07]} m={brass} shadow={false} />
            <Cyl rt={0.026} h={w * 0.55} r={[0, 0, Math.PI / 2]} p={[0, 0, 0.15]} m={brass} seg={12} shadow={false} />
            <B s={[w * 0.5, 0.012, 0.03]} p={[0, -0.026, 0.15]} m={mats.glow} shadow={false} castShadow={false} />
          </group>
          {/* the framed photo */}
          <group ref={(el) => (groups.current[i] = el)} position={[it.x, it.y, WALL_Z]} visible={false}>
            <B s={[fw, fh, 0.05]} p={[0, 0, 0.025]} m={mats.frame} shadow={false} />
            <Plane s={[w + 0.06, h + 0.06]} p={[0, 0, 0.052]} m={mats.mat} />
            <Plane s={[w - 0.08, h - 0.08]} p={[0, 0, 0.055]} m={mats.photos[i]} />
          </group>
        </group>
      ))}
      {spots.map((t, c) => (
        <group key={c}>
          <primitive object={t} />
          <spotLight
            ref={(el) => {
              spotRefs.current[c] = el
              if (el) el.target = t
            }}
            position={[t.position.x, cy + rows * 0.9, WALL_Z + 2.2]}
            angle={0.42}
            penumbra={0.85}
            distance={9}
            decay={1.4}
            intensity={0}
            color="#ffd9a8"
          />
        </group>
      ))}
      <hemisphereLight ref={fill} args={['#ffe9d6', '#3a2622', 0]} />
    </group>
  )
}

function CurtainScene() {
  const [parquet, plaster, linenN] = useTexture([
    '/textures/herringbone_parquet/diff.jpg',
    '/textures/plastered_wall_02/diff.jpg',
    '/textures/rough_linen/nor.jpg',
  ])
  const { size } = useThree()
  const narrow = size.width / size.height < 1
  const mats = useMemo(() => {
    const rep = (t, x, y, srgb = true) => {
      const c = t.clone()
      c.wrapS = c.wrapT = THREE.RepeatWrapping
      c.repeat.set(x, y)
      c.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
      c.needsUpdate = true
      return c
    }
    return {
      floor: new THREE.MeshStandardMaterial({ map: rep(parquet, 3, 2), roughness: 0.55 }),
      wall: new THREE.MeshStandardMaterial({ map: rep(plaster, 3, 1.5), color: '#e8cfcb', roughness: 0.95 }),
      curtain: new THREE.MeshPhysicalMaterial({ color: '#e9c3c8', normalMap: rep(linenN, 3, 5, false), roughness: 0.92, sheen: 1, sheenColor: new THREE.Color('#fff0f2'), sheenRoughness: 0.5, side: THREE.DoubleSide }),
      brass: getMat('brass'),
      globe: new THREE.MeshStandardMaterial({ color: '#fff3e2', emissive: new THREE.Color('#ffcf8f'), emissiveIntensity: 2.2, toneMapped: false }),
    }
  }, [parquet, plaster, linenN])
  const left = useRef()
  const right = useRef()
  const lamp = useRef()
  const sm = useRef(0)
  useFrame(({ clock }, dt) => {
    sm.current = damp(sm.current, range(clay.cta, ...CURTAIN_OPEN), 5, Math.min(dt, 0.05))
    const o = easeInOutCubic(sm.current)
    const w = narrow ? 2.2 : 3.6
    if (left.current) {
      left.current.position.x = -w * 0.5 - o * w * 0.95
      left.current.scale.x = 1 - o * 0.55
    }
    if (right.current) {
      right.current.position.x = w * 0.5 + o * w * 0.95
      right.current.scale.x = 1 - o * 0.55
    }
    if (lamp.current) lamp.current.intensity = 5.5 + Math.sin(clock.elapsedTime * 1.3) * 0.25
  })
  const cw = narrow ? 2.4 : 3.8
  const lampX = narrow ? -1.45 : -3.4
  return (
    <group>
      {/* warm corner */}
      <Plane s={[16, 10]} r={[-Math.PI / 2, 0, 0]} p={[0, 0, -1]} m={mats.floor} />
      <Plane s={[16, 7]} p={[0, 3.5, -3]} m={mats.wall} />
      <Suspense fallback={null}>
        <ServiceGallery narrow={narrow} brass={mats.brass} />
      </Suspense>
      <Suspense fallback={null}>
        <group position={[1.15, 0, -1.4]} rotation={[0, -0.55, 0]}>
          <Model id="mid_century_lounge_chair" scale={1.05} />
        </group>
        <group position={[2.6, 0, -2.3]}>
          <Model id="potted_plant_01" h={1.7} />
        </group>
      </Suspense>
      <group position={[lampX, 0, -2.2]}>
        <Cyl rt={0.16} h={0.03} p={[0, 0.015, 0]} m={mats.brass} />
        <Cyl rt={0.014} h={1.55} p={[0, 0.79, 0]} m={mats.brass} seg={10} />
        <Sph radius={0.17} p={[0, 1.7, 0]} m={mats.globe} shadow={false} seg={24} />
      </group>
      <pointLight ref={lamp} position={[lampX, 1.7, -1.9]} intensity={5.5} distance={7} decay={1.6} color="#ffc488" castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={['#ffe9e4', '#3a2622', 0.35]} />
      <directionalLight position={[-6, 6, 3]} intensity={0.9} color="#ffd7c2" castShadow shadow-mapSize={[1024, 1024]} />

      {/* the curtains, close to the camera */}
      <group position={[0, 4.4, 2.6]}>
        <Cyl rt={0.03} h={14} r={[0, 0, Math.PI / 2]} p={[0, 0.03, 0]} m={mats.brass} seg={12} />
        <group ref={left}>
          <Curtain w={cw} h={8.5} m={mats.curtain} />
        </group>
        <group ref={right}>
          <Curtain w={cw} h={8.5} m={mats.curtain} />
        </group>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------- canvas */
const SETUPS = {
  hero: { cam: { position: [13, 9.5, 14], fov: 30 }, look: [0, 0.6, 0], Scene: HeroScene, lights: true, exposure: 1.08 },
  moodboard: { cam: { position: [0.4, 3.4, 10.5], fov: 34 }, look: [0, 0.75, 0], Scene: MoodboardScene, lights: true, exposure: 1.05 },
  curtain: { cam: { position: [0, 1.55, 7], fov: 42 }, look: [0, 1.35, 0], Scene: CurtainScene, lights: false, exposure: 1.0, bg: '#2a1d1c' },
}

function CameraSetup({ look, base, narrowBack = 1 }) {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.position.set(...base).multiplyScalar(size.width / size.height < 1 ? narrowBack : 1)
    camera.lookAt(...look)
    camera.updateProjectionMatrix()
  }, [camera, look, base, size.width, size.height, narrowBack])
  return null
}

export default function ClayCanvas({ scene = 'hero', isMobile = false, paused = false }) {
  const s = SETUPS[scene]
  return (
    <Canvas
      shadows
      dpr={[1, isMobile ? 1.3 : 1.7]}
      frameloop={paused ? 'never' : 'always'}
      camera={s.cam}
      gl={{ antialias: true, alpha: !s.bg, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene: sc }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = s.exposure
        gl.shadowMap.type = THREE.PCFSoftShadowMap
        if (s.bg) sc.background = new THREE.Color(s.bg)
      }}
    >
      <CameraSetup look={s.look} base={s.cam.position} narrowBack={scene === 'moodboard' ? 1.45 : 1} />
      {s.lights && <ClayLights />}
      <Suspense fallback={null}>
        <s.Scene />
      </Suspense>
    </Canvas>
  )
}

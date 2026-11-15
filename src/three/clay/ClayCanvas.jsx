import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MaterialMode, getMat } from '../materials'
import { LivingRoom } from '../rooms/Rooms'
import { DiningChair, Stool, Bench } from '../furniture/rooms-furniture'
import { Vase, Bowl, Books, Armchair, SideTable, Ottoman } from '../furniture/living'
import { PendantGlobe, FloorLamp } from '../furniture/lighting'
import { Plant } from '../furniture/decor'
import { clay } from './state'
import { store, damp, range, easeInOutCubic } from '../../lib/store'

/*
 * CLAY SCENES — white architectural-model look (like a physical maquette).
 *   hero  : floating cut-away room surrounded by drifting fragments
 *   story : room → explodes into pieces → swarm of "idea" words → rebuilt home
 *   cta   : furniture and fragments tumbling in space behind "Let's create together."
 */

const PINK = () => getMat('clayPink')
const WHITE = () => getMat('clayWhite')
const rnd = (seed) => {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

/* ------------------------------------------------------------- lighting */
function ClayLights({ dark = false }) {
  return (
    <>
      <hemisphereLight args={['#ffffff', dark ? '#3a2c33' : '#e9dde1', dark ? 1.1 : 1.35]} />
      <directionalLight
        position={[8, 14, 9]}
        intensity={dark ? 2.2 : 2.6}
        color="#fff6f2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={6}
      />
      <directionalLight position={[-9, 5, -4]} intensity={0.6} color="#ffe3ea" />
    </>
  )
}

/* ------------------------------------------------------------- fragments
 * Thin architectural shards (panels, slats, frames) drifting around. */
function Fragments({ count = 120, radius = [4, 10], seed = 7, spread, pinkRatio = 0.18, speed = 1 }) {
  const white = useRef()
  const pink = useRef()
  const items = useMemo(() => {
    const r = rnd(seed)
    return Array.from({ length: count }, (_, i) => {
      const dir = new THREE.Vector3(r() * 2 - 1, (r() * 2 - 1) * 0.6, r() * 2 - 1).normalize()
      const dist = radius[0] + r() * (radius[1] - radius[0])
      const kind = r()
      const size =
        kind < 0.45 ? [0.5 + r() * 0.9, 0.025, 0.3 + r() * 0.6] // panel
          : kind < 0.75 ? [0.04, 0.6 + r() * 1.2, 0.04] // slat
            : [0.35 + r() * 0.5, 0.35 + r() * 0.5, 0.025] // tile / frame
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
  const m = useMemo(() => new THREE.Matrix4(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const e = useMemo(() => new THREE.Euler(), [])
  const p = useMemo(() => new THREE.Vector3(), [])
  const s = useMemo(() => new THREE.Vector3(), [])
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    const k = spread ? spread() : 0
    let wi = 0
    let pi = 0
    for (const it of items) {
      p.copy(it.base).multiplyScalar(1 + k * 0.9)
      p.y += Math.sin(t * 0.5 + it.bob) * 0.25 + k * 2
      e.set(it.rot.x + it.spin.x * t, it.rot.y + it.spin.y * t, it.rot.z + it.spin.z * t)
      q.setFromEuler(e)
      s.set(...it.size)
      m.compose(p, q, s)
      if (it.pink) pink.current?.setMatrixAt(pi++, m)
      else white.current?.setMatrixAt(wi++, m)
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

/* ------------------------------------------------------------- model room */
function ModelRoom(props) {
  return (
    <group {...props}>
      <MaterialMode.Provider value="clayWhite">
        <LivingRoom shell={{ ceiling: false, left: { door: false } }} curtainsAnimated={false} />
      </MaterialMode.Provider>
      {/* a few blush pieces, like accent furniture in an architect's model */}
      <MaterialMode.Provider value="clayPink">
        <Armchair position={[3.3, 0, 1.4]} rotation={[0, -2.2, 0]} />
        <Ottoman position={[-3.4, 0, 1.8]} />
      </MaterialMode.Provider>
    </group>
  )
}

/* ------------------------------------------------------------- HERO */
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

/* ------------------------------------------------------------- STORY
 * explode(): every mesh of the room flies out along its direction from the
 * room centre (and tumbles), then flies back — a generic, data-free explosion. */
function useExploder(groupRef) {
  const parts = useRef(null)
  const tmp = useMemo(() => ({ c: new THREE.Vector3(), w: new THREE.Vector3(), box: new THREE.Box3(), inv: new THREE.Matrix4() }), [])
  const init = () => {
    const root = groupRef.current
    if (!root) return null
    root.updateMatrixWorld(true)
    tmp.box.setFromObject(root).getCenter(tmp.c)
    const r = rnd(5)
    const list = []
    root.traverse((o) => {
      if (!o.isMesh || !o.parent) return
      o.getWorldPosition(tmp.w)
      const dirW = tmp.w.clone().sub(tmp.c)
      dirW.y = Math.abs(dirW.y) + 0.6
      // big pieces (walls, floor) travel less than small ones, so they never fill the screen
      const big = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()).length()
      dirW.normalize().multiplyScalar((2.5 + r() * 5) * Math.min(1, Math.max(0.18, 1.6 / Math.max(big, 0.01))))
      // world direction → parent-local direction
      tmp.inv.copy(o.parent.matrixWorld).invert()
      const dirL = dirW.clone().transformDirection(tmp.inv).multiplyScalar(dirW.length() / o.parent.getWorldScale(new THREE.Vector3()).x)
      list.push({ o, pos: o.position.clone(), rot: o.rotation.clone(), off: dirL, spin: new THREE.Vector3(r() * 4 - 2, r() * 4 - 2, r() * 4 - 2) })
    })
    return list
  }
  return (amount) => {
    if (!parts.current) parts.current = init()
    if (!parts.current) return
    const a = amount
    for (const it of parts.current) {
      it.o.position.copy(it.pos).addScaledVector(it.off, a)
      it.o.rotation.set(it.rot.x + it.spin.x * a, it.rot.y + it.spin.y * a, it.rot.z + it.spin.z * a)
    }
  }
}

function wordTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 96
  const x = c.getContext('2d')
  x.fillStyle = '#ffffff'
  x.font = '600 72px "Inter Tight", "Helvetica Neue", Arial, sans-serif'
  x.textBaseline = 'middle'
  x.fillText('idea', 18, 50)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function WordSwarm({ count = 260, swarm, gather }) {
  const white = useRef()
  const pink = useRef()
  const { camera } = useThree()
  const tex = useMemo(wordTexture, [])
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 0.375), [])
  const mats = useMemo(
    () => [
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: '#ffffff', opacity: 0.9 }),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: '#f3a9bb' }),
    ],
    [tex],
  )
  const items = useMemo(() => {
    const r = rnd(21)
    return Array.from({ length: count }, () => {
      const dir = new THREE.Vector3(r() * 2 - 1, (r() * 2 - 1) * 0.55, r() * 2 - 1).normalize()
      return {
        pink: r() < 0.16,
        from: dir.clone().multiplyScalar(18 + r() * 10),
        to: dir.clone().multiplyScalar(2.2 + r() * 4.5),
        s: 0.45 + r() * 0.9,
        orbit: 0.15 + r() * 0.35,
        delay: r() * 0.35,
      }
    })
  }, [count])
  const counts = useMemo(() => ({ pink: items.filter((i) => i.pink).length, white: items.filter((i) => !i.pink).length }), [items])
  const m = useMemo(() => new THREE.Matrix4(), [])
  const p = useMemo(() => new THREE.Vector3(), [])
  const sc = useMemo(() => new THREE.Vector3(), [])
  const axis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  useFrame(({ clock }) => {
    const sw = swarm()
    const ga = gather()
    const vis = sw > 0.001 && ga < 0.999
    if (white.current) white.current.visible = vis
    if (pink.current) pink.current.visible = vis
    if (!vis) return
    const t = clock.elapsedTime
    let wi = 0
    let pi = 0
    for (const it of items) {
      const a = easeInOutCubic(Math.min(1, Math.max(0, (sw - it.delay) / (1 - it.delay))))
      p.lerpVectors(it.from, it.to, a).applyAxisAngle(axis, t * it.orbit * 0.4)
      p.multiplyScalar(1 - ga) // gather into the centre
      const k = it.s * a * (1 - ga * ga)
      sc.set(k, k, k)
      m.compose(p, camera.quaternion, sc)
      if (it.pink) pink.current.setMatrixAt(pi++, m)
      else white.current.setMatrixAt(wi++, m)
    }
    white.current.instanceMatrix.needsUpdate = true
    pink.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh ref={white} args={[geo, mats[0], counts.white]} frustumCulled={false} />
      <instancedMesh ref={pink} args={[geo, mats[1], counts.pink]} frustumCulled={false} />
    </>
  )
}

// story phases (fractions of the pinned scroll)
export const STORY = {
  explode: [0.16, 0.38],
  swarm: [0.3, 0.52],
  gather: [0.54, 0.66],
  rebuild: [0.7, 0.92],
}

function StoryScene() {
  const room = useRef()
  const spin = useRef()
  const explode = useExploder(room)
  const sm = useRef(0)
  const v = useRef({ ex: 0, sw: 0, ga: 0 })
  useFrame(({ clock }, dt) => {
    sm.current = damp(sm.current, clay.story, 7, Math.min(dt, 0.05))
    const p = sm.current
    const ex = easeInOutCubic(range(p, ...STORY.explode)) * (1 - easeInOutCubic(range(p, ...STORY.rebuild)))
    v.current.sw = range(p, ...STORY.swarm)
    v.current.ga = range(p, ...STORY.gather)
    explode(ex)
    if (spin.current) {
      spin.current.rotation.y = -0.7 + p * 1.6 + Math.sin(clock.elapsedTime * 0.2) * 0.03
      // the exploded room shrinks away while the words take over, then returns
      const away = range(p, 0.42, 0.58) * (1 - range(p, 0.66, 0.84))
      spin.current.scale.setScalar(1 - away * 0.75)
    }
  })
  return (
    <group position={[0, -0.5, 0]}>
      <group ref={spin}>
        <group ref={room}>
          <ModelRoom scale={0.4} position={[0, -0.4, 0]} />
        </group>
        <Fragments count={60} radius={[5, 10]} seed={33} spread={() => v.current.sw * 0.6} pinkRatio={0.25} />
      </group>
      <WordSwarm swarm={() => v.current.sw} gather={() => v.current.ga} />
    </group>
  )
}

/* ------------------------------------------------------------- CTA */
const PROPS = [
  (k) => <DiningChair key={k} />,
  (k) => <Stool key={k} />,
  (k) => <Vase key={k} kind="tall" />,
  (k) => <Bowl key={k} />,
  (k) => <Books key={k} count={4} />,
  (k) => <SideTable key={k} />,
  (k) => <PendantGlobe key={k} drop={0.3} ceiling={0.5} swing={false} />,
  (k) => <FloorLamp key={k} />,
  (k) => <Plant key={k} height={0.9} leaves={14} seed={k} />,
  (k) => <Bench key={k} w={1} />,
]

function Tumbler({ seed, children }) {
  const g = useRef()
  const d = useMemo(() => {
    const r = rnd(seed)
    return {
      p: new THREE.Vector3(r() * 22 - 11, r() * 14 - 7, -r() * 9 - 1),
      rot: new THREE.Vector3(r() * 6, r() * 6, r() * 6),
      spin: new THREE.Vector3((r() - 0.5) * 0.5, (r() - 0.5) * 0.5, (r() - 0.5) * 0.4),
      rise: 0.15 + r() * 0.25,
      s: 0.55 + r() * 0.5,
    }
  }, [seed])
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.elapsedTime
    const y = ((d.p.y + 7 + t * d.rise + clay.cta * 6) % 14) - 7
    g.current.position.set(d.p.x + store.pointer.x * 0.4 * (1 + d.p.z * -0.1), y, d.p.z)
    g.current.rotation.set(d.rot.x + d.spin.x * t, d.rot.y + d.spin.y * t, d.rot.z + d.spin.z * t)
    g.current.scale.setScalar(d.s)
  })
  return <group ref={g}>{children}</group>
}

function CtaScene() {
  const list = useMemo(() => Array.from({ length: 34 }, (_, i) => i), [])
  return (
    <group>
      {list.map((i) => (
        <MaterialMode.Provider key={i} value={i % 4 === 0 ? 'clayPink' : 'clayWhite'}>
          <Tumbler seed={100 + i * 7}>{PROPS[i % PROPS.length](i)}</Tumbler>
        </MaterialMode.Provider>
      ))}
      <Fragments count={90} radius={[3, 12]} seed={51} pinkRatio={0.22} speed={0.7} />
    </group>
  )
}

/* ------------------------------------------------------------- canvas */
const SETUPS = {
  hero: { cam: { position: [13, 9.5, 14], fov: 30 }, look: [0, 0.6, 0], dark: false, Scene: HeroScene },
  story: { cam: { position: [12, 9, 13.5], fov: 34 }, look: [0, 0.2, 0], dark: true, Scene: StoryScene },
  cta: { cam: { position: [0, 0, 12], fov: 42 }, look: [0, 0, 0], dark: true, Scene: CtaScene },
}

function LookAt({ target }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(...target)
  }, [camera, target])
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
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = s.dark ? 1.0 : 1.08
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <LookAt target={s.look} />
      <ClayLights dark={s.dark} />
      <s.Scene />
    </Canvas>
  )
}

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Shell } from './Shell'
import { Reveal } from './Reveal'
import { B, Cyl, Sph, Plane, Torus, geo } from '../furniture/primitives'
import { Sofa, Armchair, LoungeChair, CoffeeTable, SideTable, Rug, RoundRug, MediaConsole, WallArt, Shelving, Ottoman, Vase, Bowl } from '../furniture/living'
import { Chandelier, ArcFloorLamp, PendantGlobe, CoveLight, WallSconce, FloorLamp } from '../furniture/lighting'
import { Plant, Curtain, Sculpture } from '../furniture/decor'
import { DiningTable, DiningChair } from '../furniture/rooms-furniture'
import { getMat, MaterialMode, useMat } from '../materials'
import { store, range, damp, lerp } from '../../lib/store'

const P = (id) => () => store.progress[id] || 0

/* =================== EMPTY ROOM → DREAM ROOM =================== */
export function TransformRoom({ shell = {} }) {
  const src = P('transform')
  // per-room clones so only this room's walls change colour
  const wallMat = useMemo(() => {
    const m = getMat('wallWarm').clone()
    m.color.set('#a6a29c')
    return m
  }, [])
  const raw = useMemo(() => new THREE.Color('#a6a29c'), [])
  const finished = useMemo(() => new THREE.Color('#e3d8c8'), [])
  useFrame(() => {
    const t = range(src(), 0.08, 0.22)
    wallMat.color.lerpColors(raw, finished, t)
  })
  return (
    <group>
      <Shell floor="concreteFloor" wall={wallMat} windows={[{ x: 0, w: 4.6, sill: 0.3, top: 3.5 }]} sky="skyGolden" skirting={false} {...shell} />
      {/* surfaces */}
      <Reveal source={src} at={[0.06, 0.2]} type="spread" position={[0, 0.003, 0]}>
        <Plane s={[12, 10]} r={[-Math.PI / 2, 0, 0]} m="floorOak" />
      </Reveal>
      <Reveal source={src} at={[0.14, 0.22]} type="rise">
        <B s={[12, 0.09, 0.02]} p={[0, 0.045, -4.99]} m="walnut" shadow={false} />
      </Reveal>
      {/* furniture */}
      <Reveal source={src} at={[0.22, 0.28]} type="unroll" position={[0, 0, -1.6]}>
        <Rug w={4} d={2.8} m="rugClassic" />
      </Reveal>
      <Reveal source={src} at={[0.26, 0.34]} type="drop" position={[0, 0, -3.25]}>
        <Sofa w={3} m="fabricBoucle" pillows={['velvetNavy', 'fabricSand', 'velvetRust']} />
      </Reveal>
      <Reveal source={src} at={[0.3, 0.38]} type="drop" position={[-2.3, 0, -1.2]} rotation={[0, Math.PI / 2.4, 0]}>
        <Armchair m="velvetNavy" leg="brass" />
      </Reveal>
      <Reveal source={src} at={[0.33, 0.41]} type="drop" position={[2.3, 0, -1.2]} rotation={[0, -Math.PI / 2.4, 0]}>
        <Armchair m="velvetNavy" leg="brass" />
      </Reveal>
      <Reveal source={src} at={[0.36, 0.44]} type="drop" position={[0, 0, -1.5]}>
        <CoffeeTable top="marbleGreen" base="brassBrushed" />
      </Reveal>
      <Reveal source={src} at={[0.39, 0.47]} type="drop" position={[1.95, 0, -3.35]}>
        <SideTable />
      </Reveal>
      <Reveal source={src} at={[0.41, 0.49]} type="drop" position={[-5.65, 0, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        <MediaConsole w={2.4} m="walnut" />
      </Reveal>
      <Reveal source={src} at={[0.44, 0.53]} type="rise" position={[4.35, 0, -4.78]}>
        <Shelving w={2.2} h={2.6} seed={61} m="walnut" />
      </Reveal>
      <Reveal source={src} at={[0.47, 0.55]} type="drop" position={[4.2, 0, -1.2]} rotation={[0, -0.9, 0]}>
        <LoungeChair m="leatherCognac" />
      </Reveal>
      <Reveal source={src} at={[0.5, 0.56]} type="drop" position={[3.6, 0, -0.3]}>
        <Ottoman />
      </Reveal>
      {/* lighting */}
      <Reveal source={src} at={[0.56, 0.66]} type="descend" amount={2.2} position={[0, 0, -1.5]}>
        <Chandelier drop={1.0} />
      </Reveal>
      <Reveal source={src} at={[0.58, 0.68]} type="drop" position={[-3.8, 0, -3.4]} rotation={[0, -0.5, 0]}>
        <ArcFloorLamp />
      </Reveal>
      <Reveal source={src} at={[0.6, 0.7]} type="flicker">
        <CoveLight />
      </Reveal>
      <Reveal source={src} at={[0.62, 0.7]} type="descend" amount={1.5} position={[4.3, 0, -3.6]}>
        <PendantGlobe drop={1.6} radius={0.12} />
      </Reveal>
      {/* styling */}
      <Reveal source={src} at={[0.7, 0.8]} type="slideX" amount={-1.2} position={[-2.9, 3.6, -4.72]}>
        <Curtain w={1.1} h={3.45} />
      </Reveal>
      <Reveal source={src} at={[0.7, 0.8]} type="slideX" amount={1.2} position={[2.9, 3.6, -4.72]}>
        <Curtain w={1.1} h={3.45} />
      </Reveal>
      <Reveal source={src} at={[0.74, 0.82]} type="wall" amount={0.8} position={[-5.87, 1.9, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        <WallArt w={1.6} h={1.05} art="art1" frame="brass" />
      </Reveal>
      <Reveal source={src} at={[0.76, 0.84]} type="wall" amount={0.8} position={[5.87, 1.8, -1.6]} rotation={[0, -Math.PI / 2, 0]}>
        <WallArt w={0.9} h={1.2} art="art4" />
      </Reveal>
      <Reveal source={src} at={[0.78, 0.88]} type="grow" position={[-5.2, 0, -4.4]}>
        <Plant height={1.9} leaves={40} seed={71} />
      </Reveal>
      <Reveal source={src} at={[0.8, 0.9]} type="grow" position={[5.3, 0, 0.3]}>
        <Plant height={1.3} leaves={28} seed={73} pot="ceramicWhite" kind="palm" />
      </Reveal>
      <Reveal source={src} at={[0.84, 0.92]} type="grow" position={[-5.65, 0.61, -0.4]}>
        <Vase kind="tall" m="ceramicWhite" />
      </Reveal>
    </group>
  )
}

/* =================== SERVICES SHOWROOM =================== */
function useServiceWeight(index) {
  const w = useRef(0)
  useFrame((_, dt) => {
    w.current = damp(w.current, store.service === index ? 1 : 0, 4, Math.min(dt, 0.05))
  })
  return w
}

function Turntable() {
  const g = useRef()
  const lift = useServiceWeight(0)
  useFrame((_, dt) => {
    if (!g.current) return
    g.current.rotation.y += dt * (0.08 + lift.current * 0.25)
    const kids = g.current.children[1].children
    kids.forEach((k, i) => {
      k.position.y = lift.current * (0.18 + (i % 3) * 0.08) + Math.sin(performance.now() / 900 + i) * 0.02 * lift.current
    })
  })
  return (
    <group position={[0, 0, -1.6]}>
      <Cyl rt={2.3} h={0.12} p={[0, 0.06, 0]} m="marbleWhite" seg={64} />
      <Torus radius={2.3} tube={0.012} p={[0, 0.12, 0]} r={[Math.PI / 2, 0, 0]} m="ledStrip" shadow={false} />
      <group ref={g} position={[0, 0.12, 0]}>
        <RoundRug radius={1.9} m="rugSage" />
        <group>
          <group position={[0, 0, -0.9]}>
            <Sofa w={2.3} m="fabricSand" pillows={['velvetEmerald', 'fabricBoucle']} />
          </group>
          <group position={[-1.3, 0, 0.5]} rotation={[0, 2.2, 0]}>
            <Armchair m="velvetRust" />
          </group>
          <group position={[0.1, 0, 0.2]}>
            <CoffeeTable top="marbleBlack" />
          </group>
          <group position={[1.3, 0, 0.6]} rotation={[0, -2.4, 0]}>
            <LoungeChair />
          </group>
        </group>
      </group>
    </group>
  )
}

function LightingFeature() {
  const g = useRef()
  const beams = useRef()
  const w = useServiceWeight(1)
  useFrame(() => {
    if (!g.current) return
    const t = w.current
    g.current.visible = t > 0.01
    g.current.position.y = (1 - t) * 2.2
    beams.current.children.forEach((b) => b.scale.set(1, Math.max(0.001, t), 1))
  })
  const spots = [[-2.2, -2.8], [-1.1, -1.2], [0, -2.4], [1.1, -1.2], [2.2, -2.8]]
  const beamMat = useMat('lightBeam')
  const beamGeo = geo('beam', () => {
    const c = new THREE.CylinderGeometry(0.08, 0.7, 2.4, 24, 1, true)
    c.translate(0, -1.2, 0)
    return c
  })
  return (
    <group ref={g}>
      {spots.map(([x, z], i) => (
        <PendantGlobe key={i} position={[x, 0, z]} drop={0.8 + (i % 2) * 0.5} radius={0.13} />
      ))}
      <group ref={beams}>
        {spots.map(([x, z], i) => (
          <mesh key={i} geometry={beamGeo} material={beamMat} position={[x, 4 - 0.8 - (i % 2) * 0.5 - 0.28, z]} />
        ))}
      </group>
    </group>
  )
}

function CeilingFeature() {
  const g = useRef()
  const w = useServiceWeight(2)
  useFrame(() => {
    if (!g.current) return
    const t = w.current
    g.current.visible = t > 0.01
    g.current.position.y = (1 - t) * 0.6
  })
  const beams = []
  for (let i = -2; i <= 2; i++) {
    beams.push(<B key={'x' + i} s={[0.14, 0.26, 9.4]} p={[i * 2.3, 3.87, 0]} m="oak" />)
  }
  for (let j = -2; j <= 2; j++) {
    beams.push(<B key={'z' + j} s={[11.4, 0.22, 0.12]} p={[0, 3.89, j * 2]} m="oak" />)
  }
  return (
    <group ref={g}>
      {beams}
      <B s={[4.2, 0.08, 3.2]} p={[0, 3.6, -1.6]} m="ceiling" />
      <B s={[4.24, 0.02, 0.03]} p={[0, 3.55, 0]} m="ledStrip" shadow={false} />
      <B s={[4.24, 0.02, 0.03]} p={[0, 3.55, -3.2]} m="ledStrip" shadow={false} />
      <B s={[0.03, 0.02, 3.2]} p={[-2.12, 3.55, -1.6]} m="ledStrip" shadow={false} />
      <B s={[0.03, 0.02, 3.2]} p={[2.12, 3.55, -1.6]} m="ledStrip" shadow={false} />
    </group>
  )
}

function WallFeature() {
  const flutes = useRef()
  const art = useRef()
  const w = useServiceWeight(3)
  const count = 64
  useFrame(() => {
    if (!flutes.current) return
    const t = w.current
    flutes.current.visible = t > 0.01
    art.current.visible = t > 0.01
    flutes.current.children.forEach((c, i) => {
      const local = Math.min(1, Math.max(0, t * 1.6 - (i / count) * 0.6))
      c.scale.y = Math.max(0.001, local)
    })
    art.current.position.z = (1 - t) * 0.8
  })
  return (
    <group>
      <group ref={flutes} position={[0, 0, -4.86]}>
        {Array.from({ length: count }, (_, i) => (
          <Cyl key={i} rt={0.045} h={3.6} p={[-5.67 + i * 0.18, 1.8, 0]} m="walnut" seg={10} />
        ))}
      </group>
      <group ref={art}>
        <WallArt w={1.6} h={1.1} art="art2" frame="brass" position={[-2.6, 2.1, -4.7]} />
        <WallArt w={0.9} h={1.2} art="art3" frame="brass" position={[2.6, 2.1, -4.7]} />
        <WallSconce position={[-4.2, 2.2, -4.72]} />
        <WallSconce position={[4.2, 2.2, -4.72]} />
        <B s={[3.4, 0.05, 0.3]} p={[0, 1.15, -4.62]} m="marbleBlack" />
        <Vase position={[-0.6, 1.18, -4.62]} kind="tall" m="ceramicWhite" />
        <Bowl position={[0.5, 1.18, -4.62]} m="brass" />
      </group>
    </group>
  )
}

export function ServicesRoom({ shell = {} }) {
  return (
    <group>
      <Shell floor="floorAsh" wall="wallWhite" windows={[]} {...shell} />
      <Turntable />
      <LightingFeature />
      <CeilingFeature />
      <WallFeature />
      <Plant position={[-5.2, 0, -4.3]} height={1.8} leaves={38} seed={81} />
      <Plant position={[5.2, 0, -4.3]} height={1.6} leaves={34} seed={83} pot="ceramicWhite" />
    </group>
  )
}

/* =================== ARCHITECTURAL HALL (About) =================== */
export function AboutHall({ shell = {} }) {
  const ring = useRef()
  const beams = useRef()
  const beamMat = useMat('lightBeam')
  useFrame(({ clock }, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.05
    if (beams.current) beamMat.opacity = 0.07 + Math.sin(clock.elapsedTime * 0.6) * 0.015
  })
  const H = 8
  const windows = [-3.6, 0, 3.6].map((x) => ({ x, w: 1.3, sill: 0.4, top: 7.3 }))
  return (
    <group>
      <Shell h={H} floor="concreteFloor" wall="concrete" windows={windows} sky="skyGolden" ceilingMat="concrete" skirting={false} {...shell} />
      {/* portal frames */}
      {[-3.6, -0.8, 2.0].map((z) => (
        <group key={z}>
          {[-1, 1].map((s) => (
            <B key={s} s={[0.5, H, 0.5]} p={[s * 5.2, H / 2, z]} m="concrete" />
          ))}
          <B s={[10.9, 0.6, 0.5]} p={[0, H - 0.3, z]} m="concrete" />
        </group>
      ))}
      {/* reflecting pool strip */}
      <B s={[1.8, 0.02, 7]} p={[0, 0.011, -1.2]} m="mirror" shadow={false} />
      <B s={[1.9, 0.05, 7.1]} p={[0, 0.0, -1.2]} m="marbleBlack" shadow={false} />
      {/* floating stair */}
      {Array.from({ length: 14 }, (_, i) => (
        <B key={i} s={[1.2, 0.08, 0.32]} p={[-5.3, 0.25 + i * 0.27, 1.6 - i * 0.34]} m="oak" />
      ))}
      <B s={[2.2, 0.12, 1.6]} p={[-4.8, 4.0, -4.1]} m="oak" />
      <B s={[0.02, 1, 1.6]} p={[-3.7, 4.55, -4.1]} m="glass" shadow={false} />
      {/* light shafts through the slit windows */}
      <group ref={beams}>
        {[-3.6, 0, 3.6].map((x) => (
          <mesh key={x} material={beamMat} position={[x + 0.3, 3.4, -2.6]} rotation={[0.62, 0, 0]}>
            <boxGeometry args={[1.25, 8.5, 0.6]} />
          </mesh>
        ))}
      </group>
      {/* ring chandelier */}
      <group ref={ring} position={[0, 5.6, -1.2]}>
        <Torus radius={1.6} tube={0.03} r={[Math.PI / 2, 0, 0]} m="brass" seg={96} />
        <Torus radius={1.56} tube={0.012} r={[Math.PI / 2, 0, 0]} p={[0, -0.03, 0]} m="ledStrip" shadow={false} seg={96} />
        {[0, 1, 2].map((i) => (
          <Cyl key={i} rt={0.004} h={2.2} p={[Math.cos((i / 3) * Math.PI * 2) * 1.6, 1.1, Math.sin((i / 3) * Math.PI * 2) * 1.6]} m="blackMetal" seg={4} shadow={false} />
        ))}
      </group>
      <Sculpture position={[0, 0, -3.9]} m="brass" />
      <Plant position={[4.4, 0, -4.2]} height={2.4} leaves={50} seed={91} pot="stoneware" />
      <LoungeChair position={[3.6, 0, 0.4]} rotation={[0, -0.5, 0]} m="linenWhite" frame="walnut" />
      <LoungeChair position={[2.5, 0, 1.0]} rotation={[0, -0.2, 0]} m="linenWhite" frame="walnut" />
    </group>
  )
}

/* =================== DESIGN PROCESS STAGE =================== */
function ProcessFurniture() {
  return (
    <group>
      <group position={[0, 0, -3.1]}>
        <Sofa w={2.6} m="fabricCream" pillows={['velvetRust', 'fabricSage']} />
      </group>
      <group position={[0, 0, -1.5]}>
        <CoffeeTable />
      </group>
      <group position={[-2.1, 0, -1.3]} rotation={[0, Math.PI / 2.4, 0]}>
        <Armchair m="velvetEmerald" />
      </group>
      <group position={[2.6, 0, -1.6]}>
        <DiningTable w={1.6} d={0.9} />
        <DiningChair position={[-0.4, 0, -0.7]} />
        <DiningChair position={[0.4, 0, -0.7]} />
        <DiningChair position={[-0.4, 0, 0.7]} rotation={[0, Math.PI, 0]} />
        <DiningChair position={[0.4, 0, 0.7]} rotation={[0, Math.PI, 0]} />
      </group>
      <group position={[-4.6, 0, -4.78]}>
        <Shelving w={1.8} h={2.4} seed={101} />
      </group>
      <group position={[-1.8, 0, -3.4]}>
        <FloorLamp />
      </group>
    </group>
  )
}

const SWATCHES = ['oak', 'marbleWhite', 'velvetEmerald', 'brass', 'linenWhite', 'travertine', 'walnut', 'velvetRust']

export function ProcessRoom({ shell = {} }) {
  const src = P('process')
  const wireG = useRef()
  const solidG = useRef()
  const planG = useRef()
  const swatchG = useRef()
  const v = useRef(0)
  const wireMat = getMat('wire')
  useFrame(({ clock }, dt) => {
    v.current = damp(v.current, src(), 6, Math.min(dt, 0.05))
    const p = v.current
    // 1 planning: blueprint + footprints
    const plan = 1 - range(p, 0.62, 0.8)
    planG.current.visible = plan > 0.01
    planG.current.children.forEach((c) => (c.material.opacity = plan * (c.userData.base ?? 1)))
    // 2 design: wireframe rises
    const wire = range(p, 0.18, 0.34) * (1 - range(p, 0.78, 0.92))
    wireG.current.visible = wire > 0.01
    wireMat.opacity = 0.6 * wire
    wireG.current.position.y = (1 - range(p, 0.18, 0.34)) * -1.2
    // 3 materials: swatches orbit, then dive into the furniture
    const sw = range(p, 0.42, 0.55) * (1 - range(p, 0.8, 0.9))
    swatchG.current.visible = sw > 0.01
    swatchG.current.rotation.y = clock.elapsedTime * 0.3
    swatchG.current.scale.setScalar(Math.max(0.001, sw))
    swatchG.current.position.y = 1.6 + (1 - sw) * 0.8
    // 4 execution: realistic furniture builds up from the floor
    const solid = range(p, 0.76, 0.94)
    solidG.current.visible = solid > 0.01
    solidG.current.scale.set(1, Math.max(0.001, solid), 1)
  })
  const footprint = (x, z, w, d, key) => (
    <mesh key={key} position={[x, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]} userData={{ base: 0.9 }}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial color="#9fd3ff" transparent opacity={0.9} wireframe />
    </mesh>
  )
  return (
    <group>
      <Shell floor="floorOak" wall="wallWarm" windows={[{ x: 2.6, w: 3.4, sill: 0.4, top: 3.4 }]} sky="skyDay" {...shell} />
      <CoveLight />
      <group ref={planG}>
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ base: 0.92 }}>
          <planeGeometry args={[12, 10]} />
          <meshBasicMaterial map={getMat('blueprint').map} transparent opacity={0.92} depthWrite={false} />
        </mesh>
        {footprint(0, -3.1, 2.6, 1.0, 'a')}
        {footprint(0, -1.5, 1.2, 1.2, 'b')}
        {footprint(-2.1, -1.3, 0.9, 0.9, 'c')}
        {footprint(2.6, -1.6, 1.8, 2.4, 'd')}
        {footprint(-4.6, -4.6, 1.8, 0.4, 'e')}
      </group>
      <group ref={wireG}>
        <MaterialMode.Provider value="wire">
          <ProcessFurniture />
        </MaterialMode.Provider>
      </group>
      <group ref={swatchG} position={[0, 1.6, -1.6]}>
        {SWATCHES.map((m, i) => {
          const a = (i / SWATCHES.length) * Math.PI * 2
          return <Sph key={m} radius={0.2} p={[Math.cos(a) * 1.5, Math.sin(i * 1.3) * 0.25, Math.sin(a) * 1.5]} m={m} seg={32} />
        })}
      </group>
      <group ref={solidG}>
        <ProcessFurniture />
        <Rug w={3.4} d={2.6} position={[0, 0, -1.9]} m="rugSage" />
        <Plant position={[5.2, 0, -4.3]} height={1.7} leaves={36} seed={111} />
      </group>
    </group>
  )
}

export function ContactExtras() {
  return null
}

export { lerp }

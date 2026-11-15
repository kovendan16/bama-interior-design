import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { ROOM_COMPONENTS } from './rooms/Rooms'
import { TransformRoom } from './rooms/TransformRoom'
import { PRACTICALS } from './world'
import { store } from '../lib/store'
import { SC_ROOMS, SC_SPACING, U_TOTAL, roomCoord, shotAt } from './showcasePath'

// smoothed scroll position shared by the rig, rooms and lights
const live = { u: 0 }

/** camera follows the scroll path, with a little pointer parallax */
function Rig() {
  const { camera, size } = useThree()
  const pos = useMemo(() => new THREE.Vector3(), [])
  const tgt = useMemo(() => new THREE.Vector3(), [])
  const off = useMemo(() => new THREE.Vector3(), [])
  const ptr = useRef({ x: 0, y: 0 })
  const first = useRef(true)

  useEffect(() => {
    const aspect = size.width / size.height
    camera.fov = aspect < 1 ? 52 : aspect < 1.4 ? 46 : 40
    camera.updateProjectionMatrix()
  }, [camera, size])

  useFrame((state, dt) => {
    const goal = (store.progress.showcase || 0) * U_TOTAL
    live.u = first.current ? goal : THREE.MathUtils.damp(live.u, goal, 3.2, dt)
    first.current = false
    shotAt(live.u, pos, tgt)

    // narrow screens: step back so the room still fits
    const aspect = size.width / size.height
    if (aspect < 1.5) {
      off.copy(pos).sub(tgt).multiplyScalar(1 + (1.5 - aspect) * 0.55)
      pos.copy(tgt).add(off)
    }

    ptr.current.x = THREE.MathUtils.damp(ptr.current.x, store.pointer.x, 2.5, dt)
    ptr.current.y = THREE.MathUtils.damp(ptr.current.y, store.pointer.y, 2.5, dt)
    const t = state.clock.elapsedTime
    pos.x += ptr.current.x * 0.45 + Math.sin(t * 0.25) * 0.08
    pos.y += ptr.current.y * 0.25 + Math.sin(t * 0.32) * 0.05
    camera.position.copy(pos)
    camera.lookAt(tgt)
  })
  return null
}

/** sun + practicals move to whichever room the camera is in */
function Lights() {
  const sun = useRef()
  const p1 = useRef()
  const p2 = useRef()
  const last = useRef(-1)
  useFrame(() => {
    const k = Math.round(roomCoord(live.u))
    if (k === last.current || !sun.current) return
    last.current = k
    const x = k * SC_SPACING
    sun.current.position.set(x - 5, 10, -12)
    sun.current.target.position.set(x, 0, 0)
    sun.current.target.updateMatrixWorld()
    const pr = PRACTICALS[SC_ROOMS[k]] || PRACTICALS.living
    ;[p1, p2].forEach((p, j) => {
      p.current.position.set(pr[j][0] + x, pr[j][1], pr[j][2])
      p.current.color.set(pr[j][4])
      p.current.intensity = pr[j][3]
    })
  })
  return (
    <>
      <hemisphereLight args={['#fff4e6', '#3a2c20', 0.5]} />
      <directionalLight
        ref={sun}
        color="#ffe6c4"
        intensity={3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-far={40}
      />
      <directionalLight color="#dfe8ff" intensity={0.6} position={[30, 8, 14]} />
      <pointLight ref={p1} distance={10} decay={2} />
      <pointLight ref={p2} distance={9} decay={2} />
      <Environment files="/hdri/art_studio.hdr" environmentIntensity={0.65} />
    </>
  )
}

const SHELL = { ceiling: false, front: false, left: { door: false }, right: { door: false } }

/** all rooms in a row; each one builds up out of the floor as the camera arrives */
function House() {
  const refs = useRef([])
  useFrame(() => {
    const c = roomCoord(live.u)
    refs.current.forEach((g, i) => {
      if (!g) return
      const v = THREE.MathUtils.clamp(1 - Math.abs(c - i) * 1.15, 0, 1)
      const e = 1 - Math.pow(1 - v, 3)
      g.visible = v > 0.001
      g.scale.y = Math.max(0.002, e)
      g.position.y = (e - 1) * 0.4
    })
  })
  return SC_ROOMS.map((id, i) => {
    const Comp = id === 'living' ? TransformRoom : ROOM_COMPONENTS[id]
    return (
      <group key={id} ref={(el) => (refs.current[i] = el)} position={[i * SC_SPACING, 0, 0]}>
        <Comp shell={SHELL} />
      </group>
    )
  })
}

export default function ShowcaseCanvas({ isMobile }) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, isMobile ? 1.4 : 1.75]}
      camera={{ fov: 40, near: 0.05, far: 90, position: [6, 6, 13] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.background = new THREE.Color('#f3ece9')
        scene.fog = new THREE.Fog('#f3ece9', 30, 62)
      }}
    >
      <Rig />
      <Lights />
      <House />
      <mesh rotation-x={-Math.PI / 2} position={[((SC_ROOMS.length - 1) * SC_SPACING) / 2, -0.245, 0]} receiveShadow>
        <planeGeometry args={[SC_ROOMS.length * SC_SPACING + 40, 60]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
      {!isMobile && (
        <EffectComposer multisampling={0} disableNormalPass>
          <N8AO halfRes aoRadius={0.55} intensity={2.2} distanceFalloff={0.7} quality="medium" />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  )
}

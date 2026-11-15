import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveEvents } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { LivingRoom, Bedroom, Kitchen, Lounge } from './rooms/Rooms'
import { TransformRoom, ServicesRoom, AboutHall, ProcessRoom } from './rooms/StoryRooms'
import { Dollhouse } from './Dollhouse'
import { ROOMS, DOLL } from './world'
import { store, emit } from '../lib/store'

// Only rooms near the camera are drawn — the rest of the house costs nothing.
function Culled({ center, radius = 20, children }) {
  const ref = useRef()
  const { camera } = useThree()
  useFrame(() => {
    if (!ref.current) return
    const dx = camera.position.x - center[0]
    const dz = camera.position.z - center[2]
    ref.current.visible = dx * dx + dz * dz < radius * radius
  })
  return <group ref={ref}>{children}</group>
}

// Compile every shader up front (all rooms visible for one frame) so no hitch
// appears the first time the camera enters a new room.
function Precompile({ onReady }) {
  const { gl, scene, camera } = useThree()
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    const id = requestAnimationFrame(() => {
      done.current = true
      try {
        const hidden = []
        scene.traverse((o) => {
          if (!o.visible) {
            hidden.push(o)
            o.visible = true
          }
        })
        gl.compile(scene, camera)
        hidden.forEach((o) => (o.visible = false))
      } catch (e) {
        /* non-fatal */
      }
      onReady?.()
    })
    return () => cancelAnimationFrame(id)
  }, [gl, scene, camera, onReady])
  return null
}

const ROOM_SET = {
  living: (p) => <LivingRoom {...p} />,
  bedroom: (p) => <Bedroom {...p} />,
  kitchen: (p) => <Kitchen {...p} />,
  transform: (p) => <TransformRoom {...p} />,
  services: (p) => <ServicesRoom {...p} />,
  about: (p) => <AboutHall {...p} />,
  process: (p) => <ProcessRoom {...p} />,
  contact: (p) => <Lounge {...p} />,
}

// Which walls each room builds, so shared walls are never doubled.
const WALLS = {
  living: { left: { door: false } },
  bedroom: { left: { door: true } },
  kitchen: { left: { door: true } },
  transform: { left: { door: true } },
  services: { left: { door: false } },
  about: { h: 8, left: { door: true, h: 8 }, right: { door: true, h: 8 } },
  process: {},
  contact: { left: { door: true }, right: { door: false } },
}

function World() {
  return (
    <>
      {ROOMS.map((r) => (
        <Culled key={r.id} center={[r.x, 0, 0]} radius={r.id === 'transform' ? 30 : 25}>
          <group position={[r.x, 0, 0]}>{ROOM_SET[r.id]({ shell: WALLS[r.id] })}</group>
        </Culled>
      ))}
      <Culled center={[DOLL.pos[0], 0, DOLL.pos[2]]} radius={18}>
        <Dollhouse />
      </Culled>
    </>
  )
}

export default function Experience({ paused, device }) {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, device.isMobile ? 1.4 : 1.75))
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (ready) emit('sceneReady')
  }, [ready])
  return (
    <div className={`canvas-wrap ${paused ? 'is-paused' : ''}`} aria-hidden="true">
      <Canvas
        shadows="percentage"
        dpr={dpr}
        frameloop={paused ? 'never' : 'always'}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        camera={{ fov: 46, near: 0.05, far: 80, position: [0.6, 5.2, 17] }}
        gl={{ antialias: !device.isMobile || dpr < 1.5, powerPreference: 'high-performance', alpha: false, stencil: false }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          scene.background = new THREE.Color('#100c0e')
          scene.fog = new THREE.Fog('#100c0e', 22, 48)
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.85, d - 0.25))} onIncline={() => setDpr((d) => Math.min(device.isMobile ? 1.4 : 1.75, d + 0.15))} />
        <AdaptiveEvents />
        <Lights shadowSize={device.isMobile ? 1024 : 2048} />
        <World />
        <CameraRig />
        <Precompile onReady={() => setReady(true)} />
        {!device.isMobile && (
          // photographic finish: ambient occlusion grounds every object, lamps bloom softly
          <EffectComposer multisampling={0} disableNormalPass>
            <N8AO halfRes aoRadius={0.55} intensity={2.4} distanceFalloff={0.7} quality="medium" />
            <Bloom mipmapBlur luminanceThreshold={1} intensity={0.35} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}

export { store }

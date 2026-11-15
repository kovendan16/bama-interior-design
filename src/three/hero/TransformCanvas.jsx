import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { TransformRoom } from '../rooms/TransformRoom'
import { TF } from '../transformTimeline'
import { store, emit, damp } from '../../lib/store'

/*
 * Homepage hero: the photoreal living room that transforms with scroll.
 * Camera holds one composed shot (slow push-in); lighting warms up as the
 * GSAP timeline (TF) progresses.
 */

const SHOT = { from: new THREE.Vector3(0, 2.0, 4.7), to: new THREE.Vector3(0, 1.95, 3.95), look: new THREE.Vector3(0, 1.78, -2.4) }

function CameraRig() {
  const { camera, size } = useThree()
  const pos = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const ptr = useRef({ x: 0, y: 0 })
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const aspect = size.width / size.height
    const p = store.progress.hero ?? 0
    pos.lerpVectors(SHOT.from, SHOT.to, p)
    // narrow frames: step back so the whole room still reads
    if (aspect < 1.5) pos.addScaledVector(dir.copy(pos).sub(SHOT.look).normalize(), (1.5 - aspect) * 2.4)
    if (!store.isMobile && !store.reducedMotion) {
      ptr.current.x = damp(ptr.current.x, store.pointer.x, 2.5, dt)
      ptr.current.y = damp(ptr.current.y, store.pointer.y, 2.5, dt)
      pos.x += ptr.current.x * 0.18
      pos.y += ptr.current.y * 0.08
    }
    camera.position.lerp(pos, 1 - Math.exp(-6 * dt))
    camera.lookAt(SHOT.look)
    const fov = aspect < 0.8 ? 64 : aspect < 1.2 ? 56 : aspect < 1.6 ? 50 : 46
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })
  return null
}

const SUN_COOL = new THREE.Color('#e9efff')
const SUN_GOLD = new THREE.Color('#ffd2a0')
const LAMP_COOL = new THREE.Color('#e4ebf7')
const LAMP_WARM = new THREE.Color('#ffcf96')

function HeroLights({ shadowSize }) {
  const sun = useRef()
  const hemi = useRef()
  const p1 = useRef()
  const p2 = useRef()
  const target = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(0, 0, -1)
    return o
  }, [])
  const tmp = useMemo(() => new THREE.Color(), [])
  useFrame(({ clock }) => {
    const warm = Math.min(1, TF.warmth)
    const lights = Math.min(1, TF.lights)
    const drift = store.reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.07) * 2
    if (sun.current) {
      sun.current.position.set(-4 + drift, 9, -14)
      sun.current.color.lerpColors(SUN_COOL, SUN_GOLD, warm)
      sun.current.intensity = 3.3 + TF.finish * 0.4
    }
    if (hemi.current) hemi.current.intensity = 0.55
    tmp.lerpColors(LAMP_COOL, LAMP_WARM, warm)
    if (p1.current) {
      p1.current.intensity = 13 * (0.1 + 0.9 * lights) * (1 + 0.2 * TF.finish)
      p1.current.color.copy(tmp)
    }
    if (p2.current) {
      p2.current.intensity = 7 * (0.1 + 0.9 * lights)
      p2.current.color.copy(tmp)
    }
  })
  return (
    <>
      <primitive object={target} />
      <hemisphereLight ref={hemi} args={['#fff4e6', '#3a2c20', 0.55]} />
      <directionalLight
        ref={sun}
        intensity={3.3}
        position={[-4, 9, -14]}
        target={target}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />
      <pointLight ref={p1} position={[0, 2.8, -1.4]} intensity={1.3} distance={10} decay={2} />
      <pointLight ref={p2} position={[3.4, 2.1, -3]} intensity={0.7} distance={9} decay={2} />
      <Environment files="/hdri/art_studio.hdr" environmentIntensity={0.6} />
    </>
  )
}

// tell the loader when the room's first textures have arrived (or after a safety delay)
function ReadySignal() {
  useEffect(() => {
    let done = false
    const fire = () => {
      if (done) return
      done = true
      emit('sceneReady')
    }
    const mgr = THREE.DefaultLoadingManager
    const prev = mgr.onLoad
    mgr.onLoad = () => {
      prev?.()
      fire()
    }
    const t = setTimeout(fire, 7000)
    return () => {
      clearTimeout(t)
      mgr.onLoad = prev
    }
  }, [])
  return null
}

export default function TransformCanvas({ isMobile = false, paused = false }) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, isMobile ? 1.3 : 1.75]}
      frameloop={paused ? 'never' : 'always'}
      camera={{ fov: 46, near: 0.05, far: 60, position: SHOT.from.toArray() }}
      gl={{ antialias: !isMobile, powerPreference: 'high-performance', alpha: false, stencil: false }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.background = new THREE.Color('#efe7e4')
      }}
    >
      <PerformanceMonitor />
      <ReadySignal />
      <Suspense fallback={null}>
        <HeroLights shadowSize={isMobile ? 1024 : 2048} />
        <TransformRoom shell={{ ceiling: true, left: { door: false }, right: { door: false } }} />
      </Suspense>
      <CameraRig />
      {!isMobile && (
        <EffectComposer multisampling={0} disableNormalPass>
          <N8AO halfRes aoRadius={0.55} intensity={2.4} distanceFalloff={0.7} quality="medium" />
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.35} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  )
}

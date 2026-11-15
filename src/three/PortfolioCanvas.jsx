import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'
import { ROOM_COMPONENTS } from './rooms/Rooms'
import { PRACTICALS } from './world'

const OVERVIEW = { pos: new THREE.Vector3(6.2, 6.2, 9.6), target: new THREE.Vector3(0.3, 0.9, -1.9) }
const INSIDE = { pos: new THREE.Vector3(0.2, 1.6, 2.0), target: new THREE.Vector3(0.2, 1.59, 1.9) }

function StudioLights({ room }) {
  const p1 = useRef()
  const p2 = useRef()
  useEffect(() => {
    const pr = PRACTICALS[room] || PRACTICALS.living
    p1.current.position.set(pr[0][0], pr[0][1], pr[0][2])
    p2.current.position.set(pr[1][0], pr[1][1], pr[1][2])
    p1.current.color.set(pr[0][4])
    p2.current.color.set(pr[1][4])
    p1.current.intensity = pr[0][3]
    p2.current.intensity = pr[1][3]
  }, [room])
  return (
    <>
      <hemisphereLight args={['#fff4e6', '#3a2c20', 0.5]} />
      <directionalLight
        color="#ffe6c4"
        intensity={3}
        position={[-5, 10, -12]}
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
      <directionalLight color="#dfe8ff" intensity={0.6} position={[6, 8, 10]} />
      <pointLight ref={p1} distance={10} decay={2} />
      <pointLight ref={p2} distance={9} decay={2} />
      <Environment resolution={128} frames={1} environmentIntensity={0.6}>
        <Lightformer form="rect" intensity={2.2} color="#fff1dc" position={[0, 5, -6]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffd9b0" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#c8d8ff" position={[-8, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#ffffff" position={[0, 2, 9]} rotation-y={Math.PI} scale={[12, 3, 1]} />
      </Environment>
    </>
  )
}

function RoomStage({ room, inside }) {
  const g = useRef()
  const Comp = ROOM_COMPONENTS[room]
  useEffect(() => {
    if (!g.current) return
    gsap.fromTo(g.current.scale, { y: 0.001 }, { y: 1, duration: 1.3, ease: 'expo.out' })
    gsap.fromTo(g.current.position, { y: -0.6 }, { y: 0, duration: 1.3, ease: 'expo.out' })
  }, [room])
  return (
    <group ref={g}>
      <Comp shell={{ ceiling: inside, front: inside, left: { door: false }, right: { door: false } }} />
    </group>
  )
}

function Controls({ mode, zoomRef, onInteract }) {
  const ctrl = useRef()
  const { camera } = useThree()
  const idle = useRef(0)
  const anim = useRef(false)

  // fly between "overview" and "step inside" (360°) modes
  useEffect(() => {
    const c = ctrl.current
    if (!c) return
    const shot = mode === 'inside' ? INSIDE : OVERVIEW
    anim.current = true
    c.enabled = false
    const tl = gsap.timeline({
      onComplete: () => {
        anim.current = false
        c.enabled = true
        if (mode === 'inside') {
          c.minDistance = 0.05
          c.maxDistance = 0.2
          c.minPolarAngle = 0.9
          c.maxPolarAngle = 2.2
          c.minAzimuthAngle = -Infinity
          c.maxAzimuthAngle = Infinity
          c.rotateSpeed = -0.35
        } else {
          c.minDistance = 7
          c.maxDistance = 22
          c.minPolarAngle = 0.35
          c.maxPolarAngle = 1.42
          c.minAzimuthAngle = -1.05
          c.maxAzimuthAngle = 1.05
          c.rotateSpeed = 0.6
        }
        c.update()
      },
    })
    c.minDistance = 0
    c.maxDistance = Infinity
    c.minAzimuthAngle = -Infinity
    c.maxAzimuthAngle = Infinity
    c.minPolarAngle = 0
    c.maxPolarAngle = Math.PI
    tl.to(camera.position, { x: shot.pos.x, y: shot.pos.y, z: shot.pos.z, duration: 1.8, ease: 'power3.inOut' }, 0)
    tl.to(c.target, { x: shot.target.x, y: shot.target.y, z: shot.target.z, duration: 1.8, ease: 'power3.inOut', onUpdate: () => c.update() }, 0)
    tl.to(camera, { fov: mode === 'inside' ? 68 : 40, duration: 1.8, ease: 'power3.inOut', onUpdate: () => camera.updateProjectionMatrix() }, 0)
    zoomRef.current = 0
    return () => tl.kill()
  }, [mode, camera, zoomRef])

  const sph = useMemo(() => new THREE.Spherical(), [])
  const off = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock }, dt) => {
    const c = ctrl.current
    if (!c || anim.current) return
    // zoom buttons: dolly (overview) or narrow the lens (inside)
    if (zoomRef.current !== 0) {
      const z = zoomRef.current
      zoomRef.current = 0
      if (mode === 'inside') {
        gsap.to(camera, { fov: THREE.MathUtils.clamp(camera.fov - z * 10, 38, 80), duration: 0.6, onUpdate: () => camera.updateProjectionMatrix() })
      } else {
        off.copy(camera.position).sub(c.target)
        const d = THREE.MathUtils.clamp(off.length() * (z > 0 ? 0.8 : 1.25), c.minDistance, c.maxDistance)
        off.setLength(d).add(c.target)
        gsap.to(camera.position, { x: off.x, y: off.y, z: off.z, duration: 0.7, ease: 'power2.out', onUpdate: () => c.update() })
      }
      idle.current = 0
    }
    // gentle idle drift so the room is always alive
    idle.current += dt
    if (idle.current > 4) {
      off.copy(camera.position).sub(c.target)
      sph.setFromVector3(off)
      if (mode === 'inside') sph.theta += dt * 0.06
      else sph.theta += (Math.sin(clock.elapsedTime * 0.15) * 0.6 - sph.theta) * dt * 0.3
      off.setFromSpherical(sph).add(c.target)
      camera.position.copy(off)
      c.update()
    }
  })

  return (
    <OrbitControls
      ref={ctrl}
      makeDefault
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      target={OVERVIEW.target.toArray()}
      onStart={() => {
        idle.current = 0
        onInteract?.()
      }}
      onChange={() => {}}
    />
  )
}

export default function PortfolioCanvas({ room, mode, zoomRef, isMobile, onInteract }) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, isMobile ? 1.4 : 1.75]}
      camera={{ fov: 40, near: 0.05, far: 80, position: OVERVIEW.pos.toArray() }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.background = new THREE.Color('#14110e')
        scene.fog = new THREE.Fog('#14110e', 26, 50)
      }}
    >
      <StudioLights room={room} />
      <RoomStage room={room} inside={mode === 'inside'} />
      <ContactShadows position={[0, -0.25, 0]} scale={16} opacity={0.5} blur={2.5} far={1} frames={1} />
      <Controls mode={mode} zoomRef={zoomRef} onInteract={onInteract} />
    </Canvas>
  )
}

import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { ZONES, PRACTICALS } from './world'
import { store, damp, range } from '../lib/store'
import { TF } from './transformTimeline'

const SUN_DEFAULT = new THREE.Color('#ffe6c4')
const SUN_COOL = new THREE.Color('#e9efff')
const SUN_GOLD = new THREE.Color('#ffc98e')
const PRACTICAL_COOL = new THREE.Color('#e4ebf7')

/**
 * Fixed lighting rig: one shadow-casting sun, one hemisphere fill, two warm
 * "practical" point lights and an image-based environment for reflections.
 * Instead of every room owning lights (which would recompile shaders whenever a
 * room is culled), this rig glides to whichever zone the camera is in.
 */
export function Lights({ shadowSize = 2048 }) {
  const sun = useRef()
  const p1 = useRef()
  const p2 = useRef()
  const hemi = useRef()
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Object3D(), [])
  const cur = useRef({ x: 0, z: 0, zone: 'living' })
  const tmpA = useMemo(() => new THREE.Vector3(), [])
  const tmpB = useMemo(() => new THREE.Vector3(), [])
  const colA = useMemo(() => new THREE.Color(), [])
  const colSun = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    // nearest zone to the camera
    let best = ZONES[0]
    let bd = Infinity
    for (const z of ZONES) {
      const dx = camera.position.x - z.c[0]
      const dz = camera.position.z - z.c[2]
      const d = dx * dx + dz * dz * 0.35
      if (d < bd) {
        bd = d
        best = z
      }
    }
    const c = cur.current
    if (c.zone !== best.id) c.zone = best.id
    c.x = damp(c.x, best.c[0], 3, dt)
    c.z = damp(c.z, best.c[2], 3, dt)

    const isDoll = best.id === 'dollhouse'
    // sun: behind the back wall, so light pours in through the windows and the
    // window mullions cast moving shadows; it slowly drifts like real daylight.
    const t = clock.elapsedTime
    const drift = store.reducedMotion ? 0 : Math.sin(t * 0.07) * 2.5
    if (isDoll) {
      sun.current.position.set(c.x - 3, 9, c.z - 6)
    } else {
      sun.current.position.set(c.x - 4 + drift, 9, c.z - 14)
    }
    target.position.set(c.x, 0, isDoll ? c.z + 4 : c.z)
    target.updateMatrixWorld()
    const cam = sun.current.shadow.camera
    const size = isDoll ? 4 : 9
    if (cam.right !== size) {
      cam.left = -size
      cam.right = size
      cam.top = size
      cam.bottom = -size
      cam.updateProjectionMatrix()
    }

    // practical lights for the zone
    const pr = PRACTICALS[best.id] || PRACTICALS.living
    let boost = 1
    // transformation room: lights come on and warm up with the GSAP timeline;
    // the walnut style is moodier (less daylight, stronger lamps)
    const inTf = best.id === 'transform'
    const luxe = inTf ? (TF.style <= 1 ? TF.style : 2 - TF.style) : 0
    if (inTf) boost = (0.12 + 0.88 * Math.min(1, TF.lights)) * (1 + 0.55 * luxe)
    if (best.id === 'process') boost = 0.6 + 0.4 * range(store.progress.process || 0, 0.7, 0.92)
    const intro = 0.2 + 0.8 * store.intro
    ;[p1, p2].forEach((ref, i) => {
      const [x, y, z, intensity, color] = pr[i]
      tmpA.set(best.c[0] + x, y, best.c[2] + z)
      ref.current.position.lerp(tmpA, 1 - Math.exp(-3 * dt))
      let flicker = 1
      if (best.id === 'contact' && i === 0) flicker = 0.85 + Math.sin(t * 9) * 0.08 + Math.sin(t * 23) * 0.05
      ref.current.intensity = damp(ref.current.intensity, intensity * boost * intro * flicker, 4, dt)
      colA.set(color)
      if (inTf) colA.lerpColors(PRACTICAL_COOL, colA, Math.min(1, TF.warmth))
      ref.current.color.lerp(colA, 1 - Math.exp(-3 * dt))
    })
    let sunTarget = (best.id === 'contact' ? 0.6 : best.id === 'about' ? 4.2 : 3.2) * (0.3 + 0.7 * store.intro)
    if (inTf) {
      sunTarget *= 1 - 0.5 * luxe
      colSun.lerpColors(SUN_COOL, SUN_GOLD, Math.min(1, TF.warmth))
    } else colSun.copy(SUN_DEFAULT)
    sun.current.color.lerp(colSun, 1 - Math.exp(-4 * dt))
    sun.current.intensity = damp(sun.current.intensity, sunTarget, 3, dt)
    hemi.current.intensity = damp(hemi.current.intensity, best.id === 'contact' ? 0.25 : 0.45 * (1 - 0.45 * luxe), 3, dt)
    tmpB.set(0, 0, 0)
  })

  return (
    <>
      <primitive object={target} />
      <hemisphereLight ref={hemi} args={['#fff4e6', '#3a2c20', 0.45]} />
      <directionalLight
        ref={sun}
        color="#ffe6c4"
        intensity={3.2}
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
      <pointLight ref={p1} intensity={0} distance={10} decay={2} color="#ffc98a" />
      <pointLight ref={p2} intensity={0} distance={9} decay={2} color="#ffd29c" />
      {/* image-based lighting captured in a real interior (Poly Haven, CC0) */}
      <Environment files="/hdri/art_studio.hdr" environmentIntensity={0.6} />
    </>
  )
}

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { PATHS, SECTION_ORDER, CUT_SECTIONS, INTRO, dollFocusShot } from './cameraPaths'
import { DOLL_ROOMS } from './world'
import { store, easeInOutCubic, damp } from '../lib/store'

/**
 * Scroll-driven camera. ScrollTrigger writes each section's progress into the
 * store; here we pick the section in control, sample its spline at that progress,
 * then ease the real camera towards it for a weighty, cinematic feel.
 */
export function CameraRig() {
  const { camera, size } = useThree()
  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const curLook = useRef(new THREE.Vector3(...INTRO.t))
  const introP = useMemo(() => new THREE.Vector3(...INTRO.p), [])
  const introT = useMemo(() => new THREE.Vector3(...INTRO.t), [])
  const last = useRef({ active: null, first: true })
  const offset = useMemo(() => new THREE.Vector3(), [])
  const ptr = useRef({ x: 0, y: 0 })

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    // which section drives the camera? (ranges are contiguous; take the last started)
    let active = 'hero'
    for (const id of SECTION_ORDER) {
      const pr = store.progress[id]
      if (pr !== undefined && pr > 0) active = id
    }
    store.active = active
    const p = store.progress[active] ?? 0
    const path = PATHS[active]
    let e
    if (active === 'services') {
      // hold on each service's framing, then glide to the next one
      const seg = Math.min(p * 4, 3.999)
      const i = Math.floor(seg)
      const f = seg - i
      const hold = f < 0.55 ? 0 : easeInOutCubic((f - 0.55) / 0.45)
      e = (i + hold) / 4
    } else if (active === 'dollhouse') {
      // arrive quickly, then orbit slowly while the visitor explores
      e = p < 0.3 ? easeInOutCubic(p / 0.3) * (2 / 3) : 2 / 3 + ((p - 0.3) / 0.7) * (1 / 3)
    } else if (active === 'transform' || active === 'process') e = p
    else e = easeInOutCubic(p)
    path.pos.getPoint(Math.min(1, Math.max(0, e)), pos)
    path.look.getPoint(Math.min(1, Math.max(0, e)), look)

    // hero entrance: fly in from outside the house
    if (active === 'hero' && store.intro < 1) {
      const t = easeInOutCubic(store.intro)
      pos.lerpVectors(introP, pos, t)
      look.lerpVectors(introT, look, t)
    }

    // dollhouse: clicking a room flies the camera into it
    if (active === 'dollhouse' && store.dollFocus !== null) {
      const shot = dollFocusShot(DOLL_ROOMS[store.dollFocus], store.dollExplode || 0)
      pos.copy(shot.p)
      look.copy(shot.t)
    }

    // portrait screens: step back so rooms still read
    const aspect = size.width / size.height
    if (aspect < 1) {
      const dir = offset.copy(pos).sub(look).normalize()
      const k = active !== 'dollhouse' ? 1.6 : store.dollFocus !== null ? 2.2 : 5.5
      pos.addScaledVector(dir, (1 - aspect) * k)
    }

    // subtle depth parallax from the pointer + handheld breathing
    if (!store.isMobile && !store.reducedMotion) {
      ptr.current.x = damp(ptr.current.x, store.pointer.x, 2.5, dt)
      ptr.current.y = damp(ptr.current.y, store.pointer.y, 2.5, dt)
      const strength = store.dollFocus !== null ? 0.05 : 0.22
      pos.x += ptr.current.x * strength
      pos.y += ptr.current.y * strength * 0.6
      pos.y += Math.sin(clock.elapsedTime * 0.5) * 0.015
    }

    const cut = last.current.first || (last.current.active !== active && (CUT_SECTIONS.has(active) || CUT_SECTIONS.has(last.current.active)))
    if (cut) {
      camera.position.copy(pos)
      curLook.current.copy(look)
    } else {
      const k = 1 - Math.exp(-(store.dollFocus !== null ? 3 : 4.2) * dt)
      camera.position.lerp(pos, k)
      curLook.current.lerp(look, k)
    }
    camera.lookAt(curLook.current)
    last.current.active = active
    last.current.first = false

    const fov = aspect < 0.8 ? 62 : aspect < 1.2 ? 54 : 46
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = damp(camera.fov, fov, 4, dt)
      camera.updateProjectionMatrix()
    }
  })
  return null
}

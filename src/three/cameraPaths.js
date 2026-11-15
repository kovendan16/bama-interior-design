import * as THREE from 'three'
import { DOLL } from './world'

// Each section owns a camera path: an ordered list of [position, lookAt] keys.
// A section's first key equals the previous section's last key, so the camera
// travels as one continuous, unbroken shot from the hero to the footer.

const k = (p, t) => ({ p, t })

export const INTRO = k([0.6, 5.2, 17], [0, 1.6, -2])

const D = DOLL.pos
const living = [
  k([0, 1.75, 7.4], [-1.2, 1.25, -2]),
  k([1.4, 1.6, 5.6], [-1.5, 1.05, -2]),
]

const livingTour = [
  living[1],
  k([-3.6, 1.5, 3.2], [-1.0, 0.85, -2.4]),
  k([3.0, 1.55, 2.2], [-0.6, 1.0, -3.0]),
  k([4.5, 1.6, 2.6], [12, 1.5, 2.6]),
]

const bedroom = [
  livingTour[3],
  k([7.6, 1.6, 2.6], [14, 1.3, 0]),
  k([9.6, 1.75, 3.6], [11, 0.8, -2.6]),
  k([15.4, 1.5, 3.0], [11.4, 0.9, -2.6]),
  k([16.5, 1.6, 2.6], [24, 1.5, 2.6]),
]

const kitchen = [
  bedroom[4],
  k([19.6, 1.6, 2.6], [23, 1.3, -1]),
  k([21.6, 1.85, 3.8], [22, 1.0, -2.6]),
  k([27.4, 1.65, 2.9], [23.5, 1.0, -2.0]),
  k([28.5, 1.6, 2.6], [36, 1.5, 2.6]),
]

// Progressive transformation: arrive, then hold ONE composed shot of the room
// while it is designed around the visitor (only a slow push-in).
// [arrival, locked shot, end of push-in]; CameraRig maps progress onto it.
export const TRANSFORM_SHOT = k([36, 2.0, 4.7], [36, 1.78, -2.4])
const transform = [kitchen[4], TRANSFORM_SHOT, k([36, 1.95, 3.95], [36, 1.72, -2.4])]

const dollhouse = [
  transform[2],
  k([37.2, 3.0, 14.0], [44, 1.6, 18]),
  k([36, 2.5, 20.6], [D[0], 1.45, D[2]]),
  k([34.6, 2.3, 21.4], [D[0], 1.4, D[2]]),
]

const portfolio = [dollhouse[3], dollhouse[3]]

const services = [
  k([48, 2.7, 5.4], [48, 0.55, -1.6]),
  k([46.4, 1.35, 2.2], [47.8, 2.9, -2.2]),
  k([48, 1.25, 1.6], [48, 4.0, -2.6]),
  k([50.2, 1.7, 2.4], [47.6, 1.7, -5]),
  k([52.6, 1.6, 2.6], [60, 2, 2.6]),
]

const about = [
  services[4],
  k([55.6, 1.6, 2.6], [60, 3, -2]),
  k([60, 1.4, 4.4], [60, 3.6, -4]),
  k([62.6, 4.4, 3.6], [58.6, 2.0, -3]),
  k([64.5, 1.6, 2.6], [72, 1.5, 2.6]),
]

const process = [
  about[4],
  k([67.8, 1.8, 2.8], [72, 1.0, -1.5]),
  k([72, 3.4, 4.2], [72, 0.3, -1.6]),
  k([70.2, 2.0, 3.4], [72.4, 0.9, -1.6]),
  k([74, 1.9, 3.4], [71.6, 0.9, -1.6]),
  k([76.5, 1.6, 2.6], [84, 1.5, 2.6]),
]

const contact = [
  process[5],
  k([80, 1.6, 2.8], [84, 1.2, -2]),
  k([84, 1.65, 4.4], [84, 1.15, -3]),
]

export const SECTION_ORDER = ['hero', 'living', 'bedroom', 'kitchen', 'transform', 'dollhouse', 'portfolio', 'services', 'about', 'process', 'contact']

const RAW = { hero: living, living: livingTour, bedroom, kitchen, transform, dollhouse, portfolio, services, about, process, contact }

// Sections where the main canvas is covered and the camera may teleport.
export const CUT_SECTIONS = new Set(['portfolio'])

function curve(keys, field) {
  const pts = keys.map((key) => new THREE.Vector3(...key[field]))
  if (pts.length === 2) return new THREE.LineCurve3(pts[0], pts[1])
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
}

export const PATHS = Object.fromEntries(
  Object.entries(RAW).map(([id, keys]) => [id, { pos: curve(keys, 'p'), look: curve(keys, 't') }])
)

// Dollhouse "focus" shots — computed from the house's transform.
export function dollFocusShot(room, explode = 0) {
  const s = DOLL.scale
  // rotY = PI flips the local X axis
  const lx = -room.x * s
  const ly = (room.y + (room.y > 0 ? explode * 3.2 : 0)) * s
  const cx = D[0] + lx
  const cy = D[1] + ly + 0.22
  const cz = D[2]
  return {
    p: new THREE.Vector3(cx, cy + 0.55, cz - 1.55),
    t: new THREE.Vector3(cx, cy - 0.02, cz + 0.1),
  }
}

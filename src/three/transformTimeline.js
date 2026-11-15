import gsap from 'gsap'

/**
 * PROGRESSIVE INTERIOR TRANSFORMATION
 *
 * One GSAP timeline drives the whole "empty room → dream room" sequence. It
 * tweens plain numbers in `TF`; the 3D scene (TransformRoom), the light rig and
 * the page theme read those numbers every frame. ScrollTrigger scrubs the
 * timeline (see components/sections/Transform.jsx), so scrolling = designing.
 *
 * Timeline units: 0 → 100.
 */

// Animated values. 0 = not there yet, 1 = in place (eases may overshoot 1 to settle).
export const TF = {
  // stage 2 · finishes
  floor: 0, skirt: 0, walls: 0, panels: 0,
  // stage 3 · furniture
  rug: 0, sofa: 0, chairL: 0, chairR: 0, table: 0, side: 0, console: 0, shelf: 0, lounge: 0, ottoman: 0,
  // stage 4 · lighting, curtains, ceiling
  bulb: 1, ceiling: 0, cove: 0, chandelier: 0, pendant: 0, arc: 0, curtains: 0, lights: 0, warmth: 0,
  // stage 5 · décor
  art1: 0, art2: 0, plant1: 0, plant2: 0, vase: 0, decor: 0,
  // style morph: 0 Warm Minimal → 1 Walnut Luxe → 2 Bama Blush
  style: 0,
  // page theme index (fractional, 0 … THEMES.length-1)
  theme: 0,
}

export const TF_DURATION = 100

export const TF_STAGES = [
  { label: 'Empty shell', t: 0 },
  { label: 'Floors & finishes', t: 6 },
  { label: 'Furniture', t: 20 },
  { label: 'Lighting & ceiling', t: 42 },
  { label: 'Styling & décor', t: 58 },
  { label: 'Dream room', t: 70 },
]

export const TF_STYLES = [
  { name: 'Warm Minimal', t: 70 },
  { name: 'Walnut Luxe', t: 79 },
  { name: 'Bama Blush', t: 90 },
]

// Surrounding page colour for each moment of the story (index = TF.theme).
export const THEMES = [
  { ambient: '#26262a', accent: '#cfd3da' }, // raw concrete
  { ambient: '#342c25', accent: '#e4cfb2' }, // plaster & oak
  { ambient: '#36291f', accent: '#ebc9a0' }, // furniture
  { ambient: '#3a2717', accent: '#f6c789' }, // warm light
  { ambient: '#36261f', accent: '#efcdb5' }, // décor
  { ambient: '#372b22', accent: '#f2dccb' }, // warm minimal
  { ambient: '#170f0b', accent: '#cf9f6c' }, // walnut luxe
  { ambient: '#3b2327', accent: '#f1dade' }, // bama blush
]

const ease = { slide: 'back.out(1.35)', drop: 'power3.out', soft: 'power2.inOut' }

export function buildTransformTimeline() {
  // start from a clean slate every time the section mounts
  Object.assign(TF, { bulb: 1 })
  for (const k of Object.keys(TF)) if (k !== 'bulb') TF[k] = 0

  const tl = gsap.timeline({ paused: true, defaults: { ease: ease.soft } })
  const at = (vars, duration, position, e) => tl.to(TF, { ...vars, duration, ease: e || ease.soft }, position)

  // ---- page theme follows the story
  ;[6, 20, 43, 58, 70].forEach((t, i) => at({ theme: i + 1 }, 5, t))
  at({ theme: 6 }, 6, 76)
  at({ theme: 7 }, 6, 87)

  // ---- stage 2 · floors & wall finishes
  at({ floor: 1 }, 8, 6, 'power2.inOut')
  at({ walls: 1 }, 8, 8)
  at({ skirt: 1 }, 3, 12, ease.drop)
  at({ panels: 1 }, 6, 14, 'power3.out')

  // ---- stage 3 · furniture arrives one piece at a time and settles
  at({ rug: 1 }, 4, 20, 'power3.out')
  at({ sofa: 1 }, 6, 22, ease.slide)
  at({ chairL: 1 }, 5, 26, ease.slide)
  at({ chairR: 1 }, 5, 28, ease.slide)
  at({ table: 1 }, 4, 30, ease.drop)
  at({ side: 1 }, 3, 32, ease.drop)
  at({ console: 1 }, 4, 33, ease.slide)
  at({ shelf: 1 }, 4, 35, 'power3.out')
  at({ lounge: 1 }, 4, 37, ease.slide)
  at({ ottoman: 1 }, 3, 39, ease.drop)

  // ---- stage 4 · ceiling, lighting, curtains; light warms up
  at({ ceiling: 1 }, 6, 42, 'power3.out')
  at({ bulb: 0 }, 3, 45, 'power2.in')
  at({ cove: 1 }, 4, 47)
  at({ lights: 1 }, 10, 45)
  at({ warmth: 1 }, 14, 44)
  at({ chandelier: 1 }, 5, 48, 'power3.out')
  at({ pendant: 1 }, 4, 50, 'power3.out')
  at({ arc: 1 }, 4, 51, ease.slide)
  at({ curtains: 1 }, 5, 52, 'power2.out')

  // ---- stage 5 · décor & accessories
  at({ art1: 1 }, 3, 59, ease.slide)
  at({ art2: 1 }, 3, 61, ease.slide)
  at({ plant1: 1 }, 4, 62, ease.slide)
  at({ plant2: 1 }, 4, 64, ease.slide)
  at({ vase: 1 }, 2, 66, ease.slide)
  at({ decor: 1 }, 3, 67, ease.slide)

  // ---- stage 6 · finished room, then style transitions in the same room
  at({ style: 1 }, 6, 76)
  at({ style: 2 }, 6, 87)

  tl.set({}, {}, TF_DURATION) // fix total length
  return tl
}

// ---------------------------------------------------------------- helpers
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

/** Interpolated theme colours for a fractional theme index. */
export function themeAt(x) {
  const i = Math.max(0, Math.min(THEMES.length - 1, Math.floor(x)))
  const j = Math.min(THEMES.length - 1, i + 1)
  const f = Math.max(0, Math.min(1, x - i))
  const amb = mix(hex(THEMES[i].ambient), hex(THEMES[j].ambient), f)
  const acc = mix(hex(THEMES[i].accent), hex(THEMES[j].accent), f)
  return {
    ambient: `rgb(${amb})`,
    accent: `rgb(${acc})`,
    glass: `rgba(${amb}, 0.62)`,
    nav: `rgba(${amb}, 0.78)`,
    edge: `rgba(${amb}, 0.85)`,
  }
}

/** Value of a 3-entry style palette at TF.style (0..2). */
export function styleMix(list, s, out) {
  const i = s < 1 ? 0 : 1
  return out.lerpColors(list[i], list[i + 1], Math.min(1, Math.max(0, s - i)))
}

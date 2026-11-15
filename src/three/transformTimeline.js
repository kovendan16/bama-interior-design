import gsap from 'gsap'

/**
 * PROGRESSIVE INTERIOR TRANSFORMATION (homepage hero)
 *
 * One GSAP timeline drives the whole "empty room → luxury room" sequence. It
 * tweens plain numbers in `TF`; the 3D room (TransformRoom) and its light rig
 * read them every frame. ScrollTrigger scrubs the timeline from the pinned hero
 * (components/sections/Hero.jsx), so scrolling — or the arrow keys — design the
 * room, and scrolling back reverses it.
 *
 * Timeline units: 0 → 100. Stages (see lib/sections.js HERO_STAGES):
 *   0 empty · 10 finishes · 28 furniture · 50 lighting · 68 decoration · 86 complete
 */
export const TF = {
  // stage 2 · floors & wall finishes
  floor: 0, skirt: 0, walls: 0, panels: 0,
  // stage 3 · furniture
  sofa: 0, chairL: 0, chairR: 0, table: 0, side: 0, console: 0, lounge: 0, ottoman: 0,
  // stage 4 · ceiling & lighting
  bulb: 1, ceiling: 0, cove: 0, chandelier: 0, pendant: 0, arc: 0, sconces: 0, lights: 0, warmth: 0,
  // stage 5 · decoration
  curtains: 0, rug: 0, pillows: 0, plant1: 0, plant2: 0, shelf: 0, art1: 0, art2: 0, vase: 0, decor: 0, books: 0,
  // stage 6 · final glow
  finish: 0,
  // kept for the material palette (0 = warm minimal)
  style: 0,
}

export const TF_DURATION = 100

const slide = 'back.out(1.35)'
const drop = 'power3.out'

export function buildTransformTimeline() {
  for (const k of Object.keys(TF)) TF[k] = 0
  TF.bulb = 1

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } })
  const at = (vars, duration, position, ease) => tl.to(TF, { ...vars, duration, ease: ease || 'power2.inOut' }, position)

  // stage 2 · floors & wall finishes
  at({ floor: 1 }, 8, 10)
  at({ walls: 1 }, 8, 12)
  at({ skirt: 1 }, 3, 16, drop)
  at({ panels: 1 }, 7, 19, drop)

  // stage 3 · furniture arrives piece by piece and settles
  at({ sofa: 1 }, 6, 28, slide)
  at({ chairL: 1 }, 5, 32, slide)
  at({ chairR: 1 }, 5, 34, slide)
  at({ table: 1 }, 4, 37, drop)
  at({ side: 1 }, 3, 40, drop)
  at({ console: 1 }, 4, 42, slide)
  at({ lounge: 1 }, 4, 44, slide)
  at({ ottoman: 1 }, 3, 46, drop)

  // stage 4 · ceiling, fixtures; the light warms up
  at({ ceiling: 1 }, 6, 50, drop)
  at({ bulb: 0 }, 3, 53, 'power2.in')
  at({ lights: 1 }, 10, 53)
  at({ warmth: 1 }, 14, 52)
  at({ cove: 1 }, 4, 55)
  at({ chandelier: 1 }, 5, 56, drop)
  at({ pendant: 1 }, 4, 58, drop)
  at({ arc: 1 }, 4, 59, slide)
  at({ sconces: 1 }, 4, 61, drop)

  // stage 5 · decoration
  at({ curtains: 1 }, 5, 68, 'power2.out')
  at({ rug: 1 }, 4, 70, drop)
  at({ pillows: 1 }, 3, 72, slide)
  at({ plant1: 1 }, 4, 73, slide)
  at({ plant2: 1 }, 3, 75, slide)
  at({ shelf: 1 }, 4, 76, slide)
  at({ art1: 1 }, 3, 77, slide)
  at({ art2: 1 }, 3, 79, slide)
  at({ vase: 1 }, 2, 81, slide)
  at({ decor: 1 }, 2, 82, slide)
  at({ books: 1 }, 2, 83, slide)

  // stage 6 · completed room: a final warm glow
  at({ finish: 1 }, 8, 88)

  tl.set({}, {}, TF_DURATION)
  return tl
}

/** Value of a 3-entry style palette at TF.style (0..2). */
export function styleMix(list, s, out) {
  const i = s < 1 ? 0 : 1
  return out.lerpColors(list[i], list[i + 1], Math.min(1, Math.max(0, s - i)))
}

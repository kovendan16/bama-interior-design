// Shared, mutable animation state. Written by GSAP/ScrollTrigger and DOM handlers,
// read every frame inside R3F's useFrame — no React re-renders on scroll.
export const store = {
  // per-section scroll progress (0..1), written by ScrollTrigger
  progress: {},
  // id of the section currently driving the main camera
  active: 'hero',
  // 0..1 entrance animation of the hero (camera fly-in + lights)
  intro: 0,
  // normalised pointer (-1..1)
  pointer: { x: 0, y: 0 },
  // dollhouse: index of focused room, or null for whole-house view
  dollFocus: null,
  dollHover: null,
  // services: active category index
  service: 0,
  reducedMotion: false,
  isMobile: false,
}

const listeners = new Set()
export const emit = (type, payload) => listeners.forEach((fn) => fn(type, payload))
export const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const lerp = (a, b, t) => a + (b - a) * t
// local progress of t within [a, b]
export const range = (t, a, b) => clamp01((t - a) / (b - a))
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOutBack = (t) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt))

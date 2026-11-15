import { useEffect, useRef } from 'react'
import { SCENE_PHOTOS, PROCESS_AT } from '../lib/content'
import { store } from '../lib/store'

// Same order the sections appear on the page. Sections with no photos
// (transform, dollhouse, portfolio) fade the photos out and reveal the live 3D canvas.
const ORDER = ['hero', 'living', 'bedroom', 'kitchen', 'transform', 'dollhouse', 'portfolio', 'services', 'about', 'process', 'contact']

const LAYERS = Object.entries(SCENE_PHOTOS).flatMap(([section, list]) =>
  list.map((src, i) => ({ key: `${section}-${i}`, section, i, src })),
)

function stepIndex(thresholds, p) {
  let s = 0
  thresholds.forEach((a, i) => p >= a && (s = i))
  return s
}

/**
 * Full-screen photographic backdrop. Crossfades between real interior photos
 * as the visitor scrolls, with a slow cinematic zoom and a hint of pointer
 * parallax. Runs on its own rAF loop and writes styles directly (no re-renders).
 */
export function PhotoBackdrop({ onCanvasNeeded }) {
  const refs = useRef({})
  const state = useRef(Object.fromEntries(LAYERS.map((l) => [l.key, l.key === 'hero-0' ? 1 : 0])))
  const ptr = useRef({ x: 0, y: 0 })
  const needed = useRef(null)

  useEffect(() => {
    let raf
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // which section is on screen (same rule as the 3D camera rig)
      let active = 'hero'
      for (const id of ORDER) {
        const pr = store.progress[id]
        if (pr !== undefined && pr > 0) active = id
      }
      store.active = active
      const p = store.progress[active] ?? 0

      let idx = 0
      if (active === 'process') idx = stepIndex(PROCESS_AT, p)
      else if (active === 'services') idx = store.service || 0
      const target = SCENE_PHOTOS[active] ? `${active}-${Math.min(idx, SCENE_PHOTOS[active].length - 1)}` : null

      // the live 3D canvas only runs for the transformation room and the dollhouse
      // (woken slightly early so the room is already rendered when the photo fades)
      const need = active === 'transform' || active === 'dollhouse' || (active === 'kitchen' && p > 0.75)
      if (need !== needed.current) {
        needed.current = need
        onCanvasNeeded?.(need)
      }

      ptr.current.x += (store.pointer.x - ptr.current.x) * Math.min(1, dt * 2.5)
      ptr.current.y += (store.pointer.y - ptr.current.y) * Math.min(1, dt * 2.5)
      const still = store.reducedMotion
      const k = 1 - Math.exp(-dt * (still ? 30 : 4.5))

      for (const l of LAYERS) {
        const el = refs.current[l.key]
        if (!el) continue
        const s = state.current
        s[l.key] += ((l.key === target ? 1 : 0) - s[l.key]) * k
        const o = s[l.key]
        if (o < 0.003) {
          if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden'
          continue
        }
        el.style.visibility = 'visible'
        el.style.opacity = o.toFixed(3)
        if (still) {
          el.style.transform = 'none'
          continue
        }
        // slow push-in through the section; hero also zooms out during the intro
        const local = l.section === active ? p : l.section === 'hero' ? 0 : 1
        let scale = 1.12 - 0.08 * local
        if (l.section === 'hero') scale += 0.18 * (1 - store.intro)
        const tx = -ptr.current.x * 14
        const ty = ptr.current.y * 10
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale.toFixed(4)})`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [onCanvasNeeded])

  return (
    <div className="photo-stage" aria-hidden="true">
      {LAYERS.map((l) => (
        <div key={l.key} className="ph-layer" ref={(el) => (refs.current[l.key] = el)} style={l.key === 'hero-0' ? undefined : { visibility: 'hidden', opacity: 0 }}>
          <img src={l.src} alt="" decoding="async" fetchpriority={l.key === 'hero-0' ? 'high' : 'low'} />
        </div>
      ))}
    </div>
  )
}

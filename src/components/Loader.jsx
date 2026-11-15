import { useEffect, useRef, useState } from 'react'
import { SITE } from '../lib/site'
import { store, subscribe } from '../lib/store'
import { gsap, lockScroll } from '../lib/scroll'

/**
 * Branded preloader. Waits for fonts + the 3D engine to compile its shaders,
 * then plays the hero entrance: the curtain lifts, the camera flies into the
 * living room and lights warm up, and the headline rises in.
 */
export function Loader({ webgl }) {
  const root = useRef()
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    lockScroll(true)
    let target = 10
    let shown = 0
    let finished = false
    const raf = { id: 0 }
    const tick = () => {
      shown += (target - shown) * 0.08
      setPct(Math.round(shown))
      if (finished && shown > 99.2) return play()
      raf.id = requestAnimationFrame(tick)
    }
    raf.id = requestAnimationFrame(tick)

    document.fonts?.ready.then(() => (target = Math.max(target, 35)))
    const slowCreep = setInterval(() => {
      if (!finished) target = Math.min(88, target + 4)
    }, 400)
    const finish = () => {
      finished = true
      target = 100
    }
    const unsub = subscribe((type) => type === 'sceneReady' && finish())
    if (!webgl) setTimeout(finish, 600)
    const safety = setTimeout(finish, 15000)

    function play() {
      clearInterval(slowCreep)
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true)
          lockScroll(false)
        },
      })
      const fast = store.reducedMotion
      tl.to('.loader-inner', { autoAlpha: 0, y: -20, duration: 0.6, ease: 'power2.in' })
      tl.to(root.current, { yPercent: -100, duration: fast ? 0.4 : 1.2, ease: 'expo.inOut' }, '-=0.1')
      tl.to(store, { intro: 1, duration: fast ? 0.1 : 3.4, ease: 'power2.inOut' }, '-=0.9')
      tl.from('.nav', { yPercent: -120, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, '-=2.6')
      tl.from('.hero .wi', { yPercent: 115, rotate: 5, duration: 1.4, ease: 'expo.out', stagger: 0.06 }, '-=2.4')
      tl.from('.hero [data-hero-fade]', { y: 30, autoAlpha: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12 }, '-=1.6')
    }

    return () => {
      cancelAnimationFrame(raf.id)
      clearInterval(slowCreep)
      clearTimeout(safety)
      unsub()
    }
  }, [webgl])

  if (gone) return null
  return (
    <div className="loader" ref={root} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
      <div className="loader-inner">
        <div className="loader-grid" aria-hidden="true" />
        <svg className="loader-orbits" viewBox="-500 -500 1000 1000" aria-hidden="true">
          {[480, 380, 290, 210].map((r) => (
            <circle key={r} r={r} className="ring-faint" />
          ))}
          <circle r="150" className="ring" />
          <circle r="96" className="ring ring-dash" />
          <g className="orbit orbit-a">
            <circle cx="150" cy="0" r="6" className="dot" />
            <path d="M0 0 L150 0 A150 150 0 0 0 106 -106 Z" className="sweep" />
          </g>
          <g className="orbit orbit-b">
            <circle cx="0" cy="-96" r="3.5" className="dot dot-pink" />
          </g>
          <line x1="-500" y1="0" x2="500" y2="0" className="axis" />
          <line x1="0" y1="-500" x2="0" y2="500" className="axis" />
        </svg>
        <img className="loader-logo" src="/logo.jpg" alt={`${SITE.brand} ${SITE.brandSuffix}`} width="84" height="84" />
        <span className="loader-label tl">● {SITE.brand} preloader</span>
        <span className="loader-label bl">seq 001 — est. 2026</span>
        <div className="loader-count">
          <span className="loader-label">loading</span>
          <strong>{String(pct).padStart(3, '0')}</strong>
          <em>%</em>
        </div>
        <div className="loader-bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
    </div>
  )
}

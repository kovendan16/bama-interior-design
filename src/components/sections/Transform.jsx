import { useLayoutEffect, useRef, useState } from 'react'
import { Split } from '../Split'
import { useSectionProgress, ScrollTrigger } from '../../lib/scroll'
import { store } from '../../lib/store'
import { TF, TF_STAGES, TF_STYLES, TF_DURATION, buildTransformTimeline, themeAt } from '../../three/transformTimeline'

const THEME_VARS = ['--tf-ambient', '--tf-accent', '--tf-glass', '--tf-edge', '--nav-tint']

function applyTheme(on) {
  const root = document.documentElement.style
  if (!on) return THEME_VARS.forEach((v) => root.removeProperty(v))
  const t = themeAt(TF.theme)
  root.setProperty('--tf-ambient', t.ambient)
  root.setProperty('--tf-accent', t.accent)
  root.setProperty('--tf-glass', t.glass)
  root.setProperty('--tf-edge', t.edge)
  root.setProperty('--nav-tint', t.nav)
}

const indexAt = (list, time) => {
  let s = 0
  list.forEach((x, i) => time >= x.t && (s = i))
  return s
}

/**
 * Progressive interior transformation. The camera holds one shot of the room
 * while a scrubbed GSAP timeline builds it: finishes → furniture → lighting →
 * décor → finished room → style changes. Page colours follow the room.
 */
export function Transform() {
  const ref = useRef()
  const bar = useRef()
  const [step, setStep] = useState(0)
  const [style, setStyle] = useState(-1)

  // camera progress (arrival + locked shot)
  useSectionProgress(ref, 'transform')

  useLayoutEffect(() => {
    const tl = buildTransformTimeline()
    let active = false
    tl.eventCallback('onUpdate', () => {
      const time = tl.time()
      if (bar.current) bar.current.style.transform = `scaleX(${time / TF_DURATION})`
      const s = indexAt(TF_STAGES, time)
      setStep((prev) => (prev === s ? prev : s))
      const st = time >= TF_STYLES[0].t ? indexAt(TF_STYLES, time) : -1
      setStyle((prev) => (prev === st ? prev : st))
      if (active) applyTheme(true)
    })
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      animation: tl,
      scrub: 0.9,
      onToggle: (self) => {
        active = self.isActive
        applyTheme(active)
      },
      onRefresh: () => {
        // fraction of the section's camera range spent scrolling in (before pinning)
        store.transformPin = window.innerHeight / ref.current.offsetHeight
      },
    })
    return () => {
      st.kill()
      tl.kill()
      applyTheme(false)
    }
  }, [])

  return (
    <section id="transform" ref={ref} className="section transform" aria-labelledby="transform-title">
      <div className="sticky">
        <div className="tf-ambient" aria-hidden="true" />
        <header className="transform-head" data-reveal>
          <p className="kicker">
            <span className="num">04</span> Transformation
          </p>
          <h2 id="transform-title" className="h2">
            <Split text="From empty room to dream room." data-split />
          </h2>
          <p className="muted">Keep scrolling — watch one room get designed around you, layer by layer.</p>
        </header>

        <aside className={`tf-styles glass ${style >= 0 ? 'is-on' : ''}`} aria-label="Interior style">
          <p className="kicker">Same room · new style</p>
          <ol>
            {TF_STYLES.map((s, i) => (
              <li key={s.name} className={i === style ? 'is-active' : i < style ? 'is-done' : ''}>
                {s.name}
              </li>
            ))}
          </ol>
        </aside>

        <div className="transform-steps glass" role="group" aria-label="Transformation progress">
          <div className="progress">
            <span ref={bar} />
          </div>
          <ol>
            {TF_STAGES.map((s, i) => (
              <li key={s.label} className={i === step ? 'is-active' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                <span className="dot" aria-hidden="true" />
                {s.label}
              </li>
            ))}
          </ol>
        </div>
        <p className="sr-only" aria-live="polite">
          Current stage: {TF_STAGES[step].label}
          {style >= 0 ? `, style: ${TF_STYLES[style].name}` : ''}
        </p>
      </div>
    </section>
  )
}

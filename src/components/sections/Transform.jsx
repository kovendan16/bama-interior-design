import { useRef, useState } from 'react'
import { Split } from '../Split'
import { TRANSFORM_STEPS } from '../../lib/content'
import { useSectionProgress } from '../../lib/scroll'
import { range } from '../../lib/store'

export function Transform() {
  const ref = useRef()
  const bar = useRef()
  const [step, setStep] = useState(0)
  useSectionProgress(ref, 'transform', (p) => {
    let s = 0
    TRANSFORM_STEPS.forEach((st, i) => p >= st.at && (s = i))
    setStep((prev) => (prev === s ? prev : s))
    if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, p / 0.92)})`
    // mobile only (styles.css): the heading clears away soon after the section
    // pins (~0.19), leaving the room-building animation unobstructed
    const el = ref.current
    if (el) {
      const hide = range(p, 0.24, 0.32)
      el.style.setProperty('--head-o', (1 - hide).toFixed(3))
      el.style.setProperty('--head-y', `${(-hide * 30).toFixed(1)}px`)
    }
  })
  return (
    <section id="transform" ref={ref} className="section transform" aria-labelledby="transform-title">
      <div className="sticky">
        <header className="transform-head" data-reveal>
          <p className="kicker">
            <span className="num">04</span> Transformation
          </p>
          <h2 id="transform-title" className="h2">
            <Split text="From empty room to dream room." data-split />
          </h2>
          <p className="muted">Keep scrolling — watch the space get designed around you, layer by layer.</p>
        </header>
        <div className="transform-steps glass" role="group" aria-label="Transformation progress">
          <div className="progress">
            <span ref={bar} />
          </div>
          <ol>
            {TRANSFORM_STEPS.map((s, i) => (
              <li key={s.label} className={i === step ? 'is-active' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                <span className="dot" aria-hidden="true" />
                {s.label}
              </li>
            ))}
          </ol>
        </div>
        <p className="sr-only" aria-live="polite">
          Current stage: {TRANSFORM_STEPS[step].label}
        </p>
      </div>
    </section>
  )
}

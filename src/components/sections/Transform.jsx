import { useRef, useState } from 'react'
import { Split } from '../Split'
import { TRANSFORM_STEPS } from '../../lib/content'
import { useSectionProgress } from '../../lib/scroll'

export function Transform() {
  const ref = useRef()
  const bar = useRef()
  const [step, setStep] = useState(0)
  useSectionProgress(ref, 'transform', (p) => {
    let s = 0
    TRANSFORM_STEPS.forEach((st, i) => p >= st.at && (s = i))
    setStep((prev) => (prev === s ? prev : s))
    if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, p / 0.92)})`
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

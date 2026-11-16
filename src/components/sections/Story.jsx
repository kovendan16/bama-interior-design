import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../../lib/scroll'
import { clay, MOODBOARD_STEPS, MOODBOARD_LOGO } from '../../three/clay/state'

const ClayCanvas = lazy(() => import('../../three/clay/ClayCanvas.jsx'))

/**
 * "From moodboard to room" — material swatches lift off a designer's pin-board,
 * fly into a white model room and become its floor, walls, sofa, table,
 * curtains and lamp. Ends with the Bama Interiors emblem pressed into the board.
 */
export function Story({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const bar = useRef()
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [step, setStep] = useState(-1)

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        clay.story = p
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        let s = -1
        MOODBOARD_STEPS.forEach((ph, i) => p >= ph.at[0] && (s = i))
        if (p >= MOODBOARD_LOGO[0]) s = MOODBOARD_STEPS.length
        setStep((prev) => (prev === s ? prev : s))
      },
      onToggle: (self) => setInView(self.isActive),
    })
    const mount = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 200%',
      end: 'bottom -100%',
      onToggle: (self) => setNear(self.isActive),
    })
    return () => {
      st.kill()
      mount.kill()
    }
  }, [])

  const cur = MOODBOARD_STEPS[step]
  return (
    <section id="story" ref={ref} className="section story" aria-labelledby="story-title">
      <div className="sticky">
        <div className="story-stage" aria-hidden="true">
          {webgl && near && (
            <Suspense fallback={null}>
              <ClayCanvas scene="moodboard" isMobile={isMobile} paused={!inView && !near} />
            </Suspense>
          )}
        </div>
        <header className="story-head">
          <p className="kicker">05 / How we design</p>
          <h2 id="story-title" className="story-title">
            From moodboard
            <br />
            <span>to room.</span>
          </h2>
        </header>
        <ol className="swatch-list" aria-label="Materials">
          {MOODBOARD_STEPS.map((s, i) => (
            <li key={s.key} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
              <span className="sw" data-k={s.key} aria-hidden="true" />
              <span className="lbl">{s.swatch}</span>
            </li>
          ))}
        </ol>
        <div className="story-caption" aria-live="polite">
          {step < 0 && <span className="txt">Every room starts on a board — scroll to place each material.</span>}
          {cur && (
            <span key={step} className="txt">
              <b>{cur.swatch}</b> <i aria-hidden="true">→</i> {cur.to}
            </span>
          )}
          {step === MOODBOARD_STEPS.length && (
            <span key="done" className="txt">
              <b>Bama Interiors</b> — every material chosen, every room yours.
            </span>
          )}
          <div className="story-progress">
            <span ref={bar} />
          </div>
        </div>
      </div>
    </section>
  )
}

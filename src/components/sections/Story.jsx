import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../../lib/scroll'
import { clay, MOODBOARD_STEPS, MOODBOARD_LOGO } from '../../three/clay/state'
import { subscribe } from '../../lib/store'

const loadClay = () => import('../../three/clay/ClayCanvas.jsx')
const ClayCanvas = lazy(loadClay)

// Once the hero has finished loading (so the first screen never waits on us),
// fetch this scene's 3D code + textures in the background — it's ready before
// the visitor scrolls down to it.
function usePreloadMoodboard(enabled) {
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let started = false
    let delay
    const run = () => {
      if (cancelled) return
      loadClay().then((mod) => !cancelled && mod.preloadMoodboard()).catch(() => {})
    }
    const start = () => {
      if (started) return
      started = true
      delay = window.setTimeout(run, 1200) // let the hero intro animation breathe
    }
    const unsub = subscribe((type) => type === 'sceneReady' && start())
    const safety = window.setTimeout(start, 15000) // same safety net as the Loader
    return () => {
      cancelled = true
      unsub()
      window.clearTimeout(delay)
      window.clearTimeout(safety)
    }
  }, [enabled])
}

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
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  usePreloadMoodboard(webgl)
  // the canvas unmounts when far away; fade it in again on its next mount
  useEffect(() => {
    if (!near) setReady(false)
  }, [near])

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
      start: 'top 300%',
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
        <div className={`story-stage${ready ? ' is-ready' : ''}`} aria-hidden="true">
          {webgl && near && (
            <Suspense fallback={null}>
              <ClayCanvas scene="moodboard" isMobile={isMobile} paused={!inView && !near} onReady={onReady} />
            </Suspense>
          )}
          {webgl && (
            <div className="story-loading">
              <span />
              <span />
              <span />
            </div>
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

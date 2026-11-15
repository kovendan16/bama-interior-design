import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../../lib/scroll'
import { clay } from '../../three/clay/state'
import { range } from '../../lib/store'

const ClayCanvas = lazy(() => import('../../three/clay/ClayCanvas.jsx'))

const PHASES = [
  { at: 0, idx: '01 — Space', text: 'Every home begins as an empty space.' },
  { at: 0.2, idx: '02 — Ideas', text: 'We pull it apart — hundreds of ideas, sketches and references.' },
  { at: 0.56, idx: '03 — Focus', text: 'Until every idea comes together into one.' },
  { at: 0.74, idx: '04 — Home', text: 'Your home, rebuilt around the way you live.' },
]

/**
 * "From idea to home" — the white architectural model sits in a card, breaks
 * apart into pieces, becomes a swarm of ideas, collapses into one word and is
 * rebuilt as a home. Scroll-scrubbed; the 3D lives in ClayCanvas (story scene).
 */
export function Story({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const card = useRef()
  const word = useRef()
  const bar = useRef()
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState(0)

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        clay.story = p
        // the white card the model sits in lifts away
        const c = range(p, 0.06, 0.18)
        if (card.current) {
          card.current.style.opacity = String(1 - c)
          card.current.style.transform = `translate(-50%, -50%) scale(${1 + c * 0.35})`
        }
        // the collapsed swarm becomes one word, which then rises away
        const w = range(p, 0.6, 0.7) * (1 - range(p, 0.8, 0.9))
        if (word.current) {
          word.current.style.opacity = String(w)
          word.current.style.transform = `translate(-50%, calc(-50% - ${range(p, 0.8, 0.9) * 60}px)) scale(${0.85 + w * 0.15})`
        }
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        let s = 0
        PHASES.forEach((ph, i) => p >= ph.at && (s = i))
        setPhase((prev) => (prev === s ? prev : s))
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

  const ph = PHASES[phase]
  return (
    <section id="story" ref={ref} className="section story is-dark" aria-labelledby="story-title">
      <div className="sticky">
        <div className="story-card" ref={card} aria-hidden="true" />
        <div className="story-stage" aria-hidden="true">
          {webgl && near && (
            <Suspense fallback={null}>
              <ClayCanvas scene="story" isMobile={isMobile} paused={!inView && !near} />
            </Suspense>
          )}
        </div>
        <h2 id="story-title" className="story-title">
          From idea
          <br />
          to home.
        </h2>
        <p className="story-meta">
          05 / Idea &amp; home
          <br />
          Scroll to transform
        </p>
        <div className="story-word" ref={word} aria-hidden="true">
          home<span>.</span>
        </div>
        <div className="story-caption">
          <span className="idx">{ph.idx}</span>
          <span key={phase} className="txt">
            {ph.text}
          </span>
          <div className="story-progress">
            <span ref={bar} />
          </div>
        </div>
      </div>
    </section>
  )
}

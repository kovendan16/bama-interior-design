import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ScrollTrigger, scrollToTarget } from '../../lib/scroll'
import { clay, CTA_COPY, CURTAIN_OPEN, GALLERY_LIGHTS, GALLERY_FRAMES } from '../../three/clay/state'
import { range } from '../../lib/store'

const ClayCanvas = lazy(() => import('../../three/clay/ClayCanvas.jsx'))

// scroll-down button: what the next scroll does, and where clicking takes you
const STEPS = [
  { until: CURTAIN_OPEN[1], label: 'Scroll to open the curtains', go: CURTAIN_OPEN[1] + 0.02 },
  { until: GALLERY_LIGHTS[1], label: 'Scroll to turn on the lights', go: GALLERY_LIGHTS[1] + 0.01 },
  { until: GALLERY_FRAMES[1], label: 'Scroll to reveal our services', go: GALLERY_FRAMES[1] + 0.02 },
  { until: CTA_COPY[0], label: 'Keep scrolling', go: CTA_COPY[1] + 0.02 },
]
const stepAt = (p) => {
  const i = STEPS.findIndex((s) => p < s.until - 0.005)
  return i < 0 ? STEPS.length : i
}

// Closing reveal: blush linen curtains draw open, picture lights switch on over a
// gallery wall of our services, then the headline arrives.
export function Cta({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const copy = useRef()
  const stRef = useRef()
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [step, setStep] = useState(0)
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        clay.cta = p
        const o = range(p, ...CTA_COPY)
        if (copy.current) {
          copy.current.style.opacity = String(o)
          copy.current.style.transform = `translateY(${(1 - o) * 30}px)`
          copy.current.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
        }
        const s = stepAt(p)
        setStep((prev) => (prev === s ? prev : s))
      },
      onToggle: (self) => setInView(self.isActive),
    })
    stRef.current = st
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

  const next = () => {
    const st = stRef.current
    const s = STEPS[step]
    if (!st || !s) return
    scrollToTarget(st.start + s.go * (st.end - st.start), { duration: 1.6 })
  }
  const shown = inView && step < STEPS.length

  return (
    <section id="cta" ref={ref} className="section cta is-dark" aria-labelledby="cta-title">
      <div className="sticky">
        <div className="cta-stage" aria-hidden="true">
          {webgl && near && (
            <Suspense fallback={null}>
              <ClayCanvas scene="curtain" isMobile={isMobile} paused={!inView && !near} />
            </Suspense>
          )}
        </div>
        <button type="button" className={`cta-scroll ${shown ? '' : 'is-hidden'}`} onClick={next} tabIndex={shown ? 0 : -1} aria-hidden={!shown}>
          <span className="label" key={step}>
            {STEPS[Math.min(step, STEPS.length - 1)].label}
          </span>
          <span className="ring" aria-hidden="true">
            <ChevronDown size={18} />
          </span>
        </button>
        <div className="cta-inner" ref={copy}>
          <p className="kicker">06 / Your home, revealed</p>
          <h2 id="cta-title" className="cta-title">
            Let’s design
            <br />
            your home<span>.</span>
          </h2>
          <a
            href="#contact"
            className="btn"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#contact')
            }}
          >
            Book a consultation <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

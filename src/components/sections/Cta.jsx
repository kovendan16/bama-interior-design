import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger, scrollToTarget } from '../../lib/scroll'
import { clay, CURTAIN_OPEN } from '../../three/clay/state'
import { range } from '../../lib/store'

const ClayCanvas = lazy(() => import('../../three/clay/ClayCanvas.jsx'))

// Closing reveal: blush linen curtains draw open on a warmly lit corner.
export function Cta({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const copy = useRef()
  const hint = useRef()
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        clay.cta = p
        const o = range(p, CURTAIN_OPEN[0] + 0.25, CURTAIN_OPEN[1] + 0.08)
        if (copy.current) {
          copy.current.style.opacity = String(o)
          copy.current.style.transform = `translateY(${(1 - o) * 30}px)`
          copy.current.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
        }
        if (hint.current) hint.current.style.opacity = String(1 - range(p, 0.02, 0.15))
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
        <p className="cta-hint" ref={hint} aria-hidden="true">
          Scroll to draw the curtains
        </p>
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

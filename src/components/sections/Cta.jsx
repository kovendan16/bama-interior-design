import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger, scrollToTarget } from '../../lib/scroll'
import { clay } from '../../three/clay/state'

const ClayCanvas = lazy(() => import('../../three/clay/ClayCanvas.jsx'))

// Closing statement: furniture and architectural fragments tumble through space.
export function Cta({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const [near, setNear] = useState(false)
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => (clay.cta = self.progress),
      onToggle: (self) => setNear(self.isActive),
    })
    return () => st.kill()
  }, [])
  return (
    <section id="cta" ref={ref} className="section cta is-dark" aria-labelledby="cta-title">
      <div className="cta-stage" aria-hidden="true">
        {webgl && near && (
          <Suspense fallback={null}>
            <ClayCanvas scene="cta" isMobile={isMobile} />
          </Suspense>
        )}
      </div>
      <div className="cta-inner">
        <p className="kicker">06 / Is your next home ready?</p>
        <h2 id="cta-title" className="cta-title">
          Let’s create
          <br />
          together<span>.</span>
        </h2>
        <a
          href="#contact"
          className="btn"
          onClick={(e) => {
            e.preventDefault()
            scrollToTarget('#contact')
          }}
        >
          Book a consultation <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}

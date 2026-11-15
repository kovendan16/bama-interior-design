import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { Split } from '../Split'
import { useSectionProgress, scrollToTarget, gsap, ScrollTrigger } from '../../lib/scroll'
import { clay } from '../../three/clay/state'

const ClayCanvas = lazy(() => import('../../three/clay/ClayCanvas.jsx'))

export function Hero({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const [near, setNear] = useState(true)
  const [inView, setInView] = useState(true)
  useSectionProgress(ref, 'hero')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-content', {
        y: -120,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '55% top', scrub: true },
      })
      gsap.to('.scroll-cue', {
        autoAlpha: 0,
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '10% top', scrub: true },
      })
    }, ref)
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => (clay.hero = self.progress),
      onToggle: (self) => setInView(self.isActive),
    })
    const mount = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom -100%',
      onToggle: (self) => setNear(self.isActive),
    })
    return () => {
      ctx.revert()
      st.kill()
      mount.kill()
    }
  }, [])

  return (
    <section id="hero" ref={ref} className="section hero" aria-labelledby="hero-title">
      <div className="sticky">
        <div className="hero-stage" aria-hidden="true">
          {webgl && near && (
            <Suspense fallback={null}>
              <ClayCanvas scene="hero" isMobile={isMobile} paused={!inView} />
            </Suspense>
          )}
        </div>
        <div className="hero-top" data-hero-fade>
          <span>01 / Interior architecture</span>
          <span className="hero-tag">A space for living.</span>
          <span>Scroll to explore ↓</span>
        </div>
        <div className="hero-content">
          <p className="kicker" data-hero-fade>
            Bama Interiors — design studio
          </p>
          <h1 id="hero-title" className="display">
            <Split text="Walk through your home" />
            <br />
            <Split text="before it exists." className="accent" />
          </h1>
          <p className="lead" data-hero-fade>
            We design luxury residences in 3D first, so you can explore every room, material and light before a single wall is
            touched.
          </p>
          <div className="btn-row" data-hero-fade>
            <a
              href="#living"
              className="btn"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#living')
              }}
            >
              Begin the walkthrough <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#portfolio"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#portfolio')
              }}
            >
              Explore projects
            </a>
          </div>
        </div>
        <aside className="hero-meta" data-hero-fade aria-label="Studio highlights">
          <div>
            <strong>240+</strong>
            <span>Homes designed</span>
          </div>
          <div>
            <strong>18</strong>
            <span>Design awards</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Designed in 3D first</span>
          </div>
        </aside>
        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  )
}

import { useLayoutEffect, useRef } from 'react'
import { Split } from '../Split'
import { useSectionProgress, scrollToTarget, gsap } from '../../lib/scroll'

export function Hero() {
  const ref = useRef()
  useSectionProgress(ref, 'hero')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-content', {
        y: -120,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '45% top', scrub: true },
      })
      gsap.to('.scroll-cue', {
        autoAlpha: 0,
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '10% top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={ref} className="section hero" aria-labelledby="hero-title">
      <div className="sticky">
        <div className="hero-content">
          <p className="kicker" data-hero-fade>
            Interior Architecture &amp; Design Studio
          </p>
          <h1 id="hero-title" className="display">
            <Split text="Walk through your home" />
            <br />
            <Split text="before it exists." className="italic" />
          </h1>
          <p className="lead" data-hero-fade>
            We design luxury residences in photoreal 3D, so you can explore every room, material and
            light before a single wall is touched.
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
              Begin the walkthrough
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
          <span>Scroll to explore</span>
          <i />
        </div>
      </div>
    </section>
  )
}

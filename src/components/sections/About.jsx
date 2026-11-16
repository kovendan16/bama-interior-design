import { useLayoutEffect, useRef } from 'react'
import { ArrowRight, Quote } from 'lucide-react'
import { ABOUT, DIRECTOR } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'
import { gsap, ScrollTrigger, scrollToTarget } from '../../lib/scroll'
import { store } from '../../lib/store'

/**
 * Meet the Director — scroll-driven portrait:
 *   1. the photo is uncovered bottom → top (curtain reveal) as it enters,
 *   2. it drifts with a gentle parallax while the block crosses the screen,
 *   3. the standing portrait cross-fades into the seated one as you scroll on,
 *   4. kicker, name, role, quote and button rise in one after another and a
 *      gold rule draws itself,
 *   5. on desktop the frame tilts slightly in 3D under the mouse.
 */
function MeetDirector() {
  const root = useRef()
  const frame = useRef()
  const tilt = useRef()
  const drift = useRef()
  const second = useRef()
  const rule = useRef()

  useLayoutEffect(() => {
    if (store.reducedMotion) return
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('[data-dir-line]')
      gsap.set(frame.current, { clipPath: 'inset(100% 0% 0% 0% round 2rem)' })
      gsap.set(drift.current, { scale: 1.22 })
      gsap.set(lines, { y: 34, autoAlpha: 0 })
      gsap.set(rule.current, { scaleX: 0 })

      // 1 + 4 · reveal once, when the block comes into view
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
        .to(frame.current, { clipPath: 'inset(0% 0% 0% 0% round 2rem)', duration: 1.35, ease: 'power3.inOut' })
        .to(drift.current, { scale: 1.08, duration: 1.8, ease: 'power3.out' }, 0)
        .to(lines, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09 }, 0.35)
        .to(rule.current, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.7)

      // 2 · parallax drift, scrubbed with the scroll
      gsap.fromTo(
        drift.current,
        { yPercent: -5 },
        { yPercent: 5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )

      // 3 · standing → seated: a timed cross-fade once the block passes mid-screen
      //     (played, not scrubbed, so it never rests half-way as a double exposure)
      gsap.fromTo(
        second.current,
        { autoAlpha: 0, scale: 1.04 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 22%', toggleActions: 'play none none reverse' },
        },
      )
    }, root)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  // 5 · subtle 3D tilt (mouse devices only)
  const onMove = (e) => {
    if (store.reducedMotion || !window.matchMedia('(hover: hover)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(tilt.current, { rotateY: x * 8, rotateX: -y * 8, duration: 0.6, ease: 'power2.out' })
  }
  const onLeave = () => gsap.to(tilt.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' })

  const go = (e) => {
    e.preventDefault()
    scrollToTarget('#contact')
  }

  return (
    <div ref={root} className="mt-16 grid items-center gap-10 md:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20" aria-labelledby="director-name">
      {/* portrait */}
      <div className="relative mx-auto w-full max-w-[400px] [perspective:1100px]" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div ref={tilt} className="relative [transform-style:preserve-3d]">
          <div className="absolute -inset-3 rounded-[2.4rem] border border-blush-200 md:-inset-4" aria-hidden="true" />
          <div className="absolute -bottom-6 -right-6 hidden h-32 w-32 rounded-full bg-blush-100 blur-2xl md:block" aria-hidden="true" />
          <div ref={frame} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush-50 shadow-[0_40px_90px_-45px_rgba(80,30,45,0.55)]">
            <div ref={drift} className="absolute inset-0 will-change-transform">
              <img src={DIRECTOR.photos[0].src} alt={DIRECTOR.photos[0].alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_28%]" />
              <img ref={second} src={DIRECTOR.photos[1].src} alt={DIRECTOR.photos[1].alt} loading="lazy" className="invisible absolute inset-0 h-full w-full object-cover object-[50%_40%] opacity-0" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* words */}
      <div className="max-w-xl">
        <p className="ui-kicker" data-dir-line>
          Meet the Director
        </p>
        <h3 id="director-name" className="m-0 mt-3 text-[clamp(2.2rem,4.2vw,3.6rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink" data-dir-line>
          {DIRECTOR.name}
        </h3>
        <p className="m-0 mt-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-blush-600" data-dir-line>
          {DIRECTOR.role}
        </p>
        <span ref={rule} className="mt-6 block h-[2px] w-28 origin-left rounded-full bg-gradient-to-r from-[#c9a45c] to-blush-300" aria-hidden="true" />
        <blockquote className="relative m-0 mt-7 pl-9" data-dir-line>
          <Quote size={22} className="absolute left-0 top-1 text-blush-400" aria-hidden="true" />
          <p className="m-0 text-[clamp(1.15rem,1.7vw,1.45rem)] leading-snug tracking-[-0.015em] text-ink">{DIRECTOR.quote}</p>
        </blockquote>
        <p className="mt-5 text-[0.98rem] leading-relaxed text-ink-2" data-dir-line>
          {DIRECTOR.text}
        </p>
        <div className="mt-8" data-dir-line>
          <a href="#contact" onClick={go} className="ui-btn ui-btn-dark">
            Book a Consultation <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="ui-section" aria-labelledby="about-title">
      <div className="ui-wrap">
        <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_1fr]">
          <SectionHeading id="about-title" kicker="About us" title="Designing Spaces That" highlight="Feel Like Home." text={ABOUT.text} />
          <div className="grid grid-cols-3 gap-3" data-reveal>
            {[
              ['240+', 'Homes designed'],
              ['16', 'Years of craft'],
              ['100%', 'Designed in 3D first'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-3xl bg-blush-50 p-5 text-center">
                <strong className="block text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold tracking-[-0.04em] text-ink">{n}</strong>
                <span className="mt-1 block text-xs text-ink-3">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-right text-[0.7rem] text-ink-3">* Figures are placeholders — update with your studio’s numbers.</p>

        <MeetDirector />

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {ABOUT.pillars.map((p) => (
            <article key={p.title} className="ui-card group overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="ui-icon">
                  <Icon name={p.icon} />
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

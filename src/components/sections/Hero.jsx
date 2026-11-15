import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown, Keyboard } from 'lucide-react'
import { ScrollTrigger, scrollToTarget } from '../../lib/scroll'
import { store } from '../../lib/store'
import { HERO_STAGES } from '../../lib/sections'
import { buildTransformTimeline, TF_DURATION } from '../../three/transformTimeline'

const TransformCanvas = lazy(() => import('../../three/hero/TransformCanvas.jsx'))

const stageAt = (time) => {
  let s = 0
  HERO_STAGES.forEach((st, i) => time >= st.t && (s = i))
  return s
}

const isTyping = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

/**
 * Pinned hero: an empty photoreal living room transforms into a finished
 * luxury interior as you scroll (or press ↑ / ↓). A scrubbed GSAP timeline
 * drives the 3D; this column tells the story stage by stage.
 */
export function Hero({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const bar = useRef()
  const stRef = useRef()
  const [stage, setStage] = useState(0)
  const [started, setStarted] = useState(false)
  const [inView, setInView] = useState(true)

  useLayoutEffect(() => {
    const tl = buildTransformTimeline()
    tl.eventCallback('onUpdate', () => {
      const time = tl.time()
      if (bar.current) bar.current.style.transform = `scaleX(${time / TF_DURATION})`
      const s = stageAt(time)
      setStage((prev) => (prev === s ? prev : s))
    })
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      animation: tl,
      scrub: 0.8,
      onUpdate: (self) => {
        store.progress.hero = self.progress
        const s = self.progress > 0.015
        setStarted((prev) => (prev === s ? prev : s))
      },
      onToggle: (self) => setInView(self.isActive || self.progress < 1),
    })
    stRef.current = st
    return () => {
      st.kill()
      tl.kill()
    }
  }, [])

  // ↑ / ↓ step through the stages while the hero is pinned
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      if (e.altKey || e.ctrlKey || e.metaKey || isTyping(document.activeElement)) return
      const st = stRef.current
      if (!st) return
      const y = window.scrollY
      if (y < st.start - 2 || y > st.end + 2) return
      const time = st.progress * TF_DURATION
      const cur = stageAt(time + 0.5)
      const span = st.end - st.start
      let target
      if (e.key === 'ArrowDown') {
        target = cur >= HERO_STAGES.length - 1 ? st.end + window.innerHeight * 0.9 : st.start + (HERO_STAGES[cur + 1].t / TF_DURATION) * span + 2
      } else {
        if (time <= 0.5) return
        const prevIdx = time - HERO_STAGES[cur].t > 3 ? cur : Math.max(0, cur - 1)
        target = st.start + (HERO_STAGES[prevIdx].t / TF_DURATION) * span + 2
      }
      e.preventDefault()
      scrollToTarget(target, { duration: 1.4 })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (href) => (e) => {
    e.preventDefault()
    scrollToTarget(href)
  }
  const s = HERO_STAGES[stage]

  return (
    <section id="hero" ref={ref} className="hero-tf" aria-labelledby="hero-title">
      <div className="hero-tf-pin">
        {/* the room */}
        <div className="hero-tf-frame">
          {webgl ? (
            <Suspense fallback={<div className="hero-tf-fallback" style={{ backgroundImage: 'url(/images/gallery/living-1.jpg)' }} />}>
              <TransformCanvas isMobile={isMobile} paused={!inView} />
            </Suspense>
          ) : (
            <div className="hero-tf-fallback" style={{ backgroundImage: 'url(/images/gallery/living-1.jpg)' }} role="img" aria-label="A finished luxury living room" />
          )}
          <div className="hero-tf-badge" aria-hidden="true">
            <span className="dot" /> Stage {String(stage + 1).padStart(2, '0')} · {s.label}
          </div>
        </div>

        {/* the story */}
        <div className="hero-tf-copy">
          <div className={`hero-tf-intro ${started ? 'is-out' : ''}`} data-hero-fade>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-3">Bama Interior Design</p>
            <h1 id="hero-title" className="mt-4 text-[clamp(2.4rem,4vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
              Designing Spaces.
              <br />
              <span className="text-blush-500">Inspiring Living.</span>
            </h1>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-ink-2">
              We transform ordinary spaces into extraordinary interiors through thoughtful design, creativity and craftsmanship.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#projects" onClick={go('#projects')} className="ui-btn ui-btn-dark">
                Explore Our Designs <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="#contact" onClick={go('#contact')} className="ui-btn ui-btn-pink">
                Book a Consultation
              </a>
            </div>
            <p className="mt-8 flex items-center gap-2 text-sm text-ink-3">
              <ChevronDown size={16} className="animate-bounce text-blush-500" aria-hidden="true" />
              Scroll to transform your dream space.
            </p>
          </div>

          <div className={`hero-tf-stage ${started ? 'is-in' : ''}`} aria-live="polite">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-blush-600">
              Stage {String(stage + 1).padStart(2, '0')} / {String(HERO_STAGES.length).padStart(2, '0')} — {s.label}
            </p>
            <h2 key={stage} className="hero-tf-title mt-4 text-[clamp(2rem,3.6vw,3.6rem)] font-semibold leading-[1] tracking-[-0.04em] text-ink">
              {s.title[0]} {s.title[1]} <span className="text-blush-500">{s.title[2]}</span>
            </h2>
            <p key={`t${stage}`} className="hero-tf-text mt-4 max-w-md text-[1.02rem] leading-relaxed text-ink-2">
              {s.text}
            </p>
            {stage === HERO_STAGES.length - 1 && (
              <a href="#projects" onClick={go('#projects')} className="ui-btn ui-btn-dark mt-6">
                Explore Our Designs <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>

          <ol className="hero-tf-steps" aria-label="Transformation stages">
            <span className="rail" aria-hidden="true">
              <i ref={bar} />
            </span>
            {HERO_STAGES.map((st, i) => (
              <li key={st.label} className={i === stage ? 'is-active' : i < stage ? 'is-done' : ''}>
                <span className="dot" aria-hidden="true" />
                {st.label}
              </li>
            ))}
          </ol>
          <p className="hero-tf-keys">
            <Keyboard size={14} aria-hidden="true" /> Use ↑ ↓ to step through the stages
          </p>
        </div>
      </div>
    </section>
  )
}

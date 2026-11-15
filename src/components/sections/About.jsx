import { useLayoutEffect, useRef } from 'react'
import { Split } from '../Split'
import { useSectionProgress, gsap } from '../../lib/scroll'

const STATS = [
  [16, '', 'Years of practice'],
  [240, '+', 'Residences completed'],
  [32, '', 'Designers & craftspeople'],
  [12, '', 'Countries'],
]

export function About() {
  const ref = useRef()
  useSectionProgress(ref, 'about')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.stat strong').forEach((el) => {
        const to = parseFloat(el.dataset.to)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: to,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
          onUpdate: () => (el.textContent = Math.round(obj.v) + (el.dataset.suffix || '')),
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={ref} className="section about" aria-labelledby="about-title">
      <div className="about-grid">
        <div className="about-copy glass">
          <p className="kicker" data-reveal>
            <span className="num">08</span> About the studio
          </p>
          <h2 id="about-title" className="h2">
            <Split text="Architecture of feeling." data-split />
          </h2>
          <p data-reveal>
            We are an interior architecture studio of designers, visualisers and makers. Every project begins in the same place
            you just walked through: a living, photoreal 3D model of your home.
          </p>
          <p data-reveal>
            It lets us test daylight at every hour, compare marble slabs in situ and choreograph how you'll move from room to room
            — so the finished space feels inevitable, not approximate.
          </p>
        </div>
        <ul className="stats" aria-label="Studio in numbers">
          {STATS.map(([n, suf, label], i) => (
            <li key={label} className="stat glass" data-speed={0.08 + i * 0.05}>
              <strong data-to={n} data-suffix={suf}>
                {n}
                {suf}
              </strong>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <blockquote className="quote" data-speed="0.25" data-reveal>
          “Light is the first material we design with.”
          <cite>— Founding principal</cite>
        </blockquote>
      </div>
    </section>
  )
}

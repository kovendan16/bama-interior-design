import { useRef, useState } from 'react'
import { Split } from '../Split'
import { SERVICES } from '../../lib/content'
import { useSectionProgress, scrollToTarget } from '../../lib/scroll'
import { store } from '../../lib/store'

export function Services() {
  const ref = useRef()
  const [active, setActive] = useState(0)
  useSectionProgress(ref, 'services', (p) => {
    const i = Math.min(SERVICES.length - 1, Math.floor(p * SERVICES.length))
    store.service = i
    setActive((prev) => (prev === i ? prev : i))
  })

  // jump the scroll position to the slice of the section that shows service i
  const go = (i) => {
    const el = ref.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const vh = window.innerHeight
    const start = top - vh
    const end = top + el.offsetHeight - vh
    scrollToTarget(start + ((i + 0.4) / SERVICES.length) * (end - start))
  }

  const s = SERVICES[active]
  return (
    <section id="services" ref={ref} className="section services" aria-labelledby="services-title">
      <div className="sticky">
        <div className="services-panel glass">
          <p className="kicker">
            <span className="num">07</span> Services
          </p>
          <h2 id="services-title" className="h2">
            <Split text="Every layer of a room, designed." data-split />
          </h2>
          <ul className="service-list" role="tablist" aria-label="Service categories">
            {SERVICES.map((sv, i) => (
              <li key={sv.title}>
                <button role="tab" aria-selected={i === active} className={i === active ? 'is-active' : ''} onClick={() => go(i)}>
                  <span className="idx">0{i + 1}</span>
                  <span>{sv.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <article className="service-detail glass" key={active} role="tabpanel" aria-live="polite">
          <p className="kicker">{s.short}</p>
          <h3 className="h3">{s.title}</h3>
          <p>{s.text}</p>
          <ul className="ticks">
            {s.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

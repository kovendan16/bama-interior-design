import { useRef, useState } from 'react'
import { Split } from '../Split'
import { CHAPTERS } from '../../lib/content'
import { useSectionProgress } from '../../lib/scroll'
import { range } from '../../lib/store'

// Mobile caption timing (fraction of section progress). The sticky pins at
// ~0.45; the caption stays readable until FADE_START, then clears the screen
// so the camera move plays unobstructed for the rest of the section.
const FADE_START = 0.62
const FADE_END = 0.74

// One room of the walkthrough. The camera glides through the room while this
// glass panel stays pinned beside it. On mobile (see styles.css) the panel
// becomes a light caption that fades away part-way through the section.
export function Chapter({ id }) {
  const ref = useRef()
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const c = CHAPTERS[id]

  useSectionProgress(ref, id, (p) => {
    const el = ref.current
    if (!el) return
    const hide = range(p, FADE_START, FADE_END)
    // CSS vars are only consumed inside the mobile media query
    el.style.setProperty('--cap-o', (1 - hide).toFixed(3))
    el.style.setProperty('--cap-y', `${(hide * 40).toFixed(1)}px`)
    el.classList.toggle('cap-hidden', hide > 0.98)
    // collapse details once the caption leaves, so it re-enters compact
    if (hide > 0.98 && openRef.current) {
      openRef.current = false
      setOpen(false)
    }
  })

  const toggle = () => {
    openRef.current = !openRef.current
    setOpen(openRef.current)
  }

  return (
    <section
      id={id}
      ref={ref}
      className={`section chapter side-${c.side}${open ? ' is-details' : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="sticky">
        <article className="panel glass" data-reveal>
          <p className="kicker">
            <span className="num">{c.num}</span> {c.kicker}
          </p>
          <h2 id={`${id}-title`} className="h2">
            <Split text={c.title} data-split />
          </h2>
          <div className="panel-more" id={`${id}-more`}>
            <div className="panel-more-inner">
              <p>{c.text}</p>
              <dl className="facts">
                {c.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <button
            type="button"
            className="more-toggle"
            aria-expanded={open}
            aria-controls={`${id}-more`}
            onClick={toggle}
          >
            {open ? 'Less' : 'Details'} <span aria-hidden="true">{open ? '−' : '+'}</span>
          </button>
        </article>
      </div>
    </section>
  )
}

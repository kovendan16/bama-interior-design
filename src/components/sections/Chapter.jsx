import { useRef } from 'react'
import { Split } from '../Split'
import { CHAPTERS } from '../../lib/content'
import { useSectionProgress } from '../../lib/scroll'

// One room of the walkthrough. The camera glides through the room while this
// glass panel stays pinned beside it.
export function Chapter({ id }) {
  const ref = useRef()
  const c = CHAPTERS[id]
  useSectionProgress(ref, id)
  return (
    <section id={id} ref={ref} className={`section chapter side-${c.side}`} aria-labelledby={`${id}-title`}>
      <div className="sticky">
        <article className="panel glass" data-reveal>
          <p className="kicker">
            <span className="num">{c.num}</span> {c.kicker}
          </p>
          <h2 id={`${id}-title`} className="h2">
            <Split text={c.title} data-split />
          </h2>
          <p>{c.text}</p>
          <dl className="facts">
            {c.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { Split } from '../Split'
import { PROCESS, PROCESS_AT as AT } from '../../lib/content'
import { useSectionProgress } from '../../lib/scroll'


export function Process() {
  const ref = useRef()
  const line = useRef()
  const [stage, setStage] = useState(0)
  useSectionProgress(ref, 'process', (p) => {
    let s = 0
    AT.forEach((a, i) => p >= a && (s = i))
    setStage((prev) => (prev === s ? prev : s))
    if (line.current) line.current.style.transform = `scaleY(${p})`
  })
  return (
    <section id="process" ref={ref} className="section process" aria-labelledby="process-title">
      <div className="sticky">
        <div className="process-panel glass">
          <p className="kicker">
            <span className="num">09</span> Design Process
          </p>
          <h2 id="process-title" className="h2">
            <Split text="From blueprint to reality." data-split />
          </h2>
          <div className="timeline-wrap">
          <span className="timeline-line" aria-hidden="true">
            <span ref={line} />
          </span>
          <ol className="timeline">
            {PROCESS.map((st, i) => (
              <li key={st.title} className={i === stage ? 'is-active' : i < stage ? 'is-done' : ''} aria-current={i === stage ? 'step' : undefined}>
                <div className="t-head">
                  <span className="idx">0{i + 1}</span>
                  <h3>{st.title}</h3>
                  <span className="tag">{st.tag}</span>
                </div>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

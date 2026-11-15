import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { Split } from '../Split'
import { PROJECTS } from '../../lib/content'
import { useSectionProgress, ScrollTrigger } from '../../lib/scroll'

const PortfolioCanvas = lazy(() => import('../../three/PortfolioCanvas.jsx'))

export function Portfolio({ setMainPaused, device, webgl }) {
  const ref = useRef()
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState('overview')
  const [near, setNear] = useState(false)
  const [touched, setTouched] = useState(false)
  const zoomRef = useRef(0)
  useSectionProgress(ref, 'portfolio')

  useLayoutEffect(() => {
    // the main canvas sleeps while this section covers the screen
    const cover = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onToggle: (self) => setMainPaused(self.isActive),
    })
    // mount the viewer shortly before it is needed; unmount when far away
    const lazyMount = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 180%',
      end: 'bottom -150%',
      onToggle: (self) => setNear(self.isActive),
    })
    return () => {
      cover.kill()
      lazyMount.kill()
    }
  }, [setMainPaused])

  const p = PROJECTS[index]
  const select = (i) => {
    setIndex(i)
    setMode('overview')
  }

  return (
    <section id="portfolio" ref={ref} className="section portfolio" aria-labelledby="portfolio-title">
      <div className="sticky">
        <div className="portfolio-stage">
          {webgl && near && (
            <Suspense fallback={<div className="stage-loading">Loading 3D project…</div>}>
              <PortfolioCanvas room={p.room} mode={mode} zoomRef={zoomRef} isMobile={device.isMobile} onInteract={() => setTouched(true)} />
            </Suspense>
          )}
          {!webgl && <div className="stage-loading">3D preview requires WebGL.</div>}
        </div>

        <header className="portfolio-head">
          <p className="kicker">
            <span className="num">06</span> Interactive Portfolio
          </p>
          <h2 id="portfolio-title" className="h2">
            <Split text="Step into our projects." data-split />
          </h2>
        </header>

        <div className="tabs" role="tablist" aria-label="Projects">
          {PROJECTS.map((pr, i) => (
            <button key={pr.id} role="tab" aria-selected={i === index} aria-controls="project-card" className={`tab ${i === index ? 'is-active' : ''}`} onClick={() => select(i)}>
              {pr.type}
            </button>
          ))}
        </div>

        <article id="project-card" className="project-card glass" role="tabpanel" aria-live="polite" key={p.id}>
          <p className="kicker">
            {p.type} · {p.location}
          </p>
          <h3 className="h3">{p.title}</h3>
          <p>{p.text}</p>
          <dl className="facts">
            <div>
              <dt>Area</dt>
              <dd>{p.area}</dd>
            </div>
            <div>
              <dt>Style</dt>
              <dd>{p.style}</dd>
            </div>
          </dl>
          <ul className="swatches" aria-label="Key materials">
            {p.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </article>

        <div className="viewer-controls glass" role="toolbar" aria-label="3D viewer controls">
          <button className={mode === 'overview' ? 'is-active' : ''} aria-pressed={mode === 'overview'} onClick={() => setMode('overview')}>
            Overview
          </button>
          <button className={mode === 'inside' ? 'is-active' : ''} aria-pressed={mode === 'inside'} onClick={() => setMode('inside')}>
            Step inside · 360°
          </button>
          <span className="sep" aria-hidden="true" />
          <button aria-label="Zoom in" onClick={() => (zoomRef.current = 1)}>
            +
          </button>
          <button aria-label="Zoom out" onClick={() => (zoomRef.current = -1)}>
            −
          </button>
        </div>

        {!touched && (
          <div className="drag-hint" aria-hidden="true">
            <i /> Drag to {mode === 'inside' ? 'look around' : 'rotate'}
          </div>
        )}
      </div>
    </section>
  )
}

import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Move3d, ZoomIn, ZoomOut, Eye, Box } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { ScrollTrigger } from '../../lib/scroll'

const ShowcaseCanvas = lazy(() => import('../../three/ShowcaseCanvas.jsx'))

const ROOMS = [
  {
    id: 'living',
    label: 'Living Room',
    title: 'The Luxury Lounge',
    text: 'The finished room from our homepage transformation — real scanned furniture, herringbone parquet and lime plaster.',
    materials: ['Herringbone oak', 'Lime plaster', 'Leather Chesterfield', 'Marble & brass'],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    title: 'Suite Terracotta',
    text: 'Clay-toned walls, a channel-tufted headboard and walnut joinery for calm mornings.',
    materials: ['Clay plaster', 'Smoked walnut', 'Linen', 'Velvet'],
  },
  {
    id: 'kitchen',
    label: 'Modular Kitchen',
    title: 'Atelier Kitchen',
    text: 'A fluted walnut island with waterfall marble, sage cabinetry and a sculpted hood.',
    materials: ['Sage lacquer', 'Marble waterfall', 'Fluted walnut', 'Brushed brass'],
  },
  {
    id: 'office',
    label: 'Office',
    title: 'Navy Study',
    text: 'Deep navy walls, full-height walnut shelving and a reading corner for focused work.',
    materials: ['Navy plaster', 'Walnut', 'Leather', 'Blackened steel'],
  },
]

export function Showcase({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const zoomRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState('overview')
  const [near, setNear] = useState(false)
  const [touched, setTouched] = useState(false)

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 160%',
      end: 'bottom -60%',
      onToggle: (self) => setNear(self.isActive),
    })
    return () => st.kill()
  }, [])

  // "View in 3D" buttons in the portfolio select a room here
  useEffect(() => {
    const onSelect = (e) => {
      const i = ROOMS.findIndex((r) => r.id === e.detail)
      if (i >= 0) {
        setIndex(i)
        setMode('overview')
      }
    }
    window.addEventListener('showcase:select', onSelect)
    return () => window.removeEventListener('showcase:select', onSelect)
  }, [])

  const r = ROOMS[index]
  return (
    <section id="showcase" ref={ref} className="ui-section" aria-labelledby="showcase-title">
      <div className="ui-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="showcase-title"
            kicker="Interactive 3D showcase"
            title="Explore Every Room"
            highlight="in 3D."
            text="Rotate, zoom and step inside. Drag to look around, use the buttons to zoom, and switch rooms below."
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Rooms">
          {ROOMS.map((room, i) => (
            <button
              key={room.id}
              role="tab"
              aria-selected={i === index}
              onClick={() => {
                setIndex(i)
                setMode('overview')
              }}
              className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                i === index ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white text-ink-2 hover:border-blush-300 hover:text-ink'
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-ink/[0.06] bg-[#f3ece9] shadow-soft">
          <div className="relative h-[min(72vh,720px)] min-h-[440px] touch-pan-y">
            {webgl && near ? (
              <Suspense fallback={<div className="grid h-full place-items-center text-sm text-ink-3">Loading 3D room…</div>}>
                <ShowcaseCanvas room={r.id} mode={mode} zoomRef={zoomRef} isMobile={isMobile} onInteract={() => setTouched(true)} />
              </Suspense>
            ) : (
              <div className="grid h-full place-items-center text-sm text-ink-3">{webgl ? 'Loading 3D room…' : '3D preview needs WebGL — see our portfolio photos above.'}</div>
            )}
          </div>

          <article className="absolute left-4 top-4 max-w-[340px] rounded-3xl bg-white/90 p-5 shadow-card backdrop-blur md:left-6 md:top-6 md:p-6" aria-live="polite" key={r.id}>
            <p className="ui-kicker">{r.label}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-ink">{r.title}</h3>
            <p className="mt-2 hidden text-sm leading-relaxed text-ink-2 sm:block">{r.text}</p>
            <ul className="m-0 mt-4 hidden list-none flex-wrap gap-1.5 p-0 sm:flex" aria-label="Key materials">
              {r.materials.map((m) => (
                <li key={m} className="rounded-full bg-blush-50 px-3 py-1 text-xs text-ink-2">
                  {m}
                </li>
              ))}
            </ul>
          </article>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 p-1.5 shadow-card backdrop-blur" role="toolbar" aria-label="3D viewer controls">
            <button onClick={() => setMode('overview')} aria-pressed={mode === 'overview'} className={`flex cursor-pointer items-center gap-1.5 rounded-full border-0 px-4 py-2 text-sm ${mode === 'overview' ? 'bg-blush-200 text-ink' : 'bg-transparent text-ink-2 hover:bg-blush-50'}`}>
              <Box size={15} aria-hidden="true" /> Overview
            </button>
            <button onClick={() => setMode('inside')} aria-pressed={mode === 'inside'} className={`flex cursor-pointer items-center gap-1.5 rounded-full border-0 px-4 py-2 text-sm ${mode === 'inside' ? 'bg-blush-200 text-ink' : 'bg-transparent text-ink-2 hover:bg-blush-50'}`}>
              <Eye size={15} aria-hidden="true" /> Step inside
            </button>
            <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden="true" />
            <button onClick={() => (zoomRef.current = 1)} aria-label="Zoom in" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-ink-2 hover:bg-blush-50">
              <ZoomIn size={17} />
            </button>
            <button onClick={() => (zoomRef.current = -1)} aria-label="Zoom out" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-ink-2 hover:bg-blush-50">
              <ZoomOut size={17} />
            </button>
          </div>

          {!touched && (
            <div className="pointer-events-none absolute right-5 top-5 hidden items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-ink-2 shadow-card md:flex" aria-hidden="true">
              <Move3d size={15} className="text-blush-500" /> Drag to {mode === 'inside' ? 'look around' : 'rotate'}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

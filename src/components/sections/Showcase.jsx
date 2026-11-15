import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { ScrollTrigger, scrollToTarget } from '../../lib/scroll'
import { store } from '../../lib/store'
import { SC_ROOMS, U_TOTAL, roomFocusU, roomIndexAt } from '../../three/showcasePath'

const ShowcaseCanvas = lazy(() => import('../../three/ShowcaseCanvas.jsx'))

const INFO = {
  living: {
    label: 'Living Room',
    title: 'The Luxury Lounge',
    text: 'The finished room from our homepage transformation — real scanned furniture, herringbone parquet and lime plaster.',
    materials: ['Herringbone oak', 'Lime plaster', 'Leather Chesterfield', 'Marble & brass'],
  },
  bedroom: {
    label: 'Bedroom',
    title: 'Suite Terracotta',
    text: 'Clay-toned walls, a channel-tufted headboard and walnut joinery for calm mornings.',
    materials: ['Clay plaster', 'Smoked walnut', 'Linen', 'Velvet'],
  },
  kitchen: {
    label: 'Modular Kitchen',
    title: 'Atelier Kitchen',
    text: 'A fluted walnut island with waterfall marble, sage cabinetry and a sculpted hood.',
    materials: ['Sage lacquer', 'Marble waterfall', 'Fluted walnut', 'Brushed brass'],
  },
  bathroom: {
    label: 'Bathroom',
    title: 'Spa Bathroom',
    text: 'A freestanding tub beneath the window, green zellige tiles and twin mirrors lit by brass sconces.',
    materials: ['Marble floor', 'Green zellige', 'Travertine', 'Brushed brass'],
  },
  office: {
    label: 'Office',
    title: 'Navy Study',
    text: 'Deep navy walls, full-height walnut shelving and a reading corner for focused work.',
    materials: ['Navy plaster', 'Walnut', 'Leather', 'Blackened steel'],
  },
}
const ROOMS = SC_ROOMS.map((id) => ({ id, ...INFO[id] }))
const pad = (n) => String(n).padStart(2, '0')

/**
 * Scroll-driven house tour: the section pins and the camera walks from room to
 * room — each room builds itself out of the floor as you arrive.
 */
export function Showcase({ webgl = true, isMobile = false }) {
  const ref = useRef()
  const tour = useRef()
  const bar = useRef()
  const stRef = useRef()
  const [index, setIndex] = useState(0)
  const [near, setNear] = useState(false)
  const [moved, setMoved] = useState(false)

  useLayoutEffect(() => {
    const lazyLoad = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 180%',
      end: 'bottom -60%',
      onToggle: (self) => setNear(self.isActive),
    })
    const st = ScrollTrigger.create({
      trigger: tour.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        store.progress.showcase = self.progress
        const u = self.progress * U_TOTAL
        const i = roomIndexAt(u)
        setIndex((p) => (p === i ? p : i))
        const m = self.progress > 0.02
        setMoved((p) => (p === m ? p : m))
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
      },
    })
    stRef.current = st
    return () => {
      lazyLoad.kill()
      st.kill()
    }
  }, [])

  const goTo = (i) => {
    const st = stRef.current
    if (!st) return
    scrollToTarget(st.start + (roomFocusU(i) / U_TOTAL) * (st.end - st.start), { duration: 1.8 })
  }

  // "View in 3D" buttons in Projects jump straight to that room
  useEffect(() => {
    const onSelect = (e) => {
      const i = SC_ROOMS.indexOf(e.detail)
      if (i >= 0) goTo(i)
    }
    window.addEventListener('showcase:select', onSelect)
    return () => window.removeEventListener('showcase:select', onSelect)
  }, [])

  const r = ROOMS[index]
  return (
    <section id="showcase" ref={ref} className="ui-section pb-0 md:pb-0" aria-labelledby="showcase-title">
      <div className="ui-wrap">
        <SectionHeading
          id="showcase-title"
          kicker="Interactive 3D showcase"
          title="Walk Through Every Room"
          highlight="in 3D."
          text="Keep scrolling — the camera tours the house room by room: living room, bedroom, kitchen, bathroom and study."
        />
      </div>

      <div ref={tour} className="sc-tour">
        <div className="sc-sticky">
          <div className="sc-frame">
            {webgl && near ? (
              <Suspense fallback={<div className="grid h-full place-items-center text-sm text-ink-3">Loading 3D rooms…</div>}>
                <ShowcaseCanvas isMobile={isMobile} />
              </Suspense>
            ) : (
              <div className="grid h-full place-items-center text-sm text-ink-3">{webgl ? 'Loading 3D rooms…' : '3D preview needs WebGL — see our project photos above.'}</div>
            )}

            <article className="sc-card" aria-live="polite" key={r.id}>
              <p className="ui-kicker">
                Room {pad(index + 1)} / {pad(ROOMS.length)} · {r.label}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">{r.title}</h3>
              <p className="mt-2 hidden text-sm leading-relaxed text-ink-2 sm:block">{r.text}</p>
              <ul className="m-0 mt-4 hidden list-none flex-wrap gap-1.5 p-0 sm:flex" aria-label="Key materials">
                {r.materials.map((m) => (
                  <li key={m} className="rounded-full bg-blush-50 px-3 py-1 text-xs text-ink-2">
                    {m}
                  </li>
                ))}
              </ul>
            </article>

            <div className={`sc-hint ${moved ? 'is-hidden' : ''}`} aria-hidden="true">
              <ChevronDown size={15} className="animate-bounce text-blush-500" /> Scroll to walk through the house
            </div>

            <nav className="sc-rooms" aria-label="Jump to a room">
              <span className="sc-rail" aria-hidden="true">
                <i ref={bar} />
              </span>
              {ROOMS.map((room, i) => (
                <button key={room.id} type="button" onClick={() => goTo(i)} aria-current={i === index ? 'true' : undefined} className={i === index ? 'is-active' : i < index ? 'is-done' : ''}>
                  <span className="num">{pad(i + 1)}</span>
                  <span className="name">{room.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}

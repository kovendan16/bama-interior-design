import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Split } from '../Split'
import { GALLERY } from '../../lib/content'
import { ScrollTrigger, lockScroll } from '../../lib/scroll'
import { store } from '../../lib/store'

const ALL = 'All'
const CATEGORIES = [ALL, ...new Set(GALLERY.map((g) => g.category))]

// photos change the page height as they load; re-measure scroll positions (debounced)
let refreshTimer
const refreshLayout = () => {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
}

function Photo({ item, onOpen, missing, onMissing }) {
  return (
    <figure className={`g-item ${missing ? 'is-missing' : ''}`}>
      <button type="button" onClick={onOpen} disabled={missing} aria-label={`View ${item.title}`}>
        {missing ? (
          <div className="g-placeholder" aria-hidden="true">
            <img src="/logo.jpg" alt="" />
            <span>Add photo</span>
            <code>public{item.src}</code>
          </div>
        ) : (
          <img src={item.src} alt={item.title} loading="lazy" decoding="async" onLoad={refreshLayout} onError={onMissing} />
        )}
      </button>
      <figcaption>
        <span>{item.category}</span>
        {item.title}
      </figcaption>
    </figure>
  )
}

export function Gallery({ setPaused }) {
  const ref = useRef()
  const [filter, setFilter] = useState(ALL)
  const [missing, setMissing] = useState({})
  const [open, setOpen] = useState(null)

  const items = GALLERY.filter((g) => filter === ALL || g.category === filter)
  useEffect(refreshLayout, [filter, missing])
  const viewable = items.filter((g) => !missing[g.src])

  useLayoutEffect(() => {
    // pause the 3D canvas while the gallery covers the screen,
    // and highlight the "Gallery" nav link
    const cover = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onToggle: (self) => setPaused(self.isActive),
    })
    const nav = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => (store.galleryInView = self.isActive),
    })
    return () => {
      cover.kill()
      nav.kill()
      store.galleryInView = false
    }
  }, [setPaused])

  // lightbox: keyboard navigation + scroll lock
  useEffect(() => {
    if (open === null) return
    lockScroll(true)
    const n = viewable.length
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % n)
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [open, viewable.length])

  const current = open !== null ? viewable[open] : null
  const step = (d) => (e) => {
    e.stopPropagation()
    setOpen((i) => (i + d + viewable.length) % viewable.length)
  }

  return (
    <section id="gallery" ref={ref} className="section gallery" aria-labelledby="gallery-title">
      <div className="gallery-head">
        <div>
          <p className="kicker">Real spaces</p>
          <h2 id="gallery-title" className="h2">
            Homes we have <em className="italic-blush">brought to life</em>
          </h2>
          <p className="lead">Photographs from completed Bama Interiors projects, from first sketch to final styling.</p>
        </div>
        <div className="chips" aria-label="Filter photos">
          {CATEGORIES.map((c) => (
            <button key={c} aria-pressed={filter === c} className={`chip ${filter === c ? 'is-active' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="g-grid">
        {items.map((item) => (
          <Photo
            key={item.src}
            item={item}
            missing={!!missing[item.src]}
            onMissing={() => setMissing((m) => ({ ...m, [item.src]: true }))}
            onOpen={() => setOpen(viewable.indexOf(item))}
          />
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={() => setOpen(null)}>
          <img src={current.src} alt={current.title} onClick={(e) => e.stopPropagation()} />
          <p className="lightbox-cap">
            <span>{current.category}</span> {current.title}
          </p>
          <button className="lb-btn lb-close" aria-label="Close" onClick={() => setOpen(null)}>
            ✕
          </button>
          {viewable.length > 1 && (
            <>
              <button className="lb-btn lb-prev" aria-label="Previous photo" onClick={step(-1)}>
                ‹
              </button>
              <button className="lb-btn lb-next" aria-label="Next photo" onClick={step(1)}>
                ›
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}

import { useEffect, useState } from 'react'
import { Box, X, ArrowUpRight } from 'lucide-react'
import { PROJECTS_LIST } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'
import { scrollToTarget, lockScroll } from '../../lib/scroll'

// Open a room in the interactive 3D showcase (Showcase.jsx listens for this event).
export const openInShowcase = (room) => {
  window.dispatchEvent(new CustomEvent('showcase:select', { detail: room }))
  scrollToTarget('#showcase')
}

export function Projects() {
  const [open, setOpen] = useState(null)
  useEffect(() => {
    if (open === null) return
    lockScroll(true)
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % PROJECTS_LIST.length)
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + PROJECTS_LIST.length) % PROJECTS_LIST.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [open])
  const cur = open !== null ? PROJECTS_LIST[open] : null

  return (
    <section id="projects" className="ui-section" aria-labelledby="projects-title">
      <div className="ui-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="projects-title"
            kicker="Project portfolio"
            title="Spaces We’ve"
            highlight="Brought to Life."
            text="A selection of homes and commercial spaces. Open any project, or step inside selected rooms in 3D."
          />
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-stagger>
          {PROJECTS_LIST.map((p, i) => (
            <article key={p.name} className={`ui-card group overflow-hidden ${i === 0 ? 'lg:col-span-2' : ''}`}>
              <button type="button" onClick={() => setOpen(i)} className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" aria-label={`View ${p.name}`}>
                <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[16/8.4]' : 'aspect-[4/3]'}`}>
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">{p.category}</span>
                </div>
              </button>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">{p.name}</h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-blush-600">{p.style}</p>
                  </div>
                  {p.showcase && (
                    <button type="button" onClick={() => openInShowcase(p.showcase)} className="ui-btn ui-btn-line min-h-[40px] shrink-0 cursor-pointer px-4 text-sm">
                      <Box size={15} aria-hidden="true" /> View in 3D
                    </button>
                  )}
                </div>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {cur && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-white/95 p-4 backdrop-blur md:p-10" role="dialog" aria-modal="true" aria-label={cur.name} onClick={() => setOpen(null)}>
          <div className="grid w-full max-w-6xl gap-6 md:grid-cols-[1.6fr_1fr] md:items-center" onClick={(e) => e.stopPropagation()}>
            <img src={cur.img} alt={cur.name} className="max-h-[70vh] w-full rounded-3xl object-cover shadow-soft" />
            <div>
              <p className="ui-kicker">{cur.category}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink">{cur.name}</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.12em] text-blush-600">{cur.style}</p>
              <p className="mt-4 leading-relaxed text-ink-2">{cur.text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {cur.showcase && (
                  <button
                    type="button"
                    className="ui-btn ui-btn-dark cursor-pointer border-0"
                    onClick={() => {
                      setOpen(null)
                      openInShowcase(cur.showcase)
                    }}
                  >
                    <Box size={16} aria-hidden="true" /> View in 3D
                  </button>
                )}
                <a
                  href="#contact"
                  className="ui-btn ui-btn-line"
                  onClick={(e) => {
                    e.preventDefault()
                    setOpen(null)
                    scrollToTarget('#contact')
                  }}
                >
                  Start a similar project <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => setOpen(null)} className="absolute right-5 top-5 grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-ink/10 bg-white text-ink hover:bg-blush-100" aria-label="Close">
            <X size={20} />
          </button>
        </div>
      )}
    </section>
  )
}

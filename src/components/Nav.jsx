import { useEffect, useState } from 'react'
import { SITE } from '../lib/site'
import { scrollToTarget } from '../lib/scroll'
import { store } from '../lib/store'

const LINKS = [
  ['Home', '#hero'],
  ['Spaces', '#living'],
  ['Transform', '#transform'],
  ['Dollhouse', '#dollhouse'],
  ['Portfolio', '#portfolio'],
  ['Gallery', '#gallery'],
  ['Services', '#services'],
  ['About', '#about'],
  ['Process', '#process'],
]

const SECTION_TO_LINK = {
  hero: '#hero',
  living: '#living',
  bedroom: '#living',
  kitchen: '#living',
  transform: '#transform',
  dollhouse: '#dollhouse',
  portfolio: '#portfolio',
  services: '#services',
  about: '#about',
  process: '#process',
  contact: '#contact',
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#hero')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let raf
    const loop = () => {
      const a = store.galleryInView ? '#gallery' : SECTION_TO_LINK[store.active] || '#hero'
      setActive((prev) => (prev === a ? prev : a))
      const s = window.scrollY > 40
      setScrolled((prev) => (prev === s ? prev : s))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <a href="#hero" className="brand" onClick={(e) => go(e, '#hero')} aria-label={`${SITE.brand} ${SITE.brandSuffix} — home`}>
        <img className="brand-logo" src="/logo.jpg" alt="" width="44" height="44" />
        <span className="brand-word">
          {SITE.brand}
          <em>{SITE.brandSuffix}</em>
        </span>
      </a>
      <nav aria-label="Primary">
        <ul className="nav-links" id="nav-links">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={(e) => go(e, href)} className={active === href ? 'is-active' : ''} aria-current={active === href ? 'true' : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a href="#contact" className="btn btn-small nav-cta" onClick={(e) => go(e, '#contact')}>
        Book a consultation
      </a>
      <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
        <span />
        <span />
      </button>
    </header>
  )
}

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
  ['Contact', '#contact'],
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
    <header className={'nav ' + (scrolled ? 'is-scrolled ' : '') + (open ? 'is-open' : '')}>
      <a href="#hero" className="brand pill" onClick={(e) => go(e, '#hero')} aria-label={SITE.brand + ' ' + SITE.brandSuffix + ' — home'}>
        <img className="brand-logo" src="/logo.jpg" alt="" width="34" height="34" />
        <span className="brand-word">
          {SITE.brand}
          <em>{SITE.brandSuffix}</em>
        </span>
      </a>
      <div className="nav-actions">
        <a href="#contact" className="pill pill-link" onClick={(e) => go(e, '#contact')}>
          Connect <span aria-hidden="true">↗</span>
        </a>
        <button className="pill pill-menu" aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
          <span className="burger" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>
      <nav id="nav-menu" className="menu" aria-label="Primary" aria-hidden={!open}>
        <ol className="menu-links">
          {LINKS.map(([label, href], i) => (
            <li key={href} style={{ '--i': i }}>
              <a href={href} onClick={(e) => go(e, href)} className={active === href ? 'is-active' : ''} aria-current={active === href ? 'true' : undefined} tabIndex={open ? 0 : -1}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
        <div className="menu-foot">
          <a href={SITE.phoneHref} tabIndex={open ? 0 : -1}>{SITE.phone}</a>
          <a href={'mailto:' + SITE.email} tabIndex={open ? 0 : -1}>{SITE.email}</a>
          <span>{SITE.address}</span>
        </div>
      </nav>
    </header>
  )
}

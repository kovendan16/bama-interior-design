import { useEffect, useRef, useState } from 'react'
import { SITE } from '../lib/site'
import { scrollToTarget } from '../lib/scroll'

const LEFT = [
  ['Spaces', '#living'],
  ['Transform', '#transform'],
  ['Gallery', '#gallery'],
]
const RIGHT = [
  ['Services', '#services'],
  ['About', '#about'],
]

// readable name of whichever section is in the middle of the screen
const NAMES = {
  hero: 'Home',
  living: 'Spaces',
  bedroom: 'Spaces',
  kitchen: 'Spaces',
  transform: 'Transform',
  dollhouse: 'Dollhouse',
  portfolio: 'Portfolio',
  gallery: 'Gallery',
  services: 'Services',
  about: 'About',
  process: 'Process',
  story: 'Moodboard',
  cta: 'Your home',
  contact: 'Contact',
}

/**
 * Centred top bar: logo in the middle, a few links each side. Once you scroll,
 * the links tuck away and the logo becomes a small badge showing the current
 * section, with a thin pink line tracking progress down the page.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [section, setSection] = useState('Home')
  const [active, setActive] = useState('hero')
  const bar = useRef()

  useEffect(() => {
    let raf
    const loop = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      const s = y > 60
      setScrolled((prev) => (prev === s ? prev : s))
      const mid = window.innerHeight * 0.5
      let id = 'hero'
      for (const el of document.querySelectorAll('main > section')) {
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom > mid) {
          id = el.id
          break
        }
      }
      setActive((prev) => (prev === id ? prev : id))
      setSection((prev) => (prev === (NAMES[id] || 'Home') ? prev : NAMES[id] || 'Home'))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    scrollToTarget(href)
  }
  const link = ([label, href]) => (
    <a key={href} href={href} onClick={(e) => go(e, href)} className={NAMES[active] === label ? 'is-active' : ''} tabIndex={scrolled ? -1 : 0}>
      {label}
    </a>
  )

  return (
    <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="topbar-side left" aria-label="Sections">
        {LEFT.map(link)}
      </nav>
      <a href="#hero" className="topbar-brand" onClick={(e) => go(e, '#hero')} aria-label={`${SITE.brand} ${SITE.brandSuffix} — home`}>
        <img src="/logo.jpg" alt="" width="52" height="52" />
        <span className="topbar-name">
          {SITE.brand} <em>{SITE.brandSuffix}</em>
        </span>
        <span className="topbar-section" aria-live="polite">
          {section}
        </span>
        <span className="topbar-progress" aria-hidden="true">
          <i ref={bar} />
        </span>
      </a>
      <nav className="topbar-side right" aria-label="More">
        {RIGHT.map(link)}
        <a href="#contact" className="topbar-book" onClick={(e) => go(e, '#contact')}>
          <span className="long">Book a visit</span>
          <span className="short">Book</span>
        </a>
      </nav>
    </header>
  )
}

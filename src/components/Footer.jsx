import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, ArrowUpRight } from 'lucide-react'
import { SITE, whatsappLink } from '../lib/site'
import { SERVICES_LIST } from '../lib/sections'
import { scrollToTarget } from '../lib/scroll'

const QUICK = [
  ['Home', '#hero'],
  ['About Us', '#about'],
  ['Services', '#services'],
  ['Projects', '#projects'],
  ['3D Showcase', '#showcase'],
  ['Design Process', '#process'],
  ['Contact', '#contact'],
]
const SOCIAL_ICON = { Instagram, Facebook, LinkedIn: Linkedin }

export function Footer() {
  const go = (href) => (e) => {
    e.preventDefault()
    scrollToTarget(href)
  }
  return (
    <footer className="relative z-[3] border-t border-ink/[0.06] bg-[#fbf6f4] px-[var(--gutter)] pb-10 pt-20">
      <div className="ui-wrap grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <a href="#hero" onClick={go('#hero')} className="inline-flex items-center gap-3 text-ink no-underline">
            <img src="/logo.jpg" alt="" width="52" height="52" className="h-[52px] w-[52px] rounded-full [clip-path:circle(47.6%)]" />
            <span className="text-[0.74rem] font-medium uppercase tracking-[0.3em]">
              {SITE.brand} <span className="text-blush-600">{SITE.brandSuffix}</span>
            </span>
          </a>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-2">{SITE.description}</p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blush-600 no-underline hover:gap-2.5">
            Chat on WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <nav aria-label="Quick links">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Quick links</h3>
          <ul className="m-0 mt-5 grid list-none gap-2.5 p-0">
            {QUICK.map(([l, h]) => (
              <li key={h}>
                <a href={h} onClick={go(h)} className="text-[0.95rem] text-ink-2 no-underline hover:text-blush-600">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Services</h3>
          <ul className="m-0 mt-5 grid list-none gap-2.5 p-0">
            {SERVICES_LIST.map((s) => (
              <li key={s.title}>
                <a href="#services" onClick={go('#services')} className="text-[0.95rem] text-ink-2 no-underline hover:text-blush-600">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Contact</h3>
          <ul className="m-0 mt-5 grid list-none gap-3 p-0 text-[0.95rem] text-ink-2">
            <li className="flex gap-3">
              <Phone size={17} className="mt-0.5 shrink-0 text-blush-500" aria-hidden="true" />
              <a href={SITE.phoneHref} className="text-ink-2 no-underline hover:text-blush-600">
                {SITE.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={17} className="mt-0.5 shrink-0 text-blush-500" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="break-all text-ink-2 no-underline hover:text-blush-600">
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-blush-500" aria-hidden="true" />
              <span>{SITE.address}</span>
            </li>
          </ul>
          <ul className="m-0 mt-6 flex list-none gap-2 p-0" aria-label="Social media">
            {SITE.social.map((s) => {
              const I = SOCIAL_ICON[s.name]
              return (
                <li key={s.name}>
                  <a href={s.href} aria-label={s.name} className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink-2 no-underline transition hover:border-blush-300 hover:bg-blush-100 hover:text-ink">
                    {I ? <I size={17} aria-hidden="true" /> : <span className="text-xs font-semibold">{s.name.charAt(0)}</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="ui-wrap mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/[0.06] pt-6 text-sm text-ink-3">
        <p className="m-0">
          © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
        </p>
        <p className="m-0">Designing Spaces. Inspiring Living.</p>
      </div>
    </footer>
  )
}

import { Quote } from 'lucide-react'
import { TESTIMONIALS } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'

// NOTE: entries in lib/sections.js are placeholders — replace with genuine client reviews.
export function Testimonials() {
  return (
    <section id="testimonials" className="ui-section is-warm" aria-labelledby="testimonials-title">
      <div className="ui-wrap">
        <SectionHeading id="testimonials-title" kicker="Testimonials" title="Experiences That" highlight="Speak for Us." align="center" />
        <div className="mt-14 grid gap-5 md:grid-cols-3" data-stagger>
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="ui-card m-0 flex flex-col p-8">
              <Quote size={28} className="text-blush-400" aria-hidden="true" />
              <blockquote className="m-0 mt-5 flex-1 text-[1.02rem] leading-relaxed text-ink-2">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/[0.06] pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush-100 font-semibold text-blush-600" aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{t.name}</span>
                  <span className="block text-sm text-ink-3">{t.project}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink-3">Placeholder reviews — replace with genuine feedback from your clients.</p>
      </div>
    </section>
  )
}

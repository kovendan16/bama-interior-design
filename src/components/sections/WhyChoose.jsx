import { WHY } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'

export function WhyChoose() {
  return (
    <section id="why" className="ui-section" aria-labelledby="why-title">
      <div className="ui-wrap">
        <SectionHeading id="why-title" kicker="Why choose Bama" title="Design That Makes a" highlight="Difference." align="center" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
          {WHY.map((w, i) => (
            <article key={w.title} className="ui-card group relative overflow-hidden p-8">
              <span className="pointer-events-none absolute -right-6 -top-8 select-none text-[7rem] font-semibold leading-none tracking-[-0.06em] text-blush-50 transition duration-500 group-hover:text-blush-100" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="ui-icon relative transition duration-500 group-hover:bg-blush-200 group-hover:text-ink">
                <Icon name={w.icon} />
              </span>
              <h3 className="relative mt-5 text-xl font-semibold tracking-[-0.02em] text-ink">{w.title}</h3>
              <p className="relative mt-2 text-[0.95rem] leading-relaxed text-ink-2">{w.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

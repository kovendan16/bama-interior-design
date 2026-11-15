import { ABOUT } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'

export function About() {
  return (
    <section id="about" className="ui-section" aria-labelledby="about-title">
      <div className="ui-wrap">
        <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_1fr]">
          <SectionHeading id="about-title" kicker="About us" title="Designing Spaces That" highlight="Feel Like Home." text={ABOUT.text} />
          <div className="grid grid-cols-3 gap-3" data-reveal>
            {[
              ['240+', 'Homes designed'],
              ['16', 'Years of craft'],
              ['100%', 'Designed in 3D first'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-3xl bg-blush-50 p-5 text-center">
                <strong className="block text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold tracking-[-0.04em] text-ink">{n}</strong>
                <span className="mt-1 block text-xs text-ink-3">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-right text-[0.7rem] text-ink-3">* Figures are placeholders — update with your studio’s numbers.</p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {ABOUT.pillars.map((p) => (
            <article key={p.title} className="ui-card group overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="ui-icon">
                  <Icon name={p.icon} />
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

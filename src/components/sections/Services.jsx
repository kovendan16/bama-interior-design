import { ArrowUpRight } from 'lucide-react'
import { SERVICES_LIST } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'
import { scrollToTarget } from '../../lib/scroll'

export function Services() {
  return (
    <section id="services" className="ui-section is-warm" aria-labelledby="services-title">
      <div className="ui-wrap">
        <SectionHeading
          id="services-title"
          kicker="Our services"
          title="Thoughtful Design."
          highlight="Beautiful Living."
          text="From a single room to a complete home or commercial space — one studio for planning, design, materials and execution."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {SERVICES_LIST.map((s) => (
            <article key={s.title} className="ui-card group flex flex-col overflow-hidden">
              <div className="relative aspect-[5/4] overflow-hidden">
                <img src={s.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="ui-icon absolute left-4 top-4 bg-white/90 backdrop-blur">
                  <Icon name={s.icon} size={20} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-[0.93rem] leading-relaxed text-ink-2">{s.text}</p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('#contact')
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blush-600 no-underline transition group-hover:gap-2.5"
                  aria-label={`Explore more about ${s.title}`}
                >
                  Explore More <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

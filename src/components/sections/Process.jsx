import { useLayoutEffect, useRef, useState } from 'react'
import { PROCESS_STEPS } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'
import { ScrollTrigger } from '../../lib/scroll'

/**
 * Seven-step design process. On large screens the image column stays pinned
 * and cross-fades to the step currently in view; on phones each step shows its
 * own image.
 */
// Photos fade in only once decoded, and a failed one simply hides — the frame
// never shows the browser's broken-image icon.
const onImgLoad = (e) => e.currentTarget.classList.add('is-loaded')
const onImgError = (e) => (e.currentTarget.style.display = 'none')
const markIfReady = (el) => el && el.complete && el.naturalWidth > 0 && el.classList.add('is-loaded')

export function Process() {
  const root = useRef()
  const list = useRef()
  const line = useRef()
  const [active, setActive] = useState(0)
  const [near, setNear] = useState(false)

  // start loading every step photo well before the section arrives
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({ trigger: root.current, start: 'top 250%', once: true, onEnter: () => setNear(true) })
    return () => st.kill()
  }, [])

  useLayoutEffect(() => {
    const items = list.current.querySelectorAll('[data-step]')
    const sts = [...items].map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => self.isActive && setActive(i),
      }),
    )
    const prog = ScrollTrigger.create({
      trigger: list.current,
      start: 'top 60%',
      end: 'bottom 60%',
      onUpdate: (self) => line.current && (line.current.style.transform = `scaleY(${self.progress})`),
    })
    return () => {
      sts.forEach((s) => s.kill())
      prog.kill()
    }
  }, [])

  return (
    <section id="process" ref={root} className="ui-section is-warm" aria-labelledby="process-title">
      <div className="ui-wrap">
        <SectionHeading
          id="process-title"
          kicker="Design process"
          title="From Empty Space to"
          highlight="Extraordinary Living."
          text="A clear, collaborative journey — you always know what happens next."
        />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="relative hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush-50 shadow-soft">
              {near &&
                PROCESS_STEPS.map((s, i) => (
                  <div
                    key={s.title}
                    className="absolute inset-0 transition duration-700"
                    style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1)' : 'scale(1.06)' }}
                  >
                    <img src={s.img} alt="" decoding="async" ref={markIfReady} onLoad={onImgLoad} onError={onImgError} className="process-img h-full w-full object-cover" />
                  </div>
                ))}
              <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink backdrop-blur">
                Step {String(active + 1).padStart(2, '0')} — {PROCESS_STEPS[active].title}
              </span>
            </div>
          </div>
          <ol ref={list} className="relative m-0 list-none p-0">
            <span className="absolute bottom-3 left-[19px] top-3 w-px bg-ink/10" aria-hidden="true">
              <i ref={line} className="block h-full w-full origin-top scale-y-0 bg-blush-400" />
            </span>
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.title} data-step className="relative pb-12 pl-16 last:pb-0" data-reveal>
                <span
                  className={`absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold transition duration-500 ${
                    i <= active ? 'border-blush-400 bg-blush-200 text-ink' : 'border-ink/10 bg-white text-ink-3'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`text-2xl font-semibold tracking-[-0.03em] transition ${i === active ? 'text-ink' : 'text-ink-2'}`}>{s.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-ink-2">{s.text}</p>
                <div className="mt-5 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-blush-50 lg:hidden">
                  <img src={s.img} alt="" loading="lazy" decoding="async" ref={markIfReady} onLoad={onImgLoad} onError={onImgError} className="process-img h-full w-full object-cover" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

// Shared heading block: mono kicker, large title (last words highlighted pink), intro text.
export function SectionHeading({ kicker, title, highlight, text, align = 'left', id }) {
  const center = align === 'center'
  return (
    <header className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`} data-reveal>
      {kicker && <p className="ui-kicker">{kicker}</p>}
      <h2 id={id} className="mt-4 text-[clamp(2.1rem,4.2vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
        {title} {highlight && <span className="text-blush-500">{highlight}</span>}
      </h2>
      {text && <p className={`mt-5 text-[1.05rem] leading-relaxed text-ink-2 ${center ? 'mx-auto' : ''} max-w-2xl`}>{text}</p>}
    </header>
  )
}

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Check } from 'lucide-react'
import { SITE, whatsappLink } from '../../lib/site'
import { PROJECT_TYPES } from '../../lib/sections'
import { SectionHeading } from '../ui/SectionHeading'

const EMPTY = { name: '', email: '', phone: '', type: '', location: '', message: '' }

export function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.'
    if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone)) e.phone = 'Please enter a valid phone number.'
    if (!form.type) e.type = 'Choose a project type.'
    if (form.message.trim().length < 10) e.message = 'A short description helps us prepare (10+ characters).'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      ev.currentTarget.querySelector(`[name="${Object.keys(e)[0]}"]`)?.focus()
      return
    }
    setStatus('sending')
    // TODO: connect to your backend or form service (e.g. POST to an API endpoint).
    await new Promise((r) => setTimeout(r, 900))
    setStatus('sent')
    setForm(EMPTY)
  }

  const waText = form.name || form.type ? `Hello Bama Interior Design, I'm ${form.name || 'interested'}${form.type ? ` — enquiring about: ${form.type}` : ''}${form.location ? ` in ${form.location}` : ''}.` : undefined

  const input = 'w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-[0.98rem] text-ink outline-none transition placeholder:text-ink-3/70 focus:border-blush-400 focus:ring-4 focus:ring-blush-100'
  const field = (k) => ({
    id: `f-${k}`,
    name: k,
    value: form[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? 'true' : undefined,
    'aria-describedby': errors[k] ? `e-${k}` : undefined,
    className: `${input} ${errors[k] ? 'border-red-300' : ''}`,
  })
  const err = (k) =>
    errors[k] ? (
      <span id={`e-${k}`} className="mt-1 block text-xs text-red-600">
        {errors[k]}
      </span>
    ) : null
  const label = 'mb-1.5 block text-sm font-medium text-ink'

  return (
    <section id="contact" className="ui-section" aria-labelledby="contact-title">
      <div className="ui-wrap grid gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading
            id="contact-title"
            kicker="Contact us"
            title="Let’s Create Your"
            highlight="Dream Space."
            text="Have an idea for your home or commercial space? Tell us about your vision. Let’s work together to create an interior you’ll love."
          />
          <ul className="m-0 mt-10 grid list-none gap-3 p-0" data-stagger>
            {[
              [Phone, 'Phone', SITE.phone, SITE.phoneHref],
              [Mail, 'Email', SITE.email, `mailto:${SITE.email}`],
              [MapPin, 'Office', SITE.address],
              [Clock, 'Business hours', SITE.hours],
            ].map(([I, k, v, href]) => (
              <li key={k} className="flex items-center gap-4 rounded-2xl border border-ink/[0.06] bg-[#fbf6f4] p-4">
                <span className="ui-icon shrink-0">
                  <I size={19} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.12em] text-ink-3">{k}</span>
                  {href ? (
                    <a href={href} className="text-ink no-underline hover:text-blush-600">
                      {v}
                    </a>
                  ) : (
                    <span className="text-ink">{v}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-3">Contact details above are placeholders — edit them in src/lib/site.js.</p>
        </div>

        <form onSubmit={submit} noValidate className="ui-card p-6 hover:translate-y-0 md:p-9" aria-describedby="form-status" data-reveal>
          {status === 'sent' ? (
            <div className="grid min-h-[420px] place-items-center text-center" role="status">
              <div>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-100 text-blush-600">
                  <Check size={26} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink">Thank you — enquiry received.</h3>
                <p className="mt-2 text-ink-2">We’ll get back to you within one working day.</p>
                <button type="button" className="ui-btn ui-btn-line mt-6 cursor-pointer" onClick={() => setStatus('idle')}>
                  Send another enquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="f-name">
                  <span className={label}>Full Name</span>
                  <input type="text" autoComplete="name" placeholder="Your name" {...field('name')} />
                  {err('name')}
                </label>
                <label htmlFor="f-email">
                  <span className={label}>Email Address</span>
                  <input type="email" autoComplete="email" placeholder="you@example.com" {...field('email')} />
                  {err('email')}
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="f-phone">
                  <span className={label}>
                    Phone Number <span className="font-normal text-ink-3">(optional)</span>
                  </span>
                  <input type="tel" autoComplete="tel" placeholder="+91" {...field('phone')} />
                  {err('phone')}
                </label>
                <label htmlFor="f-type">
                  <span className={label}>Project Type</span>
                  <select {...field('type')}>
                    <option value="">Select…</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  {err('type')}
                </label>
              </div>
              <label htmlFor="f-location">
                <span className={label}>
                  Location <span className="font-normal text-ink-3">(optional)</span>
                </span>
                <input type="text" autoComplete="address-level2" placeholder="City / area" {...field('location')} />
              </label>
              <label htmlFor="f-message">
                <span className={label}>Message</span>
                <textarea rows={5} placeholder="Tell us about your space and what you’d love to change" {...field('message')} />
                {err('message')}
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={status === 'sending'} className="ui-btn ui-btn-dark flex-1 cursor-pointer border-0 disabled:opacity-60">
                  <Send size={16} aria-hidden="true" /> {status === 'sending' ? 'Sending…' : 'Submit Enquiry'}
                </button>
                <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="ui-btn flex-1 bg-[#25D366] text-white hover:-translate-y-0.5 hover:brightness-95">
                  <MessageCircle size={17} aria-hidden="true" /> WhatsApp Us
                </a>
              </div>
              <p id="form-status" className="sr-only" aria-live="polite">
                {status === 'sending' ? 'Sending your enquiry' : ''}
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

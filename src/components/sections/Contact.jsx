import { useRef, useState } from 'react'
import { Split } from '../Split'
import { SITE } from '../../lib/site'
import { useSectionProgress, scrollToTarget } from '../../lib/scroll'

const EMPTY = { name: '', email: '', phone: '', type: '', budget: '', message: '' }

export function Contact() {
  const ref = useRef()
  useSectionProgress(ref, 'contact')
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.'
    if (!form.type) e.type = 'Choose a project type.'
    if (form.message.trim().length < 10) e.message = 'A short description helps us prepare (10+ characters).'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = ev.currentTarget.querySelector(`[name="${Object.keys(e)[0]}"]`)
      first?.focus()
      return
    }
    setStatus('sending')
    // TODO: connect to your backend / form service (e.g. POST to an API route).
    await new Promise((r) => setTimeout(r, 900))
    setStatus('sent')
    setForm(EMPTY)
  }

  const field = (k) => ({
    id: `f-${k}`,
    name: k,
    value: form[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? 'true' : undefined,
    'aria-describedby': errors[k] ? `e-${k}` : undefined,
  })
  const err = (k) =>
    errors[k] ? (
      <span className="field-error" id={`e-${k}`}>
        {errors[k]}
      </span>
    ) : null

  return (
    <section id="contact" ref={ref} className="section contact" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div className="contact-info">
          <p className="kicker" data-reveal>
            <span className="num">10</span> Contact
          </p>
          <h2 id="contact-title" className="h2">
            <Split text="Let's design your next chapter." data-split />
          </h2>
          <p className="lead" data-reveal>
            Tell us about your space. We'll come back within one working day with a first idea and a time to walk through it in 3D.
          </p>
          <ul className="contact-lines" data-reveal>
            <li>
              <span>Call</span>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </li>
            <li>
              <span>Email</span>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <span>Studio</span>
              <span>{SITE.address}</span>
            </li>
            <li>
              <span>Hours</span>
              <span>{SITE.hours}</span>
            </li>
          </ul>
          <div className="btn-row" data-reveal>
            <a className="btn" href={SITE.phoneHref}>
              Call the studio
            </a>
            <a className="btn btn-ghost" href={`mailto:${SITE.email}?subject=Consultation%20request`}>
              Email us
            </a>
          </div>
        </div>

        <form className="contact-form glass" onSubmit={submit} noValidate aria-describedby="form-status">
          {status === 'sent' ? (
            <div className="form-success" role="status">
              <h3 className="h3">Thank you.</h3>
              <p>Your message is with our design team. We'll be in touch within one working day.</p>
              <button type="button" className="btn btn-ghost btn-small" onClick={() => setStatus('idle')}>
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="row">
                <label htmlFor="f-name">
                  <span>Full name</span>
                  <input type="text" autoComplete="name" {...field('name')} />
                  {err('name')}
                </label>
                <label htmlFor="f-email">
                  <span>Email</span>
                  <input type="email" autoComplete="email" {...field('email')} />
                  {err('email')}
                </label>
              </div>
              <div className="row">
                <label htmlFor="f-phone">
                  <span>Phone <small>(optional)</small></span>
                  <input type="tel" autoComplete="tel" {...field('phone')} />
                </label>
                <label htmlFor="f-type">
                  <span>Project type</span>
                  <select {...field('type')}>
                    <option value="">Select…</option>
                    <option>Full home</option>
                    <option>Living room</option>
                    <option>Bedroom</option>
                    <option>Modular kitchen</option>
                    <option>Bathroom</option>
                    <option>Home office</option>
                    <option>Commercial space</option>
                  </select>
                  {err('type')}
                </label>
              </div>
              <label htmlFor="f-budget">
                <span>Budget range <small>(optional)</small></span>
                <select {...field('budget')}>
                  <option value="">Prefer not to say</option>
                  <option>Under $25k</option>
                  <option>$25k – $75k</option>
                  <option>$75k – $200k</option>
                  <option>$200k+</option>
                </select>
              </label>
              <label htmlFor="f-message">
                <span>About your space</span>
                <textarea rows={4} {...field('message')} />
                {err('message')}
              </label>
              <button type="submit" className="btn btn-block" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Request a consultation'}
              </button>
              <p id="form-status" className="sr-only" aria-live="polite">
                {status === 'sending' ? 'Sending your message' : ''}
              </p>
            </>
          )}
        </form>
      </div>

      <footer className="footer">
        <div className="footer-brand">
          {SITE.brand}
          <em>{SITE.brandSuffix}</em>
        </div>
        <nav aria-label="Footer">
          {[
            ['Portfolio', '#portfolio'],
            ['Services', '#services'],
            ['Process', '#process'],
            ['Back to top', '#hero'],
          ].map(([l, h]) => (
            <a
              key={h}
              href={h}
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(h)
              }}
            >
              {l}
            </a>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} {SITE.brand} {SITE.brandSuffix}. All rights reserved.</p>
      </footer>
    </section>
  )
}

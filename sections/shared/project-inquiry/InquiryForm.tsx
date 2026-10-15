'use client'

import { useRef, useState, type FormEvent } from 'react'
import { readAttribution, track } from '@/lib/attribution'

const DIAL_CODES = ['+880', '+1', '+44', '+61', '+91', '+971', '+966', '+49']

export function InquiryForm({
  budgets,
  submitLabel,
  successMessage,
}: {
  budgets: string[]
  submitLabel: string
  successMessage: string
}) {
  const form = useRef<HTMLFormElement>(null)
  const [invalid, setInvalid] = useState<Record<string, boolean>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const startedAt = useRef(Date.now())

  const validate = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const ok = el.checkValidity() && el.value.trim() !== ''
    setInvalid((prev) => ({ ...prev, [el.name]: !ok }))
    return ok
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.current || state === 'sending') return
    const required = [...form.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')]
    const bad = required.filter((el) => !validate(el))
    if (bad.length) {
      setState('error')
      setMessage('Please add your name, a valid email and a few project details.')
      bad[0].focus()
      return
    }
    setState('sending')
    setMessage('Sending…')
    const data = Object.fromEntries(new FormData(form.current).entries())
    try {
      const res = await fetch('/forms/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          attribution: { ...readAttribution(), formPage: window.location.pathname },
          elapsedMs: Date.now() - startedAt.current,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Something went wrong.')
      setState('sent')
      setMessage(successMessage)
      track('generate_lead', { form: 'project_inquiry', budget: data.budget || undefined })
      form.current.reset()
    } catch (err) {
      setState('error')
      setMessage(
        `${err instanceof Error ? err.message : 'Something went wrong.'} You can also email us at hello@zeetech.studio.`,
      )
    }
  }

  const field = (name: string) => `field${invalid[name] ? ' is-invalid' : ''}`

  return (
    <form className="form" ref={form} onSubmit={onSubmit} noValidate>
      {/* honeypot — hidden from people, bots tend to fill it in */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Company website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={field('name')}>
        <label htmlFor="f-name">Full Name</label>
        <input
          id="f-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="E.G. ALEX MORGAN"
          required
          maxLength={120}
          aria-invalid={invalid.name || undefined}
          onBlur={(e) => e.target.value && validate(e.target)}
        />
      </div>
      <div className="form__row">
        <div className={field('email')}>
          <label htmlFor="f-email">Your Email</label>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="yourmail@gmail.com"
            required
            maxLength={160}
            aria-invalid={invalid.email || undefined}
            onBlur={(e) => e.target.value && validate(e.target)}
          />
        </div>
        <div className="field">
          <label htmlFor="f-phone">Whatsapp Number</label>
          <div className="field__phone">
            <img src="/brand/icon-whatsapp.svg" width={20} height={20} alt="" aria-hidden="true" />
            <select name="dial" aria-label="Country code" defaultValue="+880">
              {DIAL_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input id="f-phone" name="phone" type="tel" autoComplete="tel-national" placeholder="123 456 7890" maxLength={30} />
          </div>
        </div>
      </div>
      {budgets.length ? (
        <fieldset className="field budget">
          <legend>Project Budget</legend>
          <div className="budget__chips">
            {budgets.map((b) => (
              <label key={b}>
                <input type="radio" name="budget" value={b} />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className={field('details')}>
        <label htmlFor="f-details">Project Details</label>
        <textarea
          id="f-details"
          name="details"
          rows={3}
          placeholder="I want to redesign my website....."
          required
          maxLength={5000}
          aria-invalid={invalid.details || undefined}
          onBlur={(e) => e.target.value && validate(e.target)}
        />
      </div>
      <div className="form__actions">
        <button className="btn btn--signal" type="submit" disabled={state === 'sending'}>
          <span>{state === 'sending' ? 'Sending…' : submitLabel}</span>
          <svg className="btn__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className={`form__status${state === 'sent' ? ' is-success' : ''}`} role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  )
}

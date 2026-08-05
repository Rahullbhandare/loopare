import { useEffect, useRef, useState } from 'react'
import { submitToWaitlist } from './waitlist.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9()+\-\s]{7,20}$/

export default function WaitlistModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250)
    } else {
      setName('')
      setEmail('')
      setPhone('')
      setStatus('idle')
      setError('')
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmed = email.trim()
    const trimmedPhone = phone.trim()
    const phoneDigits = trimmedPhone.replace(/\D/g, '')
    const emailOk = EMAIL_RE.test(trimmed)
    const phoneOk = !trimmedPhone || (PHONE_RE.test(trimmedPhone) && phoneDigits.length >= 7 && phoneDigits.length <= 15)
    if (!trimmedName) {
      setError('Please enter your name.')
      setStatus('error')
      return
    }
    if (!trimmed) {
      setError('Please enter your email address.')
      setStatus('error')
      return
    }
    if (!emailOk || !phoneOk) {
      setError('Please enter valid credentials.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setError('')
    try {
      await submitToWaitlist(trimmedName, trimmed, trimmedPhone)
      setStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      closeTimer.current = setTimeout(() => onClose(), 3200)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="lw-backdrop" role="dialog" aria-modal="true" aria-label="Join the Loopare waitlist"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="lw-card">
        <button className="lw-close" aria-label="Close" onClick={onClose}>×</button>

        {status !== 'success' ? (
          <>
            <span className="lw-card__mark" aria-hidden="true" />
            <h3 className="lw-card__title">Be one of the first in Loopare World.</h3>
            <p className="lw-card__body">
              Loopare is launching soon. Join the waitlist and we'll let you know the moment
              you can start buying, selling, renting and trading — keeping it moving.
            </p>
            <form className="lw-form" onSubmit={handleSubmit} noValidate>
              <label className="lw-label" htmlFor="lw-name">
                Name <span className="lw-required">*</span>
              </label>
              <input
                id="lw-name"
                ref={inputRef}
                className="lw-input"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                aria-label="Name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (status === 'error') setStatus('idle') }}
                disabled={status === 'submitting'}
                required
              />
              <label className="lw-label" htmlFor="lw-email">
                Email <span className="lw-required">*</span>
              </label>
              <input
                id="lw-email"
                className="lw-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                disabled={status === 'submitting'}
                required
              />
              <input
                className="lw-input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Phone number (optional)"
                aria-label="Phone number (optional)"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (status === 'error') setStatus('idle') }}
                disabled={status === 'submitting'}
              />
              <button className="lw-submit" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Joining…' : 'Join Loopare'}
              </button>
              {status === 'error' && error && <p className="lw-error" role="alert">{error}</p>}
            </form>
          </>
        ) : (
          <div className="lw-success">
            <span className="lw-success__badge" aria-hidden="true">🎉</span>
            <h3 className="lw-card__title">Welcome to Loopare World!</h3>
            <p className="lw-card__body">
              Thanks for joining our waitlist. We'll keep you updated before launch.
            </p>
            <p className="sw-tagline lw-success__tagline">Keep it moving.</p>
          </div>
        )}
      </div>
    </div>
  )
}

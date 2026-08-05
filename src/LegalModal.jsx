import { useEffect } from 'react'

const YEAR = new Date().getFullYear()

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    body: (
      <>
        <p>Last updated: {YEAR}. This policy explains what information Loopare collects on this website and how it's used, while Loopare is in its pre-launch waitlist stage.</p>

        <h4>Information we collect</h4>
        <p>When you join the waitlist, we collect the email address you provide and, if you choose to share it, a phone number. We don't require any other personal information to join the waitlist.</p>

        <h4>How we use it</h4>
        <p>We use your email (and phone, if provided) only to notify you when Loopare launches and to share relevant updates about the platform. We don't sell or rent your information to third parties.</p>

        <h4>Where it's stored</h4>
        <p>Waitlist submissions and your theme preference (dark/light) are currently stored securely for our own use in operating the waitlist. As Loopare moves toward launch, this may move to a dedicated backend service — this policy will be updated if that changes how your data is handled.</p>

        <h4>Your rights</h4>
        <p>You can ask us to remove your email from the waitlist at any time by contacting us at the email below. Under India's Digital Personal Data Protection Act, you also have the right to access, correct, or withdraw consent for your personal data.</p>

        <h4>Changes to this policy</h4>
        <p>We may update this policy as Loopare develops. Material changes will be reflected here with an updated date.</p>

        <h4>Contact</h4>
        <p>Questions about this policy? Email us at <a href="mailto:hello@loopare.com">hello@loopare.com</a>.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Use',
    body: (
      <>
        <p>Last updated: {YEAR}. By using this website and joining the Loopare waitlist, you agree to the following terms.</p>

        <h4>About Loopare</h4>
        <p>Loopare is a marketplace platform currently in pre-launch, intended to let people buy, sell, rent, exchange, and trade services with one another. This website's current purpose is to share information about Loopare and collect waitlist signups ahead of launch.</p>

        <h4>Peer-to-peer marketplace</h4>
        <p>When Loopare launches, it will connect members directly with one another. Loopare does not own, store, inspect, or ship any products listed or exchanged between members, and is not a party to any transaction, rental, exchange, or barter arrangement made between users.</p>

        <h4>Waitlist</h4>
        <p>Joining the waitlist does not guarantee access to Loopare or any specific launch date, and is not a purchase, subscription, or contract for service.</p>

        <h4>Acceptable use</h4>
        <p>You agree not to misuse this website — including attempting to disrupt its operation, submitting false information, or using it for any unlawful purpose.</p>

        <h4>Intellectual property</h4>
        <p>The Loopare name, logo, and the content of this site belong to Loopare and may not be copied or reused without permission.</p>

        <h4>Disclaimer</h4>
        <p>This website and the Loopare platform are provided "as is" without warranties of any kind, to the extent permitted by law.</p>

        <h4>Governing law</h4>
        <p>These terms are governed by the laws of India.</p>

        <h4>Contact</h4>
        <p>Questions about these terms? Email us at <a href="mailto:hello@loopare.com">hello@loopare.com</a>.</p>
      </>
    ),
  },
  cookies: {
    title: 'Cookies Policy',
    body: (
      <>
        <p>Last updated: {YEAR}. This explains how Loopare uses cookies and similar browser storage on this website.</p>

        <h4>What we use</h4>
        <p>This site uses your browser's local storage (not traditional tracking cookies) to remember two things: your dark/light theme preference, and — if you join the waitlist — your submitted email and phone, so you don't see a duplicate confirmation if you visit again.</p>

        <h4>No third-party tracking</h4>
        <p>This site does not currently use third-party advertising or analytics cookies.</p>

        <h4>Managing this</h4>
        <p>You can clear this stored data at any time through your browser's settings (usually under "Clear browsing data" or "Site settings"). Clearing it will reset your theme preference and may cause the waitlist form to no longer recognize a prior submission.</p>

        <h4>Changes</h4>
        <p>If Loopare adds analytics or third-party cookies in the future, this policy will be updated to reflect that before it happens.</p>

        <h4>Contact</h4>
        <p>Questions about this policy? Email us at <a href="mailto:hello@loopare.com">hello@loopare.com</a>.</p>
      </>
    ),
  },
}

export default function LegalModal({ type, onClose }) {
  useEffect(() => {
    if (!type) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [type, onClose])

  if (!type) return null
  const entry = CONTENT[type]
  if (!entry) return null

  return (
    <div className="lw-backdrop" role="dialog" aria-modal="true" aria-label={entry.title}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="lw-card lg-card">
        <button className="lw-close" aria-label="Close" onClick={onClose}>×</button>
        <h3 className="lw-card__title">{entry.title}</h3>
        <div className="lg-body">{entry.body}</div>
      </div>
    </div>
  )
}

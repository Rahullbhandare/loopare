import { useState } from 'react'
import LegalModal from './LegalModal.jsx'

const FAQS = [
  {
    q: 'What is Loopare?',
    a: "Loopare is India's All in One Marketplace, where people can buy, sell, exchange, rent, and service barter. Our mission is simple: keep useful products, opportunities, and skills moving instead of letting them go to waste.",
  },
  {
    q: 'How does Loopare work?',
    a: "List something you no longer need, an item you'd like to rent out, or a service you can offer — then discover what others are offering and connect directly through Loopare. Whether you're buying, selling, exchanging, renting, or service bartering, we make it easier for useful things to find their next owner.",
  },
  {
    q: 'How is Loopare different from other marketplaces?',
    a: 'Most marketplaces focus only on buying and selling. Loopare goes further by building a circular ecosystem where products keep creating value through selling, exchanging, renting, service barter, and future community-driven features — all designed to reduce waste and save money.',
  },
  {
    q: 'What can I list on Loopare?',
    a: "You can list everyday items such as electronics, furniture, books, bicycles, fashion, home essentials, collectibles, services, and much more — as long as they're legal, safe, and in usable condition.",
  },
  {
    q: 'Is Loopare free to use?',
    a: 'Yes. Joining the waitlist is completely free. Pricing and platform features will be shared closer to launch.',
  },
  {
    q: 'Does Loopare own or store products?',
    a: "No. Loopare doesn't own or store products. We simply connect people, making it easier for useful items and services to move from one person to the next.",
  },
  {
    q: 'How does service barter, exchange, and rent work?',
    a: 'Service barter lets you trade a skill for someone else\'s skill instead of money. Exchange lets you swap an item you no longer need for one you do. Rent lets you borrow something for a set period and return it when you\'re done — all arranged directly between members.',
  },
  {
    q: 'Can businesses use Loopare?',
    a: 'Yes. Local shops and small businesses can use Loopare too — to offer rentals, trade services, or connect with the community, alongside individual members.',
  },
]

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="lf-faq">
      <h4 className="lf-footer__heading lf-footer__heading--plain">FAQ</h4>
      <div className="lf-faq__list">
        {FAQS.map(({ q, a }, i) => {
          const open = openIndex === i
          return (
            <div key={q} className={`lf-faq__item${open ? ' is-open' : ''}`}>
              <button
                type="button"
                className="lf-faq__question"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
              >
                <span>{q}</span>
                <span className="lf-faq__icon" aria-hidden="true" />
              </button>
              {open && <p className="lf-faq__answer">{a}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.2v5.6l5-2.8-5-2.8Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 3l18 18M21 3L3 21" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M14 8.5h-1.4c-1 0-1.6.6-1.6 1.7V12h3l-.4 3h-2.6v6h-3v-6H6v-3h2v-2.1c0-2.6 1.5-4.2 4-4.2H14v2.8Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
function RedditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="13.2" r="7.2" />
      <circle cx="9" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 16c1 .9 2 .9 3 .9s2 0 3-.9" strokeLinecap="round" />
      <path d="M14.5 6.5 16 4l2 1" strokeLinecap="round" />
      <circle cx="18.2" cy="4.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function PinterestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.5 18c1-3.6 1.6-6.3 2.1-8.3.3-1.3 2.1-1.2 2 .3-.1 1.4-.9 3.6-1.3 5-.3 1.2.6 2.1 1.7 2.1 2 0 3.4-2.6 3.4-5.1 0-2.2-1.6-3.9-4.2-3.9-3 0-4.8 2.1-4.8 4.4 0 .8.3 1.4.7 1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/loopareofficial/', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@Loopare', Icon: YoutubeIcon },
  { label: 'X', href: 'https://x.com/loopareofficial', Icon: XIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/LoopareOfficial', Icon: FacebookIcon },
  { label: 'Reddit', href: 'https://www.reddit.com/user/LoopareOfficial', Icon: RedditIcon },
  { label: 'Pinterest', href: 'https://in.pinterest.com/loopareofficial/?actingBusinessId=1100989577562711952', Icon: PinterestIcon },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [legalOpen, setLegalOpen] = useState(null)
  return (
    <footer className="lf-footer">
      <div className="lf-footer__upper">
        <FaqAccordion />

        <div className="lf-footer__top">
          <div className="lf-footer__col">
            <h4 className="lf-footer__heading lf-footer__heading--plain">Contact Us</h4>
            <div className="lf-footer__contact">
              <p className="lf-footer__line">
                <span className="lf-footer__label">E.</span>{' '}
                <a href="mailto:hello@loopare.com">hello@loopare.com</a>
              </p>
              <p className="lf-footer__line">
                <span className="lf-footer__label">P.</span>{' '}
                <a href="tel:+917420006267">+91 7420006267</a>
              </p>
            </div>
          </div>
          <div className="lf-footer__col">
            <h4 className="lf-footer__heading lf-footer__heading--plain">Follow us on</h4>
            <div className="lf-footer__social">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="lf-footer__social-link">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lf-footer__brandblock">
        <span className="lf-footer__mark" aria-hidden="true" />
        <p className="lf-footer__tagline">Keep it moving.</p>
      </div>

      <div className="lf-footer__bottom">
        <p>&copy; Loopare {year}</p>
        <nav className="lf-footer__legal" aria-label="Legal">
          <button type="button" onClick={() => setLegalOpen('privacy')}>Privacy Policy</button>
          <button type="button" onClick={() => setLegalOpen('terms')}>Terms of Use</button>
          <button type="button" onClick={() => setLegalOpen('cookies')}>Cookies Policy</button>
        </nav>
      </div>

      <LegalModal type={legalOpen} onClose={() => setLegalOpen(null)} />
    </footer>
  )
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { mountScrollWorld } from './scrubEngine.js'
import WaitlistModal from './WaitlistModal.jsx'
import Footer from './Footer.jsx'

const ACCENT = '#1D4ED8'

const sections = [
  {
    id: 'residential',
    label: 'Buy / Sell',
    still: '/assets/scene1.webp',
    stillMobile: '/assets/scene1-m.webp',
    clip: '/assets/vid/scene1.mp4',
    clipMobile: '/assets/vid/scene1-m.mp4',
    accent: ACCENT,
    scroll: 1.8,
    linger: 0.35,
    eyebrow: 'Buy / Sell',
    title: "An item finds its next owner.",
    body: "One person's unused item becomes exactly what you've been looking for.",
    tags: [],
  },
  {
    id: 'cafe',
    label: 'Service Barter',
    still: '/assets/scene2.webp',
    stillMobile: '/assets/scene2-m.webp',
    clip: '/assets/vid/scene2.mp4',
    clipMobile: '/assets/vid/scene2-m.mp4',
    accent: ACCENT,
    scroll: 1.4,
    linger: 0.3,
    eyebrow: 'Service Barter',
    title: 'Talent is\nvaluable too.',
    body: "Trade what you know for what you'd love to learn.",
    tags: [],
  },
  {
    id: 'campus',
    label: 'Exchange',
    still: '/assets/scene3.webp',
    stillMobile: '/assets/scene3-m.webp',
    clip: '/assets/vid/scene3.mp4',
    clipMobile: '/assets/vid/scene3-m.mp4',
    accent: ACCENT,
    scroll: 1.25,
    linger: 0.25,
    eyebrow: 'Exchange',
    title: 'One Swap,\nTwo Winners.',
    body: 'Exchange what they need for an item you need.',
    tags: [],
  },
  {
    id: 'metro',
    label: 'Rent',
    still: '/assets/scene4.webp',
    stillMobile: '/assets/scene4-m.webp',
    clip: '/assets/vid/scene4.mp4',
    clipMobile: '/assets/vid/scene4-m.mp4',
    accent: ACCENT,
    scroll: 1.2,
    linger: 0.25,
    eyebrow: 'Rent',
    title: 'Sometimes you only need an item for a while.',
    body: 'Rent what you need, only for as long as you need it.',
    tags: [],
  },
  {
    id: 'cafeblue',
    label: 'Community',
    still: '/assets/scene5.webp',
    stillMobile: '/assets/scene5-m.webp',
    clip: '/assets/vid/scene5.mp4',
    clipMobile: '/assets/vid/scene5-m.mp4',
    accent: ACCENT,
    scroll: 1.3,
    linger: 0.3,
    eyebrow: 'Community',
    title: 'Communities grow when people help each other.',
    body: 'Someone needs your skills, while you need their products or services.',
    tags: [],
  },
  {
    id: 'harbor',
    label: 'Circular Living',
    still: '/assets/scene6.webp',
    stillMobile: '/assets/scene6-m.webp',
    clip: '/assets/vid/scene6.mp4',
    clipMobile: '/assets/vid/scene6-m.mp4',
    accent: ACCENT,
    scroll: 1.55,
    linger: 0.35,
    eyebrow: 'Circular Living',
    title: 'From One Family to Another.',
    body: 'What your family has outgrown could be exactly what another family has been looking for.',
    tags: [],
  },
  {
    id: 'plaza',
    label: 'About Us',
    still: '/assets/scene7.webp',
    stillMobile: '/assets/scene7-m.webp',
    clip: '/assets/vid/scene7.mp4',
    clipMobile: '/assets/vid/scene7-m.mp4',
    accent: ACCENT,
    scroll: 2.4,
    linger: 0.5,
    eyebrow: 'About Us',
    title: "India's All in One Marketplace.",
    body: "Loopare is building a world where nothing valuable goes to waste. We believe every useful product, every valuable skill, and every opportunity deserves a new purpose. By helping them keep it moving from one person to the next, we're reducing waste, saving money, strengthening communities, and creating a more sustainable world and promising future.",
    tags: [],
    cta: { primary: { label: 'Join Waitlist', href: '#waitlist' } },
  },
]

// The engine builds brand / nav / topcta as flat siblings of .sw-topbar, with no
// wrapper elements — there's nowhere to hook true "center regardless of side widths"
// layout, and nowhere to visually fuse the CTA into the nav pill-track. Restructuring
// this once after mount (rather than patching per-render) gives the topbar exactly
// three children — brand, a center group holding [CTA, nav] fused together, and the
// (portaled) theme toggle — which lines up 1:1 with a `grid-template-columns:
// 1fr auto 1fr` layout for true holy-grail centering.
function restructureTopbar(container) {
  const topbar = container.querySelector('.sw-topbar')
  const brand = topbar?.querySelector('.sw-brand')
  const topcta = topbar?.querySelector('.sw-topcta')
  const nav = topbar?.querySelector('.sw-nav')
  if (!topbar || !nav) return topbar
  const center = document.createElement('div')
  center.className = 'sw-topbar__center'
  topbar.insertBefore(center, nav)
  if (topcta) center.appendChild(topcta)
  center.appendChild(nav)
  return topbar
}

// Desktop only, per feedback: the finale section's "Join Waitlist" button moves out
// of the text column entirely and sits as an overlay directly on the plaza scene, at
// a spot picked out on the render (an open stretch of paving to the right of the
// monument). .sw-copy has its own transform (translateY(-50%)), which makes it a
// containing block for absolutely/fixed-positioned descendants — so the button has to
// physically move to a different ancestor (.sw-copylayer, which spans the full
// viewport with no transform of its own) to be positionable against the whole screen
// rather than just within the narrow text column's box.
function relocateFinaleCta(container) {
  if (window.matchMedia('(max-width: 860px)').matches) return
  const copylayer = container.querySelector('.sw-copylayer')
  const copies = container.querySelectorAll('.sw-copy')
  const lastCopy = copies[copies.length - 1]
  const cta = lastCopy?.querySelector('.sw-copy__cta')
  if (!copylayer || !lastCopy || !cta) return
  cta.classList.add('sw-finale-cta')
  copylayer.appendChild(cta)

  // The engine fades .sw-copy in gradually via inline opacity as you scroll through
  // the section (not a hard on/off), so the button — now a sibling instead of a
  // descendant — has to mirror that same inline style on every update rather than
  // using its own CSS transition keyed off the active-section attribute, which flips
  // as soon as the section becomes "current" and made the button pop in well before
  // the rest of the text had faded up.
  const sync = () => {
    cta.style.opacity = lastCopy.style.opacity
    cta.style.pointerEvents = lastCopy.style.pointerEvents
  }
  sync()
  new MutationObserver(sync).observe(lastCopy, { attributes: true, attributeFilter: ['style'] })
}

function mountTagline(container, sectionCount) {
  const copies = container.querySelectorAll('.sw-copy')
  const lastCopy = copies[sectionCount - 1]
  if (!lastCopy || lastCopy.querySelector('.sw-tagline')) return
  const tagline = document.createElement('p')
  tagline.className = 'sw-tagline'
  tagline.textContent = 'Keep it moving.'
  lastCopy.appendChild(tagline)
}

function applyTheme(container, theme) {
  document.documentElement.dataset.theme = theme
  if (container) container.dataset.theme = theme
}

// Small inline icons rather than emoji, to match a clean vector toggle-switch look.
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="sw-theme-toggle"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggle}
    >
      <span className="sw-theme-toggle__knob">
        {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  )
}

export default function App() {
  const hostRef = useRef(null)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [topbarEl, setTopbarEl] = useState(null)
  // Dark is the default look for the whole site; a saved explicit choice (from the
  // toggle) always takes priority over that default on repeat visits.
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('loopare_theme') || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    const container = hostRef.current
    if (!container) return
    container.innerHTML = '' // guard against double-mount (HMR, etc.)

    mountScrollWorld(container, {
      brand: { name: 'Loopare', href: '#' },
      diveScroll: 1.3,
      crossfade: 0.08,
      hint: 'scroll to walk through Loopare World',
      nav: true,
      atmosphere: true,
      sections,
      connectors: [],
      cta: { label: 'Join Waitlist', href: '#waitlist' },
    })

    mountTagline(container, sections.length)
    relocateFinaleCta(container)
    const topbar = restructureTopbar(container)
    // Portal the theme toggle into the top bar itself (rather than position:fixed
    // independently) so it's a real flex sibling of brand/center-group — that's what
    // lets the nav pills center in the true remaining space and the toggle sit
    // vertically aligned with the rest of the bar for free, instead of guessing offsets.
    setTopbarEl(topbar)

    // The engine builds its CTA buttons as plain vanilla DOM, so they're wired via
    // delegation rather than a React onClick — both open the same React-rendered modal.
    // The top-bar one (.sw-topcta) auto-hides on the last section via CSS, since that
    // section already shows its own large in-content CTA.
    const onContainerClick = (e) => {
      if (e.target.closest('.sw-copy__cta .sw-btn--primary') || e.target.closest('.sw-topcta')) {
        e.preventDefault()
        setWaitlistOpen(true)
      }
    }
    container.addEventListener('click', onContainerClick)
    applyTheme(container, theme)

    // The engine's chrome (topbar, video stage, scroll-driven copy text, hint) stays
    // position:fixed forever — that's fine and unchanged now, since the footer is
    // meant to visually stand *inside* the still-showing Loop Plaza scene rather than
    // being a separate page section it has to cut away to. The footer's own z-index
    // (200 — see index.css) simply beats every z-index the engine ever assigns (its
    // ceiling is 120, for the currently-active scene segment), so once the footer's
    // own document position scrolls into view it naturally paints over the fixed
    // chrome, without needing to hide, fade, or reposition that chrome at all.
    //
    // The engine's crossfade keeps running on every scroll and fades a segment's
    // opacity toward 0 over the ~80px past its own end (CROSSFADE*vh) — built for
    // crossfading into a *next* segment, but the final one has none, so left alone
    // the plaza the footer stands in front of quietly disappears a few dozen pixels
    // in, replaced by .sw-sky's flat accent-colored background.
    //
    // The video itself is a second, separate problem: its currentTime is driven by a
    // scroll-linked seek/smoothing loop, which is fine while actively scrubbing but
    // has no defined "done" state — depending on exact scroll speed and video decode
    // timing it can settle on a hazy, not-yet-in-focus mid-clip frame instead of the
    // sharp final one, and that's genuinely inconsistent run to run, not something
    // worth chasing further at the timing level (already tried snapping it instantly
    // in scrubEngine.js's raf() — still not reliably enough). The robust fix is to
    // stop depending on the video for this state entirely: swap to the plain <img>
    // still (.sw-scene__still, the same scene7.webp already fully loaded and always
    // pixel-correct — there's no "seek" for a static image to get wrong) the moment
    // scroll passes the section's end, so what the footer stands in front of is
    // always the crisp final frame, deterministically, regardless of video timing.
    const lastSegEl = container.querySelector('.sw-stage > *:last-child')
    // Footer's high z-index (200, see index.css) means it visually starts covering
    // the fixed scene chrome as soon as ANY part of its own document position enters
    // the viewport — which, since footer sits right at #world's own height, happens
    // once scrollY + innerHeight reaches that point, roughly one viewport *before*
    // scrollY itself would.
    const pastWorldEnd = () => lastSegEl && window.scrollY + window.innerHeight >= container.offsetHeight
    const keepFinalSceneVisible = () => {
      if (!lastSegEl) return
      const vid = lastSegEl.querySelector('.sw-scene__video')
      const img = lastSegEl.querySelector('.sw-scene__still')
      if (pastWorldEnd()) {
        lastSegEl.style.opacity = '1'
        if (vid) vid.style.opacity = '0'
        if (img) img.style.opacity = '1'
      } else {
        // Scrolling back up out of the footer zone must undo the still/video swap
        // above, or the video stays permanently hidden behind an inline opacity:0
        // (which beats the engine's own default CSS) even once you're back in
        // scene 7's normal interactive range — clearing these hands control back to
        // the engine's own class-based rule (.has-clip .sw-scene__still{opacity:0})
        // and its own scroll-driven inline updates on the video, exactly as before
        // any of this ran.
        if (img) img.style.opacity = ''
        if (vid) vid.style.opacity = ''
      }
    }
    keepFinalSceneVisible()
    window.addEventListener('scroll', keepFinalSceneVisible, { passive: true })
    // A plain scroll listener runs synchronously, but the engine's own read() is
    // deferred one frame via requestAnimationFrame — so on every scroll it kept
    // silently winning the race and undoing this a moment later (confirmed directly:
    // dispatching a synthetic 'scroll' event set opacity back to 0 within 50ms of
    // this listener setting it to 1). A MutationObserver reacting to the engine's own
    // style writes sidesteps the race entirely — whenever it changes anything on this
    // element, this fires right after and, if still past the end, immediately puts it
    // back, however many times the engine's loop keeps touching it.
    const styleObserver = new MutationObserver(keepFinalSceneVisible)
    if (lastSegEl) styleObserver.observe(lastSegEl, { attributes: true, attributeFilter: ['style'] })

    return () => {
      container.removeEventListener('click', onContainerClick)
      window.removeEventListener('scroll', keepFinalSceneVisible)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    applyTheme(hostRef.current, theme)
    try {
      localStorage.setItem('loopare_theme', theme)
    } catch {
      /* localStorage unavailable — theme still applies for this session */
    }
  }, [theme])

  return (
    <>
      <div id="world" ref={hostRef} />
      <Footer />
      {topbarEl && createPortal(
        <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />,
        topbarEl,
      )}
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  )
}

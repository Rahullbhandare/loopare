import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'

// The page's real height is entirely JS-driven (mountScrollWorld's huge .sw-track
// spacer, sized in an effect long after this module runs). Browsers restore the
// visitor's last scroll position by default on reload — if that restoration
// happens before the track is sized, the same scrollY value that used to sit near
// the bottom (the footer/FAQ) now lands somewhere else in a document that starts
// out much shorter, so the page flashes the footer before "snapping" back to the
// top once layout() runs and the real height kicks in. Not device-specific — it's
// a browser behavior, so it showed up everywhere. Taking scroll restoration over
// ourselves, as early as possible, is the standard fix.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

// No StrictMode: mountScrollWorld builds real DOM + listeners imperatively,
// and isn't safe to double-invoke the way StrictMode does to pure React effects.
ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)

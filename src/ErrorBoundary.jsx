import { Component } from 'react'

// Catches errors thrown during React's own render/lifecycle (WaitlistModal,
// Footer, LegalModal, App itself). It can NOT catch errors inside
// scrubEngine.js's imperative DOM/rAF code — that runs entirely outside
// React's render tree, which is the one thing error boundaries are scoped to.
// Still worth having: without this, any render error anywhere in the React
// tree unmounts the whole app and leaves a blank white page with zero
// explanation for the visitor.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Loopare: unhandled React error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '24px',
            textAlign: 'center',
            background: '#0E1116',
            color: '#F4F2ED',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            Something went wrong loading Loopare.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              borderRadius: '999px',
              border: 'none',
              background: '#1D4ED8',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

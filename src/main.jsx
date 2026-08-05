import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// No StrictMode: mountScrollWorld builds real DOM + listeners imperatively,
// and isn't safe to double-invoke the way StrictMode does to pure React effects.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './src/index.css'
import { registerSW } from 'virtual:pwa-register'
import App from './src/App'

registerSW({ immediate: true })

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Could not find root element to mount to')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

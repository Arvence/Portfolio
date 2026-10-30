import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import StartupLoader from './components/StartupLoader.tsx'

const stylesheet = document.getElementById('app-styles') as HTMLLinkElement | null

function cleanup() {
  stylesheet?.removeEventListener('load', startApp)
  stylesheet?.removeEventListener('error', failStartup)
}

function failStartup() {
  cleanup()
  document.dispatchEvent(new Event('portfolio:startup-error'))
}

function startApp() {
  cleanup()
  createRoot(document.getElementById('root')!, {
    onUncaughtError(error, errorInfo) {
      console.error(error, errorInfo)
      document.dispatchEvent(new Event('portfolio:startup-error'))
    },
  }).render(
    <StrictMode>
      <BrowserRouter>
        <App />
        <StartupLoader />
      </BrowserRouter>
    </StrictMode>,
  )
}

if (!stylesheet || stylesheet.dataset.state === 'ready') startApp()
else if (stylesheet.dataset.state === 'error') failStartup()
else {
  stylesheet.addEventListener('load', startApp)
  stylesheet.addEventListener('error', failStartup)
}

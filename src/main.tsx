import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import StartupLoader from './components/StartupLoader.tsx'

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

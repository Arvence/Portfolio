import { useLayoutEffect } from 'react'

const EXIT_DURATION = 180

export default function StartupLoader() {
  useLayoutEffect(() => {
    const loader = document.getElementById('startup-loader')
    const root = document.getElementById('root')
    if (!loader || !root) return

    const restoreFocus = loader.contains(document.activeElement)
    root.inert = false
    root.removeAttribute('aria-busy')
    document.documentElement.dataset.startup = 'exiting'
    document.dispatchEvent(new Event('portfolio:startup-ready'))

    const finish = () => {
      delete document.documentElement.dataset.startup
      loader.remove()
      document.dispatchEvent(new Event('portfolio:startup-complete'))
    }

    if (restoreFocus) document.getElementById('main-content')?.focus({ preventScroll: true })

    if (loader.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    loader.inert = true
    loader.setAttribute('aria-hidden', 'true')
    const exitTimer = window.setTimeout(finish, EXIT_DURATION)

    return () => window.clearTimeout(exitTimer)
  }, [])

  return null
}

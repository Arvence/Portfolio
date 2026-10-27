import { useEffect } from 'react'

const MINIMUM_DURATION = 2000
const EXIT_DURATION = 180

export default function StartupLoader() {
  useEffect(() => {
    const loader = document.getElementById('startup-loader')
    const root = document.getElementById('root')
    if (!loader || !root) return

    const startedAt = Number(loader.dataset.startedAt)
    let exitTimer: number | undefined

    const minimumTimer = window.setTimeout(
      () => {
        document.documentElement.dataset.startup = 'exiting'
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const finish = () => {
          const restoreFocus = loader.contains(document.activeElement)
          root.inert = false
          root.removeAttribute('aria-busy')
          delete document.documentElement.dataset.startup
          loader.remove()
          document.dispatchEvent(new Event('portfolio:startup-complete'))

          if (restoreFocus) document.getElementById('main-content')?.focus({ preventScroll: true })
        }

        if (reducedMotion) finish()
        else exitTimer = window.setTimeout(finish, EXIT_DURATION)
      },
      Math.max(0, Math.ceil(MINIMUM_DURATION - (performance.now() - startedAt))),
    )

    return () => {
      window.clearTimeout(minimumTimer)
      window.clearTimeout(exitTimer)
    }
  }, [])

  return null
}

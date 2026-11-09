import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import Container from './Container'
import Navigation from './Navigation'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const updateHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)
    }
    const observer = new ResizeObserver(updateHeight)
    updateHeight()
    observer.observe(header)

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--header-height')
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 shrink-0 border-b border-white/5 bg-[#0c0d0f]/15 backdrop-blur-sm"
    >
      <Container wide className="grid grid-cols-[1fr_auto_1fr] items-center py-2 sm:py-2.5">
        <Link
          to="/"
          aria-label="Go to the homepage"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold tracking-[0.06em] text-[#0c0d0f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)] sm:size-9"
        >
          AS
        </Link>
        <Navigation />
        <span aria-hidden="true" className="h-9" />
      </Container>
    </header>
  )
}

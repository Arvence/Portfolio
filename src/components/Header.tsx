import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Container from './Container'
import Navigation from './Navigation'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const updateScrolled = () => setScrolled(window.scrollY > 8)
    const updateHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)
    }
    const observer = new ResizeObserver(updateHeight)
    updateHeight()
    observer.observe(header)
    window.addEventListener('scroll', updateScrolled, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateScrolled)
      document.documentElement.style.removeProperty('--header-height')
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 shrink-0 transition-colors duration-200 ${scrolled ? 'bg-[var(--color-background)]/85 backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <Container wide className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-1 sm:py-2">
        <Link
          to="/"
          aria-label="Go to the homepage"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold tracking-[0.1em] text-[var(--color-text-primary)]"
        >
          AS
        </Link>
        <Navigation />
      </Container>
    </header>
  )
}

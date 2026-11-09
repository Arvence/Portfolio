import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Container from '../components/Container'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SpaceBackground from '../components/SpaceBackground'

export default function AppLayout() {
  const { pathname, hash, key } = useLocation()
  const previousPath = useRef(pathname)
  const mainRef = useRef<HTMLElement>(null)
  const planetVisible = true

  useEffect(() => {
    if (previousPath.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true })
      previousPath.current = pathname
    }
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, key])

  return (
    <div className="relative isolate flex min-h-dvh flex-col text-[var(--color-text-primary)]">
      <SpaceBackground planetVisible={planetVisible} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--color-surface)] focus:px-4 focus:py-2 focus:text-[var(--color-text-primary)]"
      >
        Skip to main content
      </a>

      <Header />

      <div className="flex min-w-0 flex-1 flex-col">
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className={`flex-1 focus:outline-none ${pathname === '/' ? '' : 'py-10 sm:py-12 lg:py-16'}`}
        >
          <Container wide={pathname === '/'}>
            <Outlet />
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  )
}

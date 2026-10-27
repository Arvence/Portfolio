import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Container from '../components/Container'
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function AppLayout() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      mainRef.current?.focus({ preventScroll: true })
      previousPath.current = pathname
    }
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] lg:flex-row">
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
          <Container className={pathname === '/' ? 'max-w-[1600px]' : ''}>
            <Outlet />
          </Container>
        </main>
        <Footer />
      </div>
    </div>
  )
}

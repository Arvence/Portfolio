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
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10 focus:bg-neutral-900 focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <Header />
      <main ref={mainRef} id="main-content" tabIndex={-1} className="flex-1 py-12 focus:outline-none sm:py-16">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}

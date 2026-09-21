import { Outlet } from 'react-router'
import Navigation from '../components/Navigation'

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10 focus:bg-neutral-900 focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <header className="border-b border-neutral-800">
        <div className="page-container flex flex-wrap items-center justify-between gap-4 py-6">
          <span className="font-semibold">Portfolio</span>
          <Navigation />
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="page-container flex-1 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-800">
        <div className="page-container py-6 text-sm text-neutral-400">Portfolio</div>
      </footer>
    </div>
  )
}

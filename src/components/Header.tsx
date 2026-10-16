import { Link } from 'react-router'
import Navigation from './Navigation'

export default function Header() {
  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-20 lg:shrink-0">
      <div className="flex flex-col items-center px-3 py-4 lg:pt-6">
        <Link
          to="/"
          aria-label="Go to the homepage"
          className="inline-flex h-10 w-10 items-center justify-center text-sm font-bold tracking-[0.1em] text-[var(--color-text-primary)]"
        >
          AS
        </Link>
      </div>

      <div className="px-2 pb-4 lg:pt-2">
        <Navigation />
      </div>
    </aside>
  )
}

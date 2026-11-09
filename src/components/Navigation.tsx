import { Link } from 'react-router'

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center justify-center gap-1 sm:gap-3">
        <li>
          <Link
            to="/#home"
            className="inline-flex min-h-10 items-center px-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-3 sm:text-xs"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/#projects"
            className="inline-flex min-h-10 items-center px-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-3 sm:text-xs"
          >
            Projects
          </Link>
        </li>
        <li>
          <Link
            to="/#contact"
            className="inline-flex min-h-10 items-center px-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-3 sm:text-xs"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  )
}

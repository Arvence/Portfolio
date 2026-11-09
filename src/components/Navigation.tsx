export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center justify-center gap-1 sm:gap-3">
        <li>
          <a
            href="#home"
            className="inline-flex min-h-10 items-center px-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-3 sm:text-xs"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#projects"
            className="inline-flex min-h-10 items-center px-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-3 sm:text-xs"
          >
            Projects
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="inline-flex min-h-10 items-center px-2 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-3 sm:text-xs"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  )
}

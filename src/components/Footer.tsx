import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import Container from './Container'

const SITE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
]

const LINK_CLASS_NAME =
  'inline-flex min-h-11 items-center gap-2 rounded-sm text-sm leading-6 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:text-[var(--color-text-primary)]'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <Container className="@container/footer py-12 sm:py-16">
        <div className="grid gap-x-12 gap-y-10 @min-[24rem]/footer:grid-cols-2 @min-[48rem]/footer:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-4 @min-[24rem]/footer:col-span-2 @min-[48rem]/footer:col-span-1">
            <p className="text-lg leading-relaxed font-semibold tracking-tight text-[var(--color-text-primary)]">
              Alper Senpacaci
            </p>
            <p className="max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
              Building web applications, backend systems, and developer tools with a focus on clarity and
              maintainability.
            </p>
          </div>

          <nav aria-labelledby="footer-elsewhere-title" className="min-w-0">
            <h2
              id="footer-elsewhere-title"
              className="text-xs leading-6 font-medium tracking-[0.14em] text-[var(--color-text-secondary)] uppercase"
            >
              Elsewhere
            </h2>
            <ul className="mt-3">
              <li>
                <a
                  href="https://github.com/Arvence"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS_NAME}
                >
                  GitHub
                  <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-site-title" className="min-w-0">
            <h2
              id="footer-site-title"
              className="text-xs leading-6 font-medium tracking-[0.14em] text-[var(--color-text-secondary)] uppercase"
            >
              Site
            </h2>
            <ul className="mt-3">
              {SITE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={LINK_CLASS_NAME}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}

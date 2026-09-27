import { Link } from 'react-router'
import Container from './Container'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <Container className="flex flex-col justify-between gap-5 py-8 text-sm sm:flex-row sm:items-center">
        <div>
          <Link to="/" className="font-semibold text-neutral-200">
            Portfolio.
          </Link>
          <p className="mt-1 text-neutral-400">A software developer portfolio, in progress.</p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex gap-6">
            <li>
              <Link to="/projects" className="nav-link">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  )
}

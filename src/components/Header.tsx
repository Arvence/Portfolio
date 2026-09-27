import { Code2 } from 'lucide-react'
import { Link } from 'react-router'
import Container from './Container'
import Navigation from './Navigation'

export default function Header() {
  return (
    <header className="border-b border-neutral-800">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
        <Link to="/" aria-label="Portfolio home" className="inline-flex min-h-11 items-center gap-3 font-semibold">
          <Code2 size={22} className="text-amber-300" aria-hidden="true" />
          Portfolio<span className="text-amber-300">.</span>
        </Link>
        <Navigation />
      </Container>
    </header>
  )
}

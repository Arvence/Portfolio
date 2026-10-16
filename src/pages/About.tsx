import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import Section from '../components/Section'

export default function About() {
  useEffect(() => {
    document.title = 'About | Portfolio'
  }, [])

  return (
    <div className="mx-auto max-w-[900px] space-y-12">
      <header className="space-y-4">
        <p className="eyebrow">About</p>
        <h1>Building software that stays useful.</h1>
        <p className="text-lg leading-8 text-[var(--color-text-secondary)]">
          I work across product, platform, and developer experience, with an emphasis on dependable architectures and
          thoughtful implementation details.
        </p>
      </header>

      <Section title="Background">
        <p className="text-base leading-7 text-[var(--color-text-secondary)]">
          My engineering focus is on building software that balances user needs with long-term maintainability. That
          usually means clear interfaces, well-structured systems, and practical implementation choices that hold up
          over time.
        </p>
      </Section>

      <Section title="Interests">
        <p className="text-base leading-7 text-[var(--color-text-secondary)]">
          I am especially interested in web application architecture, background job systems, developer tooling, and
          feature-release strategies that reduce friction for teams without sacrificing control.
        </p>
      </Section>

      <Section title="Get in touch">
        <div className="space-y-5">
          <p className="text-base leading-7 text-[var(--color-text-secondary)]">
            If you are working on a product, platform, or tooling challenge and want to compare ideas, I would be glad
            to connect.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            Explore the projects <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </div>
  )
}

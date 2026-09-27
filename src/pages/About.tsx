import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import Section from '../components/Section'

export default function About() {
  return (
    <div className="max-w-3xl space-y-12">
      <title>About | Portfolio</title>
      <header className="space-y-4">
        <p className="eyebrow">Behind the work</p>
        <h1>About</h1>
        <p>
          This page will introduce the developer behind the portfolio. Personal details and experience will be added
          when they are ready to share.
        </p>
      </header>
      <Section title="Background">
        <p>A biography, development journey, and areas of interest will live here.</p>
      </Section>
      <Section title="Skills & approach">
        <p>
          This space will describe technical skills and the approach to building software, supported by real project
          examples.
        </p>
      </Section>
      <Section title="Get in touch">
        <p>Contact details and profile links will be added here.</p>
        <Link to="/projects" className="text-link">
          Explore the projects <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </Section>
    </div>
  )
}

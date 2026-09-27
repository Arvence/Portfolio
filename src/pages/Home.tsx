import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import ProjectGrid from '../components/ProjectGrid'
import Section from '../components/Section'
import { featuredProjects } from '../data/projects'

export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <title>Home | Portfolio</title>
      <section aria-labelledby="intro-title" className="max-w-3xl space-y-6 py-4 sm:py-8">
        <p className="eyebrow text-amber-300">Software developer portfolio</p>
        <h1 id="intro-title" className="text-4xl sm:text-6xl">
          A place for projects,
          <br className="hidden sm:block" /> ideas, and the work behind them.
        </h1>
        <p className="text-lg">
          Welcome to a portfolio in progress. A personal introduction will live here; for now, explore the structure and
          placeholder projects below.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link to="/projects" className="button-primary">
            Explore projects <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/about" className="button-secondary">
            About this portfolio
          </Link>
        </div>
      </section>
      <Section
        title="Featured projects"
        description="A first look at the work. These entries are placeholders."
        action={
          <Link to="/projects" className="text-link">
            All projects <ArrowRight size={17} aria-hidden="true" />
          </Link>
        }
      >
        <ProjectGrid projects={featuredProjects} />
      </Section>
      <Section title="Behind the work" description="The person, interests, and approach behind the projects.">
        <div className="rounded-xl border border-neutral-800 p-6 sm:p-8">
          <p>A short biography and development background will be added here as the portfolio takes shape.</p>
          <Link to="/about" className="text-link mt-5">
            Visit the about page <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </div>
  )
}

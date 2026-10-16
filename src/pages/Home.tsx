import { useEffect } from 'react'
import ProjectGrid from '../components/ProjectGrid'
import { featuredProjects } from '../data/projects'

export default function Home() {
  useEffect(() => {
    document.title = 'Home | Portfolio'
  }, [])

  return (
    <div className="space-y-12 sm:space-y-16">
      <section aria-labelledby="intro-title" className="max-w-4xl space-y-6">
        <p className="eyebrow">Software Developer</p>
        <h1 id="intro-title">Alper Senpacaci</h1>
        <p className="max-w-xl text-lg leading-8 text-[var(--color-text-secondary)]">
          Building web applications, backend systems, and developer tools with a focus on clarity, reliability, and
          long-term maintainability.
        </p>
      </section>

      <section aria-label="Projects">
        <ProjectGrid projects={featuredProjects} />
      </section>
    </div>
  )
}

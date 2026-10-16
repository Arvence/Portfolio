import { useEffect } from 'react'
import ProjectGrid from '../components/ProjectGrid'
import Section from '../components/Section'
import { projects } from '../data/projects'

export default function Projects() {
  useEffect(() => {
    document.title = 'Projects | Portfolio'
  }, [])

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <p className="eyebrow">Selected work</p>
        <h1>Projects</h1>
        <p className="text-lg leading-8 text-[var(--color-text-secondary)]">
          A concise collection of product and platform work centered on software systems, developer workflows, and
          thoughtful execution.
        </p>
      </header>
      <Section
        title="All projects"
        description={`${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
      >
        <ProjectGrid projects={projects} />
      </Section>
    </div>
  )
}

import ProjectGrid from '../components/ProjectGrid'
import Section from '../components/Section'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <div className="space-y-12">
      <title>Projects | Portfolio</title>
      <header className="space-y-4">
        <p className="eyebrow">The work</p>
        <h1>Projects</h1>
        <p>
          A collection of development work, experiments, and ideas. The entries below are placeholders for future case
          studies.
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

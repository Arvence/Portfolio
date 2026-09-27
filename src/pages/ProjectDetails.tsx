import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router'
import Section from '../components/Section'
import { projects } from '../data/projects'

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((entry) => entry.slug === slug)

  if (!project) {
    return (
      <div className="space-y-5 py-8">
        <title>Project not found | Portfolio</title>
        <p className="eyebrow">Missing project</p>
        <h1>Project not found</h1>
        <p>No project matches this URL. Browse the collection to find an available project.</p>
        <Link to="/projects" className="text-link">
          <ArrowLeft size={17} aria-hidden="true" /> Back to projects
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl space-y-12">
      <title>{`${project.name} | Portfolio`}</title>
      <Link to="/projects" className="text-link">
        <ArrowLeft size={17} aria-hidden="true" /> All projects
      </Link>
      <header className="space-y-4">
        {project.placeholder && <p className="eyebrow text-amber-300">Placeholder project</p>}
        <h1>{project.name}</h1>
        <p className="text-lg">{project.summary}</p>
        {(project.repositoryUrl || project.demoUrl) && (
          <div className="flex flex-wrap gap-4 pt-2">
            {project.repositoryUrl && (
              <a href={project.repositoryUrl} className="button-secondary">
                Source code <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} className="button-primary">
                Live demo <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </header>
      <Section title="Overview">
        <p className="whitespace-pre-line">{project.description}</p>
      </Section>
      <Section title="Technologies">
        {project.technologies.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li key={technology} className="tag">
                {technology}
              </li>
            ))}
          </ul>
        ) : (
          <p>Technology details have not been added yet.</p>
        )}
      </Section>
    </article>
  )
}

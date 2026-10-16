import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { projects } from '../data/projects'
import ProjectLayout from '../layouts/ProjectLayout'

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((entry) => entry.slug === slug)

  useEffect(() => {
    document.title = project ? `${project.name} | Portfolio` : 'Project not found | Portfolio'
  }, [project])

  if (!project) {
    return (
      <div className="space-y-5 py-8">
        <p className="eyebrow">Missing project</p>
        <h1>Project not found</h1>
        <p>No project matches this URL. Browse the collection to find an available project.</p>
        <Link
          to="/projects"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-text-secondary)]"
        >
          <ArrowLeft size={17} aria-hidden="true" /> Back to projects
        </Link>
      </div>
    )
  }

  return (
    <ProjectLayout
      title={project.name}
      category={project.category}
      summary={project.summary}
      technologies={project.technologies}
      repositoryUrl={project.repositoryUrl}
      liveUrl={project.liveUrl}
    >
      <div className="flex h-full min-h-[18rem] items-start justify-start rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] p-4 text-sm text-[var(--color-text-secondary)] sm:p-6">
        {project.description}
      </div>
    </ProjectLayout>
  )
}

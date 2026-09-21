import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { projects } from '../data/projects'

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((entry) => entry.slug === slug)

  return (
    <div className="space-y-4">
      <title>{`${project?.name ?? 'Project not found'} | Portfolio`}</title>
      <h1>{project?.name ?? 'Project not found'}</h1>
      <p>{project?.description ?? 'No project matches this URL.'}</p>
      <Link to="/projects" className="inline-flex items-center gap-2 underline">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>
    </div>
  )
}

import { ArrowUpRight, FolderCode } from 'lucide-react'
import { Link } from 'react-router'
import type { Project } from '../types/project'

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-700 p-8">
        No projects have been added yet. Check back soon.
      </p>
    )
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="min-w-0">
          <article className="flex h-full flex-col rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="mb-8 flex items-center justify-between gap-3">
              <FolderCode size={28} className="text-neutral-400" aria-hidden="true" />
              {project.placeholder && <span className="eyebrow">Placeholder</span>}
            </div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="mt-3 text-sm">{project.summary}</p>
            {project.technologies.length > 0 && (
              <ul aria-label={`${project.name} technologies`} className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <li key={technology} className="tag">
                    {technology}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto pt-8">
              <Link
                to={`/projects/${encodeURIComponent(project.slug)}`}
                className="text-link"
                aria-label={`View ${project.name}`}
              >
                View project <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}

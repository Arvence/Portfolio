import { FolderCode } from 'lucide-react'
import { Link } from 'react-router'
import type { Project } from '../types/project'

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-text-secondary)]">
        No projects have been added yet. Check back soon.
      </p>
    )
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="min-w-0">
          <Link
            to={`/projects/${encodeURIComponent(project.slug)}`}
            className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            aria-label={`${project.name} project`}
          >
            <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 group-hover:border-[var(--color-border-strong)] group-hover:bg-[var(--color-elevated)]">
              <div className="mb-8 flex items-center justify-between gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)]">
                  <FolderCode size={18} className="text-[var(--color-text-secondary)]" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  {project.category}
                </span>
              </div>
              <h3 className="text-[19px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
                {project.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{project.summary}</p>
              {project.technologies.length > 0 && (
                <ul aria-label={`${project.name} technologies`} className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li key={technology} className="tag">
                      {technology}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Link>
        </li>
      ))}
    </ul>
  )
}

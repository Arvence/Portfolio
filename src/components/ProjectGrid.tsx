import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { Project } from '../types/project'
import ProjectCover from './ProjectCover'

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-text-secondary)]">
        No projects have been added yet. Check back soon.
      </p>
    )
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:gap-8">
      {projects.map((project) => (
        <li key={project.slug} className="@container/project-card min-w-0">
          <Link
            to={`/projects/${encodeURIComponent(project.slug)}`}
            className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            aria-label={`${project.name} project`}
          >
            <article className="flex h-full min-h-[100cqw] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-200 group-hover:border-[var(--color-text-muted)] group-hover:bg-[var(--color-elevated)] group-focus-visible:border-[var(--color-text-muted)]">
              <ProjectCover project={project} />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-xs leading-relaxed font-medium tracking-[0.1em] text-[var(--color-text-secondary)] uppercase">
                  {project.category}
                </p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <h3 className="text-[clamp(1.25rem,5cqw,1.75rem)] leading-tight font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
                    {project.name}
                  </h3>
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-text-primary)] group-focus-visible:text-[var(--color-text-primary)]">
                    <ArrowRight size={18} aria-hidden="true" />
                  </span>
                </div>
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
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  )
}

import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { Project } from '../types/project'
import ProjectCover from './ProjectCover'

function ProjectTechnologies({ project }: { project: Project }) {
  const listRef = useRef<HTMLUListElement>(null)
  const [visibleCount, setVisibleCount] = useState(project.technologies.length)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const updateVisibleCount = () => {
      const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0
      let usedWidth = 0
      let count = 0

      for (const tag of list.children) {
        const tagWidth = tag.getBoundingClientRect().width
        const nextWidth = usedWidth + (count > 0 ? gap : 0) + tagWidth
        if (nextWidth > list.clientWidth) break
        usedWidth = nextWidth
        count += 1
      }

      setVisibleCount(count)
    }

    const observer = new ResizeObserver(updateVisibleCount)
    observer.observe(list)
    updateVisibleCount()
    return () => observer.disconnect()
  }, [project.technologies])

  return (
    <ul
      ref={listRef}
      aria-label={`${project.name} technologies`}
      className="project-card-technologies relative flex flex-nowrap content-start gap-1.5"
    >
      {project.technologies.map((technology, index) => (
        <li
          key={technology}
          aria-hidden={index >= visibleCount || undefined}
          className="project-tech-tag flex-none"
          style={index >= visibleCount ? { position: 'absolute', visibility: 'hidden' } : undefined}
        >
          {technology}
        </li>
      ))}
    </ul>
  )
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-text-secondary)]">
        No projects have been added yet. Check back soon.
      </p>
    )
  }

  return (
    <ul className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
      {projects.map((project) => {
        const repositoryUrl = project.repositoryUrl ?? '#'
        const walkthroughUrl = `/projects/${encodeURIComponent(project.slug)}`

        return (
          <li key={project.slug} className="project-card-enter min-w-0">
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[#a5d2f0]/35 hover:bg-[var(--color-elevated)]">
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} GitHub repository (opens in a new tab)`}
                className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a5d2f0]"
              />
              <ProjectCover project={project} />
              <div className="project-card-content pointer-events-none relative">
                <div className="project-card-heading flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-medium tracking-[0.12em] text-[#a5d2f0]/75 uppercase">
                      {project.category}
                    </p>
                    <h3 className="mt-1 text-xl leading-tight font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
                      {project.name}
                    </h3>
                  </div>
                  <span className="inline-flex size-7 shrink-0 items-center justify-center text-[var(--color-text-muted)] transition-colors group-hover:text-[#d9e8f4]">
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </div>

                <p className="project-card-summary text-[0.85rem] leading-[1.4rem] text-[var(--color-text-secondary)]">
                  {project.summary}
                </p>

                {project.technologies.length > 0 && <ProjectTechnologies project={project} />}

                <div className="project-card-actions pointer-events-auto relative z-20 flex items-center justify-between gap-3 border-t border-[var(--color-border)]">
                  {project.walkthrough && (
                    <a
                      href={walkthroughUrl}
                      aria-label={`Walkthrough for ${project.name}`}
                      className="inline-flex min-h-8 items-center gap-1.5 text-sm font-medium text-[#d9e8f4] transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5d2f0]"
                    >
                      Walkthrough
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}
                  <span className="ml-auto inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.11.82-.258.82-.577 0-.285-.01-1.232-.015-2.236-3.338.726-4.042-1.606-4.042-1.606-1.088-.744.083-.729.083-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.334-5.467-5.93 0-1.31.468-2.381 1.236-3.221-.124-.302-.535-1.52.117-3.176 0 0 1.008-.322 3.3 1.23A11.46 11.46 0 0 1 12 5.803c1.02 0 2.047.137 3.006.402 2.29-1.552 3.296-1.23 3.296-1.23.654 1.656.243 2.874.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.606-2.807 5.624-5.48 5.921.43.37.814 1.102.814 2.222 0 1.604-.015 2.896-.015 3.291 0 .32.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12Z" />
                    </svg>
                    GitHub
                  </span>
                </div>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

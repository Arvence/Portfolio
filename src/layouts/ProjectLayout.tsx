import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface ProjectLayoutProps {
  title: string
  category?: string | undefined
  summary?: string | undefined
  technologies?: string[] | undefined
  repositoryUrl?: string | undefined
  liveUrl?: string | undefined
  children?: ReactNode
}

export default function ProjectLayout(props: ProjectLayoutProps) {
  const { title, category, summary, technologies = [], repositoryUrl, liveUrl, children } = props

  return (
    <article className="mx-auto w-full max-w-[900px] space-y-10 py-2">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>

      <header className="space-y-6">
        {category && <p className="eyebrow">{category}</p>}
        <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)] sm:text-[48px]">
          {title}
        </h1>
        {summary && <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)]">{summary}</p>}

        {(repositoryUrl || liveUrl || technologies.length > 0) && (
          <div className="flex flex-col gap-5">
            {technologies.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <li key={technology} className="tag">
                    {technology}
                  </li>
                ))}
              </ul>
            )}

            {(repositoryUrl || liveUrl) && (
              <div className="flex flex-wrap gap-3">
                {repositoryUrl && (
                  <a href={repositoryUrl} target="_blank" rel="noreferrer" className="button-secondary">
                    Source code <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
                {liveUrl && (
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="button-primary">
                    Visit site <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      <div
        className="min-h-[22rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6"
        aria-label={`${title} content`}
      >
        {children ?? (
          <div className="h-full min-h-[18rem] rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)]" />
        )}
      </div>
    </article>
  )
}

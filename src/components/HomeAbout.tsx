import { Fragment } from 'react'
import { Link } from 'react-router'
import { projects } from '../data/projects'

const ABOUT_DETAILS = [
  { label: 'Based in', value: 'Bursa, Türkiye' },
  { label: 'Background', value: 'Computer Engineering graduate' },
  { label: 'Focus', value: 'Software systems, backend platforms, and full-stack applications' },
  { label: 'Core stack', value: 'C#, .NET / ASP.NET Core, TypeScript, React, Node.js / NestJS, SQL' },
]

export default function HomeAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="@container/about flex min-h-svh items-center py-20 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 @min-[50rem]/about:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] @min-[50rem]/about:items-center @min-[50rem]/about:gap-16 @min-[64rem]/about:gap-20">
        <div className="min-w-0 space-y-8">
          <h2 id="about-title" className="text-[clamp(2.25rem,4.5vw,3.5rem)] tracking-[-0.04em]">
            About
          </h2>
          <div className="space-y-6 text-base leading-7 sm:text-lg sm:leading-8">
            <p>
              I’m Alper Senpacaci, a Computer Engineering graduate based in Bursa, Türkiye. I focus on developing
              software systems, backend platforms, and full-stack applications.
            </p>
            <p>
              I build with C# and .NET, TypeScript, React, Node.js, and SQL, including frameworks such as ASP.NET Core
              and NestJS. I value clear interfaces, reliable behavior, and software that is straightforward to maintain.
            </p>
            <p>
              My portfolio includes{' '}
              {projects.map((project, index) => (
                <Fragment key={project.slug}>
                  {index > 0 && (index === projects.length - 1 ? ', and ' : ', ')}
                  <Link
                    to={`/projects/${encodeURIComponent(project.slug)}`}
                    className="rounded-sm text-[var(--color-text-primary)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--color-text-secondary)]"
                  >
                    {project.name}
                  </Link>
                </Fragment>
              ))}
              . These projects explore full-stack applications, background job orchestration, and feature flag
              management.
            </p>
          </div>
        </div>

        <aside
          aria-labelledby="about-glance-title"
          className="@container/glance min-w-0 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 sm:p-8"
        >
          <h3
            id="about-glance-title"
            className="text-xs font-semibold tracking-[0.16em] text-[var(--color-text-secondary)]"
          >
            AT A GLANCE
          </h3>
          <dl className="mt-6 divide-y divide-[var(--color-border)]">
            {ABOUT_DETAILS.map(({ label, value }) => (
              <div
                key={label}
                className="grid gap-x-5 gap-y-2 py-5 first:pt-0 last:pb-0 @min-[20rem]/glance:grid-cols-[5.5rem_minmax(0,1fr)]"
              >
                <dt className="min-w-0 text-sm leading-6 text-[var(--color-text-secondary)] [overflow-wrap:anywhere]">
                  {label}
                </dt>
                <dd className="min-w-0 text-sm leading-6 font-medium text-[var(--color-text-primary)] [overflow-wrap:anywhere]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}

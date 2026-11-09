import { useEffect } from 'react'
import { Mail } from 'lucide-react'
import ProjectGrid from '../components/ProjectGrid'
import { featuredProjects } from '../data/projects'
import RotatingRole from '../components/RotatingRole'

export default function Home() {
  useEffect(() => {
    document.title = 'Home | Portfolio'
  }, [])

  return (
    <div>
      <section
        id="home"
        aria-labelledby="intro-title"
        className="flex min-h-[calc(100svh-var(--header-height,3.5rem))] items-center pt-4 pb-12 sm:pt-6 sm:pb-16"
      >
        <div className="mx-auto w-full max-w-6xl translate-y-5 space-y-8 text-center sm:translate-y-6">
          <div className="space-y-5 sm:space-y-6">
            <h1
              id="intro-title"
              className="home-heading-enter text-[clamp(2.75rem,8vw,7.5rem)] leading-[1.05] tracking-[-0.05em]"
            >
              Alper Senpacaci
            </h1>
            <div className="home-role-enter">
              <RotatingRole />
            </div>
          </div>
          <p className="home-description-enter mx-auto max-w-xl text-center text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
            Software engineering across applications, backend systems, APIs, background processing, and developer tools,
            with a focus on system design, reliability, testability, and maintainability.
          </p>
          <div className="home-actions-enter flex flex-col items-center gap-4">
            <a
              href="#projects"
              className="inline-flex min-h-10 min-w-32 items-center justify-center rounded-xl bg-white px-6 text-sm font-medium text-[#0c0d0f] transition-colors hover:bg-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            >
              View Projects
            </a>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Arvence"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex size-11 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-[22px]" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.35-1.3-1.71-1.3-1.71-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.79 2.75 1.27 3.42.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.11-3.08 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.6.23 2.78.11 3.08.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.25 5.69.42.36.79 1.06.79 2.13v3.16c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/alpersenpacaci/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex size-11 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-[22px]" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.369 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM3.56 9h3.55v11.452H3.56V9Z" />
                </svg>
              </a>
              <a
                href="#contact"
                aria-label="Contact"
                className="flex size-11 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
              >
                <Mail size={22} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        aria-labelledby="projects-title"
        className="scroll-mt-[calc(var(--header-height,3.5rem)+1rem)] space-y-8 pb-12 pt-6 sm:space-y-10 sm:pb-16 sm:pt-8"
      >
        <header className="mx-auto w-full max-w-6xl space-y-3 text-center">
          <h2
            id="projects-title"
            className="projects-heading-enter text-[clamp(2.25rem,4.5vw,3.5rem)] tracking-[-0.04em]"
          >
            Projects
          </h2>
          <p className="projects-copy-enter mx-auto max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base">
            A selection of applications and systems built around useful tools, reliable workflows, and thoughtful design.
          </p>
        </header>
        <ProjectGrid projects={featuredProjects} />
      </section>

      <section
        id="contact"
        aria-labelledby="contact-title"
        className="scroll-mt-[calc(var(--header-height,3.5rem)+1rem)] flex min-h-[50svh] flex-col items-center justify-center gap-5 py-16 text-center"
      >
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title" className="text-[clamp(2.25rem,5vw,3.5rem)]">
          Let’s connect.
        </h2>
        <p className="max-w-none text-base leading-7 text-[var(--color-text-secondary)] md:whitespace-nowrap">
          For questions, opportunities, or a conversation about software, send me an email.
        </p>
        <a
          href="mailto:alpersenpacaci@gmail.com"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-[#0c0d0f] transition-colors hover:bg-[#d9e8f4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
        >
          <Mail size={16} aria-hidden="true" />
          Send Email
        </a>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://github.com/Arvence"
            target="_blank"
            rel="noreferrer"
            className="button-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.35-1.3-1.71-1.3-1.71-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.79 2.75 1.27 3.42.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.11-3.08 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.6.23 2.78.11 3.08.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.25 5.69.42.36.79 1.06.79 2.13v3.16c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/alpersenpacaci/"
            target="_blank"
            rel="noreferrer"
            className="button-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.369 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM3.56 9h3.55v11.452H3.56V9Z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  )
}

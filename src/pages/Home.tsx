import { useEffect } from 'react'
import HomeAbout from '../components/HomeAbout'
import ProjectGrid from '../components/ProjectGrid'
import RotatingRole from '../components/RotatingRole'
import { featuredProjects } from '../data/projects'

export default function Home() {
  useEffect(() => {
    document.title = 'Home | Portfolio'
  }, [])

  return (
    <div>
      <section aria-labelledby="intro-title" className="flex min-h-svh items-center py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="space-y-5 sm:space-y-6">
            <h1 id="intro-title" className="text-[clamp(2.75rem,8vw,7.5rem)] leading-[1.05] tracking-[-0.05em]">
              Alper Senpacaci
            </h1>
            <RotatingRole />
          </div>
          <p className="max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
            Building web applications, backend systems, and developer tools with a focus on clarity, reliability, and
            long-term maintainability.
          </p>
        </div>
      </section>

      <HomeAbout />

      <section aria-label="Projects" className="pb-10 sm:pb-12 lg:pb-16">
        <ProjectGrid projects={featuredProjects} />
      </section>
    </div>
  )
}

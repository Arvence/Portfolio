import { techStackRows } from '../data/techStack'
import MarqueeRow from './MarqueeRow'

export default function TechStack() {
  return (
    <section id="tech-stack" aria-labelledby="tech-stack-title" className="space-y-10 py-20 sm:space-y-12 sm:py-24">
      <header className="mx-auto w-full max-w-6xl space-y-4">
        <h2 id="tech-stack-title" className="text-[clamp(2.25rem,4.5vw,3.5rem)] tracking-[-0.04em]">
          Tech Stack
        </h2>
        <p className="text-base leading-7 sm:text-lg sm:leading-8">
          Technologies and tools I work with across backend systems, web applications, and development workflows.
        </p>
      </header>
      <div className="space-y-4 sm:space-y-5">
        {techStackRows.map((row) => (
          <MarqueeRow key={row.id} row={row} />
        ))}
      </div>
    </section>
  )
}

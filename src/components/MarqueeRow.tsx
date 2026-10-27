import type { CSSProperties } from 'react'
import type { TechStackRow } from '../data/techStack'

const REPETITIONS_PER_GROUP = 3

export default function MarqueeRow({ row }: { row: TechStackRow }) {
  const style = {
    '--marquee-duration': `${row.durationSeconds}s`,
    '--marquee-direction': row.direction === 'right' ? 'reverse' : 'normal',
  } as CSSProperties

  return (
    <div className="tech-marquee" role="group" aria-label={row.label} style={style}>
      {[0, 1].map((group) => (
        <ul key={group} className="tech-marquee-group" role="list" aria-hidden={group > 0 || undefined}>
          {Array.from({ length: REPETITIONS_PER_GROUP }, (_, repetition) =>
            row.technologies.map((technology) => (
              <li
                key={`${repetition}-${technology}`}
                className="tech-marquee-badge"
                aria-hidden={repetition > 0 || undefined}
              >
                {technology}
              </li>
            )),
          )}
        </ul>
      ))}
    </div>
  )
}

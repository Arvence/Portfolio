import { Image } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '../types/project'

export default function ProjectCover({ project }: { project: Project }) {
  const [failedSource, setFailedSource] = useState<string>()
  const cover = project.coverImage

  return (
    <div className="project-cover">
      {cover && cover.src !== failedSource ? (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={cover.src}
          alt={cover.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSource(cover.src)}
        />
      ) : (
        <div className="project-image-placeholder" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 text-[var(--color-text-muted)]">
            <Image size={24} strokeWidth={1.4} aria-hidden="true" />
            <span className="text-xs">{project.name}</span>
          </div>
        </div>
      )}
    </div>
  )
}

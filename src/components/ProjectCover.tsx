import { BookOpen, Flag, FolderCode, Workflow, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '../types/project'

const PROJECT_ICONS: Record<string, LucideIcon> = {
  wowiki: BookOpen,
  taskforge: Workflow,
  flagbit: Flag,
}

export default function ProjectCover({ project }: { project: Project }) {
  const [failedSource, setFailedSource] = useState<string>()
  const cover = project.coverImage
  const Icon = PROJECT_ICONS[project.slug] ?? FolderCode

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
        <div className="project-cover-art" aria-hidden="true">
          <span className="project-cover-symbol">
            <Icon strokeWidth={1.25} />
          </span>
          <span className="project-cover-name">{project.name}</span>
        </div>
      )}
    </div>
  )
}

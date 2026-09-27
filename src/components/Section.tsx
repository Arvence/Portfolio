import { useId, type ReactNode } from 'react'

interface SectionProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function Section({ title, description, action, children }: SectionProps) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 id={titleId}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

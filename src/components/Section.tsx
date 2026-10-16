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
          <h2
            id={titleId}
            className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-[28px]"
          >
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-sm text-[var(--color-text-secondary)] sm:text-[15px]">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

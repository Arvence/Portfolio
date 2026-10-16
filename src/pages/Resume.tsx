import { useEffect } from 'react'

export default function Resume() {
  useEffect(() => {
    document.title = 'Resume | Portfolio'
  }, [])

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <header className="space-y-3">
        <p className="eyebrow">Resume</p>
        <h1>Resume</h1>
      </header>
      <div className="min-h-[18rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
    </div>
  )
}

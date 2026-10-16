import { useEffect } from 'react'
import ProjectLayout from '../../layouts/ProjectLayout'

export default function TaskForge() {
  useEffect(() => {
    document.title = 'TaskForge | Portfolio'
  }, [])

  return (
    <ProjectLayout
      title="TaskForge"
      category="Background Job System"
      summary="An HTTP job orchestration server that manages job lifecycles, retries, cancellation, and recovery for external workers."
    />
  )
}

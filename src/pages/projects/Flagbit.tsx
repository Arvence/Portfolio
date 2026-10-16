import { useEffect } from 'react'
import ProjectLayout from '../../layouts/ProjectLayout'

export default function Flagbit() {
  useEffect(() => {
    document.title = 'Flagbit | Portfolio'
  }, [])

  return (
    <ProjectLayout
      title="Flagbit"
      category="Feature Flag Service"
      summary="A feature flag service with centralized management, contextual evaluation, percentage rollouts, and an optional .NET SDK."
    />
  )
}

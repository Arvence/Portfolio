import { useEffect } from 'react'
import ProjectLayout from '../../layouts/ProjectLayout'

export default function WoWiki() {
  useEffect(() => {
    document.title = 'WoWiki | Portfolio'
  }, [])

  return (
    <ProjectLayout
      title="WoWiki"
      category="Full Stack Application"
      summary="A World of Warcraft Classic platform for game information, community content, and raid planning."
    />
  )
}

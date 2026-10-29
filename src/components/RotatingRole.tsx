import { useEffect, useState } from 'react'

const ROLES = [
  'Software Engineer',
  'Software Developer',
  'Backend Developer',
  'Full Stack Developer',
  '.NET Developer',
  'Systems Developer',
] as const
const TYPE_DELAY_MS = 90
const DELETE_DELAY_MS = 45
const HOLD_DURATION_MS = 1600
const NEXT_ROLE_DELAY_MS = 350
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export default function RotatingRole() {
  const [text, setText] = useState('')
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia(REDUCED_MOTION_QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY)
    let timer: number | undefined
    let roleIndex = 0
    let characterCount = 0
    let deleting = false

    function tick() {
      const role = ROLES[roleIndex] ?? ROLES[0]
      characterCount += deleting ? -1 : 1
      setText(role.slice(0, characterCount))

      let delay = deleting ? DELETE_DELAY_MS : TYPE_DELAY_MS
      if (!deleting && characterCount === role.length) {
        deleting = true
        delay = HOLD_DURATION_MS
      } else if (deleting && characterCount === 0) {
        deleting = false
        roleIndex = (roleIndex + 1) % ROLES.length
        delay = NEXT_ROLE_DELAY_MS
      }

      timer = window.setTimeout(tick, delay)
    }

    function resume() {
      window.clearTimeout(timer)
      if (media.matches || document.hidden || document.getElementById('startup-loader')) return
      timer = window.setTimeout(tick, TYPE_DELAY_MS)
    }

    function handleMotionChange() {
      setReducedMotion(media.matches)
      resume()
    }

    media.addEventListener('change', handleMotionChange)
    document.addEventListener('visibilitychange', resume)
    document.addEventListener('portfolio:startup-complete', resume)
    resume()

    return () => {
      window.clearTimeout(timer)
      media.removeEventListener('change', handleMotionChange)
      document.removeEventListener('visibilitychange', resume)
      document.removeEventListener('portfolio:startup-complete', resume)
    }
  }, [])

  return (
    <p className="text-[clamp(1.25rem,2.5vw,2.25rem)] leading-relaxed font-medium tracking-[-0.025em] text-[var(--color-text-primary)]">
      <span className="sr-only">{ROLES[0]}</span>
      <span aria-hidden="true" className="grid">
        {ROLES.map((role) => (
          <span key={role} className="hero-role-line invisible">
            {role}
          </span>
        ))}
        <span className="hero-role-line">{reducedMotion ? ROLES[0] : text}</span>
      </span>
    </p>
  )
}

import { useEffect, useState } from 'react'
import { Globe, Orbit, Satellite, Waves } from 'lucide-react'
import type { SpaceEffect } from './SpaceBackground'

type SpaceEffectControlsProps = {
  onTrigger: (effect: SpaceEffect) => void
  planetVisible: boolean
  onTogglePlanet: () => void
}

const effects = [
  { id: 'satellite', label: 'Satellite', description: 'Trigger satellite pass', icon: Satellite },
  { id: 'comet', label: 'Comet', description: 'Trigger slow comet', icon: Orbit },
  { id: 'pulse', label: 'Pulse', description: 'Trigger nebula light pulse', icon: Waves },
] as const

export default function SpaceEffectControls({ onTrigger, planetVisible, onTogglePlanet }: SpaceEffectControlsProps) {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(motion.matches)
    motion.addEventListener('change', updateMotion)
    return () => motion.removeEventListener('change', updateMotion)
  }, [])

  return (
    <div
      role="group"
      aria-label="Background effects"
      className="order-last flex w-full flex-wrap items-center justify-center gap-1 md:order-none md:w-auto md:gap-2"
    >
      {effects.map(({ id, label, description, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTrigger(id)}
          disabled={reducedMotion}
          aria-label={description}
          title={reducedMotion ? 'Effects are paused by your reduced motion preference' : description}
          className="space-effect-button"
        >
          <Icon size={15} aria-hidden="true" className="hidden sm:block" />
          <span>{label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onTogglePlanet}
        aria-label="Solar system visibility"
        aria-pressed={planetVisible}
        title={planetVisible ? 'Hide solar system' : 'Show solar system'}
        className="space-effect-button"
      >
        <Globe size={15} aria-hidden="true" className="hidden sm:block" />
        <span>System</span>
      </button>
    </div>
  )
}

import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'
import { createNebulaRenderer, createRandom, type NebulaPulse } from './spaceNebula'
import { createPlanetScene } from './spacePlanet'

export type SpaceEffect = 'satellite' | 'comet' | 'pulse'

export type SpaceBackgroundControls = {
  trigger: (effect: SpaceEffect) => void
}

type SpaceBackgroundProps = {
  ref?: Ref<SpaceBackgroundControls>
  planetVisible: boolean
}

type SpaceView = {
  width: number
  height: number
  travel: number
}

type Star = {
  x: number
  y: number
  radius: number
  opacity: number
  phase: number
  speed: number
  tint: string
  glint: boolean
  cycle: number
  spaceX: number
  spaceY: number
}

type Satellite = {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  opacity: number
  start: number
  duration: number
  glintStart: number | undefined
  glintDuration: number
}

function createSatellite(random: () => number, time: number): Satellite {
  const direction = random() < 0.5 ? 1 : -1
  const duration = 28 + random() * 16

  return {
    x: direction > 0 ? -0.04 : 1.04,
    y: 0.2 + random() * 0.45,
    dx: direction * 1.08,
    dy: (random() - 0.5) * 0.24,
    radius: 0.6 + random() * 0.3,
    opacity: 0.3 + random() * 0.15,
    start: time,
    duration,
    glintStart: random() < 0.45 ? time + duration * (0.3 + random() * 0.3) : undefined,
    glintDuration: 1.8 + random() * 1.2,
  }
}

function drawSatellite(ctx: CanvasRenderingContext2D, pass: Satellite, width: number, height: number, time: number) {
  const progress = (time - pass.start) / pass.duration
  const x = (pass.x + pass.dx * progress) * width
  const y = (pass.y + pass.dy * progress) * height
  const edge = Math.min(1, progress * 10, (1 - progress) * 10)
  const fade = edge * edge * (3 - 2 * edge)
  const glintProgress = pass.glintStart === undefined ? -1 : (time - pass.glintStart) / pass.glintDuration
  const reflection = glintProgress >= 0 && glintProgress <= 1 ? Math.sin(Math.PI * glintProgress) ** 2 : 0
  const opacity = (pass.opacity + reflection * 0.25) * fade
  const reach = 2.5 + reflection * 1.5
  const glow = ctx.createRadialGradient(x, y, 0, x, y, reach)
  glow.addColorStop(0, `rgba(165, 210, 240, ${opacity * 0.2})`)
  glow.addColorStop(1, 'rgba(165, 210, 240, 0)')

  ctx.save()
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(x, y, reach, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = `rgba(207, 231, 249, ${opacity})`
  ctx.beginPath()
  ctx.arc(x, y, pass.radius + reflection * 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

type Comet = {
  x: number
  y: number
  dx: number
  dy: number
  travel: number
  tail: number
  spread: number
  radius: number
  opacity: number
  start: number
  duration: number
}

function createComet(random: () => number, time: number): Comet {
  const direction = random() < 0.5 ? 1 : -1
  const angle = -0.2 + random() * 0.5

  return {
    x: (direction > 0 ? 0.15 : 0.65) + random() * 0.2,
    y: 0.2 + random() * 0.25,
    dx: direction * Math.cos(angle),
    dy: Math.sin(angle),
    travel: 0.22 + random() * 0.14,
    tail: 0.2 + random() * 0.12,
    spread: 0.012 + random() * 0.008,
    radius: 0.8 + random() * 0.3,
    opacity: 0.2 + random() * 0.1,
    start: time,
    duration: 15 + random() * 10,
  }
}

function drawComet(ctx: CanvasRenderingContext2D, comet: Comet, width: number, height: number, time: number) {
  const progress = (time - comet.start) / comet.duration
  const scale = Math.min(width, height)
  const distance = scale * comet.travel * progress
  const x = comet.x * width + comet.dx * distance
  const y = comet.y * height + comet.dy * distance
  const edge = Math.min(1, progress * 6, (1 - progress) * 6)
  const opacity = edge * edge * (3 - 2 * edge) * comet.opacity

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(Math.atan2(comet.dy, comet.dx))
  ctx.save()
  ctx.scale(scale * comet.tail, Math.max(4, scale * comet.spread))
  const tail = ctx.createRadialGradient(0, 0, 0, -0.5, 0, 0.5)
  tail.addColorStop(0, `rgba(207, 231, 249, ${opacity * 0.8})`)
  tail.addColorStop(0.25, `rgba(165, 210, 240, ${opacity * 0.55})`)
  tail.addColorStop(0.7, `rgba(165, 210, 240, ${opacity * 0.15})`)
  tail.addColorStop(1, 'rgba(165, 210, 240, 0)')
  ctx.fillStyle = tail
  ctx.fillRect(-1, -0.5, 1, 1)
  ctx.restore()

  const reach = comet.radius * 6
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, reach)
  glow.addColorStop(0, `rgba(207, 231, 249, ${opacity * 2})`)
  glow.addColorStop(0.25, `rgba(165, 210, 240, ${opacity * 0.5})`)
  glow.addColorStop(1, 'rgba(165, 210, 240, 0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(0, 0, reach, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = `rgba(207, 231, 249, ${opacity * 2.1})`
  ctx.beginPath()
  ctx.arc(0, 0, comet.radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function createStars(seed: number): Star[] {
  const random = createRandom(seed ^ 0x51f2a9)
  return Array.from({ length: 350 }, () => {
    const brightness = random()
    return {
      x: random(),
      y: random(),
      radius: brightness > 0.91 ? 0.9 + random() * 0.3 : 0.35 + random() * 0.5,
      opacity: 0.2 + brightness ** 2 * 0.62,
      phase: random() * Math.PI * 2,
      speed: 0.15 + random() * 0.35,
      tint: random() > 0.7 ? '165, 210, 240' : '207, 231, 249',
      glint: brightness > 0.91,
      cycle: 0,
      spaceX: 0,
      spaceY: 0,
    }
  })
}

function createLightPulse(random: () => number, time: number): NebulaPulse {
  return {
    x: 0.15 + random() * 0.6,
    y: 0.15 + random() * 0.3,
    radius: 0.24 + random() * 0.16,
    strength: 0.45 + random() * 0.25,
    start: time,
    duration: 12 + random() * 6,
  }
}

function drawStars(context: CanvasRenderingContext2D, stars: Star[], view: SpaceView, time: number) {
  const { width, height, travel } = view
  context.clearRect(0, 0, width, height)
  const ambientCount = Math.min(stars.length, Math.max(60, Math.round((width * height) / 7000)))
  const count = Math.min(stars.length, ambientCount * 2)
  const parallax = 2.4 * Math.tanh(travel / 2.4)

  for (let index = 0; index < count; index++) {
    const star = stars[index]!
    const population = index < ambientCount ? 1 : Math.min(1, travel)
    if (!population) continue
    const depth = 0.3 + star.radius * 0.7
    const initialZ = 3.8 - star.radius * 2
    const distance = initialZ - travel * (0.6 + star.speed * 0.6)
    const cycle = Math.floor((3.6 - distance) / 3.05)
    const z = distance + cycle * 3.05
    if (cycle !== star.cycle) {
      const random = createRandom(Math.floor(star.phase * 1e9) ^ Math.imul(cycle, 0x27d4eb2d))
      star.cycle = cycle
      star.spaceX = random()
      star.spaceY = random()
    }
    const originX = cycle === 0 ? star.x : star.spaceX
    const originY = cycle === 0 ? star.y : star.spaceY
    const driftX = time * 0.22 * depth + (Math.sin(time * 0.02 + star.phase) - Math.sin(star.phase)) * depth * 1.5
    const driftY = -time * 0.1 * depth
    const baseX = ((((originX * width + driftX + 12) % (width + 24)) + width + 24) % (width + 24)) - 12
    const baseY = ((((originY * height + driftY + 12) % (height + 24)) + height + 24) % (height + 24)) - 12
    const zoom = (cycle === 0 ? initialZ : 3.6) / z
    const x = width * 0.5 + (baseX - width * 0.5) * zoom
    const y = height * 0.45 + (baseY - height * 0.45) * zoom - height * parallax * depth * 0.035
    const radius = star.radius * Math.min(2.4, zoom)
    const edge = Math.max(0, Math.min(1, (z - 0.55) / 0.2, (3.6 - z) / 0.25))
    const fade = edge * edge * (3 - 2 * edge) * population
    const opacity = star.opacity * (0.84 + 0.16 * Math.sin(time * star.speed + star.phase)) * fade
    if (x < -20 || x > width + 20 || y < -20 || y > height + 20 || !opacity) continue
    context.fillStyle = `rgba(${star.tint}, ${opacity})`
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()

    if (star.glint) {
      const reach = radius * 6.5
      const glow = context.createRadialGradient(x, y, 0, x, y, reach)
      glow.addColorStop(0, `rgba(${star.tint}, ${opacity * 0.8})`)
      glow.addColorStop(0.15, `rgba(${star.tint}, ${opacity * 0.25})`)
      glow.addColorStop(0.6, `rgba(${star.tint}, ${opacity * 0.12})`)
      glow.addColorStop(1, `rgba(${star.tint}, 0)`)
      context.strokeStyle = glow
      context.lineWidth = 0.6
      context.beginPath()
      context.moveTo(x - reach, y)
      context.lineTo(x + reach, y)
      context.moveTo(x, y - reach)
      context.lineTo(x, y + reach)
      context.stroke()
    }
  }
}

export default function SpaceBackground({ ref, planetVisible }: SpaceBackgroundProps) {
  const nebulaRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLCanvasElement>(null)
  const seedRef = useRef<number | undefined>(undefined)
  const triggerRef = useRef<SpaceBackgroundControls['trigger'] | null>(null)
  const planetVisibleRef = useRef(planetVisible)
  const repaintRef = useRef<(() => void) | null>(null)

  useImperativeHandle(ref, () => ({ trigger: (effect) => triggerRef.current?.(effect) }), [])

  useEffect(() => {
    planetVisibleRef.current = planetVisible
    repaintRef.current?.()
  }, [planetVisible])

  useEffect(() => {
    const nebula = nebulaRef.current
    const canvas = starsRef.current
    const context = canvas?.getContext('2d')
    if (!nebula || !canvas || !context) return

    const seed = seedRef.current ?? Math.floor(Math.random() * 4294967296)
    seedRef.current = seed
    const renderer = createNebulaRenderer(seed)
    const planets = createPlanetScene(seed, () => syncAnimation())
    nebula.append(renderer.canvas)
    const stars = createStars(seed)
    const satelliteRandom = createRandom(seed ^ 0x2f6e8b13)
    const cometRandom = createRandom(seed ^ 0x4c91a7e5)
    const pulseRandom = createRandom(seed ^ 0x18e46bc7)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motion.matches
    let resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    let frame = 0
    let resizeTimer = 0
    let width = 0
    let height = 0
    let pixelRatio = 0
    let previousTime = 0
    let nextFrame = 0
    let elapsed = 0
    let travel = 0
    let targetTravel = 0
    let planetOpacity = planetVisibleRef.current ? 1 : 0
    let satellite: Satellite | undefined
    let nextSatelliteAt = 20 + satelliteRandom() * 20
    let comet: Comet | undefined
    let nextCometAt = 45 + cometRandom() * 30
    let lightPulse: NebulaPulse | undefined
    let nextPulseAt = 6 + pulseRandom() * 6

    function startEffect(effect: SpaceEffect) {
      switch (effect) {
        case 'satellite':
          satellite = createSatellite(satelliteRandom, elapsed)
          nextSatelliteAt = elapsed + satellite.duration + 45 + satelliteRandom() * 45
          break
        case 'comet':
          comet = createComet(cometRandom, elapsed)
          nextCometAt = elapsed + comet.duration + 120 + cometRandom() * 120
          break
        case 'pulse':
          if (lightPulse && elapsed < lightPulse.start + lightPulse.duration) return
          lightPulse = createLightPulse(pulseRandom, elapsed)
          nextPulseAt = elapsed + lightPulse.duration + 12 + pulseRandom() * 16
          break
      }
    }

    triggerRef.current = (effect) => {
      if (motion.matches || document.hidden || document.getElementById('startup-loader')) return
      startEffect(effect)
    }

    function updateScroll() {
      targetTravel = Math.max(0, window.scrollY) / Math.max(1, height)
    }

    function drawAtDepth(depth: number, draw: () => void) {
      const parallax = 2.4 * Math.tanh(travel / 2.4)
      const zoom = 1 + parallax * depth * 0.18
      context!.save()
      context!.translate(width * 0.5, height * 0.45 - height * parallax * depth * 0.045)
      context!.scale(zoom, zoom)
      context!.translate(-width * 0.5, -height * 0.45)
      draw()
      context!.restore()
    }

    function paint() {
      if (reducedMotion) lightPulse = undefined
      else {
        if (lightPulse && elapsed >= lightPulse.start + lightPulse.duration) lightPulse = undefined
        if (elapsed >= nextPulseAt) startEffect('pulse')
      }
      renderer.draw(elapsed, travel, lightPulse)
      drawStars(context!, stars, { width, height, travel }, elapsed)
      if (reducedMotion) {
        satellite = undefined
        comet = undefined
      } else {
        if (comet && elapsed >= comet.start + comet.duration) comet = undefined
        if (elapsed >= nextCometAt) startEffect('comet')
        if (comet) drawAtDepth(0.35, () => drawComet(context!, comet!, width, height, elapsed))
        if (satellite && elapsed >= satellite.start + satellite.duration) satellite = undefined
        if (elapsed >= nextSatelliteAt) startEffect('satellite')
        if (satellite) drawAtDepth(0.6, () => drawSatellite(context!, satellite!, width, height, elapsed))
      }
      if (reducedMotion) planetOpacity = planetVisibleRef.current ? 1 : 0
      planets.draw(context!, { width, height, travel }, elapsed, planetOpacity, reducedMotion)
    }

    function animate(time: number) {
      frame = window.requestAnimationFrame(animate)
      if (!previousTime) {
        previousTime = time
        nextFrame = time
      }
      if (time < nextFrame - 0.5) return
      const delta = time - previousTime
      const seconds = Math.min(delta, 100) / 1000
      elapsed += seconds
      travel += (targetTravel - travel) * (1 - Math.exp(-seconds * 8))
      const visibilityChange = (planetVisibleRef.current ? 1 : 0) - planetOpacity
      planetOpacity += Math.sign(visibilityChange) * Math.min(Math.abs(visibilityChange), seconds * 0.6)
      previousTime = time
      nextFrame += 1000 / 60
      if (nextFrame < time) nextFrame = time + 1000 / 60
      paint()
    }

    function syncAnimation() {
      window.cancelAnimationFrame(frame)
      previousTime = 0
      reducedMotion = motion.matches
      updateScroll()
      if (reducedMotion) travel = 0
      if (document.hidden) return
      paint()
      if (!reducedMotion && !document.getElementById('startup-loader')) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    function resize() {
      const bounds = canvas!.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(bounds.width))
      const nextHeight = Math.max(1, Math.round(bounds.height))
      const nextRatio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(3000000 / (nextWidth * nextHeight)))
      if (width === nextWidth && height === nextHeight && pixelRatio === nextRatio) return

      const dimensionsChanged = width !== nextWidth || height !== nextHeight
      width = nextWidth
      height = nextHeight
      pixelRatio = nextRatio
      canvas!.width = Math.round(width * pixelRatio)
      canvas!.height = Math.round(height * pixelRatio)
      context!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      if (dimensionsChanged) renderer.resize(width, height)
      syncAnimation()
    }

    function scheduleResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
    }

    function handleResolutionChange() {
      resolution.removeEventListener('change', handleResolutionChange)
      resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      resolution.addEventListener('change', handleResolutionChange)
      scheduleResize()
    }

    repaintRef.current = syncAnimation
    resize()
    window.addEventListener('resize', scheduleResize)
    window.addEventListener('scroll', updateScroll, { passive: true })
    motion.addEventListener('change', syncAnimation)
    resolution.addEventListener('change', handleResolutionChange)
    document.addEventListener('visibilitychange', syncAnimation)
    document.addEventListener('portfolio:startup-complete', syncAnimation)

    return () => {
      triggerRef.current = null
      repaintRef.current = null
      window.cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', scheduleResize)
      window.removeEventListener('scroll', updateScroll)
      motion.removeEventListener('change', syncAnimation)
      resolution.removeEventListener('change', handleResolutionChange)
      document.removeEventListener('visibilitychange', syncAnimation)
      document.removeEventListener('portfolio:startup-complete', syncAnimation)
      planets.dispose()
      renderer.dispose()
      renderer.canvas.remove()
    }
  }, [])

  return (
    <div className="space-background" aria-hidden="true">
      <div ref={nebulaRef} />
      <canvas ref={starsRef} />
    </div>
  )
}

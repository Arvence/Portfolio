import { useEffect, useRef } from 'react'
import { createNebulaRenderer, createRandom } from './spaceNebula'

type Star = {
  x: number
  y: number
  radius: number
  opacity: number
  phase: number
  speed: number
  tint: string
  glint: boolean
}

type ShootingStar = {
  x: number
  y: number
  dx: number
  dy: number
  scale: number
  travel: number
  trail: number
  opacity: number
  start: number
  duration: number
}

function createShootingStar(random: () => number, time: number): ShootingStar {
  const direction = random() < 0.7 ? 1 : -1
  const angle = 0.2 + random() * 0.25
  const strength = random() ** 2
  const travelScale = 0.1 + random() * 1.9
  const travel = 0.4 * (travelScale / 0.5)
  const minSpeed = Math.max(0.12, travel / 2.4)
  const maxSpeed = Math.min(0.9, travel / 0.45)
  const speed = minSpeed + random() * (maxSpeed - minSpeed)
  const trailLifetime = 0.08 + strength * 0.1 + random() * 0.06

  return {
    x: (direction > 0 ? 0.1 : 0.55) + random() * 0.35,
    y: 0.06 + random() * 0.28,
    dx: direction * Math.cos(angle),
    dy: Math.sin(angle),
    scale: 0.1 + strength * 1.9,
    travel,
    trail: Math.min(travel * 0.3, speed * trailLifetime),
    opacity: 0.4 + strength * 0.3,
    start: time,
    duration: travel / speed,
  }
}

function drawMeteor(ctx: CanvasRenderingContext2D, star: ShootingStar, width: number, height: number, time: number) {
  const progress = (time - star.start) / star.duration
  const viewportScale = Math.min(width, height)
  const size = star.scale / 0.5
  const distance = viewportScale * star.travel * progress
  const x = star.x * width + star.dx * distance
  const y = star.y * height + star.dy * distance
  const length = Math.min(viewportScale * star.trail, distance)
  const tailX = x - star.dx * length
  const tailY = y - star.dy * length
  const opacity = Math.sin(Math.PI * progress) ** 2 * star.opacity
  const trail = ctx.createLinearGradient(tailX, tailY, x, y)
  trail.addColorStop(0, 'rgba(165, 210, 240, 0)')
  trail.addColorStop(0.65, `rgba(165, 210, 240, ${opacity * 0.3})`)
  trail.addColorStop(1, `rgba(207, 231, 249, ${opacity})`)

  ctx.save()
  ctx.strokeStyle = trail
  ctx.lineWidth = size
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(tailX, tailY)
  ctx.lineTo(x, y)
  ctx.stroke()
  ctx.fillStyle = `rgba(207, 231, 249, ${opacity})`
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
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
    }
  })
}

function drawStars(context: CanvasRenderingContext2D, stars: Star[], width: number, height: number, time: number) {
  context.clearRect(0, 0, width, height)
  const count = Math.min(stars.length, Math.max(60, Math.round((width * height) / 7000)))

  for (let index = 0; index < count; index++) {
    const star = stars[index]!
    const depth = 0.3 + star.radius * 0.7
    const driftX = time * 0.22 * depth + (Math.sin(time * 0.02 + star.phase) - Math.sin(star.phase)) * depth * 1.5
    const driftY = -time * 0.1 * depth
    const x = ((((star.x * width + driftX + 12) % (width + 24)) + width + 24) % (width + 24)) - 12
    const y = ((((star.y * height + driftY + 12) % (height + 24)) + height + 24) % (height + 24)) - 12
    const opacity = star.opacity * (0.84 + 0.16 * Math.sin(time * star.speed + star.phase))
    context.fillStyle = `rgba(${star.tint}, ${opacity})`
    context.beginPath()
    context.arc(x, y, star.radius, 0, Math.PI * 2)
    context.fill()

    if (star.glint) {
      const reach = star.radius * 6.5
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

export default function SpaceBackground() {
  const nebulaRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLCanvasElement>(null)
  const seedRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const nebula = nebulaRef.current
    const canvas = starsRef.current
    const context = canvas?.getContext('2d')
    if (!nebula || !canvas || !context) return

    const seed = seedRef.current ?? Math.floor(Math.random() * 4294967296)
    seedRef.current = seed
    const renderer = createNebulaRenderer(seed)
    nebula.append(renderer.canvas)
    const stars = createStars(seed)
    const random = createRandom(seed ^ 0x7b3d9e21)
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
    let shootingStar: ShootingStar | undefined
    let nextShootingStarAt = 5 + random() * 7

    function paint() {
      renderer.draw(elapsed)
      drawStars(context!, stars, width, height, elapsed)
      if (reducedMotion) {
        shootingStar = undefined
        return
      }
      if (shootingStar && elapsed >= shootingStar.start + shootingStar.duration) shootingStar = undefined
      if (elapsed >= nextShootingStarAt) {
        shootingStar = createShootingStar(random, elapsed)
        nextShootingStarAt = elapsed + 5 + random() * 7
      }
      if (shootingStar) drawMeteor(context!, shootingStar, width, height, elapsed)
    }

    function animate(time: number) {
      frame = window.requestAnimationFrame(animate)
      if (!previousTime) {
        previousTime = time
        nextFrame = time
      }
      if (time < nextFrame - 0.5) return
      const delta = time - previousTime
      elapsed += Math.min(delta, 100) / 1000
      previousTime = time
      nextFrame += 1000 / 60
      if (nextFrame < time) nextFrame = time + 1000 / 60
      paint()
    }

    function syncAnimation() {
      window.cancelAnimationFrame(frame)
      previousTime = 0
      reducedMotion = motion.matches
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

    resize()
    window.addEventListener('resize', scheduleResize)
    motion.addEventListener('change', syncAnimation)
    resolution.addEventListener('change', handleResolutionChange)
    document.addEventListener('visibilitychange', syncAnimation)
    document.addEventListener('portfolio:startup-complete', syncAnimation)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', scheduleResize)
      motion.removeEventListener('change', syncAnimation)
      resolution.removeEventListener('change', handleResolutionChange)
      document.removeEventListener('visibilitychange', syncAnimation)
      document.removeEventListener('portfolio:startup-complete', syncAnimation)
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

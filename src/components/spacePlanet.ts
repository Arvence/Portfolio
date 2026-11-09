import { createRandom } from './spaceNebula'
import { createEarthRenderer } from './spaceEarth'
import { loadSolarTextures, type SolarTexture } from './spaceSolarTextures'
import {
  lightDirection,
  moonNorth,
  moonPosition,
  normalize,
  planetPosition,
  planets,
  profiles,
  sunPosition,
} from './spaceSolarSystem'
import type { BodyPosition, Planet, PlanetView, Vector } from './spaceSolarSystem'

const tau = Math.PI * 2
const clamp = (value: number) => Math.max(0, Math.min(1, value))

function createSphere(planet: Planet, onChange?: () => void) {
  const earth = planet.name === 'earth'
  const moon = planet.name === 'moon'
  const profile = profiles[planet.distance]
  const gpu = earth
    ? createEarthRenderer(() => {
        lastTime = -Infinity
        onChange?.()
      })
    : null
  let gpuReady = false
  const size = earth ? 256 : moon ? 128 : profile.resolution
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d')
  const image = context?.createImageData(size, size)
  const points = new Float32Array(size * size * 5)
  let lastTime = -Infinity
  let lastLight: Vector = { x: 0, y: 0, z: 0 }
  let lastTexture: SolarTexture | undefined
  const radius = size / 2 - 1
  if (image) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = (x + 0.5 - size / 2) / radius
        const ny = (y + 0.5 - size / 2) / radius
        const distance = Math.hypot(nx, ny)
        if (distance >= 1) continue
        const nz = Math.sqrt(1 - distance * distance)
        const index = y * size + x
        const offset = index * 5
        const rotatedX = nx * Math.cos(planet.tilt) + ny * Math.sin(planet.tilt)
        const rotatedY = -nx * Math.sin(planet.tilt) + ny * Math.cos(planet.tilt)
        points[offset] = nx
        points[offset + 1] = ny
        points[offset + 2] = nz
        points[offset + 3] = Math.atan2(rotatedX, nz) / tau + 0.5
        points[offset + 4] = Math.asin(rotatedY) / Math.PI + 0.5
        image.data[index * 4 + 3] = Math.min(1, (1 - distance) * radius) * 255
      }
    }
  }

  function update(texture: SolarTexture, position: BodyPosition, sunlight: Vector, parent: BodyPosition, time: number) {
    if (!context || !image) return
    const movedLight = Math.hypot(sunlight.x - lastLight.x, sunlight.y - lastLight.y, sunlight.z - lastLight.z) > 0.002
    if (
      texture === lastTexture &&
      time - lastTime < 1 / (moon ? 12 : profile.fps) &&
      !(time === lastTime && movedLight)
    )
      return
    lastTexture = texture
    lastLight = sunlight
    lastTime = time
    gpuReady = gpu?.draw(texture, sunlight, time, planet.tilt, planet.phase - time / planet.period) ?? false
    if (gpuReady) return
    const { width, height, stride, pixels } = texture
    const rotation = planet.phase - time / planet.period
    const cloudShift = time * 0.000018 * width
    const forward = lightDirection(position, parent)
    const right = normalize({
      x: moonNorth.y * forward.z - moonNorth.z * forward.y,
      y: moonNorth.z * forward.x - moonNorth.x * forward.z,
      z: moonNorth.x * forward.y - moonNorth.y * forward.x,
    })
    const halfLight = normalize({ x: sunlight.x, y: sunlight.y, z: sunlight.z + 1 })
    const exposure = earth ? 0.42 : moon ? 0.46 : 0.34
    for (let index = 0; index < size * size; index++) {
      const pixel = index * 4
      if (!image.data[pixel + 3]) continue
      const point = index * 5
      const nx = points[point]!
      const ny = points[point + 1]!
      const nz = points[point + 2]!
      const longitude = moon
        ? Math.atan2(nx * right.x + ny * right.y + nz * right.z, nx * forward.x + ny * forward.y + nz * forward.z) /
            tau +
          0.5
        : points[point + 3]! + rotation
      const latitude = moon
        ? 0.5 - Math.asin(Math.max(-1, Math.min(1, nx * moonNorth.x + ny * moonNorth.y + nz * moonNorth.z))) / Math.PI
        : points[point + 4]!
      const u = longitude * width
      const v = Math.min(height - 1.001, latitude * (height - 1))
      const column = Math.floor(u)
      const row = Math.floor(v) * width
      const horizontal = u - column
      const vertical = v - Math.floor(v)
      const a = (row + (column & (width - 1))) * stride
      const b = (row + ((column + 1) & (width - 1))) * stride
      const next = width * stride
      const w0 = (1 - horizontal) * (1 - vertical)
      const w1 = horizontal * (1 - vertical)
      const w2 = (1 - horizontal) * vertical
      const w3 = horizontal * vertical
      const dot = nx * sunlight.x + ny * sunlight.y + nz * sunlight.z
      const illumination = Math.sqrt(Math.max(0, dot)) * exposure
      let cloud = 0
      let reflection = 0
      let night = 0
      if (earth) {
        const cloudU = u + cloudShift
        const cloudColumn = Math.floor(cloudU)
        const blend = cloudU - cloudColumn
        const ca = (row + (cloudColumn & (width - 1))) * stride + 7
        const cb = (row + ((cloudColumn + 1) & (width - 1))) * stride + 7
        cloud =
          ((pixels[ca]! * (1 - blend) + pixels[cb]! * blend) * (1 - vertical) +
            (pixels[ca + next]! * (1 - blend) + pixels[cb + next]! * blend) * vertical) /
          255
        const water =
          (pixels[a + 3]! * w0 + pixels[b + 3]! * w1 + pixels[a + next + 3]! * w2 + pixels[b + next + 3]! * w3) / 255
        const highlight = Math.max(0, nx * halfLight.x + ny * halfLight.y + nz * halfLight.z)
        reflection = highlight ** 80 * water * 22
        const darkness = clamp(-dot / 0.14)
        night = darkness * darkness * (3 - 2 * darkness) * 0.18 * (1 - cloud * 0.85)
      }
      const rim = earth ? (1 - nz) ** 6 * Math.max(0, dot + 0.04) : 0
      for (let channel = 0; channel < 3; channel++) {
        const surface =
          pixels[a + channel]! * w0 +
          pixels[b + channel]! * w1 +
          pixels[a + next + channel]! * w2 +
          pixels[b + next + channel]! * w3
        const color = (surface + reflection) * (1 - cloud * 0.92) + (228 + channel * 4) * cloud * 0.92
        let city = 0
        if (earth)
          city =
            (pixels[a + channel + 4]! * w0 +
              pixels[b + channel + 4]! * w1 +
              pixels[a + next + channel + 4]! * w2 +
              pixels[b + next + channel + 4]! * w3) *
            night
        image.data[pixel + channel] =
          color * (illumination + 0.002) + city + rim * (channel === 0 ? 4 : channel === 1 ? 18 : 38)
      }
    }
    context.putImageData(image, 0, 0)
  }

  return {
    // prettier-ignore
    draw(ctx: CanvasRenderingContext2D, position: BodyPosition, source: BodyPosition, parent: BodyPosition, time: number, texture?: SolarTexture) {
      if (!texture) return
      const light = lightDirection(position, source)
      update(texture, position, light, parent, time)
      const { x, y, radius } = position
      if (earth) {
        const glow = ctx.createRadialGradient(x, y, radius * 0.99, x, y, radius * 1.025)
        const tint = '75, 133, 185'
        glow.addColorStop(0, `rgba(${tint}, 0.045)`)
        glow.addColorStop(0.25, `rgba(${tint}, 0.008)`)
        glow.addColorStop(1, `rgba(${tint}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, radius * 1.025, 0, tau)
        ctx.fill()
      }
      ctx.drawImage(gpuReady && gpu ? gpu.canvas : canvas, x - radius, y - radius, radius * 2, radius * 2)
    },
    dispose() {
      gpu?.dispose()
    },
  }
}

export function createPlanetScene(seed: number, onReady?: () => void) {
  const random = createRandom(seed ^ 0x63a8d195)
  const earthConfig = planets[0]!
  const earthBody = { planet: earthConfig, sphere: createSphere(earthConfig, onReady), phase: random() * tau }
  const moon = createSphere({ ...earthConfig, name: 'moon', tilt: 0, phase: 0, period: 180 })
  const controller = new AbortController()
  let textures: Awaited<ReturnType<typeof loadSolarTextures>> = {}
  let readyAt: number | undefined
  const ready = loadSolarTextures(controller.signal).then((loaded) => {
    if (controller.signal.aborted) return
    textures = loaded
    onReady?.()
  })

  return {
    ready,
    draw(ctx: CanvasRenderingContext2D, view: PlanetView, time: number, opacity: number, reducedMotion = false) {
      if (controller.signal.aborted || opacity <= 0) return
      if (Object.keys(textures).length && readyAt === undefined) readyAt = time
      const fade = reducedMotion ? 1 : clamp((time - (readyAt ?? time)) / 0.8)
      const source = sunPosition(view)
      const earth = planetPosition(earthBody.planet, view, time, earthBody.phase)
      const satellite = moonPosition(earth, time)
      const entries = [
        { name: 'earth', sphere: earthBody.sphere, position: earth },
        { name: 'moon', sphere: moon, position: satellite },
      ]
      entries.sort((a, b) => a.position.z - b.position.z)

      ctx.save()
      ctx.globalAlpha = opacity * fade
      for (const entry of entries) {
        const texture = textures[entry.name as keyof typeof textures]
        entry.sphere.draw(ctx, entry.position, source, earth, time, texture)
      }
      ctx.restore()
    },
    dispose() {
      controller.abort()
      earthBody.sphere.dispose()
      moon.dispose()
      textures = {}
    },
  }
}

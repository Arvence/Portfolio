export type BodyName = 'earth' | 'moon'
export type Vector = { x: number; y: number; z: number }
export type BodyPosition = Vector & { radius: number }
export type PlanetView = { width: number; height: number; travel: number }
export type Planet = {
  name: BodyName
  distance: 'near' | 'medium' | 'far'
  x: number
  y: number
  size: number
  tilt: number
  period: number
  phase: number
}

export const planets: Planet[] = [
  { name: 'earth', distance: 'near', x: 1, y: 1, size: 1, tilt: 0.409, period: 360, phase: 0.5 },
]

export const profiles = {
  near: { scale: 0.32, min: 88, max: 300, resolution: 512, depth: 1.1, fps: 12, z: 0 },
  medium: { scale: 0.075, min: 22, max: 76, resolution: 160, depth: 0.45, fps: 10, z: -0.6 },
  far: { scale: 0.018, min: 6, max: 18, resolution: 64, depth: 0.12, fps: 6, z: -1 },
}

export const moonRadiusRatio = 1737.4 / 6371
export const moonOrbitPeriod = 180
const orbitEccentricity = 0.0549
const orbitInclination = (68 * Math.PI) / 180
const orbitPositionAngle = -0.3
export const moonNorth = {
  x: -Math.sin(orbitPositionAngle) * Math.sin(orbitInclination),
  y: Math.cos(orbitPositionAngle) * Math.sin(orbitInclination),
  z: Math.cos(orbitInclination),
}

export function normalize(vector: Vector): Vector {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length }
}

export function lightDirection(body: Vector, sun: Vector): Vector {
  return normalize({ x: sun.x - body.x, y: sun.y - body.y, z: sun.z - body.z })
}

export function planetPosition(planet: Planet, view: PlanetView, time: number, phase: number): BodyPosition {
  const profile = profiles[planet.distance]
  const { width, height, travel } = view
  const parallax = 2.4 * Math.tanh(travel / 2.4)
  const zoom = 1 + parallax * profile.depth * 0.18
  const radius =
    Math.min(profile.max, Math.max(profile.min, Math.min(width, height) * profile.scale)) * planet.size * zoom
  const speed = 0.0015 + profile.depth * 0.004
  const driftX = (Math.sin(time * speed + phase) - Math.sin(phase)) * radius * 0.12
  const driftY = (Math.sin(time * speed * 0.7 + phase) - Math.sin(phase)) * radius * 0.1
  const margin = radius * 1.2 + 8
  const x =
    planet.distance === 'near'
      ? width - radius * (0.85 + parallax * 0.08) + driftX
      : Math.max(margin, Math.min(width - margin, width * (0.5 + (planet.x - 0.5) * zoom) + driftX))
  const y =
    planet.distance === 'near'
      ? height - radius * (0.6 + parallax * 0.06) + driftY
      : Math.max(
          radius + 8,
          Math.min(
            height - radius - 8,
            height * (0.45 + (planet.y - 0.45) * zoom - parallax * profile.depth * 0.045) + driftY,
          ),
        )
  return { x, y, z: Math.min(width, height) * profile.z, radius }
}

export function sunPosition(view: PlanetView): BodyPosition {
  const extent = Math.min(view.width, view.height)
  const radius = Math.min(32, Math.max(12, extent * 0.028))
  return { x: Math.min(view.width * 0.965, view.width - radius * 1.3), y: view.height * 0.42, z: extent * 0.28, radius }
}

export function moonPosition(earth: BodyPosition, time: number): BodyPosition {
  const meanAnomaly = ((time / moonOrbitPeriod) * Math.PI * 2 + 1.85) % (Math.PI * 2)
  let anomaly = meanAnomaly
  for (let i = 0; i < 4; i++)
    anomaly -=
      (anomaly - orbitEccentricity * Math.sin(anomaly) - meanAnomaly) / (1 - orbitEccentricity * Math.cos(anomaly))
  const semimajor = earth.radius * 2.45
  const x = semimajor * (Math.cos(anomaly) - orbitEccentricity)
  const along = -semimajor * Math.sqrt(1 - orbitEccentricity ** 2) * Math.sin(anomaly)
  const y = along * Math.cos(orbitInclination)
  return {
    x: earth.x + x * Math.cos(orbitPositionAngle) - y * Math.sin(orbitPositionAngle),
    y: earth.y + x * Math.sin(orbitPositionAngle) + y * Math.cos(orbitPositionAngle),
    z: earth.z - along * Math.sin(orbitInclination),
    radius: earth.radius * moonRadiusRatio,
  }
}

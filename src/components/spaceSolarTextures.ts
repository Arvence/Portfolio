import earth from '../assets/solar-system/earth_daymap.webp'
import night from '../assets/solar-system/earth_nightmap.webp'
import clouds from '../assets/solar-system/earth_clouds.webp'
import moon from '../assets/solar-system/moon.webp'
import type { BodyName } from './spaceSolarSystem'

export type SolarTexture = { width: number; height: number; pixels: Uint8ClampedArray; stride: number }
export type SolarTextures = Partial<Record<BodyName, SolarTexture>>

export function loadSolarTextures(signal: AbortSignal): Promise<SolarTextures> {
  async function load(url: string, width: number, height = width / 2) {
    const response = await fetch(url, { signal })
    if (!response.ok) throw new Error('Celestial texture unavailable')
    const bitmap = await createImageBitmap(await response.blob())
    try {
      if (signal.aborted) return undefined
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return undefined
      context.drawImage(bitmap, 0, 0, width, height)
      return { width, height, pixels: context.getImageData(0, 0, width, height).data, stride: 4 }
    } finally {
      bitmap.close()
    }
  }

  const requests = [
    ['earth', earth, 2048],
    ['night', night, 2048],
    ['clouds', clouds, 2048],
    ['moon', moon, 512],
  ] as const

  return Promise.allSettled(requests.map(([, url, width]) => load(url, width, width / 2))).then((results) => {
    if (signal.aborted) return {}
    const loaded: Partial<Record<BodyName | 'night' | 'clouds', SolarTexture>> = {}
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) loaded[requests[index]![0]] = result.value
    })

    if (loaded.earth) {
      const day = loaded.earth
      const pixels = new Uint8ClampedArray(day.width * day.height * 8)
      for (let i = 0; i < day.width * day.height; i++) {
        const source = i * 4
        const target = i * 8
        for (let channel = 0; channel < 3; channel++) {
          pixels[target + channel] = day.pixels[source + channel]!
          pixels[target + channel + 4] = loaded.night?.pixels[source + channel] ?? 0
        }
        const red = day.pixels[source]!
        const green = day.pixels[source + 1]!
        const blue = day.pixels[source + 2]!
        pixels[target + 3] = blue > red * 1.3 && blue > green * 1.15 ? 255 : 0
        pixels[target + 7] = loaded.clouds?.pixels[source] ?? 0
      }
      loaded.earth = { ...day, pixels, stride: 8 }
    }

    delete loaded.night
    delete loaded.clouds
    return loaded as SolarTextures
  })
}

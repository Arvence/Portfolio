import type { SolarTexture } from './spaceSolarTextures'
import type { Vector } from './spaceSolarSystem'

const vertexSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const fragmentSource = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_day;
uniform sampler2D u_night;
uniform vec3 u_light;
uniform float u_time;
uniform float u_tilt;
uniform float u_phase;
void main() {
  vec2 p = (v_uv * 2.0 - 1.0) * (512.0 / 510.0);
  p.y = -p.y;
  float distance = length(p);
  if (distance >= 1.0) { gl_FragColor = vec4(0.0); return; }
  vec3 normal = vec3(p, sqrt(1.0 - dot(p, p)));
  vec2 rotated = vec2(p.x * cos(u_tilt) + p.y * sin(u_tilt), -p.x * sin(u_tilt) + p.y * cos(u_tilt));
  vec2 uv = vec2(atan(rotated.x, normal.z) / 6.28318530718 + 0.5 + u_phase, asin(rotated.y) / 3.14159265359 + 0.5);
  vec4 day = texture2D(u_day, uv);
  vec4 night = texture2D(u_night, uv);
  float cloud = texture2D(u_night, uv + vec2(u_time * 0.000018, 0.0)).a;
  float sunlight = dot(normal, u_light);
  float illumination = sqrt(max(0.0, sunlight)) * 0.42;
  vec3 halfLight = normalize(u_light + vec3(0.0, 0.0, 1.0));
  float reflection = pow(max(0.0, dot(normal, halfLight)), 80.0) * day.a * (22.0 / 255.0);
  float darkness = smoothstep(0.0, 0.14, -sunlight);
  vec3 color = mix(day.rgb + reflection, vec3(228.0, 232.0, 236.0) / 255.0, cloud * 0.92);
  color *= illumination + 0.002;
  color += night.rgb * darkness * 0.18 * (1.0 - cloud * 0.85);
  color += pow(1.0 - normal.z, 6.0) * max(0.0, sunlight + 0.04) * vec3(4.0, 18.0, 38.0) / 255.0;
  gl_FragColor = vec4(color, min(1.0, (1.0 - distance) * 255.0));
}`

export function createEarthRenderer(onChange?: () => void) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  })
  if (!gl || gl.getParameter(gl.MAX_TEXTURE_SIZE) < 2048) return null
  const context = gl
  let program: WebGLProgram | null = null
  let buffer: WebGLBuffer | null = null
  let maps: WebGLTexture[] = []
  let locations: Record<string, WebGLUniformLocation | null> = {}
  let loaded: SolarTexture | undefined
  let disposed = false
  let lost = false

  function initialize() {
    const shaders = [vertexSource, fragmentSource].map((source, index) => {
      const shader = context.createShader(index ? context.FRAGMENT_SHADER : context.VERTEX_SHADER)
      if (!shader) return null
      context.shaderSource(shader, source)
      context.compileShader(shader)
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader)
        return null
      }
      return shader
    })
    program = context.createProgram()
    if (!program || shaders.some((shader) => !shader)) {
      shaders.forEach((shader) => {
        if (shader) context.deleteShader(shader)
      })
      if (program) context.deleteProgram(program)
      program = null
      return
    }
    shaders.forEach((shader) => context.attachShader(program!, shader!))
    context.linkProgram(program)
    shaders.forEach((shader) => context.deleteShader(shader))
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      context.deleteProgram(program)
      program = null
      return
    }
    context.useProgram(program)
    buffer = context.createBuffer()
    context.bindBuffer(context.ARRAY_BUFFER, buffer)
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      context.STATIC_DRAW,
    )
    const attribute = context.getAttribLocation(program, 'a_position')
    context.enableVertexAttribArray(attribute)
    context.vertexAttribPointer(attribute, 2, context.FLOAT, false, 0, 0)
    locations = Object.fromEntries(
      ['day', 'night', 'light', 'time', 'tilt', 'phase'].map((name) => [
        name,
        context.getUniformLocation(program!, `u_${name}`),
      ]),
    )
    context.uniform1i(locations.day!, 0)
    context.uniform1i(locations.night!, 1)
    context.viewport(0, 0, 512, 512)
    loaded = undefined
  }

  function handleLoss(event: Event) {
    event.preventDefault()
    lost = true
    onChange?.()
  }

  function handleRestore() {
    if (disposed) return
    lost = false
    maps = []
    initialize()
    onChange?.()
  }

  initialize()
  canvas.addEventListener('webglcontextlost', handleLoss)
  canvas.addEventListener('webglcontextrestored', handleRestore)

  return {
    canvas,
    draw(texture: SolarTexture, light: Vector, time: number, tilt: number, phase: number) {
      if (!program || lost || disposed) return false
      if (loaded !== texture) {
        maps.forEach((map) => context.deleteTexture(map))
        maps = []
        for (let layer = 0; layer < 2; layer++) {
          const pixels = new Uint8Array(texture.width * texture.height * 4)
          for (let i = 0; i < texture.width * texture.height; i++) {
            for (let channel = 0; channel < 4; channel++)
              pixels[i * 4 + channel] = texture.pixels[i * 8 + layer * 4 + channel]!
          }
          const map = context.createTexture()
          if (!map) return false
          maps.push(map)
          context.activeTexture(context.TEXTURE0 + layer)
          context.bindTexture(context.TEXTURE_2D, map)
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR)
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR)
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.REPEAT)
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)
          context.texImage2D(
            context.TEXTURE_2D,
            0,
            context.RGBA,
            texture.width,
            texture.height,
            0,
            context.RGBA,
            context.UNSIGNED_BYTE,
            pixels,
          )
        }
        loaded = texture
      }
      context.uniform3f(locations.light!, light.x, light.y, light.z)
      context.uniform1f(locations.time!, time)
      context.uniform1f(locations.tilt!, tilt)
      context.uniform1f(locations.phase!, phase)
      context.drawArrays(context.TRIANGLES, 0, 6)
      return true
    },
    dispose() {
      disposed = true
      canvas.removeEventListener('webglcontextlost', handleLoss)
      canvas.removeEventListener('webglcontextrestored', handleRestore)
      maps.forEach((map) => context.deleteTexture(map))
      context.deleteBuffer(buffer)
      context.deleteProgram(program)
      loaded = undefined
    },
  }
}

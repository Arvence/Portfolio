type NebulaRenderer = {
  canvas: HTMLCanvasElement
  resize: (width: number, height: number) => void
  draw: (time: number) => void
  dispose: () => void
}

type NoiseField = {
  values: Uint8Array
  offsetX: number
  offsetY: number
  slope: number
}

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D u_noise;
uniform vec2 u_offset;
uniform float u_aspect;
uniform float u_slope;
uniform float u_time;
varying vec2 v_uv;

float noise(vec3 point) {
  vec3 cell = floor(point);
  vec3 fraction = fract(point);
  vec3 blend = fraction * fraction * (3.0 - 2.0 * fraction);
  vec2 uv = cell.xy + blend.xy + vec2(37.0, 59.0) * cell.z + 0.5;
  float lower = texture2D(u_noise, uv / 256.0).r;
  float upper = texture2D(u_noise, (uv + vec2(37.0, 59.0)) / 256.0).r;
  return mix(lower, upper, blend.z);
}

float fractal(vec2 point) {
  float value = 0.0;
  float amplitude = 0.52;
  for (int octave = 0; octave < 5; octave++) {
    float layer = float(octave);
    vec2 drift = mod(layer, 2.0) < 1.0 ? vec2(0.013, -0.008) : vec2(-0.011, 0.006);
    value += noise(vec3(point + drift * u_time, u_time * (0.028 + layer * 0.009))) * amplitude;
    point = point * 2.03 + vec2(17.1, 9.2);
    amplitude *= 0.48;
  }
  return value;
}

void main() {
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  vec2 point = uv * vec2(max(1.0, u_aspect), max(1.0, 1.0 / u_aspect)) + u_offset;
  float broad = noise(vec3(point * 1.6 + vec2(0.007, -0.004) * u_time, u_time * 0.018));
  float warp = noise(vec3(point * 2.4 + vec2(31.0, 13.0) + vec2(-0.009, 0.006) * u_time, u_time * 0.023));
  float cloud = fractal(point * 3.8 + vec2(broad, warp) * 1.6);
  float detail = noise(vec3(point * 42.0 + vec2(warp, broad) * 4.0 + vec2(0.02, -0.015) * u_time, u_time * 0.045));
  float distance = uv.y + u_slope * uv.x - 1.2 + (cloud - 0.5) * 0.65 + (broad - 0.5) * 0.32 + (detail - 0.5) * 0.035;
  float edge = exp(-pow(distance + 0.055, 2.0) / 0.015) * (0.2 + cloud * 0.8) * (0.7 + detail * 0.3);
  float shadow = smoothstep(-0.015, 0.105, distance) * 0.94;
  float haze = max(0.0, cloud * 1.3 - 0.12) * (0.4 + broad * 0.6);
  float vignette = 1.0 - min(0.55, dot(uv - vec2(0.5, 0.45), uv - vec2(0.5, 0.45)) * 0.9);
  float grain = (texture2D(u_noise, gl_FragCoord.xy / 256.0).r - 0.5) * 2.6;
  vec3 sky = vec3(8.0, 19.0, 32.0) + haze * vec3(11.0, 24.0, 37.0) + edge * vec3(4.0, 16.0, 29.0);
  vec3 color = mix(sky, vec3(3.0, 7.0, 12.0), shadow) * vignette + grain;
  gl_FragColor = vec4(color / 255.0, 1.0);
}
`

export function createRandom(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function sizeCanvas(canvas: HTMLCanvasElement, width: number, height: number, limit: number) {
  const scale = Math.min(1, limit / Math.max(width, height))
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
}

function createGpuRenderer(field: NoiseField): NebulaRenderer | undefined {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  })
  if (!context) return
  const gl = context

  let program: WebGLProgram | null = null
  let buffer: WebGLBuffer | null = null
  let texture: WebGLTexture | null = null
  let timeUniform: WebGLUniformLocation | null = null
  let aspectUniform: WebGLUniformLocation | null = null
  let aspect = 1
  let lastTime = 0

  function releaseResources() {
    gl.deleteProgram(program)
    gl.deleteBuffer(buffer)
    gl.deleteTexture(texture)
    program = null
    buffer = null
    texture = null
  }

  function initialize() {
    releaseResources()
    const vertex = gl.createShader(gl.VERTEX_SHADER)
    const fragment = gl.createShader(gl.FRAGMENT_SHADER)
    program = gl.createProgram()
    if (!vertex || !fragment || !program) {
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      releaseResources()
      return false
    }

    gl.shaderSource(vertex, VERTEX_SHADER)
    gl.shaderSource(fragment, FRAGMENT_SHADER)
    gl.compileShader(vertex)
    gl.compileShader(fragment)
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.bindAttribLocation(program, 0, 'a_position')
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      releaseResources()
      return false
    }

    buffer = gl.createBuffer()
    texture = gl.createTexture()
    if (!buffer || !texture) {
      releaseResources()
      return false
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 256, 256, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, field.values)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.uniform1i(gl.getUniformLocation(program, 'u_noise'), 0)
    gl.uniform2f(gl.getUniformLocation(program, 'u_offset'), field.offsetX, field.offsetY)
    gl.uniform1f(gl.getUniformLocation(program, 'u_slope'), field.slope)
    timeUniform = gl.getUniformLocation(program, 'u_time')
    aspectUniform = gl.getUniformLocation(program, 'u_aspect')
    return true
  }

  if (!initialize()) {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return
  }

  function draw(time: number) {
    lastTime = time
    if (!program || gl.isContextLost()) return
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform1f(timeUniform, time)
    gl.uniform1f(aspectUniform, aspect)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function handleContextLost(event: Event) {
    event.preventDefault()
    releaseResources()
  }

  function handleContextRestored() {
    if (initialize()) draw(lastTime)
  }

  canvas.addEventListener('webglcontextlost', handleContextLost)
  canvas.addEventListener('webglcontextrestored', handleContextRestored)

  return {
    canvas,
    resize(width, height) {
      aspect = width / height
      sizeCanvas(canvas, width, height, 640)
    },
    draw,
    dispose() {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      releaseResources()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

function createCpuRenderer(field: NoiseField): NebulaRenderer {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { alpha: false })
  let aspect = 1
  let lastTime = -Infinity
  let image: ImageData | undefined

  function sample(x: number, y: number) {
    const left = Math.floor(x)
    const top = Math.floor(y)
    const dx = x - left
    const dy = y - top
    const sx = dx * dx * (3 - 2 * dx)
    const sy = dy * dy * (3 - 2 * dy)
    const at = (column: number, row: number) => field.values[((row & 255) << 8) | (column & 255)]! / 255
    const upper = at(left, top) * (1 - sx) + at(left + 1, top) * sx
    const lower = at(left, top + 1) * (1 - sx) + at(left + 1, top + 1) * sx
    return upper * (1 - sy) + lower * sy
  }

  function noise(x: number, y: number, time: number) {
    const slice = Math.floor(time)
    const fraction = time - slice
    const blend = fraction * fraction * (3 - 2 * fraction)
    const lower = sample(x + slice * 37, y + slice * 59)
    const upper = sample(x + (slice + 1) * 37, y + (slice + 1) * 59)
    return lower * (1 - blend) + upper * blend
  }

  function fractal(x: number, y: number, time: number) {
    let value = 0
    let amplitude = 0.52
    for (let octave = 0; octave < 5; octave++) {
      const dx = octave % 2 === 0 ? 0.013 : -0.011
      const dy = octave % 2 === 0 ? -0.008 : 0.006
      value += noise(x + dx * time, y + dy * time, time * (0.028 + octave * 0.009)) * amplitude
      x = x * 2.03 + 17.1
      y = y * 2.03 + 9.2
      amplitude *= 0.48
    }
    return value
  }

  return {
    canvas,
    resize(width, height) {
      aspect = width / height
      sizeCanvas(canvas, width, height, 160)
      image = context?.createImageData(canvas.width, canvas.height)
      lastTime = -Infinity
    },
    draw(time) {
      if (!context || !image || time - lastTime < 1 / 12) return
      lastTime = time
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const u = x / canvas.width
          const v = y / canvas.height
          const sx = u * Math.max(1, aspect) + field.offsetX
          const sy = v * Math.max(1, 1 / aspect) + field.offsetY
          const broad = noise(sx * 1.6 + time * 0.007, sy * 1.6 - time * 0.004, time * 0.018)
          const warp = noise(sx * 2.4 + 31 - time * 0.009, sy * 2.4 + 13 + time * 0.006, time * 0.023)
          const cloud = fractal(sx * 3.8 + broad * 1.6, sy * 3.8 + warp * 1.6, time)
          const detail = noise(sx * 42 + warp * 4 + time * 0.02, sy * 42 + broad * 4 - time * 0.015, time * 0.045)
          const distance =
            v + field.slope * u - 1.2 + (cloud - 0.5) * 0.65 + (broad - 0.5) * 0.32 + (detail - 0.5) * 0.035
          const edge = Math.exp(-((distance + 0.055) ** 2) / 0.015) * (0.2 + cloud * 0.8) * (0.7 + detail * 0.3)
          const transition = Math.max(0, Math.min(1, (distance + 0.015) / 0.12))
          const shadow = transition * transition * (3 - 2 * transition) * 0.94
          const haze = Math.max(0, cloud * 1.3 - 0.12) * (0.4 + broad * 0.6)
          const vignette = 1 - Math.min(0.55, ((u - 0.5) ** 2 + (v - 0.45) ** 2) * 0.9)
          const grain = (field.values[((y & 255) << 8) | (x & 255)]! / 255 - 0.5) * 2.6
          const index = (y * canvas.width + x) * 4
          image.data[index] = ((8 + haze * 11 + edge * 4) * (1 - shadow) + 3 * shadow) * vignette + grain
          image.data[index + 1] = ((19 + haze * 24 + edge * 16) * (1 - shadow) + 7 * shadow) * vignette + grain
          image.data[index + 2] = ((32 + haze * 37 + edge * 29) * (1 - shadow) + 12 * shadow) * vignette + grain
          image.data[index + 3] = 255
        }
      }
      context.putImageData(image, 0, 0)
    },
    dispose() {
      image = undefined
    },
  }
}

export function createNebulaRenderer(seed: number) {
  const random = createRandom(seed)
  const field = {
    values: Uint8Array.from({ length: 256 * 256 }, () => Math.round(random() * 255)),
    offsetX: random() * 200,
    offsetY: random() * 200,
    slope: 0.92 + random() * 0.12,
  }
  return createGpuRenderer(field) ?? createCpuRenderer(field)
}

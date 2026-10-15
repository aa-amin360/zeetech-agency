/* Studio reel poster — a Three.js wave field of orange points that ripples
 * under the pointer. Returns { pulse, dispose }. */
import type * as ThreeNS from 'three'

export async function createWave(reel: HTMLElement, canvas: HTMLCanvasElement) {
  const THREE: typeof ThreeNS = await import('three')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let renderer: ThreeNS.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' })
  } catch {
    reel.classList.add('no-gl')
    return null
  }
  renderer.setClearColor(0x000000, 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 2.4, 7)
  camera.lookAt(0, -0.2, 0)

  const COLS = 180
  const ROWS = 80
  const W = 16
  const D = 8
  const pos = new Float32Array(COLS * ROWS * 3)
  const seed = new Float32Array(COLS * ROWS)
  for (let r = 0, k = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++, k++) {
      pos[k * 3] = (c / (COLS - 1) - 0.5) * W
      pos[k * 3 + 1] = 0
      pos[k * 3 + 2] = (r / (ROWS - 1) - 0.5) * D
      seed[k] = Math.random()
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))

  const uniforms = {
    uTime: { value: 2.5 },
    uPulse: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScale: { value: renderer.getPixelRatio() },
    uColorA: { value: new THREE.Color('#fd5600') },
    uColorB: { value: new THREE.Color('#fff7a3') },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uPulse, uScale;
      uniform vec2 uMouse;
      attribute float aSeed;
      varying float vH;
      varying float vFade;
      void main() {
        vec3 p = position;
        float w = sin(p.x * 0.55 + uTime * 0.8) * 0.32
                + sin(p.z * 0.9 - uTime * 0.6) * 0.22
                + sin((p.x + p.z) * 0.35 + uTime * 0.45) * 0.28;
        float d = distance(p.xz, uMouse);
        w += exp(-d * d * 0.5) * 0.55 * (0.6 + 0.4 * sin(uTime * 3.0 - d * 3.0));
        float r = length(p.xz);
        w += uPulse * sin(r * 2.4 - uTime * 7.0) * exp(-r * 0.22) * 0.7;
        p.y += w;
        vH = w;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uScale * (2.0 + aSeed * 1.4) * (7.0 / -mv.z);
        vFade = smoothstep(15.0, 4.0, -mv.z) * smoothstep(8.2, 5.5, abs(p.x));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColorA, uColorB;
      varying float vH;
      varying float vFade;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        vec3 col = mix(uColorA, uColorB, clamp(vH * 0.9 + 0.35, 0.0, 1.0));
        gl_FragColor = vec4(col, a * vFade);
      }`,
  })
  scene.add(new THREE.Points(geometry, material))

  let running = false
  let raf = 0
  let last = 0
  let visible = false

  const resize = () => {
    const w = reel.clientWidth
    const h = reel.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w / h < 1.4 ? 58 : 42
    camera.updateProjectionMatrix()
    if (!running) renderer.render(scene, camera)
  }

  const target = new THREE.Vector2(0, 0)
  const onMove = (e: PointerEvent) => {
    const b = reel.getBoundingClientRect()
    target.set(((e.clientX - b.left) / b.width - 0.5) * W * 0.8, ((e.clientY - b.top) / b.height - 0.5) * D)
  }
  const onLeave = () => target.set(0, 0)
  reel.addEventListener('pointermove', onMove, { passive: true })
  reel.addEventListener('pointerleave', onLeave)

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    uniforms.uTime.value += dt
    uniforms.uPulse.value *= Math.exp(-dt * 1.2)
    uniforms.uMouse.value.lerp(target, 1 - Math.exp(-dt * 4))
    renderer.render(scene, camera)
    raf = requestAnimationFrame(frame)
  }
  const run = () => {
    if (running || reduceMotion) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const halt = () => {
    running = false
    cancelAnimationFrame(raf)
  }
  const update = () => (visible && !document.hidden ? run() : halt())

  const ro = new ResizeObserver(resize)
  ro.observe(reel)
  const io = new IntersectionObserver((en) => {
    visible = en[0].isIntersecting
    update()
  })
  io.observe(reel)
  document.addEventListener('visibilitychange', update)
  resize()
  renderer.render(scene, camera)

  return {
    pulse() {
      uniforms.uPulse.value = 1.4
      if (reduceMotion) renderer.render(scene, camera)
    },
    dispose() {
      halt()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
      reel.removeEventListener('pointermove', onMove)
      reel.removeEventListener('pointerleave', onLeave)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}

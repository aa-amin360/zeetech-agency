/* Falling cherry-blossom petals over the page hero picture.
 * Each petal drifts down on a breeze, sways side to side and tumbles (its width follows the
 * cosine of a flip angle, so it seems to turn in 3D). Petals further away are smaller, paler,
 * softer and slower. Moving the pointer across the hero stirs the ones nearby.
 * Pauses while off screen, and doesn't start at all for visitors who ask for reduced motion.
 * Performance level (src/lib/perf.ts): mid → half as many petals and no blur; low → none.
 * Returns a cleanup function.
 */

type Petal = {
  x: number
  y: number
  z: number // 0 far … 1 near
  size: number
  vy: number
  sway: number // sway amplitude, px
  phase: number
  freq: number
  rot: number
  vrot: number
  flip: number
  vflip: number
  vx: number // push from the pointer
  tint: number // 0 white-pink … 1 deeper pink
}

import { onPerfChange, perfLevel, type PerfLevel } from '@/lib/perf'

const COLORS = [
  ['#fff4f7', '#ffc9d8'],
  ['#ffe3ec', '#ffa9c2'],
  ['#ffd2e0', '#f68aab'],
]

export function initPetals(canvas: HTMLCanvasElement, host: HTMLElement): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || perfLevel() === 'low') return () => {}
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  let W = 0
  let H = 0
  let dpr = 1
  let petals: Petal[] = []
  let raf = 0
  let running = false
  let last = performance.now()
  let wind = 0
  let t = 0
  let level: PerfLevel = perfLevel()

  const spawn = (p: Partial<Petal> = {}): Petal => {
    const z = Math.random() ** 1.4
    return {
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.3,
      z,
      size: 7 + z * 11,
      vy: 22 + z * 40,
      sway: 14 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      freq: 0.6 + Math.random() * 0.9,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 1.6,
      flip: Math.random() * Math.PI * 2,
      vflip: 1.2 + Math.random() * 2.2,
      vx: 0,
      tint: Math.random(),
      ...p,
    }
  }

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = host.clientWidth
    H = host.clientHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // about one petal per 14 000 px², fewer on small screens
    const full = Math.min(90, Math.max(22, (W * H) / 14000))
    const want = Math.round(level === 'high' ? full : full / 2)
    if (petals.length > want) petals.length = want
    while (petals.length < want) petals.push(spawn({ y: Math.random() * H }))
  }

  // a single blossom petal: rounded body with the little notch at the tip
  const drawPetal = (p: Petal) => {
    const s = p.size
    const squash = Math.cos(p.flip) // tumbling: the petal narrows as it turns edge-on
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.scale(Math.max(0.12, Math.abs(squash)), 1)
    ctx.globalAlpha = 0.55 + p.z * 0.45
    const [light, deep] = COLORS[Math.min(2, Math.floor(p.tint * 3))]
    const g = ctx.createLinearGradient(0, -s, 0, s)
    g.addColorStop(0, squash > 0 ? light : deep)
    g.addColorStop(1, squash > 0 ? deep : light)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(0, s)
    ctx.bezierCurveTo(s * 0.95, s * 0.45, s * 0.75, -s * 0.75, s * 0.18, -s * 0.95)
    ctx.lineTo(0, -s * 0.72)
    ctx.lineTo(-s * 0.18, -s * 0.95)
    ctx.bezierCurveTo(-s * 0.75, -s * 0.75, -s * 0.95, s * 0.45, 0, s)
    ctx.fill()
    ctx.restore()
  }

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    t += dt
    // a gentle breeze that rises and falls
    wind = 18 * Math.sin(t * 0.23) + 10 * Math.sin(t * 0.61 + 1.3)
    ctx.clearRect(0, 0, W, H)
    // far petals first, so near ones pass in front
    petals.sort((a, b) => a.z - b.z)
    for (const p of petals) {
      p.phase += p.freq * dt
      p.rot += p.vrot * dt
      p.flip += p.vflip * dt
      p.vx *= Math.exp(-dt * 1.8)
      p.y += p.vy * dt
      p.x += (wind * (0.4 + p.z) + p.vx) * dt + Math.cos(p.phase) * p.sway * dt
      if (p.y > H + 30 || p.x < -60 || p.x > W + 60) Object.assign(p, spawn({ x: Math.random() * (W + 120) - 60 }))
      // far petals a touch out of focus (a canvas blur is slow, so only on the top level)
      if (level === 'high') ctx.filter = p.z < 0.35 ? 'blur(1.2px)' : 'none'
      drawPetal(p)
    }
    if (level === 'high') ctx.filter = 'none'
    raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  // the pointer stirs the petals near it
  let px = -1e4
  let py = -1e4
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const dx = px > -1e3 ? x - px : 0
    px = x
    py = y
    for (const p of petals) {
      const d = Math.hypot(p.x - x, p.y - y)
      if (d < 140) {
        const f = (1 - d / 140) * (0.5 + p.z)
        p.vx += dx * 6 * f + Math.sign(p.x - x || 1) * 40 * f
        p.vrot += (Math.random() - 0.5) * 2 * f
      }
    }
  }
  const onLeave = () => {
    px = -1e4
    py = -1e4
  }

  let visible = false
  const update = () => (visible && !document.hidden ? start() : stop())
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    update()
  })
  const ro = new ResizeObserver(resize)
  resize()
  io.observe(host)
  ro.observe(host)
  document.addEventListener('visibilitychange', update)
  host.addEventListener('pointermove', onMove, { passive: true })
  host.addEventListener('pointerleave', onLeave)
  const stopPerf = onPerfChange((next) => {
    level = next
    ctx.filter = 'none'
    if (next === 'low') {
      stop()
      visible = false
      io.disconnect()
      ctx.clearRect(0, 0, W, H)
    } else resize()
  })

  return () => {
    stop()
    stopPerf()
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', update)
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerleave', onLeave)
    ctx.clearRect(0, 0, W, H)
  }
}

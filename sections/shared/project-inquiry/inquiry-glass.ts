/* Project inquiry backdrop: the artwork's fluted glass, brought to life
 * Draws /brand/inquiry-bg.jpg exactly as designed. Its left half is a red swirl seen through
 * vertical glass ribs (baked into the picture); here those ribs move like the hero's: each one
 * keeps tilting, sliding the swirl behind it sideways and up/down in waves, a band of light
 * sweeps across, and the ribs near the mouse or a finger lean away, then settle. The swirl is only ever moved in whole-rib steps (blended), so the
 * picture's own rib lines stay put and nothing warps. The smooth red right half stays still.
 * The JPG stays as the card's CSS background until the first frame, and without WebGL.
 * Returns a cleanup function.
 */

import { onPerfChange, perfLevel } from '@/lib/perf'

const SRC = '/brand/inquiry-bg.jpg'
// the picture: 1024 × 585; its ribs are 17.2px apart starting at x = 15, the glass ends at 512
const ART_W = 1024
const ART_H = 585

const VERT = `
  attribute vec2 aPos;
  void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
  precision highp float;
  uniform sampler2D uImg;
  uniform vec2  uRes;       // canvas size, px
  uniform vec4  uRect;      // where the picture sits: x, y, w, h in canvas px (top-left origin)
  uniform float uTime;
  uniform float uMouseX;    // canvas px
  uniform float uMouseStr;

  const vec2  ART   = vec2(${ART_W}.0, ${ART_H}.0);
  const float P     = 17.215;  // rib spacing, picture px
  const float PH    = 15.0;    // first rib edge, picture px
  const float GLASS = 505.0;   // the glass ends here (picture px); right of it is the red field

  vec3 art(vec2 ip){ return texture2D(uImg, clamp(ip, vec2(0.5), ART - 0.5) / ART).rgb; }

  void main(){
    vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    float scale = uRect.z / ART.x;                 // canvas px per picture px
    vec2 ip = (px - uRect.xy) / scale;             // picture px

    // outside the picture: the card's base colour, as in the CSS (stacked layout, below it)
    if (ip.y < 0.0 || ip.y > ART.y || ip.x < 0.0 || ip.x > ART.x) {
      gl_FragColor = vec4(0.071, 0.024, 0.027, 1.0);
      return;
    }
    // right half: the smooth red field, untouched
    if (ip.x >= GLASS) { gl_FragColor = vec4(art(ip), 1.0); return; }

    // which rib, and where across it (-1..1)
    float ri = floor((ip.x - PH) / P);
    float u  = fract((ip.x - PH) / P) * 2.0 - 1.0;
    float cx = (PH + (ri + 0.5) * P) * scale + uRect.x;   // rib centre, canvas px

    // its tilt: slow waves running across the ribs, plus a lean away from the pointer
    float t  = uTime;
    float th = 0.55 * sin(t * 0.62 - ri * 0.21) + 0.25 * sin(t * 0.27 + ri * 0.083 + 1.7);
    float md = (cx - uMouseX) / (P * scale * 5.0);
    th += uMouseStr * 1.6 * md * exp(-md * md);
    th = clamp(th, -1.2, 1.2);

    // the tilt slides the swirl behind this rib sideways, in whole-rib steps blended together,
    // so the picture's own rib lines stay where they are
    float sh = sin(th) * 1.6;                      // in ribs
    float n0 = floor(sh);
    float f  = smoothstep(0.0, 1.0, sh - n0);
    // each rib also lifts or lowers the swirl a little, in a wave across the glass
    // (vertical moves never break the vertical rib lines)
    float vy = 14.0 * sin(t * 0.45 - ri * 0.32) + 6.0 * sin(t * 0.21 + ri * 0.13 + 0.8)
             + 18.0 * uMouseStr * md * exp(-md * md);
    vec2 a = vec2(ip.x + n0 * P, ip.y + vy);
    vec2 b = vec2(ip.x + (n0 + 1.0) * P, ip.y + vy);
    // keep the samples on the glass side (step back by whole ribs)
    a.x -= P * max(0.0, ceil((a.x - GLASS + 2.0) / P));
    b.x -= P * max(0.0, ceil((b.x - GLASS + 2.0) / P));
    a.x += P * max(0.0, ceil((PH - a.x) / P));
    b.x += P * max(0.0, ceil((PH - b.x) / P));
    vec3 col = mix(art(a), art(b), f);

    // light on the turning glass: the side facing the light brightens, the other dims,
    // with a thin glint on strongly tilted ribs
    float lit = sin(th) * u;
    col *= 1.0 + 0.35 * lit;
    col += vec3(1.0, 0.45, 0.4) * pow(max(0.0, lit), 6.0) * 0.12 * abs(sin(th));

    // a soft band of light sweeps across the glass every few seconds
    float ribs = (GLASS - PH) / P;
    float sweep = mod(t * 3.2, ribs + 16.0) - 8.0;
    float band = exp(-pow((ri - sweep) / 3.5, 2.0));
    col *= 1.0 + 0.32 * band;
    col += vec3(0.9, 0.25, 0.2) * band * 0.05 * (1.0 - abs(u));

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`

export function initInquiryGlass(canvas: HTMLCanvasElement, card: HTMLElement): () => void {
  // lowest performance level: the still artwork (the card's CSS background) stays
  if (perfLevel() === 'low') return () => {}
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const SPEED = reduceMotion ? 0.3 : 1.0
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false })
  if (!gl) return () => {}

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader')
    return sh
  }
  const prog = gl.createProgram()!
  try {
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link')
  } catch (e) {
    console.error(e)
    return () => {}
  }
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const U: Record<string, WebGLUniformLocation | null> = {}
  ;['uImg', 'uRes', 'uRect', 'uTime', 'uMouseX', 'uMouseStr'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)))
  gl.uniform1i(U.uImg, 0)

  const stacked = window.matchMedia('(max-width: 900px)')
  let dpr = 1
  let running = false
  let rafId = 0
  let ready = false

  const resize = () => {
    dpr = perfLevel() === 'high' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1
    const W = Math.max(1, Math.round(canvas.clientWidth * dpr))
    const H = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W
      canvas.height = H
    }
    gl.viewport(0, 0, W, H)
    gl.uniform2f(U.uRes, W, H)
    // placed like the CSS background in project-inquiry.css
    if (stacked.matches) {
      const h = H * 0.6 // 30% 0 / auto 60%
      const w = (ART_W * h) / ART_H
      gl.uniform4f(U.uRect, (W - w) * 0.3, 0, w, h)
    } else {
      // as in Figma (689:3622): the picture is 112.37% × 110.93% of the card, so the glass ends
      // and the red begins at 47.7% of the card's width, just where the gradient starts
      const sc = Math.max((1.1237 * W) / ART_W, (1.1093 * H) / ART_H)
      const w = ART_W * sc
      const h = ART_H * sc
      gl.uniform4f(U.uRect, Math.min(0, 0.4769 * W - 0.5 * w), (H - h) * 0.49, w, h)
    }
    if (ready && !running) draw()
  }

  // mouse or finger: the ribs near it lean away, then settle back
  let mouseX = -1e5
  let mouseTargetX = -1e5
  let mouseStr = 0
  let mouseStrTarget = 0
  let lastMove = 0
  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    mouseTargetX = (e.clientX - rect.left) * dpr
    if (mouseX < -1e4) mouseX = mouseTargetX
    mouseStrTarget = 1
    lastMove = performance.now()
  }
  const onLeave = () => (mouseStrTarget = 0)
  card.addEventListener('pointermove', onMove, { passive: true })
  card.addEventListener('pointerdown', onMove, { passive: true })
  card.addEventListener('pointerleave', onLeave)

  let time = 12.0
  let last = performance.now()
  function draw() {
    gl!.uniform1f(U.uTime, time)
    gl!.uniform1f(U.uMouseX, mouseX)
    gl!.uniform1f(U.uMouseStr, reduceMotion ? mouseStr * 0.4 : mouseStr)
    gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    if (!canvas.classList.contains('is-live')) canvas.classList.add('is-live')
  }
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    time += dt * SPEED
    if (now - lastMove > 1400) mouseStrTarget = 0
    const kx = 1 - Math.exp(-dt * 7)
    const ks = 1 - Math.exp(-dt * (mouseStrTarget > mouseStr ? 4 : 1.6))
    mouseX += (mouseTargetX - mouseX) * kx
    mouseStr += (mouseStrTarget - mouseStr) * ks
    draw()
    rafId = requestAnimationFrame(frame)
  }
  const kick = () => {
    if (running || !ready) return
    running = true
    last = performance.now()
    rafId = requestAnimationFrame(frame)
  }
  const halt = () => {
    running = false
    cancelAnimationFrame(rafId)
  }

  // only animate while the card is on screen and the tab is visible
  let visible = false
  let off = false // switched off after the level dropped to low
  const updateRunning = () => (visible && !document.hidden && !off ? kick() : halt())
  const stopPerf = onPerfChange((level) => {
    if (level !== 'low') return resize()
    off = true
    halt()
    canvas.classList.remove('is-live')
  })

  const img = new Image()
  let tex: WebGLTexture | null = null
  img.onload = () => {
    tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
    ready = true
    resize()
    updateRunning()
  }
  img.src = SRC

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    updateRunning()
  })
  io.observe(canvas)
  document.addEventListener('visibilitychange', updateRunning)
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  stacked.addEventListener('change', resize)
  resize()

  return () => {
    halt()
    stopPerf()
    img.onload = null
    io.disconnect()
    ro.disconnect()
    stacked.removeEventListener('change', resize)
    document.removeEventListener('visibilitychange', updateRunning)
    card.removeEventListener('pointermove', onMove)
    card.removeEventListener('pointerdown', onMove)
    card.removeEventListener('pointerleave', onLeave)
    canvas.classList.remove('is-live')
    // free GPU objects but keep the context: React may set this up again on the same canvas
    gl.deleteBuffer(buf)
    gl.deleteProgram(prog)
    if (tex) gl.deleteTexture(tex)
  }
}

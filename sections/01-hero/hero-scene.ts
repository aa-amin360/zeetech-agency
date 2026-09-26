/* Hero scene (ported from the static build)
 * 1. Rotated collage — every column rolls forever; scroll adds momentum,
 *    mouse / pen drag grabs and flings it
 * 2. Fluted-glass WebGL backdrop with a palette that cycles
 * 3. Backdrop studio — swatches, play/pause and the progress ring
 * Returns a cleanup function.
 */

export type HeroTile = { src: string; srcSet?: string; tone: string }

const PALETTES = [
  { name: 'Solstice', stops: ['#f7b52c', '#f6cc1d', '#f4861f', '#f14a4d', '#f45aa6', '#eaa2ea'] },
  { name: 'Lagoon', stops: ['#2dd4bf', '#22c7ee', '#3b9cf8', '#6366f1', '#a855f7', '#f0abfc'] },
  { name: 'Aurora', stops: ['#34d399', '#a3e635', '#fde047', '#fb7185', '#c084fc', '#93c5fd'] },
  { name: 'Ember', stops: ['#fdd66a', '#f59e0b', '#ea580c', '#dc2626', '#be185d', '#8b5cf6'] },
  { name: 'Iris', stops: ['#93c5fd', '#818cf8', '#a78bfa', '#e879f9', '#fb7185', '#fdba74'] },
]

const VERT = `
  attribute vec2 aPos;
  void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
  precision highp float;
  uniform vec2  uRes;
  uniform float uTime;
  uniform float uBarW;
  uniform float uOffset;
  uniform vec2  uMouse;
  uniform float uMouseStr;
  uniform vec3  uA[6];
  uniform vec3  uB[6];
  uniform float uMix;
  uniform vec3  uBase;

  vec3 palette(float t){
    t = clamp(t, 0.0, 1.0) * 4.9999;
    float fi = floor(t);
    float f = t - fi;
    f = f * f * (3.0 - 2.0 * f);
    vec3 c0 = vec3(0.0), c1 = vec3(0.0);
    for (int k = 0; k < 6; k++) {
      vec3 c = mix(uA[k], uB[k], uMix);
      float fk = float(k);
      if (fk == fi)       c0 = c;
      if (fk == fi + 1.0) c1 = c;
    }
    return mix(c0, c1, f);
  }

  vec3 scene(vec2 q){
    float t = uTime;
    float x = q.x, y = q.y;
    float flow = 0.035 * sin(t * 0.19 + y * 4.0) + 0.05 * sin(t * 0.07);
    vec3 col = palette(x + flow);

    float cx = 0.40 + 0.07 * sin(t * 0.13);
    float wx = 0.60 + 0.06 * sin(t * 0.21 + 1.3);
    float dx = (x - cx) / wx;

    float hy = (0.14 + 0.025 * sin(t * 0.29)) * mix(1.08, 0.78, smoothstep(0.35, 1.0, x));
    float yy = y + 0.018 * sin(x * 7.0 + t * 0.45);
    float dy = yy / hy;

    float m = exp(-dx * dx * 1.5 - dy * dy * 1.35);
    m = min(1.0, pow(m, 0.8) * 1.18);
    return mix(uBase, col, m);
  }

  const vec3 L = vec3(-0.6, 0.35, 0.75);

  vec3 shade(float xpx, float ypx){
    float bw  = uBarW;
    float gx  = xpx - uOffset;
    float fi  = floor(gx / bw);
    float u   = fract(gx / bw) * 2.0 - 1.0;
    float cxp = (fi + 0.5) * bw + uOffset;

    float t  = uTime;
    float th = 0.52 * sin(t * 0.62 - fi * 0.21)
             + 0.22 * sin(t * 0.27 + fi * 0.083 + 1.7);
    float md = (cxp - uMouse.x) / (bw * 5.0);
    th += uMouseStr * 1.5 * md * exp(-md * md);
    th = clamp(th, -1.25, 1.25);

    float c = cos(th), s = sin(th);
    const float T = 0.34;
    float E  = c + T * abs(s);
    float xp = u * E;
    float frontC = T * s;
    float lx = (xp - frontC) / c;
    float pxW = 2.0 * E / bw;
    float face = 1.0 - smoothstep(c - pxW, c + pxW, abs(xp - frontC));

    vec3 Ld = normalize(L);
    vec3 H  = normalize(Ld + vec3(0.0, 0.0, 1.0));
    float yN = (ypx - 0.5 * uRes.y) / uRes.y;

    float lxc = clamp(lx, -1.0, 1.0);
    float phi = asin(lxc * 0.9);
    float a   = phi + th;
    vec3  N   = vec3(sin(a), 0.0, cos(a));

    float refr  = sin(a);
    float baseX = cxp + bw * 0.5 * lxc * 0.3;
    float k     = bw * 1.55;
    float sy    = 1.0 + 0.22 * (1.0 - cos(a)) + 0.06 * sin(a);
    float yC    = yN * sy;

    vec3 fc;
    fc.r = scene(vec2((baseX + refr * k * 1.035) / uRes.x, yC)).r;
    fc.g = scene(vec2((baseX + refr * k)         / uRes.x, yC)).g;
    fc.b = scene(vec2((baseX + refr * k * 0.965) / uRes.x, yC * 1.004)).b;

    float dif   = clamp(dot(N, Ld), 0.0, 1.0);
    float fres  = pow(1.0 - clamp(N.z, 0.0, 1.0), 4.0);
    float nh    = clamp(dot(N, H), 0.0, 1.0);
    float spec  = pow(nh, 90.0);
    float spec2 = pow(nh, 900.0);

    const vec3 TINT = vec3(0.925, 0.905, 0.965);
    fc *= mix(TINT, vec3(1.0), 0.45 + 0.55 * dif);
    fc  = mix(fc, vec3(1.0), fres * 0.55);
    fc += spec * 0.18 + spec2 * 0.45;
    fc *= mix(vec3(1.0), TINT, smoothstep(0.55, 1.0, lxc) * 0.6);

    float side = s < 0.0 ? 1.0 : -1.0;
    vec3  Ns   = vec3(side * c, 0.0, abs(s));
    float sx   = cxp + side * bw * 1.1;
    vec3  sc   = scene(vec2(sx / uRes.x, yN * 1.12));
    float sdif = clamp(dot(Ns, Ld), 0.0, 1.0);
    float dpt  = clamp((abs(xp - frontC) - c) / max(2.0 * T * abs(s), 1e-3), 0.0, 1.0);
    vec3  sideCol = sc * mix(TINT * 0.94, vec3(1.0), 0.35 + 0.4 * sdif) * (1.0 - 0.04 * dpt);
    sideCol = mix(sideCol, vec3(1.0), 0.10 * (1.0 - dpt));

    vec3 col = mix(sideCol, fc, face);
    col *= mix(vec3(1.0), TINT, 0.55 * smoothstep(0.86, 1.0, abs(u)));
    return col;
  }

  void main(){
    vec2 p = gl_FragCoord.xy;
    vec3 col = 0.5 * (shade(p.x - 0.25, p.y) + shade(p.x + 0.25, p.y));
    float n = fract(sin(dot(p, vec2(12.9898, 78.233)) + fract(uTime) * 7.0) * 43758.5453);
    col += (n - 0.5) * (1.5 / 255.0);
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`

export function initHero(hero: HTMLElement, tiles: HeroTile[]): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const abort = new AbortController()
  const on = <K extends keyof WindowEventMap>(
    target: Window | Document | HTMLElement,
    type: K | string,
    fn: (e: any) => void,
    opts: AddEventListenerOptions = {},
  ) => target.addEventListener(type, fn, { ...opts, signal: abort.signal })
  const cleanups: (() => void)[] = []

  /* =========================================================
     Collage — tiles are appended in whole sets so the loop is seamless
     ========================================================= */
  const TILE = 300
  const GAP = 8
  const columns = [...hero.querySelectorAll<HTMLElement>('.collage__col')]
  const columnTiles = columns.map((_, c) => {
    if (!tiles.length) return []
    const shift = (c * Math.ceil(tiles.length / 3)) % tiles.length
    const list = [...tiles.slice(shift), ...tiles.slice(0, shift)]
    return c === 1 ? list.reverse() : list
  })
  const setHeight = (c: number) => Math.max(1, columnTiles[c]?.length || 1) * (TILE + GAP)

  const buildTile = (tile: HeroTile) => {
    const fig = document.createElement('figure')
    fig.className = `ph ph--${tile.tone}`
    const img = document.createElement('img')
    img.src = tile.src
    if (tile.srcSet) {
      img.srcset = tile.srcSet
      img.sizes = '(max-width: 900px) 34vw, 16vw'
    }
    img.alt = ''
    img.decoding = 'async'
    img.draggable = false
    fig.appendChild(img)
    return fig
  }

  const fillColumns = (panelDesignH: number) => {
    columns.forEach((col, c) => {
      const list = columnTiles[c]
      if (!list?.length) return
      const needSets = Math.max(2, Math.ceil(panelDesignH / setHeight(c) + 0.05) + 1)
      let have = Number(col.dataset.sets || 0)
      if (have >= needSets) return
      const frag = document.createDocumentFragment()
      for (; have < needSets; have++) list.forEach((t) => frag.appendChild(buildTile(t)))
      col.appendChild(frag)
      col.dataset.sets = String(have)
    })
  }
  fillColumns(1500)

  ;(() => {
    const panel = hero.querySelector<HTMLElement>('.collage__panel')
    if (!panel || !columns.length) return

    const ANGLE = (17.98 * Math.PI) / 180
    const AX = -Math.sin(ANGLE)
    const AY = Math.cos(ANGLE)
    const CRUISE = 34 // design px / second
    const SPEEDS = [1.0, -0.82, 1.18]

    const state = columns.map((el, i) => ({ el, mult: SPEEDS[i % SPEEDS.length], pos: 0, loop: 1 }))

    let unit = 1
    const measure = () => {
      unit = panel.offsetWidth / 900 || 1
      fillColumns(panel.offsetHeight / unit)
      state.forEach((s, i) => {
        const prevLoop = s.loop
        s.loop = Math.max(1, setHeight(i) * unit)
        s.pos = prevLoop > 1 ? (s.pos / prevLoop) * s.loop : s.loop * [0.18, 0.55, 0.79][i % 3]
      })
    }

    let boost = 0
    let dragging = false
    let dragId: number | null = null
    let lastPt = { x: 0, y: 0 }
    let dragVel = 0
    let lastDragT = 0

    let lastScrollY = window.scrollY
    on(
      window,
      'scroll',
      () => {
        const dy = window.scrollY - lastScrollY
        lastScrollY = window.scrollY
        boost = Math.max(-2400, Math.min(2400, boost + dy * 6))
      },
      { passive: true },
    )

    on(panel, 'pointerdown', (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return
      dragging = true
      dragId = e.pointerId
      lastPt = { x: e.clientX, y: e.clientY }
      lastDragT = performance.now()
      dragVel = 0
      boost = 0
      panel.setPointerCapture(e.pointerId)
      panel.classList.add('is-dragging')
    })
    on(panel, 'pointermove', (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragId) return
      const now = performance.now()
      const dx = e.clientX - lastPt.x
      const dy = e.clientY - lastPt.y
      lastPt = { x: e.clientX, y: e.clientY }
      const along = dx * AX + dy * AY
      state.forEach((s) => (s.pos -= along * Math.sign(s.mult)))
      const dt = Math.max(1, now - lastDragT) / 1000
      lastDragT = now
      dragVel = dragVel * 0.6 + (-along / dt / unit) * 0.4
    })
    const endDrag = (e?: PointerEvent) => {
      if (!dragging || (e && e.pointerId !== dragId)) return
      dragging = false
      panel.classList.remove('is-dragging')
      boost = Math.max(-3000, Math.min(3000, dragVel))
    }
    on(panel, 'pointerup', endDrag)
    on(panel, 'pointercancel', endDrag)
    on(panel, 'lostpointercapture', endDrag)

    let running = false
    let raf = 0
    let last = 0
    let visible = true
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const paused = hero.classList.contains('is-paused') || reduceMotion
      const cruise = paused ? 0 : CRUISE
      if (!dragging) {
        boost *= Math.exp(-dt * 2.2)
        if (Math.abs(boost) < 0.5) boost = 0
        state.forEach((s) => (s.pos += (cruise * s.mult + boost * Math.sign(s.mult)) * unit * dt))
      }
      state.forEach((s) => {
        const y = ((s.pos % s.loop) + s.loop) % s.loop
        s.el.style.transform = `translate3d(0, ${(-y).toFixed(2)}px, 0)`
      })
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const update = () => (visible && !document.hidden ? start() : stop())

    const ro = new ResizeObserver(measure)
    ro.observe(panel)
    const io = new IntersectionObserver((en) => {
      visible = en[0].isIntersecting
      update()
    })
    io.observe(hero)
    on(document, 'visibilitychange', update)
    measure()
    start()
    cleanups.push(() => {
      stop()
      ro.disconnect()
      io.disconnect()
    })
  })()

  /* =========================================================
     Fluted glass background
     ========================================================= */
  ;(() => {
    const BASE = [0.992, 0.98, 0.996]
    const CYCLE_MS = 9000
    const FADE_MS = 2600
    const SPEED = reduceMotion ? 0.3 : 1.0

    const hexToRgb = (h: string) => {
      const n = parseInt(h.slice(1), 16)
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
    }
    const flat = (p: (typeof PALETTES)[number]) => new Float32Array(p.stops.flatMap(hexToRgb))

    const canvas = hero.querySelector<HTMLCanvasElement>('.hero__bg')
    const gl =
      canvas &&
      canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      })
    if (!canvas || !gl) {
      hero.classList.add('no-gl')
      return
    }

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
      hero.classList.add('no-gl')
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const U: Record<string, WebGLUniformLocation | null> = {}
    ;['uRes', 'uTime', 'uBarW', 'uOffset', 'uMouse', 'uMouseStr', 'uA', 'uB', 'uMix', 'uBase'].forEach(
      (n) => (U[n] = gl.getUniformLocation(prog, n)),
    )
    gl.uniform3fv(U.uBase, BASE)

    let running = false
    let rafId = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = hero.getBoundingClientRect()
      const cw = Math.max(1, rect.width)
      const ch = Math.max(1, rect.height)
      const W = Math.round(cw * dpr)
      const H = Math.round(ch * dpr)
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W
        canvas.height = H
      }
      gl.viewport(0, 0, W, H)
      // ~48px flutes at 1920 (matches the Figma backdrop), 18px minimum
      const barCss = Math.min(48, Math.max(18, cw / 40))
      const bw = Math.max(8, Math.round(barCss * dpr))
      gl.uniform2f(U.uRes, W, H)
      gl.uniform1f(U.uBarW, bw)
      gl.uniform1f(U.uOffset, Math.round((W % bw) / 2))
      if (!running) draw()
    }
    const ro = new ResizeObserver(resize)

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
    on(hero, 'pointermove', onMove, { passive: true })
    on(hero, 'pointerdown', onMove, { passive: true })
    on(hero, 'pointerleave', () => (mouseStrTarget = 0))

    let fromArr = flat(PALETTES[0])
    let toIdx = 0
    let fadeStart = -1
    let lastSwitch = performance.now()
    gl.uniform3fv(U.uA, fromArr)
    gl.uniform3fv(U.uB, fromArr)
    gl.uniform1f(U.uMix, 0)

    const label = hero.querySelector('.studio__name')
    const swatchWrap = hero.querySelector('.studio__swatches')
    const ring = hero.querySelector<HTMLElement>('.studio__ring-bar')
    const swatches = PALETTES.map((p, i) => {
      const b = document.createElement('button')
      b.className = 'swatch'
      b.type = 'button'
      b.title = p.name
      b.setAttribute('aria-label', `${p.name} backdrop`)
      b.style.background = `linear-gradient(135deg, ${p.stops.join(', ')})`
      on(b, 'click', () => goTo(i))
      swatchWrap?.appendChild(b)
      return b
    })
    cleanups.push(() => swatches.forEach((b) => b.remove()))
    const syncUI = (i: number) => {
      swatches.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)))
      if (label) label.textContent = PALETTES[i].name
    }
    syncUI(0)

    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
    const currentMix = () => (fadeStart < 0 ? 0 : ease(Math.min(1, (performance.now() - fadeStart) / FADE_MS)))

    function goTo(i: number) {
      if (i === toIdx && fadeStart < 0) return
      const m = currentMix()
      const a = fromArr
      const b = flat(PALETTES[toIdx])
      const blended = new Float32Array(18)
      for (let k = 0; k < 18; k++) blended[k] = a[k] + (b[k] - a[k]) * m
      gl!.uniform3fv(U.uA, blended)
      fromArr = blended
      gl!.uniform3fv(U.uB, flat(PALETTES[i]))
      toIdx = i
      fadeStart = performance.now()
      lastSwitch = fadeStart
      syncUI(i)
      if (!running) kick()
    }

    let playing = true
    let pausedProgress = 0
    const toggle = hero.querySelector<HTMLButtonElement>('.studio__toggle')
    const setPlaying = (v: boolean) => {
      playing = v
      hero.classList.toggle('is-paused', !v)
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(!v))
        toggle.setAttribute('aria-label', v ? 'Pause motion' : 'Play motion')
      }
      if (v) lastSwitch = performance.now() - pausedProgress * CYCLE_MS
    }
    if (toggle) on(toggle, 'click', () => setPlaying(!playing))

    let heroVisible = true
    on(window, 'keydown', (e: KeyboardEvent) => {
      if (!heroVisible) return
      const t = e.target as HTMLElement | null
      const tag = t?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return
      if ((tag === 'BUTTON' || tag === 'A') && (e.code === 'Space' || e.code === 'Enter')) return
      if (e.code === 'Space') {
        e.preventDefault()
        setPlaying(!playing)
      }
      if (e.code === 'ArrowRight') goTo((toIdx + 1) % PALETTES.length)
      if (e.code === 'ArrowLeft') goTo((toIdx - 1 + PALETTES.length) % PALETTES.length)
    })

    const dock = hero.querySelector('.studio')
    let idleTimer = 0
    const wake = () => {
      if (!dock) return
      dock.classList.remove('idle')
      clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => dock.classList.add('idle'), 2800)
    }
    on(hero, 'pointermove', wake, { passive: true })
    wake()
    cleanups.push(() => clearTimeout(idleTimer))

    let time = 12.0
    let last = performance.now()
    function draw() {
      gl!.uniform1f(U.uTime, time)
      gl!.uniform2f(U.uMouse, mouseX, 0)
      gl!.uniform1f(U.uMouseStr, reduceMotion ? mouseStr * 0.4 : mouseStr)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    }
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (playing) time += dt * SPEED

      if (fadeStart < 0) {
        const prog = Math.min(1, (now - lastSwitch) / CYCLE_MS)
        if (playing) pausedProgress = prog
        ring?.style.setProperty('--p', (playing ? prog : pausedProgress).toFixed(4))
        if (playing && prog >= 1) goTo((toIdx + 1) % PALETTES.length)
      } else {
        ring?.style.setProperty('--p', '0')
      }

      if (fadeStart >= 0) {
        const m = currentMix()
        gl!.uniform1f(U.uMix, m)
        if (m >= 1) {
          const f = flat(PALETTES[toIdx])
          gl!.uniform3fv(U.uA, f)
          gl!.uniform3fv(U.uB, f)
          fromArr = f
          gl!.uniform1f(U.uMix, 0)
          fadeStart = -1
          lastSwitch = now
          pausedProgress = 0
        }
      }

      if (now - lastMove > 1400) mouseStrTarget = 0
      const kx = 1 - Math.exp(-dt * 7)
      const ks = 1 - Math.exp(-dt * (mouseStrTarget > mouseStr ? 4 : 1.6))
      mouseX += (mouseTargetX - mouseX) * kx
      mouseStr += (mouseStrTarget - mouseStr) * ks

      draw()
      rafId = requestAnimationFrame(frame)
    }
    function kick() {
      if (running) return
      running = true
      last = performance.now()
      rafId = requestAnimationFrame(frame)
    }
    const halt = () => {
      running = false
      cancelAnimationFrame(rafId)
    }
    const updateRunning = () => (heroVisible && !document.hidden ? kick() : halt())

    const io = new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting
      updateRunning()
    })
    io.observe(hero)
    on(document, 'visibilitychange', updateRunning)
    ro.observe(hero)
    resize()
    kick()

    cleanups.push(() => {
      halt()
      io.disconnect()
      ro.disconnect()
      // free GPU objects but keep the context: React may mount the scene again on the same canvas
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    })
  })()

  return () => {
    abort.abort()
    cleanups.forEach((fn) => fn())
    columns.forEach((col) => {
      col.replaceChildren()
      delete col.dataset.sets
    })
  }
}

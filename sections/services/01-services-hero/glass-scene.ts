/* Dark hero 3D scene (ported from the static "services hero" build)
 * - A row of reeded-glass bars over the left half: each one refracts the hero photo behind it,
 *   carries the same orange gradient, turns on its vertical axis in a travelling wave and
 *   drifts through a warm palette.
 * - A glossy orange knot (a tube along a four-petal curve) floats on the right and casts a
 *   real shadow onto the bars.
 * - Pointer: bars near the cursor turn further, the glow follows it, the knot tilts toward it.
 * The photo is the hero's background upload, so the owner can still change it in the admin.
 * Returns a cleanup function.
 */
import * as THREE from 'three'

type Bar = { mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhysicalMaterial>; rot: number; vel: number; x: number }
type BarUniforms = Record<string, THREE.IUniform>

export type GlassOptions = {
  /** URL of the hero photo (used as the backdrop and seen through the glass) */
  bg: string
  /** 'mid' draws at lower resolution with a smaller shadow map */
  quality: 'mid' | 'high'
  /** called once the first frame with the photo is on screen */
  onReady?: () => void
}

const PALETTE = ['#fd5600', '#ff8a00', '#ff3d14', '#ff6a00', '#ffb020', '#fd5600'].map((c) => new THREE.Color(c))
function samplePalette(t: number, out: THREE.Color) {
  t = ((t % 1) + 1) % 1
  const f = t * (PALETTE.length - 1)
  const i = Math.floor(f)
  const k = f - i
  return out.copy(PALETTE[i]).lerp(PALETTE[i + 1], k * k * (3 - 2 * k))
}

const BG_GLSL = `
  uniform sampler2D uBg; uniform float uBgOn; uniform vec2 uRes; uniform vec2 uBgScale;
  vec2 bgUv(vec2 s){ return (s - 0.5) * uBgScale + vec2(0.5); }
  vec3 sampleBg(vec2 s){ return texture2D(uBg, clamp(bgUv(s), vec2(0.001), vec2(0.999))).rgb; }
`

class KnotCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super()
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    // four-petal rose r = cos(2θ); a phase-shifted depth keeps the passes through the centre apart
    const a = t * Math.PI * 2
    const r = Math.cos(2 * a)
    const k = 1 + 0.04 * Math.pow(Math.sin(2 * a), 2)
    const z = 0.5 * Math.sin(a + Math.PI / 8) + 0.06 * Math.sin(4 * a)
    return target.set(r * Math.cos(a) * k, r * Math.sin(a) * k, z)
  }
}

export function initGlassHero(hero: HTMLElement, canvas: HTMLCanvasElement, opts: GlassOptions): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mid = opts.quality === 'mid'

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mid, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return () => {}
  }
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  const scene = new THREE.Scene()
  const FOV = 30
  const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 20000)

  /* environment for glossy reflections, built in code (no HDR file) */
  const envScene = new THREE.Scene()
  const envGeos: THREE.BufferGeometry[] = []
  const envMats: THREE.Material[] = []
  {
    const box = new THREE.BoxGeometry(10, 10, 10)
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x0a0604, side: THREE.BackSide })
    envGeos.push(box)
    envMats.push(boxMat)
    envScene.add(new THREE.Mesh(box, boxMat))
    const panel = (w: number, h: number, color: string, intensity: number, pos: number[], rot: number[]) => {
      const g = new THREE.PlaneGeometry(w, h)
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
      envGeos.push(g)
      envMats.push(m)
      const mesh = new THREE.Mesh(g, m)
      mesh.position.set(pos[0], pos[1], pos[2])
      mesh.rotation.set(rot[0], rot[1], rot[2])
      envScene.add(mesh)
    }
    panel(6, 1.4, '#ffffff', 6, [-1.5, 4.6, 1], [Math.PI / 2, 0, 0.3])
    panel(1.2, 6, '#ffe2c8', 4, [-4.8, 0.5, 1.5], [0, Math.PI / 2, 0])
    panel(1.0, 5, '#ff6a1a', 3, [4.8, -0.5, 0.5], [0, -Math.PI / 2, 0])
    panel(4, 2, '#ffffff', 2.2, [0.5, 1.2, 4.9], [0, Math.PI, 0])
    panel(6, 1.5, '#ff3d00', 1.5, [0, -4.8, 0], [-Math.PI / 2, 0, 0])
  }
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(envScene, 0.02)
  pmrem.dispose()
  envGeos.forEach((g) => g.dispose())
  envMats.forEach((m) => m.dispose())
  scene.environment = envRT.texture

  /* lights */
  scene.add(new THREE.AmbientLight(0xffffff, 0.06))
  const keyLight = new THREE.DirectionalLight(0xfff1e6, 1.1)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(mid ? 1024 : 2048, mid ? 1024 : 2048)
  keyLight.shadow.bias = -0.0004
  keyLight.shadow.normalBias = 0.6
  keyLight.shadow.radius = 6
  scene.add(keyLight, keyLight.target)
  const knotGlow = new THREE.PointLight(0xff5a00, 2.2, 0, 1.2)
  scene.add(knotGlow)
  const rim = new THREE.DirectionalLight(0xffc49a, 1.6)
  scene.add(rim, rim.target)

  /* the photo, shared by the backdrop and the glass */
  const bgShared = {
    uBg: { value: null as THREE.Texture | null },
    uBgOn: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uBgScale: { value: new THREE.Vector2(1, 1) },
    uBgAspect: { value: 1920 / 1024 },
  }
  const updateBgScale = () => {
    // object-fit: cover in screen space
    const view = bgShared.uRes.value.x / bgShared.uRes.value.y
    const a = bgShared.uBgAspect.value
    if (view > a) bgShared.uBgScale.value.set(1, a / view)
    else bgShared.uBgScale.value.set(view / a, 1)
  }

  /* backdrop: the photo plus a soft glow that follows the pointer */
  const glowUniforms = {
    ...bgShared,
    uColor: { value: new THREE.Color('#fd5600') },
    uColor2: { value: new THREE.Color('#ff8a00') },
    uMouse: { value: new THREE.Vector2(0.32, 0.5) },
    uAspect: { value: 1 },
    uTime: { value: 0 },
  }
  const planeGeo = new THREE.PlaneGeometry(1, 1)
  const glowMat = new THREE.ShaderMaterial({
    uniforms: glowUniforms,
    toneMapped: false,
    depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `
      uniform vec3 uColor; uniform vec3 uColor2; uniform vec2 uMouse; uniform float uAspect; uniform float uTime;
      ${BG_GLSL}
      varying vec2 vUv;
      void main(){
        vec2 s = gl_FragCoord.xy / uRes;
        vec2 p = s - uMouse; p.x *= uAspect;
        float core = exp(-dot(p,p)*7.0);
        float breathe = 0.85 + 0.15*sin(uTime*0.8);
        vec3 glowCol = mix(uColor, uColor2, s.y) * core * breathe;
        vec3 col = sampleBg(s) + glowCol * 0.12;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const glow = new THREE.Mesh(planeGeo, glowMat)
  scene.add(glow)

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 })
  const shadowCatcher = new THREE.Mesh(planeGeo, shadowMat)
  shadowCatcher.receiveShadow = true
  scene.add(shadowCatcher)

  /* bars */
  const barGroup = new THREE.Group()
  scene.add(barGroup)
  const barGeo = new THREE.BoxGeometry(1, 1, 1)
  let bars: Bar[] = []

  function makeBarMaterial() {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0,
      specularIntensity: 0.25,
      clearcoat: 0.15,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.05,
    })
    mat.toneMapped = false // keep the brand orange saturated
    const uniforms: BarUniforms = {
      ...bgShared,
      uCore: { value: new THREE.Color('#fd5600') },
      uDeep: { value: new THREE.Color('#3a0e00') },
      uBand: { value: 0.52 },
      uIntensity: { value: 1 },
      uRefract: { value: 0.02 },
      uShift: { value: 0 },
    }
    mat.userData.uniforms = uniforms
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vBarUv;\nvarying vec3 vObjNormal;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\nvBarUv = uv;\nvObjNormal = normal;')
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          varying vec2 vBarUv; varying vec3 vObjNormal;
          uniform vec3 uCore; uniform vec3 uDeep; uniform float uBand; uniform float uIntensity;
          uniform float uRefract; uniform float uShift;
          ${BG_GLSL}
          float bandAt(float y){ return exp(-pow((y - uBand) / 0.2, 2.0)); }
          vec3 gradientGlow(vec2 uv){
            float band = bandAt(uv.y);
            float floorGlow = smoothstep(0.0, 0.35, uv.y) * (1.0 - smoothstep(0.75, 1.0, uv.y));
            vec3 c = mix(vec3(0.004), uDeep, floorGlow * 0.8);
            c = mix(c, uCore, band);
            return c + vec3(1.0, 0.6, 0.3) * pow(band, 10.0) * 0.12;
          }
          vec3 glassFace(vec2 uv){
            float x = uv.x;
            float lip = exp(-pow((x - 0.04) / 0.035, 2.0));
            float body = mix(1.0, 0.62, smoothstep(0.1, 1.0, x));
            float ao = smoothstep(0.0, 0.05, x) * smoothstep(1.0, 0.92, x);
            vec3 c;
            if (uBgOn > 0.5) {
              vec2 s = gl_FragCoord.xy / uRes;
              s.x += (0.5 - x) * uRefract * 1.3 + uShift;
              vec3 bg = sampleBg(s);
              float lum = dot(bg, vec3(0.299, 0.587, 0.114));
              vec3 tinted = lum * uCore * 1.9;
              c = mix(bg, tinted, 0.38) + gradientGlow(uv) * bg * 0.9 + uCore * bandAt(uv.y) * 0.025;
            } else {
              c = gradientGlow(uv);
            }
            return c * body * mix(0.45, 1.0, ao) + vec3(1.0, 0.85, 0.7) * lip * 0.07 + c * lip * 0.9;
          }`,
        )
        .replace(
          'vec4 diffuseColor = vec4( diffuse, opacity );',
          `float isFace = step(0.5, abs(vObjNormal.z));
          vec3 sideCol = uDeep * 0.35 + uCore * 0.12 * bandAt(vBarUv.y);
          vec3 barCol = mix(sideCol, glassFace(vBarUv), isFace);
          vec4 diffuseColor = vec4( barCol * 0.18, opacity );`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          float facing = clamp(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
          totalEmissiveRadiance = barCol * uIntensity * 0.95 * (0.12 + 0.88 * pow(facing, 1.8));`,
        )
    }
    return mat
  }

  function buildBars(count: number) {
    bars.forEach((b) => {
      barGroup.remove(b.mesh)
      b.mesh.material.dispose()
    })
    bars = []
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(barGeo, makeBarMaterial())
      mesh.castShadow = true
      mesh.receiveShadow = true
      barGroup.add(mesh)
      bars.push({ mesh, rot: Math.PI / 2, vel: 0, x: 0 })
    }
  }

  /* knot */
  const knotGeo = new THREE.TubeGeometry(new KnotCurve(), mid ? 500 : 900, 0.125, mid ? 40 : 64, true)
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ff5200'),
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    sheen: 0.35,
    sheenColor: new THREE.Color('#ffb070'),
    sheenRoughness: 0.4,
    emissive: new THREE.Color('#ff3000'),
    emissiveIntensity: 0.16,
    envMapIntensity: 1.25,
  })
  const knot = new THREE.Mesh(knotGeo, knotMat)
  knot.castShadow = true
  const knotPivot = new THREE.Group() // pointer tilt
  const knotSpin = new THREE.Group() // continuous motion
  knotSpin.add(knot)
  knotPivot.add(knotSpin)
  scene.add(knotPivot)

  /* layout (scene units = CSS pixels) */
  const state = { W: 1, H: 1, mobile: false, barW: 52, barCount: 0, knotScale: 1, knotX: 0, knotY: 0, knotZ: 0 }

  function layout() {
    const rect = hero.getBoundingClientRect()
    const W = Math.max(1, rect.width)
    const H = Math.max(1, rect.height)
    state.W = W
    state.H = H
    state.mobile = W <= 640 // phones; tablets get the laptop layout

    const maxRatio = mid ? 1 : state.mobile ? 1.75 : 2
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio))
    renderer.setSize(W, H, false)

    camera.aspect = W / H
    const dist = H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    camera.position.set(0, 0, dist)
    camera.near = dist * 0.1
    camera.far = dist * 4
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    // design scale (1 = 1920px wide), clamped on small desktops
    const s = state.mobile ? 1 : Math.max(W, 1280) / 1920

    // reeded glass over the left half (full width on phones), slats ~40px wide at 1920
    const barW = state.mobile ? 26 : Math.max(30, 40 * s)
    const span = W * (state.mobile ? 1 : 0.5) // phones: the glass covers the full width
    const count = Math.max(4, Math.round(span / barW))
    if (count !== state.barCount) {
      buildBars(count)
      state.barCount = count
    }
    state.barW = span / count
    bars.forEach((b, i) => {
      b.x = -W / 2 + state.barW * (i + 0.5)
      b.mesh.position.set(b.x, 0, 0)
      b.mesh.scale.set(state.barW * 0.995, H * 1.12, state.barW * 0.42)
      ;(b.mesh.material.userData.uniforms as BarUniforms).uRefract.value = state.barW / W
    })

    // glow + shadow planes behind the bars, filling the view at that depth
    const backZ = -state.barW * 2.2
    const planeScale = 1 + (state.barW * 2.2) / dist
    glow.position.set(0, 0, backZ)
    glow.scale.set(W * planeScale * 1.05, H * planeScale * 1.05, 1)
    shadowCatcher.position.set(0, 0, backZ + 1)
    shadowCatcher.scale.copy(glow.scale)
    glowUniforms.uAspect.value = W / H
    renderer.getDrawingBufferSize(bgShared.uRes.value)
    updateBgScale()

    // knot: 937×937 box at left 1008 of the 1920 frame, vertically centred
    if (state.mobile) {
      const size = Math.min(W * 0.72, H * 0.3)
      state.knotScale = (size / 2) * 0.72
      state.knotX = 0
      state.knotY = H / 2 - Math.max(84, H * 0.1) - size / 2
    } else {
      const box = Math.min(937 * s, W * 0.5, H * 0.92)
      state.knotScale = (box / 2) * 0.64
      const cx = W <= 1280 ? W - box / 2 - W * 0.02 : 1008 * s + box / 2
      state.knotX = cx - W / 2
      state.knotY = 0
    }
    // keep the whole knot (incl. tilt) in front of the bars, then undo the perspective
    // magnification so it lands on its design box
    state.knotZ = state.knotScale * 1.05 + state.barW
    const persp = (dist - state.knotZ) / dist
    state.knotScale *= persp
    state.knotX *= persp
    state.knotY *= persp
    knotPivot.position.set(state.knotX, state.knotY, state.knotZ)

    keyLight.position.set(-W * 0.32, H * 0.38, dist * 0.9)
    keyLight.target.position.set(0, 0, 0)
    const sc = keyLight.shadow.camera
    sc.left = -W * 0.75
    sc.right = W * 0.75
    sc.top = H * 0.75
    sc.bottom = -H * 0.75
    sc.near = 1
    sc.far = dist * 2.5
    sc.updateProjectionMatrix()

    rim.position.set(state.knotX + W * 0.4, state.knotY + H * 0.2, -state.barW * 2)
    rim.target.position.set(state.knotX, state.knotY, 0)
    knotGlow.position.set(state.knotX, state.knotY, state.knotZ * 0.6)
    knotGlow.distance = state.knotScale * 4.2
  }

  /* pointer */
  const pointer = { x: 0.3, y: 0.5, tx: 0.3, ty: 0.5, active: false }
  const onPointer = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect()
    pointer.tx = (e.clientX - r.left) / r.width
    pointer.ty = (e.clientY - r.top) / r.height
    pointer.active = e.clientY >= r.top && e.clientY <= r.bottom
  }
  const onLeave = () => (pointer.active = false)
  window.addEventListener('pointermove', onPointer, { passive: true })
  hero.addEventListener('pointerleave', onLeave)

  /* loop */
  const tmpA = new THREE.Color()
  const deepBase = new THREE.Color('#160500')
  const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
  let introStart = performance.now()
  let elapsed = 0
  let last = performance.now()
  let raf = 0
  let running = false
  let visible = true
  let ready = false
  let disposed = false

  function frame(now: number) {
    if (!running) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min((now - last) / 1000, 1 / 20)
    last = now
    elapsed += dt
    const t = elapsed * (reduceMotion ? 0.15 : 1)
    const intro = (now - introStart) / 1000

    const pk = 1 - Math.pow(0.0015, dt)
    pointer.x += (pointer.tx - pointer.x) * pk
    pointer.y += (pointer.ty - pointer.y) * pk
    const mx = pointer.x - 0.5
    const my = pointer.y - 0.5
    const pointerWorldX = mx * state.W
    const cycle = t * 0.035

    const n = bars.length
    for (let i = 0; i < n; i++) {
      const b = bars[i]
      const u = i / Math.max(1, n - 1)
      // travelling wave + slow breathing
      let target = 0.34 * Math.sin(t * 0.55 - i * 0.32) + 0.12 * Math.sin(t * 0.21 + i * 0.09)
      // bars near the cursor turn further
      if (pointer.active && !state.mobile) {
        const d = (b.x - pointerWorldX) / (state.barW * 4.5)
        target += Math.exp(-d * d) * 0.95 * (d < 0 ? -1 : 1) * Math.min(1, Math.abs(d) * 3 + 0.25)
      }
      // intro: sweep in from edge-on, left to right
      const k = easeOutExpo(Math.max(0, Math.min(1, (intro - 0.1 - u * 0.9) / 1.6)))
      target = THREE.MathUtils.lerp(Math.PI / 2, target, k)
      // spring
      const acc = (target - b.rot) * 42 - b.vel * 11
      b.vel += acc * dt
      b.rot += b.vel * dt
      b.mesh.rotation.y = b.rot

      samplePalette(cycle + u * 0.18 + 0.04 * Math.sin(t * 0.4 + i * 0.15), tmpA)
      const un = b.mesh.material.userData.uniforms as BarUniforms
      ;(un.uCore.value as THREE.Color).copy(tmpA)
      ;(un.uDeep.value as THREE.Color).copy(deepBase).lerp(tmpA, 0.22)
      un.uBand.value = 0.5 + (0.5 - pointer.y) * 0.22 + 0.04 * Math.sin(t * 0.7 + i * 0.2)
      un.uShift.value = Math.sin(b.rot) * (state.barW / state.W) * 1.6
      un.uIntensity.value = 0.55 + 0.45 * k
    }

    glowUniforms.uTime.value = t
    glowUniforms.uMouse.value.set(
      THREE.MathUtils.lerp(0.32, pointer.x, pointer.active ? 0.7 : 0.25),
      1 - THREE.MathUtils.lerp(0.5, pointer.y, pointer.active ? 0.7 : 0.25),
    )
    samplePalette(cycle + 0.05, glowUniforms.uColor.value)
    samplePalette(cycle + 0.25, glowUniforms.uColor2.value)
    samplePalette(cycle, knotGlow.color)

    const kIntro = easeOutExpo(Math.max(0, Math.min(1, (intro - 0.35) / 1.8)))
    knotSpin.rotation.z = -0.32 + t * 0.12 + (1 - kIntro) * -1.4
    knotSpin.rotation.x = 0.18 * Math.sin(t * 0.45)
    knotSpin.rotation.y = 0.28 * Math.sin(t * 0.33 + 1.2)
    const tiltK = 1 - Math.pow(0.02, dt)
    knotPivot.rotation.y += ((state.mobile ? 0 : mx * 0.7) - knotPivot.rotation.y) * tiltK
    knotPivot.rotation.x += ((state.mobile ? 0 : my * 0.5) - knotPivot.rotation.x) * tiltK
    knotPivot.position.y = state.knotY + Math.sin(t * 0.9) * state.knotScale * 0.035
    knot.scale.setScalar(state.knotScale * (0.6 + 0.4 * kIntro))

    renderer.render(scene, camera)
  }

  const start = () => {
    if (running || !ready || !visible || document.hidden || disposed) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  /* boot once the photo is loaded (nothing is shown before; the still picture stays meanwhile) */
  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')
  loader.load(
    opts.bg,
    (tex) => {
      if (disposed) return tex.dispose()
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      bgShared.uBg.value = tex
      bgShared.uBgOn.value = 1
      const img = tex.image as { width: number; height: number }
      bgShared.uBgAspect.value = img.width / img.height
      layout()
      renderer.compile(scene, camera)
      ready = true
      introStart = performance.now()
      start()
      requestAnimationFrame(() => !disposed && opts.onReady?.())
    },
    undefined,
    () => {
      /* the photo could not be read (e.g. blocked cross-origin): keep the still hero */
    },
  )

  let resizeRaf = 0
  const onResize = () => {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(() => ready && layout())
  }
  window.addEventListener('resize', onResize)
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) start()
    else stop()
  })
  io.observe(hero)
  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    disposed = true
    stop()
    cancelAnimationFrame(resizeRaf)
    io.disconnect()
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointer)
    hero.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    bars.forEach((b) => b.mesh.material.dispose())
    barGeo.dispose()
    planeGeo.dispose()
    glowMat.dispose()
    shadowMat.dispose()
    knotGeo.dispose()
    knotMat.dispose()
    bgShared.uBg.value?.dispose()
    envRT.dispose()
    keyLight.shadow.map?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
}

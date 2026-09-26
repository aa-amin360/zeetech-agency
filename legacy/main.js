/* ZeeTech hero
 * 1. Fluted-glass WebGL background, scoped to the hero section
 * 2. Backdrop palette studio (corner controls)
 * 3. Collage placeholders + mobile menu
 */
(() => {
  'use strict';

  const hero = document.getElementById('hero');
  if (!hero) return;

  const params = new URLSearchParams(location.search);
  if (params.get('ui') === '0') document.body.classList.add('hide-ui');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     Collage tiles
     Each tile is a project image from assets/; the tone class gives the
     tile a matching background while the image loads. Columns are
     appended in whole sets so the CSS loop stays seamless.
     ========================================================= */
  const COLUMNS = [
    ['reel-1 warm', 'reel-2 mint', 'work-laptop', 'reel-3 lilac', 'principle-02 dark', 'reel-4 rose', 'deliver-preview dark', 'principle-03 warm', 'reel-2 mint', 'principle-04 lilac'],
    ['deliver-preview dark', 'reel-3 lilac', 'principle-03 warm', 'reel-4 rose', 'work-laptop', 'reel-1 warm', 'principle-04 lilac', 'reel-2 mint', 'principle-02 dark', 'reel-3 lilac'],
    ['reel-4 rose', 'principle-02 dark', 'reel-2 mint', 'reel-1 warm', 'principle-04 lilac', 'work-laptop', 'reel-3 lilac', 'deliver-preview dark', 'principle-03 warm', 'reel-4 rose'],
  ];

  const buildTile = (spec, slot) => {
    const [name, tone] = spec.split(' ');
    const fig = document.createElement('figure');
    fig.className = `ph${tone ? ` ph--${tone}` : ''}`;
    fig.dataset.slot = slot;
    const img = document.createElement('img');
    img.src = `assets/${name}.png`;
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    fig.appendChild(img);
    return fig;
  };

  // Tiles are appended in whole sets. fillColumns() keeps adding sets until a
  // column is at least (one set + the panel height) tall, so the roll stays
  // seamless however tall the hero gets.
  const TILE = 300, GAP = 8;                       // design px (Figma)
  const setHeight = (c) => (COLUMNS[c] || COLUMNS[0]).length * (TILE + GAP);
  const fillColumns = (panelDesignH) => {
    document.querySelectorAll('.collage__col').forEach((col) => {
      const c = Number(col.dataset.col);
      const list = COLUMNS[c] || COLUMNS[0];
      const needSets = Math.max(2, Math.ceil(panelDesignH / setHeight(c) + 0.05) + 1);
      let have = Number(col.dataset.sets || 0);
      if (have >= needSets) return;
      const frag = document.createDocumentFragment();
      for (; have < needSets; have++) {
        list.forEach((spec, i) => frag.appendChild(buildTile(spec, `c${c}-${i}`)));
      }
      col.appendChild(frag);
      col.dataset.sets = String(have);
    });
  };
  fillColumns(1500);

  /* =========================================================
     Free-form infinite roll
     - every column rolls forever (tiles are doubled, position wraps)
     - page scroll adds momentum, mouse/pen drag grabs & flings it
     - after any push it eases back to its own cruising speed
     ========================================================= */
  (() => {
    const panel = document.querySelector('.collage__panel');
    const cols = [...document.querySelectorAll('.collage__col')];
    if (!panel || !cols.length) return;

    const ANGLE = 17.98 * Math.PI / 180;            // panel rotation (Figma)
    const AX = -Math.sin(ANGLE), AY = Math.cos(ANGLE); // screen direction of the columns' "down"
    const CRUISE = 34;                               // design px / second
    const SPEEDS = [1.0, -0.82, 1.18];               // per column: sign = direction, size = pace

    const state = cols.map((el, i) => ({
      el,
      mult: SPEEDS[i % SPEEDS.length],
      pos: 0,     // current offset (px)
      loop: 1,    // height of one tile set (px)
    }));

    let unit = 1;          // on-screen px per design px
    const measure = () => {
      unit = panel.offsetWidth / 900 || 1;
      fillColumns(panel.offsetHeight / unit);       // enough tiles for this hero height
      state.forEach((s, i) => {
        const prevLoop = s.loop;
        s.loop = Math.max(1, setHeight(Number(s.el.dataset.col)) * unit);
        // keep relative position when the layout rescales; stagger on first run
        s.pos = prevLoop > 1 ? (s.pos / prevLoop) * s.loop : s.loop * [0.18, 0.55, 0.79][i % 3];
      });
    };

    let boost = 0;          // shared extra velocity from scroll / fling (design px / s)
    let dragging = false, dragId = null, lastPt = null, dragVel = 0, lastDragT = 0;

    // page scroll → momentum (never hijacks the scroll itself)
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      boost += dy * 6;
      boost = Math.max(-2400, Math.min(2400, boost));
    }, { passive: true });

    // mouse / pen drag with fling; touch is left to native page scrolling
    panel.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      dragging = true;
      dragId = e.pointerId;
      lastPt = { x: e.clientX, y: e.clientY };
      lastDragT = performance.now();
      dragVel = 0;
      boost = 0;
      panel.setPointerCapture(e.pointerId);
      panel.classList.add('is-dragging');
    });
    panel.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== dragId) return;
      const now = performance.now();
      const dx = e.clientX - lastPt.x, dy = e.clientY - lastPt.y;
      lastPt = { x: e.clientX, y: e.clientY };
      const along = dx * AX + dy * AY;               // drag projected on the column axis (screen px)
      // columns follow the hand in their own direction
      state.forEach((s) => { s.pos -= along * Math.sign(s.mult); });
      const dt = Math.max(1, now - lastDragT) / 1000;
      lastDragT = now;
      dragVel = dragVel * 0.6 + (-along / dt / unit) * 0.4;
    });
    const endDrag = (e) => {
      if (!dragging || (e && e.pointerId !== dragId)) return;
      dragging = false;
      panel.classList.remove('is-dragging');
      boost = Math.max(-3000, Math.min(3000, dragVel)); // fling
    };
    panel.addEventListener('pointerup', endDrag);
    panel.addEventListener('pointercancel', endDrag);
    panel.addEventListener('lostpointercapture', endDrag);

    let running = false, raf = 0, last = 0, visible = true;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const paused = hero.classList.contains('is-paused') || reduceMotion;
      const cruise = paused ? 0 : CRUISE;

      if (!dragging) {
        boost *= Math.exp(-dt * 2.2);                // inertia decays smoothly
        if (Math.abs(boost) < 0.5) boost = 0;
        state.forEach((s) => {
          s.pos += (cruise * s.mult + boost * Math.sign(s.mult)) * unit * dt;
        });
      }
      state.forEach((s) => {
        const y = ((s.pos % s.loop) + s.loop) % s.loop;   // wrap → infinite
        s.el.style.transform = `translate3d(0, ${(-y).toFixed(2)}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(tick); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const update = () => (visible && !document.hidden ? start() : stop());

    new ResizeObserver(measure).observe(panel);
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; update(); }).observe(hero);
    document.addEventListener('visibilitychange', update);
    measure();
    start();
  })();

  /* =========================================================
     Client logo rows — infinite marquee
     Sizes are the Figma logo boxes (design px). Put an <img> inside a
     .logo-slot to replace its placeholder.
     ========================================================= */
  (() => {
    const ROWS = [
      [[200, 52.308], 152, 166, 224, 154, 106, 82, 137, 267, 268, [200, 52.308]],
      [[200, 52.308], 153, 104, 131, 267, 60, 249, 153, 92, 152],
    ];
    const PX_PER_SEC = 45;
    const rows = [...document.querySelectorAll('.marquee')];
    const buildSet = (list, hidden) => {
      const set = document.createElement('div');
      set.className = 'marquee__set';
      if (hidden) set.setAttribute('aria-hidden', 'true');
      list.forEach((item, i) => {
        const [w, h] = Array.isArray(item) ? item : [item, 40];
        const slot = document.createElement('span');
        slot.className = 'logo-slot';
        if (!hidden) slot.setAttribute('role', 'listitem');
        slot.setAttribute('aria-label', `Client logo ${i + 1}`);
        slot.style.setProperty('--w', w);
        slot.style.setProperty('--h', h);
        slot.innerHTML = '<i class="logo-slot__mark"></i><i class="logo-slot__word"></i>';
        set.appendChild(slot);
      });
      return set;
    };
    rows.forEach((row) => {
      const list = ROWS[Number(row.dataset.row)] || ROWS[0];
      row.appendChild(buildSet(list, false));
      row.appendChild(buildSet(list, true));
    });
    // same on-screen speed for both rows, whatever the screen size
    const setDurations = () => rows.forEach((row) => {
      const w = row.firstElementChild ? row.firstElementChild.offsetWidth : 0;
      if (w) row.style.setProperty('--dur', `${(w / PX_PER_SEC).toFixed(2)}s`);
    });
    setDurations();
    window.addEventListener('resize', setDurations, { passive: true });
  })();

  /* =========================================================
     Mobile menu
     ========================================================= */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    const setMenu = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
    };
    burger.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => m.matches && setMenu(false));
  }

  /* =========================================================
     Fluted glass background
     ========================================================= */
  const PALETTES = [
    { name: 'Solstice', stops: ['#f7b52c', '#f6cc1d', '#f4861f', '#f14a4d', '#f45aa6', '#eaa2ea'] },
    { name: 'Lagoon',   stops: ['#2dd4bf', '#22c7ee', '#3b9cf8', '#6366f1', '#a855f7', '#f0abfc'] },
    { name: 'Aurora',   stops: ['#34d399', '#a3e635', '#fde047', '#fb7185', '#c084fc', '#93c5fd'] },
    { name: 'Ember',    stops: ['#fdd66a', '#f59e0b', '#ea580c', '#dc2626', '#be185d', '#8b5cf6'] },
    { name: 'Iris',     stops: ['#93c5fd', '#818cf8', '#a78bfa', '#e879f9', '#fb7185', '#fdba74'] },
  ];
  const BASE = [0.992, 0.980, 0.996];
  const CYCLE_MS = 9000;
  const FADE_MS = 2600;
  const SPEED = reduceMotion ? 0.3 : 1.0;

  const hexToRgb = (h) => {
    const n = parseInt(h.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };
  const flat = (p) => new Float32Array(p.stops.flatMap(hexToRgb));

  const VERT = `
    attribute vec2 aPos;
    void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

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
  `;

  const canvas = document.getElementById('bg');
  const gl = canvas && canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) { hero.classList.add('no-gl'); return; }

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    console.error(e);
    hero.classList.add('no-gl');
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['uRes', 'uTime', 'uBarW', 'uOffset', 'uMouse', 'uMouseStr', 'uA', 'uB', 'uMix', 'uBase']
    .forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
  gl.uniform3fv(U.uBase, BASE);

  /* ---------- Sizing: canvas follows the hero, not the window ---------- */
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = hero.getBoundingClientRect();
    const cw = Math.max(1, rect.width), ch = Math.max(1, rect.height);
    const W = Math.round(cw * dpr);
    const H = Math.round(ch * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    gl.viewport(0, 0, W, H);
    // ~48px flutes at 1920 (matches the Figma backdrop), 18px minimum
    const barCss = Math.min(48, Math.max(18, cw / 40));
    const bw = Math.max(8, Math.round(barCss * dpr));
    gl.uniform2f(U.uRes, W, H);
    gl.uniform1f(U.uBarW, bw);
    gl.uniform1f(U.uOffset, Math.round((W % bw) / 2));
    if (!running) draw();
  };
  const ro = new ResizeObserver(resize);

  /* ---------- Pointer (relative to the hero) ---------- */
  let mouseX = -1e5, mouseTargetX = -1e5;
  let mouseStr = 0, mouseStrTarget = 0, lastMove = 0;
  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseTargetX = (e.clientX - rect.left) * dpr;
    if (mouseX < -1e4) mouseX = mouseTargetX;
    mouseStrTarget = 1;
    lastMove = performance.now();
  };
  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerdown', onMove, { passive: true });
  hero.addEventListener('pointerleave', () => (mouseStrTarget = 0));

  /* ---------- Palette state ---------- */
  let fromArr = flat(PALETTES[0]);
  let toIdx = 0, fadeStart = -1, lastSwitch = performance.now();
  gl.uniform3fv(U.uA, fromArr);
  gl.uniform3fv(U.uB, fromArr);
  gl.uniform1f(U.uMix, 0);

  const label = document.getElementById('label');
  const swatchWrap = document.getElementById('swatches');
  const ring = document.getElementById('ring');
  const swatches = PALETTES.map((p, i) => {
    const b = document.createElement('button');
    b.className = 'swatch';
    b.type = 'button';
    b.title = p.name;
    b.setAttribute('aria-label', `${p.name} backdrop`);
    b.style.background = `linear-gradient(135deg, ${p.stops.join(', ')})`;
    b.addEventListener('click', () => goTo(i));
    swatchWrap && swatchWrap.appendChild(b);
    return b;
  });
  const syncUI = (i) => {
    swatches.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    if (label) label.textContent = PALETTES[i].name;
  };
  syncUI(0);

  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const currentMix = () => (fadeStart < 0 ? 0 : ease(Math.min(1, (performance.now() - fadeStart) / FADE_MS)));

  function goTo(i) {
    if (i === toIdx && fadeStart < 0) return;
    const m = currentMix();
    const a = fromArr, b = flat(PALETTES[toIdx]);
    const blended = new Float32Array(18);
    for (let k = 0; k < 18; k++) blended[k] = a[k] + (b[k] - a[k]) * m;
    gl.uniform3fv(U.uA, blended);
    fromArr = blended;
    gl.uniform3fv(U.uB, flat(PALETTES[i]));
    toIdx = i;
    fadeStart = performance.now();
    lastSwitch = fadeStart;
    syncUI(i);
    if (!running) kick();
  }

  /* ---------- Play / pause (background + collage) ---------- */
  let playing = true;
  const toggle = document.getElementById('toggle');
  const setPlaying = (v) => {
    playing = v;
    hero.classList.toggle('is-paused', !v);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(!v));
      toggle.setAttribute('aria-label', v ? 'Pause motion' : 'Play motion');
    }
    if (v) lastSwitch = performance.now() - pausedProgress * CYCLE_MS;
  };
  let pausedProgress = 0;
  toggle && toggle.addEventListener('click', () => setPlaying(!playing));

  let heroVisible = true;
  window.addEventListener('keydown', (e) => {
    if (!heroVisible) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
    if (tag === 'BUTTON' || tag === 'A') { if (e.code === 'Space' || e.code === 'Enter') return; }
    if (e.code === 'Space') { e.preventDefault(); setPlaying(!playing); }
    if (e.code === 'ArrowRight') goTo((toIdx + 1) % PALETTES.length);
    if (e.code === 'ArrowLeft') goTo((toIdx - 1 + PALETTES.length) % PALETTES.length);
  });

  // studio fades back when idle
  const dock = document.getElementById('dock');
  let idleTimer;
  const wake = () => {
    if (!dock) return;
    dock.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => dock.classList.add('idle'), 2800);
  };
  hero.addEventListener('pointermove', wake, { passive: true });
  wake();

  /* ---------- Loop (only while the hero is on screen) ---------- */
  let time = 12.0;
  let last = performance.now();
  let running = false;
  let rafId = 0;

  const draw = () => {
    gl.uniform1f(U.uTime, time);
    gl.uniform2f(U.uMouse, mouseX, 0);
    gl.uniform1f(U.uMouseStr, reduceMotion ? mouseStr * 0.4 : mouseStr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (playing) time += dt * SPEED;

    // auto-cycle + progress ring
    if (fadeStart < 0) {
      const prog = Math.min(1, (now - lastSwitch) / CYCLE_MS);
      if (playing) pausedProgress = prog;
      if (ring) ring.style.setProperty('--p', (playing ? prog : pausedProgress).toFixed(4));
      if (playing && prog >= 1) goTo((toIdx + 1) % PALETTES.length);
    } else if (ring) {
      ring.style.setProperty('--p', '0');
    }

    if (fadeStart >= 0) {
      const m = currentMix();
      gl.uniform1f(U.uMix, m);
      if (m >= 1) {
        const f = flat(PALETTES[toIdx]);
        gl.uniform3fv(U.uA, f);
        gl.uniform3fv(U.uB, f);
        fromArr = f;
        gl.uniform1f(U.uMix, 0);
        fadeStart = -1;
        lastSwitch = now;
        pausedProgress = 0;
      }
    }

    if (now - lastMove > 1400) mouseStrTarget = 0;
    const kx = 1 - Math.exp(-dt * 7);
    const ks = 1 - Math.exp(-dt * (mouseStrTarget > mouseStr ? 4 : 1.6));
    mouseX += (mouseTargetX - mouseX) * kx;
    mouseStr += (mouseStrTarget - mouseStr) * ks;

    draw();
    rafId = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (running) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  };
  const halt = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };
  const updateRunning = () => (heroVisible && !document.hidden ? kick() : halt());

  new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    updateRunning();
  }).observe(hero);
  document.addEventListener('visibilitychange', updateRunning);

  ro.observe(hero);
  resize();
  kick();
})();

/* ZeeTech sections below the hero
 * 1. Tickers, tool rows and the comparison table
 * 2. Client stories slider, services list, FAQ accordion, inquiry form
 * 3. Studio reel — Three.js wave field (lazy-loaded)
 * 4. Scroll motion with GSAP + ScrollTrigger (reveals, counters, card stack, wires)
 */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* =========================================================
     Infinite rows
     A row is a track holding two identical sets and sliding by -50%.
     Each set is padded with repeats of its own items until it is at
     least as wide as the row, so the loop never shows a gap.
     ========================================================= */
  const fillSet = (set, minWidth) => {
    const originals = [...set.children].filter((el) => !el.dataset.repeat);
    let guard = 0;
    while (set.scrollWidth < minWidth && originals.length && guard++ < 20) {
      originals.forEach((el) => {
        const copy = el.cloneNode(true);
        copy.dataset.repeat = '1';
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
        set.appendChild(copy);
      });
    }
  };
  const mirrorSet = (track) => {
    const [set, old] = track.children;
    if (old) old.remove();
    const clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    track.appendChild(clone);
  };
  const loops = [];   // { box, track, speed }
  const layoutLoops = () => loops.forEach(({ box, track, speed }) => {
    const set = track.firstElementChild;
    fillSet(set, box.offsetWidth);
    mirrorSet(track);
    track.style.setProperty('--dur', `${(set.offsetWidth / speed).toFixed(2)}s`);
  });

  // text + media tickers (showreel section)
  $$('.ticker').forEach((ticker) => {
    const set = $('.ticker__set', ticker);
    if (!set) return;
    const track = document.createElement('div');
    track.className = 'ticker__track';
    ticker.insertBefore(track, set);
    track.appendChild(set);
    loops.push({ box: ticker, track, speed: Number(ticker.dataset.speed) || 45 });
  });

  // tool rows behind the delivery map (tool-N.png from Figma 275:53950)
  const TOOLS = [
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 6, 7, 8, 8, 9],
    [0, 5, 1, 1, 6, 6, 2, 2, 3, 3, 7, 7, 4, 4, 8, 8, 4, 8, 9],
  ];
  $$('.build__row').forEach((row) => {
    const set = document.createElement('div');
    set.className = 'build__set';
    (TOOLS[Number(row.dataset.tools)] || TOOLS[0]).forEach((n) => {
      const tile = document.createElement('span');
      tile.className = 'build__tile';
      tile.innerHTML = `<img src="assets/tool-${n}.png" alt="" loading="lazy" />`;
      set.appendChild(tile);
    });
    row.appendChild(set);
    loops.push({ box: row.parentElement, track: row, speed: 28 });
  });

  layoutLoops();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutLoops);
  let loopTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(loopTimer);
    loopTimer = setTimeout(layoutLoops, 200);
  }, { passive: true });

  /* =========================================================
     Delivery model comparison (Figma 334:3449)
     ========================================================= */
  const MARKS = {
    yes:   { src: 'icon-tick-circle.svg', label: 'Included', cls: '' },
    check: { src: 'icon-check.svg', label: 'Yes', cls: 'cmp__mark--check' },
    dot:   { src: 'icon-dot.svg', label: 'Limited', cls: 'cmp__mark--dot' },
    no:    { src: 'icon-x-circle.svg', label: 'No', cls: '' },
  };
  const COMPARE = [
    {
      name: '<span class="o">Z</span>ee<span class="o">T</span>ech',
      desc: 'One integrated team across architecture, UI/UX, frontend, backend + AI, SQA, deployment and ongoing support.',
      icon: 'mark-z-green.svg', ring: '#23d400', glow: 'rgba(185, 242, 39, 0.14)', zee: true,
      cells: ['yes', 'yes', 'yes', 'yes', 'yes', 'yes'],
    },
    {
      name: 'In-house hiring',
      desc: 'Deep internal context, but usually needs several specialist hires, onboarding and day-to-day management.',
      icon: 'icon-team.svg', ring: '#fd5600',
      cells: ['check', 'check', 'check', 'dot', 'dot', 'check'],
    },
    {
      name: 'Large agencies',
      desc: 'Broad capability, but delivery can involve more layers, handoffs and account-management overhead.',
      icon: 'icon-buildings.svg', ring: '#b9f227',
      cells: ['check', 'check', 'check', 'check', 'check', 'dot'],
    },
    {
      name: 'Freelancers',
      desc: 'Fast and flexible for focused tasks; full-cycle consistency, QA and long-term ownership can vary.',
      icon: 'icon-user.svg', ring: '#fd5600',
      cells: ['dot', 'check', 'dot', 'no', 'no', 'dot'],
    },
    {
      name: 'DIY / no-code tools',
      desc: 'Useful for simple sites and prototypes; limited for complex systems, custom workflows and long-term ownership.',
      icon: 'icon-box.svg', ring: '#fdc72e', glow: 'rgba(253, 199, 46, 0.14)',
      cells: ['no', 'dot', 'no', 'no', 'check', 'no'],
    },
  ];
  const cmpBody = $('#cmp-body');
  if (cmpBody) {
    cmpBody.innerHTML = COMPARE.map((r) => `
      <div class="cmp__row${r.zee ? ' cmp__row--zee' : ''}" role="row">
        <div class="cmp__label" role="rowheader">
          <span class="cmp__bubble" style="--ring:${r.ring};${r.glow ? `--glow:${r.glow}` : ''}"><img src="assets/${r.icon}" alt="" /></span>
          <span class="cmp__name"><strong>${r.name}</strong><span>${r.desc}</span></span>
        </div>
        ${r.cells.map((c) => `<span class="cmp__cell" role="cell"><img class="cmp__mark ${MARKS[c].cls}" src="assets/${MARKS[c].src}" alt="${MARKS[c].label}" /></span>`).join('')}
      </div>`).join('');
  }

  /* =========================================================
     Client stories slider
     ========================================================= */
  (() => {
    const track = $('.testi__track');
    if (!track) return;
    const slides = $$('.testi__slide', track);
    const prev = $('[data-testi="prev"]');
    const next = $('[data-testi="next"]');
    let index = 0;

    const go = (i) => {
      index = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach((s, n) => {
        s.classList.toggle('is-active', n === index);
        s.setAttribute('aria-hidden', String(n !== index));
      });
      track.style.transform = `translate3d(${-slides[index].offsetLeft}px, 0, 0)`;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    };
    prev && prev.addEventListener('click', () => go(index - 1));
    next && next.addEventListener('click', () => go(index + 1));
    slides.forEach((s, n) => s.addEventListener('click', () => n !== index && go(n)));
    window.addEventListener('resize', () => go(index), { passive: true });
    go(0);
  })();

  /* =========================================================
     Services list ↔ preview
     ========================================================= */
  const services = $$('.svc');
  const serviceNum = $('#deliver-num');
  const serviceFrame = $('.deliver__frame');
  const setService = (i) => {
    if (!services[i] || services[i].classList.contains('is-active')) return;
    services.forEach((el, n) => el.classList.toggle('is-active', n === i));
    if (serviceNum) serviceNum.textContent = String(i + 1).padStart(2, '0');
    if (serviceFrame && window.gsap && !reduceMotion) {
      gsap.fromTo(serviceFrame, { scale: 0.97, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
    }
  };
  services.forEach((el, i) => {
    el.addEventListener('pointerenter', () => setService(i));
    el.addEventListener('focusin', () => setService(i));
  });

  /* =========================================================
     FAQ accordion — one answer open at a time
     ========================================================= */
  const faqItems = $$('.acc__item');
  faqItems.forEach((item) => {
    const btn = $('button', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      faqItems.forEach((other) => {
        const isThis = other === item;
        other.classList.toggle('is-open', isThis && open);
        $('button', other).setAttribute('aria-expanded', String(isThis && open));
      });
    });
  });

  /* =========================================================
     Inquiry form
     There is no backend yet, so a valid form opens the visitor's
     email app with the inquiry filled in (to hello@zeetech.studio).
     ========================================================= */
  (() => {
    const form = $('#inquiry-form');
    const status = $('#form-status');
    if (!form) return;
    const required = $$('[required]', form);
    const check = (el) => {
      const ok = el.checkValidity() && el.value.trim() !== '';
      el.closest('.field').classList.toggle('is-invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    required.forEach((el) => el.addEventListener('blur', () => el.value && check(el)));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = required.filter((el) => !check(el));
      if (bad.length) {
        status.textContent = 'Please add your name, a valid email and a few project details.';
        bad[0].focus();
        return;
      }
      const data = new FormData(form);
      const phone = data.get('phone') ? `${data.get('dial')} ${data.get('phone')}` : '—';
      const body = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `WhatsApp: ${phone}`,
        `Budget: ${data.get('budget') || '—'}`,
        '',
        String(data.get('details')),
      ].join('\n');
      const subject = `Project inquiry — ${data.get('name')}`;
      window.location.href = `mailto:hello@zeetech.studio?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Opening your email app with the inquiry filled in…';
    });
  })();

  /* =========================================================
     Studio reel — Three.js wave field as a live poster.
     three.js loads only when the reel gets close to the viewport.
     ========================================================= */
  (() => {
    const reel = $('#reel');
    if (!reel) return;
    const canvas = $('.reel__gl', reel);
    const play = $('.reel__play', reel);
    let wave = null;   // { pulse() }

    const playVideo = (src) => {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      reel.appendChild(video);
      reel.classList.add('is-playing');
      video.play().catch(() => {});
      video.focus();
    };
    play.addEventListener('click', () => {
      if (reel.dataset.video) playVideo(reel.dataset.video);
      else if (wave) wave.pulse();
    });

    const loadThree = () => new Promise((resolve, reject) => {
      if (window.THREE) return resolve(window.THREE);
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.async = true;
      s.onload = () => resolve(window.THREE);
      s.onerror = reject;
      document.head.appendChild(s);
    });

    const start = (THREE) => {
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
      } catch (err) {
        reel.classList.add('no-gl');
        return;
      }
      renderer.setClearColor(0x000000, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 2.4, 7);
      camera.lookAt(0, -0.2, 0);

      const COLS = 180, ROWS = 80, W = 16, D = 8;
      const pos = new Float32Array(COLS * ROWS * 3);
      const seed = new Float32Array(COLS * ROWS);
      for (let r = 0, k = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++, k++) {
          pos[k * 3] = (c / (COLS - 1) - 0.5) * W;
          pos[k * 3 + 1] = 0;
          pos[k * 3 + 2] = (r / (ROWS - 1) - 0.5) * D;
          seed[k] = Math.random();
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

      const uniforms = {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScale: { value: renderer.getPixelRatio() },
        uColorA: { value: new THREE.Color('#fd5600') },
        uColorB: { value: new THREE.Color('#fff7a3') },
      };
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
      });
      scene.add(new THREE.Points(geometry, material));

      const resize = () => {
        const w = reel.clientWidth, h = reel.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = w / h < 1.4 ? 58 : 42;
        camera.updateProjectionMatrix();
        if (!running) renderer.render(scene, camera);
      };

      // pointer → ripple centre on the plane
      const target = new THREE.Vector2(0, 0);
      reel.addEventListener('pointermove', (e) => {
        const b = reel.getBoundingClientRect();
        target.set(((e.clientX - b.left) / b.width - 0.5) * W * 0.8, ((e.clientY - b.top) / b.height - 0.5) * D);
      }, { passive: true });
      reel.addEventListener('pointerleave', () => target.set(0, 0));

      let running = false, raf = 0, last = 0, visible = false;
      const frame = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        uniforms.uTime.value += dt;
        uniforms.uPulse.value *= Math.exp(-dt * 1.2);
        uniforms.uMouse.value.lerp(target, 1 - Math.exp(-dt * 4));
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      const run = () => { if (running || reduceMotion) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
      const halt = () => { running = false; cancelAnimationFrame(raf); };
      const update = () => (visible && !document.hidden && !reel.classList.contains('is-playing') ? run() : halt());

      new ResizeObserver(resize).observe(reel);
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; update(); }).observe(reel);
      document.addEventListener('visibilitychange', update);
      resize();
      uniforms.uTime.value = 2.5;
      renderer.render(scene, camera);   // static frame for reduced motion

      wave = {
        pulse() {
          uniforms.uPulse.value = 1.4;
          if (reduceMotion) renderer.render(scene, camera);
        },
      };
    };

    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      loadThree().then(start).catch(() => reel.classList.add('no-gl'));
    }, { rootMargin: '600px 0px' });
    io.observe(reel);
  })();

  /* =========================================================
     Scroll motion (GSAP + ScrollTrigger)
     Everything is fully visible without it; GSAP only adds motion.
     ========================================================= */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // follow wall-clock time: on slow frames (the hero's WebGL on weak GPUs)
  // animations still finish on schedule instead of stretching out
  gsap.ticker.lagSmoothing(0);

  const mm = gsap.matchMedia();

  // services: the discipline under the reading line becomes active
  mm.add('(min-width: 901px)', () => {
    services.forEach((el, i) => ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && setService(i),
    }));
  });

  if (reduceMotion) return;

  // hero intro: copy rises line by line, the collage fades in behind it
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero .trust', { y: 16, autoAlpha: 0, duration: 0.6 })
    .from('.headline__line', { yPercent: 60, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, '-=0.35')
    .from('.headline__hl', { clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power2.inOut' }, '-=0.45')
    .from(['.lede', '.hero__ctas'], { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
    .from('.collage', { autoAlpha: 0, duration: 1.2, ease: 'power1.out' }, 0.2);

  // statement: lines rise, then the hand-drawn swash writes itself in
  gsap.timeline({ scrollTrigger: { trigger: '.statement', start: 'top 80%', once: true } })
    .from('.statement__line', { yPercent: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
    .from('.statement__swash', { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power2.inOut' }, '-=0.3');

  // client logos: heading, then the rows (the rows' own transform belongs to the CSS marquee)
  gsap.timeline({ scrollTrigger: { trigger: '.clients', start: 'top 80%', once: true } })
    .from('.clients__head', { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
    .from('.clients__rows', { y: 32, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4');

  // section reveals
  gsap.set('[data-reveal]', { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  // stat counters
  $$('.stat__num[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const n = { v: 0 };
    el.textContent = `0${suffix}`;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => gsap.to(n, {
        v: end,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = `${Math.round(n.v)}${suffix}`; },
      }),
    });
  });

  // work cards: each card eases back as the next one slides over it
  mm.add('(min-width: 901px) and (min-height: 720px)', () => {
    const cards = $$('.case');
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
          scrub: true,
        },
      });
    });
  });

  // delivery map: hub pops, wires draw, stages rise
  mm.add('(min-width: 1181px)', () => {
    const wires = $$('.wire');
    wires.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.build__map', start: 'top 75%', once: true } });
    tl.from('.build__hub', { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)' })
      .to(wires, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.08 }, '-=0.1')
      .from('.stage', { y: 36, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, '-=0.6');
  });
  mm.add('(max-width: 1180px)', () => {
    gsap.from('.stage', {
      y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06,
      scrollTrigger: { trigger: '.build__cards', start: 'top 85%', once: true },
    });
  });

  // principles: cards rise in a cascade
  ScrollTrigger.batch('.pcard', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 48, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }),
  });

  // decorative drift
  gsap.to('.principles__deco', {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: '.principles', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.to('.faq__knot', {
    yPercent: 14,
    rotation: 8,
    ease: 'none',
    scrollTrigger: { trigger: '.faq', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  // footer wordmark rises letter group by letter group
  gsap.from('.wordmark img', {
    yPercent: 60,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.05,
    scrollTrigger: { trigger: '.footer__wordmark', start: 'top 92%', once: true },
  });

  // fonts and lazy images change heights after load
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();

import * as THREE from 'three'

// Procedurally generated textures. Generated lazily, once, and cached —
// zero network requests, tiny bundle, still convincingly material-like.

const cache = new Map()
const isSmall = typeof window !== 'undefined' && window.innerWidth < 768

function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// --- value noise --------------------------------------------------------
function makeNoise(seed = 1) {
  const r = rng(seed)
  const size = 256
  const perm = new Uint8Array(size * 2)
  const vals = new Float32Array(size)
  for (let i = 0; i < size; i++) {
    perm[i] = i
    vals[i] = r()
  }
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  for (let i = 0; i < size; i++) perm[i + size] = perm[i]
  const smooth = (t) => t * t * (3 - 2 * t)
  const n2 = (x, y) => {
    const xi = Math.floor(x) & 255
    const yi = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const a = vals[perm[xi + perm[yi]]]
    const b = vals[perm[xi + 1 + perm[yi]]]
    const c = vals[perm[xi + perm[yi + 1]]]
    const d = vals[perm[xi + 1 + perm[yi + 1]]]
    const u = smooth(xf)
    const v = smooth(yf)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
  return (x, y, oct = 4) => {
    let amp = 0.5
    let f = 1
    let sum = 0
    for (let o = 0; o < oct; o++) {
      sum += amp * n2(x * f, y * f)
      f *= 2
      amp *= 0.5
    }
    return sum
  }
}

function finish(canvas, { repeat = [1, 1], srgb = true, aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(canvas)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.anisotropy = aniso
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

function memo(key, fn) {
  if (!cache.has(key)) cache.set(key, fn())
  return cache.get(key)
}

// --- wood ---------------------------------------------------------------
function drawGrain(ctx, x, y, w, h, base, r, horizontal = true) {
  ctx.fillStyle = base
  ctx.fillRect(x, y, w, h)
  const lines = horizontal ? h / 2.2 : w / 2.2
  for (let i = 0; i < lines; i++) {
    const a = 0.05 + r() * 0.12
    ctx.strokeStyle = r() > 0.5 ? `rgba(40,22,10,${a})` : `rgba(255,235,200,${a * 0.6})`
    ctx.lineWidth = 0.5 + r() * 1.6
    ctx.beginPath()
    const off = r() * (horizontal ? h : w)
    const freq = 0.004 + r() * 0.012
    const amp = 1 + r() * 5
    const ph = r() * 10
    if (horizontal) {
      for (let px = 0; px <= w; px += 8) {
        const py = y + off + Math.sin(px * freq + ph) * amp
        px === 0 ? ctx.moveTo(x + px, py) : ctx.lineTo(x + px, py)
      }
    } else {
      for (let py = 0; py <= h; py += 8) {
        const px = x + off + Math.sin(py * freq + ph) * amp
        py === 0 ? ctx.moveTo(px, y + py) : ctx.lineTo(px, y + py)
      }
    }
    ctx.stroke()
  }
  // knots
  if (r() > 0.6) {
    const kx = x + r() * w
    const ky = y + r() * h
    const g = ctx.createRadialGradient(kx, ky, 0, kx, ky, 14 + r() * 10)
    g.addColorStop(0, 'rgba(50,25,10,0.45)')
    g.addColorStop(1, 'rgba(50,25,10,0)')
    ctx.fillStyle = g
    ctx.fillRect(kx - 30, ky - 30, 60, 60)
  }
}

const WOOD_TONES = {
  oak: ['#b98b5e', '#c49668', '#ad7f53', '#c9a072', '#b3875a'],
  walnut: ['#5a3a24', '#64412a', '#4e321f', '#6b4630', '#573822'],
  ash: ['#d8c3a5', '#cfb999', '#e0cdb0', '#d2bb9a', '#c9b190'],
}

export function woodPlanks(tone = 'oak') {
  return memo('planks-' + tone, () => {
    const S = isSmall ? 512 : 1024
    const [c, ctx] = makeCanvas(S, S)
    const r = rng(tone.length * 97)
    const rows = 8
    const ph = S / rows
    for (let row = 0; row < rows; row++) {
      let x = -r() * S * 0.5
      while (x < S) {
        const len = S * (0.35 + r() * 0.45)
        const tones = WOOD_TONES[tone]
        drawGrain(ctx, x, row * ph, len, ph, tones[Math.floor(r() * tones.length)], r)
        ctx.fillStyle = 'rgba(20,10,4,0.55)'
        ctx.fillRect(x, row * ph, 2, ph)
        x += len
      }
      ctx.fillStyle = 'rgba(20,10,4,0.5)'
      ctx.fillRect(0, row * ph, S, 2)
    }
    return finish(c, { repeat: [2, 2] })
  })
}

export function woodGrain(tone = 'oak') {
  return memo('grain-' + tone, () => {
    const S = isSmall ? 256 : 512
    const [c, ctx] = makeCanvas(S, S)
    const r = rng(tone.length * 13 + 5)
    drawGrain(ctx, 0, 0, S, S, WOOD_TONES[tone][0], r)
    drawGrain(ctx, 0, 0, S, S, 'rgba(0,0,0,0)', r)
    return finish(c)
  })
}

// --- marble -------------------------------------------------------------
export function marble(kind = 'white') {
  return memo('marble-' + kind, () => {
    const S = isSmall ? 256 : 512
    const [c, ctx] = makeCanvas(S, S)
    const img = ctx.createImageData(S, S)
    const noise = makeNoise(kind === 'white' ? 7 : 21)
    const base = kind === 'white' ? [236, 232, 226] : kind === 'green' ? [28, 52, 44] : [26, 24, 24]
    const vein = kind === 'white' ? [168, 160, 150] : kind === 'green' ? [190, 205, 190] : [205, 190, 160]
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const nx = x / S
        const ny = y / S
        const turb = noise(nx * 4, ny * 4, 5)
        const v = Math.abs(Math.sin((nx * 3 + ny * 2 + turb * 3.2) * Math.PI))
        const veinAmt = kind === 'white' ? Math.pow(1 - v, 14) * 0.55 + Math.pow(1 - v, 40) * 0.35 : Math.pow(1 - v, 9) * 0.9 + Math.pow(1 - v, 30) * 0.4
        const cloud = noise(nx * 8 + 10, ny * 8, 3) * 0.12
        const i = (y * S + x) * 4
        for (let k = 0; k < 3; k++) {
          img.data[i + k] = base[k] * (1 - veinAmt) + vein[k] * veinAmt - cloud * 40
        }
        img.data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
    return finish(c)
  })
}

// --- fabric / plaster / concrete ---------------------------------------
export function fabricWeave() {
  return memo('fabric', () => {
    const S = 256
    const [c, ctx] = makeCanvas(S, S)
    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, S, S)
    const r = rng(3)
    for (let y = 0; y < S; y += 2) {
      ctx.fillStyle = `rgba(255,255,255,${0.05 + r() * 0.09})`
      ctx.fillRect(0, y, S, 1)
    }
    for (let x = 0; x < S; x += 2) {
      ctx.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.09})`
      ctx.fillRect(x, 0, 1, S)
    }
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = `rgba(${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},0.04)`
      ctx.fillRect(r() * S, r() * S, 2, 2)
    }
    return finish(c, { repeat: [3, 3], srgb: false })
  })
}

export function plasterNoise(seed = 2, scale = 6) {
  return memo('plaster-' + seed + scale, () => {
    const S = isSmall ? 128 : 256
    const [c, ctx] = makeCanvas(S, S)
    const img = ctx.createImageData(S, S)
    const noise = makeNoise(seed)
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const v = 200 + (noise((x / S) * scale, (y / S) * scale, 4) - 0.5) * 70
        const i = (y * S + x) * 4
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
    ctx.putImageData(img, 0, 0)
    return finish(c, { repeat: [3, 2], srgb: false })
  })
}

export function concrete() {
  return memo('concrete', () => {
    const S = isSmall ? 256 : 512
    const [c, ctx] = makeCanvas(S, S)
    const img = ctx.createImageData(S, S)
    const noise = makeNoise(42)
    const r = rng(9)
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const n = noise((x / S) * 5, (y / S) * 5, 5)
        const v = 120 + n * 70 + (r() - 0.5) * 14
        const i = (y * S + x) * 4
        img.data[i] = v
        img.data[i + 1] = v * 0.98
        img.data[i + 2] = v * 0.95
        img.data[i + 3] = 255
      }
    ctx.putImageData(img, 0, 0)
    // formwork tie holes
    ctx.fillStyle = 'rgba(40,40,40,0.5)'
    for (let y = S / 6; y < S; y += S / 3)
      for (let x = S / 8; x < S; x += S / 4) {
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    return finish(c, { repeat: [2, 1] })
  })
}

// --- rug ----------------------------------------------------------------
export function rugPattern(style = 'classic') {
  return memo('rug-' + style, () => {
    const W = 512
    const H = 352
    const [c, ctx] = makeCanvas(W, H)
    const r = rng(style.length * 31)
    const palettes = {
      classic: ['#d9cbb4', '#b9a284', '#8a6e52', '#efe6d6'],
      sage: ['#a9b19a', '#8e977e', '#cfd3c2', '#6f7862'],
      terracotta: ['#c98d6c', '#a96d50', '#e5c4ae', '#7e4f3a'],
      charcoal: ['#3d3a37', '#55514c', '#7a746c', '#2b2927'],
    }
    const p = palettes[style] || palettes.classic
    ctx.fillStyle = p[0]
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = p[1]
    ctx.lineWidth = 10
    ctx.strokeRect(18, 18, W - 36, H - 36)
    ctx.lineWidth = 3
    ctx.strokeStyle = p[2]
    ctx.strokeRect(36, 36, W - 72, H - 72)
    // abstract organic shapes
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = p[1 + (i % 3)] + '55'
      ctx.beginPath()
      const cx = 60 + r() * (W - 120)
      const cy = 60 + r() * (H - 120)
      ctx.ellipse(cx, cy, 20 + r() * 70, 10 + r() * 40, r() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    // wool fibres
    for (let i = 0; i < 9000; i++) {
      ctx.fillStyle = `rgba(${r() > 0.5 ? '255,255,255' : '0,0,0'},0.05)`
      ctx.fillRect(r() * W, r() * H, 1.5, 1.5)
    }
    return finish(c, { aniso: 4 })
  })
}

// --- abstract wall art --------------------------------------------------
export function artwork(seed = 1) {
  return memo('art-' + seed, () => {
    const W = 384
    const H = 480
    const [c, ctx] = makeCanvas(W, H)
    const r = rng(seed * 1013)
    const palettes = [
      ['#e9e1d3', '#c46b45', '#2f3a36', '#d9a35b', '#8a9a86'],
      ['#efe9e1', '#1f2a33', '#b88b5a', '#7d8f9c', '#d6c4ac'],
      ['#ece4d8', '#5b6b55', '#c9a77c', '#2b2b2b', '#a75b3f'],
      ['#1d1c1a', '#c9a45c', '#6c5b4b', '#e8dfd0', '#3b4a46'],
    ]
    const p = palettes[seed % palettes.length]
    ctx.fillStyle = p[0]
    ctx.fillRect(0, 0, W, H)
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = p[1 + Math.floor(r() * 4)]
      ctx.globalAlpha = 0.75 + r() * 0.25
      const t = r()
      ctx.beginPath()
      if (t < 0.4) {
        ctx.arc(r() * W, r() * H, 30 + r() * 110, 0, Math.PI * (1 + r()))
      } else if (t < 0.7) {
        ctx.rect(r() * W * 0.7, r() * H * 0.7, 40 + r() * 160, 20 + r() * 200)
      } else {
        ctx.moveTo(r() * W, r() * H)
        for (let k = 0; k < 4; k++) ctx.quadraticCurveTo(r() * W, r() * H, r() * W, r() * H)
      }
      ctx.fill()
    }
    ctx.globalAlpha = 1
    for (let i = 0; i < 6000; i++) {
      ctx.fillStyle = `rgba(${r() > 0.5 ? '255,255,255' : '0,0,0'},0.035)`
      ctx.fillRect(r() * W, r() * H, 2, 2)
    }
    return finish(c, { aniso: 4 })
  })
}

// --- window skies -------------------------------------------------------
export function skyView(kind = 'day') {
  return memo('sky-' + kind, () => {
    const W = 1024
    const H = 512
    const [c, ctx] = makeCanvas(W, H)
    const r = rng(kind.length * 7)
    const grads = {
      day: ['#9fc2dd', '#d8e6ee', '#f4ead8'],
      dusk: ['#2c3150', '#b8687a', '#f2b57a'],
      night: ['#05070d', '#121a2e', '#2a2f45'],
      golden: ['#e8b98a', '#f3d2a2', '#fbe9cc'],
    }
    const g = ctx.createLinearGradient(0, 0, 0, H)
    const gc = grads[kind]
    g.addColorStop(0, gc[0])
    g.addColorStop(0.6, gc[1])
    g.addColorStop(1, gc[2])
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    // sun glow
    if (kind !== 'night') {
      const sx = W * 0.7
      const sy = H * (kind === 'dusk' ? 0.72 : 0.35)
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 260)
      sg.addColorStop(0, 'rgba(255,245,220,0.95)')
      sg.addColorStop(0.15, 'rgba(255,230,190,0.5)')
      sg.addColorStop(1, 'rgba(255,230,190,0)')
      ctx.fillStyle = sg
      ctx.fillRect(0, 0, W, H)
    } else {
      for (let i = 0; i < 160; i++) {
        ctx.fillStyle = `rgba(255,255,255,${r() * 0.8})`
        ctx.fillRect(r() * W, r() * H * 0.6, 1.5, 1.5)
      }
    }
    // distant hills / skyline
    const layers = kind === 'night' ? ['#0b0f1a', '#070a12'] : kind === 'dusk' ? ['#4b3a52', '#2d2638'] : ['#9fb3a6', '#6f8a74']
    layers.forEach((col, li) => {
      ctx.fillStyle = col
      ctx.beginPath()
      ctx.moveTo(0, H)
      const base = H * (0.7 + li * 0.1)
      for (let x = 0; x <= W; x += 16) {
        ctx.lineTo(x, base - Math.sin(x * 0.006 + li * 3) * 30 - Math.sin(x * 0.021 + li) * 12 - r() * 4)
      }
      ctx.lineTo(W, H)
      ctx.fill()
    })
    // tree silhouettes / city lights
    for (let i = 0; i < 26; i++) {
      const x = r() * W
      const h = 40 + r() * 90
      if (kind === 'night' || kind === 'dusk') {
        ctx.fillStyle = kind === 'night' ? '#05070c' : '#1f1a28'
        ctx.fillRect(x, H - h, 18 + r() * 30, h)
        ctx.fillStyle = 'rgba(255,210,140,0.85)'
        for (let k = 0; k < 6; k++) if (r() > 0.5) ctx.fillRect(x + 4 + r() * 12, H - h + 6 + r() * (h - 12), 3, 3)
      } else {
        ctx.fillStyle = li2(r)
        ctx.beginPath()
        ctx.ellipse(x, H - h * 0.6, 18 + r() * 24, h * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    return finish(c, { aniso: 2 })
  })
}
function li2(r) {
  const greens = ['#4f6b52', '#5d7a5c', '#3f5a45', '#6a8564']
  return greens[Math.floor(r() * greens.length)]
}

// --- blueprint grid -----------------------------------------------------
export function blueprintGrid() {
  return memo('blueprint', () => {
    const S = 512
    const [c, ctx] = makeCanvas(S, S)
    ctx.fillStyle = '#0f2236'
    ctx.fillRect(0, 0, S, S)
    for (let i = 0; i <= S; i += 16) {
      ctx.strokeStyle = i % 128 === 0 ? 'rgba(160,210,255,0.55)' : 'rgba(160,210,255,0.16)'
      ctx.lineWidth = i % 128 === 0 ? 2 : 1
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, S)
      ctx.moveTo(0, i)
      ctx.lineTo(S, i)
      ctx.stroke()
    }
    return finish(c, { repeat: [3, 2.5] })
  })
}

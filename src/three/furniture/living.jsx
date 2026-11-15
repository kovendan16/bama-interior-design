import { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { B, RB, Cyl, Sph, Plane, geo, seeded, InstancedCyl } from './primitives'
import { useMat } from '../materials'

export function Sofa({ w = 2.4, d = 0.98, m = 'fabricBoucle', leg = 'brass', pillows = ['velvetRust', 'fabricSage', 'fabricSand'], ...props }) {
  const n = w > 2 ? 3 : 2
  const inner = w - 0.36
  const cw = inner / n
  return (
    <group {...props}>
      <RB s={[w, 0.22, d]} p={[0, 0.2, 0]} m={m} radius={0.05} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => <Cyl key={`${sx}${sz}`} rt={0.02} rb={0.015} h={0.1} p={[sx * (w / 2 - 0.1), 0.05, sz * (d / 2 - 0.1)]} m={leg} seg={12} />)
      )}
      <RB s={[w, 0.52, 0.18]} p={[0, 0.55, -d / 2 + 0.09]} m={m} radius={0.07} />
      {[-1, 1].map((sx) => (
        <RB key={sx} s={[0.18, 0.5, d]} p={[sx * (w / 2 - 0.09), 0.45, 0]} m={m} radius={0.08} />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const x = -inner / 2 + cw * (i + 0.5)
        return (
          <group key={i}>
            <RB s={[cw - 0.015, 0.17, d - 0.24]} p={[x, 0.395, 0.09]} m={m} radius={0.07} />
            <RB s={[cw - 0.03, 0.44, 0.2]} p={[x, 0.66, -d / 2 + 0.26]} r={[-0.14, 0, 0]} m={m} radius={0.09} />
          </group>
        )
      })}
      {pillows.slice(0, 3).map((pm, i) => (
        <RB
          key={i}
          s={[0.44, 0.42, 0.13]}
          p={[(i === 0 ? -1 : i === 1 ? 1 : -0.62) * (inner / 2 - 0.3), 0.66, -d / 2 + 0.42 + i * 0.03]}
          r={[-0.3, i === 1 ? -0.25 : 0.25, i === 2 ? 0.2 : 0]}
          m={pm}
          radius={0.1}
        />
      ))}
    </group>
  )
}

export function Armchair({ m = 'velvetEmerald', leg = 'walnut', ...props }) {
  return (
    <group {...props}>
      <RB s={[0.86, 0.2, 0.84]} p={[0, 0.3, 0]} m={m} radius={0.06} />
      <RB s={[0.86, 0.62, 0.16]} p={[0, 0.62, -0.36]} r={[-0.12, 0, 0]} m={m} radius={0.08} />
      {[-1, 1].map((sx) => (
        <RB key={sx} s={[0.14, 0.32, 0.8]} p={[sx * 0.39, 0.52, 0]} m={m} radius={0.06} />
      ))}
      <RB s={[0.6, 0.12, 0.62]} p={[0, 0.45, 0.06]} m={m} radius={0.05} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Cyl key={`${sx}${sz}`} rt={0.025} rb={0.018} h={0.22} p={[sx * 0.35, 0.11, sz * 0.33]} r={[sz * 0.12, 0, -sx * 0.12]} m={leg} seg={10} />
        ))
      )}
    </group>
  )
}

export function LoungeChair({ m = 'leatherCognac', frame = 'walnut', ...props }) {
  return (
    <group {...props}>
      <RB s={[0.78, 0.08, 0.7]} p={[0, 0.34, 0]} r={[-0.08, 0, 0]} m={frame} radius={0.03} />
      <RB s={[0.7, 0.14, 0.62]} p={[0, 0.43, 0.02]} r={[-0.08, 0, 0]} m={m} radius={0.06} />
      <RB s={[0.7, 0.7, 0.14]} p={[0, 0.78, -0.32]} r={[-0.32, 0, 0]} m={m} radius={0.06} />
      {[-1, 1].map((sx) => (
        <group key={sx}>
          <B s={[0.05, 0.05, 0.75]} p={[sx * 0.4, 0.55, 0]} m={frame} />
          <B s={[0.05, 0.55, 0.05]} p={[sx * 0.4, 0.27, 0.3]} m={frame} />
          <B s={[0.05, 0.55, 0.05]} p={[sx * 0.4, 0.27, -0.3]} m={frame} />
        </group>
      ))}
    </group>
  )
}

export function CoffeeTable({ top = 'marbleWhite', base = 'walnut', ...props }) {
  return (
    <group {...props}>
      <Cyl rt={0.58} h={0.045} p={[0, 0.38, 0]} m={top} seg={48} />
      <Cyl rt={0.36} rb={0.4} h={0.355} p={[0, 0.18, 0]} m={base} seg={36} />
      <Books p={[-0.18, 0.4, 0.08]} count={3} seed={4} />
      <Vase p={[0.22, 0.4, -0.12]} kind="bud" m="ceramicSand" />
      <Bowl p={[0.12, 0.4, 0.25]} m="brass" />
    </group>
  )
}

export function RectTable({ w = 1.3, d = 0.7, h = 0.4, top = 'walnut', leg = 'blackMetal', ...props }) {
  return (
    <group {...props}>
      <RB s={[w, 0.05, d]} p={[0, h, 0]} m={top} radius={0.015} />
      {[-1, 1].map((sx) => (
        <B key={sx} s={[0.04, h - 0.02, d - 0.15]} p={[sx * (w / 2 - 0.12), (h - 0.02) / 2, 0]} m={leg} />
      ))}
    </group>
  )
}

export function SideTable({ top = 'marbleBlack', base = 'brass', ...props }) {
  return (
    <group {...props}>
      <Cyl rt={0.24} h={0.03} p={[0, 0.55, 0]} m={top} />
      <Cyl rt={0.02} h={0.54} p={[0, 0.27, 0]} m={base} seg={10} />
      <Cyl rt={0.16} h={0.02} p={[0, 0.01, 0]} m={base} />
    </group>
  )
}

export function Rug({ w = 3.2, d = 2.2, m = 'rugClassic', ...props }) {
  return (
    <group {...props}>
      <B s={[w, 0.012, d]} p={[0, 0.006, 0]} m={m} />
    </group>
  )
}

export function RoundRug({ radius = 1.4, m = 'rugSage', ...props }) {
  return (
    <group {...props}>
      <Cyl rt={radius} h={0.012} p={[0, 0.006, 0]} m={m} seg={64} />
    </group>
  )
}

export function MediaConsole({ w = 2.6, m = 'walnut', ...props }) {
  const flutes = Math.floor(w / 0.05)
  return (
    <group {...props}>
      <RB s={[w, 0.5, 0.45]} p={[0, 0.33, 0]} m={m} radius={0.015} />
      <B s={[w + 0.02, 0.03, 0.47]} p={[0, 0.595, 0]} m="marbleBlack" />
      <InstancedCyl rt={0.018} h={0.44} m={m} items={Array.from({ length: flutes }, (_, i) => [-w / 2 + 0.04 + i * 0.05, 0.33, 0.228])} />
      {[-1, 1].map((sx) => (
        <B key={sx} s={[0.04, 0.08, 0.35]} p={[sx * (w / 2 - 0.2), 0.04, 0]} m="blackMetal" />
      ))}
      <Vase p={[w / 2 - 0.3, 0.61, 0]} kind="tall" m="ceramicBlack" />
      <Books p={[-w / 2 + 0.4, 0.61, 0]} count={4} seed={9} />
      <Sph radius={0.09} p={[-w / 2 + 0.75, 0.7, 0]} m="travertine" />
    </group>
  )
}

export function TV({ w = 1.9, ...props }) {
  return (
    <group {...props}>
      <B s={[w, w * 0.5625, 0.04]} m="blackMetal" />
      <B s={[w - 0.03, w * 0.5625 - 0.03, 0.005]} p={[0, 0, 0.022]} m="screen" shadow={false} />
    </group>
  )
}

export function WallArt({ w = 0.9, h = 1.15, art = 'art1', frame = 'oak', ...props }) {
  return (
    <group {...props}>
      <B s={[w + 0.06, h + 0.06, 0.04]} m={frame} />
      <B s={[w, h, 0.01]} p={[0, 0, 0.022]} m="paper" shadow={false} />
      <Plane s={[w - 0.14, h - 0.14]} p={[0, 0, 0.028]} m={art} />
    </group>
  )
}

export function Shelving({ w = 1.8, h = 2.4, d = 0.34, m = 'oak', seed = 1, ...props }) {
  const rows = Math.floor(h / 0.42)
  return (
    <group {...props}>
      {[-1, 1].map((sx) => (
        <B key={sx} s={[0.035, h, d]} p={[sx * (w / 2), h / 2, 0]} m={m} />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <B key={i} s={[w, 0.03, d]} p={[0, 0.06 + i * (h - 0.08) / rows, 0]} m={m} />
      ))}
      <BookRows w={w - 0.1} rows={rows} rowH={(h - 0.08) / rows} d={d} seed={seed} />
      {Array.from({ length: rows }, (_, i) => {
        const y = 0.075 + i * ((h - 0.08) / rows)
        const r = seeded(seed * 17 + i)
        const x = (r() - 0.5) * w * 0.4 + w * 0.25
        return i % 2 === 0 ? <Vase key={i} p={[x, y, 0]} kind={i % 4 === 0 ? 'round' : 'bud'} m={i % 4 === 0 ? 'ceramicWhite' : 'stoneware'} /> : <Bowl key={i} p={[x, y, 0]} m="ceramicSand" />
      })}
    </group>
  )
}

const BOOK_COLORS = ['#7b2f24', '#24364a', '#c9b48f', '#3e5243', '#e6dfd2', '#1f1e1c', '#a6713f', '#6b6f73', '#8e7c64', '#b8a27c']

function BookRows({ w, rows, rowH, d, seed }) {
  const ref = useRef()
  const mat = useMat('book')
  const data = useMemo(() => {
    const r = seeded(seed * 101)
    const items = []
    for (let row = 0; row < rows; row++) {
      let x = -w / 2
      const limit = -w / 2 + w * (0.45 + r() * 0.2)
      while (x < limit) {
        const bw = 0.025 + r() * 0.03
        const bh = rowH * (0.55 + r() * 0.3)
        items.push({ x: x + bw / 2, y: 0.075 + row * rowH + bh / 2, bw, bh, bd: d * (0.6 + r() * 0.25), c: BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)], tilt: r() > 0.92 ? 0.2 : 0 })
        x += bw + 0.003
      }
    }
    return items
  }, [w, rows, rowH, d, seed])
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const col = new THREE.Color()
    data.forEach((b, i) => {
      e.set(0, 0, b.tilt)
      q.setFromEuler(e)
      m.compose(new THREE.Vector3(b.x, b.y, 0), q, new THREE.Vector3(b.bw, b.bh, b.bd))
      ref.current.setMatrixAt(i, m)
      ref.current.setColorAt(i, col.set(b.c))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [data])
  return <instancedMesh ref={ref} args={[geo('box', () => new THREE.BoxGeometry(1, 1, 1)), mat, data.length]} castShadow receiveShadow />
}

export function Books({ count = 3, seed = 1, ...props }) {
  const r = seeded(seed)
  let y = 0
  return (
    <group {...props}>
      {Array.from({ length: count }, (_, i) => {
        const h = 0.03 + r() * 0.02
        const el = <B key={i} s={[0.24 - i * 0.02, h, 0.17 - i * 0.01]} p={[0, y + h / 2, 0]} r={[0, (r() - 0.5) * 0.4, 0]} m={i % 2 ? 'linenGrey' : 'fabricCharcoal'} />
        y += h
        return el
      })}
    </group>
  )
}

export function Vase({ kind = 'round', m = 'ceramicWhite', ...props }) {
  const profiles = {
    round: [[0, 0], [0.06, 0], [0.11, 0.06], [0.12, 0.13], [0.08, 0.22], [0.04, 0.26], [0.045, 0.3], [0, 0.3]],
    bud: [[0, 0], [0.04, 0], [0.06, 0.05], [0.05, 0.12], [0.02, 0.17], [0.025, 0.2], [0, 0.2]],
    tall: [[0, 0], [0.07, 0], [0.09, 0.15], [0.07, 0.38], [0.05, 0.45], [0.06, 0.48], [0, 0.48]],
  }
  return (
    <group {...props}>
      <LatheShape profile={profiles[kind]} name={'vase-' + kind} m={m} />
    </group>
  )
}

export function Bowl({ m = 'ceramicWhite', ...props }) {
  return (
    <group {...props}>
      <LatheShape profile={[[0, 0], [0.05, 0], [0.11, 0.03], [0.14, 0.07], [0.13, 0.072], [0.1, 0.035], [0, 0.02]]} name="bowl" m={m} />
    </group>
  )
}

function LatheShape({ profile, name, m }) {
  const mat = useMat(m)
  const g = geo('lathe-' + name, () => {
    const lg = new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 32)
    lg.computeVertexNormals()
    return lg
  })
  return <mesh geometry={g} material={mat} castShadow receiveShadow />
}

export function Ottoman({ m = 'leatherCognac', ...props }) {
  return (
    <group {...props}>
      <Cyl rt={0.32} h={0.38} p={[0, 0.19, 0]} m={m} seg={32} />
      <Cyl rt={0.3} h={0.02} p={[0, 0.39, 0]} m={m} seg={32} />
    </group>
  )
}

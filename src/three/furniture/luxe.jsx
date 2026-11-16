import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { B, RB, Cyl, Sph, Torus, InstancedCyl } from './primitives'

/*
 * MODERN LUXURY LIVING — contemporary pieces for the showcase living room:
 * cream leather sofa, cognac club chairs, mustard velvet tub chair, marble &
 * gold nesting tables, arched gold console, LED ring chandelier, ceiling fan,
 * sunburst mirror, fluted wood columns and backlit veneer niches.
 * All built from primitives so they load instantly and animate like the rest.
 * Every piece stands on y = 0 and faces +z unless noted.
 */

/* ------------------------------------------------------------------ seating */

/** Three-seater in leather: track arms, plump cushions, slim gold feet. */
export function LuxeSofa({ w = 3.2, d = 0.98, m, feet }) {
  const inner = w - 0.42
  const seat = inner / 3
  return (
    <group>
      <RB s={[w, 0.2, d]} p={[0, 0.18, 0]} m={m} radius={0.05} />
      {[-1, 0, 1].map((i) => (
        <RB key={'s' + i} s={[seat - 0.025, 0.17, d - 0.2]} p={[i * seat, 0.36, 0.06]} m={m} radius={0.07} seg={4} />
      ))}
      {[-1, 0, 1].map((i) => (
        <RB key={'b' + i} s={[seat - 0.03, 0.5, 0.22]} p={[i * seat, 0.68, -d / 2 + 0.17]} r={[-0.14, 0, 0]} m={m} radius={0.09} seg={4} />
      ))}
      <RB s={[inner + 0.04, 0.5, 0.16]} p={[0, 0.5, -d / 2 + 0.08]} m={m} radius={0.04} />
      {[-1, 1].map((sx) => (
        <RB key={sx} s={[0.21, 0.52, d]} p={[sx * (w / 2 - 0.105), 0.36, 0]} m={m} radius={0.08} seg={4} />
      ))}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => <B key={`${sx}${sz}`} s={[0.05, 0.08, 0.05]} p={[sx * (w / 2 - 0.12), 0.04, sz * (d / 2 - 0.1)]} m={feet} />),
      )}
    </group>
  )
}

/** Charcoal + mustard cushions and a draped throw for the sofa above. */
export function SofaSoftFurnishing({ w = 3.2, d = 0.98, cushion, accent, throwM }) {
  const z = -d / 2 + 0.36
  return (
    <group>
      <RB s={[0.46, 0.44, 0.14]} p={[-w / 2 + 0.48, 0.66, z]} r={[-0.25, 0.25, 0.12]} m={cushion} radius={0.07} seg={4} />
      <RB s={[0.42, 0.4, 0.13]} p={[-w / 2 + 0.88, 0.63, z + 0.04]} r={[-0.25, 0.1, -0.08]} m={accent} radius={0.07} seg={4} />
      <RB s={[0.46, 0.44, 0.14]} p={[w / 2 - 0.48, 0.66, z]} r={[-0.25, -0.25, -0.12]} m={cushion} radius={0.07} seg={4} />
      {/* throw folded over the seat and spilling down the front */}
      <RB s={[0.62, 0.025, 0.66]} p={[w / 2 - 0.62, 0.465, 0.12]} r={[0, 0.12, 0]} m={throwM} radius={0.01} />
      <RB s={[0.6, 0.34, 0.025]} p={[w / 2 - 0.6, 0.3, d / 2 - 0.03]} r={[0.08, 0.12, 0]} m={throwM} radius={0.01} />
    </group>
  )
}

/** Low leather club chair with rounded arms. */
export function ClubChair({ m, feet }) {
  return (
    <group>
      <RB s={[0.86, 0.3, 0.84]} p={[0, 0.23, 0]} m={m} radius={0.08} seg={4} />
      <RB s={[0.56, 0.14, 0.66]} p={[0, 0.43, 0.06]} m={m} radius={0.06} seg={4} />
      <RB s={[0.86, 0.46, 0.2]} p={[0, 0.58, -0.32]} r={[-0.1, 0, 0]} m={m} radius={0.09} seg={4} />
      {[-1, 1].map((sx) => (
        <RB key={sx} s={[0.17, 0.28, 0.82]} p={[sx * 0.345, 0.5, 0]} m={m} radius={0.08} seg={4} />
      ))}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => <Cyl key={`${sx}${sz}`} rt={0.022} rb={0.016} h={0.08} p={[sx * 0.34, 0.04, sz * 0.33]} m={feet} seg={10} />),
      )}
    </group>
  )
}

/** Barrel-back swivel tub chair in velvet on a gold disc base. */
export function TubChair({ m, base }) {
  const shell = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.42, 0.4, 0.42, 40, 1, true, Math.PI * 0.2, Math.PI * 1.6)
    return g
  }, [])
  const rim = useMemo(() => new THREE.TorusGeometry(0.38, 0.07, 14, 40, Math.PI * 1.6), [])
  // the open back shell is seen from both sides
  const both = useMemo(() => {
    const c = m.clone()
    c.side = THREE.DoubleSide
    return c
  }, [m])
  return (
    <group>
      <Cyl rt={0.24} h={0.03} p={[0, 0.015, 0]} m={base} seg={36} />
      <Cyl rt={0.05} h={0.14} p={[0, 0.09, 0]} m={base} seg={14} />
      <Cyl rt={0.4} rb={0.36} h={0.24} p={[0, 0.27, 0]} m={m} seg={40} />
      <Cyl rt={0.36} h={0.12} p={[0, 0.44, 0.02]} m={m} seg={40} />
      <mesh geometry={shell} material={both} position={[0, 0.6, 0]} scale={[0.95, 1, 0.95]} castShadow receiveShadow />
      {/* rolled top edge of the barrel back; the opening faces +z */}
      <mesh geometry={rim} material={m} position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, Math.PI * 0.2 - Math.PI / 2]} castShadow />
    </group>
  )
}

/** Round pouf. */
export function Pouf({ m, r = 0.3, h = 0.4 }) {
  return (
    <group>
      <Cyl rt={r} h={h - 0.06} p={[0, (h - 0.06) / 2 + 0.02, 0]} m={m} seg={36} />
      <Torus radius={r - 0.03} tube={0.04} p={[0, h - 0.06, 0]} r={[Math.PI / 2, 0, 0]} m={m} seg={36} />
      <Cyl rt={r - 0.04} h={0.04} p={[0, h - 0.04, 0]} m={m} seg={36} />
    </group>
  )
}

/* ------------------------------------------------------------------ tables */

function RoundTable({ r, h, top, frame }) {
  return (
    <group>
      <Cyl rt={r} h={0.035} p={[0, h - 0.0175, 0]} m={top} seg={48} />
      <Torus radius={r - 0.02} tube={0.012} p={[0, h - 0.045, 0]} r={[Math.PI / 2, 0, 0]} m={frame} seg={48} />
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2
        return <Cyl key={i} rt={0.012} h={h - 0.05} p={[Math.cos(a) * (r - 0.06), (h - 0.05) / 2, Math.sin(a) * (r - 0.06)]} m={frame} seg={8} />
      })}
      <Torus radius={r - 0.06} tube={0.01} p={[0, 0.012, 0]} r={[Math.PI / 2, 0, 0]} m={frame} seg={40} />
    </group>
  )
}

/** Pair of nesting round tables — white marble on gold frames. */
export function NestingTables({ top, frame }) {
  return (
    <group>
      <RoundTable r={0.5} h={0.42} top={top} frame={frame} />
      <group position={[0.62, 0, 0.32]}>
        <RoundTable r={0.36} h={0.34} top={top} frame={frame} />
      </group>
    </group>
  )
}

export function SideTable({ top, frame }) {
  return (
    <group>
      <Cyl rt={0.26} h={0.03} p={[0, 0.6, 0]} m={top} seg={40} />
      <Cyl rt={0.03} h={0.58} p={[0, 0.3, 0]} m={frame} seg={12} />
      <Cyl rt={0.18} h={0.025} p={[0, 0.0125, 0]} m={frame} seg={36} />
    </group>
  )
}

/** Console with interlocking gold arches and a marble top (2.0 m, faces +z). */
export function ArchConsole({ top, frame, w = 2.0 }) {
  return (
    <group>
      <B s={[w, 0.04, 0.42]} p={[0, 0.84, 0]} m={top} />
      <B s={[w - 0.1, 0.03, 0.36]} p={[0, 0.8, 0]} m={frame} />
      <B s={[w - 0.3, 0.03, 0.26]} p={[0, 0.015, 0]} m={frame} />
      {[-0.42, 0.42].map((x) => (
        <group key={x}>
          <Torus radius={0.39} tube={0.024} arc={Math.PI} p={[x, 0.03, 0]} m={frame} seg={40} />
          <Torus radius={0.39} tube={0.024} arc={Math.PI} p={[x, 0.79, 0]} r={[0, 0, Math.PI]} m={frame} seg={40} />
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ lighting */

/** Cluster of LED rings hanging from the ceiling (world heights, y = 0 floor). */
export function RingChandelier({ gold, glow, ceiling = 4 }) {
  const rings = [
    { r: 0.62, y: 3.12, x: -0.1, z: 0, t: 0.06 },
    { r: 0.44, y: 2.92, x: 0.42, z: 0.18, t: -0.08 },
    { r: 0.32, y: 3.28, x: 0.32, z: -0.32, t: 0.1 },
    { r: 0.18, y: 2.78, x: -0.36, z: 0.3, t: 0 },
  ]
  return (
    <group>
      <Cyl rt={0.16} h={0.04} p={[0.08, ceiling - 0.02, 0]} m={gold} seg={32} shadow={false} />
      {rings.map((k, i) => (
        <group key={i} position={[k.x, k.y, k.z]} rotation={[Math.PI / 2 + k.t, 0, k.t * 0.6]}>
          <Torus radius={k.r} tube={0.028} m={gold} seg={64} shadow={false} />
          <Torus radius={k.r - 0.012} tube={0.016} p={[0, 0, 0.018]} m={glow} seg={64} shadow={false} />
        </group>
      ))}
      {rings.map((k, i) => (
        <Cyl key={'w' + i} rt={0.003} h={ceiling - k.y} p={[k.x + k.r * 0.7, (ceiling + k.y) / 2, k.z]} m={gold} seg={4} shadow={false} />
      ))}
    </group>
  )
}

/** Three-blade ceiling fan; blades turn slowly once installed (spin 0..1). */
export function CeilingFan({ body, trim, ceiling = 4, drop = 0.48, spin = () => 1 }) {
  const blades = useRef()
  useFrame((_, dt) => {
    if (blades.current) blades.current.rotation.y += Math.min(dt, 0.05) * 1.6 * spin()
  })
  const y = ceiling - drop
  return (
    <group>
      <Cyl rt={0.09} rb={0.11} h={0.06} p={[0, ceiling - 0.03, 0]} m={body} seg={24} shadow={false} />
      <Cyl rt={0.014} h={drop - 0.06} p={[0, ceiling - drop / 2 - 0.02, 0]} m={body} seg={8} shadow={false} />
      <Cyl rt={0.15} rb={0.12} h={0.11} p={[0, y, 0]} m={body} seg={32} shadow={false} />
      <Torus radius={0.15} tube={0.01} p={[0, y + 0.02, 0]} r={[Math.PI / 2, 0, 0]} m={trim} seg={32} shadow={false} />
      <Sph radius={0.07} p={[0, y - 0.07, 0]} m={body} seg={20} theta={Math.PI / 2} r={[Math.PI, 0, 0]} shadow={false} />
      <group ref={blades} position={[0, y, 0]}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
            <RB s={[0.66, 0.014, 0.13]} p={[0.48, 0, 0]} r={[0.1, 0, 0]} m={body} radius={0.006} shadow={false} />
          </group>
        ))}
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ walls */

/** Vertical fluted wood column (faces +z). */
export function FlutedColumn({ w = 0.5, h = 3.6, m }) {
  const items = useMemo(() => {
    const out = []
    const n = Math.round(w / 0.05)
    for (let i = 0; i < n; i++) out.push([-w / 2 + 0.025 + i * 0.05, h / 2, 0.03])
    return out
  }, [w, h])
  return (
    <group>
      <B s={[w, h, 0.04]} p={[0, h / 2, 0]} m={m} />
      <InstancedCyl rt={0.024} h={h} m={m} items={items} shadow />
    </group>
  )
}

/** Wood-veneer frame around a recessed, softly backlit panel (faces +z). */
export function BacklitNiche({ w = 1.0, h = 2.7, frame, glow, y0 = 0.08 }) {
  const t = 0.09
  const cy = y0 + h / 2
  return (
    <group>
      <B s={[w, t, 0.14]} p={[0, y0 + h - t / 2, 0.07]} m={frame} />
      <B s={[w, t, 0.14]} p={[0, y0 + t / 2, 0.07]} m={frame} />
      <B s={[t, h, 0.14]} p={[-w / 2 + t / 2, cy, 0.07]} m={frame} />
      <B s={[t, h, 0.14]} p={[w / 2 - t / 2, cy, 0.07]} m={frame} />
      <B s={[w - 2 * t, h - 2 * t, 0.02]} p={[0, cy, 0.01]} m={glow} shadow={false} />
      <B s={[w - 2 * t - 0.12, 0.025, 0.12]} p={[0, y0 + h * 0.42, 0.07]} m={frame} />
    </group>
  )
}

/** Gold sunburst with a round mirror centre (faces +z). */
export function SunburstMirror({ gold, mirror, r = 0.55 }) {
  const rays = 28
  return (
    <group>
      <Cyl rt={0.22} h={0.025} p={[0, 0, 0.02]} r={[Math.PI / 2, 0, 0]} m={mirror} seg={40} />
      <Torus radius={0.235} tube={0.02} p={[0, 0, 0.025]} m={gold} seg={48} />
      {Array.from({ length: rays }, (_, i) => {
        const a = (i / rays) * Math.PI * 2
        const len = (i % 2 ? 0.62 : 1) * (r - 0.25)
        const mid = 0.25 + len / 2
        return <B key={i} s={[0.014, len, 0.012]} p={[Math.cos(a) * mid, Math.sin(a) * mid, 0.015]} r={[0, 0, a - Math.PI / 2]} m={gold} shadow={false} />
      })}
    </group>
  )
}

import { useMemo } from 'react'
import * as THREE from 'three'
import { B, RB, Cyl, Sph, seeded } from './primitives'

/*
 * Pieces for the restyled showcase bedroom (painted-mural, bubble-bed look) and
 * the open-plan office (benching desks, planter partitions, linear lights).
 * Every piece stands on y = 0 and faces +z unless noted.
 */

/* ================================================================ BEDROOM */

/**
 * Low platform bed wrapped in puffy bouclé "bubble" segments, with a tufted
 * bubble headboard, striped bedding and a long bolster. Head at -z.
 */
export function BubbleBed({ w = 2.5, l = 2.55, frame, bedding, bolster }) {
  const seg = 0.27
  const rail = useMemo(() => {
    const out = []
    // foot rail across x, side rails along z (corner pieces turned 45°)
    const nFoot = Math.round((w - 0.1) / seg)
    for (let i = 0; i < nFoot; i++) out.push({ p: [-w / 2 + 0.05 + seg / 2 + i * seg, l / 2 - 0.16], ry: 0 })
    const nSide = Math.round((l - 0.55) / seg)
    for (let i = 0; i < nSide; i++) {
      const z = l / 2 - 0.42 - i * seg
      out.push({ p: [-w / 2 + 0.16, z], ry: Math.PI / 2 })
      out.push({ p: [w / 2 - 0.16, z], ry: Math.PI / 2 })
    }
    return out
  }, [w, l])
  const tufts = useMemo(() => {
    const out = []
    const cols = 11
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < cols - (row === 2 ? 1 : 0); c++) {
        const x = -w / 2 + 0.2 + (c + (row === 2 ? 0.5 : 0)) * ((w - 0.4) / (cols - 1))
        out.push([x, 0.42 + row * 0.19, -l / 2 + 0.2 + row * 0.02])
      }
    }
    return out
  }, [w, l])
  return (
    <group>
      {/* plinth and headboard backing */}
      <RB s={[w - 0.1, 0.16, l - 0.1]} p={[0, 0.08, 0]} m={frame} radius={0.06} />
      <RB s={[w + 0.1, 0.62, 0.34]} p={[0, 0.6, -l / 2 + 0.05]} m={frame} radius={0.16} seg={5} />
      {tufts.map((p, i) => (
        <Sph key={i} radius={0.13} p={p} s={[1.05, 1, 0.62]} m={frame} seg={16} />
      ))}
      {rail.map((s, i) => (
        <RB key={i} s={[seg - 0.012, 0.44, 0.32]} p={[s.p[0], 0.24, s.p[1]]} r={[0, s.ry, 0]} m={frame} radius={0.14} seg={5} />
      ))}
      {/* mattress, duvet with a folded top, bolster */}
      <RB s={[w - 0.6, 0.24, l - 0.55]} p={[0, 0.34, 0.02]} m={bedding} radius={0.05} />
      <RB s={[w - 0.56, 0.06, l - 0.95]} p={[0, 0.48, 0.2]} m={bedding} radius={0.03} />
      <Cyl rt={0.14} h={w - 0.62} p={[0, 0.58, -l / 2 + 0.42]} r={[0, 0, Math.PI / 2]} m={bolster} seg={24} />
    </group>
  )
}

/** Two-drawer walnut nightstand. */
export function WalnutNightstand({ m, knob }) {
  return (
    <group>
      <B s={[0.5, 0.56, 0.42]} p={[0, 0.3, 0]} m={m} />
      <B s={[0.46, 0.012, 0.01]} p={[0, 0.3, 0.212]} m={knob} shadow={false} />
      {[0.18, 0.42].map((y) => (
        <Sph key={y} radius={0.016} p={[0, y, 0.22]} m={knob} seg={10} shadow={false} />
      ))}
      <B s={[0.44, 0.02, 0.36]} p={[0, 0.01, 0]} m={m} />
    </group>
  )
}

/** Table lamp: stacked blue glass beads and a sage drum shade. */
export function BeadedLamp({ glass, shade, bulb }) {
  const shadeGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.2, 0.24, 32, 1, true), [])
  return (
    <group>
      <Cyl rt={0.075} rb={0.085} h={0.03} p={[0, 0.015, 0]} m={glass} seg={24} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sph key={i} radius={0.05 - i * 0.003} p={[0, 0.07 + i * 0.075, 0]} s={[1, 0.9, 1]} m={glass} seg={18} />
      ))}
      <Sph radius={0.04} p={[0, 0.56, 0]} m={bulb} seg={12} shadow={false} />
      <mesh geometry={shadeGeo} material={shade} position={[0, 0.6, 0]} castShadow />
    </group>
  )
}

/** Floor-to-ceiling linen curtains under an upholstered pelmet box (spans x0..x1 on the back wall). */
export function PelmetCurtains({ x0, x1, h = 3.7, m, pelmet, Curtain }) {
  const w = x1 - x0
  return (
    <group>
      <B s={[w, 0.5, 0.26]} p={[(x0 + x1) / 2, h - 0.25, 0.13]} m={pelmet} />
      <Curtain w={w * 0.3} h={h - 0.45} position={[x0 + w * 0.17, h - 0.45, 0.1]} m={m} animated={false} />
      <Curtain w={w * 0.3} h={h - 0.45} position={[x1 - w * 0.17, h - 0.45, 0.1]} m={m} animated={false} />
    </group>
  )
}

/* ================================================================ OFFICE */

/** Mesh-back ergonomic task chair (faces +z). */
export function TaskChair({ mesh, frame }) {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} rotation={[0, a, 0]}>
            <B s={[0.03, 0.03, 0.3]} p={[0, 0.07, 0.15]} m={frame} />
            <Sph radius={0.025} p={[0, 0.03, 0.29]} m={frame} seg={8} shadow={false} />
          </group>
        )
      })}
      <Cyl rt={0.025} h={0.32} p={[0, 0.24, 0]} m={frame} seg={10} />
      <RB s={[0.5, 0.08, 0.48]} p={[0, 0.45, 0.02]} m={mesh} radius={0.035} />
      {/* curved mesh back on a frame */}
      <RB s={[0.46, 0.56, 0.04]} p={[0, 0.82, -0.22]} r={[-0.12, 0, 0]} m={mesh} radius={0.02} />
      <B s={[0.05, 0.4, 0.04]} p={[0, 0.58, -0.24]} m={frame} />
      {[-1, 1].map((sx) => (
        <group key={sx}>
          <B s={[0.03, 0.2, 0.03]} p={[sx * 0.27, 0.56, 0]} m={frame} />
          <RB s={[0.06, 0.03, 0.26]} p={[sx * 0.27, 0.66, 0.02]} m={frame} radius={0.01} />
        </group>
      ))}
    </group>
  )
}

/**
 * Two-sided benching desk: walnut top on black frames, a black-framed glass
 * privacy screen down the spine, black pedestals. Long axis along x.
 */
export function BenchDesk({ len = 4.2, depth = 1.5, top, frame, screen, pedestal, seats = 3 }) {
  const legs = [-len / 2 + 0.05, 0, len / 2 - 0.05]
  const bay = len / seats
  return (
    <group>
      <B s={[len, 0.03, depth]} p={[0, 0.735, 0]} m={top} />
      {legs.map((x) => (
        <group key={x}>
          <B s={[0.05, 0.72, 0.05]} p={[x, 0.36, -depth / 2 + 0.08]} m={frame} />
          <B s={[0.05, 0.72, 0.05]} p={[x, 0.36, depth / 2 - 0.08]} m={frame} />
          <B s={[0.05, 0.05, depth - 0.1]} p={[x, 0.7, 0]} m={frame} />
        </group>
      ))}
      <B s={[len, 0.04, 0.04]} p={[0, 0.66, 0]} m={frame} />
      {/* spine screens */}
      {Array.from({ length: seats }, (_, i) => {
        const x = -len / 2 + bay * (i + 0.5)
        return (
          <group key={i}>
            <B s={[bay - 0.06, 0.38, 0.012]} p={[x, 0.95, 0]} m={screen} shadow={false} />
            <B s={[bay - 0.04, 0.025, 0.03]} p={[x, 1.15, 0]} m={frame} />
            <B s={[0.025, 0.4, 0.03]} p={[x - bay / 2 + 0.02, 0.95, 0]} m={frame} />
            {[-1, 1].map((sz) => (
              <B key={sz} s={[0.4, 0.58, 0.5]} p={[x + bay / 2 - 0.3, 0.3, sz * (depth / 2 - 0.35)]} m={pedestal} />
            ))}
          </group>
        )
      })}
    </group>
  )
}

/**
 * Walnut storage cabinet with a planter box on top and a black steel grid
 * frame rising above it holding small pots (partition). Long axis along z.
 */
export function PlanterDivider({ len = 2.0, h = 2.75, wood, frame, soil, Plant, seed = 1 }) {
  const r = useMemo(() => seeded(seed), [seed])
  const plants = useMemo(() => {
    const out = []
    const n = Math.round(len / 0.32)
    for (let i = 0; i < n; i++) out.push({ z: -len / 2 + 0.16 + i * 0.32, h: 0.45 + r() * 0.25, s: 10 + Math.floor(r() * 100) })
    return out
  }, [len, r])
  const posts = [
    [-0.24, -len / 2 + 0.02],
    [0.24, -len / 2 + 0.02],
    [-0.24, len / 2 - 0.02],
    [0.24, len / 2 - 0.02],
  ]
  return (
    <group>
      <B s={[0.5, 0.95, len]} p={[0, 0.475, 0]} m={wood} />
      <B s={[0.5, 0.3, len]} p={[0, 1.1, 0]} m={wood} />
      <B s={[0.44, 0.02, len - 0.06]} p={[0, 1.24, 0]} m={soil} shadow={false} />
      {plants.map((p, i) => (
        <group key={i} position={[0, 1.0, p.z]}>
          <Plant height={p.h + 0.25} leaves={14} seed={p.s} pot={soil} />
        </group>
      ))}
      {/* steel grid frame */}
      {posts.map(([x, z], i) => (
        <B key={i} s={[0.035, h, 0.035]} p={[x, h / 2, z]} m={frame} />
      ))}
      {[1.95, h].map((y) => (
        <group key={y}>
          <B s={[0.5, 0.035, 0.035]} p={[0, y, -len / 2 + 0.02]} m={frame} />
          <B s={[0.5, 0.035, 0.035]} p={[0, y, len / 2 - 0.02]} m={frame} />
          <B s={[0.035, 0.035, len]} p={[-0.24, y, 0]} m={frame} />
          <B s={[0.035, 0.035, len]} p={[0.24, y, 0]} m={frame} />
        </group>
      ))}
      <B s={[0.035, 0.035, len]} p={[0, h, 0]} m={frame} />
      <B s={[0.46, 0.02, len * 0.5]} p={[0, 1.95, 0]} m={frame} />
      {[-0.25, 0.25].map((z) => (
        <group key={z} position={[0, 1.96, z * len * 0.6]}>
          <B s={[0.18, 0.18, 0.18]} p={[0, 0.09, 0]} m={wood} />
          <Plant height={0.5} leaves={10} seed={seed * 7 + (z > 0 ? 3 : 1)} pot={soil} />
        </group>
      ))}
    </group>
  )
}

/** Suspended black steel grid carrying linear LED bars (world heights). */
export function LightGrid({ w = 7, d = 5.6, y = 3.15, frame, led, bays = 3 }) {
  const xs = Array.from({ length: bays + 1 }, (_, i) => -w / 2 + (w / bays) * i)
  return (
    <group>
      <B s={[w, 0.05, 0.05]} p={[0, y, -d / 2]} m={frame} />
      <B s={[w, 0.05, 0.05]} p={[0, y, d / 2]} m={frame} />
      <B s={[w, 0.05, 0.05]} p={[0, y, 0]} m={frame} />
      {xs.map((x) => (
        <group key={x}>
          <B s={[0.05, 0.05, d]} p={[x, y, 0]} m={frame} />
          <Cyl rt={0.006} h={4 - y} p={[x, (4 + y) / 2, -d / 2]} m={frame} seg={4} shadow={false} />
          <Cyl rt={0.006} h={4 - y} p={[x, (4 + y) / 2, d / 2]} m={frame} seg={4} shadow={false} />
        </group>
      ))}
      {[-d / 4, d / 4].map((z) =>
        xs.slice(0, -1).map((x) => (
          <group key={`${x}${z}`}>
            <B s={[w / bays - 0.4, 0.035, 0.06]} p={[x + w / bays / 2, y - 0.05, z]} m={frame} shadow={false} />
            <B s={[w / bays - 0.44, 0.012, 0.04]} p={[x + w / bays / 2, y - 0.072, z]} m={led} shadow={false} />
          </group>
        )),
      )}
    </group>
  )
}

/** Long planter box of snake plants (long axis along x). */
export function SnakePlanter({ len = 3, wood, leafDark, leafEdge, seed = 3 }) {
  const blades = useMemo(() => {
    const r = seeded(seed)
    const out = []
    const n = Math.round(len * 22)
    for (let i = 0; i < n; i++) {
      out.push({
        x: -len / 2 + 0.08 + r() * (len - 0.16),
        z: (r() - 0.5) * 0.22,
        h: 0.45 + r() * 0.55,
        ry: r() * Math.PI,
        rx: (r() - 0.5) * 0.25,
        rz: (r() - 0.5) * 0.25,
        edge: r() < 0.35,
      })
    }
    return out
  }, [len, seed])
  return (
    <group>
      <B s={[len, 0.5, 0.36]} p={[0, 0.25, 0]} m={wood} />
      {blades.map((b, i) => (
        <group key={i} position={[b.x, 0.5, b.z]} rotation={[b.rx, b.ry, b.rz]}>
          <mesh position={[0, b.h / 2, 0]} scale={[0.07, b.h, 0.012]} material={b.edge ? leafEdge : leafDark} castShadow>
            <coneGeometry args={[0.5, 1, 4, 1]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Half-lowered wooden venetian blind across a window (spans its width, faces +z). */
export function WoodBlind({ w, top, drop = 0.9, m }) {
  const slats = Math.round(drop / 0.045)
  return (
    <group>
      <B s={[w, 0.06, 0.08]} p={[0, top - 0.03, 0]} m={m} />
      {Array.from({ length: slats }, (_, i) => (
        <B key={i} s={[w - 0.04, 0.006, 0.05]} p={[0, top - 0.08 - i * 0.045, 0]} r={[0.35, 0, 0]} m={m} shadow={false} />
      ))}
      <B s={[w - 0.04, 0.02, 0.055]} p={[0, top - 0.1 - slats * 0.045, 0]} m={m} />
    </group>
  )
}

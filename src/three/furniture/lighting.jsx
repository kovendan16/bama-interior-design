import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { B, Cyl, Sph, Torus, Tube, Lathe } from './primitives'

// Light fixtures. They are emissive meshes — the actual illumination comes from a
// fixed pool of point lights that follows the camera (see Lights.jsx), which keeps
// the light count constant and avoids shader recompiles while scrolling.

export function PendantGlobe({ drop = 1.2, ceiling = 4, radius = 0.17, swing = true, ...props }) {
  const ref = useRef()
  const seed = useRef(Math.random() * 10)
  useFrame(({ clock }) => {
    if (!swing || !ref.current) return
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.6 + seed.current) * 0.015
  })
  return (
    <group {...props}>
      <group ref={ref} position={[0, ceiling, 0]}>
        <Cyl rt={0.06} h={0.02} p={[0, -0.01, 0]} m="brass" seg={20} />
        <Cyl rt={0.004} h={drop} p={[0, -drop / 2, 0]} m="blackMetal" seg={6} shadow={false} />
        <Cyl rt={0.03} h={0.06} p={[0, -drop, 0]} m="brass" seg={16} />
        <Sph radius={radius} p={[0, -drop - radius + 0.02, 0]} m="lampWarm" shadow={false} />
      </group>
    </group>
  )
}

export function PendantDome({ drop = 1.0, ceiling = 4, m = 'brass', ...props }) {
  return (
    <group {...props}>
      <group position={[0, ceiling, 0]}>
        <Cyl rt={0.004} h={drop} p={[0, -drop / 2, 0]} m="blackMetal" seg={6} shadow={false} />
        <Sph radius={0.22} p={[0, -drop - 0.02, 0]} theta={Math.PI / 2} m={m} seg={32} />
        <Cyl rt={0.2} h={0.005} p={[0, -drop - 0.02, 0]} m="lampWarm" shadow={false} />
      </group>
    </group>
  )
}

export function LinearPendant({ w = 1.8, drop = 1.1, ceiling = 4, ...props }) {
  return (
    <group {...props}>
      <group position={[0, ceiling, 0]}>
        {[-1, 1].map((s) => (
          <Cyl key={s} rt={0.003} h={drop} p={[s * (w / 2 - 0.1), -drop / 2, 0]} m="blackMetal" seg={6} shadow={false} />
        ))}
        <B s={[w, 0.05, 0.08]} p={[0, -drop, 0]} m="brassBrushed" />
        <B s={[w - 0.04, 0.008, 0.05]} p={[0, -drop - 0.03, 0]} m="ledStrip" shadow={false} />
      </group>
    </group>
  )
}

export function Chandelier({ ceiling = 4, drop = 0.9, arms = 8, radius = 0.55, ...props }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04
  })
  return (
    <group {...props}>
      <group position={[0, ceiling, 0]}>
        <Cyl rt={0.08} h={0.03} p={[0, -0.015, 0]} m="brass" />
        <Cyl rt={0.008} h={drop} p={[0, -drop / 2, 0]} m="brass" seg={8} shadow={false} />
        <group ref={ref} position={[0, -drop, 0]}>
          <Torus radius={radius} tube={0.012} r={[Math.PI / 2, 0, 0]} m="brass" />
          <Torus radius={radius * 0.55} tube={0.01} p={[0, 0.12, 0]} r={[Math.PI / 2, 0, 0]} m="brass" />
          {Array.from({ length: arms }, (_, i) => {
            const a = (i / arms) * Math.PI * 2
            return (
              <group key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}>
                <Cyl rt={0.015} h={0.05} p={[0, 0.025, 0]} m="brass" seg={10} />
                <Sph radius={0.065} p={[0, 0.1, 0]} m="lampWarm" shadow={false} seg={16} />
              </group>
            )
          })}
        </group>
      </group>
    </group>
  )
}

export function ArcFloorLamp({ ...props }) {
  return (
    <group {...props}>
      <Cyl rt={0.18} h={0.06} p={[0, 0.03, 0]} m="marbleWhite" />
      <Tube
        name="arc-lamp"
        points={[
          [0, 0.05, 0],
          [0, 1.4, 0],
          [0.25, 2.0, 0],
          [0.8, 2.15, 0],
          [1.3, 1.95, 0],
        ]}
        radius={0.014}
        m="brass"
      />
      <group position={[1.3, 1.88, 0]}>
        <Sph radius={0.24} theta={Math.PI / 2} m="brass" seg={32} />
        <Cyl rt={0.22} h={0.004} p={[0, 0.0, 0]} m="lampWarm" shadow={false} />
      </group>
    </group>
  )
}

export function FloorLamp({ ...props }) {
  return (
    <group {...props}>
      <Cyl rt={0.15} h={0.03} p={[0, 0.015, 0]} m="blackMetal" />
      <Cyl rt={0.012} h={1.45} p={[0, 0.74, 0]} m="blackMetal" seg={8} />
      <Cyl rt={0.18} rb={0.24} h={0.32} p={[0, 1.55, 0]} m="lampShade" seg={32} open shadow={false} />
      <Sph radius={0.05} p={[0, 1.48, 0]} m="lampWarm" shadow={false} seg={12} />
    </group>
  )
}

export function TableLamp({ base = 'ceramicSand', ...props }) {
  return (
    <group {...props}>
      <Lathe
        name="lamp-base"
        profile={[[0, 0], [0.07, 0], [0.11, 0.08], [0.1, 0.18], [0.03, 0.26], [0.02, 0.3], [0, 0.3]]}
        m={base}
      />
      <Cyl rt={0.006} h={0.1} p={[0, 0.34, 0]} m="brass" seg={6} />
      <Cyl rt={0.12} rb={0.17} h={0.2} p={[0, 0.45, 0]} m="lampShade" seg={28} open shadow={false} />
      <Sph radius={0.035} p={[0, 0.41, 0]} m="lampWarm" shadow={false} seg={12} />
    </group>
  )
}

export function WallSconce({ ...props }) {
  return (
    <group {...props}>
      <Cyl rt={0.05} h={0.02} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.01]} m="brass" />
      <Cyl rt={0.008} h={0.18} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.1]} m="brass" seg={6} />
      <Sph radius={0.07} p={[0, 0, 0.22]} m="lampWarm" shadow={false} seg={16} />
    </group>
  )
}

// Recessed LED cove around the ceiling perimeter.
export function CoveLight({ w = 11.6, d = 9.6, y = 3.92, inset = 0.4 }) {
  const t = 0.02
  return (
    <group position={[0, y, 0]}>
      <B s={[w - inset * 2, t, 0.04]} p={[0, 0, -d / 2 + inset]} m="ledStrip" shadow={false} />
      <B s={[0.04, t, d - inset * 2]} p={[-w / 2 + inset, 0, 0]} m="ledStrip" shadow={false} />
      <B s={[0.04, t, d - inset * 2]} p={[w / 2 - inset, 0, 0]} m="ledStrip" shadow={false} />
    </group>
  )
}

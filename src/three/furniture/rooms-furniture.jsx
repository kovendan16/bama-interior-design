import { B, RB, Cyl, Sph, Torus, Tube, Lathe, InstancedCyl } from './primitives'
import { TableLamp } from './lighting'
import { Vase, Bowl, Books } from './living'

/* ------------------------------ Bedroom ------------------------------ */

export function Bed({ w = 1.9, l = 2.15, frame = 'fabricSand', headboard = 'fabricSand', ...props }) {
  const channels = 7
  const cw = (w + 0.3) / channels
  return (
    <group {...props}>
      <RB s={[w + 0.12, 0.28, l]} p={[0, 0.2, 0]} m={frame} radius={0.04} />
      {Array.from({ length: channels }, (_, i) => (
        <RB key={i} s={[cw - 0.01, 1.25, 0.14]} p={[-(w + 0.3) / 2 + cw * (i + 0.5), 0.82, -l / 2 - 0.02]} m={headboard} radius={0.06} />
      ))}
      <RB s={[w, 0.26, l - 0.12]} p={[0, 0.47, 0.03]} m="linenWhite" radius={0.07} />
      <RB s={[w + 0.06, 0.09, l * 0.64]} p={[0, 0.6, l * 0.18]} m="linenGrey" radius={0.04} />
      <RB s={[w + 0.08, 0.05, 0.5]} p={[0, 0.66, l / 2 - 0.35]} m="velvetRust" radius={0.025} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <RB s={[0.7, 0.42, 0.16]} p={[s * w * 0.25, 0.78, -l / 2 + 0.22]} r={[-0.35, 0, 0]} m="linenWhite" radius={0.08} />
          <RB s={[0.58, 0.34, 0.14]} p={[s * w * 0.22, 0.74, -l / 2 + 0.42]} r={[-0.3, 0, 0]} m="linenGrey" radius={0.07} />
        </group>
      ))}
      <RB s={[0.5, 0.32, 0.13]} p={[0, 0.72, -l / 2 + 0.55]} r={[-0.25, 0, 0]} m="velvetNavy" radius={0.07} />
    </group>
  )
}

export function Nightstand({ m = 'walnut', lamp = true, ...props }) {
  return (
    <group {...props}>
      <RB s={[0.55, 0.5, 0.42]} p={[0, 0.33, 0]} m={m} radius={0.02} />
      <B s={[0.5, 0.004, 0.005]} p={[0, 0.36, 0.212]} m="blackMetal" shadow={false} />
      <Cyl rt={0.012} h={0.04} r={[Math.PI / 2, 0, 0]} p={[0, 0.46, 0.22]} m="brass" seg={8} />
      {[-1, 1].map((sx) => (
        <Cyl key={sx} rt={0.015} h={0.08} p={[sx * 0.22, 0.04, 0]} m="brass" seg={8} />
      ))}
      {lamp && <TableLamp position={[0.08, 0.58, -0.04]} />}
      <Books position={[-0.13, 0.58, 0.05]} count={2} seed={11} />
    </group>
  )
}

export function Wardrobe({ w = 2.4, h = 2.7, m = 'lacquerCream', ...props }) {
  const doors = Math.round(w / 0.6)
  const dw = w / doors
  return (
    <group {...props}>
      <B s={[w, h, 0.6]} p={[0, h / 2, 0]} m={m} />
      {Array.from({ length: doors }, (_, i) => (
        <group key={i} position={[-w / 2 + dw * (i + 0.5), 0, 0.301]}>
          <B s={[dw - 0.012, h - 0.04, 0.01]} p={[0, h / 2, 0]} m={m} />
          <B s={[0.012, 0.5, 0.025]} p={[(i % 2 ? -1 : 1) * (dw / 2 - 0.06), h * 0.48, 0.015]} m="brass" />
        </group>
      ))}
    </group>
  )
}

export function Bench({ w = 1.5, m = 'velvetNavy', ...props }) {
  return (
    <group {...props}>
      <RB s={[w, 0.14, 0.42]} p={[0, 0.42, 0]} m={m} radius={0.05} />
      {[-1, 1].map((sx) => (
        <B key={sx} s={[0.03, 0.35, 0.36]} p={[sx * (w / 2 - 0.08), 0.18, 0]} m="brass" />
      ))}
    </group>
  )
}

export function Dresser({ w = 1.6, m = 'walnut', ...props }) {
  return (
    <group {...props}>
      <RB s={[w, 0.8, 0.48]} p={[0, 0.5, 0]} m={m} radius={0.015} />
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <B s={[w - 0.04, 0.004, 0.005]} p={[0, 0.3 + i * 0.25, 0.242]} m="blackMetal" shadow={false} />
          <B s={[0.25, 0.015, 0.02]} p={[0, 0.2 + i * 0.25, 0.25]} m="brass" />
        </group>
      ))}
      {[-1, 1].map((sx) => (
        <Cyl key={sx} rt={0.02} h={0.1} p={[sx * (w / 2 - 0.1), 0.05, 0]} m="brass" seg={8} />
      ))}
    </group>
  )
}

/* ------------------------------ Kitchen ------------------------------ */

export function BaseRun({ w = 4.2, m = 'lacquerSage', top = 'marbleWhite', ...props }) {
  const units = Math.round(w / 0.6)
  const uw = w / units
  return (
    <group {...props}>
      <B s={[w, 0.1, 0.56]} p={[0, 0.05, -0.02]} m="blackMetal" />
      <B s={[w, 0.78, 0.6]} p={[0, 0.49, 0]} m={m} />
      {Array.from({ length: units }, (_, i) => (
        <group key={i} position={[-w / 2 + uw * (i + 0.5), 0, 0.301]}>
          <B s={[uw - 0.008, 0.76, 0.012]} p={[0, 0.49, 0]} m={m} />
          <B s={[uw * 0.5, 0.012, 0.02]} p={[0, 0.82, 0.012]} m="brassBrushed" />
        </group>
      ))}
      <B s={[w + 0.04, 0.04, 0.66]} p={[0, 0.9, 0.02]} m={top} />
      {/* sink + faucet */}
      <B s={[0.6, 0.005, 0.4]} p={[-w * 0.22, 0.922, 0.02]} m="steel" shadow={false} />
      <Tube name="faucet" points={[[0, 0, 0], [0, 0.32, 0], [0.04, 0.4, 0], [0.16, 0.38, 0], [0.2, 0.3, 0]]} radius={0.012} m="brass" p={[-w * 0.22, 0.92, -0.22]} r={[0, -Math.PI / 2, 0]} />
      {/* induction hob */}
      <B s={[0.7, 0.008, 0.5]} p={[w * 0.22, 0.924, 0.02]} m="glassSmoked" shadow={false} />
      <Bowl p={[w * 0.4, 0.92, 0]} m="ceramicWhite" />
    </group>
  )
}

export function UpperShelves({ w = 2, m = 'oak', ...props }) {
  return (
    <group {...props}>
      {[0, 0.42].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <B s={[w, 0.04, 0.28]} m={m} />
          {Array.from({ length: Math.floor(w / 0.32) }, (_, k) => {
            const x = -w / 2 + 0.2 + k * 0.32
            return k % 3 === 0 ? (
              <Vase key={k} p={[x, 0.02, 0]} kind={i ? 'bud' : 'round'} m={k % 2 ? 'ceramicWhite' : 'stoneware'} />
            ) : k % 3 === 1 ? (
              <group key={k}>
                {[0, 1, 2].map((j) => (
                  <Cyl key={j} rt={0.1} h={0.015} p={[x, 0.03 + j * 0.016, 0]} m="ceramicWhite" />
                ))}
              </group>
            ) : (
              <Cyl key={k} rt={0.05} h={0.14} p={[x, 0.09, 0]} m="glass" shadow={false} />
            )
          })}
        </group>
      ))}
    </group>
  )
}

export function TallUnit({ w = 1.2, h = 2.7, m = 'lacquerSage', ...props }) {
  return (
    <group {...props}>
      <B s={[w, h, 0.62]} p={[0, h / 2, 0]} m={m} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <B s={[w / 2 - 0.008, h - 0.04, 0.012]} p={[(s * w) / 4, h / 2, 0.31]} m={m} />
          <B s={[0.015, 0.9, 0.025]} p={[s * 0.04, h * 0.5, 0.33]} m="brassBrushed" />
        </group>
      ))}
    </group>
  )
}

export function RangeHood({ ...props }) {
  return (
    <group {...props}>
      <B s={[0.9, 0.35, 0.5]} p={[0, 0, 0]} m="brassBrushed" />
      <B s={[0.32, 1.2, 0.3]} p={[0, 0.77, -0.1]} m="brassBrushed" />
    </group>
  )
}

export function Island({ w = 2.6, d = 1.0, base = 'walnut', top = 'marbleWhite', ...props }) {
  return (
    <group {...props}>
      <B s={[w - 0.1, 0.86, d - 0.15]} p={[0, 0.45, -0.05]} m={base} />
      <InstancedCyl rt={0.016} h={0.82} seg={6} m={base} items={Array.from({ length: Math.floor((w - 0.1) / 0.04) }, (_, i) => [-(w - 0.1) / 2 + 0.02 + i * 0.04, 0.45, (d - 0.15) / 2 - 0.05])} />
      <B s={[w, 0.06, d]} p={[0, 0.91, 0]} m={top} />
      {[-1, 1].map((s) => (
        <B key={s} s={[0.06, 0.88, d]} p={[s * (w / 2 - 0.03), 0.44, 0]} m={top} />
      ))}
      <Bowl p={[0.5, 0.94, -0.1]} m="ceramicBlack" />
      <Vase p={[-0.7, 0.94, -0.15]} kind="tall" m="ceramicWhite" />
    </group>
  )
}

export function Stool({ seat = 'leatherCognac', ...props }) {
  return (
    <group {...props}>
      <Cyl rt={0.19} rb={0.17} h={0.07} p={[0, 0.66, 0]} m={seat} />
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4
        return <Cyl key={i} rt={0.012} rb={0.014} h={0.64} p={[Math.cos(a) * 0.13, 0.32, Math.sin(a) * 0.13]} r={[Math.sin(a) * 0.1, 0, -Math.cos(a) * 0.1]} m="brass" seg={8} />
      })}
      <Torus radius={0.15} tube={0.008} p={[0, 0.25, 0]} r={[Math.PI / 2, 0, 0]} m="brass" />
    </group>
  )
}

export function DiningTable({ w = 2.2, d = 1.0, top = 'oak', ...props }) {
  return (
    <group {...props}>
      <RB s={[w, 0.05, d]} p={[0, 0.75, 0]} m={top} radius={0.02} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (w / 2 - 0.35), 0, 0]}>
          <B s={[0.08, 0.72, 0.6]} p={[0, 0.37, 0]} m="blackMetal" />
        </group>
      ))}
      <Vase p={[0, 0.78, 0]} kind="tall" m="ceramicSand" />
      <Bowl p={[0.5, 0.78, 0.1]} m="brass" />
    </group>
  )
}

export function DiningChair({ m = 'fabricSand', frame = 'walnut', ...props }) {
  return (
    <group {...props}>
      <RB s={[0.48, 0.08, 0.48]} p={[0, 0.47, 0]} m={m} radius={0.03} />
      <RB s={[0.46, 0.42, 0.06]} p={[0, 0.76, -0.22]} r={[-0.08, 0, 0]} m={m} radius={0.03} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => <Cyl key={`${sx}${sz}`} rt={0.018} rb={0.014} h={0.44} p={[sx * 0.2, 0.22, sz * 0.2]} m={frame} seg={8} />)
      )}
    </group>
  )
}

/* ------------------------------ Bathroom ------------------------------ */

export function Bathtub({ ...props }) {
  return (
    <group {...props}>
      <Lathe
        name="tub"
        profile={[[0, 0.02], [0.3, 0.02], [0.42, 0.12], [0.46, 0.4], [0.5, 0.58], [0.47, 0.6], [0.42, 0.45], [0.36, 0.2], [0, 0.16]]}
        s={[1.75, 1, 0.82]}
        m="ceramicWhite"
        seg={48}
      />
      <Cyl rt={0.4} h={0.005} p={[0, 0.48, 0]} m="water" shadow={false} scale={[1.7, 1, 0.8]} />
      <group position={[1.05, 0, 0]}>
        <Cyl rt={0.02} h={0.95} p={[0, 0.48, 0]} m="brass" seg={10} />
        <Tube name="tub-filler" points={[[0, 0.95, 0], [0, 1.05, 0], [-0.1, 1.1, 0], [-0.22, 1.02, 0]]} radius={0.018} m="brass" />
      </group>
    </group>
  )
}

export function Vanity({ w = 1.8, ...props }) {
  return (
    <group {...props}>
      <RB s={[w, 0.45, 0.52]} p={[0, 0.72, 0]} m="walnut" radius={0.015} />
      <B s={[w + 0.02, 0.04, 0.54]} p={[0, 0.965, 0]} m="marbleWhite" />
      {[-1, 1].map((s) => (
        <group key={s} position={[(s * w) / 4, 0.985, 0]}>
          <Lathe name="vessel" profile={[[0, 0], [0.12, 0.01], [0.19, 0.06], [0.2, 0.13], [0.185, 0.13], [0.17, 0.07], [0.11, 0.03], [0, 0.025]]} m="ceramicWhite" />
          <Tube name="vanity-tap" points={[[0, 0, 0], [0, 0.25, 0], [0.03, 0.3, 0], [0.12, 0.28, 0]]} radius={0.01} m="brass" p={[0, 0, -0.2]} r={[0, -Math.PI / 2, 0]} />
        </group>
      ))}
      <Vase p={[0, 0.985, -0.12]} kind="bud" m="ceramicBlack" />
    </group>
  )
}

export function ShowerScreen({ ...props }) {
  return (
    <group {...props}>
      <B s={[0.012, 2.1, 1.2]} p={[0, 1.05, 0]} m="glass" shadow={false} />
      <B s={[0.03, 2.12, 0.03]} p={[0, 1.06, 0.6]} m="blackMetal" />
      <B s={[0.03, 0.03, 1.2]} p={[0, 2.1, 0]} m="blackMetal" />
    </group>
  )
}

export function TowelLadder({ ...props }) {
  return (
    <group {...props} rotation={[-0.12, 0, 0]}>
      {[-1, 1].map((s) => (
        <B key={s} s={[0.03, 1.7, 0.03]} p={[s * 0.22, 0.85, 0]} m="oak" />
      ))}
      {[0.3, 0.7, 1.1, 1.5].map((y) => (
        <Cyl key={y} rt={0.012} h={0.44} r={[0, 0, Math.PI / 2]} p={[0, y, 0]} m="oak" seg={8} />
      ))}
      <RB s={[0.4, 0.5, 0.03]} p={[0, 1.15, 0.03]} m="linenWhite" radius={0.012} />
    </group>
  )
}

/* ------------------------------ Office ------------------------------ */

export function Desk({ w = 1.8, d = 0.8, ...props }) {
  return (
    <group {...props}>
      <RB s={[w, 0.045, d]} p={[0, 0.75, 0]} m="walnut" radius={0.015} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (w / 2 - 0.08), 0, 0]}>
          <B s={[0.04, 0.73, 0.04]} p={[0, 0.365, d / 2 - 0.06]} m="blackMetal" />
          <B s={[0.04, 0.73, 0.04]} p={[0, 0.365, -d / 2 + 0.06]} m="blackMetal" />
          <B s={[0.04, 0.04, d - 0.1]} p={[0, 0.05, 0]} m="blackMetal" />
        </group>
      ))}
      <group position={[0, 0.775, -0.15]}>
        <B s={[0.75, 0.42, 0.025]} p={[0, 0.33, 0]} m="blackMetal" />
        <B s={[0.73, 0.4, 0.005]} p={[0, 0.33, 0.014]} m="screen" shadow={false} />
        <B s={[0.05, 0.12, 0.04]} p={[0, 0.06, -0.02]} m="steel" />
        <B s={[0.25, 0.012, 0.18]} p={[0, 0.006, 0]} m="steel" />
      </group>
      <B s={[0.42, 0.012, 0.14]} p={[0, 0.78, 0.18]} m="ceramicWhite" />
      <TableLamp position={[w / 2 - 0.25, 0.775, -0.2]} base="ceramicBlack" />
      <Books position={[-w / 2 + 0.25, 0.775, -0.15]} count={3} seed={21} />
    </group>
  )
}

export function OfficeChair({ m = 'leatherBlack', ...props }) {
  return (
    <group {...props}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return <B key={i} s={[0.32, 0.03, 0.04]} p={[Math.cos(a) * 0.16, 0.06, Math.sin(a) * 0.16]} r={[0, -a, 0]} m="steel" />
      })}
      <Cyl rt={0.025} h={0.36} p={[0, 0.26, 0]} m="steel" seg={10} />
      <RB s={[0.52, 0.09, 0.5]} p={[0, 0.48, 0]} m={m} radius={0.04} />
      <RB s={[0.5, 0.62, 0.08]} p={[0, 0.86, -0.24]} r={[-0.1, 0, 0]} m={m} radius={0.04} />
      {[-1, 1].map((s) => (
        <B key={s} s={[0.04, 0.03, 0.32]} p={[s * 0.28, 0.66, -0.02]} m="steel" />
      ))}
    </group>
  )
}

/* ------------------------------ Fireplace ------------------------------ */

export function Fireplace({ w = 2.2, ...props }) {
  return (
    <group {...props}>
      <B s={[w, 1.15, 0.5]} p={[0, 0.575, 0]} m="travertine" />
      <B s={[w * 0.6, 0.6, 0.06]} p={[0, 0.42, 0.23]} m="lacquerBlack" />
      <B s={[w + 0.2, 0.08, 0.6]} p={[0, 1.19, 0.03]} m="marbleBlack" />
      <B s={[w * 0.66, 0.05, 0.3]} p={[0, 0.1, 0.42]} m="marbleBlack" />
      {[-0.25, 0, 0.25].map((x, i) => (
        <Cyl key={i} rt={0.05} h={0.6} r={[0, i * 0.4, Math.PI / 2]} p={[x * 0.5, 0.16, 0.34]} m="walnut" seg={10} />
      ))}
    </group>
  )
}

export { Sph }

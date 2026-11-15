import { B, Plane } from '../furniture/primitives'
import { DOOR, WALL_T } from '../world'

/**
 * Architectural shell of a room: floor slab, back wall with window openings (and a
 * painted sky behind them), optional side walls with doorways, ceiling, skirting.
 * The front (+z) is open, like an architectural cut-away.
 */
export function Shell({
  w = 12,
  d = 10,
  h = 4,
  floor = 'floorOak',
  wall = 'wallWarm',
  sideWall,
  ceiling = true,
  ceilingMat = 'ceiling',
  left = null,
  right = null,
  windows = [],
  sky = 'skyDay',
  skirting = 'walnut',
  slab = 'wallStone',
  frame = 'blackMetal',
  front = false,
}) {
  const sw = sideWall || wall
  return (
    <group>
      {/* floor */}
      <Plane s={[w, d]} r={[-Math.PI / 2, 0, 0]} p={[0, 0, 0]} m={floor} />
      <B s={[w + WALL_T * 2, 0.24, d]} p={[0, -0.121, 0]} m={slab} shadow={false} />

      <BackWall w={w} d={d} h={h} clip={!ceiling} wall={wall} windows={windows} sky={sky} frame={frame} />

      {left && <SideWall x={-w / 2 - WALL_T / 2} d={d} h={left.h ?? h} m={left.m || sw} door={left.door} skirting={skirting} side={1} />}
      {right && <SideWall x={w / 2 + WALL_T / 2} d={d} h={right.h ?? h} m={right.m || sw} door={right.door} skirting={skirting} side={-1} />}

      {front && <B s={[w + WALL_T * 2, h, WALL_T]} p={[0, h / 2, d / 2 + WALL_T / 2]} m={sw} />}

      {ceiling && <B s={[w + WALL_T * 2, 0.16, d]} p={[0, h + 0.08, 0]} m={ceilingMat} />}

      {skirting && <B s={[w, 0.09, 0.02]} p={[0, 0.045, -d / 2 + 0.01]} m={skirting} shadow={false} />}
    </group>
  )
}

function BackWall({ w, d, h, clip, wall, windows, sky, frame }) {
  const z = -d / 2 - WALL_T / 2
  const pieces = []
  const sorted = [...windows].sort((a, b) => a.x - b.x)
  let cursor = -w / 2 - WALL_T
  sorted.forEach((win, i) => {
    const l = win.x - win.w / 2
    const r = win.x + win.w / 2
    if (l > cursor) pieces.push(<B key={'s' + i} s={[l - cursor, h, WALL_T]} p={[(cursor + l) / 2, h / 2, z]} m={wall} />)
    if (win.sill > 0) pieces.push(<B key={'b' + i} s={[win.w, win.sill, WALL_T]} p={[win.x, win.sill / 2, z]} m={wall} />)
    if (win.top < h) pieces.push(<B key={'t' + i} s={[win.w, h - win.top, WALL_T]} p={[win.x, (h + win.top) / 2, z]} m={wall} />)
    cursor = r
  })
  const end = w / 2 + WALL_T
  if (end > cursor) pieces.push(<B key="end" s={[end - cursor, h, WALL_T]} p={[(cursor + end) / 2, h / 2, z]} m={wall} />)

  return (
    <group>
      {pieces}
      {sorted.map((win, i) => (
        <Window key={i} win={win} z={z} d={d} h={clip ? h : Infinity} sky={sky} frame={frame} />
      ))}
    </group>
  )
}

function Window({ win, z, h, sky, frame }) {
  const wh = win.top - win.sill
  const cy = win.sill + wh / 2
  const ft = 0.05
  const mullions = Math.max(0, Math.round(win.w / 1.3) - 1)
  return (
    <group>
      {/* frame */}
      <B s={[win.w, ft, ft * 2]} p={[win.x, win.sill + ft / 2, z + 0.06]} m={frame} />
      <B s={[win.w, ft, ft * 2]} p={[win.x, win.top - ft / 2, z + 0.06]} m={frame} />
      <B s={[ft, wh, ft * 2]} p={[win.x - win.w / 2 + ft / 2, cy, z + 0.06]} m={frame} />
      <B s={[ft, wh, ft * 2]} p={[win.x + win.w / 2 - ft / 2, cy, z + 0.06]} m={frame} />
      {Array.from({ length: mullions }, (_, k) => (
        <B key={k} s={[0.03, wh, 0.06]} p={[win.x - win.w / 2 + (win.w / (mullions + 1)) * (k + 1), cy, z + 0.06]} m={frame} />
      ))}
      {wh > 2.2 && <B s={[win.w, 0.03, 0.06]} p={[win.x, win.sill + wh * 0.78, z + 0.06]} m={frame} />}
      {/* deep sill */}
      <B s={[win.w + 0.1, 0.04, 0.32]} p={[win.x, win.sill + 0.02, z + 0.12]} m="travertine" shadow={false} />
      {/* glass */}
      <B s={[win.w, wh, 0.01]} p={[win.x, cy, z + 0.03]} m="glass" shadow={false} castShadow={false} />
      {/* painted landscape behind the opening — sized so neighbouring rooms never overlap */}
      {/* kept below the wall top so it never shows above a ceiling-less cut-away */}
      {(() => {
        const top = Math.min(cy + 0.3 + (wh + 2.4) / 2, h - 0.02)
        const bot = h === Infinity ? cy + 0.3 - (wh + 2.4) / 2 : Math.max(cy + 0.3 - (wh + 2.4) / 2, 0)
        return <Plane s={[win.w + 2.4, top - bot]} p={[win.x, (top + bot) / 2, z - 1.0]} m={sky} />
      })()}
    </group>
  )
}

function SideWall({ x, d, h, m, door, skirting, side }) {
  const z0 = -d / 2
  const z1 = d / 2
  const pieces = []
  if (door) {
    const a = DOOR.z - DOOR.w / 2
    const b = DOOR.z + DOOR.w / 2
    pieces.push(<B key="a" s={[WALL_T, h, a - z0]} p={[x, h / 2, (z0 + a) / 2]} m={m} />)
    pieces.push(<B key="b" s={[WALL_T, h, z1 - b]} p={[x, h / 2, (b + z1) / 2]} m={m} />)
    pieces.push(<B key="c" s={[WALL_T, h - DOOR.h, DOOR.w]} p={[x, (h + DOOR.h) / 2, DOOR.z]} m={m} />)
    // door casing
    pieces.push(<B key="ca" s={[WALL_T + 0.04, DOOR.h, 0.05]} p={[x, DOOR.h / 2, a]} m="walnut" />)
    pieces.push(<B key="cb" s={[WALL_T + 0.04, DOOR.h, 0.05]} p={[x, DOOR.h / 2, b]} m="walnut" />)
    pieces.push(<B key="cc" s={[WALL_T + 0.04, 0.05, DOOR.w + 0.05]} p={[x, DOOR.h, DOOR.z]} m="walnut" />)
  } else {
    pieces.push(<B key="full" s={[WALL_T, h, d]} p={[x, h / 2, 0]} m={m} />)
  }
  if (skirting) {
    const sx = x + side * (WALL_T / 2 + 0.01)
    if (door) {
      const a = DOOR.z - DOOR.w / 2
      pieces.push(<B key="ska" s={[0.02, 0.09, a - z0]} p={[sx, 0.045, (z0 + a) / 2]} m={skirting} shadow={false} />)
    } else {
      pieces.push(<B key="sk" s={[0.02, 0.09, d]} p={[sx, 0.045, 0]} m={skirting} shadow={false} />)
    }
  }
  return <group>{pieces}</group>
}

// Scroll path for the 3D showcase: every room sits side by side along X and the
// camera tours them in order. `u` runs from 0 to U_TOTAL; room i occupies [i, i + 1):
//   i .. i+HOLD        overview of room i
//   i+HOLD .. i+CLOSE  dolly in to an eye-level view
//   i+CLOSE .. i+1     rise up and glide across to the next room
export const SC_ROOMS = ['living', 'bedroom', 'kitchen', 'bathroom', 'office']
export const SC_SPACING = 14

const HOLD = 0.12
const CLOSE = 0.62
const END_HOLD = 0.85
export const U_TOTAL = SC_ROOMS.length - 1 + END_HOLD

const smooth = (t) => t * t * (3 - 2 * t)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/** scroll position (in u) that shows room i at its best */
export const roomFocusU = (i) => i + CLOSE

/** which room's caption to show */
export function roomIndexAt(u) {
  let k = 0
  for (let i = 0; i < SC_ROOMS.length; i++) if (u >= i - 0.2) k = i
  return k
}

/** continuous room coordinate: integer while inside a room, fractional while travelling */
export function roomCoord(u) {
  const i = Math.floor(u)
  if (i >= SC_ROOMS.length - 1) return SC_ROOMS.length - 1
  if (i < 0) return 0
  const l = u - i
  return l <= CLOSE ? i : i + smooth((l - CLOSE) / (1 - CLOSE))
}

// camera shots relative to each room's centre
const A = { pos: [6.2, 6.6, 13.2], tgt: [0, 1.0, -1.3] } // overview
const B = { pos: [1.7, 2.05, 6.1], tgt: [-0.7, 1.3, -3.0] } // eye level

function put(out, v, x) {
  out.set(v[0] + x, v[1], v[2])
}
function mix(out, a, b, xa, xb, s) {
  out.set(a[0] + xa + (b[0] + xb - a[0] - xa) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s)
}

/** writes the camera position and look-at target for scroll position u */
export function shotAt(u, pos, tgt) {
  const n = SC_ROOMS.length
  u = clamp(u, 0, U_TOTAL)
  const i = Math.min(Math.floor(u), n - 1)
  const l = u - i
  const x = i * SC_SPACING
  if (l <= HOLD) {
    put(pos, A.pos, x)
    put(tgt, A.tgt, x)
  } else if (l <= CLOSE || i === n - 1) {
    const s = smooth(clamp((l - HOLD) / (CLOSE - HOLD), 0, 1))
    mix(pos, A.pos, B.pos, x, x, s)
    mix(tgt, A.tgt, B.tgt, x, x, s)
  } else {
    const s = smooth((l - CLOSE) / (1 - CLOSE))
    mix(pos, B.pos, A.pos, x, x + SC_SPACING, s)
    mix(tgt, B.tgt, A.tgt, x, x + SC_SPACING, s)
    // arc up and back while travelling so the move reads as a fly-over
    const arc = Math.sin(Math.PI * s)
    pos.y += arc * 2.2
    pos.z += arc * 3.0
  }
}

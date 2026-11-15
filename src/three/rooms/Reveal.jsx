import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { range, easeOutBack, easeOutCubic, damp } from '../../lib/store'

/**
 * Scroll-driven entrance animation for any 3D object.
 * `source()` returns a 0..1 driver (usually a section's scroll progress);
 * the object animates in over the window [at[0], at[1]] using `type`.
 */
export function Reveal({ source, at = [0, 1], type = 'drop', amount = 2.4, children, ...props }) {
  const inner = useRef()
  const v = useRef(0)
  useFrame((_, dt) => {
    const g = inner.current
    if (!g) return
    const target = range(source(), at[0], at[1])
    v.current = damp(v.current, target, 8, Math.min(dt, 0.05))
    const t = v.current
    g.visible = t > 0.002
    if (!g.visible) return
    switch (type) {
      case 'drop': {
        const e = easeOutBack(t)
        g.position.y = (1 - e) * amount
        g.rotation.y = (1 - easeOutCubic(t)) * 0.6
        g.scale.setScalar(0.85 + 0.15 * Math.min(1, e))
        break
      }
      case 'descend':
        g.position.y = (1 - easeOutCubic(t)) * amount
        break
      case 'rise':
        g.scale.set(1, Math.max(0.001, easeOutCubic(t)), 1)
        break
      case 'grow':
        g.scale.setScalar(Math.max(0.001, easeOutBack(t)))
        break
      case 'spread':
        g.scale.set(Math.max(0.001, easeOutCubic(t)), 1, Math.max(0.001, easeOutCubic(t)))
        break
      case 'unroll':
        g.scale.set(Math.max(0.001, easeOutCubic(t)), 1, 1)
        break
      case 'slideX':
        g.position.x = (1 - easeOutCubic(t)) * amount
        break
      case 'wall':
        g.position.z = (1 - easeOutCubic(t)) * amount
        g.scale.setScalar(0.6 + 0.4 * easeOutCubic(t))
        break
      case 'flicker': {
        // lights stutter on like real fixtures warming up
        g.visible = t > 0.98 || (t > 0.3 && Math.sin(t * 90) > 0.2)
        break
      }
      default:
        break
    }
  })
  return (
    <group {...props}>
      <group ref={inner}>{children}</group>
    </group>
  )
}

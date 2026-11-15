import { useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ROOM_COMPONENTS } from './rooms/Rooms'
import { DOLL, DOLL_ROOMS } from './world'
import { B, Cyl } from './furniture/primitives'
import { store, emit, range, damp } from '../lib/store'

/**
 * A complete miniature house, cut away like an architect's model. Scrolling rotates
 * it and lifts the upper floor and roof apart ("exploded view"); hovering highlights
 * a room and clicking flies the camera inside it.
 */
const EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(12.2, 4.1, 10.1))

export function Dollhouse() {
  const house = useRef()
  const upper = useRef()
  const roof = useRef()
  const v = useRef({ explode: 0, spin: 0 })
  const [hover, setHover] = useState(null)

  // the miniature receives shadows but doesn't cast them — halves its GPU cost
  useLayoutEffect(() => {
    house.current.traverse((o) => {
      if (o.isMesh) o.castShadow = false
    })
  }, [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const p = store.progress.dollhouse || 0
    const focused = store.dollFocus !== null
    const explodeTarget = focused ? 1 : range(p, 0.45, 0.7)
    v.current.explode = damp(v.current.explode, explodeTarget, 4, dt)
    store.dollExplode = v.current.explode
    const spinTarget = focused ? 0 : (range(p, 0.3, 1) - 0.5) * 0.8
    v.current.spin = damp(v.current.spin, spinTarget, 3, dt)
    house.current.rotation.y = DOLL.rotY + v.current.spin
    upper.current.position.y = v.current.explode * 3.2
    roof.current.position.y = 8.9 + v.current.explode * 7
    roof.current.visible = v.current.explode < 0.95
  })

  // ignore pointer events that actually land on HTML UI layered above the canvas
  const blocked = (e) => store.active !== 'dollhouse' || !!e.nativeEvent?.target?.closest?.('button, a, input, select, textarea, .glass')
  const onOver = (i) => (e) => {
    e.stopPropagation()
    if (blocked(e)) return
    setHover(i)
    store.dollHover = i
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    setHover(null)
    store.dollHover = null
    document.body.style.cursor = ''
  }
  const onClick = (i) => (e) => {
    e.stopPropagation()
    if (blocked(e)) return
    store.dollFocus = store.dollFocus === i ? null : i
    emit('dollFocus', store.dollFocus)
  }

  const ground = DOLL_ROOMS.filter((r) => r.y === 0)
  const first = DOLL_ROOMS.filter((r) => r.y > 0)

  const renderRoom = (r) => {
    const Comp = ROOM_COMPONENTS[r.id]
    const idx = DOLL_ROOMS.findIndex((d) => d.id === r.id)
    const isLeft = r.x === -12
    const isRight = r.x === 12
    return (
      <group key={r.id} position={[r.x, 0, 0]}>
        <Comp
          curtainsAnimated={false}
          shell={{
            ceiling: false,
            left: { door: !isLeft },
            right: isRight ? { door: false } : null,
          }}
        />
        {/* hit volume + hover highlight */}
        <mesh position={[0, 2, 0]} onPointerOver={onOver(idx)} onPointerOut={onOut} onClick={onClick(idx)}>
          <boxGeometry args={[12, 4, 10]} />
          <meshBasicMaterial color="#c9a45c" transparent opacity={hover === idx ? 0.1 : 0} depthWrite={false} />
        </mesh>
        {hover === idx && (
          <lineSegments position={[0, 2, 0]}>
            <primitive object={EDGES} attach="geometry" />
            <lineBasicMaterial color="#e5c27a" />
          </lineSegments>
        )}
      </group>
    )
  }

  return (
    <group position={DOLL.pos}>
      {/* plinth */}
      <Cyl rt={3.2} rb={3.3} h={0.9} p={[0, -0.47, 0]} m="wallWhite" seg={64} />
      <Cyl rt={3.22} h={0.02} p={[0, -0.01, 0]} m="marbleWhite" seg={64} />
      <group ref={house} scale={DOLL.scale}>
        <B s={[37, 0.3, 11]} p={[0, -0.15, 0]} m="wallStone" />
        <group>{ground.map(renderRoom)}</group>
        <group ref={upper}>
          <group position={[0, 4.35, 0]}>{first.map((r) => renderRoom(r))}</group>
        </group>
        {/* roof */}
        <group ref={roof} position={[0, 8.9, 0]}>
          <B s={[37.2, 0.3, 10.8]} m="lacquerBlack" />
          <B s={[37.6, 0.12, 11.2]} p={[0, 0.2, 0]} m="brassBrushed" />
        </group>
      </group>
    </group>
  )
}

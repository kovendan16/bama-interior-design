import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Cyl, Lathe, geo, seeded, Torus, B } from './primitives'
import { useMat } from '../materials'

function leafGeometry() {
  return geo('leaf', () => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.bezierCurveTo(0.09, 0.06, 0.1, 0.22, 0, 0.32)
    s.bezierCurveTo(-0.1, 0.22, -0.09, 0.06, 0, 0)
    const g = new THREE.ShapeGeometry(s, 6)
    // gentle curl
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, x * x * 2.2 - y * 0.12)
    }
    g.computeVertexNormals()
    return g
  })
}

// All leaves of one colour in a single instanced draw call.
function LeafInstances({ items, mat }) {
  const ref = (mesh) => {
    if (!mesh) return
    const o = new THREE.Object3D()
    items.forEach((it, i) => {
      o.position.set(...it.p)
      o.rotation.set(...it.r)
      o.scale.set(...it.s)
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }
  if (!items.length) return null
  return <instancedMesh ref={ref} args={[leafGeometry(), mat, items.length]} castShadow />
}

// Potted plant — leaves arranged on a phyllotaxis spiral; sways softly.
export function Plant({ height = 1.5, pot = 'terracotta', leaves = 34, seed = 3, kind = 'fig', ...props }) {
  const ref = useRef()
  const leafMat = useMat('leaf')
  const leafMat2 = useMat('leafLight')
  const stemMat = useMat('walnut')
  const r = useMemo(() => seeded(seed), [seed])
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < leaves; i++) {
      const t = i / leaves
      const a = i * 2.39996
      const y = 0.45 + t * (height - 0.45)
      const rad = kind === 'palm' ? 0.05 + t * 0.15 : 0.08 + Math.sin(t * Math.PI) * 0.22
      const sc = kind === 'palm' ? 1.4 + r() * 0.6 : 0.8 + r() * 0.5
      arr.push({
        p: [Math.cos(a) * rad, y, Math.sin(a) * rad],
        r: [-(0.5 + r() * 0.6), -a + Math.PI / 2, (r() - 0.5) * 0.4],
        s: [sc, sc * (kind === 'palm' ? 1.8 : 1), sc],
        alt: r() > 0.6,
      })
    }
    return arr
  }, [leaves, height, r, kind])
  const sway = useRef(Math.random() * 10)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.8 + sway.current) * 0.02
  })
  return (
    <group {...props}>
      <Lathe name="pot" profile={[[0, 0], [0.16, 0], [0.2, 0.32], [0.21, 0.36], [0.19, 0.36], [0.18, 0.33], [0, 0.33]]} m={pot} />
      <Cyl rt={0.18} h={0.01} p={[0, 0.32, 0]} m="soil" seg={20} />
      <group ref={ref}>
        <mesh geometry={geo('stem-' + height, () => new THREE.CylinderGeometry(0.008, 0.014, height - 0.3, 6))} material={stemMat} position={[0, 0.3 + (height - 0.3) / 2, 0]} castShadow />
        <LeafInstances items={items.filter((it) => !it.alt)} mat={leafMat} />
        <LeafInstances items={items.filter((it) => it.alt)} mat={leafMat2} />
      </group>
    </group>
  )
}

// Sheer curtain: a pleated plane whose vertices ripple gently, as if in a breeze.
export function Curtain({ w = 1.4, h = 3.6, open = 1, m = 'curtain', animated = true, ...props }) {
  const mesh = useRef()
  const mat = useMat(m)
  const g = useMemo(() => {
    const geom = new THREE.PlaneGeometry(w, h, 48, 8)
    geom.translate(0, -h / 2, 0)
    geom.userData.base = geom.attributes.position.array.slice()
    return geom
  }, [w, h])
  const phase = useRef(Math.random() * 10)
  const apply = (time) => {
    const pos = g.attributes.position
    const base = g.userData.base
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]
      const y = base[i * 3 + 1]
      const fall = -y / h // 0 at rod, 1 at hem
      const pleat = Math.sin(x * 26) * 0.045
      const breeze = Math.sin(x * 3 + time * 1.1 + phase.current) * 0.04 * fall + Math.sin(time * 0.7 + y * 1.5) * 0.015 * fall
      pos.setZ(i, pleat + breeze)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
  }
  useMemo(() => apply(0), [g]) // eslint-disable-line
  let acc = 0
  useFrame(({ clock }, dt) => {
    if (!animated || !mesh.current || !mesh.current.visible) return
    acc += dt
    if (acc < 1 / 30) return // 30Hz is plenty for cloth
    acc = 0
    apply(clock.elapsedTime)
  })
  return (
    <group {...props}>
      <Cyl rt={0.012} h={w + 0.3} r={[0, 0, Math.PI / 2]} p={[0, 0.02, 0]} m="brass" seg={8} />
      <mesh ref={mesh} geometry={g} material={mat} scale={[Math.max(0.15, open), 1, 1]} castShadow={false} receiveShadow />
    </group>
  )
}

export function RoundMirror({ radius = 0.45, ...props }) {
  const mat = useMat('mirror')
  return (
    <group {...props}>
      <Torus radius={radius} tube={0.022} m="brass" />
      <mesh material={mat} geometry={geo('disc-' + radius, () => new THREE.CircleGeometry(radius, 48))} position={[0, 0, -0.005]} />
    </group>
  )
}

export function Sculpture({ m = 'travertine', ...props }) {
  return (
    <group {...props}>
      <B s={[0.36, 0.9, 0.36]} p={[0, 0.45, 0]} m="travertine" />
      <Torus radius={0.18} tube={0.05} p={[0, 1.12, 0]} m="brass" />
      <mesh position={[0, 0.98, 0]} castShadow>
        <sphereGeometry args={[0.07, 20, 16]} />
        <primitive object={useMat(m)} attach="material" />
      </mesh>
    </group>
  )
}

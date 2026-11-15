import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { useMat } from '../materials'

// Shared, cached geometries: each unique shape is uploaded to the GPU only once,
// no matter how many rooms or canvases reuse it.
const geoCache = new Map()
export function geo(key, make) {
  if (!geoCache.has(key)) geoCache.set(key, make())
  return geoCache.get(key)
}

const unitBox = () => geo('box', () => new THREE.BoxGeometry(1, 1, 1))

export function B({ s = [1, 1, 1], p, r, m = 'clay', shadow = true, ...rest }) {
  const mat = useMat(m)
  return <mesh geometry={unitBox()} material={mat} position={p} rotation={r} scale={s} castShadow={shadow} receiveShadow {...rest} />
}

export function RB({ s = [1, 1, 1], p, r, m = 'clay', radius = 0.05, seg = 3, shadow = true, ...rest }) {
  const mat = useMat(m)
  const rad = Math.min(radius, s[0] / 2 - 0.001, s[1] / 2 - 0.001, s[2] / 2 - 0.001)
  const key = `rb-${s.map((v) => v.toFixed(3)).join('-')}-${rad.toFixed(3)}-${seg}`
  const g = geo(key, () => new RoundedBoxGeometry(s[0], s[1], s[2], seg, rad))
  return <mesh geometry={g} material={mat} position={p} rotation={r} castShadow={shadow} receiveShadow {...rest} />
}

export function Cyl({ rt = 0.1, rb, h = 1, p, r, m = 'clay', seg = 28, open = false, shadow = true, ...rest }) {
  const mat = useMat(m)
  const rbb = rb ?? rt
  const g = geo(`cyl-${rt}-${rbb}-${h}-${seg}-${open}`, () => new THREE.CylinderGeometry(rt, rbb, h, seg, 1, open))
  return <mesh geometry={g} material={mat} position={p} rotation={r} castShadow={shadow} receiveShadow {...rest} />
}

export function Sph({ radius = 0.1, p, r, s, m = 'clay', seg = 24, phi = Math.PI * 2, theta = Math.PI, shadow = true, ...rest }) {
  const mat = useMat(m)
  const g = geo(`sph-${radius}-${seg}-${phi}-${theta}`, () => new THREE.SphereGeometry(radius, seg, Math.round(seg * 0.75), 0, phi, 0, theta))
  return <mesh geometry={g} material={mat} position={p} rotation={r} scale={s} castShadow={shadow} receiveShadow {...rest} />
}

export function Torus({ radius = 0.3, tube = 0.02, arc = Math.PI * 2, p, r, m = 'brass', seg = 48, shadow = true, ...rest }) {
  const mat = useMat(m)
  const g = geo(`tor-${radius}-${tube}-${arc}-${seg}`, () => new THREE.TorusGeometry(radius, tube, 12, seg, arc))
  return <mesh geometry={g} material={mat} position={p} rotation={r} castShadow={shadow} receiveShadow {...rest} />
}

export function Plane({ s = [1, 1], p, r, m = 'clay', shadow = false, ...rest }) {
  const mat = useMat(m)
  const g = geo('plane', () => new THREE.PlaneGeometry(1, 1))
  return <mesh geometry={g} material={mat} position={p} rotation={r} scale={[s[0], s[1], 1]} castShadow={shadow} receiveShadow {...rest} />
}

// Lathe (turned) objects: vases, bowls, lamp bases.
export function Lathe({ profile, p, r, s, m = 'ceramicWhite', name, seg = 40, shadow = true, ...rest }) {
  const mat = useMat(m)
  const g = geo(`lathe-${name}-${seg}`, () => {
    const lg = new THREE.LatheGeometry(
      profile.map(([x, y]) => new THREE.Vector2(x, y)),
      seg
    )
    lg.computeVertexNormals()
    return lg
  })
  return <mesh geometry={g} material={mat} position={p} rotation={r} scale={s} castShadow={shadow} receiveShadow {...rest} />
}

export function Tube({ points, radius = 0.015, name, p, r, m = 'brass', shadow = true, ...rest }) {
  const mat = useMat(m)
  const g = geo(`tube-${name}`, () => {
    const curve = new THREE.CatmullRomCurve3(points.map((v) => new THREE.Vector3(...v)))
    return new THREE.TubeGeometry(curve, 48, radius, 10, false)
  })
  return <mesh geometry={g} material={mat} position={p} rotation={r} castShadow={shadow} receiveShadow {...rest} />
}

// deterministic random for repeatable decor placement
export function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Many identical cylinders (fluting, slats) in a single draw call.
export function InstancedCyl({ rt = 0.02, h = 1, seg = 8, m = 'oak', items = [], shadow = false }) {
  const mat = useMat(m)
  const g = geo(`cyl-${rt}-${rt}-${h}-${seg}-false`, () => new THREE.CylinderGeometry(rt, rt, h, seg, 1, false))
  const ref = (mesh) => {
    if (!mesh) return
    const mtx = new THREE.Matrix4()
    items.forEach((p, i) => mesh.setMatrixAt(i, mtx.makeTranslation(p[0], p[1], p[2])))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }
  return <instancedMesh ref={ref} args={[g, mat, items.length]} castShadow={shadow} receiveShadow />
}

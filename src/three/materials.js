import * as THREE from 'three'
import { createContext, useContext } from 'react'
import {
  woodPlanks,
  woodGrain,
  marble,
  fabricWeave,
  plasterNoise,
  concrete,
  rugPattern,
  artwork,
  skyView,
  blueprintGrid,
} from './textures'

// Central PBR material library. Every material is created once and shared across
// rooms and canvases, so the GPU compiles a small, fixed set of shader programs.

const cache = new Map()

const rep = (tex, x, y) => {
  const t = tex.clone()
  t.repeat.set(x, y)
  t.needsUpdate = true
  return t
}

const DEFS = {
  // woods
  floorOak: () => new THREE.MeshStandardMaterial({ map: rep(woodPlanks('oak'), 6, 5), roughness: 0.42, metalness: 0, color: '#ffffff' }),
  floorWalnut: () => new THREE.MeshStandardMaterial({ map: rep(woodPlanks('walnut'), 6, 5), roughness: 0.38 }),
  floorAsh: () => new THREE.MeshStandardMaterial({ map: rep(woodPlanks('ash'), 6, 5), roughness: 0.5 }),
  oak: () => new THREE.MeshStandardMaterial({ map: woodGrain('oak'), roughness: 0.5 }),
  walnut: () => new THREE.MeshStandardMaterial({ map: woodGrain('walnut'), roughness: 0.42 }),
  ash: () => new THREE.MeshStandardMaterial({ map: woodGrain('ash'), roughness: 0.55 }),
  lacquerBlack: () => new THREE.MeshPhysicalMaterial({ color: '#151413', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12 }),
  lacquerCream: () => new THREE.MeshPhysicalMaterial({ color: '#e9e2d6', roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
  lacquerSage: () => new THREE.MeshPhysicalMaterial({ color: '#7f8b76', roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
  lacquerNavy: () => new THREE.MeshPhysicalMaterial({ color: '#1e2a3b', roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.2 }),

  // stones
  marbleWhite: () => new THREE.MeshPhysicalMaterial({ map: marble('white'), roughness: 0.18, clearcoat: 0.8, clearcoatRoughness: 0.1 }),
  marbleBlack: () => new THREE.MeshPhysicalMaterial({ map: marble('black'), roughness: 0.16, clearcoat: 0.9, clearcoatRoughness: 0.08 }),
  marbleGreen: () => new THREE.MeshPhysicalMaterial({ map: marble('green'), roughness: 0.16, clearcoat: 0.9, clearcoatRoughness: 0.08 }),
  marbleFloor: () => new THREE.MeshPhysicalMaterial({ map: rep(marble('white'), 3, 2.5), roughness: 0.15, clearcoat: 0.6, clearcoatRoughness: 0.12 }),
  travertine: () => new THREE.MeshStandardMaterial({ color: '#d6c6ad', roughness: 0.75, roughnessMap: plasterNoise(5, 14) }),
  concrete: () => new THREE.MeshStandardMaterial({ map: concrete(), roughness: 0.92 }),
  concreteFloor: () => new THREE.MeshStandardMaterial({ map: rep(concrete(), 3, 2.5), roughness: 0.7, color: '#c9c4bd' }),

  // fabrics (sheen gives the soft velvet/boucle edge highlight)
  fabricCream: () => fabric('#e7dfd1', '#ffffff'),
  fabricBoucle: () => fabric('#efe8dc', '#ffffff', 0.98),
  fabricSand: () => fabric('#cdb89a', '#fff2dc'),
  fabricSage: () => fabric('#8e9a82', '#dfe8d5'),
  fabricTerracotta: () => fabric('#b46a4a', '#ffd2b8'),
  fabricCharcoal: () => fabric('#3b3936', '#9a948c'),
  velvetNavy: () => fabric('#22304a', '#7f97c8', 0.8),
  velvetEmerald: () => fabric('#1f4a3d', '#7fc7a8', 0.8),
  velvetRust: () => fabric('#8c3f25', '#ffb08a', 0.8),
  linenWhite: () => fabric('#f3efe8', '#ffffff', 0.95),
  linenGrey: () => fabric('#b9b3aa', '#ffffff', 0.95),
  leatherCognac: () => new THREE.MeshPhysicalMaterial({ color: '#8a4f2a', roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.5, bumpMap: fabricWeave(), bumpScale: 0.2 }),
  leatherBlack: () => new THREE.MeshPhysicalMaterial({ color: '#1b1a19', roughness: 0.4, clearcoat: 0.35, clearcoatRoughness: 0.4 }),

  // metals
  brass: () => new THREE.MeshStandardMaterial({ color: '#c9a45c', metalness: 1, roughness: 0.22 }),
  brassBrushed: () => new THREE.MeshStandardMaterial({ color: '#b8955a', metalness: 1, roughness: 0.38 }),
  blackMetal: () => new THREE.MeshStandardMaterial({ color: '#1a1918', metalness: 0.85, roughness: 0.42 }),
  chrome: () => new THREE.MeshStandardMaterial({ color: '#e8e8e8', metalness: 1, roughness: 0.08 }),
  steel: () => new THREE.MeshStandardMaterial({ color: '#9a9a9a', metalness: 1, roughness: 0.28 }),
  copper: () => new THREE.MeshStandardMaterial({ color: '#b87350', metalness: 1, roughness: 0.3 }),

  // glass / mirror (no transmission pass — reflective transparent is far cheaper)
  glass: () => new THREE.MeshPhysicalMaterial({ color: '#dfe9ec', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.18, envMapIntensity: 2, depthWrite: false }),
  glassSmoked: () => new THREE.MeshPhysicalMaterial({ color: '#4a4a48', roughness: 0.06, transparent: true, opacity: 0.45, envMapIntensity: 1.5 }),
  mirror: () => new THREE.MeshStandardMaterial({ color: '#d8dcdc', metalness: 1, roughness: 0.02 }),

  // walls & ceilings
  wallWarm: () => wall('#e6ddd0'),
  wallStone: () => wall('#cfc6b8'),
  wallSage: () => wall('#a9b19c'),
  wallClay: () => wall('#c8a58d'),
  wallTaupe: () => wall('#a8988a'),
  wallDark: () => wall('#3a3633'),
  wallNavy: () => wall('#2b3445'),
  wallWhite: () => wall('#f1ede6'),
  ceiling: () => new THREE.MeshStandardMaterial({ color: '#f4f0ea', roughness: 0.95 }),

  // ceramics, plants, misc
  ceramicWhite: () => new THREE.MeshPhysicalMaterial({ color: '#f4f2ee', roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 }),
  ceramicBlack: () => new THREE.MeshPhysicalMaterial({ color: '#1d1c1b', roughness: 0.3, clearcoat: 0.8 }),
  ceramicSand: () => new THREE.MeshStandardMaterial({ color: '#cbb393', roughness: 0.7 }),
  terracotta: () => new THREE.MeshStandardMaterial({ color: '#b5684a', roughness: 0.85 }),
  stoneware: () => new THREE.MeshStandardMaterial({ color: '#8d8579', roughness: 0.8 }),
  leaf: () => new THREE.MeshStandardMaterial({ color: '#3f6b3c', roughness: 0.55, side: THREE.DoubleSide }),
  leafLight: () => new THREE.MeshStandardMaterial({ color: '#6b8f4e', roughness: 0.55, side: THREE.DoubleSide }),
  soil: () => new THREE.MeshStandardMaterial({ color: '#2f2419', roughness: 1 }),
  paper: () => new THREE.MeshStandardMaterial({ color: '#f2ece0', roughness: 0.9 }),
  screen: () => new THREE.MeshStandardMaterial({ color: '#0b0c0e', roughness: 0.15, metalness: 0.4, emissive: '#1d2a3a', emissiveIntensity: 0.4 }),
  tileWhite: () => new THREE.MeshPhysicalMaterial({ color: '#eceae5', roughness: 0.2, clearcoat: 0.7, roughnessMap: plasterNoise(9, 20) }),
  tileGreen: () => new THREE.MeshPhysicalMaterial({ color: '#4f6f63', roughness: 0.18, clearcoat: 0.9 }),
  water: () => new THREE.MeshPhysicalMaterial({ color: '#a9c9cf', roughness: 0.02, transparent: true, opacity: 0.6 }),

  // emissive light sources
  lampWarm: () => new THREE.MeshStandardMaterial({ color: '#fff3df', emissive: '#ffcf8a', emissiveIntensity: 2.4, roughness: 0.6, toneMapped: false }),
  lampShade: () => new THREE.MeshStandardMaterial({ color: '#efe4cf', emissive: '#ffbf73', emissiveIntensity: 0.9, roughness: 0.9, side: THREE.DoubleSide }),
  ledStrip: () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd49a').multiplyScalar(3), toneMapped: false }),
  fire: () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff8a3a').multiplyScalar(3), toneMapped: false, transparent: true, opacity: 0.9 }),
  lightBeam: () =>
    new THREE.MeshBasicMaterial({ color: '#ffe7c2', transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),

  // windows
  skyDay: () => new THREE.MeshBasicMaterial({ map: skyView('day'), toneMapped: false }),
  skyDusk: () => new THREE.MeshBasicMaterial({ map: skyView('dusk'), toneMapped: false }),
  skyNight: () => new THREE.MeshBasicMaterial({ map: skyView('night'), toneMapped: false }),
  skyGolden: () => new THREE.MeshBasicMaterial({ map: skyView('golden'), toneMapped: false }),

  // rugs & art
  rugClassic: () => new THREE.MeshStandardMaterial({ map: rugPattern('classic'), roughness: 1 }),
  rugSage: () => new THREE.MeshStandardMaterial({ map: rugPattern('sage'), roughness: 1 }),
  rugTerracotta: () => new THREE.MeshStandardMaterial({ map: rugPattern('terracotta'), roughness: 1 }),
  rugCharcoal: () => new THREE.MeshStandardMaterial({ map: rugPattern('charcoal'), roughness: 1 }),
  art1: () => new THREE.MeshStandardMaterial({ map: artwork(1), roughness: 0.85 }),
  art2: () => new THREE.MeshStandardMaterial({ map: artwork(2), roughness: 0.85 }),
  art3: () => new THREE.MeshStandardMaterial({ map: artwork(3), roughness: 0.85 }),
  art4: () => new THREE.MeshStandardMaterial({ map: artwork(4), roughness: 0.85 }),

  curtain: () => new THREE.MeshPhysicalMaterial({ color: '#efe9df', roughness: 0.95, sheen: 1, sheenColor: '#ffffff', sheenRoughness: 0.5, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }),
  curtainDark: () => new THREE.MeshPhysicalMaterial({ color: '#6d6458', roughness: 0.95, sheen: 1, sheenColor: '#d9cbb8', sheenRoughness: 0.5, side: THREE.DoubleSide }),
  book: () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 }),

  // process / blueprint modes
  blueprint: () => new THREE.MeshBasicMaterial({ map: blueprintGrid() }),
  wire: () => new THREE.MeshBasicMaterial({ color: '#9fd3ff', wireframe: true, transparent: true, opacity: 0.55 }),
  clay: () => new THREE.MeshStandardMaterial({ color: '#e9e4dc', roughness: 0.85 }),
}

function fabric(color, sheenColor, roughness = 0.92) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    sheen: 1,
    sheenRoughness: 0.6,
    sheenColor,
    bumpMap: fabricWeave(),
    bumpScale: 0.6,
  })
}

function wall(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.92, roughnessMap: plasterNoise(2, 6), bumpMap: plasterNoise(2, 6), bumpScale: 0.15 })
}

export function getMat(name) {
  if (!cache.has(name)) {
    const def = DEFS[name]
    if (!def) {
      console.warn('Unknown material', name)
      return getMat('clay')
    }
    cache.set(name, def())
  }
  return cache.get(name)
}

export const MATERIAL_NAMES = Object.keys(DEFS)

// Material override context — lets the Process scene render the very same furniture
// as glowing wireframe ("design") or matte clay ("planning") without duplicating models.
export const MaterialMode = createContext(null)

export function useMat(name) {
  const mode = useContext(MaterialMode)
  if (typeof name !== 'string') return name // a Material instance was passed directly
  if (mode) {
    // keep light sources glowing even in override modes
    if (mode === 'clay' && (name.startsWith('lamp') || name === 'ledStrip' || name.startsWith('sky'))) return getMat(name)
    return getMat(mode)
  }
  return getMat(name)
}

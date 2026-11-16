import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Shell } from './Shell'
import { B, Cyl, Plane, RB as RBx } from '../furniture/primitives'
import {
  BubbleBed,
  WalnutNightstand,
  BeadedLamp,
  PelmetCurtains,
  TaskChair,
  BenchDesk,
  PlanterDivider,
  LightGrid,
  SnakePlanter,
  WoodBlind,
  ArchMirror,
  FloatingVanity,
  WallToilet,
  WalkInShower,
  ArchNiche,
  CoveTray,
} from '../furniture/modern-rooms'
import { chinoiserieMural, stripeFabric, carpetTiles, luxeMarbleTiles, stackedStone, marble } from '../textures'
import {
  Sofa,
  Armchair,
  LoungeChair,
  CoffeeTable,
  SideTable,
  Rug,
  RoundRug,
  MediaConsole,
  TV,
  WallArt,
  Shelving,
  Ottoman,
  RectTable,
  Vase,
} from '../furniture/living'
import { Chandelier, ArcFloorLamp, PendantGlobe, PendantDome, LinearPendant, FloorLamp, WallSconce, CoveLight } from '../furniture/lighting'
import { Plant, Curtain, RoundMirror, Sculpture } from '../furniture/decor'
import {
  Bed,
  Nightstand,
  Wardrobe,
  Bench,
  Dresser,
  BaseRun,
  UpperShelves,
  TallUnit,
  RangeHood,
  Island,
  Stool,
  DiningTable,
  DiningChair,
  Bathtub,
  Vanity,
  ShowerScreen,
  TowelLadder,
  Desk,
  OfficeChair,
  Fireplace,
} from '../furniture/rooms-furniture'
import { useMat, getMat } from '../materials'

/* =============================== LIVING =============================== */
export function LivingRoom({ shell = {}, curtainsAnimated = true }) {
  return (
    <group>
      <Shell floor="floorOak" wall="wallWarm" windows={[{ x: -1.5, w: 5, sill: 0.25, top: 3.55 }]} sky="skyDay" {...shell} />
      <CoveLight />
      <Rug w={3.8} d={2.7} position={[-1.5, 0, -1.6]} m="rugClassic" />
      <Sofa w={2.8} position={[-1.5, 0, -3.2]} m="fabricBoucle" />
      <CoffeeTable position={[-1.5, 0, -1.5]} />
      <Armchair position={[-3.75, 0, -1.2]} rotation={[0, Math.PI / 2.4, 0]} m="velvetEmerald" />
      <Armchair position={[0.75, 0, -1.2]} rotation={[0, -Math.PI / 2.4, 0]} m="velvetEmerald" />
      <SideTable position={[0.35, 0, -3.35]} />
      <ArcFloorLamp position={[-4.1, 0, -3.3]} rotation={[0, -0.4, 0]} />
      <Chandelier position={[-1.5, 0, -1.6]} drop={1.05} />
      <Curtain w={1.1} h={3.45} position={[-4.55, 3.6, -4.72]} animated={curtainsAnimated} />
      <Curtain w={1.1} h={3.45} position={[1.55, 3.6, -4.72]} animated={curtainsAnimated} />
      <Shelving w={2.3} h={2.6} position={[4.15, 0, -4.78]} seed={3} />
      <LoungeChair position={[3.7, 0, -2.6]} rotation={[0, -0.7, 0]} />
      <Ottoman position={[3.2, 0, -1.7]} m="leatherCognac" />
      <FloorLamp position={[5.3, 0, -3.4]} />
      <MediaConsole w={2.6} position={[-5.65, 0, -0.6]} rotation={[0, Math.PI / 2, 0]} />
      <WallArt w={1.5} h={1.0} art="art2" position={[-5.87, 1.75, -0.6]} rotation={[0, Math.PI / 2, 0]} />
      <WallArt w={0.9} h={1.2} art="art1" position={[5.87, 1.7, -0.8]} rotation={[0, -Math.PI / 2, 0]} />
      <Plant position={[-5.3, 0, -4.4]} height={1.9} leaves={42} seed={5} />
      <Plant position={[2.25, 0, -4.4]} height={1.35} pot="ceramicWhite" leaves={30} seed={8} kind="palm" />
      <Plant position={[5.2, 0, 0.6]} height={1.1} pot="stoneware" leaves={24} seed={2} />
    </group>
  )
}

/* =============================== BEDROOM ===============================
 * Painted-mural bedroom: a hand-painted floral mural wrapping two walls, a sage
 * bouclé bubble bed with striped bedding, walnut nightstands with glass-bead
 * lamps, a deep blue shag carpet and floor-to-ceiling linen under a pelmet. */
const texLoader = new THREE.TextureLoader()
const loadTex = (url, repeat, color = false) => {
  const t = texLoader.load(url)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.anisotropy = 8
  if (color) t.colorSpace = THREE.SRGBColorSpace
  return t
}
const photoSky = (url) => {
  const t = texLoader.load(url)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return new THREE.MeshBasicMaterial({ map: t, toneMapped: false })
}

let bedroomMats
function getBedroomMats() {
  if (bedroomMats) return bedroomMats
  const mural = chinoiserieMural()
  const muralSide = mural.clone()
  muralSide.wrapS = THREE.MirroredRepeatWrapping
  muralSide.repeat.set(10 / 7.6, 1)
  muralSide.needsUpdate = true
  const weave = '/textures/fabric_pattern_07/nor.jpg'
  const linenN = '/textures/rough_linen/nor.jpg'
  bedroomMats = {
    wall: new THREE.MeshStandardMaterial({ color: '#eadcc0', roughness: 0.95 }),
    carpet: new THREE.MeshStandardMaterial({ color: '#1b4f86', roughness: 1, normalMap: loadTex(weave, [22, 18]), normalScale: new THREE.Vector2(3, 3) }),
    mural: new THREE.MeshStandardMaterial({ map: mural, roughness: 0.9 }),
    muralSide: new THREE.MeshStandardMaterial({ map: muralSide, roughness: 0.9 }),
    boucle: new THREE.MeshStandardMaterial({ color: '#7b855e', roughness: 1, normalMap: loadTex(weave, [3, 3]), normalScale: new THREE.Vector2(1.4, 1.4) }),
    bedding: new THREE.MeshStandardMaterial({ map: stripeFabric(), roughness: 0.9 }),
    walnut: getMat('walnut'),
    brass: getMat('brass'),
    glass: new THREE.MeshPhysicalMaterial({ color: '#1d4f80', roughness: 0.08, metalness: 0.1, clearcoat: 1, transparent: true, opacity: 0.9 }),
    shade: new THREE.MeshStandardMaterial({ color: '#596a4f', roughness: 0.9, side: THREE.DoubleSide }),
    bulb: getMat('lampWarm'),
    linen: new THREE.MeshPhysicalMaterial({ color: '#d9c7a6', roughness: 0.95, sheen: 1, sheenColor: new THREE.Color('#fff4de'), sheenRoughness: 0.5, normalMap: loadTex(linenN, [2, 4]), side: THREE.DoubleSide }),
    pelmet: new THREE.MeshStandardMaterial({ color: '#d4c2a1', roughness: 0.95, normalMap: loadTex(linenN, [3, 1]) }),
    sky: photoSky('/textures/photos/sea-view.jpg'),
  }
  return bedroomMats
}

export function Bedroom({ shell = {} }) {
  const m = getBedroomMats()
  return (
    <group>
      <Shell floor={m.carpet} wall={m.wall} windows={[{ x: 3.75, w: 3.0, sill: 0.05, top: 3.3 }]} sky={m.sky} skirting="walnut" {...shell} />
      {/* hand-painted mural on the bed wall and the left wall */}
      <Plane s={[7.6, 3.04]} p={[-2.2, 1.52, -4.885]} m={m.mural} />
      <Plane s={[10, 3.04]} p={[-5.885, 1.52, 0]} r={[0, Math.PI / 2, 0]} m={m.muralSide} />
      <group position={[-2.2, 0, -3.62]}>
        <BubbleBed w={2.5} l={2.55} frame={m.boucle} bedding={m.bedding} bolster={m.bedding} />
      </group>
      {[-3.85, -0.55].map((x) => (
        <group key={x} position={[x, 0, -4.6]}>
          <WalnutNightstand m={m.walnut} knob={m.brass} />
          <group position={[0.05, 0.6, -0.02]}>
            <BeadedLamp glass={m.glass} shade={m.shade} bulb={m.bulb} />
          </group>
        </group>
      ))}
      <group position={[0, 0, -4.92]}>
        <PelmetCurtains x0={1.7} x1={5.95} h={3.75} m={m.linen} pelmet={m.pelmet} Curtain={Curtain} />
      </group>
      <Armchair position={[3.3, 0, -2.2]} rotation={[0, -0.55, 0]} m="velvetRust" leg="walnut" />
      <SideTable position={[2.25, 0, -2.9]} top="walnut" base="brass" />
      <Dresser position={[5.62, 0, -0.6]} rotation={[0, -Math.PI / 2, 0]} />
      <RoundMirror position={[5.88, 1.75, -0.6]} rotation={[0, -Math.PI / 2, 0]} />
      <Vase position={[5.6, 0.9, -1.1]} kind="round" m="ceramicSand" />
      <Plant position={[5.2, 0, 1.5]} height={1.6} pot="ceramicSand" leaves={30} seed={14} kind="palm" />
    </group>
  )
}

/* =============================== KITCHEN =============================== */
export function Kitchen({ shell = {} }) {
  return (
    <group>
      <Shell floor="marbleFloor" wall="wallWhite" windows={[{ x: -3.4, w: 1.8, sill: 1.15, top: 2.6 }]} sky="skyDay" skirting={false} {...shell} />
      <CoveLight />
      <TallUnit w={1.2} position={[-5.3, 0, -4.68]} />
      <BaseRun w={4.8} position={[-2.1, 0, -4.68]} />
      <B s={[4.8, 0.55, 0.03]} p={[-2.1, 1.2, -4.89]} m="marbleWhite" />
      <RangeHood position={[-1.04, 2.15, -4.6]} />
      <TallUnit w={1.2} position={[1.1, 0, -4.68]} />
      <UpperShelves w={2.4} position={[3.6, 1.55, -4.84]} />
      <B s={[2.6, 0.9, 0.62]} p={[3.6, 0.45, -4.68]} m="lacquerSage" />
      <B s={[2.64, 0.04, 0.66]} p={[3.6, 0.92, -4.66]} m="marbleWhite" />
      <Island position={[-2.1, 0, -1.9]} />
      {[-3.0, -2.1, -1.2].map((x) => (
        <Stool key={x} position={[x, 0, -1.05]} />
      ))}
      {[-2.9, -2.1, -1.3].map((x) => (
        <PendantGlobe key={x} position={[x, 0, -1.9]} drop={1.5} radius={0.14} />
      ))}
      <DiningTable position={[3.4, 0, -1.3]} />
      {[2.7, 3.4, 4.1].map((x) => (
        <group key={x}>
          <DiningChair position={[x, 0, -2.05]} />
          <DiningChair position={[x, 0, -0.55]} rotation={[0, Math.PI, 0]} />
        </group>
      ))}
      <LinearPendant position={[3.4, 0, -1.3]} w={1.7} drop={1.6} />
      <Rug w={3.2} d={2.4} position={[3.4, 0, -1.3]} m="rugCharcoal" />
      <Plant position={[5.3, 0, 0.4]} height={1.7} leaves={38} seed={21} />
      <WallArt w={1.2} h={0.8} art="art4" position={[5.87, 1.8, -1.4]} rotation={[0, -Math.PI / 2, 0]} frame="walnut" />
    </group>
  )
}

/* =============================== BATHROOM ===============================
 * Warm-beige spa bathroom: polished marble floor and panels, an arched mirror
 * with an LED halo over a floating oak vanity, a wall-hung WC on a stone ledge,
 * a glass walk-in shower with a stacked-travertine wall and brass fittings, a
 * lit arched niche, cove-lit ceiling and a soft beige rug. */
let bathMats
function getBathMats() {
  if (bathMats) return bathMats
  const floorTex = luxeMarbleTiles().clone()
  floorTex.repeat.set(12 / 2.4, 10 / 2.4)
  floorTex.needsUpdate = true
  const panelTex = marble('white').clone()
  panelTex.repeat.set(1.5, 1.5)
  panelTex.needsUpdate = true
  const stone = stackedStone().clone()
  stone.repeat.set(2.7 / 1.2, 2.75 / 1.2)
  stone.needsUpdate = true
  bathMats = {
    wall: new THREE.MeshStandardMaterial({ color: '#ecdfcb', roughness: 0.55 }),
    floor: new THREE.MeshPhysicalMaterial({ map: floorTex, color: '#fff7ec', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
    panel: new THREE.MeshPhysicalMaterial({ map: panelTex, color: '#f1e5d2', roughness: 0.25, clearcoat: 0.6 }),
    stone: new THREE.MeshStandardMaterial({ map: stone, roughness: 0.7 }),
    oak: getMat('oak'),
    top: new THREE.MeshStandardMaterial({ color: '#efe6d8', roughness: 0.3 }),
    ceramic: getMat('ceramicWhite'),
    brass: new THREE.MeshStandardMaterial({ color: '#cfa660', metalness: 1, roughness: 0.28 }),
    // soft, warm reflection (a full chrome mirror picks up the dark studio HDRI)
    mirror: new THREE.MeshPhysicalMaterial({ color: '#eee7dc', metalness: 0.25, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03 }),
    halo: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd9a0').multiplyScalar(1.5), toneMapped: false }),
    glow: new THREE.MeshBasicMaterial({ color: '#ffcf96', transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    led: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe2b8').multiplyScalar(1.4), toneMapped: false }),
    glass: getMat('glass'),
    tray: new THREE.MeshStandardMaterial({ color: '#e8ddcc', roughness: 0.4 }),
    bottle: new THREE.MeshStandardMaterial({ color: '#8a6438', roughness: 0.25, metalness: 0.1 }),
    ceil: new THREE.MeshStandardMaterial({ color: '#f6f0e6', roughness: 0.9 }),
    rug: new THREE.MeshStandardMaterial({ color: '#cdbba0', roughness: 1, normalMap: loadTex('/textures/fabric_pattern_07/nor.jpg', [6, 4]), normalScale: new THREE.Vector2(2.5, 2.5) }),
    towel: new THREE.MeshStandardMaterial({ color: '#f7f3ec', roughness: 1 }),
  }
  return bathMats
}

export function Bathroom({ shell = {} }) {
  const m = getBathMats()
  return (
    <group>
      <Shell floor={m.floor} wall={m.wall} windows={[]} skirting={false} {...shell} />
      <CoveTray ceil={m.ceil} led={m.led} />
      {/* vanity wall: marble panel, arched LED mirror, floating oak vanity */}
      <B s={[3.4, 3.7, 0.02]} p={[-3.3, 1.85, -4.97]} m={m.panel} />
      <group position={[-3.3, 1.2, -4.955]}>
        <ArchMirror w={1.0} h={1.65} mirror={m.mirror} halo={m.halo} glow={m.glow} />
      </group>
      <group position={[-3.3, 0, -4.96]}>
        <FloatingVanity w={1.7} wood={m.oak} top={m.top} ceramic={m.ceramic} brass={m.brass} led={m.led} glow={m.glow} />
      </group>
      {/* WC on a stone ledge, backlit marble panel above */}
      <B s={[2.0, 1.15, 0.28]} p={[-0.45, 0.575, -4.86]} m={m.panel} />
      <B s={[2.02, 0.03, 0.3]} p={[-0.45, 1.165, -4.85]} m={m.top} />
      <B s={[1.4, 1.6, 0.02]} p={[-0.45, 2.3, -4.97]} m={m.panel} />
      <B s={[1.36, 0.012, 0.02]} p={[-0.45, 1.2, -4.94]} m={m.led} shadow={false} />
      <group position={[-0.45, 0, -4.72]}>
        <WallToilet ceramic={m.ceramic} brass={m.brass} />
      </group>
      {[0, 1, 2].map((i) => (
        <RBox key={i} s={[0.34, 0.07, 0.22]} p={[0.15, 1.215 + i * 0.07, -4.84]} m={m.towel} />
      ))}
      <group position={[-1.0, 1.18, -4.84]} scale={0.6}>
        <Plant height={0.8} leaves={18} seed={71} pot="ceramicWhite" />
      </group>
      {/* walk-in shower */}
      <group position={[0.75, 0, -4.98]}>
        <WalkInShower w={2.7} d={1.75} glass={m.glass} brass={m.brass} stone={m.stone} tray={m.tray} led={m.led} bottle={m.bottle} />
      </group>
      {/* left wall: lit arched niche and a towel ring */}
      <group position={[-5.97, 0, -1.9]} rotation={[0, Math.PI / 2, 0]}>
        <ArchNiche w={0.9} h={2.2} frame={m.top} back={m.panel} shelf={m.glass} Plant={Plant} bottle={m.bottle} led={m.led} />
      </group>
      <group position={[-5.9, 1.25, -3.8]} rotation={[0, Math.PI / 2, 0]}>
        <Cyl rt={0.03} h={0.04} p={[0, 0.08, -0.02]} r={[Math.PI / 2, 0, 0]} m={m.brass} seg={14} />
        <mesh material={m.brass} position={[0, -0.02, 0.02]}>
          <torusGeometry args={[0.1, 0.008, 8, 32]} />
        </mesh>
        <RBox s={[0.3, 0.42, 0.04]} p={[0, -0.25, 0.03]} m={m.towel} />
      </group>
      {/* tall olive tree, rug */}
      <Plant position={[4.5, 0, -4.2]} height={2.1} leaves={48} seed={73} pot="ceramicWhite" />
      <RBox s={[2.6, 0.025, 1.6]} p={[-0.9, 0.013, -1.7]} m={m.rug} />
    </group>
  )
}

// rounded box with a soft radius (towels, rug)
const RBox = ({ s, p, m }) => <RBx s={s} p={p} m={m} radius={Math.min(0.03, s[1] / 2 - 0.001)} />


/* =============================== OFFICE ===============================
 * Open-plan studio: walnut benching desks with glass screens and mesh task
 * chairs, walnut planter partitions under black steel grids, linear LED bars,
 * snake plants along a ribbon window over the city, grey carpet tiles and a
 * polished-concrete walkway beside a walnut-clad wall. */
let officeMats
function getOfficeMats() {
  if (officeMats) return officeMats
  const tiles = carpetTiles()
  tiles.repeat.set(12 / 2, 10 / 2)
  officeMats = {
    carpet: new THREE.MeshStandardMaterial({ map: tiles, color: '#b4b6ba', roughness: 1 }),
    walkway: new THREE.MeshStandardMaterial({ color: '#c3c2bd', roughness: 0.32 }),
    wall: getMat('concrete'),
    walnut: getMat('walnut'),
    black: getMat('blackMetal'),
    screen: new THREE.MeshPhysicalMaterial({ color: '#d4dadd', roughness: 0.35, transparent: true, opacity: 0.45 }),
    pedestal: new THREE.MeshStandardMaterial({ color: '#232426', roughness: 0.5 }),
    mesh: new THREE.MeshStandardMaterial({ color: '#1c1d20', roughness: 0.8 }),
    led: new THREE.MeshBasicMaterial({ color: '#f4f7ff', toneMapped: false }),
    soil: new THREE.MeshStandardMaterial({ color: '#2b2420', roughness: 1 }),
    leafDark: new THREE.MeshStandardMaterial({ color: '#2f5a35', roughness: 0.6 }),
    leafEdge: new THREE.MeshStandardMaterial({ color: '#6f8f3a', roughness: 0.6 }),
    sky: photoSky('/textures/photos/city-view.jpg'),
  }
  return officeMats
}

export function Office({ shell = {} }) {
  const m = getOfficeMats()
  const chairs = [-1.4, 0, 1.4]
  return (
    <group>
      <Shell floor={m.carpet} wall={m.wall} windows={[{ x: 0.8, w: 9.6, sill: 0.55, top: 3.3 }]} sky={m.sky} skirting={false} {...shell} />
      {/* polished-concrete walkway beside a walnut-clad wall */}
      <B s={[1.9, 0.01, 10]} p={[-5.05, 0.006, 0]} m={m.walkway} shadow={false} />
      <B s={[0.04, 3.9, 10]} p={[-5.97, 1.95, 0]} m={m.walnut} />
      {Array.from({ length: 16 }, (_, i) => (
        <B key={i} s={[0.012, 3.9, 0.012]} p={[-5.945, 1.95, -4.7 + i * 0.63]} m={m.black} shadow={false} />
      ))}
      {/* wood blinds, half lowered */}
      <group position={[0.8, 0, -4.82]}>
        <WoodBlind w={9.5} top={3.28} drop={0.85} m={m.walnut} />
      </group>
      {/* planter partitions along the walkway */}
      {[-3.6, -1.4, 0.8].map((z, i) => (
        <group key={z} position={[-3.75, 0, z]}>
          <PlanterDivider len={2.0} wood={m.walnut} frame={m.black} soil={m.soil} Plant={Plant} seed={i + 2} />
        </group>
      ))}
      {/* two benching clusters */}
      {[-2.3, 0.75].map((z) => (
        <group key={z} position={[1.0, 0, z]}>
          <BenchDesk len={4.2} depth={1.5} top={m.walnut} frame={m.black} screen={m.screen} pedestal={m.pedestal} />
          {chairs.map((x) => (
            <group key={x}>
              <group position={[x, 0, -1.1]}>
                <TaskChair mesh={m.mesh} frame={m.black} />
              </group>
              <group position={[x, 0, 1.1]} rotation={[0, Math.PI, 0]}>
                <TaskChair mesh={m.mesh} frame={m.black} />
              </group>
            </group>
          ))}
        </group>
      ))}
      <group position={[1.0, 0, -0.78]}>
        <LightGrid w={5.4} d={4.6} frame={m.black} led={m.led} />
      </group>
      {/* snake plants along the windows */}
      {[-1.15, 3.0].map((x, i) => (
        <group key={x} position={[x, 0, -4.6]}>
          <SnakePlanter len={3.8} wood={m.walnut} leafDark={m.leafDark} leafEdge={m.leafEdge} seed={i + 4} />
        </group>
      ))}
      {/* walnut storage wall on the right */}
      <B s={[0.55, 1.9, 3.4]} p={[5.7, 0.95, -0.4]} m={m.walnut} />
      {[-1.5, -0.65, 0.2, 1.05].map((z) => (
        <B key={z} s={[0.012, 1.86, 0.012]} p={[5.42, 0.95, z - 0.4]} m={m.black} shadow={false} />
      ))}
      <group position={[5.55, 0, 2.6]} rotation={[0, Math.PI / 2, 0]}>
        <SnakePlanter len={1.6} wood={m.walnut} leafDark={m.leafDark} leafEdge={m.leafEdge} seed={9} />
      </group>
    </group>
  )
}

/* =============================== LOUNGE (contact) =============================== */
function Flames(props) {
  const g = useRef()
  const mat = useMat('fire')
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.elapsedTime
    g.current.children.forEach((c, i) => {
      c.scale.y = 0.8 + Math.sin(t * (7 + i) + i * 1.7) * 0.18 + Math.sin(t * 13 + i) * 0.08
      c.position.x = c.userData.x + Math.sin(t * 5 + i) * 0.01
    })
  })
  return (
    <group ref={g} {...props}>
      {[-0.3, -0.12, 0.05, 0.22, 0.36].map((x, i) => (
        <mesh key={i} position={[x * 0.9, 0.16, 0]} userData={{ x: x * 0.9 }} material={mat}>
          <coneGeometry args={[0.07 + (i % 2) * 0.03, 0.34 + (i % 3) * 0.08, 8]} />
        </mesh>
      ))}
    </group>
  )
}

export function Lounge({ shell = {} }) {
  return (
    <group>
      <Shell
        floor="floorWalnut"
        wall="wallDark"
        sideWall="wallTaupe"
        windows={[
          { x: -3.9, w: 2.2, sill: 0.4, top: 3.4 },
          { x: 3.9, w: 2.2, sill: 0.4, top: 3.4 },
        ]}
        sky="skyDusk"
        {...shell}
      />
      <CoveLight />
      <Fireplace position={[0, 0, -4.7]} />
      <Flames position={[0, 0.1, -4.33]} />
      <WallArt w={1.6} h={1.1} art="art4" position={[0, 2.3, -4.88]} frame="brass" />
      <WallSconce position={[-1.5, 2.2, -4.88]} />
      <WallSconce position={[1.5, 2.2, -4.88]} />
      <Rug w={3.6} d={2.8} position={[0, 0, -2.4]} m="rugTerracotta" />
      <Armchair position={[-1.45, 0, -2.6]} rotation={[0, Math.PI / 2 + 0.5, 0]} m="velvetRust" leg="brass" />
      <Armchair position={[1.45, 0, -2.6]} rotation={[0, -Math.PI / 2 - 0.5, 0]} m="velvetRust" leg="brass" />
      <RectTable position={[0, 0, -2.3]} w={1.1} d={0.6} top="marbleBlack" leg="brass" />
      <Vase position={[0.2, 0.43, -2.3]} kind="bud" m="ceramicWhite" />
      <Sofa w={2.4} position={[0, 0, -0.6]} rotation={[0, Math.PI, 0]} m="fabricCharcoal" pillows={['velvetRust', 'fabricSand']} />
      <FloorLamp position={[-2.6, 0, -1.1]} />
      <Sculpture position={[4.6, 0, -1.6]} />
      <Plant position={[-5.2, 0, -4.3]} height={1.9} leaves={42} seed={51} />
      <Plant position={[5.2, 0, -4.3]} height={1.4} leaves={30} seed={53} pot="ceramicBlack" kind="palm" />
      <Shelving w={2.0} h={2.4} position={[-5.62, 0, -1.4]} rotation={[0, Math.PI / 2, 0]} seed={57} m="walnut" />
    </group>
  )
}

export const ROOM_COMPONENTS = { living: LivingRoom, bedroom: Bedroom, kitchen: Kitchen, bathroom: Bathroom, office: Office, lounge: Lounge }
export { Chandelier, PendantGlobe, TV }

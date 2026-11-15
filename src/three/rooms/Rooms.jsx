import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Shell } from './Shell'
import { B, Cyl } from '../furniture/primitives'
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
import { useMat } from '../materials'

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

/* =============================== BEDROOM =============================== */
export function Bedroom({ shell = {}, curtainsAnimated = true }) {
  return (
    <group>
      <Shell floor="floorWalnut" wall="wallClay" sideWall="wallStone" windows={[{ x: 3.3, w: 2.8, sill: 0.4, top: 3.4 }]} sky="skyGolden" {...shell} />
      <CoveLight />
      <Rug w={3.4} d={3.0} position={[-1.6, 0, -2.6]} m="rugSage" />
      <Bed position={[-1.6, 0, -3.65]} />
      <Nightstand position={[-3.2, 0, -4.45]} />
      <Nightstand position={[0, 0, -4.45]} />
      <PendantGlobe position={[-3.25, 0, -4.4]} drop={2.05} radius={0.12} />
      <PendantGlobe position={[0.05, 0, -4.4]} drop={2.05} radius={0.12} />
      <WallArt w={1.7} h={0.9} art="art3" position={[-1.6, 2.55, -4.86]} />
      <Bench position={[-1.6, 0, -1.95]} />
      <Wardrobe w={3.0} position={[-5.6, 0, -2.6]} rotation={[0, Math.PI / 2, 0]} />
      <Armchair position={[3.4, 0, -2.6]} rotation={[0, -0.5, 0]} m="fabricSand" leg="brass" />
      <SideTable position={[2.4, 0, -3.4]} top="marbleWhite" />
      <Curtain w={0.9} h={3.3} position={[1.55, 3.55, -4.72]} m="curtainDark" animated={curtainsAnimated} />
      <Curtain w={0.9} h={3.3} position={[5.05, 3.55, -4.72]} m="curtainDark" animated={curtainsAnimated} />
      <Dresser position={[5.62, 0, -0.6]} rotation={[0, -Math.PI / 2, 0]} />
      <RoundMirror position={[5.88, 1.75, -0.6]} rotation={[0, -Math.PI / 2, 0]} />
      <Vase position={[5.6, 0.9, -1.1]} kind="round" m="ceramicWhite" />
      <Plant position={[5.2, 0, -4.3]} height={1.6} leaves={34} seed={12} />
      <Plant position={[-5.1, 0, 0.5]} height={1.2} pot="ceramicSand" leaves={26} seed={14} kind="palm" />
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

/* =============================== BATHROOM =============================== */
export function Bathroom({ shell = {} }) {
  return (
    <group>
      <Shell floor="marbleFloor" wall="wallStone" windows={[{ x: -2.2, w: 2.8, sill: 0.95, top: 3.2 }]} sky="skyDay" skirting={false} {...shell} />
      <CoveLight />
      <B s={[4.2, 3.2, 0.03]} p={[2.9, 1.6, -4.88]} m="tileGreen" />
      <Bathtub position={[-2.2, 0, -3.4]} />
      <Vanity position={[2.6, 0, -4.6]} w={2.2} />
      <RoundMirror position={[2.05, 1.75, -4.84]} radius={0.38} />
      <RoundMirror position={[3.15, 1.75, -4.84]} radius={0.38} />
      <WallSconce position={[1.45, 1.8, -4.86]} />
      <WallSconce position={[2.6, 1.8, -4.86]} />
      <WallSconce position={[3.75, 1.8, -4.86]} />
      <ShowerScreen position={[4.6, 0, -4.4]} />
      <Cyl rt={0.16} h={0.02} p={[5.3, 2.4, -4.3]} m="brass" />
      <TowelLadder position={[-5.6, 0, -1.6]} rotation={[0, Math.PI / 2, 0]} />
      <PendantGlobe position={[-2.9, 0, -3.4]} drop={1.6} radius={0.12} />
      <PendantGlobe position={[-1.5, 0, -3.4]} drop={1.6} radius={0.12} />
      <LoungeChair position={[0.6, 0, -1.6]} rotation={[0, -0.4, 0]} m="linenWhite" frame="oak" />
      <SideTable position={[-0.3, 0, -1.5]} top="travertine" base="brassBrushed" />
      <RoundRug radius={1.1} position={[-1.5, 0, -1.4]} m="rugClassic" />
      <Plant position={[-5.1, 0, -4.3]} height={1.5} leaves={32} seed={31} pot="ceramicWhite" kind="palm" />
      <Plant position={[5.2, 0, -1]} height={1.2} leaves={26} seed={33} pot="stoneware" />
    </group>
  )
}

/* =============================== OFFICE =============================== */
export function Office({ shell = {} }) {
  return (
    <group>
      <Shell floor="floorWalnut" wall="wallNavy" sideWall="wallTaupe" windows={[{ x: 3.4, w: 3.0, sill: 0.6, top: 3.3 }]} sky="skyDay" {...shell} />
      <CoveLight />
      <Shelving w={1.9} h={2.9} position={[-4.4, 0, -4.78]} seed={41} m="walnut" />
      <Shelving w={1.9} h={2.9} position={[-2.35, 0, -4.78]} seed={42} m="walnut" />
      <Desk position={[0.4, 0, -2.4]} rotation={[0, Math.PI, 0]} />
      <OfficeChair position={[0.4, 0, -3.25]} />
      <PendantDome position={[0.4, 0, -2.4]} drop={1.4} />
      <Rug w={3.2} d={2.4} position={[0.4, 0, -2.5]} m="rugCharcoal" />
      <LoungeChair position={[-3.8, 0, -1.4]} rotation={[0, 0.6, 0]} />
      <SideTable position={[-4.6, 0, -0.7]} />
      <FloorLamp position={[-5.2, 0, -1.8]} />
      <WallArt w={1.4} h={1.0} art="art3" position={[-5.87, 1.8, 0.2]} rotation={[0, Math.PI / 2, 0]} frame="brass" />
      <Plant position={[5.2, 0, -4.2]} height={1.8} leaves={40} seed={45} />
      <Plant position={[1.8, 0, -4.4]} height={1.0} leaves={20} seed={46} pot="ceramicBlack" />
      <Curtain w={0.8} h={3.2} position={[1.7, 3.45, -4.72]} m="curtainDark" animated={false} />
      <Curtain w={0.8} h={3.2} position={[5.1, 3.45, -4.72]} m="curtainDark" animated={false} />
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

export const PROJECTS = [
  {
    id: 'living',
    room: 'living',
    title: 'The Oakhaven Residence',
    type: 'Living Room',
    location: 'Hillside villa',
    area: '68 m²',
    style: 'Warm minimalism',
    materials: ['Bouclé', 'White oak', 'Calacatta marble', 'Aged brass'],
    text: 'A double-aspect lounge built around a five-metre picture window — layered textures, a sculptural brass chandelier and an emerald velvet counterpoint.',
  },
  {
    id: 'bedroom',
    room: 'bedroom',
    title: 'Suite Terracotta',
    type: 'Master Bedroom',
    location: 'Penthouse',
    area: '42 m²',
    style: 'Soft Mediterranean',
    materials: ['Clay plaster', 'Smoked walnut', 'Linen', 'Velvet'],
    text: 'Clay-toned walls and a channel-tufted headboard wrap the bed in calm. Golden-hour light, layered linens and bespoke walnut joinery.',
  },
  {
    id: 'kitchen',
    room: 'kitchen',
    title: 'Atelier Kitchen',
    type: 'Modular Kitchen',
    location: 'Townhouse',
    area: '54 m²',
    style: 'Modern classic',
    materials: ['Sage lacquer', 'Marble waterfall', 'Fluted walnut', 'Brushed brass'],
    text: 'A modular kitchen with a fluted walnut island, waterfall marble edges and a sculpted brass hood — designed for cooking and entertaining in equal measure.',
  },
  {
    id: 'bathroom',
    room: 'bathroom',
    title: 'Verde Spa Bath',
    type: 'Bathroom',
    location: 'Lake house',
    area: '36 m²',
    style: 'Contemporary spa',
    materials: ['Glazed green tile', 'Marble', 'Brass fixtures', 'Oak'],
    text: 'A freestanding sculptural tub under a garden window, twin vessel basins and a glazed green feature wall — a private spa at home.',
  },
  {
    id: 'office',
    room: 'office',
    title: 'Navy Study',
    type: 'Home Office',
    location: 'City apartment',
    area: '30 m²',
    style: 'Library modern',
    materials: ['Navy plaster', 'Walnut', 'Leather', 'Blackened steel'],
    text: 'Deep navy walls, full-height walnut library shelving and a reading corner — a focused workspace that feels like a private club.',
  },
]

export const SERVICES = [
  {
    title: 'Furniture & Space Planning',
    short: 'Furniture',
    text: 'Layouts that flow, and bespoke pieces scaled to the way you live — from sofas to custom joinery, presented in 3D before anything is built.',
    points: ['Space planning & zoning', 'Bespoke furniture', 'Custom joinery'],
  },
  {
    title: 'Lighting Design',
    short: 'Lighting',
    text: 'Layered ambient, task and accent lighting. Pendants, coves and sculptural fixtures composed like a cinematographer lights a scene.',
    points: ['Layered lighting plans', 'Statement fixtures', 'Smart scenes & dimming'],
  },
  {
    title: 'Ceiling Design',
    short: 'Ceilings',
    text: 'Coffered timber, floating gypsum panels and hidden LED coves that add architecture, acoustics and drama overhead.',
    points: ['Coffered & beamed ceilings', 'Floating panels', 'Hidden cove lighting'],
  },
  {
    title: 'Walls & Décor',
    short: 'Walls',
    text: 'Fluted panelling, natural plasters, curated art and sconces — the finishing layer that makes a room feel collected and personal.',
    points: ['Wall panelling & plaster', 'Art curation', 'Styling & accessories'],
  },
]

export const PROCESS = [
  { title: 'Planning', text: 'We measure, listen and map how you live. Every space begins as an accurate digital floor plan.', tag: 'Weeks 1–2' },
  { title: 'Design', text: 'Concepts become 3D layouts and furniture studies, refined with you in real-time walkthroughs.', tag: 'Weeks 3–5' },
  { title: 'Material Selection', text: 'Stone, timber, textiles and metals — curated, sampled and tested in your actual light.', tag: 'Weeks 6–7' },
  { title: 'Execution', text: 'Our site team and craftspeople build, install and style until the render becomes your reality.', tag: 'Weeks 8–16' },
]

export const TRANSFORM_STEPS = [
  { at: 0, label: 'Empty shell' },
  { at: 0.06, label: 'Floors & finishes' },
  { at: 0.22, label: 'Furniture' },
  { at: 0.56, label: 'Lighting' },
  { at: 0.7, label: 'Styling & décor' },
  { at: 0.92, label: 'Dream room' },
]

export const CHAPTERS = {
  living: {
    num: '01',
    kicker: 'The Living Room',
    title: 'Light, texture and calm, composed.',
    text: 'Bouclé, white oak and Calacatta marble under a five-metre window. Every piece is placed for the way afternoon light moves across the room.',
    facts: [['Area', '68 m²'], ['Palette', 'Oat · Emerald · Brass']],
    side: 'left',
  },
  bedroom: {
    num: '02',
    kicker: 'The Bedroom',
    title: 'A sanctuary in clay and walnut.',
    text: 'Warm plaster walls, a channel-tufted headboard and layered linens. Golden-hour glazing and dimmable pendants for slow mornings.',
    facts: [['Area', '42 m²'], ['Mood', 'Soft · Warm · Still']],
    side: 'right',
  },
  kitchen: {
    num: '03',
    kicker: 'The Kitchen',
    title: 'Crafted for gathering.',
    text: 'Sage lacquered cabinetry, a fluted walnut island with waterfall marble, and a dining table under a linear brass light.',
    facts: [['Area', '54 m²'], ['Seats', '9 guests']],
    side: 'left',
  },
}

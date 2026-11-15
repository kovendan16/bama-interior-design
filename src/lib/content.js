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

// Full-screen background photos for each section (files in public/images/scenes/).
// Multi-photo sections switch photo per step: services (4), process (4).
// The transformation section has no photos: it is the live 3D room.
// Free photos from Unsplash (unsplash.com/license) — swap in your own project photos any time.
export const SCENE_PHOTOS = {
  living: ['/images/scenes/living.jpg'],
  bedroom: ['/images/scenes/bedroom.jpg'],
  kitchen: ['/images/scenes/kitchen.jpg'],
  services: [
    '/images/scenes/s1-furniture.jpg',
    '/images/scenes/s2-lighting.jpg',
    '/images/scenes/s3-ceilings.jpg',
    '/images/scenes/s4-walls.jpg',
  ],
  about: ['/images/scenes/about.jpg'],
  process: [
    '/images/scenes/p1-planning.jpg',
    '/images/scenes/p2-design.jpg',
    '/images/scenes/p3-materials.jpg',
    '/images/scenes/p4-execution.jpg',
  ],
  contact: ['/images/scenes/contact.jpg'],
}

// scroll thresholds of the four process steps
export const PROCESS_AT = [0, 0.18, 0.42, 0.76]

// Project photo gallery (files in public/images/gallery/). Add, remove or reorder freely.
// A tile whose file is missing shows a blush placeholder until you add the photo.
export const GALLERY = [
  { src: '/images/gallery/living-1.jpg', title: 'Marble fireplace lounge', category: 'Living' },
  { src: '/images/gallery/bedroom-1.jpg', title: 'City-view master suite', category: 'Bedroom' },
  { src: '/images/gallery/kitchen-1.jpg', title: 'Marble island kitchen', category: 'Kitchen' },
  { src: '/images/gallery/bathroom-1.jpg', title: 'Stone & walnut bath', category: 'Bathroom' },
  { src: '/images/gallery/living-2.jpg', title: 'Soft neutral living room', category: 'Living' },
  { src: '/images/gallery/office-1.jpg', title: 'Library home office', category: 'Office' },
  { src: '/images/gallery/dining-1.jpg', title: 'Garden dining room', category: 'Dining' },
  { src: '/images/gallery/bedroom-2.jpg', title: 'Forest green bedroom', category: 'Bedroom' },
  { src: '/images/gallery/kitchen-2.jpg', title: 'Noir kitchen', category: 'Kitchen' },
  { src: '/images/gallery/bathroom-2.jpg', title: 'Warm oak spa bath', category: 'Bathroom' },
]

// Copy for the homepage sections. Edit freely — components read everything from here.

// Hero transformation: one message per stage. `t` = position on the 0–100 GSAP timeline.
export const HERO_STAGES = [
  {
    t: 0,
    label: 'Empty room',
    title: ['Every Beautiful Space', 'Begins With an', 'Idea.'],
    text: 'Bare walls, natural light and endless possibility — this is where every Bama project starts.',
  },
  {
    t: 10,
    label: 'Floors & finishes',
    title: ['Foundations That', 'Set the', 'Tone.'],
    text: 'Polished marble floors, soft cream walls and fluted wood panelling bring warmth to the shell.',
  },
  {
    t: 28,
    label: 'Furniture',
    title: ['Designed Around', 'Your', 'Lifestyle.'],
    text: 'We create functional and beautiful living spaces tailored to your needs.',
  },
  {
    t: 50,
    label: 'Lighting',
    title: ['Every Detail', '', 'Matters.'],
    text: 'From lighting to textures, every element is thoughtfully selected.',
  },
  {
    t: 68,
    label: 'Decoration',
    title: ['Layers That Make', 'It', 'Yours.'],
    text: 'Curtains, cushions, plants and artwork add softness and personality.',
  },
  {
    t: 86,
    label: 'Complete',
    title: ['Your Dream Space,', 'Our', 'Expertise.'],
    text: 'Discover how Bama Interior Design transforms ordinary spaces into extraordinary experiences.',
  },
]

// "Meet the Director" block in the About section (photos in public/images/team/).
export const DIRECTOR = {
  name: 'T. Dhavinash',
  role: 'Director, Bama Interior Design',
  quote: 'Every home we design begins with listening — to how you live, what you love, and how you want to feel the moment you walk through the door.',
  text: 'At Bama, every project is personally guided from the first sketch to the final styling — so the space we hand over feels unmistakably yours.',
  photos: [
    { src: '/images/team/director-standing.jpg', alt: 'T. Dhavinash, Director of Bama Interior Design, standing and smiling' },
    { src: '/images/team/director-seated.jpg', alt: 'T. Dhavinash, Director of Bama Interior Design, seated' },
  ],
}

export const ABOUT = {
  heading: 'Designing Spaces That Feel Like Home.',
  text: 'At Bama Interior Design, we believe every space deserves thoughtful design. We combine creativity, functionality and attention to detail to create beautiful interiors that reflect your lifestyle and personality.',
  pillars: [
    { icon: 'BookOpen', title: 'Our Story', text: 'Bama began with a simple belief: a well-designed space changes how you feel every single day.', img: '/images/gallery/living-2.jpg' },
    { icon: 'Eye', title: 'Our Vision', text: 'To be the studio people trust to turn ordinary rooms into places they love coming home to.', img: '/images/gallery/bedroom-1.jpg' },
    { icon: 'Target', title: 'Our Mission', text: 'Deliver personal, functional and beautifully crafted interiors — on time, with complete transparency.', img: '/images/gallery/kitchen-1.jpg' },
    { icon: 'Sparkles', title: 'Our Design Philosophy', text: 'Light first, then materials, then the details that make a room unmistakably yours.', img: '/images/scenes/s4-walls.jpg' },
  ],
}

export const SERVICES_LIST = [
  { icon: 'Home', title: 'Residential Interior Design', text: 'Complete home interiors planned around how your family lives.', img: '/images/gallery/living-1.jpg' },
  { icon: 'Building2', title: 'Commercial Interior Design', text: 'Lobbies, showrooms and hospitality spaces that impress at first sight.', img: '/images/site/commercial.jpg' },
  { icon: 'Sofa', title: 'Living Room Design', text: 'Layered seating, light and texture for rooms made for gathering.', img: '/images/scenes/living.jpg' },
  { icon: 'BedDouble', title: 'Bedroom Interior Design', text: 'Calm, restful bedrooms with smart storage and soft lighting.', img: '/images/gallery/bedroom-2.jpg' },
  { icon: 'CookingPot', title: 'Modular Kitchen Design', text: 'Efficient, durable kitchens with premium finishes and fittings.', img: '/images/scenes/kitchen.jpg' },
  { icon: 'Briefcase', title: 'Office Interior Design', text: 'Workspaces that support focus, collaboration and your brand.', img: '/images/gallery/office-1.jpg' },
  { icon: 'Lamp', title: 'False Ceiling Design', text: 'Coffers, floating panels and hidden cove lighting overhead.', img: '/images/scenes/s3-ceilings.jpg' },
  { icon: 'Ruler', title: 'Space Planning', text: 'Layouts that flow — measured, zoned and tested in 3D first.', img: '/images/scenes/p1-planning.jpg' },
]

// `showcase` links a project to a room in the interactive 3D showcase
export const PROJECTS_LIST = [
  { name: 'The Marble Lounge', category: 'Luxury Living Rooms', style: 'Modern classic', text: 'A double-height lounge with a marble fireplace, coffered ceiling and soft neutral seating.', img: '/images/gallery/living-1.jpg', showcase: 'living' },
  { name: 'Forest Green Suite', category: 'Modern Bedrooms', style: 'Contemporary calm', text: 'Deep green panelling, a sculptural sconce and layered linen for restful nights.', img: '/images/gallery/bedroom-2.jpg', showcase: 'bedroom' },
  { name: 'Noir Kitchen', category: 'Contemporary Kitchens', style: 'Dark luxe', text: 'Matte black cabinetry, veined stone and warm under-cabinet lighting.', img: '/images/gallery/kitchen-2.jpg', showcase: 'kitchen' },
  { name: 'Garden Apartment', category: 'Luxury Apartments', style: 'Elegant traditional', text: 'A formal dining room opening onto the garden, with ruby velvet chairs.', img: '/images/gallery/dining-1.jpg' },
  { name: 'The White Villa', category: 'Independent Houses', style: 'Modern minimal', text: 'A two-storey family home planned room by room, inside and out.', img: '/images/site/house.jpg' },
  { name: 'Skyline Lobby', category: 'Commercial Interiors', style: 'Hospitality luxe', text: 'A light-filled hotel lobby with a sculptural chandelier and lounge zones.', img: '/images/site/commercial.jpg', showcase: 'office' },
]

export const PROCESS_STEPS = [
  { title: 'Initial Consultation', text: 'We meet, listen and understand the space, the budget and how you want to feel in it.', img: '/images/site/consultation.jpg' },
  { title: 'Understanding Client Requirements', text: 'A detailed brief: family needs, storage, style references and must-haves.', img: '/images/scenes/p3-materials.jpg' },
  { title: 'Space Planning', text: 'Accurate measurements and layouts that make every square foot work.', img: '/images/scenes/p1-planning.jpg' },
  { title: 'Design & 3D Visualization', text: 'Photoreal 3D views of every room, so you see it before anything is built.', img: '/images/scenes/p2-design.jpg' },
  { title: 'Material Selection', text: 'Stone, timber, fabric and finishes — sampled and approved together.', img: '/images/scenes/s4-walls.jpg' },
  { title: 'Project Execution', text: 'Our site team and craftspeople build and install with weekly progress updates.', img: '/images/scenes/p4-execution.jpg' },
  { title: 'Final Handover', text: 'Styling, a detailed walkthrough and a space that is ready to live in.', img: '/images/gallery/living-2.jpg' },
]

export const WHY = [
  { icon: 'UserRoundCheck', title: 'Personalized Interior Solutions', text: 'Every design starts from your lifestyle — never from a template.' },
  { icon: 'LayoutGrid', title: 'Modern and Functional Designs', text: 'Beautiful rooms that work hard: storage, flow and comfort built in.' },
  { icon: 'Gem', title: 'Quality Materials', text: 'Trusted suppliers and durable finishes chosen to last for years.' },
  { icon: 'Palette', title: 'Creative Design Approach', text: 'Fresh ideas, considered colour and a signature eye for detail.' },
  { icon: 'ScanSearch', title: 'Attention to Detail', text: 'From skirting lines to switch plates — nothing is an afterthought.' },
  { icon: 'HardHat', title: 'Professional Execution', text: 'Clear timelines, skilled teams and transparent communication.' },
]

// PLACEHOLDERS — replace with genuine client feedback (with permission) before publishing.
export const TESTIMONIALS = [
  { name: 'Client name', project: 'Project type · City', text: 'Your client’s review will appear here. Replace this placeholder with genuine feedback from a completed project.' },
  { name: 'Client name', project: 'Project type · City', text: 'Your client’s review will appear here. Replace this placeholder with genuine feedback from a completed project.' },
  { name: 'Client name', project: 'Project type · City', text: 'Your client’s review will appear here. Replace this placeholder with genuine feedback from a completed project.' },
]

export const PROJECT_TYPES = ['Full home', 'Living room', 'Bedroom', 'Modular kitchen', 'Office', 'Commercial space', 'False ceiling', 'Other']

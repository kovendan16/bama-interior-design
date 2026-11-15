// Shared, mutable state for the clay scenes. Written by DOM ScrollTriggers,
// read every frame inside the R3F canvases. (No three.js import: safe for the main bundle.)
export const clay = {
  hero: 0, // 0..1 scroll through the hero
  story: 0, // 0..1 scroll through "From moodboard to room" (pinned range)
  cta: 0, // 0..1 scroll through the curtain reveal (pinned range)
}

// "From moodboard to room": each swatch flies from the board into the model
// room and becomes that surface. Windows are fractions of the pinned scroll.
export const MOODBOARD_STEPS = [
  { key: 'floor', swatch: 'Oak parquet', to: 'Floor', at: [0.1, 0.22] },
  { key: 'walls', swatch: 'Lime plaster', to: 'Walls', at: [0.22, 0.34] },
  { key: 'sofa', swatch: 'Blush velvet', to: 'Sofa', at: [0.34, 0.46] },
  { key: 'table', swatch: 'Calacatta marble', to: 'Table', at: [0.46, 0.58] },
  { key: 'curtain', swatch: 'Washed linen', to: 'Curtains', at: [0.58, 0.7] },
  { key: 'lamp', swatch: 'Brushed brass', to: 'Lamp', at: [0.7, 0.82] },
]
export const MOODBOARD_LOGO = [0.86, 0.96]

// curtain reveal: how far the curtains are open (fraction of pinned scroll)
export const CURTAIN_OPEN = [0.06, 0.36]
// then the picture lights switch on and every service photo appears on the wall
export const GALLERY_LIGHTS = [0.42, 0.54]
export const GALLERY_FRAMES = [0.5, 0.64]
// finally the headline + button
export const CTA_COPY = [0.7, 0.82]

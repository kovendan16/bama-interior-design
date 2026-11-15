// Shared, mutable state for the clay scenes. Written by DOM ScrollTriggers,
// read every frame inside the R3F canvases. (No three.js import: safe for the main bundle.)
export const clay = {
  hero: 0, // 0..1 scroll through the hero
  story: 0, // 0..1 scroll through the "idea → home" story (pinned range)
  cta: 0, // 0..1 scroll through the closing section
}

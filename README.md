# Bama Interior Design — Immersive 3D Interior Design Website

A scroll-driven 3D walkthrough of a luxury home, built with React + Vite, Three.js,
React Three Fiber, Drei, GSAP + ScrollTrigger and Lenis smooth scrolling.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## What's inside

| Section | 3D experience |
|---|---|
| Hero | Camera flies into a furnished living room; daylight drifts, window shadows move, curtains sway |
| Walkthrough | Scroll walks the camera through doorways: living room → bedroom → kitchen |
| Empty → Dream room | Raw concrete shell; floors, walls, furniture, lights and décor animate in with scroll |
| Dollhouse | Miniature six-room house; scroll rotates it and lifts the floors apart; click a room to fly in |
| Portfolio | Separate lazy-loaded viewer: orbit, zoom, and a 360° "step inside" mode for 5 projects |
| Services | Showroom: furniture turntable, pendant lighting, coffered ceiling and fluted walls by category |
| About | Concrete architectural hall with light shafts and a crane-up camera move |
| Process | Blueprint → wireframe → material swatches → finished room |
| Contact | Fireside lounge background, validated contact form, phone/email CTAs |

## Customising

- **Studio details** (name, phone, email, address): `src/lib/site.js`
- **Copy** (projects, services, process steps, room chapters): `src/lib/content.js`
- **Contact form**: wire the `submit` handler in `src/components/sections/Contact.jsx` to your backend
  or form service (it currently simulates a successful send).
- **Camera choreography**: `src/three/cameraPaths.js` (one spline per section)
- **Rooms & furniture**: `src/three/rooms/*` and `src/three/furniture/*`
- **Materials**: `src/three/materials.js` — textures are generated procedurally in `textures.js`,
  so there are no heavy asset downloads. To use real GLB models, load them with Drei's `useGLTF`
  inside any room component.

## Performance notes

- One fixed WebGL canvas for the whole site; rooms far from the camera are culled.
- Fixed light rig (no per-room lights) so shaders never recompile mid-scroll; all shaders are
  pre-compiled behind the loader.
- Shared, cached geometries/materials; instanced books, leaves and fluting.
- Adaptive pixel ratio (`PerformanceMonitor`), smaller shadow maps and no backdrop blur on mobile.
- The portfolio viewer is code-split and mounted only when near; the main canvas pauses while
  the portfolio covers the screen.
- Respects `prefers-reduced-motion` (no smooth scroll, no parallax, instant intro).

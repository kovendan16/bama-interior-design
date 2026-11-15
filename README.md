# Bama Interior Design — 3D interior design website

React + Vite, Three.js / React Three Fiber / Drei, GSAP + ScrollTrigger, Lenis,
Tailwind CSS (utilities only) and Lucide icons.

## Run

```bash
npm install
npm run dev       # http://localhost:5173 (or the next free port)
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Page structure

| Section | Component | Notes |
|---|---|---|
| Hero — empty room → luxury room | `components/sections/Hero.jsx`, `three/hero/TransformCanvas.jsx`, `three/rooms/TransformRoom.jsx` | Pinned; one GSAP timeline (`three/transformTimeline.js`) scrubbed by scroll. ↑ / ↓ keys jump between stages. |
| About | `sections/About.jsx` | |
| Services (8 cards) | `sections/Services.jsx` | |
| Projects + lightbox | `sections/Projects.jsx` | "View in 3D" opens the room in the showcase |
| Interactive 3D showcase | `sections/Showcase.jsx`, `three/ShowcaseCanvas.jsx` | Rotate, zoom, step inside |
| Design process (7 steps) | `sections/Process.jsx` | |
| Moodboard → room | `sections/Story.jsx`, `three/clay/ClayCanvas.jsx` | |
| Why choose Bama | `sections/WhyChoose.jsx` | |
| Testimonials | `sections/Testimonials.jsx` | **Placeholders** — replace with genuine reviews |
| Curtain reveal | `sections/Cta.jsx` | |
| Contact (+ WhatsApp) | `sections/Contact.jsx` | Wire `submit` to your backend/form service |
| Footer | `components/Footer.jsx` | |

## Editing content

- **Company details** (phone, WhatsApp, email, address, hours, social links) — `src/lib/site.js`. All values are placeholders.
- **Section copy, services, projects, process steps, stage messages, testimonials** — `src/lib/sections.js`.
- **Transformation timing** — `src/three/transformTimeline.js`.

## Assets & licences

- 3D furniture, textures and lighting (HDRI) — Poly Haven, CC0 (`public/models`, `public/textures`, `public/hdri`).
- Photos — Unsplash Licence. Full list in `public/images/PHOTO-CREDITS.txt`.

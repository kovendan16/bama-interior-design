import { useEffect, useLayoutEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { Loader } from './components/Loader'
import { Footer } from './components/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Services } from './components/sections/Services'
import { Projects } from './components/sections/Projects'
import { Showcase } from './components/sections/Showcase'
import { Process } from './components/sections/Process'
import { Story } from './components/sections/Story'
import { WhyChoose } from './components/sections/WhyChoose'
import { Testimonials } from './components/sections/Testimonials'
import { Cta } from './components/sections/Cta'
import { Contact } from './components/sections/Contact'
import { store } from './lib/store'
import { getDevice } from './lib/device'
import { initSmoothScroll, ScrollTrigger, gsap } from './lib/scroll'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/*
 * Page order
 *   Hero (pinned 3D transformation) → About → Services → Projects → 3D Showcase
 *   → Design Process → Moodboard → Why Bama → Testimonials → Curtain reveal
 *   → Contact → Footer
 */
export default function App() {
  const [device] = useState(getDevice)
  const [webgl] = useState(hasWebGL)

  useLayoutEffect(() => {
    store.isMobile = device.isMobile || device.coarse
    store.reducedMotion = device.reducedMotion
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [device])

  useEffect(() => initSmoothScroll(device.reducedMotion), [device.reducedMotion])

  // pointer for subtle 3D parallax
  useEffect(() => {
    const onMove = (e) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // reveal animations for HTML content: headings/blocks fade up, card grids
  // stagger in. IntersectionObserver decides *when* (robust to layout changes
  // from lazy images); GSAP does the motion.
  useEffect(() => {
    const r = () => ScrollTrigger.refresh()
    window.addEventListener('load', r)
    document.fonts?.ready.then(r)
    if (device.reducedMotion) return () => window.removeEventListener('load', r)

    const blocks = gsap.utils.toArray('[data-reveal]')
    const grids = gsap.utils.toArray('[data-stagger]')
    gsap.set(blocks, { y: 36, autoAlpha: 0 })
    grids.forEach((g) => gsap.set(g.children, { y: 44, autoAlpha: 0 }))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          const el = en.target
          if (el.hasAttribute('data-stagger')) gsap.to(el.children, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform' })
          else gsap.to(el, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', clearProps: 'transform' })
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    blocks.forEach((el) => io.observe(el))
    grids.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      window.removeEventListener('load', r)
      gsap.set([...blocks, ...grids.flatMap((g) => [...g.children])], { clearProps: 'all' })
    }
  }, [device.reducedMotion])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Loader webgl={webgl} />
      <Nav />
      <main id="main">
        <Hero webgl={webgl} isMobile={device.isMobile} />
        <About />
        <Services />
        <Projects />
        <Showcase webgl={webgl} isMobile={device.isMobile} />
        <Process />
        <Story webgl={webgl} isMobile={device.isMobile} />
        <WhyChoose />
        <Testimonials />
        <Cta webgl={webgl} isMobile={device.isMobile} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

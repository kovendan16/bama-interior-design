import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { Loader } from './components/Loader'
import { Hero } from './components/sections/Hero'
import { Chapter } from './components/sections/Chapter'
import { Transform } from './components/sections/Transform'
// Dollhouse section disabled — uncomment this and <DollhouseSection /> below to restore.
// import { DollhouseSection } from './components/sections/DollhouseSection'
import { Portfolio } from './components/sections/Portfolio'
import { Services } from './components/sections/Services'
import { About } from './components/sections/About'
import { Process } from './components/sections/Process'
import { Contact } from './components/sections/Contact'
import { store } from './lib/store'
import { getDevice } from './lib/device'
import { initSmoothScroll, ScrollTrigger, gsap } from './lib/scroll'

// The 3D engine is code-split: HTML paints instantly, three.js streams in after.
const Experience = lazy(() => import('./three/Experience.jsx'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const [device] = useState(getDevice)
  const [webgl] = useState(hasWebGL)
  const [mainPaused, setMainPaused] = useState(false)

  useLayoutEffect(() => {
    store.isMobile = device.isMobile || device.coarse
    store.reducedMotion = device.reducedMotion
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [device])

  useEffect(() => initSmoothScroll(device.reducedMotion), [device.reducedMotion])

  // pointer for depth parallax
  useEffect(() => {
    const onMove = (e) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // generic reveal + parallax animations for HTML layers
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
      })
      gsap.utils.toArray('.split[data-split]').forEach((el) => {
        gsap.from(el.querySelectorAll('.wi'), {
          yPercent: 110,
          rotate: 4,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      })
      if (!device.reducedMotion) {
        gsap.utils.toArray('[data-speed]').forEach((el) => {
          const speed = parseFloat(el.dataset.speed)
          gsap.to(el, {
            yPercent: -speed * 100,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      }
    })
    const r = () => ScrollTrigger.refresh()
    window.addEventListener('load', r)
    document.fonts?.ready.then(r)
    return () => {
      ctx.revert()
      window.removeEventListener('load', r)
    }
  }, [device.reducedMotion])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Loader webgl={webgl} />
      <Nav />
      {webgl ? (
        <Suspense fallback={null}>
          <Experience paused={mainPaused} device={device} />
        </Suspense>
      ) : (
        <div className="canvas-fallback" aria-hidden="true" />
      )}
      <div className="vignette" aria-hidden="true" />
      <main id="main">
        <Hero />
        <Chapter id="living" />
        <Chapter id="bedroom" />
        <Chapter id="kitchen" />
        <Transform />
        {/* <DollhouseSection /> */}
        <Portfolio setMainPaused={setMainPaused} device={device} webgl={webgl} />
        <Services />
        <About />
        <Process />
        <Contact />
      </main>
    </>
  )
}

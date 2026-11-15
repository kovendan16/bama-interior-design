import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { store } from './store'

gsap.registerPlugin(ScrollTrigger)

export const scrollApi = { lenis: null }

export function initSmoothScroll(reducedMotion) {
  if (reducedMotion) return () => {}
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.2 })
  scrollApi.lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    scrollApi.lenis = null
  }
}

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el && typeof target !== 'number') return
  if (scrollApi.lenis) {
    scrollApi.lenis.scrollTo(el ?? target, { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts })
  } else {
    const y = typeof target === 'number' ? target : el.getBoundingClientRect().top + window.scrollY + (opts.offset || 0)
    window.scrollTo({ top: y, behavior: store.reducedMotion ? 'auto' : 'smooth' })
  }
}

export function lockScroll(locked) {
  if (scrollApi.lenis) locked ? scrollApi.lenis.stop() : scrollApi.lenis.start()
  document.documentElement.classList.toggle('is-locked', locked)
}

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Registers a section with the camera system. Section ranges are contiguous:
 * each runs from "its top enters the viewport bottom" to "its bottom reaches the
 * viewport bottom", so exactly one section drives the camera at any moment.
 */
export function useSectionProgress(ref, id, onProgress) {
  useIso(() => {
    if (!ref.current) return
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: id === 'hero' ? 'top top' : 'top bottom',
      end: 'bottom bottom',
      onUpdate: (self) => {
        store.progress[id] = self.progress
        onProgress?.(self.progress)
      },
      onRefresh: (self) => {
        store.progress[id] = self.progress
        onProgress?.(self.progress)
      },
    })
    return () => st.kill()
  }, [id])
}

export { gsap, ScrollTrigger }

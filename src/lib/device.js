export function getDevice() {
  if (typeof window === 'undefined') return { isMobile: false, isTablet: false, reducedMotion: false }
  const w = window.innerWidth
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return {
    isMobile: w < 768,
    isTablet: w >= 768 && w < 1100 && coarse,
    coarse,
    reducedMotion,
  }
}

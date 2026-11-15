import {
  BookOpen, Eye, Target, Sparkles, Home, Building2, Sofa, BedDouble, CookingPot, Briefcase, Lamp, Ruler,
  UserRoundCheck, LayoutGrid, Gem, Palette, ScanSearch, HardHat,
} from 'lucide-react'

// Icons referenced by name in lib/sections.js (explicit list keeps the bundle small).
const ICONS = { BookOpen, Eye, Target, Sparkles, Home, Building2, Sofa, BedDouble, CookingPot, Briefcase, Lamp, Ruler, UserRoundCheck, LayoutGrid, Gem, Palette, ScanSearch, HardHat }

export function Icon({ name, size = 22, className = '' }) {
  const C = ICONS[name] || Sparkles
  return <C size={size} strokeWidth={1.6} className={className} aria-hidden="true" />
}

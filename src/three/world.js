// World layout: every room of the house sits along the X axis, 12 m apart, joined by
// doorways — the camera literally walks from room to room.
export const ROOM = { w: 12, d: 10, h: 4 }
export const DOOR = { z: 2.6, w: 2.2, h: 2.9 }
export const WALL_T = 0.2

export const ROOMS = [
  { id: 'living', x: 0 },
  { id: 'bedroom', x: 12 },
  { id: 'kitchen', x: 24 },
  { id: 'transform', x: 36 },
  { id: 'services', x: 48 },
  { id: 'about', x: 60 },
  { id: 'process', x: 72 },
  { id: 'contact', x: 84 },
]

// Miniature dollhouse, displayed on a plinth "outside" the transformation room.
export const DOLL = { pos: [36, 0.92, 26], scale: 0.13, rotY: Math.PI }

// The dollhouse's own room grid (in house units, before scaling).
export const DOLL_ROOMS = [
  { id: 'living', label: 'Living Room', x: -12, y: 0, floor: 'Ground floor' },
  { id: 'kitchen', label: 'Modular Kitchen', x: 0, y: 0, floor: 'Ground floor' },
  { id: 'office', label: 'Home Office', x: 12, y: 0, floor: 'Ground floor' },
  { id: 'bedroom', label: 'Master Bedroom', x: -12, y: 4.35, floor: 'First floor' },
  { id: 'bathroom', label: 'Spa Bathroom', x: 0, y: 4.35, floor: 'First floor' },
  { id: 'lounge', label: 'Fireside Lounge', x: 12, y: 4.35, floor: 'First floor' },
]

// Lighting "zones": where the sun, shadow camera and practical lights should sit
// when the camera is near a given place. Light count never changes.
export const ZONES = [
  ...ROOMS.map((r) => ({ id: r.id, c: [r.x, 0, 0] })),
  { id: 'dollhouse', c: [DOLL.pos[0], 0, DOLL.pos[2] - 4] },
]

export const PRACTICALS = {
  living: [[-1.5, 2.6, -1.3, 14, '#ffc98a'], [3.6, 2.0, -3.2, 7, '#ffd29c']],
  bedroom: [[-3.0, 1.6, -3.6, 9, '#ffbf7a'], [1.2, 2.4, -1.0, 8, '#ffd8a8']],
  kitchen: [[-2.2, 2.6, -1.8, 12, '#ffdcae'], [3.4, 2.5, -1.4, 10, '#ffc98a']],
  transform: [[0, 2.8, -1.4, 13, '#ffcf96'], [3.4, 2.1, -3, 7, '#ffd8a8']],
  services: [[0, 2.3, -0.4, 11, '#ffd6a0'], [-3, 2.4, -3.5, 7, '#ffcf96']],
  about: [[0, 6.0, -2, 16, '#ffe2bc'], [-4, 3.0, -3, 8, '#ffcf96']],
  process: [[0, 2.8, -1.5, 12, '#ffdcae'], [3, 2.0, -3, 6, '#ffd8a8']],
  contact: [[0, 0.7, -3.9, 12, '#ff9a4a'], [-2.5, 2.4, -2, 8, '#ffc98a']],
  bathroom: [[-2.2, 2.4, -3.0, 10, '#ffdcae'], [2.6, 2.0, -3.6, 8, '#ffd8a8']],
  office: [[0.4, 2.4, -2.4, 10, '#ffd29c'], [-4.2, 1.8, -1.4, 7, '#ffc98a']],
  lounge: [[0, 0.7, -3.9, 12, '#ff9a4a'], [-2.5, 2.4, -2, 8, '#ffc98a']],
  dollhouse: [[0, 3.8, 4.0, 4, '#ffd8a8'], [-2.4, 2.8, 2.8, 2.5, '#ffcf96']],
}

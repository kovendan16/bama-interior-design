import { useEffect, useRef, useState } from 'react'
import { Split } from '../Split'
import { DOLL_ROOMS } from '../../three/world'
import { useSectionProgress } from '../../lib/scroll'
import { store, emit, subscribe } from '../../lib/store'

const ROOM_NOTES = {
  living: 'Bouclé seating around a marble drum table, under a sculptural brass chandelier.',
  kitchen: 'Sage cabinetry, fluted walnut island with waterfall marble and a nine-seat dining table.',
  office: 'Navy library walls, walnut shelving and a leather reading corner.',
  bedroom: 'Clay plaster, a tufted headboard and golden-hour light through linen.',
  bathroom: 'Freestanding tub, twin vessel basins and a glazed green feature wall.',
  lounge: 'A travertine fireplace, rust velvet armchairs and dusk views.',
}

export function DollhouseSection() {
  const ref = useRef()
  const [focus, setFocus] = useState(null)
  const [hint, setHint] = useState(true)

  useSectionProgress(ref, 'dollhouse', (p) => {
    // leaving the section always returns to the whole-house view
    if ((p <= 0.001 || p >= 0.999) && store.dollFocus !== null) {
      store.dollFocus = null
      emit('dollFocus', null)
    }
  })

  useEffect(
    () =>
      subscribe((type, payload) => {
        if (type === 'dollFocus') {
          setFocus(payload)
          setHint(false)
        }
      }),
    []
  )

  const choose = (i) => {
    store.dollFocus = store.dollFocus === i ? null : i
    emit('dollFocus', store.dollFocus)
  }

  const room = focus !== null ? DOLL_ROOMS[focus] : null

  return (
    <section id="dollhouse" ref={ref} className="section dollhouse is-dark" aria-labelledby="doll-title">
      <div className="sticky">
        <header className="doll-head" data-reveal>
          <p className="kicker">
            <span className="num">05</span> The Dollhouse
          </p>
          <h2 id="doll-title" className="h2">
            <Split text="The whole house, in your hands." data-split />
          </h2>
          <p className="muted">
            Scroll to rotate and lift the floors apart. Tap any room — or choose one below — to fly inside.
          </p>
        </header>

        {hint && (
          <div className="doll-hint" aria-hidden="true">
            <i /> Click a room
          </div>
        )}

        <div className={`doll-card glass ${room ? 'is-open' : ''}`} aria-live="polite">
          {room && (
            <>
              <p className="kicker">{room.floor}</p>
              <h3 className="h3">{room.label}</h3>
              <p>{ROOM_NOTES[room.id]}</p>
              <button className="btn btn-small btn-ghost" onClick={() => choose(focus)}>
                ← Back to the house
              </button>
            </>
          )}
        </div>

        <div className="chips" role="group" aria-label="Explore a room">
          {DOLL_ROOMS.map((r, i) => (
            <button key={r.id} className={`chip ${focus === i ? 'is-active' : ''}`} aria-pressed={focus === i} onClick={() => choose(i)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

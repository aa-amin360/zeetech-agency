'use client'

import { useState, type ReactNode } from 'react'

/** Filter buttons and the grid they filter; the cards themselves are rendered on the server. */
export function WorkFilter({
  allLabel,
  filters,
  items,
}: {
  allLabel: string
  filters: { value: string; label: string }[]
  items: { id: number | string; filter: string; card: ReactNode }[]
}) {
  const [active, setActive] = useState('')
  const shown = active ? items.filter((i) => i.filter === active) : items

  return (
    <>
      <div className="wgrid__bar">
        <div className="wgrid__filters" role="group" aria-label="Filter projects by industry">
          {[{ value: '', label: allLabel }, ...filters].map((f) => (
            <button
              key={f.value || 'all'}
              type="button"
              className="wgrid__filter"
              aria-pressed={active === f.value}
              onClick={() => setActive(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="wgrid__inner">
        <ul className="wgrid__list" aria-live="polite">
          {shown.map((i) => (
            <li key={`${active}-${i.id}`} className="wgrid__item">
              {i.card}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

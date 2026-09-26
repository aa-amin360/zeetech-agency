'use client'

import { Children, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Endless horizontal strip. The items are repeated until one set is at least
 * as wide as the strip, then the set is rendered twice and slid by -50%, so
 * the loop never shows a gap at any screen width.
 */
export function Marquee({
  children,
  speed = 45,
  direction = 'left',
  className = '',
  label,
}: {
  children: ReactNode
  /** Pixels per second. */
  speed?: number
  direction?: 'left' | 'right'
  className?: string
  label?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const set = useRef<HTMLUListElement>(null)
  const [reps, setReps] = useState(1)
  const [dur, setDur] = useState(40)
  const items = Children.toArray(children)

  useLayoutEffect(() => {
    const measure = () => {
      if (!box.current || !set.current) return
      const setW = set.current.scrollWidth
      const boxW = box.current.offsetWidth
      if (!setW) return
      const oneRep = setW / reps
      const need = Math.max(1, Math.ceil(boxW / oneRep))
      if (need !== reps) setReps(need)
      setDur((oneRep * need) / speed)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (box.current) ro.observe(box.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [reps, speed])

  const renderSet = (hidden: boolean, ref?: typeof set) => (
    <ul className="loop__set" ref={ref} aria-hidden={hidden || undefined}>
      {Array.from({ length: reps }).flatMap((_, r) =>
        items.map((item, i) => (
          <li key={`${r}-${i}`} aria-hidden={!hidden && r > 0 ? true : undefined}>
            {item}
          </li>
        )),
      )}
    </ul>
  )

  return (
    <div className={`loop ${className}`.trim()} ref={box} data-dir={direction} aria-label={label} role={label ? 'region' : undefined}>
      <div className="loop__track" style={{ '--dur': `${dur.toFixed(2)}s` } as CSSProperties}>
        {renderSet(false, set)}
        {renderSet(true)}
      </div>
    </div>
  )
}

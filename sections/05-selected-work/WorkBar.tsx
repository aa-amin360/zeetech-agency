'use client'

import { useEffect, useRef, useState } from 'react'

/** Screens where the full header and a card don't fit together: a slim bar that slides in at
 *  the top once the section header has scrolled away, with the number of the card on top. */
export function WorkBar({ label, total }: { label: string; total: number }) {
  const bar = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    const el = bar.current
    const section = el?.closest<HTMLElement>('.work')
    if (!el || !section) return
    let frame = 0
    const update = () => {
      frame = 0
      if (!el.getClientRects().length || getComputedStyle(el).position !== 'sticky') return setStuck(false)
      const stickAt = parseFloat(getComputedStyle(el).top) || 0     // just below the site header
      setStuck(el.getBoundingClientRect().top <= stickAt + 0.5 && section.getBoundingClientRect().bottom > stickAt)
      // the card on top is the last one that has reached its stopping point
      let n = 1
      section.querySelectorAll<HTMLElement>('.case').forEach((card, i) => {
        if (card.getBoundingClientRect().top <= (parseFloat(getComputedStyle(card).top) || 0) + 1) n = i + 1
      })
      setCurrent(n)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className={`work__bar${stuck ? ' is-stuck' : ''}`} ref={bar} aria-hidden="true">
      <div className="work__bar-in">
        <span className="work__bar-label">
          <span className="eyebrow__badge">
            <img src="/brand/icon-badge.svg" width={18} height={18} alt="" />
          </span>
          {label}
        </span>
        <span className="work__bar-count">
          {pad(current)} <span>/ {pad(total)}</span>
        </span>
      </div>
    </div>
  )
}

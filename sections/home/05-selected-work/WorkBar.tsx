'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/** One-line bar that slides in at the top once the section header has scrolled away: the label,
 *  the section title in the middle and the number of the card on top (same look as every other
 *  section's bar, see components/StickySections.tsx). */
export function WorkBar({ label, title, total }: { label: string; title?: ReactNode; total: number }) {
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
    <div className={`work__bar stick-bar${stuck ? ' is-stuck' : ''}`} ref={bar} aria-hidden="true">
      <div className="stick-bar__in">
        <span className="stick-bar__label">
          <span className="eyebrow__badge">
            <img src="/brand/icon-badge.svg" width={18} height={18} alt="" />
          </span>
          <span className="stick-bar__text">{label}</span>
        </span>
        {title ? <span className="stick-bar__title display">{title}</span> : <span />}
        <span className="stick-bar__end work__bar-count">
          {pad(current)} <span>/ {pad(total)}</span>
        </span>
      </div>
    </div>
  )
}

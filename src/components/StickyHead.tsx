'use client'

import { useEffect } from 'react'

/**
 * Measures a section's sticky header so the content below can stack under it
 * (used by Selected work and How we deliver). Sets on the section:
 *   --sticky-head-h   header height — sticky content stops just below it
 *   --sticky-release  how far past the header `last` stops; the section CSS uses it so the
 *                     header scrolls away together with `last` instead of covering it
 */
export function StickyHead({ section, head, last }: { section: string; head: string; last: string }) {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>(section)]
    const measure = () => {
      for (const s of sections) {
        const h = s.querySelector<HTMLElement>(head)
        if (!h) continue
        s.style.setProperty('--sticky-head-h', `${h.offsetHeight}px`)
        const l = s.querySelector<HTMLElement>(last)
        const style = l && getComputedStyle(l)
        const top = style?.position === 'sticky' ? parseFloat(style.top) || 0 : 0
        const release = l && top ? top + l.offsetHeight - h.offsetHeight : 0
        s.style.setProperty('--sticky-release', `${Math.max(0, release)}px`)
      }
    }
    const ro = new ResizeObserver(measure)
    for (const s of sections) s.querySelectorAll(`${head}, ${last}`).forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [section, head, last])
  return null
}

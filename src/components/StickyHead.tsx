'use client'

import { useEffect } from 'react'

const shown = (el: Element) => el.getClientRects().length > 0
const isSticky = (el: Element) => shown(el) && getComputedStyle(el).position === 'sticky'

/**
 * Measures a section's sticky header so the content below can stack under it
 * (used by Selected work and How we deliver).
 *
 * `head` and `last` may list several selectors (desktop header, mobile bar…); the one that is
 * sticky at the current screen size is used. Sets on the section:
 *   --sticky-head-h   header height — sticky content stops just below it
 *   --sticky-release  how far past the header `last` stops; the section CSS uses it so the
 *                     header scrolls away together with `last` instead of covering it
 * and --sticky-item-h on each `items` element (its own height, for cards taller than the screen).
 */
export function StickyHead({
  section,
  head,
  last,
  items,
}: {
  section: string
  head: string
  last: string
  items?: string
}) {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>(section)]
    const measure = () => {
      for (const s of sections) {
        if (items) s.querySelectorAll<HTMLElement>(items).forEach((el) => el.style.setProperty('--sticky-item-h', `${el.offsetHeight}px`))

        const h = [...s.querySelectorAll<HTMLElement>(head)].find(isSticky)
        if (!h) {
          s.style.setProperty('--sticky-release', '0px')
          continue
        }
        s.style.setProperty('--sticky-head-h', `${h.offsetHeight}px`)

        // the sticky `last` if there is one, otherwise the final visible match, which then
        // scrolls normally and should end up just below the header
        const candidates = [...s.querySelectorAll<HTMLElement>(last)].filter(shown)
        const l = candidates.find(isSticky) ?? candidates.at(-1)
        const top = l && isSticky(l) ? parseFloat(getComputedStyle(l).top) || 0 : h.offsetHeight + 16
        const release = l ? top + l.offsetHeight - h.offsetHeight : 0
        s.style.setProperty('--sticky-release', `${Math.max(0, release)}px`)
      }
    }
    const ro = new ResizeObserver(measure)
    for (const s of sections) {
      ro.observe(s)
      s.querySelectorAll([head, last, items].filter(Boolean).join(', ')).forEach((el) => ro.observe(el))
    }
    return () => ro.disconnect()
  }, [section, head, last, items])
  return null
}

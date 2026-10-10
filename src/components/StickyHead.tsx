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
 *
 * With `fullHead`, it also picks the mode: data-stack="full" on the section when that header,
 * the tallest item and the stack offsets fit on the screen together; otherwise the section CSS
 * falls back to its slim bar.
 */
export function StickyHead({
  section,
  head,
  last,
  items,
  fullHead,
}: {
  section: string
  head: string
  last: string
  items?: string
  fullHead?: string
}) {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>(section)]
    const measure = () => {
      // space under the fixed site header (see HeaderState.tsx)
      const navH = document.querySelector<HTMLElement>('.site-header .nav')?.offsetHeight ?? 0
      // …and above the floating button bar on phones (see HeroScene.tsx)
      const floatH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--float-h')) || 0
      const room = window.innerHeight - navH - floatH
      for (const s of sections) {
        const list = items ? [...s.querySelectorAll<HTMLElement>(items)] : []
        list.forEach((el) => el.style.setProperty('--sticky-item-h', `${el.offsetHeight}px`))

        const full = fullHead ? s.querySelector<HTMLElement>(fullHead) : null
        if (full) {
          const tallest = Math.max(0, ...list.map((el) => el.offsetHeight))
          const offsets = Math.min(list.length - 1, 4) * 16
          // the whole stack fits below the header (with a little room to spare), and the header
          // itself doesn't take more than 40% of the screen
          const fits = full.offsetHeight + 16 + offsets + tallest + 8 <= room && full.offsetHeight <= room * 0.4
          if (fits) s.dataset.stack = 'full'
          else delete s.dataset.stack
        }

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
        // the header sticks at headTop (below the site header); it lets go when the stack's box
        // ends at its bottom edge, so the box ends early by how far past that `last` reaches
        const headTop = parseFloat(getComputedStyle(h).top) || 0
        const top = l && isSticky(l) ? parseFloat(getComputedStyle(l).top) || 0 : headTop + h.offsetHeight + 16
        const release = l ? top + l.offsetHeight - (headTop + h.offsetHeight) : 0
        s.style.setProperty('--sticky-release', `${Math.max(0, release)}px`)
      }
    }
    const ro = new ResizeObserver(measure)
    for (const s of sections) {
      ro.observe(s)
      s.querySelectorAll([head, last, items].filter(Boolean).join(', ')).forEach((el) => ro.observe(el))
    }
    // a window that only gets taller or shorter doesn't resize the section, so listen too
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [section, head, last, items, fullHead])
  return null
}

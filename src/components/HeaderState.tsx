'use client'

import { useEffect } from 'react'

/**
 * Keeps the fixed site header in step with the page:
 *  - --nav-h on <html>: the header's height, used by sticky section headers (they stop just
 *    below it) and by anchor links (scroll-padding), so nothing hides behind the header
 *  - .is-scrolled on the header once the page has moved, for the frosted background
 */
export function HeaderState() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    const bar = header?.querySelector<HTMLElement>('.nav')
    if (!header || !bar) return
    const root = document.documentElement

    const measure = () => root.style.setProperty('--nav-h', `${bar.offsetHeight}px`)
    const ro = new ResizeObserver(measure)
    ro.observe(bar)
    measure()

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        header.classList.toggle('is-scrolled', window.scrollY > 8)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return null
}

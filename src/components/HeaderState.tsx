'use client'

import { useEffect } from 'react'

/**
 * Keeps the fixed site header in step with the page:
 *  - --nav-h on <html>: the header's height, used by sticky section headers (they stop just
 *    below it) and by anchor links (scroll-padding), so nothing hides behind the header
 *  - .is-scrolled on the header once the page has moved, for the frosted background
 *  - aria-current="page" on the menu link for the page being viewed (e.g. Our Work on /work)
 */
export function HeaderState() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    const bar = header?.querySelector<HTMLElement>('.nav')
    if (!header || !bar) return
    const root = document.documentElement

    // links to a section of the home page (/#work) don't count; only real pages
    const here = window.location.pathname.replace(/\/$/, '') || '/'
    header.querySelectorAll<HTMLAnchorElement>('.nav__links a, .mobile-menu a').forEach((a) => {
      const href = a.getAttribute('href') || ''
      const url = new URL(href || '#', window.location.href)
      const path = url.pathname.replace(/\/$/, '') || '/'
      if (href && !href.startsWith('#') && url.origin === window.location.origin && !url.hash && path !== '/' && path === here) a.setAttribute('aria-current', 'page')
      else a.removeAttribute('aria-current')
    })

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

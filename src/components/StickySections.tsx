'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * One-line sticky bar for every section, like Selected work's: a slim bar just below the site
 * header with the section's label on the left and its title in the middle (same fonts and
 * colours, on one line).
 *
 * It takes over from the title: it slides in as the section's title passes under the spot where
 * the bar sits (so the content after the header is never under it when it appears), leaves at the
 * same point when scrolling back up, and at the end of the section the section's bottom edge
 * pushes it up and away.
 *
 * Works on any page built in the admin: in each `main .sec`, the first section header
 * (SectionHead's `.sec-head`, the service pages' title, …) that has content after it gets a
 * `.stick-bar` built from its eyebrow and title. Sections with little below the header get none.
 *
 * Selected work has its own bar (WorkBar.tsx, same look, plus the card count). How we deliver
 * gets this bar on wide screens; on phones and tablets it keeps its own preview bar.
 */
const SKIP = '.work, [data-stick-off]'
const HEADS = 'header.sec-head, .areas__head, .svc-list__head, :scope > .sec__inner > .display'

type Entry = {
  section: HTMLElement
  head: HTMLElement
  /** the section title (or the header itself): the bar takes over when it goes under the bar */
  title: HTMLElement
  box: HTMLElement
  bar: HTMLElement
  /** the bar's visible height */
  h: number
  on: boolean
  shown: boolean
}

function opaqueBg(el: HTMLElement | null): string {
  for (let n = el; n; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (m) {
      const parts = m[1].split(/[,\s/]+/).filter(Boolean)
      if (parts.length < 4 || parseFloat(parts[3]) > 0.5) return c
    }
  }
  return '#f6f6f6'
}

const clean = (s: string | null | undefined) => (s || '').replace(/\s+/g, ' ').trim()

/** The bar: eyebrow on the left, a one-line copy of the title in the middle. */
function makeBar(head: HTMLElement): HTMLElement | null {
  const eyebrow = head.querySelector<HTMLElement>('.eyebrow')
  const display = head.querySelector<HTMLElement>('.display') ?? (head.matches('.display') ? head : null)
  const heading = display ?? head.querySelector<HTMLElement>('h2, h3')
  const labelText = clean(eyebrow?.innerText || eyebrow?.textContent)
  if (!labelText && !heading) return null

  const bar = document.createElement('div')
  bar.className = 'stick-bar'
  bar.setAttribute('aria-hidden', 'true')
  const inner = document.createElement('div')
  inner.className = 'stick-bar__in'

  const label = document.createElement('span')
  label.className = 'stick-bar__label'
  if (labelText) {
    label.innerHTML = '<span class="eyebrow__badge"><img src="/brand/icon-badge.svg" width="18" height="18" alt=""></span>'
    const t = document.createElement('span')
    t.className = 'stick-bar__text'
    t.textContent = labelText
    label.append(t)
  }
  inner.append(label)

  if (heading) {
    const title = document.createElement('span')
    title.className = `stick-bar__title display${heading.classList.contains('display--light') ? ' display--light' : ''}`
    if (display) {
      // keep the two tones (plain words, orange highlight / italic accent) on one line
      title.innerHTML = display.innerHTML
      title.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    } else title.textContent = clean(heading.textContent)
    inner.append(title)
  }
  inner.append(Object.assign(document.createElement('span'), { className: 'stick-bar__end' }))

  bar.append(inner)
  head.parentElement!.insertBefore(bar, head)
  return bar
}

export function StickySections() {
  const pathname = usePathname()

  useEffect(() => {
    const entries: Entry[] = []
    for (const section of document.querySelectorAll<HTMLElement>('main .sec')) {
      if (section.matches(SKIP)) continue
      const head = [...section.querySelectorAll<HTMLElement>(HEADS)].find(
        (el) => el.closest('.sec') === section && !el.classList.contains('visually-hidden') && el.nextElementSibling,
      )
      const bar = head && makeBar(head)
      if (head && bar) {
        const title = head.querySelector<HTMLElement>('.display, h2, h3') ?? head
        entries.push({ section, head, title, box: head.parentElement!, bar, h: 52, on: false, shown: false })
      }
    }
    if (!entries.length) return

    const root = document.documentElement
    const navH = () => parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 0

    const measure = () => {
      const room = window.innerHeight - navH()
      for (const e of entries) {
        const { section, head, box, bar } = e
        // too little below the header to be worth a bar; How we deliver has its own on narrow screens
        const off = box.offsetHeight - head.offsetHeight <= room * 0.3 || (section.matches('.deliver') && window.innerWidth <= 900)
        bar.hidden = off
        e.on = !off
        e.h = bar.firstElementChild instanceof HTMLElement ? bar.firstElementChild.offsetHeight || 52 : 52
        bar.style.setProperty('--stick-bg', opaqueBg(box))
        const eyebrow = head.querySelector<HTMLElement>('.eyebrow')
        bar.style.setProperty('--stick-fg', getComputedStyle(eyebrow ?? head).color)
        // the bar takes no room; cancel the gap its box would put after it
        bar.style.marginBottom = `${-(parseFloat(getComputedStyle(box).rowGap) || 0)}px`
      }
      update()
    }

    let frame = 0
    const update = () => {
      const top = navH()
      for (const e of entries) {
        const titleBottom = e.title.getBoundingClientRect().bottom
        const boxBottom = e.box.getBoundingClientRect().bottom
        // in once the title's bottom edge reaches the bar's (a few px of slack on the way back so it
        // doesn't flicker right at that point), until the section has scrolled away
        const line = top + e.h + (e.shown ? 6 : 0)
        const show = e.on && titleBottom < line && boxBottom > top
        if (show !== e.shown) {
          e.shown = show
          e.bar.classList.toggle('is-stuck', show)
        }
        // the end of the section pushes the bar up with it instead of running into the next section
        const push = show ? Math.min(0, boxBottom - top - e.h) : 0
        e.bar.style.transform = push ? `translateY(${push}px)` : ''
      }
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    const ro = new ResizeObserver(measure)
    entries.forEach((e) => {
      ro.observe(e.head)
      ro.observe(e.box)
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    measure()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      entries.forEach((e) => e.bar.remove())
    }
  }, [pathname])

  return null
}

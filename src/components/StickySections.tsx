'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * One-line sticky bar for every section, like Selected work's: once a section's header has
 * scrolled away, a slim bar slides in just below the site header with the section's label on
 * the left and its title in the middle (same fonts and colours, on one line), and leaves when
 * the section ends.
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

type Entry = { section: HTMLElement; head: HTMLElement; box: HTMLElement; bar: HTMLElement; on: boolean }

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
      if (head && bar) entries.push({ section, head, box: head.parentElement!, bar, on: false })
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
        // shown once the header has scrolled under the site header, until the section ends
        const show = e.on && e.head.getBoundingClientRect().bottom < top && e.box.getBoundingClientRect().bottom > top + 60
        e.bar.classList.toggle('is-stuck', show)
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

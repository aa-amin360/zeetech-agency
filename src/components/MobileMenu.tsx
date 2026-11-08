'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from './ui'

type MenuLink = { label: string; href?: string | null; children?: MenuLink[] }

export function MobileMenu({ links, cta }: { links: MenuLink[]; cta: { label: string; href: string } | null }) {
  const [open, setOpen] = useState(false)
  const burger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burger.current?.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 901px)')
    const onWide = (m: MediaQueryListEvent) => m.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <>
      <button
        ref={burger}
        className="nav__burger"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
      <div className="mobile-menu" id="mobile-menu" hidden={!open} onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}>
        {links.map((l) =>
          l.children?.length ? (
            <div className="mobile-menu__group" key={l.label}>
              <a href={l.href || '#'}>{l.label}</a>
              <ul className="mobile-menu__sub">
                {l.children.map((c) => (
                  <li key={c.label}>
                    <a href={c.href || '#'}>{c.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <a href={l.href || '#'} key={l.label}>
              {l.label}
            </a>
          ),
        )}
        {cta ? (
          <a className="btn btn--primary" href={cta.href}>
            <span>{cta.label}</span>
            <ArrowUpRight />
          </a>
        ) : null}
      </div>
    </>
  )
}

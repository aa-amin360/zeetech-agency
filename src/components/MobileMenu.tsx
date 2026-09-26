'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from './ui'

export function MobileMenu({
  links,
  cta,
}: {
  links: { label: string; href?: string | null }[]
  cta: { label: string; href: string } | null
}) {
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
        {links.map((l) => (
          <a href={l.href || '#'} key={l.label}>
            {l.label}
          </a>
        ))}
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

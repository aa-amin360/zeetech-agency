'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { initHero, type HeroTile } from './hero-scene'

/** The hero shell: WebGL backdrop (its colours change by themselves) and rolling collage. */
export function HeroScene({
  tiles,
  floating,
  children,
}: {
  tiles: HeroTile[]
  /** Rendered after the hero section, outside its isolated layer, so a fixed bar stays above
   *  every section while scrolling. */
  floating?: ReactNode
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return initHero(ref.current, tiles)
  }, [tiles])

  // phones: the floating button bar tucks away while the contact form or footer is on screen
  // (they have their own buttons, and the bar would cover them)
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('.hero-float')
    const targets = [...document.querySelectorAll<HTMLElement>('#contact, .footer')]
    if (!bar || !targets.length) return
    const onScreen = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target)
        else onScreen.delete(e.target)
      }
      bar.classList.toggle('is-tucked', onScreen.size > 0)
    })
    targets.forEach((t) => io.observe(t))

    // --float-h: room the bar takes at the bottom of the screen (0 where it isn't shown), so
    // sticky content like the project-card stack stops above it
    const root = document.documentElement
    const measure = () => {
      const shown = getComputedStyle(bar).display !== 'none'
      root.style.setProperty('--float-h', shown ? `${Math.ceil(bar.getBoundingClientRect().height) + 12}px` : '0px')
    }
    const ro = new ResizeObserver(measure)
    ro.observe(bar)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('resize', measure)
      root.style.removeProperty('--float-h')
    }
  }, [])

  return (
    <>
      <section className="hero" id="hero" ref={ref} aria-labelledby="hero-title">
        <canvas className="hero__bg" aria-hidden="true" />

        <div className="collage" aria-hidden="true" data-intro>
          <div className="collage__panel">
            <div className="collage__col" />
            <div className="collage__col" />
            <div className="collage__col" />
            <div className="collage__fade collage__fade--top" />
            <div className="collage__fade collage__fade--bottom" />
          </div>
        </div>

        {children}
      </section>
      {floating}
    </>
  )
}

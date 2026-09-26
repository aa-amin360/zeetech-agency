'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { initHero, type HeroTile } from './hero-scene'

/** The hero shell: WebGL backdrop, rolling collage and palette controls. */
export function HeroScene({
  tiles,
  showControls,
  children,
}: {
  tiles: HeroTile[]
  showControls: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return initHero(ref.current, tiles)
  }, [tiles])

  return (
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

      {showControls ? (
        <aside className="studio idle" role="toolbar" aria-label="Background palette">
          <div className="studio__meta">
            <span className="studio__kicker">Backdrop</span>
            <span className="studio__name" aria-live="polite">
              Solstice
            </span>
          </div>
          <div className="studio__swatches" />
          <span className="studio__sep" aria-hidden="true" />
          <button className="studio__toggle" type="button" aria-pressed="false" aria-label="Pause motion">
            <svg className="studio__ring" viewBox="0 0 36 36" aria-hidden="true">
              <circle className="studio__ring-track" cx="18" cy="18" r="16" />
              <circle className="studio__ring-bar" cx="18" cy="18" r="16" pathLength="100" />
            </svg>
            <svg className="i-pause" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <rect x="3" y="2" width="2.6" height="10" rx="1" />
              <rect x="8.4" y="2" width="2.6" height="10" rx="1" />
            </svg>
            <svg className="i-play" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M4 2.3v9.4a.7.7 0 0 0 1.07.6l7.5-4.7a.7.7 0 0 0 0-1.2l-7.5-4.7A.7.7 0 0 0 4 2.3z" />
            </svg>
          </button>
        </aside>
      ) : null}
    </section>
  )
}

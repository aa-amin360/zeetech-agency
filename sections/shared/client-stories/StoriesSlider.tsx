'use client'

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

/** Arrows + track. Inactive slides sit at 52.5% scale and peek in from the right. */
export function StoriesSlider({
  heading,
  note,
  children,
}: {
  heading: ReactNode
  note?: string | null
  children: ReactNode
}) {
  const slides = Children.toArray(children)
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const align = useCallback(() => {
    const el = track.current?.children[index] as HTMLElement | undefined
    const first = track.current?.children[0] as HTMLElement | undefined
    // offsetLeft is measured from the nearest positioned ancestor, so subtract the first slide's
    if (track.current && el && first) {
      track.current.style.transform = `translate3d(${first.offsetLeft - el.offsetLeft}px, 0, 0)`
    }
  }, [index])

  useEffect(() => {
    align()
    window.addEventListener('resize', align, { passive: true })
    return () => window.removeEventListener('resize', align)
  }, [align])

  const go = (i: number) => setIndex(Math.max(0, Math.min(slides.length - 1, i)))

  return (
    <>
      <header className="sec-head sec-head--split" data-reveal>
        <div className="sec-head__main">{heading}</div>
        {slides.length > 1 || note ? (
          <div className="sec-head__aside">
            {slides.length > 1 ? (
              <div className="arrows">
                <button className="arrow" type="button" aria-label="Previous story" disabled={index === 0} onClick={() => go(index - 1)}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  className="arrow"
                  type="button"
                  aria-label="Next story"
                  disabled={index === slides.length - 1}
                  onClick={() => go(index + 1)}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ) : null}
            {note ? <p className="sub sub--narrow">{note}</p> : null}
          </div>
        ) : null}
      </header>

      <div className="testi__viewport">
        <div className="testi__track" ref={track} aria-live="polite">
          {slides.map((slide, i) => (
            <article
              key={i}
              className={`testi__slide${i === index ? ' is-active' : ''}`}
              aria-roledescription="slide"
              aria-label={`Story ${i + 1} of ${slides.length}`}
              aria-hidden={i !== index}
              onClick={i !== index ? () => go(i) : undefined}
            >
              {slide}
            </article>
          ))}
        </div>
      </div>
    </>
  )
}

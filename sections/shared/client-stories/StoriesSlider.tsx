'use client'

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

/** How long each story stays before the next one slides in. */
const INTERVAL_MS = 6000

/**
 * Arrows + track. Inactive slides sit at 52.5% scale and peek in from the right.
 * The stories change by themselves every few seconds and loop. They wait while the visitor points
 * at or focuses the slider, while a video plays, while the section is off screen or the tab is
 * hidden, and not at all with reduced motion. A pause button stops them for good.
 */
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
  const count = slides.length
  const track = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false) // the visitor pressed pause
  const [held, setHeld] = useState(false) // pointer / focus inside, or a video playing
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [tick, setTick] = useState(0) // restarts the timer after a manual move

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

  // reduced motion and visibility
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    // the wrapper is display: contents (no box of its own) and the track itself slides sideways,
    // so watch the viewport around the track
    const el = track.current?.parentElement
    const io = el ? new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 }) : null
    if (el && io) io.observe(el)
    return () => {
      mq.removeEventListener('change', onMq)
      io?.disconnect()
    }
  }, [])

  const autoplay = count > 1 && !paused && !reduced
  const running = autoplay && !held && visible

  // the timer
  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => {
      if (document.hidden) return setTick((t) => t + 1)
      // wait while a video in the slider is playing
      const playing = [...(root.current?.querySelectorAll('video') ?? [])].some((v) => !v.paused && !v.ended)
      if (playing) return setTick((t) => t + 1)
      setIndex((i) => (i + 1) % count)
    }, INTERVAL_MS)
    return () => window.clearTimeout(id)
  }, [running, index, tick, count])

  const go = (i: number) => {
    setIndex(((i % count) + count) % count)
    setTick((t) => t + 1)
  }

  // pointer and keyboard focus hold the current story
  const hold = () => setHeld(true)
  const release = (e?: React.FocusEvent) => {
    if (e && root.current?.contains(e.relatedTarget as Node | null)) return
    setHeld(false)
  }

  return (
    <div ref={root} className="testi__slider" onMouseEnter={hold} onMouseLeave={() => release()} onFocus={hold} onBlur={release}>
      <header className="sec-head sec-head--split" data-reveal>
        <div className="sec-head__main">{heading}</div>
        {count > 1 || note ? (
          <div className="sec-head__aside">
            {count > 1 ? (
              <div className="arrows">
                <button className="arrow" type="button" aria-label="Previous story" onClick={() => go(index - 1)}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="arrow" type="button" aria-label="Next story" onClick={() => go(index + 1)}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {!reduced ? (
                  <button
                    className="testi__toggle"
                    type="button"
                    aria-label={paused ? 'Play the stories automatically' : 'Pause the stories'}
                    aria-pressed={paused}
                    onClick={() => {
                      setPaused((p) => !p)
                      setTick((t) => t + 1)
                    }}
                  >
                    {paused ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                ) : null}
              </div>
            ) : null}
            {note ? <p className="sub sub--narrow">{note}</p> : null}
          </div>
        ) : null}
      </header>

      {count > 1 ? (
        <div className="testi__dots" role="group" aria-label="Choose a story">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`testi__dot${i === index ? ' is-active' : ''}${i === index && running ? ' is-running' : ''}`}
              aria-label={`Story ${i + 1} of ${count}`}
              aria-current={i === index}
              onClick={() => go(i)}
              style={{ ['--dur' as string]: `${INTERVAL_MS}ms` }}
            >
              <span key={`${index}-${tick}`} />
            </button>
          ))}
        </div>
      ) : null}

      <div className="testi__viewport">
        {/* announce changes only when the visitor moves the slider, not on every automatic step */}
        <div className="testi__track" ref={track} aria-live={autoplay ? 'off' : 'polite'}>
          {slides.map((slide, i) => (
            <article
              key={i}
              className={`testi__slide${i === index ? ' is-active' : ''}`}
              aria-roledescription="slide"
              aria-label={`Story ${i + 1} of ${count}`}
              aria-hidden={i !== index}
              onClick={i !== index ? () => go(i) : undefined}
            >
              {slide}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

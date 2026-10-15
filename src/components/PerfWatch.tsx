'use client'

import { useEffect } from 'react'
import { lowerPerf, perfLevel } from '@/lib/perf'

/**
 * Watches the real frame rate and lowers the performance level when the page keeps struggling
 * (see src/lib/perf.ts). Two slow stretches in a row are needed, so a single hiccup (an image
 * decoding, a font arriving) doesn't count. It starts a moment after the page has loaded,
 * because the first second is always busy, and stops once the lowest level is reached.
 */
const WINDOW_MS = 2000
const SLOW_FRAME_MS = 26 // average frame slower than ~38 fps

export function PerfWatch() {
  useEffect(() => {
    if (perfLevel() === 'low') return
    let raf = 0
    let start = 0
    let last = 0
    let frames = 0
    let slowWindows = 0
    let stopped = false

    const tick = (now: number) => {
      if (stopped) return
      // a hidden tab or a long pause (e.g. the phone was locked) isn't the page's fault
      if (document.hidden || now - last > 500) {
        start = now
        frames = 0
      } else {
        frames++
      }
      last = now
      if (now - start >= WINDOW_MS && frames > 0) {
        const avg = (now - start) / frames
        slowWindows = avg > SLOW_FRAME_MS ? slowWindows + 1 : 0
        if (slowWindows >= 2) {
          slowWindows = 0
          const next = lowerPerf()
          if (!next || next === 'low') return stop() // lowest level, or a level forced with ?perf=
        }
        start = now
        frames = 0
      }
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      stopped = true
      cancelAnimationFrame(raf)
    }
    const begin = () => {
      const t = window.setTimeout(() => {
        last = start = performance.now()
        raf = requestAnimationFrame(tick)
      }, 1500)
      return () => window.clearTimeout(t)
    }

    let cancelBegin: (() => void) | undefined
    const onLoad = () => (cancelBegin = begin())
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => {
      stop()
      cancelBegin?.()
      window.removeEventListener('load', onLoad)
    }
  }, [])
  return null
}

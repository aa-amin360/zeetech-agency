'use client'

import { useEffect, useRef } from 'react'
import { onPerfChange, perfLevel } from '@/lib/perf'

/** WebGL glass bars + 3D knot behind the dark hero. Until it is ready — and on devices set to
 *  the low performance level — the still background picture and 3D-shape picture show instead. */
export function GlassScene({ bg }: { bg: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const hero = canvas?.parentElement
    if (!canvas || !hero || !bg) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    const stop = () => {
      cleanup?.()
      cleanup = undefined
      hero.classList.remove('is-gl')
    }
    const start = async () => {
      const level = perfLevel()
      if (level === 'low' || cleanup) return
      const { initGlassHero } = await import('./glass-scene') // three.js only loads here
      if (cancelled || cleanup) return
      cleanup = initGlassHero(hero, canvas, {
        bg,
        quality: level === 'high' ? 'high' : 'mid',
        onReady: () => hero.classList.add('is-gl'),
      })
    }
    start()
    const off = onPerfChange((level) => (level === 'low' ? stop() : undefined))
    return () => {
      cancelled = true
      off()
      stop()
    }
  }, [bg])

  return <canvas ref={ref} className="dark-hero__gl" aria-hidden="true" />
}

'use client'

import { useEffect, useRef } from 'react'
import type { ResolvedVideo } from '@/lib/video'
import { VideoFrame } from '@/components/VideoFrame'

type Wave = Awaited<ReturnType<typeof import('./reel-wave').createWave>>

/** Studio reel frame. Shows the Three.js wave until a video is added in the admin. */
export function Reel({ video, title }: { video: ResolvedVideo | null; title: string }) {
  const reel = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const wave = useRef<Wave>(null)

  useEffect(() => {
    const el = reel.current
    const cv = canvas.current
    if (!el || !cv) return
    let disposed = false
    // three.js only loads when the reel gets close to the viewport
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        import('./reel-wave')
          .then(({ createWave }) => createWave(el, cv))
          .then((w) => {
            if (disposed) w?.dispose()
            else wave.current = w
          })
          .catch(() => el.classList.add('no-gl'))
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => {
      disposed = true
      io.disconnect()
      wave.current?.dispose()
    }
  }, [])

  return (
    <div className="reel" ref={reel} data-reveal>
      <canvas className="reel__gl" ref={canvas} aria-hidden="true" />
      <VideoFrame
        video={video}
        title={title}
        buttonClassName="reel__play"
        buttonLabel={video ? 'Play studio reel' : 'Animate the wave'}
        onPlay={() => wave.current?.pulse()}
      >
        <span className="reel__play-inner">
          <span className="reel__play-icon">
            <img src="/brand/icon-play-circle.svg" width={24} height={24} alt="" />
          </span>
          PLAY
        </span>
      </VideoFrame>
    </div>
  )
}

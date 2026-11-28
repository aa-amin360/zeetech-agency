'use client'

import { useEffect, useRef } from 'react'
import type { ResolvedVideo } from '@/lib/video'
import { VideoFrame } from '@/components/VideoFrame'
import { onPerfChange, perfLevel } from '@/lib/perf'

type Wave = Awaited<ReturnType<typeof import('./reel-wave').createWave>>

/**
 * Studio reel frame. Shows the Three.js wave until a video is added in the admin. A video with a
 * poster (e.g. a client's video testimonial) shows the poster and its caption instead, so visitors
 * see who is speaking before they press play.
 */
export function Reel({ video, title, caption }: { video: ResolvedVideo | null; title: string; caption?: string | null }) {
  const poster = video?.poster
  const reel = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const wave = useRef<Wave>(null)

  useEffect(() => {
    const el = reel.current
    const cv = canvas.current
    if (!el || !cv || poster) return
    let disposed = false
    // lowest performance level: a still glow instead of the 3D wave (three.js isn't loaded at all)
    const lite = () => {
      wave.current?.dispose()
      wave.current = null
      el.classList.add('is-lite')
    }
    if (perfLevel() === 'low') {
      lite()
      return () => el.classList.remove('is-lite')
    }
    const stopPerf = onPerfChange((level) => level === 'low' && lite())
    // three.js only loads when the reel gets close to the viewport
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        import('./reel-wave')
          .then(({ createWave }) => createWave(el, cv))
          .then((w) => {
            if (disposed || perfLevel() === 'low') w?.dispose()
            else wave.current = w
          })
          .catch(() => el.classList.add('no-gl'))
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => {
      disposed = true
      stopPerf()
      io.disconnect()
      wave.current?.dispose()
    }
  }, [poster])

  return (
    <div className={`reel${poster ? ' reel--poster' : ''}`} ref={reel} data-reveal>
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="reel__poster" src={poster} alt="" loading="lazy" decoding="async" />
      ) : (
        <canvas className="reel__gl" ref={canvas} aria-hidden="true" />
      )}
      {poster && caption ? (
        <p className="reel__caption">
          <span className="reel__caption-tag">Client video</span>
          {caption}
        </p>
      ) : null}
      <VideoFrame
        video={video}
        title={title}
        buttonClassName="reel__play"
        buttonLabel={video ? `Play video: ${caption || title}` : 'Animate the wave'}
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

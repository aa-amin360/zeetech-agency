'use client'

import { useState, type ReactNode } from 'react'
import type { ResolvedVideo } from '@/lib/video'

/**
 * Play button that swaps itself for the player, filling the nearest
 * positioned parent. Nothing from YouTube / Vimeo / Bunny loads until the
 * visitor presses play, so videos never slow the page down.
 */
export function VideoFrame({
  video,
  title,
  buttonClassName,
  buttonLabel,
  children,
  onPlay,
}: {
  video: ResolvedVideo | null
  title: string
  buttonClassName: string
  buttonLabel: string
  /** Content of the play button. */
  children: ReactNode
  /** Called instead of playing when there is no video. */
  onPlay?: () => void
}) {
  const [playing, setPlaying] = useState(false)

  if (playing && video) {
    return video.kind === 'embed' ? (
      <iframe
        className="video-frame__player"
        src={video.src}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
      />
    ) : (
      <video className="video-frame__player" src={video.src} poster={video.poster} controls autoPlay playsInline>
        {video.captions ? <track kind="captions" src={video.captions} srcLang="en" label="English" default /> : null}
      </video>
    )
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={buttonLabel}
      onClick={() => (video ? setPlaying(true) : onPlay?.())}
    >
      {children}
    </button>
  )
}

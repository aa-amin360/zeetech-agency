import type { ImgHTMLAttributes } from 'react'
import { asMedia, mediaSrcSet, mediaUrl, type MediaRef } from '@/lib/media'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  media: MediaRef
  /** Layout width hint for the browser, e.g. "(max-width: 900px) 100vw, 50vw". */
  sizes?: string
  /** Pass "" for decorative images. Defaults to the alt text stored in the admin. */
  alt?: string
  priority?: boolean
}

/** Responsive <img> for a Payload upload. Renders nothing if the upload is missing. */
export function Img({ media, sizes = '100vw', alt, priority, loading, style, ...rest }: Props) {
  const m = asMedia(media)
  const src = mediaUrl(m)
  if (!m || !src) return null
  // the focal point set in the admin decides how object-fit: cover crops
  const focal =
    m.focalX != null && m.focalY != null && (m.focalX !== 50 || m.focalY !== 50)
      ? { objectPosition: `${m.focalX}% ${m.focalY}%` }
      : undefined
  return (
    <img
      src={src}
      srcSet={mediaSrcSet(m)}
      sizes={mediaSrcSet(m) ? sizes : undefined}
      width={m.width ?? undefined}
      height={m.height ?? undefined}
      alt={alt ?? m.alt ?? ''}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={focal || style ? { ...focal, ...style } : undefined}
      {...rest}
    />
  )
}

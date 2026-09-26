import { mediaUrl, type MediaRef } from './media'

export type VideoInput =
  | {
      source?: 'none' | 'upload' | 'youtube' | 'vimeo' | 'bunny' | 'url' | null
      file?: MediaRef
      url?: string | null
      poster?: MediaRef
      captions?: MediaRef
      transcript?: string | null
    }
  | null
  | undefined

/** Plain, serialisable description of how to play a video in the browser. */
export type ResolvedVideo = {
  kind: 'file' | 'embed'
  src: string
  poster?: string
  captions?: string
  /** Thumbnail usable for structured data. */
  thumbnail?: string
  /** URL for structured data (contentUrl for files, embedUrl for embeds). */
  schemaUrl: string
}

const youtubeId = (url: string) =>
  url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)?.[1]

const vimeoId = (url: string) => url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]

const withParam = (url: string, param: string) => `${url}${url.includes('?') ? '&' : '?'}${param}`

export function resolveVideo(v: VideoInput): ResolvedVideo | null {
  if (!v?.source || v.source === 'none') return null
  const poster = mediaUrl(v.poster, 'large') || undefined
  const captions = mediaUrl(v.captions) || undefined
  const url = (v.url || '').trim()

  switch (v.source) {
    case 'upload': {
      const src = mediaUrl(v.file)
      return src ? { kind: 'file', src, poster, captions, thumbnail: poster, schemaUrl: src } : null
    }
    case 'url':
      return url ? { kind: 'file', src: url, poster, captions, thumbnail: poster, schemaUrl: url } : null
    case 'youtube': {
      const id = youtubeId(url)
      if (!id) return null
      const embed = `https://www.youtube-nocookie.com/embed/${id}`
      return {
        kind: 'embed',
        src: `${embed}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
        poster: poster || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        thumbnail: poster || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        schemaUrl: embed,
      }
    }
    case 'vimeo': {
      const id = vimeoId(url)
      if (!id) return null
      const embed = `https://player.vimeo.com/video/${id}`
      return { kind: 'embed', src: `${embed}?autoplay=1&dnt=1`, poster, thumbnail: poster, schemaUrl: embed }
    }
    case 'bunny':
      return url
        ? { kind: 'embed', src: withParam(url, 'autoplay=true&preload=true'), poster, thumbnail: poster, schemaUrl: url }
        : null
    default:
      return null
  }
}

import type { Media } from '@/payload-types'

/** An upload field is either a populated Media doc, an id, or empty. */
export type MediaRef = Media | number | string | null | undefined

export const asMedia = (m: MediaRef): Media | null => (m && typeof m === 'object' ? m : null)

type Size = 'thumbnail' | 'card' | 'large' | 'og'

/** Public URL of an upload, optionally at one of the generated sizes. */
export const mediaUrl = (m: MediaRef, size?: Size): string => {
  const media = asMedia(m)
  if (!media) return ''
  const sized = size ? media.sizes?.[size]?.url : undefined
  return sized || media.url || ''
}

/** srcset from the generated sizes plus the original. */
export const mediaSrcSet = (m: MediaRef): string | undefined => {
  const media = asMedia(m)
  if (!media || !media.mimeType?.startsWith('image/') || media.mimeType === 'image/svg+xml') return undefined
  const entries = (['thumbnail', 'card', 'large'] as const)
    .map((k) => media.sizes?.[k])
    .filter((s): s is NonNullable<typeof s> => Boolean(s?.url && s?.width))
    .map((s) => `${s.url} ${s.width}w`)
  if (media.url && media.width) entries.push(`${media.url} ${media.width}w`)
  return entries.length ? entries.join(', ') : undefined
}

/** A list of upload refs → only the populated docs. */
export const mediaList = (list: MediaRef[] | null | undefined): Media[] =>
  (list ?? []).map(asMedia).filter((m): m is Media => Boolean(m))

/** Populated relationship docs from a hasMany relationship field. */
export const docs = <T extends object>(list: (T | number | string)[] | null | undefined): T[] =>
  (list ?? []).filter((d): d is T => Boolean(d) && typeof d === 'object')

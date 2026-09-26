import 'server-only'
import { getPayloadClient } from './payload'

export const FEEDBACK_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
export const FEEDBACK_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024

export const maxVideoBytes = () => Number(process.env.FEEDBACK_MAX_VIDEO_MB || 150) * 1024 * 1024

/** The feedback request for a token, if the link is still usable. */
export async function findOpenRequest(token: string) {
  if (!token) return null
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'feedback-requests',
    where: { token: { equals: token } },
    limit: 1,
    overrideAccess: true,
  })
  const request = docs[0]
  const expired = request?.expiresAt && new Date(request.expiresAt).getTime() < Date.now()
  return request && request.status === 'open' && !expired ? request : null
}

/** Only files our own Blob store handed out may be referenced by a submission. */
export const isOwnBlobUrl = (url: string) => {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com')
  } catch {
    return false
  }
}

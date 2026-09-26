import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { escapeHtml, json, notifyList, rateLimited, str } from '@/lib/forms'
import {
  FEEDBACK_IMAGE_TYPES,
  FEEDBACK_VIDEO_TYPES,
  findOpenRequest,
  isOwnBlobUrl,
  MAX_PHOTO_BYTES,
  maxVideoBytes,
} from '@/lib/feedback'
import { serverUrl } from '@/lib/url'

export const maxDuration = 60

type Incoming = {
  token: string
  name: string
  role: string
  company: string
  quote: string
  consent: boolean
  rating: number
  videoLink: string
  /** VPS: files sent in the request. Vercel: URLs of files already uploaded to Blob. */
  videoFile?: File
  photoFile?: File
  videoBlobUrl?: string
  photoBlobUrl?: string
}

async function readRequest(req: NextRequest): Promise<Incoming | null> {
  try {
    if ((req.headers.get('content-type') || '').includes('application/json')) {
      const b = (await req.json()) as Record<string, unknown>
      return {
        token: str(b.token, 100),
        name: str(b.name, 120),
        role: str(b.role, 120),
        company: str(b.company, 120),
        quote: str(b.quote, 3000),
        consent: b.consent === true || b.consent === 'on',
        rating: Number(b.rating),
        videoLink: str(b.videoLink, 500),
        videoBlobUrl: str(b.videoBlobUrl, 1000) || undefined,
        photoBlobUrl: str(b.photoBlobUrl, 1000) || undefined,
      }
    }
    const f = await req.formData()
    const file = (v: FormDataEntryValue | null) => (v instanceof File && v.size > 0 ? v : undefined)
    return {
      token: str(f.get('token'), 100),
      name: str(f.get('name'), 120),
      role: str(f.get('role'), 120),
      company: str(f.get('company'), 120),
      quote: str(f.get('quote'), 3000),
      consent: f.get('consent') === 'on',
      rating: Number(f.get('rating')),
      videoLink: str(f.get('videoLink'), 500),
      videoFile: file(f.get('video')),
      photoFile: file(f.get('photo')),
    }
  } catch {
    return null
  }
}

/**
 * Client feedback from a private link → a draft Testimonial for review.
 * Nothing becomes public until someone presses Publish in the admin.
 */
export async function POST(req: NextRequest) {
  if (rateLimited(req, 'feedback', 6, 30 * 60_000)) {
    return json({ error: 'Too many attempts. Please try again later.' }, 429)
  }

  const input = await readRequest(req)
  if (!input) {
    return json({ error: 'The upload could not be read. If you attached a large video, try a shorter clip.' }, 400)
  }

  const request = await findOpenRequest(input.token)
  if (!request) return json({ error: 'This feedback link is no longer active. Please ask us for a new one.' }, 410)

  const { name, quote, consent, videoLink, videoFile, photoFile, videoBlobUrl, photoBlobUrl } = input
  const hasVideo = Boolean(videoFile || videoBlobUrl || videoLink)
  if (!name || !consent || (!quote && !hasVideo)) {
    return json({ error: 'Please add your name, your feedback (written or video) and tick the permission box.' }, 400)
  }
  if (videoLink && !/^https:\/\//.test(videoLink)) return json({ error: 'Please paste a full https:// video link.' }, 400)
  if ((videoBlobUrl && !isOwnBlobUrl(videoBlobUrl)) || (photoBlobUrl && !isOwnBlobUrl(photoBlobUrl))) {
    return json({ error: 'Invalid upload.' }, 400)
  }
  const maxVideo = maxVideoBytes()
  if (videoFile && (!FEEDBACK_VIDEO_TYPES.includes(videoFile.type) || videoFile.size > maxVideo)) {
    return json({ error: `Videos must be MP4, WebM or MOV and under ${Math.round(maxVideo / 1048576)} MB.` }, 400)
  }
  if (photoFile && (!FEEDBACK_IMAGE_TYPES.includes(photoFile.type) || photoFile.size > MAX_PHOTO_BYTES)) {
    return json({ error: 'Photos must be JPG, PNG or WebP and under 10 MB.' }, 400)
  }

  const payload = await getPayloadClient()
  const saveMedia = (data: Buffer, mimetype: string, fileName: string, alt: string) =>
    payload.create({
      collection: 'media',
      overrideAccess: true,
      data: { alt },
      file: { data, mimetype, name: fileName, size: data.length },
    })

  // photo: stored as a normal media item (from the request, or copied from Blob)
  let photoDoc: Awaited<ReturnType<typeof saveMedia>> | null = null
  if (photoFile) {
    photoDoc = await saveMedia(Buffer.from(await photoFile.arrayBuffer()), photoFile.type, photoFile.name || 'photo', name)
  } else if (photoBlobUrl) {
    const res = await fetch(photoBlobUrl)
    const type = res.headers.get('content-type') || ''
    const data = Buffer.from(await res.arrayBuffer())
    if (!res.ok || !FEEDBACK_IMAGE_TYPES.includes(type) || data.length > MAX_PHOTO_BYTES) {
      return json({ error: 'Photos must be JPG, PNG or WebP and under 10 MB.' }, 400)
    }
    photoDoc = await saveMedia(data, type, photoBlobUrl.split('/').pop() || 'photo', name)
  }

  // video: an uploaded file becomes a media item; a Blob upload or pasted link is kept as a URL
  const videoDoc = videoFile
    ? await saveMedia(Buffer.from(await videoFile.arrayBuffer()), videoFile.type, videoFile.name || 'video', `Video feedback from ${name}`)
    : null
  const linkSource = /youtu\.?be/.test(videoLink) ? 'youtube' : /vimeo\.com/.test(videoLink) ? 'vimeo' : 'url'
  const video = videoDoc
    ? { source: 'upload' as const, file: videoDoc.id, poster: photoDoc?.id }
    : videoBlobUrl
      ? { source: 'url' as const, url: videoBlobUrl, poster: photoDoc?.id }
      : videoLink
        ? { source: linkSource as 'youtube' | 'vimeo' | 'url', url: videoLink, poster: photoDoc?.id }
        : undefined
  const rating = input.rating

  const testimonial = await payload.create({
    collection: 'testimonials',
    overrideAccess: true,
    draft: true,
    data: {
      _status: 'draft',
      name,
      role: input.role || undefined,
      company: input.company || request.company || undefined,
      quote: quote || '(Video feedback — add a short quote before publishing.)',
      photo: photoDoc?.id,
      type: video ? 'video' : 'text',
      video,
      source: { platform: 'direct', rating: rating >= 1 && rating <= 5 ? rating : undefined },
      origin: 'client',
      consent: true,
      feedbackRequest: request.id,
    },
  })

  await payload.update({
    collection: 'feedback-requests',
    id: request.id,
    overrideAccess: true,
    data: { status: 'submitted', testimonial: testimonial.id },
    context: { skipInvite: true },
  })

  const to = notifyList()
  if (to.length) {
    payload
      .sendEmail({
        to,
        subject: `New ${video ? 'video ' : ''}feedback from ${name}`,
        html: `<p><b>${escapeHtml(name)}</b>${request.company ? ` (${escapeHtml(request.company)})` : ''} sent ${video ? 'video' : 'written'} feedback.</p>
${quote ? `<blockquote>${escapeHtml(quote)}</blockquote>` : ''}
<p>It is saved as a draft. <a href="${serverUrl()}/admin/collections/testimonials/${testimonial.id}">Review and publish it</a>.</p>`,
      })
      .catch((err: unknown) => payload.logger.error({ err }, 'Could not email the new feedback'))
  }

  return json({ ok: true })
}

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { NextRequest } from 'next/server'
import { FEEDBACK_IMAGE_TYPES, FEEDBACK_VIDEO_TYPES, findOpenRequest, maxVideoBytes } from '@/lib/feedback'
import { json, rateLimited } from '@/lib/forms'

/**
 * Vercel only: signs a one-off upload so the client's browser can send a
 * video or photo straight to Vercel Blob (serverless functions accept at
 * most 4.5 MB). Only works for an open feedback link.
 */
export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json({ error: 'Direct uploads are not enabled on this server.' }, 404)
  if (rateLimited(req, 'feedback-upload', 10, 30 * 60_000)) return json({ error: 'Too many uploads. Please try again later.' }, 429)

  let body: HandleUploadBody
  try {
    body = (await req.json()) as HandleUploadBody
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const request = await findOpenRequest(clientPayload || '')
        if (!request) throw new Error('This feedback link is no longer active.')
        return {
          allowedContentTypes: [...FEEDBACK_VIDEO_TYPES, ...FEEDBACK_IMAGE_TYPES],
          maximumSizeInBytes: maxVideoBytes(),
          addRandomSuffix: true,
        }
      },
    })
    return Response.json(result)
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Upload could not be started.' }, 400)
  }
}

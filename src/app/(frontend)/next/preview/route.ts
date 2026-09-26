import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * Turns on draft previews for logged-in editors, then opens the page.
 * Used by the admin's Preview and Live preview buttons.
 */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/'
  if (!path.startsWith('/') || path.startsWith('//')) return new Response('Invalid path', { status: 400 })

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Please log in to the admin panel to preview drafts.', { status: 401 })

  ;(await draftMode()).enable()
  redirect(path)
}

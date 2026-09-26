import 'server-only'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayload } from 'payload'
import type { CaseStudy, Page } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config })

/** True when an editor is previewing drafts (enabled by /next/preview). */
export const isPreview = async () => (await draftMode()).isEnabled

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    draft,
    overrideAccess: draft,
  })
  return docs[0] ?? null
})

export const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | null> => {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    draft,
    overrideAccess: draft,
  })
  return docs[0] ?? null
})

export const getGlobals = cache(async () => {
  const payload = await getPayloadClient()
  const [header, footer, settings] = await Promise.all([
    payload.findGlobal({ slug: 'header', depth: 1 }),
    payload.findGlobal({ slug: 'footer', depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
  ])
  return { header, footer, settings }
})

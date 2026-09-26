import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { serverUrl } from '@/lib/url'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [pages, studies] = await Promise.all([
    // overrideAccess: false → only published documents, as a visitor would see them
    payload.find({ collection: 'pages', limit: 500, depth: 0, overrideAccess: false, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'case-studies', limit: 500, depth: 0, overrideAccess: false, select: { slug: true, updatedAt: true } }),
  ])
  const base = serverUrl()
  return [
    ...pages.docs.map((p) => ({
      url: p.slug === 'home' ? `${base}/` : `${base}/${p.slug}`,
      lastModified: p.updatedAt,
      priority: p.slug === 'home' ? 1 : 0.7,
    })),
    { url: `${base}/work`, priority: 0.8 },
    ...studies.docs.map((s) => ({ url: `${base}/work/${s.slug}`, lastModified: s.updatedAt, priority: 0.7 })),
  ]
}

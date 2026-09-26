import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/lib/revalidate'
import { serverUrl } from '@/lib/url'
import { pageBlocks } from '@sections/blocks'

const pagePath = (slug?: string | null) => (!slug || slug === 'home' ? '/' : `/${slug}`)
const previewUrl = (slug?: string | null) => `${serverUrl()}/next/preview?path=${encodeURIComponent(pagePath(slug))}`

/**
 * Pages are built from section blocks. The page with slug "home" is the
 * homepage; any other page (e.g. a campaign landing page) lives at /<slug>.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => previewUrl(data?.slug),
    },
    preview: (doc) => previewUrl(doc?.slug as string),
  },
  versions: {
    drafts: { autosave: { interval: 800 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'layout',
      type: 'blocks',
      label: 'Sections',
      localized: true,
      blocks: pageBlocks,
      admin: { initCollapsed: true },
    },
  ],
}

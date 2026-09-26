import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { revalidateCollection } from '@/lib/revalidate'
import { slugField } from '@/fields/slug'
import { serverUrl } from '@/lib/url'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', '_status', 'updatedAt'],
    preview: (doc) => `${serverUrl()}/next/preview?path=${encodeURIComponent(`/work/${doc.slug}`)}`,
    livePreview: { url: ({ data }) => `${serverUrl()}/next/preview?path=${encodeURIComponent(`/work/${data?.slug}`)}` },
  },
  versions: { drafts: true },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        { name: 'projectLabel', type: 'text', admin: { width: '33%', description: 'e.g. Project 01' } },
        { name: 'client', type: 'text', admin: { width: '33%', description: 'e.g. FleetPulse Global' } },
        {
          name: 'color',
          type: 'text',
          defaultValue: '#ff8648',
          admin: { width: '33%', description: 'Card colour (hex), e.g. #ff8648' },
        },
      ],
    },
    { name: 'summary', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'scope', type: 'textarea', localized: true, admin: { width: '60%' } },
        { name: 'duration', type: 'text', localized: true, admin: { width: '40%' } },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'person',
      type: 'group',
      label: 'Client contact shown on the card',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', admin: { width: '50%' } },
            { name: 'role', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'body', type: 'richText', localized: true, label: 'Case study story' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'testimonial', type: 'relationship', relationTo: 'testimonials' },
  ],
}

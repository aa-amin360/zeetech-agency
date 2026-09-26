import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { videoField } from '@/fields'
import { revalidateCollection } from '@/lib/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'type', 'origin', '_status', 'updatedAt'],
    description:
      'Client feedback — written or video. Feedback sent in through a feedback link arrives here as a draft; review it and press Publish to show it on the site.',
  },
  versions: { drafts: true },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'company', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'role', type: 'text', localized: true, admin: { description: 'e.g. VP of Engineering' } },
    { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'Portrait used on the slide.' } },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'text',
      options: [
        { label: 'Written', value: 'text' },
        { label: 'Video', value: 'video' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      ...videoField('video', 'Video feedback'),
      admin: { condition: (data) => data?.type === 'video' },
    },
    {
      name: 'source',
      type: 'group',
      label: 'Review source',
      admin: { description: 'Where the review was originally left. Shown as a small badge.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: ['upwork', 'fiverr', 'clutch', 'google', 'linkedin', 'direct'].map((v) => ({
                label: v === 'direct' ? 'Directly to ZeeTech' : v[0].toUpperCase() + v.slice(1),
                value: v,
              })),
              admin: { width: '34%' },
            },
            { name: 'rating', type: 'number', min: 1, max: 5, admin: { width: '33%', step: 0.1 } },
            { name: 'reviewUrl', type: 'text', label: 'Link to original review', admin: { width: '33%' } },
          ],
        },
        { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Platform logo chip shown after the quote.' } },
        { name: 'badge', type: 'upload', relationTo: 'media', admin: { description: 'Optional award / crest shown next to the name.' } },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Highlight in the top proof section.' },
    },
    {
      name: 'origin',
      type: 'select',
      defaultValue: 'admin',
      options: [
        { label: 'Added in admin', value: 'admin' },
        { label: 'Sent by client (feedback link)', value: 'client' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Client agreed to publish',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => data?.origin === 'client' },
    },
    {
      name: 'feedbackRequest',
      type: 'relationship',
      relationTo: 'feedback-requests',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => data?.origin === 'client' },
    },
  ],
}

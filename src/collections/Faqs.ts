import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { revalidateCollection } from '@/lib/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'updatedAt'],
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'textarea', required: true, localized: true },
  ],
}

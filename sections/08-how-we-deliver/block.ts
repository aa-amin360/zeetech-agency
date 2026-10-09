import type { Block } from 'payload'
import { headingField, linkField } from '@/fields'

export const HowWeDeliverBlock: Block = {
  slug: 'howWeDeliver',
  imageURL: '/admin/blocks/howWeDeliver.jpg',
  imageAltText: 'Services list with a preview image',
  interfaceName: 'HowWeDeliverBlock',
  labels: { singular: 'How we deliver (services list)', plural: 'How we deliver' },
  fields: [
    headingField({ highlight: true }),
    {
      name: 'preview',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Default preview image on the right.' },
    },
    {
      name: 'services',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'tag', type: 'text', admin: { width: '50%', description: 'e.g. 01 / ARCHITECTURE' } },
            { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Optional preview for this service' } },
          ],
        },
        linkField('link'),
      ],
    },
  ],
}

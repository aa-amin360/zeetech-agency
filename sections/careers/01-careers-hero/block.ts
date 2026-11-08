import type { Block } from 'payload'
import { linkField } from '@/fields'

export const CareersHeroBlock: Block = {
  slug: 'careersHero',
  imageURL: '/admin/blocks/careersHero.jpg',
  imageAltText: 'Title with an orange highlight, a button, and three rounded photos',
  interfaceName: 'CareersHeroBlock',
  labels: { singular: 'Page hero (photo collage)', plural: 'Page heroes (photo collage)' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small orange label, e.g. Careers at ZeeTech Studio' } },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '50%', description: 'e.g. Bring your craft to' } },
        {
          name: 'highlight',
          type: 'text',
          admin: { width: '50%', description: 'White italic words in an orange box, e.g. useful digital products.' },
        },
      ],
    },
    { name: 'text', type: 'textarea' },
    linkField('cta', 'Button'),
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      minRows: 1,
      maxRows: 3,
      admin: { description: 'The large photo first, then the two small ones on the right.' },
    },
    {
      name: 'label',
      type: 'group',
      label: 'Label on the large photo',
      fields: [
        { name: 'kicker', type: 'text', admin: { description: 'e.g. How we work' } },
        { name: 'title', type: 'text', admin: { description: 'e.g. A shared product journey' } },
        { name: 'text', type: 'text', admin: { description: 'e.g. Product · design · engineering' } },
      ],
    },
  ],
}

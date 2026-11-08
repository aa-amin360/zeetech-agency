import type { Block } from 'payload'
import { linkField } from '@/fields'

export const ServicesHeroBlock: Block = {
  slug: 'servicesHero',
  imageURL: '/admin/blocks/servicesHero.jpg',
  imageAltText: 'Dark hero with a big title, orange highlight and a 3D shape',
  interfaceName: 'ServicesHeroBlock',
  labels: { singular: 'Page hero (dark)', plural: 'Page heroes (dark)' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small orange label, e.g. Our services / Strategy · Design · Engineering' } },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '60%', description: 'e.g. Everything your next product needs.' } },
        {
          name: 'highlight',
          type: 'text',
          admin: { width: '40%', description: 'White italic words in orange boxes after the title, e.g. One connected team.' },
        },
      ],
    },
    { name: 'text', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { ...linkField('primaryCta', 'Orange button (calendar icon)'), admin: { width: '50%' } },
        { ...linkField('secondaryCta', 'Dark button'), admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'background', type: 'upload', relationTo: 'media', required: true, admin: { width: '50%' } },
        {
          name: 'visual',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'Optional picture on the right (transparent PNG / WebP), e.g. the 3D shape.' },
        },
      ],
    },
  ],
}

import type { Block } from 'payload'

export const ClientLogosBlock: Block = {
  slug: 'clientLogos',
  imageURL: '/admin/blocks/clientLogos.jpg',
  imageAltText: 'Two scrolling rows of client logos',
  interfaceName: 'ClientLogosBlock',
  labels: { singular: 'Client logos', plural: 'Client logos' },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'logos',
      type: 'array',
      admin: {
        description: 'Logos are split into two scrolling rows. Transparent PNG or SVG, about 40px tall.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'url', type: 'text', admin: { width: '50%', description: 'Optional link' } },
          ],
        },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

import type { Block } from 'payload'

export const ProofStatsBlock: Block = {
  slug: 'proofStats',
  imageURL: '/admin/blocks/proofStats.jpg',
  imageAltText: 'Client quote, award badges and four stats',
  interfaceName: 'ProofStatsBlock',
  labels: { singular: 'Quote & stats', plural: 'Quote & stats' },
  fields: [
    {
      name: 'testimonial',
      type: 'relationship',
      relationTo: 'testimonials',
      admin: { description: 'The featured quote (photo, name, role and quote come from the testimonial).' },
    },
    {
      name: 'rating',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'number', min: 0, max: 5, admin: { width: '50%', step: 0.1 } },
            { name: 'icon', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'awards',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '70%' } },
            { name: 'round', type: 'checkbox', defaultValue: false, admin: { width: '30%' } },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'number', required: true, admin: { width: '25%' } },
            { name: 'suffix', type: 'text', admin: { width: '15%', description: '+, %, …' } },
            { name: 'label', type: 'text', required: true, admin: { width: '30%' } },
            { name: 'note', type: 'text', admin: { width: '30%' } },
          ],
        },
      ],
    },
  ],
}

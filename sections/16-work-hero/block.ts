import type { Block } from 'payload'

export const WorkHeroBlock: Block = {
  slug: 'workHero',
  imageURL: '/admin/blocks/workHero.jpg',
  imageAltText: 'Big title over a full-width picture',
  interfaceName: 'WorkHeroBlock',
  labels: { singular: 'Page hero (picture)', plural: 'Page heroes (picture)' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'textarea',
          required: true,
          admin: { width: '60%', rows: 2, description: 'Press Enter to start a new line, e.g. Works That Speak ↵ Things' },
        },
        {
          name: 'highlight',
          type: 'text',
          admin: { width: '40%', description: 'White italic words in an orange box after the title, e.g. Forward.' },
        },
      ],
    },
    { name: 'background', type: 'upload', relationTo: 'media', required: true },
  ],
}

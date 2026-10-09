import type { Block } from 'payload'

export const StatementBlock: Block = {
  slug: 'statement',
  imageURL: '/admin/blocks/statement.jpg',
  imageAltText: 'Short statement line',
  interfaceName: 'StatementBlock',
  labels: { singular: 'Statement line', plural: 'Statement lines' },
  fields: [
    { name: 'line1', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'line2', type: 'text', admin: { width: '50%' } },
        { name: 'accent', type: 'text', admin: { width: '50%', description: 'Orange italic words with the hand-drawn underline' } },
      ],
    },
  ],
}

import type { Block } from 'payload'
import { headingField } from '@/fields'
import { backgroundField } from '@/fields/background'

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  imageURL: '/admin/blocks/cardGrid.jpg',
  imageAltText: 'Heading, then a row of cards with a big orange number or figure',
  interfaceName: 'CardGridBlock',
  labels: { singular: 'Numbered cards', plural: 'Numbered cards' },
  fields: [
    {
      ...headingField({ accentNewLine: false }),
      admin: { hideGutter: true, description: 'The subtitle is shown beside the title — one paragraph per line.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'figures',
          options: [
            { label: 'Figures — four small cards (40+, 06, Week 01…)', value: 'figures' },
            { label: 'Numbered — larger cards (01, 02, 03…)', value: 'numbered' },
            { label: 'Outlined — white cards with a border, text under the title', value: 'outlined' },
          ],
          admin: { width: '50%' },
        },
        { ...backgroundField('white'), admin: { width: '50%' } },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'figure',
              type: 'text',
              admin: { width: '30%', description: 'Orange text, e.g. 40+. Leave empty for 01, 02…' },
            },
            { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        { name: 'text', type: 'textarea' },
      ],
    },
  ],
}

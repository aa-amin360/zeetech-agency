import type { Block } from 'payload'
import { linkField } from '@/fields'

/** Icons for the cards (files in public/brand/careers). */
export const INTEREST_ICONS = ['buildings', 'frame', 'box', 'profile-2user'] as const

export const InterestCardsBlock: Block = {
  slug: 'interestCards',
  imageURL: '/admin/blocks/interestCards.jpg',
  imageAltText: 'Two columns of cards, each with an icon, focus tags and a button',
  interfaceName: 'InterestCardsBlock',
  labels: { singular: 'Areas of interest (cards)', plural: 'Areas of interest' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', admin: { width: '33%', description: 'Small orange label on the left, e.g. Areas of interest' } },
        { name: 'title', type: 'text', required: true, admin: { width: '67%' } },
      ],
    },
    { name: 'accent', type: 'text', admin: { description: 'Orange italic line under the title' } },
    { name: 'text', type: 'textarea' },
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
            { name: 'kicker', type: 'text', admin: { width: '33%', description: 'Leave empty for “Area 01”, “Area 02”…' } },
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'buildings',
              options: INTEREST_ICONS.map((v) => ({ label: v.replace(/-2/, ' ').replace(/-/g, ' '), value: v })),
              admin: { width: '33%' },
            },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'focus', type: 'text', hasMany: true, label: 'Typical focus', admin: { description: 'Short tags, e.g. Discovery' } },
        linkField('link', 'Button'),
      ],
    },
  ],
}

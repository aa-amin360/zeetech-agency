import type { Block } from 'payload'
import { headingField, linkField } from '@/fields'

export const DeliveryPrinciplesBlock: Block = {
  slug: 'deliveryPrinciples',
  imageURL: '/admin/blocks/deliveryPrinciples.jpg',
  imageAltText: 'Coloured principle cards',
  interfaceName: 'DeliveryPrinciplesBlock',
  labels: { singular: 'Delivery principles (cards)', plural: 'Delivery principles' },
  fields: [
    headingField({ accentNewLine: false }),
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'kicker', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'accent', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
        linkField('link'),
        {
          type: 'row',
          fields: [
            {
              name: 'theme',
              type: 'select',
              defaultValue: 'white',
              options: [
                { label: 'Dark', value: 'dark' },
                { label: 'White', value: 'white' },
                { label: 'Yellow', value: 'yellow' },
                { label: 'Blue', value: 'blue' },
                { label: 'Pink', value: 'pink' },
                { label: 'Purple', value: 'purple' },
              ],
              admin: { width: '33%' },
            },
            {
              name: 'visual',
              type: 'select',
              defaultValue: 'image',
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Image filling the card', value: 'fill' },
                { label: 'Architecture orbit diagram', value: 'orbit' },
              ],
              admin: { width: '33%' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { width: '34%', condition: (_, s) => s?.visual !== 'orbit' },
            },
          ],
        },
      ],
    },
  ],
}

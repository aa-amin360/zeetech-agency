import type { Block } from 'payload'
import { headingField, linkField } from '@/fields'

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    headingField({ accentNewLine: false }),
    {
      name: 'helpCard',
      type: 'group',
      fields: [
        { name: 'background', type: 'upload', relationTo: 'media' },
        { name: 'avatars', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 4 },
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', admin: { width: '50%' } },
            { name: 'accent', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'text', type: 'textarea' },
        linkField('cta', 'Button'),
      ],
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: { description: 'Choose and order the questions. Leave empty to show all FAQs.' },
    },
  ],
}

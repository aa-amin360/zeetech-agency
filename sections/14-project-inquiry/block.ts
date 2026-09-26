import type { Block } from 'payload'
import { headingField } from '@/fields'

export const ProjectInquiryBlock: Block = {
  slug: 'projectInquiry',
  interfaceName: 'ProjectInquiryBlock',
  labels: { singular: 'Project inquiry form', plural: 'Project inquiry forms' },
  fields: [
    headingField(),
    {
      name: 'prep',
      type: 'group',
      label: 'Left side of the card',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text' },
        {
          name: 'steps',
          type: 'array',
          maxRows: 5,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'text' },
          ],
        },
        {
          name: 'person',
          type: 'group',
          fields: [
            { name: 'photo', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', admin: { width: '50%' } },
                { name: 'role', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'budgets',
      type: 'text',
      hasMany: true,
      admin: { description: 'Budget choices, e.g. Less than $5k' },
    },
    {
      type: 'row',
      fields: [
        { name: 'submitLabel', type: 'text', defaultValue: 'Send Inquiry', admin: { width: '50%' } },
        {
          name: 'successMessage',
          type: 'text',
          defaultValue: 'Thank you — we’ll be in touch within one business day.',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}

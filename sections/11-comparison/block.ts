import type { Block } from 'payload'
import { headingField } from '@/fields'

export const COMPARISON_MARKS = [
  { label: 'Included (orange tick)', value: 'yes' },
  { label: 'Yes (blue check)', value: 'check' },
  { label: 'Limited (grey dot)', value: 'dot' },
  { label: 'No (cross)', value: 'no' },
]

export const ComparisonBlock: Block = {
  slug: 'comparison',
  interfaceName: 'ComparisonBlock',
  labels: { singular: 'Comparison table', plural: 'Comparison tables' },
  fields: [
    headingField(),
    { name: 'firstColumnLabel', type: 'text', defaultValue: 'Delivery Model' },
    {
      name: 'columns',
      type: 'text',
      hasMany: true,
      maxRows: 8,
      admin: { description: 'Column headings, e.g. Strategy, Design, …' },
    },
    {
      name: 'rows',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            {
              name: 'highlight',
              type: 'checkbox',
              admin: { width: '50%', description: 'Green highlighted row (ZeeTech)' },
            },
          ],
        },
        { name: 'description', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'icon', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
            {
              name: 'ring',
              type: 'select',
              defaultValue: 'orange',
              options: ['orange', 'green', 'lime', 'yellow'].map((v) => ({ label: v, value: v })),
              admin: { width: '50%', description: 'Icon ring colour' },
            },
          ],
        },
        {
          name: 'cells',
          type: 'array',
          labels: { singular: 'Mark', plural: 'Marks' },
          admin: { description: 'One mark per column, in the same order as the column headings.', initCollapsed: true },
          fields: [{ name: 'mark', type: 'select', required: true, defaultValue: 'dot', options: COMPARISON_MARKS }],
        },
      ],
    },
  ],
}

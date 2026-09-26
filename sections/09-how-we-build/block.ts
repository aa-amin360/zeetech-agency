import type { Block } from 'payload'
import { headingField, linkField } from '@/fields'

export const HowWeBuildBlock: Block = {
  slug: 'howWeBuild',
  interfaceName: 'HowWeBuildBlock',
  labels: { singular: 'How we build (delivery map)', plural: 'How we build' },
  fields: [
    headingField(),
    {
      name: 'toolIcons',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Tool logos drifting behind the map.' },
    },
    {
      name: 'stages',
      type: 'array',
      maxRows: 6,
      admin: { description: 'The connector lines are drawn for six stages.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'tools', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 3 },
        { name: 'delivers', type: 'text', hasMany: true, admin: { description: 'Press Enter after each item' } },
      ],
    },
    { name: 'footerText', type: 'text' },
    linkField('cta', 'Button'),
  ],
}

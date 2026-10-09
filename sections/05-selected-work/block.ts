import type { Block } from 'payload'
import { linkField } from '@/fields'

export const SelectedWorkBlock: Block = {
  slug: 'selectedWork',
  imageURL: '/admin/blocks/selectedWork.jpg',
  imageAltText: 'Project cards that stack while scrolling',
  interfaceName: 'SelectedWorkBlock',
  labels: { singular: 'Selected work', plural: 'Selected work' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
        { name: 'note', type: 'text', admin: { width: '50%', description: 'Grey line under the eyebrow' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'accent', type: 'text', admin: { width: '50%' } },
      ],
    },
    linkField('button'),
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: { description: 'Choose and order the cards. Leave empty to show the latest five.' },
    },
  ],
}

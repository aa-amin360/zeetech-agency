import type { Block } from 'payload'

export const WorkGridBlock: Block = {
  slug: 'workGrid',
  imageURL: '/admin/blocks/workGrid.jpg',
  imageAltText: 'Filter buttons over a two-column grid of projects',
  interfaceName: 'WorkGridBlock',
  labels: { singular: 'Project grid with filters', plural: 'Project grids with filters' },
  fields: [
    {
      name: 'allLabel',
      type: 'text',
      defaultValue: 'All Projects',
      admin: {
        description:
          'First filter button. The other buttons are made from the projects’ Industry, one for each industry in use.',
      },
    },
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: { description: 'Choose and order the projects. Leave empty to show every published case study.' },
    },
  ],
}

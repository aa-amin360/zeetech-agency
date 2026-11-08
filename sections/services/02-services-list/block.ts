import type { Block } from 'payload'

export const ServicesListBlock: Block = {
  slug: 'servicesList',
  imageURL: '/admin/blocks/servicesList.jpg',
  imageAltText: 'Each service with a picture, its deliverables and a button',
  interfaceName: 'ServicesListBlock',
  labels: { singular: 'Services list', plural: 'Services lists' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'textarea',
          admin: { width: '40%', rows: 2, description: 'Small label on the left, e.g. Six disciplines. ↵ One delivery team.' },
        },
        {
          name: 'intro',
          type: 'textarea',
          admin: { width: '60%', rows: 2, description: 'Large sentence on the right' },
        },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Choose and order the services. Leave empty to show all of them in their usual order.' },
    },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Explore This Service' },
  ],
}

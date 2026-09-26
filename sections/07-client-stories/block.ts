import type { Block } from 'payload'
import { headingField } from '@/fields'

export const ClientStoriesBlock: Block = {
  slug: 'clientStories',
  interfaceName: 'ClientStoriesBlock',
  labels: { singular: 'Client stories (testimonial slider)', plural: 'Client stories' },
  fields: [
    headingField({ subtitle: false }),
    { name: 'note', type: 'textarea', admin: { description: 'Short line next to the arrows' } },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { description: 'Choose and order the slides. Leave empty to show all published testimonials.' },
    },
  ],
}

import type { Block } from 'payload'
import { headingField } from '@/fields'

export const PageIntroBlock: Block = {
  slug: 'pageIntro',
  imageURL: '/admin/blocks/pageIntro.jpg',
  imageAltText: 'Title with text beside it, then a wide picture',
  interfaceName: 'PageIntroBlock',
  labels: { singular: 'Page intro (title + picture)', plural: 'Page intros' },
  fields: [
    {
      ...headingField(),
      admin: { hideGutter: true, description: 'The subtitle is shown beside the title — one paragraph per line.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
  ],
}

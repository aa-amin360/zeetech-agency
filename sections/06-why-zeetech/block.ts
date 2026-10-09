import type { Block } from 'payload'
import { headingField, videoField } from '@/fields'

export const WhyZeetechBlock: Block = {
  slug: 'whyZeetech',
  imageURL: '/admin/blocks/whyZeetech.jpg',
  imageAltText: 'Heading with the studio reel video',
  interfaceName: 'WhyZeetechBlock',
  labels: { singular: 'Why ZeeTech (studio reel)', plural: 'Why ZeeTech' },
  fields: [
    headingField(),
    {
      ...videoField('reel', 'Studio reel'),
      admin: { description: 'Until a video is added, an animated wave plays in the frame.' },
    },
  ],
}

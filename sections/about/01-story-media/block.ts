import type { Block } from 'payload'
import { headingField } from '@/fields'
import { backgroundField } from '@/fields/background'

export const StoryMediaBlock: Block = {
  slug: 'storyMedia',
  imageURL: '/admin/blocks/storyMedia.jpg',
  imageAltText: 'Heading with text beside it, then two or three pictures',
  interfaceName: 'StoryMediaBlock',
  labels: { singular: 'Text with pictures', plural: 'Text with pictures' },
  fields: [
    {
      ...headingField({ accentNewLine: false }),
      admin: { hideGutter: true, description: 'The subtitle is shown beside the title — one paragraph per line.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'pair',
          options: [
            { label: 'Two pictures side by side', value: 'pair' },
            { label: 'Two stacked on the left, one tall on the right (3 pictures)', value: 'stack' },
            { label: 'Wide picture + person card (2 pictures: scene, then portrait)', value: 'person' },
          ],
          admin: { width: '50%' },
        },
        { ...backgroundField('white'), admin: { width: '50%' } },
      ],
    },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, minRows: 1, maxRows: 3 },
    {
      name: 'person',
      type: 'group',
      admin: { condition: (_, sibling) => sibling?.layout === 'person', description: 'Shown under the portrait.' },
      fields: [
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
}

import type { Block } from 'payload'
import { linkField } from '@/fields'

export const HeroBlock: Block = {
  slug: 'hero',
  imageURL: '/admin/blocks/hero.jpg',
  imageAltText: 'Hero: big headline, buttons and image collage',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'trust',
      type: 'group',
      label: 'Trust line',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'prefix', type: 'text', defaultValue: 'Trusted by', admin: { width: '33%' } },
            { name: 'badge', type: 'text', defaultValue: '40+', admin: { width: '33%' } },
            { name: 'suffix', type: 'text', defaultValue: 'product teams worldwide', admin: { width: '34%' } },
          ],
        },
        { name: 'avatars', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 3 },
      ],
    },
    {
      name: 'headline',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'line3', type: 'text', admin: { width: '50%', description: 'Start of the last line' } },
            {
              name: 'highlight',
              type: 'text',
              admin: { width: '50%', description: 'Words on the orange highlight' },
            },
          ],
        },
      ],
    },
    { name: 'lede', type: 'textarea' },
    linkField('primaryCta', 'Primary button'),
    linkField('secondaryCta', 'Secondary button'),
    {
      name: 'collage',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      minRows: 3,
      admin: { description: 'Project images for the rotating collage (6–12 works best).' },
    },
    // no longer used (the corner colour / pause controls were removed); kept hidden so the
    // database needs no change
    {
      name: 'showBackdropControls',
      type: 'checkbox',
      defaultValue: true,
      admin: { hidden: true },
    },
  ],
}

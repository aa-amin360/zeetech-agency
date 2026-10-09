import type { Block } from 'payload'
import { headingField } from '@/fields'

export const ShowreelBlock: Block = {
  slug: 'showreel',
  imageURL: '/admin/blocks/showreel.jpg',
  imageAltText: 'Scrolling strips of project screens',
  interfaceName: 'ShowreelBlock',
  labels: { singular: 'Showreel (scrolling strips)', plural: 'Showreels' },
  fields: [
    headingField(),
    { name: 'topTicker', type: 'text', hasMany: true, admin: { description: 'Words in the top strip' } },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'bottomTicker', type: 'text', hasMany: true, admin: { description: 'Words in the bottom strip' } },
  ],
}

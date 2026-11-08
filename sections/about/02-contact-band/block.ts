import type { Block } from 'payload'
import { headingField, linkField } from '@/fields'

export const ContactBandBlock: Block = {
  slug: 'contactBand',
  imageURL: '/admin/blocks/contactBand.jpg',
  imageAltText: 'Closing banner with a big title, an email address and a button',
  interfaceName: 'ContactBandBlock',
  labels: { singular: 'Contact banner', plural: 'Contact banners' },
  fields: [
    headingField({ subtitle: false }),
    {
      name: 'email',
      type: 'email',
      admin: { description: 'Shown above the button. Leave empty to use the address from Site settings.' },
    },
    linkField('cta', 'Button'),
  ],
}

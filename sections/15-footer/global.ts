import type { GlobalConfig } from 'payload'
import { linkField } from '@/fields'
import { revalidateGlobal } from '@/lib/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'pitch',
      type: 'group',
      localized: true,
      fields: [
        { name: 'kicker', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'tagline', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'emailLabel', type: 'text', defaultValue: 'EMAIL THE STUDIO', admin: { width: '50%' } },
        { name: 'email', type: 'email', admin: { width: '50%' } },
      ],
    },
    linkField('cta', 'Button'),
    {
      name: 'brand',
      type: 'group',
      localized: true,
      fields: [
        { name: 'text', type: 'textarea' },
        { name: 'location', type: 'text' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      localized: true,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [linkField('link')],
          admin: { description: 'Leave the address empty for plain text (e.g. a city name).' },
        },
      ],
    },
    {
      name: 'strip',
      type: 'array',
      label: 'Orange info strip',
      localized: true,
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', admin: { width: '50%' } },
            { name: 'value', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'bottom',
      type: 'group',
      localized: true,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'metaLeft', type: 'text', admin: { width: '50%' } },
            { name: 'metaRight', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'copyright', type: 'text' },
        { name: 'builtWith', type: 'text' },
      ],
    },
  ],
}

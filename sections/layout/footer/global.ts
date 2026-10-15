import type { GlobalConfig } from 'payload'
import { linkField } from '@/fields'
import { revalidateGlobal } from '@/lib/revalidate'

export const SOCIAL_PLATFORMS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'X / Twitter', value: 'twitter' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
] as const

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'brand',
      type: 'group',
      localized: true,
      fields: [{ name: 'text', type: 'textarea', admin: { description: 'Short line under the logo.' } }],
    },
    {
      name: 'email',
      type: 'email',
      admin: { description: 'Shown in the white pill under the logo (opens the visitor’s email app).' },
    },
    linkField('cta', 'Button in the pill'),
    {
      name: 'columns',
      type: 'array',
      localized: true,
      maxRows: 3,
      admin: { description: 'The link columns (Navigate, Services, Contact).' },
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
      name: 'socials',
      type: 'array',
      label: 'Social links',
      admin: { description: 'Round icons in the bottom row. Icons without an address are not clickable.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: SOCIAL_PLATFORMS.map((p) => ({ ...p })),
              admin: { width: '40%' },
            },
            { name: 'url', type: 'text', admin: { width: '60%', placeholder: 'https://…' } },
          ],
        },
      ],
    },
    {
      name: 'bottom',
      type: 'group',
      localized: true,
      fields: [{ name: 'copyright', type: 'text' }],
    },
    {
      name: 'legal',
      type: 'array',
      label: 'Legal links',
      localized: true,
      admin: { description: 'Bottom-right links, e.g. Terms of Use, Privacy Policy, Sitemap.' },
      fields: [linkField('link')],
    },
  ],
}

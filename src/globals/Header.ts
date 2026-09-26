import type { GlobalConfig } from 'payload'
import { linkField } from '@/fields'
import { revalidateGlobal } from '@/lib/revalidate'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Site' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'links',
      type: 'array',
      localized: true,
      maxRows: 6,
      fields: [linkField('link')],
    },
    linkField('cta', 'Button', true),
  ],
}

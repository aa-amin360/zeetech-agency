import type { TextField } from 'payload'

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** URL slug, filled from another field when left empty. */
export const slugField = (from: string): TextField => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Part of the web address. Filled in automatically from the title.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = data?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})

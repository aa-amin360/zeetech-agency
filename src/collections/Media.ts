import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description: 'Images, short videos and caption files used across the site.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Describe the image for screen readers and Google. Leave empty for decoration.' },
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/quicktime', 'text/vtt'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 900 },
      { name: 'large', width: 1600 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
}

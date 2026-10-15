import type { CollectionConfig } from 'payload'

const WEBP = { format: 'webp', options: { quality: 80, alphaQuality: 90, effort: 5 } } as const

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
    // Photos and PNGs are stored as WebP (transparency kept), several times smaller than PNG.
    // SVGs and videos are left as they are. The social-share size stays JPEG, which every
    // network accepts. Existing uploads are converted with `npm run images`.
    formatOptions: WEBP,
    imageSizes: [
      { name: 'thumbnail', width: 400, formatOptions: WEBP },
      { name: 'card', width: 900, formatOptions: WEBP },
      { name: 'large', width: 1600, formatOptions: WEBP },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 82, mozjpeg: true } },
      },
    ],
  },
}

import type { Field, GroupField } from 'payload'

/** Eyebrow + two-tone display title + subtitle, used by most sections. */
export const headingField = (
  options: { subtitle?: boolean; highlight?: boolean; accentNewLine?: boolean } = {},
): GroupField => ({
  name: 'heading',
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the title' } },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '50%', description: 'Main part of the title' } },
        {
          name: 'accent',
          type: 'text',
          admin: { width: '50%', description: 'Orange italic part that follows the title' },
        },
      ],
    },
    ...(options.highlight
      ? [
          {
            name: 'highlight',
            type: 'text',
            admin: { description: 'Orange (not italic) words placed just before the accent' },
          } as Field,
        ]
      : []),
    {
      name: 'accentOnNewLine',
      type: 'checkbox',
      defaultValue: options.accentNewLine ?? true,
      label: 'Start the accent on a new line',
    },
    ...(options.subtitle === false ? [] : [{ name: 'subtitle', type: 'textarea' } as Field]),
  ],
})

/** A label + URL pair. */
export const linkField = (name = 'link', label?: string, localized = false): GroupField => ({
  name,
  label,
  localized,
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', admin: { width: '50%' } },
        {
          name: 'href',
          type: 'text',
          admin: { width: '50%', description: 'e.g. #contact, /work, https://…' },
        },
      ],
    },
  ],
})

export const VIDEO_SOURCES = [
  { label: 'No video', value: 'none' },
  { label: 'Upload a file', value: 'upload' },
  { label: 'YouTube link', value: 'youtube' },
  { label: 'Vimeo link', value: 'vimeo' },
  { label: 'Bunny Stream embed URL', value: 'bunny' },
  { label: 'Other direct video URL (.mp4)', value: 'url' },
] as const

/**
 * Video that can be an uploaded file or a hosted link.
 * Long videos should be hosted (Bunny Stream / YouTube) rather than uploaded,
 * so they stream at the right quality without loading the VPS.
 */
export const videoField = (name = 'video', label = 'Video'): GroupField => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'source', type: 'select', defaultValue: 'none', options: [...VIDEO_SOURCES] },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: {
        condition: (_, sibling) => sibling?.source === 'upload',
        description: 'Keep uploads short (under ~50 MB). Host longer videos on Bunny Stream or YouTube.',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, sibling) => ['youtube', 'vimeo', 'bunny', 'url'].includes(sibling?.source),
        description: 'Paste the share link (YouTube / Vimeo) or the embed URL from Bunny Stream.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) => sibling?.source && sibling.source !== 'none',
        description: 'Still image shown before the video plays.',
      },
    },
    {
      name: 'captions',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) => ['upload', 'url'].includes(sibling?.source),
        description: 'Optional WebVTT (.vtt) subtitles for uploaded videos.',
      },
    },
    {
      name: 'transcript',
      type: 'textarea',
      admin: {
        condition: (_, sibling) => sibling?.source && sibling.source !== 'none',
        description: 'What is said in the video. Helps accessibility and SEO.',
      },
    },
  ],
})

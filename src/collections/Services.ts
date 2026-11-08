import type { CollectionConfig, Field } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/lib/revalidate'
import { serverUrl } from '@/lib/url'
import { ClientStoriesBlock } from '@sections/shared/client-stories/block'
import { FaqBlock } from '@sections/shared/faq/block'
import { ProjectInquiryBlock } from '@sections/shared/project-inquiry/block'

/** Line icons for the Services menu in the header (files in public/brand/menu). */
export const SERVICE_ICONS = [
  'layers-3',
  'pen-tool',
  'file-code-2',
  'monitor-smartphone',
  'square-mouse-pointer',
  'cloud-cog',
  'settings',
  'image',
  'atom',
  'waves',
] as const

const previewUrl = (slug?: string | null) =>
  `${serverUrl()}/next/preview?path=${encodeURIComponent(`/services/${slug ?? ''}`)}`

/** A two-part section title (plain + orange italic) with the design's wording as default. */
const sectionHeading = (name: string, label: string, title: string, accent: string): Field => ({
  name,
  label,
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', localized: true, defaultValue: title, admin: { width: '50%' } },
        { name: 'accent', type: 'text', localized: true, defaultValue: accent, admin: { width: '50%' } },
      ],
    },
  ],
})

/** A title + short text pair, used for deliverables and process steps. */
const titleAndText: Field[] = [
  { name: 'title', type: 'text', required: true, localized: true },
  { name: 'text', type: 'textarea', localized: true },
]

/**
 * One service (e.g. UI/UX design). Each service has its own page at /services/<slug>,
 * and the "Services list" section on the Services page shows them all in this order.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kicker', '_status', 'updatedAt'],
    description: 'The six services. Drag to reorder — the order sets their numbers (01, 02…) and the “next service” links.',
    preview: (doc) => previewUrl(doc?.slug as string),
    livePreview: { url: ({ data }) => previewUrl(data?.slug) },
  },
  versions: { drafts: true },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          admin: { width: '50%', description: 'e.g. System architecture & planning' },
        },
        {
          name: 'accent',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
            description: 'Words of the name shown in orange italic on the Services page, e.g. architecture',
          },
        },
      ],
    },
    slugField('name'),
    {
      name: 'kicker',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Small label after the number, e.g. Architecture blueprint → “01 / ARCHITECTURE BLUEPRINT”. Also the short line under the name in the header’s Services menu.',
      },
    },
    {
      name: 'icon',
      type: 'select',
      options: SERVICE_ICONS.map((v) => ({ label: v.replace(/-\d$/, '').replace(/-/g, ' '), value: v })),
      admin: { position: 'sidebar', description: 'Icon in the header’s Services menu.' },
    },
    { name: 'summary', type: 'textarea', localized: true, admin: { description: 'One or two sentences about the service.' } },
    {
      name: 'deliverables',
      type: 'array',
      label: 'What we deliver',
      minRows: 1,
      maxRows: 8,
      labels: { singular: 'Deliverable', plural: 'Deliverables' },
      admin: { description: 'Listed on the Services page and on this service’s page (four look best).' },
      fields: titleAndText,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Services page row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Picture beside the service.' } },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              admin: { description: 'Orange italic line under the list, e.g. A clear foundation for what comes next.' },
            },
          ],
        },
        {
          label: 'Service page',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Background picture (darkened).' } },
                {
                  name: 'highlight',
                  type: 'text',
                  localized: true,
                  admin: { description: 'White italic words in an orange box, e.g. Clarity before code.' },
                },
                { name: 'buttonLabel', type: 'text', localized: true, defaultValue: 'Discuss your project' },
              ],
            },
            sectionHeading('deliverablesHeading', 'Deliverables title', 'What we deliver.', 'Built around your product.'),
            sectionHeading('processHeading', 'Process title', 'A clear process.', 'From first step to handoff.'),
            {
              name: 'process',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Step', plural: 'Steps' },
              fields: titleAndText,
            },
            sectionHeading('questionsHeading', 'Questions title', 'Before we start.', 'A few useful answers.'),
            {
              name: 'questions',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                { name: 'question', type: 'text', required: true, localized: true },
                { name: 'answer', type: 'textarea', required: true, localized: true },
              ],
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Sections after the questions',
              labels: { singular: 'Section', plural: 'Sections' },
              localized: true,
              blocks: [ProjectInquiryBlock, FaqBlock, ClientStoriesBlock],
              admin: { initCollapsed: true },
            },
            sectionHeading('nextHeading', '“Next service” banner title', 'One connected team.', 'Explore the next step.'),
          ],
        },
      ],
    },
  ],
}

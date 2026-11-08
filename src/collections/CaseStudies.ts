import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '@/access'
import { revalidateCollection } from '@/lib/revalidate'
import { slugField } from '@/fields/slug'
import { serverUrl } from '@/lib/url'
import { ClientStoriesBlock } from '@sections/shared/client-stories/block'
import { FaqBlock } from '@sections/shared/faq/block'
import { ProjectInquiryBlock } from '@sections/shared/project-inquiry/block'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', '_status', 'updatedAt'],
    preview: (doc) => `${serverUrl()}/next/preview?path=${encodeURIComponent(`/work/${doc.slug}`)}`,
    livePreview: { url: ({ data }) => `${serverUrl()}/next/preview?path=${encodeURIComponent(`/work/${data?.slug}`)}` },
  },
  versions: { drafts: true },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, admin: { width: '50%' } },
        {
          name: 'titleAccent',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'Second line in orange italic, e.g. Management Platform' },
        },
      ],
    },
    slugField('title'),
    {
      type: 'row',
      fields: [
        {
          name: 'service',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'First tag on the Work page, e.g. Branding & Product design' },
        },
        {
          name: 'industry',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
            description: 'Second tag, e.g. SaaS. The Work page makes a filter button for each industry.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'projectLabel', type: 'text', admin: { width: '33%', description: 'e.g. Project 01' } },
        { name: 'client', type: 'text', admin: { width: '33%', description: 'e.g. FleetPulse Global' } },
        {
          name: 'color',
          type: 'text',
          defaultValue: '#ff8648',
          admin: { width: '33%', description: 'Card colour (hex), e.g. #ff8648' },
        },
      ],
    },
    { name: 'summary', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'scope', type: 'textarea', localized: true, admin: { width: '60%' } },
        { name: 'duration', type: 'text', localized: true, admin: { width: '40%', description: 'e.g. 8 Weeks' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'text', localized: true, admin: { width: '40%', description: 'e.g. Shipped ✓' } },
        {
          name: 'tags',
          type: 'text',
          hasMany: true,
          localized: true,
          admin: { width: '60%', description: 'Orange chips under the details, e.g. Product Strategy, UI/UX Design, QA' },
        },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'person',
      type: 'group',
      label: 'Client contact shown on the card',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', admin: { width: '50%' } },
            { name: 'role', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'body', type: 'richText', localized: true, label: 'Case study story' },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Shown full width, one under another, after the story — e.g. problem, solution, design system, user flows, results.',
      },
    },
    { name: 'testimonial', type: 'relationship', relationTo: 'testimonials' },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Sections at the end',
      labels: { singular: 'Section', plural: 'Sections' },
      localized: true,
      blocks: [ProjectInquiryBlock, ClientStoriesBlock, FaqBlock],
      admin: {
        initCollapsed: true,
        description: 'After the related projects, e.g. the project inquiry form and client stories.',
      },
    },
  ],
}

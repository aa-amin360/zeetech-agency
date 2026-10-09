import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'

/** Project inquiries from the site form. Created only by the server route. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    group: 'Inbox',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'email', 'budget', 'createdAt'],
    description: 'Project inquiries sent through the website form, with where each visitor came from.',
  },
  access: { read: loggedIn, create: () => false, update: loggedIn, delete: loggedIn },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'contacted', 'proposal', 'won', 'lost'].map((v) => ({
        label: v[0].toUpperCase() + v.slice(1),
        value: v,
      })),
      admin: { position: 'sidebar', components: { Cell: '/admin/StatusCell#StatusCell' } },
    },
    { name: 'notes', type: 'textarea', label: 'Internal notes', admin: { position: 'sidebar' } },
    // unnamed tabs only group the form; the stored data is unchanged
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Inquiry',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', label: 'WhatsApp', admin: { width: '50%' } },
                { name: 'budget', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'details', type: 'textarea', required: true },
          ],
        },
        {
          label: 'Where they came from',
          fields: [
            {
              name: 'attribution',
              type: 'group',
              label: 'Where the visitor came from',
              admin: { readOnly: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'utmSource', type: 'text', label: 'UTM source', admin: { width: '33%' } },
                    { name: 'utmMedium', type: 'text', label: 'UTM medium', admin: { width: '33%' } },
                    { name: 'utmCampaign', type: 'text', label: 'UTM campaign', admin: { width: '33%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'utmTerm', type: 'text', label: 'UTM term', admin: { width: '33%' } },
                    { name: 'utmContent', type: 'text', label: 'UTM content', admin: { width: '33%' } },
                    { name: 'clickId', type: 'text', label: 'Ad click ID (gclid / fbclid)', admin: { width: '33%' } },
                  ],
                },
                { name: 'referrer', type: 'text' },
                { name: 'landingPage', type: 'text', label: 'First page visited' },
                { name: 'formPage', type: 'text', label: 'Page the form was sent from' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

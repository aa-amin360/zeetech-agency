import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Site' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO defaults',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'ZeeTech' },
            {
              name: 'titleTemplate',
              type: 'text',
              defaultValue: '%s — ZeeTech',
              admin: { description: '%s is replaced by the page title.' },
            },
            { name: 'defaultDescription', type: 'textarea', localized: true },
            {
              name: 'defaultShareImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Used when a page has no share image of its own (1200 × 630).' },
            },
          ],
        },
        {
          label: 'Organisation',
          description: 'Shown to search engines as structured data.',
          fields: [
            { name: 'legalName', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { width: '50%' } },
                { name: 'phone', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'address', type: 'text' },
            {
              name: 'socials',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'platform', type: 'text', admin: { width: '40%' } },
                    { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tracking',
          description: 'Leave a field empty to turn that tracker off.',
          fields: [
            { name: 'gtmId', type: 'text', label: 'Google Tag Manager ID', admin: { placeholder: 'GTM-XXXXXXX' } },
            {
              name: 'ga4Id',
              type: 'text',
              label: 'Google Analytics 4 ID',
              admin: { placeholder: 'G-XXXXXXXXXX', description: 'Only needed if GA4 is not set up inside Tag Manager.' },
            },
            { name: 'metaPixelId', type: 'text', label: 'Meta (Facebook) Pixel ID' },
            { name: 'linkedinPartnerId', type: 'text', label: 'LinkedIn Insight partner ID' },
            {
              name: 'searchConsoleToken',
              type: 'text',
              label: 'Google Search Console verification code',
              admin: { description: 'Only the content="…" value.' },
            },
          ],
        },
      ],
    },
  ],
}

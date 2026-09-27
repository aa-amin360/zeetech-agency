import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { CaseStudies } from './collections/CaseStudies'
import { Faqs } from './collections/Faqs'
import { FeedbackRequests } from './collections/FeedbackRequests'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Header } from './globals/Header'
import { SiteSettings } from './globals/SiteSettings'
import { serverUrl } from './lib/url'
import { migrations } from './migrations'
import { Footer } from '@sections/15-footer/global'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const smtp = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'hello@zeetech.studio',
      defaultFromName: process.env.SMTP_FROM_NAME || 'ZeeTech',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

export default buildConfig({
  serverURL: serverUrl(),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — ZeeTech admin' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 1024, height: 768 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Pages, CaseStudies, Testimonials, Faqs, Media, Leads, FeedbackRequests, Users],
  globals: [Header, Footer, SiteSettings],
  // English only for now. To add a language later, add it here (e.g. { label: 'বাংলা', code: 'bn' })
  // and translate the content — every text field is already set up for it.
  localization: {
    locales: [{ label: 'English', code: 'en' }],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      // serverless (Vercel) opens many short-lived instances — keep each pool small
      max: process.env.VERCEL ? 3 : 10,
    },
    // in production the schema is updated by these migrations on start-up
    prodMigrations: migrations,
  }),
  email: smtp,
  sharp,
  plugins: [
    // Uploads go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set (Vercel);
    // otherwise they are stored on disk in ./media (local dev and the VPS).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: { disablePayloadAccessControl: true } },
      // admin uploads go straight from the browser to Blob (skips Vercel's 4.5 MB body limit)
      clientUploads: true,
      // same database columns whether or not Blob is in use, so one set of migrations fits all
      alwaysInsertFields: true,
      // keep this off: image URLs are built from the stored filename, and a random suffix
      // on the Blob object (but not on the resized copies) makes those URLs 404.
      // Payload already makes filenames unique (photo.png → photo-1.png).
      addRandomSuffix: false,
    }),
    seoPlugin({
      collections: ['pages', 'case-studies'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => (doc?.title ? `${doc.title} — ZeeTech` : 'ZeeTech'),
      generateDescription: ({ doc }) => doc?.summary || '',
      generateURL: ({ doc, collectionSlug }) =>
        collectionSlug === 'case-studies'
          ? `${serverUrl()}/work/${doc?.slug}`
          : `${serverUrl()}${doc?.slug === 'home' ? '' : `/${doc?.slug}`}`,
    }),
  ],
})

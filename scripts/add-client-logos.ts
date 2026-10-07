/* Adds the client logos to a site that was set up before they existed.
 *
 *   npm run logos            — local database
 *   npm run vercel:logos     — the Vercel database + Blob (needs .env.production.local)
 *
 * Only fills a "Client logos" section that has no logos yet; everything else is left as it is.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { CLIENT_LOGOS } from './client-logos.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(dirname, '../legacy/assets/clients')
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const pages = await payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false })
const targets = pages.docs.filter((p) =>
  (p.layout ?? []).some((b) => b.blockType === 'clientLogos' && !(b.logos ?? []).length),
)

if (!targets.length) {
  payload.logger.info('Every "Client logos" section already has logos — nothing to do.')
  process.exit(0)
}

payload.logger.info(`Uploading ${CLIENT_LOGOS.length} logos…`)
const logos: { name: string; logo: number }[] = []
for (const { name, file } of CLIENT_LOGOS) {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: name },
    filePath: path.join(DIR, file),
    context: ctx(),
  })
  logos.push({ name, logo: doc.id as number })
}

for (const page of targets) {
  const layout = (page.layout ?? []).map((b) =>
    b.blockType === 'clientLogos' && !(b.logos ?? []).length ? { ...b, logos } : b,
  )
  await payload.update({ collection: 'pages', id: page.id, data: { layout }, depth: 0, context: ctx() })
  payload.logger.info(`Added the logos to "${page.title ?? page.slug}".`)
}

payload.logger.info('Done.')
process.exit(0)

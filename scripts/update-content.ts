/* Small content fixes that came with design updates, for sites that already have content.
 *
 *   npm run update-content          — local database
 *   npm run vercel:update-content   — the Vercel database (needs .env.production.local)
 *
 * Safe to run more than once; each fix only changes what still has the old value:
 *   1. the person under the photo in every project inquiry section: MD Iqbal Hasan → Amit Ghosh
 *      (Figma 689:3649), plus the photo's alt text
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const OLD_NAME = 'MD Iqbal Hasan'
const NEW_NAME = 'Amit Ghosh'
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

const swap = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(swap)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'name' && x === OLD_NAME ? NEW_NAME : swap(x)]))
      : v

// 1. inquiry sections (they live in each page's / case study's / service's layout)
for (const collection of ['pages', 'case-studies', 'services'] as const) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0, pagination: false, draft: true })
  for (const doc of docs) {
    const layout = (doc as { layout?: unknown[] }).layout
    if (!layout || !JSON.stringify(layout).includes(`"name":"${OLD_NAME}"`)) continue
    await payload.update({
      collection,
      id: doc.id,
      data: { layout: swap(layout) } as never,
      depth: 0,
      draft: (doc as { _status?: string })._status === 'draft',
      context: ctx(),
    })
    log(`Inquiry person renamed in ${collection} "${(doc as { title?: string; name?: string }).title ?? (doc as { name?: string }).name ?? doc.id}".`)
  }
}
const photos = await payload.find({ collection: 'media', where: { alt: { equals: OLD_NAME } }, limit: 10, depth: 0 })
for (const m of photos.docs) {
  await payload.update({ collection: 'media', id: m.id, data: { alt: NEW_NAME }, depth: 0, context: ctx() })
  log('Photo alt text updated.')
}

log('Done.')
process.exit(0)

/* Amit Ghosh's title: "Founder" (owner, 2026-11-17), not "COO & Co-founder".
 * Rewrites the title wherever it is stored: pages, services, case studies (their copied inquiry
 * card), the header / footer / site settings, and image alt text ("co-founder" → "founder").
 *
 *   npm run founder-title   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: documents without the old title are left alone.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { ctx } from './case-study-create'

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

const fix = (s: string) =>
  s
    .replace(/COO\s*&\s*Co-?founder/g, 'Founder')
    .replace(/\bCo-founder\b/g, 'Founder')
    .replace(/\bco-founder\b/g, 'founder')
const OLD = /COO\s*&\s*Co-?founder|\bco-founder\b/i

/** A copy of `v` with every string fixed; system fields are left out of the update. */
function walk(v: unknown): unknown {
  if (typeof v === 'string') return fix(v)
  if (Array.isArray(v)) return v.map(walk)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
  return v
}
const SYSTEM = new Set(['id', 'createdAt', 'updatedAt', '_status', '_order', 'slug'])
function changes(doc: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(doc)) {
    if (SYSTEM.has(k)) continue
    if (OLD.test(JSON.stringify(v ?? ''))) data[k] = walk(v)
  }
  return data
}

for (const collection of ['pages', 'services', 'case-studies'] as const) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0, pagination: false, draft: true })
  for (const doc of docs as unknown as Record<string, unknown>[]) {
    const data = changes(doc)
    if (!Object.keys(data).length) continue
    await payload.update({
      collection,
      id: doc.id as number,
      data,
      depth: 0,
      draft: doc._status === 'draft',
      context: ctx(),
    })
    log(`${collection}: updated "${doc.title ?? doc.slug}" (${Object.keys(data).join(', ')}).`)
  }
}

for (const slug of ['header', 'footer', 'site-settings'] as const) {
  try {
    const doc = (await payload.findGlobal({ slug: slug as 'header', depth: 0 })) as unknown as Record<string, unknown>
    const data = changes(doc)
    if (!Object.keys(data).length) continue
    await payload.updateGlobal({ slug: slug as 'header', data, depth: 0, context: ctx() })
    log(`global ${slug}: updated (${Object.keys(data).join(', ')}).`)
  } catch {
    // a global with another slug: nothing to fix there
  }
}

const media = await payload.find({ collection: 'media', where: { alt: { like: 'co-founder' } }, limit: 200, depth: 0, pagination: false })
for (const m of media.docs) {
  if (!m.alt || !OLD.test(m.alt)) continue
  await payload.update({ collection: 'media', id: m.id, data: { alt: fix(m.alt) }, depth: 0, context: ctx() })
  log(`media: alt "${m.alt}" → "${fix(m.alt)}".`)
}

log('Done.')
process.exit(0)

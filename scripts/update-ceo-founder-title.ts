/* Amit Ghosh's title: "CEO & Founder" (owner, 2026-11-25). The earlier step set it to "Founder";
 * this sets every card role and the About story line to "CEO & Founder".
 *
 *   npm run ceo-title   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: anything that already says "CEO & Founder" is left alone.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { ctx } from './case-study-create'

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)
const TITLE = 'CEO & Founder'

const OLD_ROLE = /^(Founder|COO\s*&\s*Co-?founder)$/i

/** Fixes Amit's card ({ name: "Amit Ghosh", role: "Founder" }) and "Amit Ghosh, Founder," in text.
 *  Other people (e.g. a client contact who is a founder) are left alone. */
function walk(v: unknown): unknown {
  if (typeof v === 'string') return v.replace(/Amit Ghosh, (Founder|COO\s*&\s*Co-?founder),/g, `Amit Ghosh, ${TITLE},`)
  if (Array.isArray(v)) return v.map(walk)
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    const isAmit = typeof o.name === 'string' && o.name.trim() === 'Amit Ghosh'
    return Object.fromEntries(
      Object.entries(o).map(([k, x]) => [k, isAmit && k === 'role' && typeof x === 'string' && OLD_ROLE.test(x.trim()) ? TITLE : walk(x)]),
    )
  }
  return v
}
const SYSTEM = new Set(['id', 'createdAt', 'updatedAt', '_status', '_order', 'slug'])
function changes(doc: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(doc)) {
    if (SYSTEM.has(k)) continue
    const next = walk(v)
    if (JSON.stringify(next) !== JSON.stringify(v)) data[k] = next
  }
  return data
}

for (const collection of ['pages', 'services', 'case-studies'] as const) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0, pagination: false, draft: true })
  for (const doc of docs as unknown as Record<string, unknown>[]) {
    const data = changes(doc)
    if (!Object.keys(data).length) continue
    await payload.update({ collection, id: doc.id as number, data, depth: 0, draft: doc._status === 'draft', context: ctx() })
    log(`${collection}: updated "${doc.title ?? doc.slug}" (${Object.keys(data).join(', ')}).`)
  }
}

log('Done.')
process.exit(0)

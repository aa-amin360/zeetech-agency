/* Real Fiverr reviews replace the template testimonials.
 *   1. adds the reviews in scripts/fiverr-reviews.data.ts (one stays a draft, see `hidden`)
 *   2. unpublishes the template testimonials (Andrew Baker, Marcus Vance): kept, not deleted
 *   3. home "Proof" section: the featured review becomes the big quote
 *   4. every "Client stories" section that hand-picked only template testimonials now shows all
 *      published ones (so new reviews appear by themselves)
 *
 *   npm run fiverr-reviews   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: reviews that already exist (same name) are not added again.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import { generateKeyBetween } from 'payload/shared'
import config from '../src/payload.config'
import { ctx, mediaFrom } from './case-study-create'
import { FIVERR_PROFILE, FIVERR_REVIEWS, TEMPLATE_TESTIMONIALS } from './fiverr-reviews.data'

const PHOTOS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../legacy/assets/testimonials')
const payload = await getPayload({ config })
const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id: number }).id : (v as number | null | undefined))
const log = (msg: string) => payload.logger.info(msg)

const all = await payload.find({ collection: 'testimonials', limit: 500, depth: 0, pagination: false, draft: true, sort: '_order' })
const templates = all.docs.filter((t) => TEMPLATE_TESTIMONIALS.includes(t.name))
const templateIds = new Set(templates.map((t) => t.id))

// the Fiverr logo chip the template review used
const fiverrLogo = idOf(all.docs.find((t) => t.source?.platform === 'fiverr' && t.source?.logo)?.source?.logo)

// 1. the reviews, before every existing testimonial in the admin order
const firstOrder = (all.docs[0] as { _order?: string } | undefined)?._order ?? null
let before: string | null = firstOrder
const keys: string[] = []
for (let i = 0; i < FIVERR_REVIEWS.length; i++) {
  before = generateKeyBetween(null, before)
  keys.unshift(before)
}
const ids: Record<string, number> = {}
for (const [i, r] of FIVERR_REVIEWS.entries()) {
  const photo = r.photo ? await mediaFrom(payload, PHOTOS, r.photo[0], r.photo[1]) : undefined
  const found = all.docs.find((t) => t.name === r.name || t.name === r.username)
  if (found) {
    ids[r.name] = found.id as number
    // added earlier under the username: now the real name, title and photo
    if (found.name !== r.name) {
      await payload.update({
        collection: 'testimonials',
        id: found.id,
        data: { name: r.name, role: r.role, company: r.company, ...(photo ? { photo } : {}) } as never,
        depth: 0,
        context: ctx(),
      })
      log(`Updated the review from ${r.username}: now shown as ${r.name}.`)
    }
    continue
  }
  const doc = await payload.create({
    collection: 'testimonials',
    data: {
      _status: r.hidden ? 'draft' : 'published',
      _order: keys[i],
      name: r.name,
      company: r.company,
      role: r.role,
      quote: r.quote,
      ...(photo ? { photo } : {}),
      type: 'text',
      source: {
        platform: 'fiverr',
        rating: r.rating,
        reviewUrl: FIVERR_PROFILE,
        ...(fiverrLogo ? { logo: fiverrLogo } : {}),
      },
      featured: Boolean(r.featured),
      origin: 'admin',
      consent: false,
    } as never,
    draft: Boolean(r.hidden),
    context: ctx(),
  })
  ids[r.name] = doc.id as number
  log(`Added Fiverr review from ${r.name}${r.hidden ? ` as a draft (${r.hidden})` : ''}.`)
}

// 2. template testimonials: unpublished
for (const t of templates) {
  if (t._status !== 'published') continue
  await payload.update({ collection: 'testimonials', id: t.id, data: { _status: 'draft', featured: false }, depth: 0, context: ctx() })
  log(`Unpublished the template testimonial "${t.name}".`)
}

// 3 + 4. pages, services and case studies
const featured = FIVERR_REVIEWS.find((r) => r.featured)
const featuredId = featured ? ids[featured.name] : undefined
for (const collection of ['pages', 'services', 'case-studies'] as const) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0, pagination: false, draft: true })
  for (const doc of docs as unknown as { id: number; title?: string; slug?: string; _status?: string; layout?: Record<string, unknown>[] }[]) {
    let changed = false
    const layout = (doc.layout ?? []).map((b) => {
      if (b.blockType === 'proofStats' && featuredId && (b.testimonial == null || templateIds.has(idOf(b.testimonial)!))) {
        changed = true
        return { ...b, testimonial: featuredId }
      }
      if (b.blockType === 'clientStories') {
        const picked = ((b.testimonials as unknown[]) ?? []).map(idOf)
        if (picked.length && picked.every((id) => id != null && templateIds.has(id))) {
          changed = true
          return { ...b, testimonials: [] }
        }
      }
      return b
    })
    if (!changed) continue
    await payload.update({ collection, id: doc.id, data: { layout } as never, depth: 0, draft: doc._status === 'draft', context: ctx() })
    log(`${collection}: "${doc.title ?? doc.slug}" now uses the real reviews.`)
  }
}

log('Done.')
process.exit(0)

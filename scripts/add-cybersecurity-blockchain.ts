/* Adds the "Cybersecurity & blockchain" service to a site that already has the other services.
 * The Vercel build runs it once by itself (scripts/deploy-steps.mjs); locally:
 *
 *   npm run cyber-blockchain
 *
 * Safe to run more than once; each step only happens if it hasn't already:
 *   1. creates the service (pictures, deliverables, process, questions, inquiry form) as published
 *   2. Services page: "Six disciplines." → "Seven disciplines." in the list's label (if not edited),
 *      and adds the service to the list when an editor has picked the services by hand
 *   3. footer: adds "Cybersecurity & Blockchain" to the services column, linked to its page
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { SERVICES } from './services-page.data'
import { ctx, ensureService, homeSections } from './service-create'

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

const service = SERVICES.find((s) => s.icon === 'shield-check')!
const { slug } = await ensureService(payload, service, await homeSections(payload))
const href = `/services/${slug}`
const doc = (await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })).docs[0]

// 2. the Services page
const page = (await payload.find({ collection: 'pages', where: { slug: { equals: 'services' } }, limit: 1, depth: 0, draft: true })).docs[0]
if (page) {
  let changed = false
  const layout = structuredClone(page.layout ?? [])
  for (const block of layout) {
    if (block.blockType !== 'servicesList') continue
    if (block.eyebrow?.startsWith('Six disciplines.')) {
      block.eyebrow = block.eyebrow.replace('Six disciplines.', 'Seven disciplines.')
      changed = true
    }
    const picked = (block.services ?? []) as (number | { id: number })[]
    const ids = picked.map((p) => (typeof p === 'object' ? p.id : p))
    if (doc && ids.length && !ids.includes(doc.id as number)) {
      block.services = [...ids, doc.id as number]
      changed = true
    }
  }
  if (changed) {
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout },
      depth: 0,
      draft: page._status === 'draft',
      context: ctx(),
    })
    log('Services page list updated for the new service.')
  }
}

// 3. footer link
type FooterLink = { link?: { label?: string | null; href?: string | null } | null }
type Column = { title?: string | null; links?: FooterLink[] | null }
const footer = await payload.findGlobal({ slug: 'footer', depth: 0 })
const columns = ((footer as { columns?: Column[] }).columns ?? []) as Column[]
const servicesColumn = columns.find((c) => c.title?.trim().toLowerCase() === 'services')
const hasLink = JSON.stringify(footer).includes(`"href":"${href}"`)
if (servicesColumn && !hasLink) {
  servicesColumn.links = [...(servicesColumn.links ?? []), { link: { label: 'Cybersecurity & Blockchain', href } }]
  await payload.updateGlobal({ slug: 'footer', data: { columns } as never, depth: 0, context: ctx() })
  log('Footer: added "Cybersecurity & Blockchain" to the services column.')
}

log('Done.')
process.exit(0)

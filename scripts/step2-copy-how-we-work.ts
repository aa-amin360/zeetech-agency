/* Marlin's review, step 2 (PROJECT-TRACKER.md M-R1, M-R6, M-R7, M-R11):
 *   1. service pages: process and questions no longer end in a "handoff" (M-R1)
 *   2. Cybersecurity & blockchain: security first, blockchain where it fits (M-R6), also on home
 *   3. positioning line in the home hero and the About intro (M-R7)
 *   4. home stats: the "Metric pending verification" note removed (owner, 2026-11-26)
 *   4b. project inquiry budgets: "$5k - $20k" → "$5k - $10k" (overlapped "$10k - $20k")
 *   5. new page /how-we-work ("How a project runs", M-R11), linked from the header and footer
 *
 *   npm run step2-content   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once. Text is only replaced while the old wording is still there.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { ctx } from './case-study-create'
import {
  BUDGET_FIX,
  HOME_CYBER,
  HOW_INTRO_IMAGE,
  HOW_LINK,
  HOW_PAGE,
  HOW_SECTIONS,
  NEW_LEDE,
  OLD_LEDE,
  PROCESS_ACCENT,
  SERVICE_CHANGES,
  STATS_NOTE,
} from './how-we-work.data'

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

/** Splits "process[3].title" into ["process", 3, "title"]. */
const keys = (path: string) => path.split(/\.|\[(\d+)\]/).filter(Boolean).map((k) => (/^\d+$/.test(k) ? Number(k) : k))
const get = (obj: unknown, path: string) => keys(path).reduce<unknown>((o, k) => (o as Record<string | number, unknown>)?.[k], obj)
function set(obj: unknown, path: string, value: unknown) {
  const ks = keys(path)
  const parent = ks.slice(0, -1).reduce<unknown>((o, k) => (o as Record<string | number, unknown>)?.[k], obj)
  if (parent && typeof parent === 'object') (parent as Record<string | number, unknown>)[ks.at(-1)!] = value
}
/** Same text, ignoring a trailing full stop and spacing differences. */
const same = (a: unknown, b: string) => typeof a === 'string' && a.trim().replace(/\.$/, '') === b.trim().replace(/\.$/, '')

/** A deep copy with every string equal to `from` replaced by `to`. */
function replaceAll(v: unknown, from: string, to: string): unknown {
  if (typeof v === 'string') return same(v, from) ? to : v
  if (Array.isArray(v)) return v.map((x) => replaceAll(x, from, to))
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replaceAll(x, from, to)]))
  return v
}
const strip = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(strip)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, strip(x)]))
      : v

// 1 + 2. service pages
const services = await payload.find({ collection: 'services', limit: 100, depth: 0, pagination: false, draft: true })
for (const doc of services.docs as unknown as Record<string, unknown>[]) {
  const data = structuredClone(doc)
  const done: string[] = []
  if (same(get(data, 'processHeading.accent'), PROCESS_ACCENT.from)) {
    set(data, 'processHeading.accent', PROCESS_ACCENT.to)
    done.push('processHeading.accent')
  }
  for (const c of SERVICE_CHANGES[doc.slug as string] ?? []) {
    if (!same(get(data, c.path), c.from)) continue
    set(data, c.path, c.to)
    done.push(c.path)
  }
  const layout = replaceAll(data.layout, BUDGET_FIX.from, BUDGET_FIX.to)
  if (JSON.stringify(layout) !== JSON.stringify(data.layout)) done.push('budgets')
  if (!done.length) continue
  const changed: Record<string, unknown> = {}
  for (const top of new Set(done.map((p) => (p === 'budgets' ? 'layout' : String(keys(p)[0]))))) {
    changed[top] = top === 'layout' ? layout : data[top]
  }
  await payload.update({ collection: 'services', id: doc.id as number, data: changed, depth: 0, draft: doc._status === 'draft', context: ctx() })
  log(`Service "${doc.slug}": ${done.join(', ')}.`)
}

// 2 + 3 + 4. pages and case studies: hero/About positioning, home row 07, budgets
for (const collection of ['pages', 'case-studies'] as const) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0, pagination: false, draft: true })
  for (const doc of docs as unknown as Record<string, unknown>[]) {
    let layout = replaceAll(doc.layout, BUDGET_FIX.from, BUDGET_FIX.to)
    layout = replaceAll(layout, OLD_LEDE, NEW_LEDE)
    layout = replaceAll(layout, HOME_CYBER.from, HOME_CYBER.to)
    layout = replaceAll(layout, STATS_NOTE, '')
    if (JSON.stringify(layout) === JSON.stringify(doc.layout)) continue
    await payload.update({
      collection,
      id: doc.id as number,
      data: { layout } as never,
      depth: 0,
      draft: doc._status === 'draft',
      context: ctx(),
    })
    log(`${collection}: updated "${doc.title ?? doc.slug}".`)
  }
}

// 5. the How we work page
const existing = await payload.find({ collection: 'pages', where: { slug: { equals: HOW_PAGE.slug } }, limit: 1, depth: 0, draft: true })
if (!existing.docs.length) {
  const image = await payload.find({ collection: 'media', where: { alt: { equals: HOW_INTRO_IMAGE } }, limit: 1, depth: 0 })
  if (!image.docs[0]) throw new Error(`Picture "${HOW_INTRO_IMAGE}" not found — run the project screen scripts first.`)
  // the inquiry form from the home page, like the other pages
  const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  const inquiry = (home.docs[0]?.layout ?? []).filter((b) => b.blockType === 'projectInquiry').slice(0, 1).map(strip)
  const layout = HOW_SECTIONS.map((s) => {
    const block = structuredClone(s) as Record<string, unknown>
    if (block.blockType === 'pageIntro') block.image = image.docs[0].id
    return block
  })
  // the inquiry form replaces the closing band when there is one (it already asks to start a project)
  const sections = inquiry.length ? [...layout.filter((b) => b.blockType !== 'contactBand'), ...inquiry] : layout
  await payload.create({
    collection: 'pages',
    data: { ...HOW_PAGE, layout: sections as never, _status: 'published' },
    context: ctx(),
  })
  log('Created the How we work page.')
}

// 5. menu links, after "Services"
type Link = { link?: { label?: string; href?: string } }
const addAfterServices = (links: Link[]) => {
  if (links.some((l) => l.link?.href === HOW_LINK.href)) return null
  const i = links.findIndex((l) => l.link?.href === '/services')
  const next = [...links]
  next.splice(i >= 0 ? i + 1 : next.length, 0, { link: { ...HOW_LINK } })
  return next
}
const header = (await payload.findGlobal({ slug: 'header', depth: 0 })) as unknown as { links?: Link[] }
const headerLinks = addAfterServices(header.links ?? [])
if (headerLinks && headerLinks.length <= 6) {
  await payload.updateGlobal({ slug: 'header', data: { links: strip(headerLinks) } as never, depth: 0, context: ctx() })
  log('Added "How We Work" to the header.')
}
const footer = (await payload.findGlobal({ slug: 'footer', depth: 0 })) as unknown as { columns?: { title: string; links?: Link[] }[] }
const columns = footer.columns ?? []
const col = columns.findIndex((c) => (c.links ?? []).some((l) => l.link?.href === '/services'))
if (col >= 0) {
  const links = addAfterServices(columns[col].links ?? [])
  if (links) {
    const next = columns.map((c, i) => (i === col ? { ...c, links } : c))
    await payload.updateGlobal({ slug: 'footer', data: { columns: strip(next) } as never, depth: 0, context: ctx() })
    log('Added "How We Work" to the footer.')
  }
}

log('Done.')
process.exit(0)

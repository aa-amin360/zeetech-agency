/* Sets up the Our Work page (Figma 599:812) on a site that was created before it existed.
 *
 *   npm run work            — local database
 *   npm run vercel:work     — the Vercel database + Blob (needs .env.production.local)
 *
 * Safe to run more than once; each step only happens if it hasn't already:
 *   1. adds the six projects from the design (with their covers) as published case studies
 *   2. removes the starter case studies ("Real-Time Dispatch & Telematics Platform")
 *   3. creates the "Work" page: hero, project grid, then the FAQ, project inquiry and client
 *      stories sections copied from the home page
 *   4. points the "Our Work" menu links (header and footer) at /work instead of /#work
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { PLACEHOLDER_TITLE, WORK_HERO, WORK_PROJECTS } from './work-page.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(dirname, '../legacy/assets/work')
// a fresh object per call: the Blob storage plugin marks the context it was given
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

/** The upload with this alt text, or a new one from legacy/assets/work. */
async function media(file: string, alt: string) {
  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  if (found.docs[0]) return found.docs[0].id as number
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(DIR, file), context: ctx() })
  return doc.id as number
}

// 1. the six projects
for (const [i, p] of WORK_PROJECTS.entries()) {
  const exists = await payload.find({ collection: 'case-studies', where: { slug: { equals: p.slug } }, limit: 1, depth: 0 })
  if (exists.docs.length) continue
  const { cover, ...data } = p
  await payload.create({
    collection: 'case-studies',
    data: {
      ...data,
      projectLabel: `Project ${String(i + 1).padStart(2, '0')}`,
      scope: p.service,
      cover: await media(cover, `${p.client} — ${p.titleAccent}`),
      _status: 'published',
    },
    context: ctx(),
  })
  log(`Added the case study "${p.title} ${p.titleAccent}".`)
}

// 2. the starter case studies, once all six are in place
const starters = await payload.find({
  collection: 'case-studies',
  where: { title: { equals: PLACEHOLDER_TITLE } },
  limit: 100,
  depth: 0,
  draft: true,
})
if (starters.docs.length) {
  const ids = new Set(starters.docs.map((d) => d.id))
  // drop them from any "Selected work" section first (empty = the latest five projects)
  const pages = await payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false, draft: true })
  for (const page of pages.docs) {
    let changed = false
    const layout = (page.layout ?? []).map((b) => {
      if (b.blockType !== 'selectedWork' && b.blockType !== 'workGrid') return b
      const list = (b.caseStudies ?? []).map((c) => (typeof c === 'object' ? c.id : c))
      const kept = list.filter((id) => !ids.has(id))
      if (kept.length === list.length) return b
      changed = true
      return { ...b, caseStudies: kept }
    })
    if (changed) await payload.update({ collection: 'pages', id: page.id, data: { layout }, depth: 0, context: ctx() })
  }
  for (const d of starters.docs) await payload.delete({ collection: 'case-studies', id: d.id, context: ctx() })
  log(`Removed ${starters.docs.length} starter case studies.`)
}

// 3. the Work page
const work = await payload.find({ collection: 'pages', where: { slug: { equals: 'work' } }, limit: 1, depth: 0, draft: true })
if (!work.docs.length) {
  const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  // copies of the home page's sections, without their ids (each block row needs its own)
  const strip = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(strip)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, strip(x)]))
        : v
  const fromHome = (type: string) =>
    (home.docs[0]?.layout ?? []).filter((b) => b.blockType === type).slice(0, 1).map(strip)

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Work',
      slug: 'work',
      layout: [
        {
          blockType: 'workHero',
          title: WORK_HERO.title,
          highlight: WORK_HERO.highlight,
          background: await media(WORK_HERO.background, 'Work page hero — blossom valley'),
        },
        { blockType: 'workGrid', allLabel: 'All Projects' },
        ...fromHome('faq'),
        ...fromHome('projectInquiry'),
        ...fromHome('clientStories'),
      ] as never,
      meta: {
        title: 'Our Work — ZeeTech',
        description:
          'Case studies from ZeeTech: SaaS platforms, dashboards, Webflow sites and brand identities — designed and built for teams shipping what comes next.',
      },
      _status: 'published',
    },
    context: ctx(),
  })
  log('Created the Work page.')
}

// 4. "Our Work" in the menus goes to the new page
for (const slug of ['header', 'footer'] as const) {
  const g = await payload.findGlobal({ slug, depth: 0 })
  const json = JSON.stringify(g)
  if (!json.includes('"href":"/#work"')) continue
  const data = JSON.parse(json.replaceAll('"href":"/#work"', '"href":"/work"'))
  delete data.id
  delete data.updatedAt
  delete data.createdAt
  await payload.updateGlobal({ slug, data, depth: 0, context: ctx() })
  log(`"Our Work" in the ${slug} now opens /work.`)
}

log('Done.')
process.exit(0)

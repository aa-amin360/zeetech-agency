/* Adds the Nexus Courier case study (the first real project), published, as Project 01.
 *
 *   npm run nexus-courier   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: it does nothing if the case study already exists. When it adds it:
 *   1. creates the case study, published
 *   2. puts it first: before every other project in the admin order (Work page, Selected work,
 *      related projects) and at the front of any hand-picked Selected work / Work grid list
 *   3. renumbers the other projects' labels (Project 01 → Project 02, …)
 * The story text comes from content/projects/nexus-courier.md (its "## Story" section) and the
 * pictures from legacy/assets/work/nexus-courier. They are illustrations, not screenshots.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import { generateKeyBetween } from 'payload/shared'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '../src/payload.config'

const SLUG = 'nexus-courier-logistics-platform'
const dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(dirname, '../legacy/assets/work/nexus-courier')
const COPY = path.resolve(dirname, '../content/projects/nexus-courier.md')
// a fresh object per call: the Blob storage plugin marks the context it was given
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

const exists = await payload.find({
  collection: 'case-studies',
  where: { slug: { equals: SLUG } },
  limit: 1,
  depth: 0,
  draft: true,
})
if (exists.docs.length) {
  log('Nexus Courier is already there; nothing to do.')
  process.exit(0)
}

/** The upload with this alt text, or a new one from legacy/assets/work/nexus-courier. */
async function media(file: string, alt: string, focal?: { x: number; y: number }) {
  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  if (found.docs[0]) return found.docs[0].id as number
  const doc = await payload.create({
    collection: 'media',
    data: { alt, ...(focal ? { focalX: focal.x, focalY: focal.y } : {}) },
    filePath: path.join(DIR, file),
    context: ctx(),
  })
  return doc.id as number
}

// the story: everything under "## Story" up to the next "---" rule; ### headings become the page's h2s
const md = fs.readFileSync(COPY, 'utf8').replace(/\r\n/g, '\n')
const story = md.split('\n## Story')[1]?.split('\n---')[0]
if (!story) throw new Error(`No "## Story" section found in ${COPY}`)
/** Joins wrapped lines of the same paragraph or quote (the converter drops the space between them). */
function unwrap(text: string) {
  const out: string[] = []
  const kind = (l: string) => (l.trim() === '' || /^(#|- |\d+\. )/.test(l) ? 'block' : l.startsWith('>') ? 'quote' : 'text')
  for (const line of text.split('\n')) {
    const prev = out.at(-1)
    const k = kind(line)
    const body = line.replace(/^>\s?/, '')
    // a continuation: same kind as the previous line, which is not a heading/list/blank line, and not an empty "> " line
    if (prev !== undefined && k !== 'block' && kind(prev) === k && body.trim() && prev.replace(/^>\s?/, '').trim()) {
      out[out.length - 1] = `${prev} ${body}`
    } else out.push(line)
  }
  return out.join('\n')
}
const markdown = unwrap(
  story
    .replace(/^.*\n/, '') // the rest of the "## Story (…)" heading line
    .replace(/^### (.*)$/gm, '## $1\n'), // page h2s, with a blank line after each
).trim()
const editorConfig = await editorConfigFactory.default({ config: payload.config })
const body = convertMarkdownToLexical({ editorConfig, markdown })

// end-of-page sections copied from the home page, like the other case studies
const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
const strip = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(strip)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, strip(x)]))
      : v
const fromHome = (type: string) =>
  (home.docs[0]?.layout ?? []).filter((b) => b.blockType === type).slice(0, 1).map(strip)

log('Uploading the Nexus Courier illustrations…')
const cover = await media('cover.webp', 'Nexus Courier: illustration of the admin dashboard, shipment timeline and QR label')
const gallery = [
  await media('admin.webp', 'Nexus Courier: illustration of the admin operations overview'),
  await media('client.webp', 'Nexus Courier: illustration of the client delivery request, QR label and public tracking'),
  await media('tracking.webp', 'Nexus Courier: illustration of the service-area map, chain-of-custody timeline and proof of delivery'),
  await media('hubs.webp', 'Nexus Courier: illustration of hub-and-spoke sorting, delivery runs and driver transfers'),
]

// 2. an order key before the current first project
const first = await payload.find({ collection: 'case-studies', sort: '_order', limit: 1, depth: 0, draft: true })
const firstOrder = (first.docs[0] as { _order?: string } | undefined)?._order ?? null
const others = await payload.find({ collection: 'case-studies', limit: 500, depth: 0, pagination: false, draft: true })

// 1. the case study
const created = await payload.create({
  collection: 'case-studies',
  data: {
    _status: 'published',
    _order: generateKeyBetween(null, firstOrder),
    title: 'Nexus Courier —',
    titleAccent: 'Logistics Operations Platform',
    slug: SLUG,
    service: 'Web platform development',
    industry: 'Logistics',
    projectLabel: 'Project 01',
    client: 'Nexus Courier',
    color: '#27d4f2',
    summary:
      'An enterprise courier platform connecting clients, dispatchers and drivers. We built its admin and corporate client dashboards.',
    scope: 'Admin dashboard · Corporate client dashboard · Order management & tracking · Role-based navigation',
    duration: '6 months',
    // status left empty on purpose: the owner prefers not to say whether it is live
    tags: ['Admin dashboard', 'Client dashboard', 'Enterprise SaaS', 'Workflow automation', 'Next.js'],
    cover,
    body: body as never,
    gallery,
    layout: [...fromHome('projectInquiry'), ...fromHome('clientStories')] as never,
    meta: {
      title: 'Nexus Courier: enterprise logistics platform case study | ZeeTech',
      description:
        'How ZeeTech built the admin and client dashboards for Nexus Courier, a multi-tenant platform for courier dispatch, parcel tracking and proof of delivery.',
      image: cover,
    },
  } as never,
  context: ctx(),
})
log('Added Nexus Courier (published, first in the project order).')

// 2. front of any hand-picked project list (an empty list already follows the order above)
const pages = await payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false, draft: true })
for (const page of pages.docs) {
  let changed = false
  const layout = (page.layout ?? []).map((b) => {
    if (b.blockType !== 'selectedWork' && b.blockType !== 'workGrid') return b
    const list = (b.caseStudies ?? []).map((c) => (typeof c === 'object' ? c.id : c))
    if (!list.length || list.includes(created.id)) return b
    changed = true
    return { ...b, caseStudies: [created.id, ...list] }
  })
  if (changed) {
    await payload.update({ collection: 'pages', id: page.id, data: { layout }, depth: 0, context: ctx() })
    log(`Nexus Courier is first in the project list on "${page.title}".`)
  }
}

// 3. the other projects move down one number
for (const s of others.docs) {
  const n = /^Project (\d+)$/.exec(s.projectLabel ?? '')?.[1]
  if (!n) continue
  const projectLabel = `Project ${String(Number(n) + 1).padStart(2, '0')}`
  await payload.update({ collection: 'case-studies', id: s.id, data: { projectLabel }, depth: 0, context: ctx() })
}
log(`Renumbered ${others.docs.length} other projects.`)
process.exit(0)

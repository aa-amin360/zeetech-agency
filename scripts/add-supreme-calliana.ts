/* Adds two real projects, published: Supreme Prospects (Project 02) and Calliana (Project 03).
 *
 *   npm run supreme-calliana   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: a project that already exists is skipped. When it adds them:
 *   1. creates each case study, published, with its story from content/projects/<name>.md and
 *      its pictures (illustrations, not screenshots) from legacy/assets/work/<name>/
 *   2. places them right after Nexus Courier in the admin order (Work page, Selected work)
 *   3. renumbers the "Project NN" labels to follow that order
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import { generateKeyBetween } from 'payload/shared'
import config from '../src/payload.config'
import { ctx, endSections, mediaFrom, renumberProjects, storyFromCopy } from './case-study-create'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
const AFTER = 'nexus-courier-logistics-platform' // the new projects follow this one

type Project = {
  slug: string
  folder: string
  data: Record<string, unknown>
  cover: [file: string, alt: string]
  gallery: [file: string, alt: string][]
}

const PROJECTS: Project[] = [
  {
    slug: 'supreme-prospects-athletic-recruitment-platform',
    folder: 'supreme-prospects',
    data: {
      title: 'Supreme Prospects —',
      titleAccent: 'Athletic Recruitment Platform',
      client: 'Supreme Prospects',
      service: 'Platform architecture & development',
      industry: 'Sports Tech',
      color: '#22c55e',
      summary:
        'A multi-tenant recruitment platform for athletes, parents, scouts, coaches and compliance staff, with recruiting rules built into every message.',
      scope: 'Six role portals · Compliance & messaging engine · Talent scoring pipeline · Mobile field grading',
      tags: ['Multi-tenant SaaS', '6 role portals', 'Compliance engine', 'Talent scoring', 'Next.js'],
      meta: {
        title: 'Supreme Prospects: athletic recruitment platform case study | ZeeTech',
        description:
          'How ZeeTech built a multi-tenant recruitment platform with six role portals, a talent scoring engine and recruiting-compliance rules built into messaging.',
      },
    },
    cover: ['cover.webp', 'Supreme Prospects: illustration of prospect search, talent score, dead-period message lock and field grading'],
    gallery: [
      ['search.webp', 'Supreme Prospects: illustration of talent search with tiers and a comparison heat-map'],
      ['compliance.webp', 'Supreme Prospects: illustration of the recruiting calendar, three-way messaging and audit trail'],
      ['grading.webp', 'Supreme Prospects: illustration of the rubric builder and mobile field grading'],
      ['portals.webp', 'Supreme Prospects: illustration of the six role portals'],
    ],
  },
  {
    slug: 'calliana-virtual-receptionist-call-platform',
    folder: 'calliana',
    data: {
      title: 'Calliana —',
      titleAccent: 'Virtual Receptionist Call Platform',
      client: 'Calliana',
      service: 'Product design & full-stack development',
      industry: 'Customer Service',
      color: '#ff8db7',
      duration: '3 months',
      summary:
        'A browser-based call workspace for virtual receptionists: caller ID, client context, scripts, calendars and voicemail in one place.',
      scope: 'Agent call workspace · Client portal · Admin panel · Scripts, calendar, voicemail & messaging',
      tags: ['Call workspace (CTI)', 'VoIP integration', 'Agent, client & admin portals', 'React & Node.js', 'PostgreSQL'],
      meta: {
        title: 'Calliana: virtual receptionist call platform case study | ZeeTech',
        description:
          'How ZeeTech designed and built Calliana, a call workspace for virtual receptionists with agent, client and admin portals, scripts, calendars, voicemail and messaging.',
      },
    },
    // real product screens (shared by the owner), framed; the cover is Calliana's logo banner
    cover: ['cover.webp', 'Calliana logo'],
    gallery: [
      ['signin.webp', 'Calliana sign-in page'],
      ['agent-dashboard.webp', 'Calliana agent dashboard with a live inbound call and today’s schedule'],
      ['live-call.webp', 'Calliana live call workspace: caller profile, client instructions, call notes, categories and scripts'],
      ['client-portal.webp', 'Calliana client portal: inbound calls, upcoming appointments and conversations'],
      ['admin-overview.webp', 'Calliana admin overview: live calls, agent availability and the audit trail'],
      ['light-dark.webp', 'Calliana agent dashboard in light and dark mode'],
    ],
  },
]

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

const orderOf = (d: unknown) => (d as { _order?: string } | undefined)?._order ?? null
let added = 0
for (const p of PROJECTS) {
  const exists = await payload.find({ collection: 'case-studies', where: { slug: { equals: p.slug } }, limit: 1, depth: 0, draft: true })
  if (exists.docs.length) {
    log(`${p.data.client} is already there.`)
    continue
  }

  // right after the previous real project (Nexus Courier, then Supreme Prospects), before the rest
  const idx = PROJECTS.indexOf(p)
  const all = await payload.find({ collection: 'case-studies', sort: '_order', limit: 500, depth: 0, pagination: false, draft: true })
  const find = (slug: string) => all.docs.findIndex((d) => d.slug === slug)
  let i = idx > 0 ? find(PROJECTS[idx - 1].slug) : -1
  if (i < 0) i = find(AFTER)
  const before = i >= 0 ? orderOf(all.docs[i]) : null
  const after = i >= 0 ? orderOf(all.docs[i + 1]) : orderOf(all.docs[0])

  const dir = path.join(root, 'legacy/assets/work', p.folder)
  const cover = await mediaFrom(payload, dir, ...p.cover)
  const gallery = []
  for (const g of p.gallery) gallery.push(await mediaFrom(payload, dir, ...g))

  await payload.create({
    collection: 'case-studies',
    data: {
      ...p.data,
      _status: 'published',
      _order: generateKeyBetween(before, after),
      slug: p.slug,
      cover,
      gallery,
      body: (await storyFromCopy(payload, path.join(root, 'content/projects', `${p.folder}.md`))) as never,
      layout: (await endSections(payload)) as never,
      meta: { ...(p.data.meta as object), image: cover },
    } as never,
    context: ctx(),
  })
  log(`Added ${p.data.client} (published).`)
  added++
}

if (added) {
  await renumberProjects(payload)
  log('Project numbers follow the admin order again.')
}
log('Done.')
process.exit(0)

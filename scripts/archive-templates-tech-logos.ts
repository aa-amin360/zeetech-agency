/* Marlin's review, step 1 (PROJECT-TRACKER.md, M-R2 / M-R4):
 *   1. archives the six template projects: they become drafts, so visitors no longer see them
 *      (Work page, Selected work, related projects, sitemap, their own pages), but nothing is deleted:
 *      each one can be brought back with "Publish" in the admin
 *   2. swaps the home page logo strip from client brands ZeeTech never worked for to the
 *      technologies used on the real projects, with a matching title
 *   3. replaces the home Selected work note "Sample cases — client names pending approval" (no longer
 *      true: only real projects are shown) with a line about the real work
 *
 *   npm run step1-content   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: published templates are archived, a logo strip that already shows the
 * tech logos is left as it is.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { ctx, mediaFrom } from './case-study-create'
import { TECH_LOGOS, TECH_LOGOS_TITLE } from './tech-logos.data'

const TEMPLATE_SLUGS = [
  'landify-real-estate-platform',
  'unifyiq-sales-management-saas',
  'klyro-studio-agency-template',
  'crimino-crm-dashboard',
  'zapmail-ai-cold-email-platform',
  'astrix-builders-brand-identity',
]

const dirname = path.dirname(fileURLToPath(import.meta.url))
const TECH_DIR = path.resolve(dirname, '../legacy/assets/tech')

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

// 1. archive the template projects
const templates = await payload.find({
  collection: 'case-studies',
  where: { slug: { in: TEMPLATE_SLUGS } },
  limit: 100,
  depth: 0,
  pagination: false,
  draft: true,
})
for (const s of templates.docs) {
  if (s._status !== 'published') continue
  await payload.update({ collection: 'case-studies', id: s.id, data: { _status: 'draft' }, depth: 0, context: ctx() })
  log(`Archived "${s.client}" (now a draft).`)
}

// 2. tech logos in the home logo strip, 3. the Selected work note
const WORK_NOTE = 'Real platforms we have designed and built, for logistics, sports recruitment and customer service.'
const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
const page = home.docs[0]
if (page && (page.layout ?? []).some((b) => b.blockType === 'selectedWork' && /^Sample cases/i.test(b.note ?? ''))) {
  const layout = (page.layout ?? []).map((b) =>
    b.blockType === 'selectedWork' && /^Sample cases/i.test(b.note ?? '') ? { ...b, note: WORK_NOTE } : b,
  )
  await payload.update({ collection: 'pages', id: page.id, data: { layout }, depth: 0, context: ctx() })
  page.layout = layout
  log('Replaced the "Sample cases" note on Selected work.')
}
const isTech = (b: { title?: string | null }) => b.title === TECH_LOGOS_TITLE
if (page && (page.layout ?? []).some((b) => b.blockType === 'clientLogos' && !isTech(b))) {
  log(`Uploading ${TECH_LOGOS.length} technology logos…`)
  const logos: { name: string; logo: number }[] = []
  for (const { name, file } of TECH_LOGOS) logos.push({ name, logo: await mediaFrom(payload, TECH_DIR, file, `${name} logo`) })
  const layout = (page.layout ?? []).map((b) =>
    b.blockType === 'clientLogos' && !isTech(b) ? { ...b, title: TECH_LOGOS_TITLE, logos } : b,
  )
  await payload.update({ collection: 'pages', id: page.id, data: { layout }, depth: 0, context: ctx() })
  log('Home logo strip now shows the technology logos.')
} else log('Home logo strip already shows the technology logos.')

log('Done.')
process.exit(0)

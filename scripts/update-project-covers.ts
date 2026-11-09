/* Gives the six starter projects (Landify, UnifyIQ, Klyro Studio, Crimino, ZapMail, Astrix Builders)
 * covers that match what each project is about, replacing the unrelated template pictures.
 *
 *   npm run project-covers   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: a project that already has its new cover is skipped, and projects
 * that were deleted in the admin are ignored. The covers are illustrations made from each
 * project's description (source: content/projects/template-covers.html), stored in
 * legacy/assets/work/<name>-cover.webp.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { WORK_PROJECTS } from './work-page.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(dirname, '../legacy/assets/work')
// a fresh object per call: the Blob storage plugin marks the context it was given
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

let changed = 0
for (const p of WORK_PROJECTS) {
  const study = (
    await payload.find({ collection: 'case-studies', where: { slug: { equals: p.slug } }, limit: 1, depth: 1, draft: true })
  ).docs[0]
  if (!study) continue

  const alt = `${p.client}: ${p.titleAccent} (cover illustration)`
  const current = typeof study.cover === 'object' ? study.cover : null
  if (current?.alt === alt) continue

  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  const cover =
    (found.docs[0]?.id as number | undefined) ??
    ((await payload.create({ collection: 'media', data: { alt }, filePath: path.join(DIR, p.cover), context: ctx() })).id as number)

  await payload.update({
    collection: 'case-studies',
    id: study.id,
    data: { cover },
    depth: 0,
    draft: study._status === 'draft',
    context: ctx(),
  })
  log(`New cover for ${p.client}.`)
  changed++
}
log(changed ? `Updated ${changed} project covers.` : 'All project covers are already up to date.')
process.exit(0)

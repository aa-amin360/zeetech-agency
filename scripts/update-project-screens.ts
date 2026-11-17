/* Nexus Courier and Supreme Prospects: replaces the illustrated cover and gallery with the real
 * product screens (scripts/project-screens.data.ts).
 *
 *   npm run project-screens   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: a project whose cover is already the real screen is skipped, and
 * missing projects are ignored. The old illustration uploads stay in Media (unused) until deleted
 * in the admin.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { ctx, mediaFrom } from './case-study-create'
import { NEXUS_SCREENS, SUPREME_SCREENS } from './project-screens.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

for (const p of [NEXUS_SCREENS, SUPREME_SCREENS]) {
  const study = (
    await payload.find({ collection: 'case-studies', where: { slug: { equals: p.slug } }, limit: 1, depth: 1, draft: true })
  ).docs[0]
  if (!study) continue
  const current = typeof study.cover === 'object' ? study.cover : null
  if (current?.alt === p.cover[1]) {
    log(`${study.client}: already shows the real screens.`)
    continue
  }
  const dir = path.resolve(dirname, '../legacy/assets/work', p.folder)
  const cover = await mediaFrom(payload, dir, ...p.cover)
  const gallery: number[] = []
  for (const g of p.gallery) gallery.push(await mediaFrom(payload, dir, ...g))
  await payload.update({
    collection: 'case-studies',
    id: study.id,
    data: { cover, gallery, meta: { ...(study.meta ?? {}), image: cover } } as never,
    depth: 0,
    draft: study._status === 'draft',
    context: ctx(),
  })
  log(`${study.client}: real screens in place (cover + ${gallery.length} gallery images).`)
}
log('Done.')
process.exit(0)

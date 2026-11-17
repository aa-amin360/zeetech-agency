/* Nexus Courier and Supreme Prospects: brand banners (from the owner) as the cover / thumbnail,
 * replacing the sign-in page. Gallery and story are left alone.
 *
 *   npm run project-banners   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: a project that already has its banner is skipped.
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
    log(`${study.client}: banner already in place.`)
    continue
  }
  const cover = await mediaFrom(payload, path.resolve(dirname, '../legacy/assets/work', p.folder), ...p.cover)
  await payload.update({
    collection: 'case-studies',
    id: study.id,
    data: { cover, meta: { ...(study.meta ?? {}), image: cover } } as never,
    depth: 0,
    draft: study._status === 'draft',
    context: ctx(),
  })
  log(`${study.client}: new cover (brand banner).`)
}
log('Done.')
process.exit(0)

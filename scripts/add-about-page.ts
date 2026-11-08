/* Sets up the About Us page (Figma 721:2419) on a site that was created before it existed.
 *
 *   npm run about         — local database
 *   npm run vercel:about  — the Vercel database + Blob (needs .env.production.local)
 *
 * Safe to run more than once; each step only happens if it hasn't already:
 *   1. creates the "About" page at /about from the design's sections and pictures
 *   2. points "About Us" in the header and footer at /about (instead of /#studio)
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { ABOUT_PAGE, ABOUT_SECTIONS } from './about-page.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(dirname, '../legacy/assets/about')
// a fresh object per call: the Blob storage plugin marks the context it was given
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

/** The upload with this alt text, or a new one from legacy/assets/about (focalY: which part stays in view). */
async function media([file, alt, focalY]: readonly [string, string, number?]) {
  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  if (found.docs[0]) return found.docs[0].id as number
  const doc = await payload.create({
    collection: 'media',
    data: focalY == null ? { alt } : { alt, focalX: 50, focalY },
    filePath: path.join(DIR, file),
    context: ctx(),
  })
  return doc.id as number
}

// 1. the About page
const existing = await payload.find({ collection: 'pages', where: { slug: { equals: ABOUT_PAGE.slug } }, limit: 1, depth: 0, draft: true })
if (!existing.docs.length) {
  const layout = []
  for (const section of ABOUT_SECTIONS) {
    const { image, images, ...rest } = section as typeof section & {
      image?: readonly [string, string]
      images?: readonly (readonly [string, string, number?])[]
    }
    const block: Record<string, unknown> = structuredClone(rest)
    if (image) block.image = await media(image)
    if (images) block.images = await Promise.all(images.map(media))
    layout.push(block)
  }
  await payload.create({
    collection: 'pages',
    data: { ...ABOUT_PAGE, layout: layout as never, _status: 'published' },
    context: ctx(),
  })
  log('Created the About page.')
}

// 2. "About Us" in the menus goes to the new page
for (const slug of ['header', 'footer'] as const) {
  const g = await payload.findGlobal({ slug, depth: 0 })
  const json = JSON.stringify(g)
  if (!json.includes('"href":"/#studio"')) continue
  const data = JSON.parse(json.replaceAll('"href":"/#studio"', '"href":"/about"'))
  delete data.id
  delete data.updatedAt
  delete data.createdAt
  await payload.updateGlobal({ slug, data, depth: 0, context: ctx() })
  log(`"About Us" in the ${slug} now opens /about.`)
}

log('Done.')
process.exit(0)

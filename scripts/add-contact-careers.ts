/* Sets up the Contact Us page (Figma 753:2877) and the Careers page (Figma 721:2420) on a site
 * that was created before they existed.
 *
 *   npm run contact-careers         — local database
 *   npm run vercel:contact-careers  — the Vercel database + Blob (needs .env.production.local)
 *
 * Safe to run more than once; each step only happens if it hasn't already:
 *   1. creates the "Contact" page: intro, the project inquiry form edge to edge, the FAQ
 *   2. creates the "Careers" page: hero, the way we work, areas of interest, an inquiry form
 *   3. points the menus at the new pages: "Contact Us" / "Contact" → /contact, "Careers" →
 *      /careers, and every "Start a project" button that opened /#contact → /contact
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { CAREERS_PAGE, CONTACT_PAGE } from './contact-careers.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(dirname, '../legacy/assets/careers')
// a fresh object per call: the Blob storage plugin marks the context it was given
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

/** The upload with this alt text, or a new one from legacy/assets/careers. */
async function media([file, alt]: readonly [string, string]) {
  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  if (found.docs[0]) return found.docs[0].id as number
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(DIR, file), context: ctx() })
  return doc.id as number
}

// copies of the home page's sections, without their ids (each block row needs its own)
const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
const strip = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(strip)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, strip(x)]))
      : v
const fromHome = (type: string) =>
  (home.docs[0]?.layout ?? []).filter((b) => b.blockType === type).slice(0, 1).map(strip) as Record<string, unknown>[]

const pageExists = async (slug: string) =>
  (await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })).docs.length > 0

// 1. Contact
if (!(await pageExists(CONTACT_PAGE.slug))) {
  const { intro, ...page } = CONTACT_PAGE
  await payload.create({
    collection: 'pages',
    data: {
      ...page,
      layout: [
        { blockType: 'pageIntro', heading: intro.heading, image: await media(intro.image) },
        ...fromHome('projectInquiry').map((b) => ({ ...b, fullWidth: true })),
        ...fromHome('faq'),
      ] as never,
      _status: 'published',
    },
    context: ctx(),
  })
  log('Created the Contact page.')
}

// 2. Careers
if (!(await pageExists(CAREERS_PAGE.slug))) {
  const { hero, principles, areas, inquiry, ...page } = CAREERS_PAGE
  const { images, ...heroRest } = hero
  const inquiryBlocks = fromHome('projectInquiry').map((b) => {
    const prep = (b.prep ?? {}) as Record<string, unknown>
    return {
      ...b,
      fullWidth: true,
      // no project budget for people applying
      budgets: [],
      prep: { ...prep, eyebrow: inquiry.eyebrow, title: inquiry.title, steps: inquiry.steps },
      submitLabel: inquiry.submitLabel,
      successMessage: inquiry.successMessage,
    }
  })
  await payload.create({
    collection: 'pages',
    data: {
      ...page,
      layout: [
        { blockType: 'careersHero', ...heroRest, images: await Promise.all(images.map(media)) },
        { blockType: 'cardGrid', heading: principles.heading, style: 'outlined', background: 'warm', cards: principles.cards },
        {
          blockType: 'interestCards',
          ...areas,
          cards: areas.cards.map((c) => ({ ...c, link: { label: 'Share interest', href: '#contact' } })),
        },
        ...inquiryBlocks,
      ] as never,
      _status: 'published',
    },
    context: ctx(),
  })
  log('Created the Careers page.')
}

// 3. menu and button links
type Link = { label?: string | null; href?: string | null }
const retarget = (link: Link): boolean => {
  const label = (link.label || '').trim().toLowerCase()
  if (link.href === '/#contact') {
    link.href = '/contact'
    return true
  }
  if (label === 'careers' && !link.href) {
    link.href = '/careers'
    return true
  }
  return false
}
const relink = (v: unknown): number => {
  if (Array.isArray(v)) return v.reduce((n: number, x) => n + relink(x), 0)
  if (!v || typeof v !== 'object') return 0
  const o = v as Record<string, unknown>
  let n = 'href' in o && retarget(o as Link) ? 1 : 0
  for (const [k, x] of Object.entries(o)) if (k !== 'href') n += relink(x)
  return n
}
for (const slug of ['header', 'footer'] as const) {
  const data = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Record<string, unknown>
  if (!relink(data)) continue
  delete data.id
  delete data.updatedAt
  delete data.createdAt
  await payload.updateGlobal({ slug, data: data as never, depth: 0, context: ctx() })
  log(`Contact and Careers links in the ${slug} now open their pages.`)
}
// "Start a project" on the About page's closing banner
const about = (await payload.find({ collection: 'pages', where: { slug: { equals: 'about' } }, limit: 1, depth: 0 })).docs[0]
if (about) {
  const layout = structuredClone(about.layout ?? [])
  if (relink(layout)) {
    await payload.update({ collection: 'pages', id: about.id, data: { layout }, depth: 0, context: ctx() })
    log('The About page’s “Start a project” button now opens /contact.')
  }
}

log('Done.')
process.exit(0)

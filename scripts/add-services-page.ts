/* Sets up the Services page (Figma 638:2111) and the six service pages on a site that was
 * created before they existed.
 *
 *   npm run services         — local database
 *   npm run vercel:services  — the Vercel database + Blob (needs .env.production.local)
 *
 * Safe to run more than once; each step only happens if it hasn't already:
 *   1. adds the six services (pictures, deliverables, process, questions) as published
 *      services, each ending with the project inquiry form copied from the home page
 *   2. creates the "Services" page: dark hero, services list, then the FAQ, project inquiry
 *      and client stories sections copied from the home page
 *   3. points "Services" in the menus at /services, and each service in the footer at its page
 *   4. points the home page buttons that still use the starter links (#contact, #work) at the
 *      new pages: each "How we deliver" service → its page, "Explore our process" → /services,
 *      the delivery principle cards → the matching service, "Explore Our Works" → /work
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { slugify } from '../src/fields/slug'
import { SERVICES, SERVICES_HERO, SERVICES_LIST } from './services-page.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(dirname, '../legacy/assets/services')
// a fresh object per call: the Blob storage plugin marks the context it was given
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

/** The upload with this alt text, or a new one from legacy/assets/services. */
async function media(file: string, alt: string, focalY?: number) {
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

// copies of the home page's sections, without their ids (each block row needs its own)
const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
const strip = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(strip)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, strip(x)]))
      : v
const fromHome = (type: string) => (home.docs[0]?.layout ?? []).filter((b) => b.blockType === type).slice(0, 1).map(strip)

// 1. the six services
const slugs: string[] = []
for (const s of SERVICES) {
  const slug = slugify(s.name)
  slugs.push(slug)
  const exists = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })
  if (exists.docs.length) {
    // services added before the menu icon existed get theirs once
    if (!exists.docs[0].icon) {
      await payload.update({ collection: 'services', id: exists.docs[0].id, data: { icon: s.icon as never }, depth: 0, context: ctx() })
      log(`Gave "${s.name}" its menu icon.`)
    }
    continue
  }
  const pairs = (list: [string, string][]) => list.map(([title, text]) => ({ title, text }))
  await payload.create({
    collection: 'services',
    data: {
      name: s.name,
      accent: s.accent,
      slug,
      kicker: s.kicker,
      icon: s.icon as never,
      summary: s.summary,
      deliverables: pairs(s.deliverables),
      image: await media(s.image, `${s.name} — services page`, s.imageFocalY),
      tagline: s.tagline,
      hero: { image: await media(s.heroImage, `${s.name} — service page hero`), highlight: s.highlight },
      process: pairs(s.process),
      questions: s.questions.map(([question, answer]) => ({ question, answer })),
      layout: fromHome('projectInquiry') as never,
      meta: { title: `${s.name} — ZeeTech`, description: s.summary },
      _status: 'published',
    },
    context: ctx(),
  })
  log(`Added the service "${s.name}".`)
}

// 2. the Services page
const page = await payload.find({ collection: 'pages', where: { slug: { equals: 'services' } }, limit: 1, depth: 0, draft: true })
if (!page.docs.length) {
  const { background, visual, ...hero } = SERVICES_HERO
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Services',
      slug: 'services',
      layout: [
        {
          blockType: 'servicesHero',
          ...hero,
          background: await media(background, 'Services page hero — glowing hand'),
          visual: await media(visual, 'Services page hero — orange 3D knot'),
        },
        { blockType: 'servicesList', ...SERVICES_LIST, buttonLabel: 'Explore This Service' },
        ...fromHome('faq'),
        ...fromHome('projectInquiry'),
        ...fromHome('clientStories'),
      ] as never,
      meta: {
        title: 'Services — ZeeTech',
        description:
          'Architecture, UI/UX design, backend and AI, frontend development, QA and ongoing support — one ZeeTech team from the first product decision to the next release.',
      },
      _status: 'published',
    },
    context: ctx(),
  })
  log('Created the Services page.')
}

// 3. menu links: "Services" → /services, each footer service → its own page
const firstWord = (v: string) => v.trim().toLowerCase().split(/\s+/)[0]
const serviceHref = (label: string) => {
  if (label.trim().toLowerCase() === 'services') return '/services'
  const i = SERVICES.findIndex((s) => firstWord(s.name) === firstWord(label))
  return i >= 0 ? `/services/${slugs[i]}` : null
}
const relink = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(relink)
  if (!v || typeof v !== 'object') return v
  const o = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, relink(x)])) as Record<string, unknown>
  if (o.href === '/#expertise' && typeof o.label === 'string') o.href = serviceHref(o.label) ?? o.href
  return o
}
for (const slug of ['header', 'footer'] as const) {
  const g = await payload.findGlobal({ slug, depth: 0 })
  if (!JSON.stringify(g).includes('"href":"/#expertise"')) continue
  const data = relink(g) as Record<string, unknown>
  delete data.id
  delete data.updatedAt
  delete data.createdAt
  await payload.updateGlobal({ slug, data: data as never, depth: 0, context: ctx() })
  log(`Service links in the ${slug} now open the service pages.`)
}

// 4. home page buttons
type Link = { label?: string | null; href?: string | null } | null | undefined
/** Moves a link off a starter placeholder; links an editor has changed are left alone. */
const retarget = (link: Link, from: string, to: string | null) => {
  if (!link || link.href !== from || !to) return false
  link.href = to
  return true
}
const homeDoc = (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })).docs[0]
if (homeDoc) {
  let changed = 0
  const layout = structuredClone(homeDoc.layout ?? [])
  for (const block of layout) {
    if (block.blockType === 'hero') {
      if (retarget(block.secondaryCta, '#work', '/work')) changed++
    } else if (block.blockType === 'howWeDeliver') {
      for (const item of block.services ?? []) if (retarget(item.link, '#contact', serviceHref(item.title))) changed++
    } else if (block.blockType === 'howWeBuild') {
      if (retarget(block.cta, '#contact', '/services')) changed++
    } else if (block.blockType === 'deliveryPrinciples') {
      for (const card of block.cards ?? []) {
        const kicker = card.kicker?.toLowerCase() ?? ''
        const to = kicker.includes('architecture')
          ? `/services/${slugs[0]}`
          : kicker.includes('design')
            ? `/services/${slugs[1]}`
            : '/services'
        if (retarget(card.link, '#contact', to)) changed++
      }
    }
  }
  if (changed) {
    await payload.update({ collection: 'pages', id: homeDoc.id, data: { layout }, depth: 0, context: ctx() })
    log(`Pointed ${changed} home page buttons at the new pages.`)
  }
}

log('Done.')
process.exit(0)

/* Sets up the Services page (Figma 638:2111) and the six service pages on a site that was
 * created before they existed.
 *
 *   npm run services         — local database
 *   npm run vercel:services  — the Vercel database + Blob (needs .env.production.local)
 *
 * Safe to run more than once; each step only happens if it hasn't already:
 *   1. adds the services (pictures, deliverables, process, questions) as published
 *      services, each ending with the project inquiry form copied from the home page
 *   2. creates the "Services" page: dark hero, services list, then the FAQ, project inquiry
 *      and client stories sections copied from the home page
 *   3. points "Services" in the menus at /services, and each service in the footer at its page
 *   4. points the home page buttons that still use the starter links (#contact, #work) at the
 *      new pages: each "How we deliver" service → its page, "Explore our process" → /services,
 *      the delivery principle cards → the matching service, "Explore Our Works" → /work
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { SERVICES, SERVICES_HERO, SERVICES_LIST } from './services-page.data'
import { ctx, ensureService, homeSections, serviceMedia } from './service-create'

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)
const media = (file: string, alt: string, focalY?: number) => serviceMedia(payload, file, alt, focalY)
const fromHome = await homeSections(payload)

// 1. the services
const slugs: string[] = []
for (const s of SERVICES) slugs.push((await ensureService(payload, s, fromHome)).slug)

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
          'Architecture, UI/UX design, backend and AI, frontend development, QA, ongoing support, cybersecurity and blockchain — one ZeeTech team from the first product decision to the next release.',
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

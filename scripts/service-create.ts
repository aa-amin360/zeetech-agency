/* Shared by the services scripts: uploads a service's pictures and creates it as a published
 * service page (add-services-page.ts for the first six, add-cybersecurity-blockchain.ts for the
 * one added later). */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'
import { slugify } from '../src/fields/slug'
import type { ServiceData } from './services-page.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
export const SERVICES_DIR = path.resolve(dirname, '../legacy/assets/services')
// a fresh object per call: the Blob storage plugin marks the context it was given
export const ctx = () => ({ disableRevalidate: true })

/** The upload with this alt text, or a new one from legacy/assets/services. */
export async function serviceMedia(payload: Payload, file: string, alt: string, focalY?: number) {
  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  if (found.docs[0]) return found.docs[0].id as number
  const doc = await payload.create({
    collection: 'media',
    data: focalY == null ? { alt } : { alt, focalX: 50, focalY },
    filePath: path.join(SERVICES_DIR, file),
    context: ctx(),
  })
  return doc.id as number
}

/** Copies of the home page's sections of one type, without their ids (each block row needs its own). */
export async function homeSections(payload: Payload) {
  const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  const strip = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(strip)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, strip(x)]))
        : v
  return (type: string) => (home.docs[0]?.layout ?? []).filter((b) => b.blockType === type).slice(0, 1).map(strip)
}

/**
 * Creates the service unless one with its slug exists (then it only gets its menu icon if it has
 * none). Returns the slug and whether it was created.
 */
export async function ensureService(payload: Payload, s: ServiceData, fromHome: (type: string) => unknown[]) {
  const slug = slugify(s.name)
  const exists = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })
  if (exists.docs.length) {
    // services added before the menu icon existed get theirs once
    if (!exists.docs[0].icon) {
      await payload.update({ collection: 'services', id: exists.docs[0].id, data: { icon: s.icon as never }, depth: 0, context: ctx() })
      payload.logger.info(`Gave "${s.name}" its menu icon.`)
    }
    return { slug, created: false }
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
      image: await serviceMedia(payload, s.image, `${s.name} — services page`, s.imageFocalY),
      tagline: s.tagline,
      hero: { image: await serviceMedia(payload, s.heroImage, `${s.name} — service page hero`), highlight: s.highlight },
      process: pairs(s.process),
      questions: s.questions.map(([question, answer]) => ({ question, answer })),
      layout: fromHome('projectInquiry') as never,
      meta: { title: `${s.name} — ZeeTech`, description: s.summary },
      _status: 'published',
    },
    context: ctx(),
  })
  payload.logger.info(`Added the service "${s.name}".`)
  return { slug, created: true }
}

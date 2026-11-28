/* Marlin's video testimonial (MBMG LLC), sent by the owner on 2026-11-28 for the home page.
 * Files in legacy/assets/testimonials: the video re-encoded for the web (720p, 5 MB; the original was
 * a 165 MB WhatsApp export), a poster frame and WebVTT captions. The transcript was made from the
 * video's audio; "Ztech" in the speech is written as ZeeTech.
 *
 * 1. the big video player in the home "Why ZeeTech" section (it had no video yet: only the wave)
 * 2. a testimonial kept as a draft: the owner wants it only in the big player, not in
 *    "Client stories" (2026-11-28). Publish it in the admin to show it there as well.
 *
 *   npm run marlin-video   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once: the player is only filled while it has no video, and the
 * testimonial is only added once.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import { generateKeyBetween } from 'payload/shared'
import config from '../src/payload.config'
import { ctx } from './case-study-create'

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../legacy/assets/testimonials')
const NAME = 'Marlin'

const TRANSCRIPT =
  "Hey everyone, I'm Marlin, Principal of MBMG LLC. I just wanted to take a quick moment to share my experience working with ZeeTech. You know, finding a technology partner who actually understands your vision and takes the time to listen to your needs can make a big difference. And that's something I've really appreciated about working with these guys. Their communication has been great, they're attentive to the requirements, and I appreciate how they approach challenges and work toward finding the right solutions. What I particularly like is the fact that they take the time to understand what you're trying to achieve, rather than just focusing on completing a task. Overall, it's been a positive experience working with ZeeTech. I definitely recommend them to anyone looking for a technology partner. Keep up the great work guys!"

// the line shown on the slide, word for word from the video
const QUOTE =
  "What I particularly like is the fact that they take the time to understand what you're trying to achieve, rather than just focusing on completing a task."

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)


/** The upload with this alt text, or a new one from legacy/assets/testimonials. */
async function media(file: string, alt: string, extra: Record<string, unknown> = {}) {
  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  if (found.docs[0]) return found.docs[0].id as number
  const doc = await payload.create({ collection: 'media', data: { alt, ...extra }, filePath: path.join(DIR, file), context: ctx() })
  return doc.id as number
}

log('Uploading the video, poster and captions…')
const video = await media('marlin-video.mp4', 'Video testimonial from Marlin, Principal of MBMG LLC')
const poster = await media('marlin-poster.jpg', 'Marlin, Principal of MBMG LLC', { focalX: 48, focalY: 40 })
const captions = await media('marlin-captions.vtt', 'Captions: video testimonial from Marlin')

// 1. the home page video player
const reel = { source: 'upload', file: video, poster, captions, transcript: TRANSCRIPT }
const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
const page = home.docs[0]
const empty = (b: Record<string, unknown>) => {
  const r = b.reel as { source?: string | null } | undefined
  return !r?.source || r.source === 'none'
}
if (page && (page.layout ?? []).some((b) => b.blockType === 'whyZeetech' && empty(b as never))) {
  const layout = (page.layout ?? []).map((b) => (b.blockType === 'whyZeetech' && empty(b as never) ? { ...b, reel } : b))
  await payload.update({ collection: 'pages', id: page.id, data: { layout } as never, depth: 0, context: ctx() })
  log("Home \"Why ZeeTech\" video player now plays Marlin's video.")
}

// 2. the testimonial
const exists = await payload.find({ collection: 'testimonials', where: { name: { equals: NAME } }, limit: 1, depth: 0, draft: true })
if (exists.docs.length) {
  log("Marlin's video testimonial is already there.")
  process.exit(0)
}
const first = await payload.find({ collection: 'testimonials', sort: '_order', limit: 1, depth: 0, draft: true })
const firstOrder = (first.docs[0] as { _order?: string } | undefined)?._order ?? null

await payload.create({
  collection: 'testimonials',
  data: {
    _status: 'draft',
    _order: generateKeyBetween(null, firstOrder),
    name: NAME,
    role: 'Principal, MBMG LLC',
    quote: QUOTE,
    type: 'video',
    video: reel,
    source: { platform: 'direct' },
    featured: false,
    origin: 'admin',
    consent: true, // recorded by Marlin for the site
  } as never,
  draft: true,
  context: ctx(),
})
log("Added Marlin's video testimonial as a draft (not in Client stories).")
log('Done.')
process.exit(0)

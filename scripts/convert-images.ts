/* Converts the images already in Media to WebP (new uploads are converted automatically,
 * see src/collections/Media.ts).
 *
 *   npm run images            — local database (./media)
 *   npm run vercel:images     — the Vercel database + Blob (needs .env.production.local)
 *
 * Each PNG / JPEG / GIF upload is re-saved through Payload, which stores it as WebP and remakes
 * its sizes; the document id stays the same, so every page keeps pointing at it.
 * SVGs, videos and uploads that are already WebP are skipped, so it is safe to run again.
 * After running it on Vercel, redeploy so cached pages pick up the new image addresses.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCAL_DIR = path.resolve(dirname, '../media')
const CONVERT = ['image/png', 'image/jpeg', 'image/gif']
// a fresh object per call: the Blob storage plugin marks the context it was given
const ctx = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)
const kb = (n?: number | null) => `${Math.round((n || 0) / 1024)} KB`

const { docs } = await payload.find({ collection: 'media', limit: 1000, depth: 0, pagination: false })
const todo = docs.filter((m) => m.mimeType && CONVERT.includes(m.mimeType) && m.filename)
log(`${todo.length} of ${docs.length} uploads to convert.`)

let before = 0
let after = 0
for (const m of todo) {
  try {
    // the original file: from Blob when it's in use, otherwise from ./media
    let data: Buffer
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const res = await fetch(m.url!)
      if (!res.ok) throw new Error(`download failed (${res.status})`)
      data = Buffer.from(await res.arrayBuffer())
    } else {
      data = await fs.readFile(path.join(LOCAL_DIR, m.filename!))
    }

    const doc = await payload.update({
      collection: 'media',
      id: m.id,
      data: {},
      file: { data, mimetype: m.mimeType!, name: m.filename!, size: data.length },
      depth: 0,
      context: ctx(),
    })
    before += m.filesize || 0
    after += doc.filesize || 0
    log(`${m.filename} (${kb(m.filesize)}) → ${doc.filename} (${kb(doc.filesize)})`)
  } catch (e) {
    payload.logger.error(`${m.filename}: ${(e as Error).message}`)
  }
}

log(`Done. Originals: ${kb(before)} → ${kb(after)}.`)
process.exit(0)

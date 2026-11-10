/* Shared steps for the scripts that add a real project (case study):
 * the story text from its copy file, its pictures, and the end-of-page sections.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

// a fresh object per call: the Blob storage plugin marks the context it was given
export const ctx = () => ({ disableRevalidate: true })

/** Joins wrapped lines of the same paragraph or quote (the converter drops the space between them). */
function unwrap(text: string) {
  const out: string[] = []
  const kind = (l: string) => (l.trim() === '' || /^(#|- |\d+\. )/.test(l) ? 'block' : l.startsWith('>') ? 'quote' : 'text')
  for (const line of text.split('\n')) {
    const prev = out.at(-1)
    const k = kind(line)
    const body = line.replace(/^>\s?/, '')
    if (prev !== undefined && k !== 'block' && kind(prev) === k && body.trim() && prev.replace(/^>\s?/, '').trim()) {
      out[out.length - 1] = `${prev} ${body}`
    } else out.push(line)
  }
  return out.join('\n')
}

/** The "## Story" section of a content/projects/*.md file as rich text (### headings become the page's h2s). */
export async function storyFromCopy(payload: Payload, file: string) {
  const md = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  const story = md.split('\n## Story')[1]?.split('\n---')[0]
  if (!story) throw new Error(`No "## Story" section found in ${file}`)
  const markdown = unwrap(story.replace(/^.*\n/, '').replace(/^### (.*)$/gm, '## $1\n')).trim()
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  return convertMarkdownToLexical({ editorConfig, markdown })
}

/** The upload with this alt text, or a new one from `dir`. */
export async function mediaFrom(payload: Payload, dir: string, file: string, alt: string) {
  const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, depth: 0 })
  if (found.docs[0]) return found.docs[0].id as number
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(dir, file), context: ctx() })
  return doc.id as number
}

/** Copies of the home page's project inquiry and client stories sections, for the end of a case study. */
export async function endSections(payload: Payload) {
  const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  const strip = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(strip)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, strip(x)]))
        : v
  const pick = (type: string) => (home.docs[0]?.layout ?? []).filter((b) => b.blockType === type).slice(0, 1).map(strip)
  return [...pick('projectInquiry'), ...pick('clientStories')]
}

/** Renumbers "Project NN" labels to follow the admin order (labels an editor changed to something else are kept). */
export async function renumberProjects(payload: Payload) {
  const { docs } = await payload.find({ collection: 'case-studies', sort: '_order', limit: 500, depth: 0, pagination: false, draft: true })
  let n = 0
  for (const s of docs) {
    n++
    if (s.projectLabel && !/^Project \d+$/.test(s.projectLabel)) continue
    const projectLabel = `Project ${String(n).padStart(2, '0')}`
    if (s.projectLabel === projectLabel) continue
    await payload.update({ collection: 'case-studies', id: s.id, data: { projectLabel }, depth: 0, draft: s._status === 'draft', context: ctx() })
  }
}

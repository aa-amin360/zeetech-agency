import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Navbar (Figma 140:1464): the menu reads Our Work · Services · About Us · Careers · Contact Us.
// Content only, and only while the header still holds the original starter links, so nothing
// the owner has edited is overwritten.
const OLD = [
  ['Work', '/#work'],
  ['Expertise', '/#expertise'],
  ['Studio', '/#studio'],
  ['Insights', '/#faq'],
]
const NEW = [
  ['Our Work', '/#work'],
  ['Services', '/#expertise'],
  ['About Us', '/#studio'],
  ['Careers', ''],
  ['Contact Us', '/#contact'],
]

const matches = (links: { link?: { label?: string | null } | null }[] | null | undefined, list: string[][]) =>
  (links?.length ?? 0) === list.length && links!.every((l, i) => l.link?.label === list[i][0])

async function swap(payload: MigrateUpArgs['payload'], req: MigrateUpArgs['req'], from: string[][], to: string[][]) {
  const ctx = { disableRevalidate: true }
  const header = await payload.findGlobal({ slug: 'header', req, depth: 0, context: ctx })
  if (!matches(header.links, from)) return
  await payload.updateGlobal({
    slug: 'header',
    data: { links: to.map(([label, href]) => ({ link: { label, href } })) },
    req,
    depth: 0,
    context: ctx,
  })
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await swap(payload, req, OLD, NEW)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await swap(payload, req, NEW, OLD)
}

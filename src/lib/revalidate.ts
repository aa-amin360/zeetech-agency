import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

/**
 * Pages are cached; after an edit in the admin panel we clear the cache so the
 * change is live on the next request. Skipped when running outside Next
 * (e.g. the seed script), where revalidatePath is unavailable.
 */
const purge = async () => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    /* not running inside Next.js */
  }
}

export const revalidateCollection: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!req.context?.disableRevalidate) await purge()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (!req.context?.disableRevalidate) await purge()
  return doc
}

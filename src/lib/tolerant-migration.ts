import { sql, type MigrateUpArgs } from '@payloadcms/db-postgres'

/**
 * Runs a generated migration one statement at a time and skips statements whose result is
 * already in the database ("type/table/column/index/constraint already exists", "index to drop
 * is already gone"). A database that once had its schema pushed by a dev server (Payload's
 * "you've run Payload in dev mode" prompt) can then still be migrated without errors.
 * Any other error stops the migration as usual.
 */
const ALREADY_DONE = new Set([
  '42710', // duplicate_object (type, constraint, enum value)
  '42P07', // duplicate_table (table, index)
  '42701', // duplicate_column
  '42704', // undefined_object (dropping an index / type that is already gone)
])

const codeOf = (e: unknown): string | undefined => {
  const err = e as { code?: string; cause?: { code?: string } }
  return err?.cause?.code ?? err?.code
}

export async function runTolerant(db: MigrateUpArgs['db'], text: string): Promise<void> {
  const statements = text
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean)

  // savepoints keep the surrounding migration transaction usable after a skipped statement
  let savepoints = true
  try {
    await db.execute(sql.raw('SAVEPOINT tolerant'))
    await db.execute(sql.raw('RELEASE SAVEPOINT tolerant'))
  } catch {
    savepoints = false
  }

  for (const statement of statements) {
    if (savepoints) await db.execute(sql.raw('SAVEPOINT tolerant'))
    try {
      await db.execute(sql.raw(statement))
      if (savepoints) await db.execute(sql.raw('RELEASE SAVEPOINT tolerant'))
    } catch (e) {
      if (!ALREADY_DONE.has(codeOf(e) ?? '')) throw e
      if (savepoints) await db.execute(sql.raw('ROLLBACK TO SAVEPOINT tolerant'))
    }
  }
}

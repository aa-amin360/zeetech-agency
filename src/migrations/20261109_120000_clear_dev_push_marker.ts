import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * A dev server that once connected to this database left a "pushed in dev mode" marker
 * (batch -1). While it is there, every `payload migrate` stops at a yes/no prompt, and on
 * Vercel (no keyboard) that prompt quietly ends the migration, so new tables never arrive.
 * The schema is brought up to date by the migrations before this one, so the marker can go.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DELETE FROM "payload_migrations" WHERE "batch" = -1`)
}

export async function down(_: MigrateDownArgs): Promise<void> {}

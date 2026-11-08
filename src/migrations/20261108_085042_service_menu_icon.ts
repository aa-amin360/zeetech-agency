import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { runTolerant } from '../lib/tolerant-migration'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await runTolerant(db, `
   CREATE TYPE "public"."enum_services_icon" AS ENUM('layers-3', 'pen-tool', 'file-code-2', 'monitor-smartphone', 'square-mouse-pointer', 'cloud-cog', 'settings', 'image', 'atom', 'waves');
  CREATE TYPE "public"."enum__services_v_version_icon" AS ENUM('layers-3', 'pen-tool', 'file-code-2', 'monitor-smartphone', 'square-mouse-pointer', 'cloud-cog', 'settings', 'image', 'atom', 'waves');
  ALTER TABLE "services" ADD COLUMN "icon" "enum_services_icon";
  ALTER TABLE "_services_v" ADD COLUMN "version_icon" "enum__services_v_version_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP COLUMN "icon";
  ALTER TABLE "_services_v" DROP COLUMN "version_icon";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum__services_v_version_icon";`)
}

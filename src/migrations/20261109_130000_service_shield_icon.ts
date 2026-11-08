import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_services_icon" ADD VALUE IF NOT EXISTS 'shield-check';
  ALTER TYPE "public"."enum__services_v_version_icon" ADD VALUE IF NOT EXISTS 'shield-check';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_services_icon";
  CREATE TYPE "public"."enum_services_icon" AS ENUM('layers-3', 'pen-tool', 'file-code-2', 'monitor-smartphone', 'square-mouse-pointer', 'cloud-cog', 'settings', 'image', 'atom', 'waves');
  ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_services_icon" USING "icon"::"public"."enum_services_icon";
  ALTER TABLE "_services_v" ALTER COLUMN "version_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__services_v_version_icon";
  CREATE TYPE "public"."enum__services_v_version_icon" AS ENUM('layers-3', 'pen-tool', 'file-code-2', 'monitor-smartphone', 'square-mouse-pointer', 'cloud-cog', 'settings', 'image', 'atom', 'waves');
  ALTER TABLE "_services_v" ALTER COLUMN "version_icon" SET DATA TYPE "public"."enum__services_v_version_icon" USING "version_icon"::"public"."enum__services_v_version_icon";`)
}

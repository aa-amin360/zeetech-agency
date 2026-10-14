import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_work_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlight" varchar,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_work_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"all_label" varchar DEFAULT 'All Projects',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_work_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlight" varchar,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_work_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"all_label" varchar DEFAULT 'All Projects',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "case_studies_locales" ADD COLUMN "title_accent" varchar;
  ALTER TABLE "case_studies_locales" ADD COLUMN "service" varchar;
  ALTER TABLE "case_studies_locales" ADD COLUMN "industry" varchar;
  ALTER TABLE "_case_studies_v_locales" ADD COLUMN "version_title_accent" varchar;
  ALTER TABLE "_case_studies_v_locales" ADD COLUMN "version_service" varchar;
  ALTER TABLE "_case_studies_v_locales" ADD COLUMN "version_industry" varchar;
  ALTER TABLE "pages_blocks_work_hero" ADD CONSTRAINT "pages_blocks_work_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_work_hero" ADD CONSTRAINT "pages_blocks_work_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_work_grid" ADD CONSTRAINT "pages_blocks_work_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_work_hero" ADD CONSTRAINT "_pages_v_blocks_work_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_work_hero" ADD CONSTRAINT "_pages_v_blocks_work_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_work_grid" ADD CONSTRAINT "_pages_v_blocks_work_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_work_hero_order_idx" ON "pages_blocks_work_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_work_hero_parent_id_idx" ON "pages_blocks_work_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_work_hero_path_idx" ON "pages_blocks_work_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_work_hero_locale_idx" ON "pages_blocks_work_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_work_hero_background_idx" ON "pages_blocks_work_hero" USING btree ("background_id");
  CREATE INDEX "pages_blocks_work_grid_order_idx" ON "pages_blocks_work_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_work_grid_parent_id_idx" ON "pages_blocks_work_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_work_grid_path_idx" ON "pages_blocks_work_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_work_grid_locale_idx" ON "pages_blocks_work_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_work_hero_order_idx" ON "_pages_v_blocks_work_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_work_hero_parent_id_idx" ON "_pages_v_blocks_work_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_work_hero_path_idx" ON "_pages_v_blocks_work_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_work_hero_locale_idx" ON "_pages_v_blocks_work_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_work_hero_background_idx" ON "_pages_v_blocks_work_hero" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_work_grid_order_idx" ON "_pages_v_blocks_work_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_work_grid_parent_id_idx" ON "_pages_v_blocks_work_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_work_grid_path_idx" ON "_pages_v_blocks_work_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_work_grid_locale_idx" ON "_pages_v_blocks_work_grid" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_work_hero" CASCADE;
  DROP TABLE "pages_blocks_work_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_work_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_work_grid" CASCADE;
  ALTER TABLE "case_studies_locales" DROP COLUMN "title_accent";
  ALTER TABLE "case_studies_locales" DROP COLUMN "service";
  ALTER TABLE "case_studies_locales" DROP COLUMN "industry";
  ALTER TABLE "_case_studies_v_locales" DROP COLUMN "version_title_accent";
  ALTER TABLE "_case_studies_v_locales" DROP COLUMN "version_service";
  ALTER TABLE "_case_studies_v_locales" DROP COLUMN "version_industry";`)
}

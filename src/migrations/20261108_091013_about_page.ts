import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { runTolerant } from '../lib/tolerant-migration'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await runTolerant(db, `
   CREATE TYPE "public"."enum_pages_blocks_story_media_layout" AS ENUM('pair', 'stack', 'person');
  CREATE TYPE "public"."enum_pages_blocks_story_media_background" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_style" AS ENUM('figures', 'numbered');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_background" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum__pages_v_blocks_story_media_layout" AS ENUM('pair', 'stack', 'person');
  CREATE TYPE "public"."enum__pages_v_blocks_story_media_background" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_style" AS ENUM('figures', 'numbered');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_background" AS ENUM('white', 'warm');
  CREATE TABLE "pages_blocks_page_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"heading_subtitle" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_story_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT false,
  	"heading_subtitle" varchar,
  	"layout" "enum_pages_blocks_story_media_layout" DEFAULT 'pair',
  	"background" "enum_pages_blocks_story_media_background" DEFAULT 'white',
  	"person_name" varchar,
  	"person_role" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT false,
  	"heading_subtitle" varchar,
  	"style" "enum_pages_blocks_card_grid_style" DEFAULT 'figures',
  	"background" "enum_pages_blocks_card_grid_background" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"email" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"heading_subtitle" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_story_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT false,
  	"heading_subtitle" varchar,
  	"layout" "enum__pages_v_blocks_story_media_layout" DEFAULT 'pair',
  	"background" "enum__pages_v_blocks_story_media_background" DEFAULT 'white',
  	"person_name" varchar,
  	"person_role" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT false,
  	"heading_subtitle" varchar,
  	"style" "enum__pages_v_blocks_card_grid_style" DEFAULT 'figures',
  	"background" "enum__pages_v_blocks_card_grid_background" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"email" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_page_intro" ADD CONSTRAINT "pages_blocks_page_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_intro" ADD CONSTRAINT "pages_blocks_page_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_media" ADD CONSTRAINT "pages_blocks_story_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_band" ADD CONSTRAINT "pages_blocks_contact_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD CONSTRAINT "_pages_v_blocks_page_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD CONSTRAINT "_pages_v_blocks_page_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_story_media" ADD CONSTRAINT "_pages_v_blocks_story_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_band" ADD CONSTRAINT "_pages_v_blocks_contact_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_page_intro_order_idx" ON "pages_blocks_page_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_intro_parent_id_idx" ON "pages_blocks_page_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_intro_path_idx" ON "pages_blocks_page_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_intro_locale_idx" ON "pages_blocks_page_intro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_page_intro_image_idx" ON "pages_blocks_page_intro" USING btree ("image_id");
  CREATE INDEX "pages_blocks_story_media_order_idx" ON "pages_blocks_story_media" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_media_parent_id_idx" ON "pages_blocks_story_media" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_media_path_idx" ON "pages_blocks_story_media" USING btree ("_path");
  CREATE INDEX "pages_blocks_story_media_locale_idx" ON "pages_blocks_story_media" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_cards_locale_idx" ON "pages_blocks_card_grid_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_locale_idx" ON "pages_blocks_card_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_contact_band_order_idx" ON "pages_blocks_contact_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_band_parent_id_idx" ON "pages_blocks_contact_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_band_path_idx" ON "pages_blocks_contact_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_band_locale_idx" ON "pages_blocks_contact_band" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_page_intro_order_idx" ON "_pages_v_blocks_page_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_intro_parent_id_idx" ON "_pages_v_blocks_page_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_intro_path_idx" ON "_pages_v_blocks_page_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_intro_locale_idx" ON "_pages_v_blocks_page_intro" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_page_intro_image_idx" ON "_pages_v_blocks_page_intro" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_story_media_order_idx" ON "_pages_v_blocks_story_media" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_story_media_parent_id_idx" ON "_pages_v_blocks_story_media" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_story_media_path_idx" ON "_pages_v_blocks_story_media" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_story_media_locale_idx" ON "_pages_v_blocks_story_media" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_order_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_locale_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_locale_idx" ON "_pages_v_blocks_card_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contact_band_order_idx" ON "_pages_v_blocks_contact_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_band_parent_id_idx" ON "_pages_v_blocks_contact_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_band_path_idx" ON "_pages_v_blocks_contact_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_band_locale_idx" ON "_pages_v_blocks_contact_band" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_page_intro" CASCADE;
  DROP TABLE "pages_blocks_story_media" CASCADE;
  DROP TABLE "pages_blocks_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "pages_blocks_contact_band" CASCADE;
  DROP TABLE "_pages_v_blocks_page_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_story_media" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_band" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_story_media_layout";
  DROP TYPE "public"."enum_pages_blocks_story_media_background";
  DROP TYPE "public"."enum_pages_blocks_card_grid_style";
  DROP TYPE "public"."enum_pages_blocks_card_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_story_media_layout";
  DROP TYPE "public"."enum__pages_v_blocks_story_media_background";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_style";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_background";`)
}

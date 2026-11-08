import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "case_studies_blocks_project_inquiry_prep_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "case_studies_blocks_project_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"full_width" boolean DEFAULT false,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"heading_subtitle" varchar,
  	"prep_eyebrow" varchar,
  	"prep_title" varchar,
  	"prep_person_photo_id" integer,
  	"prep_person_name" varchar,
  	"prep_person_role" varchar,
  	"submit_label" varchar DEFAULT 'Send Inquiry',
  	"success_message" varchar DEFAULT 'Thank you — we’ll be in touch within one business day.',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_client_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_faq" (
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
  	"help_card_background_id" integer,
  	"help_card_title" varchar,
  	"help_card_accent" varchar,
  	"help_card_text" varchar,
  	"help_card_cta_label" varchar,
  	"help_card_cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_case_studies_v_blocks_project_inquiry_prep_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_project_inquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_width" boolean DEFAULT false,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"heading_subtitle" varchar,
  	"prep_eyebrow" varchar,
  	"prep_title" varchar,
  	"prep_person_photo_id" integer,
  	"prep_person_name" varchar,
  	"prep_person_role" varchar,
  	"submit_label" varchar DEFAULT 'Send Inquiry',
  	"success_message" varchar DEFAULT 'Thank you — we’ll be in touch within one business day.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_client_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_faq" (
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
  	"help_card_background_id" integer,
  	"help_card_title" varchar,
  	"help_card_accent" varchar,
  	"help_card_text" varchar,
  	"help_card_cta_label" varchar,
  	"help_card_cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  DROP INDEX "case_studies_rels_media_id_idx";
  DROP INDEX "_case_studies_v_rels_media_id_idx";
  ALTER TABLE "case_studies_locales" ADD COLUMN "status" varchar;
  ALTER TABLE "case_studies_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "case_studies_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "case_studies_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "_case_studies_v_locales" ADD COLUMN "version_status" varchar;
  ALTER TABLE "_case_studies_v_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_case_studies_v_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "_case_studies_v_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "case_studies_blocks_project_inquiry_prep_steps" ADD CONSTRAINT "case_studies_blocks_project_inquiry_prep_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_project_inquiry"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_project_inquiry" ADD CONSTRAINT "case_studies_blocks_project_inquiry_prep_person_photo_id_media_id_fk" FOREIGN KEY ("prep_person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_project_inquiry" ADD CONSTRAINT "case_studies_blocks_project_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_client_stories" ADD CONSTRAINT "case_studies_blocks_client_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_faq" ADD CONSTRAINT "case_studies_blocks_faq_help_card_background_id_media_id_fk" FOREIGN KEY ("help_card_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_faq" ADD CONSTRAINT "case_studies_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_texts" ADD CONSTRAINT "case_studies_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_project_inquiry_prep_steps" ADD CONSTRAINT "_case_studies_v_blocks_project_inquiry_prep_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_project_inquiry"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_project_inquiry" ADD CONSTRAINT "_case_studies_v_blocks_project_inquiry_prep_person_photo_id_media_id_fk" FOREIGN KEY ("prep_person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_project_inquiry" ADD CONSTRAINT "_case_studies_v_blocks_project_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_client_stories" ADD CONSTRAINT "_case_studies_v_blocks_client_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_faq" ADD CONSTRAINT "_case_studies_v_blocks_faq_help_card_background_id_media_id_fk" FOREIGN KEY ("help_card_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_faq" ADD CONSTRAINT "_case_studies_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_texts" ADD CONSTRAINT "_case_studies_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "case_studies_blocks_project_inquiry_prep_steps_order_idx" ON "case_studies_blocks_project_inquiry_prep_steps" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_project_inquiry_prep_steps_parent_id_idx" ON "case_studies_blocks_project_inquiry_prep_steps" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_project_inquiry_prep_steps_locale_idx" ON "case_studies_blocks_project_inquiry_prep_steps" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_project_inquiry_order_idx" ON "case_studies_blocks_project_inquiry" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_project_inquiry_parent_id_idx" ON "case_studies_blocks_project_inquiry" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_project_inquiry_path_idx" ON "case_studies_blocks_project_inquiry" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_project_inquiry_locale_idx" ON "case_studies_blocks_project_inquiry" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_project_inquiry_prep_person_prep_per_idx" ON "case_studies_blocks_project_inquiry" USING btree ("prep_person_photo_id");
  CREATE INDEX "case_studies_blocks_client_stories_order_idx" ON "case_studies_blocks_client_stories" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_client_stories_parent_id_idx" ON "case_studies_blocks_client_stories" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_client_stories_path_idx" ON "case_studies_blocks_client_stories" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_client_stories_locale_idx" ON "case_studies_blocks_client_stories" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_faq_order_idx" ON "case_studies_blocks_faq" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_faq_parent_id_idx" ON "case_studies_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_faq_path_idx" ON "case_studies_blocks_faq" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_faq_locale_idx" ON "case_studies_blocks_faq" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_faq_help_card_help_card_background_idx" ON "case_studies_blocks_faq" USING btree ("help_card_background_id");
  CREATE INDEX "case_studies_texts_order_parent" ON "case_studies_texts" USING btree ("order","parent_id");
  CREATE INDEX "case_studies_texts_locale_parent" ON "case_studies_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_prep_steps_order_idx" ON "_case_studies_v_blocks_project_inquiry_prep_steps" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_prep_steps_parent_id_idx" ON "_case_studies_v_blocks_project_inquiry_prep_steps" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_prep_steps_locale_idx" ON "_case_studies_v_blocks_project_inquiry_prep_steps" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_order_idx" ON "_case_studies_v_blocks_project_inquiry" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_parent_id_idx" ON "_case_studies_v_blocks_project_inquiry" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_path_idx" ON "_case_studies_v_blocks_project_inquiry" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_locale_idx" ON "_case_studies_v_blocks_project_inquiry" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_project_inquiry_prep_person_prep__idx" ON "_case_studies_v_blocks_project_inquiry" USING btree ("prep_person_photo_id");
  CREATE INDEX "_case_studies_v_blocks_client_stories_order_idx" ON "_case_studies_v_blocks_client_stories" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_client_stories_parent_id_idx" ON "_case_studies_v_blocks_client_stories" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_client_stories_path_idx" ON "_case_studies_v_blocks_client_stories" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_client_stories_locale_idx" ON "_case_studies_v_blocks_client_stories" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_faq_order_idx" ON "_case_studies_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_faq_parent_id_idx" ON "_case_studies_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_faq_path_idx" ON "_case_studies_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_faq_locale_idx" ON "_case_studies_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_faq_help_card_help_card_backgroun_idx" ON "_case_studies_v_blocks_faq" USING btree ("help_card_background_id");
  CREATE INDEX "_case_studies_v_texts_order_parent" ON "_case_studies_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_case_studies_v_texts_locale_parent" ON "_case_studies_v_texts" USING btree ("locale","parent_id");
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "case_studies_rels_locale_idx" ON "case_studies_rels" USING btree ("locale");
  CREATE INDEX "case_studies_rels_testimonials_id_idx" ON "case_studies_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "case_studies_rels_faqs_id_idx" ON "case_studies_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "_case_studies_v_rels_locale_idx" ON "_case_studies_v_rels" USING btree ("locale");
  CREATE INDEX "_case_studies_v_rels_testimonials_id_idx" ON "_case_studies_v_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "_case_studies_v_rels_faqs_id_idx" ON "_case_studies_v_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "case_studies_rels_media_id_idx" ON "case_studies_rels" USING btree ("media_id","locale");
  CREATE INDEX "_case_studies_v_rels_media_id_idx" ON "_case_studies_v_rels" USING btree ("media_id","locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "case_studies_blocks_project_inquiry_prep_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_project_inquiry" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_client_stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_project_inquiry_prep_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_project_inquiry" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_client_stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "case_studies_blocks_project_inquiry_prep_steps" CASCADE;
  DROP TABLE "case_studies_blocks_project_inquiry" CASCADE;
  DROP TABLE "case_studies_blocks_client_stories" CASCADE;
  DROP TABLE "case_studies_blocks_faq" CASCADE;
  DROP TABLE "case_studies_texts" CASCADE;
  DROP TABLE "_case_studies_v_blocks_project_inquiry_prep_steps" CASCADE;
  DROP TABLE "_case_studies_v_blocks_project_inquiry" CASCADE;
  DROP TABLE "_case_studies_v_blocks_client_stories" CASCADE;
  DROP TABLE "_case_studies_v_blocks_faq" CASCADE;
  DROP TABLE "_case_studies_v_texts" CASCADE;
  ALTER TABLE "case_studies_rels" DROP CONSTRAINT "case_studies_rels_testimonials_fk";
  
  ALTER TABLE "case_studies_rels" DROP CONSTRAINT "case_studies_rels_faqs_fk";
  
  ALTER TABLE "_case_studies_v_rels" DROP CONSTRAINT "_case_studies_v_rels_testimonials_fk";
  
  ALTER TABLE "_case_studies_v_rels" DROP CONSTRAINT "_case_studies_v_rels_faqs_fk";
  
  DROP INDEX "case_studies_rels_locale_idx";
  DROP INDEX "case_studies_rels_testimonials_id_idx";
  DROP INDEX "case_studies_rels_faqs_id_idx";
  DROP INDEX "_case_studies_v_rels_locale_idx";
  DROP INDEX "_case_studies_v_rels_testimonials_id_idx";
  DROP INDEX "_case_studies_v_rels_faqs_id_idx";
  DROP INDEX "case_studies_rels_media_id_idx";
  DROP INDEX "_case_studies_v_rels_media_id_idx";
  CREATE INDEX "case_studies_rels_media_id_idx" ON "case_studies_rels" USING btree ("media_id");
  CREATE INDEX "_case_studies_v_rels_media_id_idx" ON "_case_studies_v_rels" USING btree ("media_id");
  ALTER TABLE "case_studies_locales" DROP COLUMN "status";
  ALTER TABLE "case_studies_rels" DROP COLUMN "locale";
  ALTER TABLE "case_studies_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "case_studies_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "_case_studies_v_locales" DROP COLUMN "version_status";
  ALTER TABLE "_case_studies_v_rels" DROP COLUMN "locale";
  ALTER TABLE "_case_studies_v_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "_case_studies_v_rels" DROP COLUMN "faqs_id";`)
}

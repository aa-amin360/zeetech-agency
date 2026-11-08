import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { runTolerant } from '../lib/tolerant-migration'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await runTolerant(db, `
   CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('en');
  CREATE TABLE "pages_blocks_services_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"text" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"background_id" integer,
  	"visual_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"intro" varchar,
  	"button_label" varchar DEFAULT 'Explore This Service',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"text" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"background_id" integer,
  	"visual_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"intro" varchar,
  	"button_label" varchar DEFAULT 'Explore This Service',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_deliverables_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_process_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_questions_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_project_inquiry_prep_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "services_blocks_project_inquiry" (
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
  	"prep_eyebrow" varchar,
  	"prep_title" varchar,
  	"prep_person_photo_id" integer,
  	"prep_person_name" varchar,
  	"prep_person_role" varchar,
  	"submit_label" varchar DEFAULT 'Send Inquiry',
  	"success_message" varchar DEFAULT 'Thank you — we’ll be in touch within one business day.',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_faq" (
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
  
  CREATE TABLE "services_blocks_client_stories" (
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
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar,
  	"image_id" integer,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_locales" (
  	"name" varchar,
  	"accent" varchar,
  	"kicker" varchar,
  	"summary" varchar,
  	"tagline" varchar,
  	"hero_highlight" varchar,
  	"hero_button_label" varchar DEFAULT 'Discuss your project',
  	"deliverables_heading_title" varchar DEFAULT 'What we deliver.',
  	"deliverables_heading_accent" varchar DEFAULT 'Built around your product.',
  	"process_heading_title" varchar DEFAULT 'A clear process.',
  	"process_heading_accent" varchar DEFAULT 'From first step to handoff.',
  	"questions_heading_title" varchar DEFAULT 'Before we start.',
  	"questions_heading_accent" varchar DEFAULT 'A few useful answers.',
  	"next_heading_title" varchar DEFAULT 'One connected team.',
  	"next_heading_accent" varchar DEFAULT 'Explore the next step.',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"faqs_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_services_v_version_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_deliverables_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_process_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_questions_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_project_inquiry_prep_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_project_inquiry" (
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
  
  CREATE TABLE "_services_v_blocks_faq" (
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
  
  CREATE TABLE "_services_v_blocks_client_stories" (
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
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_hero_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_name" varchar,
  	"version_accent" varchar,
  	"version_kicker" varchar,
  	"version_summary" varchar,
  	"version_tagline" varchar,
  	"version_hero_highlight" varchar,
  	"version_hero_button_label" varchar DEFAULT 'Discuss your project',
  	"version_deliverables_heading_title" varchar DEFAULT 'What we deliver.',
  	"version_deliverables_heading_accent" varchar DEFAULT 'Built around your product.',
  	"version_process_heading_title" varchar DEFAULT 'A clear process.',
  	"version_process_heading_accent" varchar DEFAULT 'From first step to handoff.',
  	"version_questions_heading_title" varchar DEFAULT 'Before we start.',
  	"version_questions_heading_accent" varchar DEFAULT 'A few useful answers.',
  	"version_next_heading_title" varchar DEFAULT 'One connected team.',
  	"version_next_heading_accent" varchar DEFAULT 'Explore the next step.',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"faqs_id" integer,
  	"testimonials_id" integer
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "pages_blocks_services_hero" ADD CONSTRAINT "pages_blocks_services_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_hero" ADD CONSTRAINT "pages_blocks_services_hero_visual_id_media_id_fk" FOREIGN KEY ("visual_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_hero" ADD CONSTRAINT "pages_blocks_services_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_list" ADD CONSTRAINT "pages_blocks_services_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_hero" ADD CONSTRAINT "_pages_v_blocks_services_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_hero" ADD CONSTRAINT "_pages_v_blocks_services_hero_visual_id_media_id_fk" FOREIGN KEY ("visual_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_hero" ADD CONSTRAINT "_pages_v_blocks_services_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_list" ADD CONSTRAINT "_pages_v_blocks_services_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_deliverables" ADD CONSTRAINT "services_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_deliverables_locales" ADD CONSTRAINT "services_deliverables_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_deliverables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process" ADD CONSTRAINT "services_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process_locales" ADD CONSTRAINT "services_process_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_questions" ADD CONSTRAINT "services_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_questions_locales" ADD CONSTRAINT "services_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_project_inquiry_prep_steps" ADD CONSTRAINT "services_blocks_project_inquiry_prep_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_project_inquiry"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_project_inquiry" ADD CONSTRAINT "services_blocks_project_inquiry_prep_person_photo_id_media_id_fk" FOREIGN KEY ("prep_person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_project_inquiry" ADD CONSTRAINT "services_blocks_project_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq" ADD CONSTRAINT "services_blocks_faq_help_card_background_id_media_id_fk" FOREIGN KEY ("help_card_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_faq" ADD CONSTRAINT "services_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_client_stories" ADD CONSTRAINT "services_blocks_client_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_texts" ADD CONSTRAINT "services_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_deliverables" ADD CONSTRAINT "_services_v_version_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_deliverables_locales" ADD CONSTRAINT "_services_v_version_deliverables_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_deliverables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_process" ADD CONSTRAINT "_services_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_process_locales" ADD CONSTRAINT "_services_v_version_process_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_questions" ADD CONSTRAINT "_services_v_version_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_questions_locales" ADD CONSTRAINT "_services_v_version_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_project_inquiry_prep_steps" ADD CONSTRAINT "_services_v_blocks_project_inquiry_prep_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_project_inquiry"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_project_inquiry" ADD CONSTRAINT "_services_v_blocks_project_inquiry_prep_person_photo_id_media_id_fk" FOREIGN KEY ("prep_person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_project_inquiry" ADD CONSTRAINT "_services_v_blocks_project_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq" ADD CONSTRAINT "_services_v_blocks_faq_help_card_background_id_media_id_fk" FOREIGN KEY ("help_card_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq" ADD CONSTRAINT "_services_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_client_stories" ADD CONSTRAINT "_services_v_blocks_client_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_texts" ADD CONSTRAINT "_services_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_services_hero_order_idx" ON "pages_blocks_services_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_hero_parent_id_idx" ON "pages_blocks_services_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_hero_path_idx" ON "pages_blocks_services_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_hero_locale_idx" ON "pages_blocks_services_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_services_hero_background_idx" ON "pages_blocks_services_hero" USING btree ("background_id");
  CREATE INDEX "pages_blocks_services_hero_visual_idx" ON "pages_blocks_services_hero" USING btree ("visual_id");
  CREATE INDEX "pages_blocks_services_list_order_idx" ON "pages_blocks_services_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_list_parent_id_idx" ON "pages_blocks_services_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_list_path_idx" ON "pages_blocks_services_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_list_locale_idx" ON "pages_blocks_services_list" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_services_hero_order_idx" ON "_pages_v_blocks_services_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_hero_parent_id_idx" ON "_pages_v_blocks_services_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_hero_path_idx" ON "_pages_v_blocks_services_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_hero_locale_idx" ON "_pages_v_blocks_services_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_services_hero_background_idx" ON "_pages_v_blocks_services_hero" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_services_hero_visual_idx" ON "_pages_v_blocks_services_hero" USING btree ("visual_id");
  CREATE INDEX "_pages_v_blocks_services_list_order_idx" ON "_pages_v_blocks_services_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_list_parent_id_idx" ON "_pages_v_blocks_services_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_list_path_idx" ON "_pages_v_blocks_services_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_list_locale_idx" ON "_pages_v_blocks_services_list" USING btree ("_locale");
  CREATE INDEX "services_deliverables_order_idx" ON "services_deliverables" USING btree ("_order");
  CREATE INDEX "services_deliverables_parent_id_idx" ON "services_deliverables" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_deliverables_locales_locale_parent_id_unique" ON "services_deliverables_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_process_order_idx" ON "services_process" USING btree ("_order");
  CREATE INDEX "services_process_parent_id_idx" ON "services_process" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_process_locales_locale_parent_id_unique" ON "services_process_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_questions_order_idx" ON "services_questions" USING btree ("_order");
  CREATE INDEX "services_questions_parent_id_idx" ON "services_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_questions_locales_locale_parent_id_unique" ON "services_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_project_inquiry_prep_steps_order_idx" ON "services_blocks_project_inquiry_prep_steps" USING btree ("_order");
  CREATE INDEX "services_blocks_project_inquiry_prep_steps_parent_id_idx" ON "services_blocks_project_inquiry_prep_steps" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_project_inquiry_prep_steps_locale_idx" ON "services_blocks_project_inquiry_prep_steps" USING btree ("_locale");
  CREATE INDEX "services_blocks_project_inquiry_order_idx" ON "services_blocks_project_inquiry" USING btree ("_order");
  CREATE INDEX "services_blocks_project_inquiry_parent_id_idx" ON "services_blocks_project_inquiry" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_project_inquiry_path_idx" ON "services_blocks_project_inquiry" USING btree ("_path");
  CREATE INDEX "services_blocks_project_inquiry_locale_idx" ON "services_blocks_project_inquiry" USING btree ("_locale");
  CREATE INDEX "services_blocks_project_inquiry_prep_person_prep_person__idx" ON "services_blocks_project_inquiry" USING btree ("prep_person_photo_id");
  CREATE INDEX "services_blocks_faq_order_idx" ON "services_blocks_faq" USING btree ("_order");
  CREATE INDEX "services_blocks_faq_parent_id_idx" ON "services_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_faq_path_idx" ON "services_blocks_faq" USING btree ("_path");
  CREATE INDEX "services_blocks_faq_locale_idx" ON "services_blocks_faq" USING btree ("_locale");
  CREATE INDEX "services_blocks_faq_help_card_help_card_background_idx" ON "services_blocks_faq" USING btree ("help_card_background_id");
  CREATE INDEX "services_blocks_client_stories_order_idx" ON "services_blocks_client_stories" USING btree ("_order");
  CREATE INDEX "services_blocks_client_stories_parent_id_idx" ON "services_blocks_client_stories" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_client_stories_path_idx" ON "services_blocks_client_stories" USING btree ("_path");
  CREATE INDEX "services_blocks_client_stories_locale_idx" ON "services_blocks_client_stories" USING btree ("_locale");
  CREATE INDEX "services__order_idx" ON "services" USING btree ("_order");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_hero_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_meta_meta_image_idx" ON "services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_texts_order_parent" ON "services_texts" USING btree ("order","parent_id");
  CREATE INDEX "services_texts_locale_parent" ON "services_texts" USING btree ("locale","parent_id");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_locale_idx" ON "services_rels" USING btree ("locale");
  CREATE INDEX "services_rels_media_id_idx" ON "services_rels" USING btree ("media_id","locale");
  CREATE INDEX "services_rels_faqs_id_idx" ON "services_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "services_rels_testimonials_id_idx" ON "services_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "_services_v_version_deliverables_order_idx" ON "_services_v_version_deliverables" USING btree ("_order");
  CREATE INDEX "_services_v_version_deliverables_parent_id_idx" ON "_services_v_version_deliverables" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_deliverables_locales_locale_parent_id_un" ON "_services_v_version_deliverables_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_process_order_idx" ON "_services_v_version_process" USING btree ("_order");
  CREATE INDEX "_services_v_version_process_parent_id_idx" ON "_services_v_version_process" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_process_locales_locale_parent_id_unique" ON "_services_v_version_process_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_questions_order_idx" ON "_services_v_version_questions" USING btree ("_order");
  CREATE INDEX "_services_v_version_questions_parent_id_idx" ON "_services_v_version_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_questions_locales_locale_parent_id_uniqu" ON "_services_v_version_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_project_inquiry_prep_steps_order_idx" ON "_services_v_blocks_project_inquiry_prep_steps" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_project_inquiry_prep_steps_parent_id_idx" ON "_services_v_blocks_project_inquiry_prep_steps" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_project_inquiry_prep_steps_locale_idx" ON "_services_v_blocks_project_inquiry_prep_steps" USING btree ("_locale");
  CREATE INDEX "_services_v_blocks_project_inquiry_order_idx" ON "_services_v_blocks_project_inquiry" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_project_inquiry_parent_id_idx" ON "_services_v_blocks_project_inquiry" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_project_inquiry_path_idx" ON "_services_v_blocks_project_inquiry" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_project_inquiry_locale_idx" ON "_services_v_blocks_project_inquiry" USING btree ("_locale");
  CREATE INDEX "_services_v_blocks_project_inquiry_prep_person_prep_pers_idx" ON "_services_v_blocks_project_inquiry" USING btree ("prep_person_photo_id");
  CREATE INDEX "_services_v_blocks_faq_order_idx" ON "_services_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_faq_parent_id_idx" ON "_services_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_faq_path_idx" ON "_services_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_faq_locale_idx" ON "_services_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_services_v_blocks_faq_help_card_help_card_background_idx" ON "_services_v_blocks_faq" USING btree ("help_card_background_id");
  CREATE INDEX "_services_v_blocks_client_stories_order_idx" ON "_services_v_blocks_client_stories" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_client_stories_parent_id_idx" ON "_services_v_blocks_client_stories" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_client_stories_path_idx" ON "_services_v_blocks_client_stories" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_client_stories_locale_idx" ON "_services_v_blocks_client_stories" USING btree ("_locale");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version__order_idx" ON "_services_v" USING btree ("version__order");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_image_idx" ON "_services_v" USING btree ("version_image_id");
  CREATE INDEX "_services_v_version_hero_version_hero_image_idx" ON "_services_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "_services_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_texts_order_parent" ON "_services_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_services_v_texts_locale_parent" ON "_services_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_locale_idx" ON "_services_v_rels" USING btree ("locale");
  CREATE INDEX "_services_v_rels_media_id_idx" ON "_services_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_services_v_rels_faqs_id_idx" ON "_services_v_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "_services_v_rels_testimonials_id_idx" ON "_services_v_rels" USING btree ("testimonials_id","locale");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id","locale");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id","locale");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_services_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_services_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_services_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_deliverables_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_process_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_questions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_project_inquiry_prep_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_project_inquiry" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_client_stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_deliverables_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_process_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_questions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_project_inquiry_prep_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_project_inquiry" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_client_stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_services_hero" CASCADE;
  DROP TABLE "pages_blocks_services_list" CASCADE;
  DROP TABLE "_pages_v_blocks_services_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_services_list" CASCADE;
  DROP TABLE "services_deliverables" CASCADE;
  DROP TABLE "services_deliverables_locales" CASCADE;
  DROP TABLE "services_process" CASCADE;
  DROP TABLE "services_process_locales" CASCADE;
  DROP TABLE "services_questions" CASCADE;
  DROP TABLE "services_questions_locales" CASCADE;
  DROP TABLE "services_blocks_project_inquiry_prep_steps" CASCADE;
  DROP TABLE "services_blocks_project_inquiry" CASCADE;
  DROP TABLE "services_blocks_faq" CASCADE;
  DROP TABLE "services_blocks_client_stories" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "services_texts" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_deliverables" CASCADE;
  DROP TABLE "_services_v_version_deliverables_locales" CASCADE;
  DROP TABLE "_services_v_version_process" CASCADE;
  DROP TABLE "_services_v_version_process_locales" CASCADE;
  DROP TABLE "_services_v_version_questions" CASCADE;
  DROP TABLE "_services_v_version_questions_locales" CASCADE;
  DROP TABLE "_services_v_blocks_project_inquiry_prep_steps" CASCADE;
  DROP TABLE "_services_v_blocks_project_inquiry" CASCADE;
  DROP TABLE "_services_v_blocks_faq" CASCADE;
  DROP TABLE "_services_v_blocks_client_stories" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "_services_v_texts" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_services_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  DROP INDEX "pages_rels_services_id_idx";
  DROP INDEX "_pages_v_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "services_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";`)
}

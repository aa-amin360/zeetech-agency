import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_pages_blocks_why_zeetech_reel_source" AS ENUM('none', 'upload', 'youtube', 'vimeo', 'bunny', 'url');
  CREATE TYPE "public"."enum_pages_blocks_delivery_principles_cards_theme" AS ENUM('dark', 'white', 'yellow', 'blue', 'pink', 'purple');
  CREATE TYPE "public"."enum_pages_blocks_delivery_principles_cards_visual" AS ENUM('image', 'fill', 'orbit');
  CREATE TYPE "public"."enum_pages_blocks_comparison_rows_cells_mark" AS ENUM('yes', 'check', 'dot', 'no');
  CREATE TYPE "public"."enum_pages_blocks_comparison_rows_ring" AS ENUM('orange', 'green', 'lime', 'yellow');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_why_zeetech_reel_source" AS ENUM('none', 'upload', 'youtube', 'vimeo', 'bunny', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_delivery_principles_cards_theme" AS ENUM('dark', 'white', 'yellow', 'blue', 'pink', 'purple');
  CREATE TYPE "public"."enum__pages_v_blocks_delivery_principles_cards_visual" AS ENUM('image', 'fill', 'orbit');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_rows_cells_mark" AS ENUM('yes', 'check', 'dot', 'no');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_rows_ring" AS ENUM('orange', 'green', 'lime', 'yellow');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_testimonials_type" AS ENUM('text', 'video');
  CREATE TYPE "public"."enum_testimonials_video_source" AS ENUM('none', 'upload', 'youtube', 'vimeo', 'bunny', 'url');
  CREATE TYPE "public"."enum_testimonials_source_platform" AS ENUM('upwork', 'fiverr', 'clutch', 'google', 'linkedin', 'direct');
  CREATE TYPE "public"."enum_testimonials_origin" AS ENUM('admin', 'client');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_type" AS ENUM('text', 'video');
  CREATE TYPE "public"."enum__testimonials_v_version_video_source" AS ENUM('none', 'upload', 'youtube', 'vimeo', 'bunny', 'url');
  CREATE TYPE "public"."enum__testimonials_v_version_source_platform" AS ENUM('upwork', 'fiverr', 'clutch', 'google', 'linkedin', 'direct');
  CREATE TYPE "public"."enum__testimonials_v_version_origin" AS ENUM('admin', 'client');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'proposal', 'won', 'lost');
  CREATE TYPE "public"."enum_feedback_requests_status" AS ENUM('open', 'submitted', 'closed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trust_prefix" varchar DEFAULT 'Trusted by',
  	"trust_badge" varchar DEFAULT '40+',
  	"trust_suffix" varchar DEFAULT 'product teams worldwide',
  	"headline_line1" varchar,
  	"headline_line2" varchar,
  	"headline_line3" varchar,
  	"headline_highlight" varchar,
  	"lede" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"show_backdrop_controls" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line1" varchar,
  	"line2" varchar,
  	"accent" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_client_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_client_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_proof_stats_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"image_id" integer,
  	"round" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_proof_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"testimonial_id" integer,
  	"rating_value" numeric,
  	"rating_icon_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_selected_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"note" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_why_zeetech" (
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
  	"reel_source" "enum_pages_blocks_why_zeetech_reel_source" DEFAULT 'none',
  	"reel_file_id" integer,
  	"reel_url" varchar,
  	"reel_poster_id" integer,
  	"reel_captions_id" integer,
  	"reel_transcript" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_client_stories" (
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
  
  CREATE TABLE "pages_blocks_how_we_deliver_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"tag" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "pages_blocks_how_we_deliver" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_highlight" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"heading_subtitle" varchar,
  	"preview_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_how_we_build_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_how_we_build" (
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
  	"footer_text" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_delivery_principles_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"theme" "enum_pages_blocks_delivery_principles_cards_theme" DEFAULT 'white',
  	"visual" "enum_pages_blocks_delivery_principles_cards_visual" DEFAULT 'image',
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_delivery_principles" (
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
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mark" "enum_pages_blocks_comparison_rows_cells_mark" DEFAULT 'dot'
  );
  
  CREATE TABLE "pages_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"highlight" boolean,
  	"description" varchar,
  	"icon_id" integer,
  	"ring" "enum_pages_blocks_comparison_rows_ring" DEFAULT 'orange'
  );
  
  CREATE TABLE "pages_blocks_comparison" (
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
  	"first_column_label" varchar DEFAULT 'Delivery Model',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_showreel" (
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
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
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
  
  CREATE TABLE "pages_blocks_project_inquiry_prep_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_project_inquiry" (
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
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"case_studies_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"trust_prefix" varchar DEFAULT 'Trusted by',
  	"trust_badge" varchar DEFAULT '40+',
  	"trust_suffix" varchar DEFAULT 'product teams worldwide',
  	"headline_line1" varchar,
  	"headline_line2" varchar,
  	"headline_line3" varchar,
  	"headline_highlight" varchar,
  	"lede" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"show_backdrop_controls" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line1" varchar,
  	"line2" varchar,
  	"accent" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_client_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_client_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof_stats_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"image_id" integer,
  	"round" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"testimonial_id" integer,
  	"rating_value" numeric,
  	"rating_icon_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_selected_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"note" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_zeetech" (
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
  	"reel_source" "enum__pages_v_blocks_why_zeetech_reel_source" DEFAULT 'none',
  	"reel_file_id" integer,
  	"reel_url" varchar,
  	"reel_poster_id" integer,
  	"reel_captions_id" integer,
  	"reel_transcript" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_client_stories" (
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
  
  CREATE TABLE "_pages_v_blocks_how_we_deliver_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"tag" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_we_deliver" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_eyebrow" varchar,
  	"heading_title" varchar,
  	"heading_accent" varchar,
  	"heading_highlight" varchar,
  	"heading_accent_on_new_line" boolean DEFAULT true,
  	"heading_subtitle" varchar,
  	"preview_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_we_build_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_we_build" (
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
  	"footer_text" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_delivery_principles_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"theme" "enum__pages_v_blocks_delivery_principles_cards_theme" DEFAULT 'white',
  	"visual" "enum__pages_v_blocks_delivery_principles_cards_visual" DEFAULT 'image',
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_delivery_principles" (
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
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mark" "enum__pages_v_blocks_comparison_rows_cells_mark" DEFAULT 'dot',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"highlight" boolean,
  	"description" varchar,
  	"icon_id" integer,
  	"ring" "enum__pages_v_blocks_comparison_rows_ring" DEFAULT 'orange',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison" (
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
  	"first_column_label" varchar DEFAULT 'Delivery Model',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_showreel" (
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
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
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
  
  CREATE TABLE "_pages_v_blocks_project_inquiry_prep_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_inquiry" (
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
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"case_studies_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar,
  	"project_label" varchar,
  	"client" varchar,
  	"color" varchar DEFAULT '#ff8648',
  	"cover_id" integer,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_avatar_id" integer,
  	"testimonial_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"scope" varchar,
  	"duration" varchar,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_slug" varchar,
  	"version_project_label" varchar,
  	"version_client" varchar,
  	"version_color" varchar DEFAULT '#ff8648',
  	"version_cover_id" integer,
  	"version_person_name" varchar,
  	"version_person_role" varchar,
  	"version_person_avatar_id" integer,
  	"version_testimonial_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__case_studies_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_case_studies_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_scope" varchar,
  	"version_duration" varchar,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar,
  	"company" varchar,
  	"photo_id" integer,
  	"type" "enum_testimonials_type" DEFAULT 'text',
  	"video_source" "enum_testimonials_video_source" DEFAULT 'none',
  	"video_file_id" integer,
  	"video_url" varchar,
  	"video_poster_id" integer,
  	"video_captions_id" integer,
  	"video_transcript" varchar,
  	"source_platform" "enum_testimonials_source_platform",
  	"source_rating" numeric,
  	"source_review_url" varchar,
  	"source_logo_id" integer,
  	"source_badge_id" integer,
  	"featured" boolean DEFAULT false,
  	"origin" "enum_testimonials_origin" DEFAULT 'admin',
  	"consent" boolean,
  	"feedback_request_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "testimonials_locales" (
  	"role" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_name" varchar,
  	"version_company" varchar,
  	"version_photo_id" integer,
  	"version_type" "enum__testimonials_v_version_type" DEFAULT 'text',
  	"version_video_source" "enum__testimonials_v_version_video_source" DEFAULT 'none',
  	"version_video_file_id" integer,
  	"version_video_url" varchar,
  	"version_video_poster_id" integer,
  	"version_video_captions_id" integer,
  	"version_video_transcript" varchar,
  	"version_source_platform" "enum__testimonials_v_version_source_platform",
  	"version_source_rating" numeric,
  	"version_source_review_url" varchar,
  	"version_source_logo_id" integer,
  	"version_source_badge_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_origin" "enum__testimonials_v_version_origin" DEFAULT 'admin',
  	"version_consent" boolean,
  	"version_feedback_request_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__testimonials_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_testimonials_v_locales" (
  	"version_role" varchar,
  	"version_quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"budget" varchar,
  	"details" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"notes" varchar,
  	"attribution_utm_source" varchar,
  	"attribution_utm_medium" varchar,
  	"attribution_utm_campaign" varchar,
  	"attribution_utm_term" varchar,
  	"attribution_utm_content" varchar,
  	"attribution_click_id" varchar,
  	"attribution_referrer" varchar,
  	"attribution_landing_page" varchar,
  	"attribution_form_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "feedback_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"company" varchar,
  	"client_email" varchar,
  	"project" varchar,
  	"email_client" boolean DEFAULT false,
  	"status" "enum_feedback_requests_status" DEFAULT 'open',
  	"expires_at" timestamp(3) with time zone,
  	"invited_at" timestamp(3) with time zone,
  	"testimonial_id" integer,
  	"token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"case_studies_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"leads_id" integer,
  	"feedback_requests_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email_label" varchar DEFAULT 'EMAIL THE STUDIO',
  	"email" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"pitch_kicker" varchar,
  	"pitch_title" varchar,
  	"pitch_tagline" varchar,
  	"brand_text" varchar,
  	"brand_location" varchar,
  	"bottom_meta_left" varchar,
  	"bottom_meta_right" varchar,
  	"bottom_copyright" varchar,
  	"bottom_built_with" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'ZeeTech',
  	"title_template" varchar DEFAULT '%s — ZeeTech',
  	"default_share_image_id" integer,
  	"legal_name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"address" varchar,
  	"gtm_id" varchar,
  	"ga4_id" varchar,
  	"meta_pixel_id" varchar,
  	"linkedin_partner_id" varchar,
  	"search_console_token" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"default_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement" ADD CONSTRAINT "pages_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_client_logos_logos" ADD CONSTRAINT "pages_blocks_client_logos_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_client_logos_logos" ADD CONSTRAINT "pages_blocks_client_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_client_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_client_logos" ADD CONSTRAINT "pages_blocks_client_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_stats_awards" ADD CONSTRAINT "pages_blocks_proof_stats_awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_stats_awards" ADD CONSTRAINT "pages_blocks_proof_stats_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_proof_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_stats_stats" ADD CONSTRAINT "pages_blocks_proof_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_proof_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_stats" ADD CONSTRAINT "pages_blocks_proof_stats_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_stats" ADD CONSTRAINT "pages_blocks_proof_stats_rating_icon_id_media_id_fk" FOREIGN KEY ("rating_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_stats" ADD CONSTRAINT "pages_blocks_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_selected_work" ADD CONSTRAINT "pages_blocks_selected_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_zeetech" ADD CONSTRAINT "pages_blocks_why_zeetech_reel_file_id_media_id_fk" FOREIGN KEY ("reel_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_zeetech" ADD CONSTRAINT "pages_blocks_why_zeetech_reel_poster_id_media_id_fk" FOREIGN KEY ("reel_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_zeetech" ADD CONSTRAINT "pages_blocks_why_zeetech_reel_captions_id_media_id_fk" FOREIGN KEY ("reel_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_zeetech" ADD CONSTRAINT "pages_blocks_why_zeetech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_client_stories" ADD CONSTRAINT "pages_blocks_client_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_we_deliver_services" ADD CONSTRAINT "pages_blocks_how_we_deliver_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_we_deliver_services" ADD CONSTRAINT "pages_blocks_how_we_deliver_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_how_we_deliver"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_we_deliver" ADD CONSTRAINT "pages_blocks_how_we_deliver_preview_id_media_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_we_deliver" ADD CONSTRAINT "pages_blocks_how_we_deliver_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_we_build_stages" ADD CONSTRAINT "pages_blocks_how_we_build_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_how_we_build"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_we_build" ADD CONSTRAINT "pages_blocks_how_we_build_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_delivery_principles_cards" ADD CONSTRAINT "pages_blocks_delivery_principles_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_delivery_principles_cards" ADD CONSTRAINT "pages_blocks_delivery_principles_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_delivery_principles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_delivery_principles" ADD CONSTRAINT "pages_blocks_delivery_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows_cells" ADD CONSTRAINT "pages_blocks_comparison_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows" ADD CONSTRAINT "pages_blocks_comparison_rows_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows" ADD CONSTRAINT "pages_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison" ADD CONSTRAINT "pages_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_showreel" ADD CONSTRAINT "pages_blocks_showreel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_help_card_background_id_media_id_fk" FOREIGN KEY ("help_card_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_inquiry_prep_steps" ADD CONSTRAINT "pages_blocks_project_inquiry_prep_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_inquiry"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_inquiry" ADD CONSTRAINT "pages_blocks_project_inquiry_prep_person_photo_id_media_id_fk" FOREIGN KEY ("prep_person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_inquiry" ADD CONSTRAINT "pages_blocks_project_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement" ADD CONSTRAINT "_pages_v_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_client_logos_logos" ADD CONSTRAINT "_pages_v_blocks_client_logos_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_client_logos_logos" ADD CONSTRAINT "_pages_v_blocks_client_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_client_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_client_logos" ADD CONSTRAINT "_pages_v_blocks_client_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_stats_awards" ADD CONSTRAINT "_pages_v_blocks_proof_stats_awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_stats_awards" ADD CONSTRAINT "_pages_v_blocks_proof_stats_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_proof_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_stats_stats" ADD CONSTRAINT "_pages_v_blocks_proof_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_proof_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_stats" ADD CONSTRAINT "_pages_v_blocks_proof_stats_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_stats" ADD CONSTRAINT "_pages_v_blocks_proof_stats_rating_icon_id_media_id_fk" FOREIGN KEY ("rating_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_stats" ADD CONSTRAINT "_pages_v_blocks_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_selected_work" ADD CONSTRAINT "_pages_v_blocks_selected_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_zeetech" ADD CONSTRAINT "_pages_v_blocks_why_zeetech_reel_file_id_media_id_fk" FOREIGN KEY ("reel_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_zeetech" ADD CONSTRAINT "_pages_v_blocks_why_zeetech_reel_poster_id_media_id_fk" FOREIGN KEY ("reel_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_zeetech" ADD CONSTRAINT "_pages_v_blocks_why_zeetech_reel_captions_id_media_id_fk" FOREIGN KEY ("reel_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_zeetech" ADD CONSTRAINT "_pages_v_blocks_why_zeetech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_client_stories" ADD CONSTRAINT "_pages_v_blocks_client_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_we_deliver_services" ADD CONSTRAINT "_pages_v_blocks_how_we_deliver_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_we_deliver_services" ADD CONSTRAINT "_pages_v_blocks_how_we_deliver_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_how_we_deliver"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_we_deliver" ADD CONSTRAINT "_pages_v_blocks_how_we_deliver_preview_id_media_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_we_deliver" ADD CONSTRAINT "_pages_v_blocks_how_we_deliver_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_we_build_stages" ADD CONSTRAINT "_pages_v_blocks_how_we_build_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_how_we_build"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_we_build" ADD CONSTRAINT "_pages_v_blocks_how_we_build_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_delivery_principles_cards" ADD CONSTRAINT "_pages_v_blocks_delivery_principles_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_delivery_principles_cards" ADD CONSTRAINT "_pages_v_blocks_delivery_principles_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_delivery_principles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_delivery_principles" ADD CONSTRAINT "_pages_v_blocks_delivery_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows_cells" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison" ADD CONSTRAINT "_pages_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_showreel" ADD CONSTRAINT "_pages_v_blocks_showreel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_help_card_background_id_media_id_fk" FOREIGN KEY ("help_card_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_inquiry_prep_steps" ADD CONSTRAINT "_pages_v_blocks_project_inquiry_prep_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_inquiry"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_inquiry" ADD CONSTRAINT "_pages_v_blocks_project_inquiry_prep_person_photo_id_media_id_fk" FOREIGN KEY ("prep_person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_inquiry" ADD CONSTRAINT "_pages_v_blocks_project_inquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_person_avatar_id_media_id_fk" FOREIGN KEY ("person_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_person_avatar_id_media_id_fk" FOREIGN KEY ("version_person_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_testimonial_id_testimonials_id_fk" FOREIGN KEY ("version_testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_video_captions_id_media_id_fk" FOREIGN KEY ("video_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_source_logo_id_media_id_fk" FOREIGN KEY ("source_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_source_badge_id_media_id_fk" FOREIGN KEY ("source_badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_feedback_request_id_feedback_requests_id_fk" FOREIGN KEY ("feedback_request_id") REFERENCES "public"."feedback_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_video_file_id_media_id_fk" FOREIGN KEY ("version_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_video_poster_id_media_id_fk" FOREIGN KEY ("version_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_video_captions_id_media_id_fk" FOREIGN KEY ("version_video_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_source_logo_id_media_id_fk" FOREIGN KEY ("version_source_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_source_badge_id_media_id_fk" FOREIGN KEY ("version_source_badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_feedback_request_id_feedback_requests_id_fk" FOREIGN KEY ("version_feedback_request_id") REFERENCES "public"."feedback_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "feedback_requests" ADD CONSTRAINT "feedback_requests_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_requests_fk" FOREIGN KEY ("feedback_requests_id") REFERENCES "public"."feedback_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_links" ADD CONSTRAINT "header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_strip" ADD CONSTRAINT "footer_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_share_image_id_media_id_fk" FOREIGN KEY ("default_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_statement_order_idx" ON "pages_blocks_statement" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_parent_id_idx" ON "pages_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statement_path_idx" ON "pages_blocks_statement" USING btree ("_path");
  CREATE INDEX "pages_blocks_statement_locale_idx" ON "pages_blocks_statement" USING btree ("_locale");
  CREATE INDEX "pages_blocks_client_logos_logos_order_idx" ON "pages_blocks_client_logos_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_client_logos_logos_parent_id_idx" ON "pages_blocks_client_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_client_logos_logos_locale_idx" ON "pages_blocks_client_logos_logos" USING btree ("_locale");
  CREATE INDEX "pages_blocks_client_logos_logos_logo_idx" ON "pages_blocks_client_logos_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_client_logos_order_idx" ON "pages_blocks_client_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_client_logos_parent_id_idx" ON "pages_blocks_client_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_client_logos_path_idx" ON "pages_blocks_client_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_client_logos_locale_idx" ON "pages_blocks_client_logos" USING btree ("_locale");
  CREATE INDEX "pages_blocks_proof_stats_awards_order_idx" ON "pages_blocks_proof_stats_awards" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_stats_awards_parent_id_idx" ON "pages_blocks_proof_stats_awards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_proof_stats_awards_locale_idx" ON "pages_blocks_proof_stats_awards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_proof_stats_awards_image_idx" ON "pages_blocks_proof_stats_awards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_proof_stats_stats_order_idx" ON "pages_blocks_proof_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_stats_stats_parent_id_idx" ON "pages_blocks_proof_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_proof_stats_stats_locale_idx" ON "pages_blocks_proof_stats_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_proof_stats_order_idx" ON "pages_blocks_proof_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_stats_parent_id_idx" ON "pages_blocks_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_proof_stats_path_idx" ON "pages_blocks_proof_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_proof_stats_locale_idx" ON "pages_blocks_proof_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_proof_stats_testimonial_idx" ON "pages_blocks_proof_stats" USING btree ("testimonial_id");
  CREATE INDEX "pages_blocks_proof_stats_rating_rating_icon_idx" ON "pages_blocks_proof_stats" USING btree ("rating_icon_id");
  CREATE INDEX "pages_blocks_selected_work_order_idx" ON "pages_blocks_selected_work" USING btree ("_order");
  CREATE INDEX "pages_blocks_selected_work_parent_id_idx" ON "pages_blocks_selected_work" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_selected_work_path_idx" ON "pages_blocks_selected_work" USING btree ("_path");
  CREATE INDEX "pages_blocks_selected_work_locale_idx" ON "pages_blocks_selected_work" USING btree ("_locale");
  CREATE INDEX "pages_blocks_why_zeetech_order_idx" ON "pages_blocks_why_zeetech" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_zeetech_parent_id_idx" ON "pages_blocks_why_zeetech" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_zeetech_path_idx" ON "pages_blocks_why_zeetech" USING btree ("_path");
  CREATE INDEX "pages_blocks_why_zeetech_locale_idx" ON "pages_blocks_why_zeetech" USING btree ("_locale");
  CREATE INDEX "pages_blocks_why_zeetech_reel_reel_file_idx" ON "pages_blocks_why_zeetech" USING btree ("reel_file_id");
  CREATE INDEX "pages_blocks_why_zeetech_reel_reel_poster_idx" ON "pages_blocks_why_zeetech" USING btree ("reel_poster_id");
  CREATE INDEX "pages_blocks_why_zeetech_reel_reel_captions_idx" ON "pages_blocks_why_zeetech" USING btree ("reel_captions_id");
  CREATE INDEX "pages_blocks_client_stories_order_idx" ON "pages_blocks_client_stories" USING btree ("_order");
  CREATE INDEX "pages_blocks_client_stories_parent_id_idx" ON "pages_blocks_client_stories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_client_stories_path_idx" ON "pages_blocks_client_stories" USING btree ("_path");
  CREATE INDEX "pages_blocks_client_stories_locale_idx" ON "pages_blocks_client_stories" USING btree ("_locale");
  CREATE INDEX "pages_blocks_how_we_deliver_services_order_idx" ON "pages_blocks_how_we_deliver_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_we_deliver_services_parent_id_idx" ON "pages_blocks_how_we_deliver_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_we_deliver_services_locale_idx" ON "pages_blocks_how_we_deliver_services" USING btree ("_locale");
  CREATE INDEX "pages_blocks_how_we_deliver_services_image_idx" ON "pages_blocks_how_we_deliver_services" USING btree ("image_id");
  CREATE INDEX "pages_blocks_how_we_deliver_order_idx" ON "pages_blocks_how_we_deliver" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_we_deliver_parent_id_idx" ON "pages_blocks_how_we_deliver" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_we_deliver_path_idx" ON "pages_blocks_how_we_deliver" USING btree ("_path");
  CREATE INDEX "pages_blocks_how_we_deliver_locale_idx" ON "pages_blocks_how_we_deliver" USING btree ("_locale");
  CREATE INDEX "pages_blocks_how_we_deliver_preview_idx" ON "pages_blocks_how_we_deliver" USING btree ("preview_id");
  CREATE INDEX "pages_blocks_how_we_build_stages_order_idx" ON "pages_blocks_how_we_build_stages" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_we_build_stages_parent_id_idx" ON "pages_blocks_how_we_build_stages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_we_build_stages_locale_idx" ON "pages_blocks_how_we_build_stages" USING btree ("_locale");
  CREATE INDEX "pages_blocks_how_we_build_order_idx" ON "pages_blocks_how_we_build" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_we_build_parent_id_idx" ON "pages_blocks_how_we_build" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_we_build_path_idx" ON "pages_blocks_how_we_build" USING btree ("_path");
  CREATE INDEX "pages_blocks_how_we_build_locale_idx" ON "pages_blocks_how_we_build" USING btree ("_locale");
  CREATE INDEX "pages_blocks_delivery_principles_cards_order_idx" ON "pages_blocks_delivery_principles_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_delivery_principles_cards_parent_id_idx" ON "pages_blocks_delivery_principles_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_delivery_principles_cards_locale_idx" ON "pages_blocks_delivery_principles_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_delivery_principles_cards_image_idx" ON "pages_blocks_delivery_principles_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_delivery_principles_order_idx" ON "pages_blocks_delivery_principles" USING btree ("_order");
  CREATE INDEX "pages_blocks_delivery_principles_parent_id_idx" ON "pages_blocks_delivery_principles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_delivery_principles_path_idx" ON "pages_blocks_delivery_principles" USING btree ("_path");
  CREATE INDEX "pages_blocks_delivery_principles_locale_idx" ON "pages_blocks_delivery_principles" USING btree ("_locale");
  CREATE INDEX "pages_blocks_comparison_rows_cells_order_idx" ON "pages_blocks_comparison_rows_cells" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_rows_cells_parent_id_idx" ON "pages_blocks_comparison_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_rows_cells_locale_idx" ON "pages_blocks_comparison_rows_cells" USING btree ("_locale");
  CREATE INDEX "pages_blocks_comparison_rows_order_idx" ON "pages_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_rows_parent_id_idx" ON "pages_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_rows_locale_idx" ON "pages_blocks_comparison_rows" USING btree ("_locale");
  CREATE INDEX "pages_blocks_comparison_rows_icon_idx" ON "pages_blocks_comparison_rows" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_comparison_order_idx" ON "pages_blocks_comparison" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_parent_id_idx" ON "pages_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_path_idx" ON "pages_blocks_comparison" USING btree ("_path");
  CREATE INDEX "pages_blocks_comparison_locale_idx" ON "pages_blocks_comparison" USING btree ("_locale");
  CREATE INDEX "pages_blocks_showreel_order_idx" ON "pages_blocks_showreel" USING btree ("_order");
  CREATE INDEX "pages_blocks_showreel_parent_id_idx" ON "pages_blocks_showreel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_showreel_path_idx" ON "pages_blocks_showreel" USING btree ("_path");
  CREATE INDEX "pages_blocks_showreel_locale_idx" ON "pages_blocks_showreel" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_help_card_help_card_background_idx" ON "pages_blocks_faq" USING btree ("help_card_background_id");
  CREATE INDEX "pages_blocks_project_inquiry_prep_steps_order_idx" ON "pages_blocks_project_inquiry_prep_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_inquiry_prep_steps_parent_id_idx" ON "pages_blocks_project_inquiry_prep_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_inquiry_prep_steps_locale_idx" ON "pages_blocks_project_inquiry_prep_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_project_inquiry_order_idx" ON "pages_blocks_project_inquiry" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_inquiry_parent_id_idx" ON "pages_blocks_project_inquiry" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_inquiry_path_idx" ON "pages_blocks_project_inquiry" USING btree ("_path");
  CREATE INDEX "pages_blocks_project_inquiry_locale_idx" ON "pages_blocks_project_inquiry" USING btree ("_locale");
  CREATE INDEX "pages_blocks_project_inquiry_prep_person_prep_person_pho_idx" ON "pages_blocks_project_inquiry" USING btree ("prep_person_photo_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_texts_locale_parent" ON "pages_texts" USING btree ("locale","parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id","locale");
  CREATE INDEX "pages_rels_case_studies_id_idx" ON "pages_rels" USING btree ("case_studies_id","locale");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_locale_idx" ON "_pages_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_statement_order_idx" ON "_pages_v_blocks_statement" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statement_parent_id_idx" ON "_pages_v_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statement_path_idx" ON "_pages_v_blocks_statement" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_statement_locale_idx" ON "_pages_v_blocks_statement" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_client_logos_logos_order_idx" ON "_pages_v_blocks_client_logos_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_client_logos_logos_parent_id_idx" ON "_pages_v_blocks_client_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_client_logos_logos_locale_idx" ON "_pages_v_blocks_client_logos_logos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_client_logos_logos_logo_idx" ON "_pages_v_blocks_client_logos_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_client_logos_order_idx" ON "_pages_v_blocks_client_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_client_logos_parent_id_idx" ON "_pages_v_blocks_client_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_client_logos_path_idx" ON "_pages_v_blocks_client_logos" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_client_logos_locale_idx" ON "_pages_v_blocks_client_logos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_proof_stats_awards_order_idx" ON "_pages_v_blocks_proof_stats_awards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_stats_awards_parent_id_idx" ON "_pages_v_blocks_proof_stats_awards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_proof_stats_awards_locale_idx" ON "_pages_v_blocks_proof_stats_awards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_proof_stats_awards_image_idx" ON "_pages_v_blocks_proof_stats_awards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_proof_stats_stats_order_idx" ON "_pages_v_blocks_proof_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_stats_stats_parent_id_idx" ON "_pages_v_blocks_proof_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_proof_stats_stats_locale_idx" ON "_pages_v_blocks_proof_stats_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_proof_stats_order_idx" ON "_pages_v_blocks_proof_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_stats_parent_id_idx" ON "_pages_v_blocks_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_proof_stats_path_idx" ON "_pages_v_blocks_proof_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_proof_stats_locale_idx" ON "_pages_v_blocks_proof_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_proof_stats_testimonial_idx" ON "_pages_v_blocks_proof_stats" USING btree ("testimonial_id");
  CREATE INDEX "_pages_v_blocks_proof_stats_rating_rating_icon_idx" ON "_pages_v_blocks_proof_stats" USING btree ("rating_icon_id");
  CREATE INDEX "_pages_v_blocks_selected_work_order_idx" ON "_pages_v_blocks_selected_work" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_selected_work_parent_id_idx" ON "_pages_v_blocks_selected_work" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_selected_work_path_idx" ON "_pages_v_blocks_selected_work" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_selected_work_locale_idx" ON "_pages_v_blocks_selected_work" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_why_zeetech_order_idx" ON "_pages_v_blocks_why_zeetech" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_zeetech_parent_id_idx" ON "_pages_v_blocks_why_zeetech" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_zeetech_path_idx" ON "_pages_v_blocks_why_zeetech" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_why_zeetech_locale_idx" ON "_pages_v_blocks_why_zeetech" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_why_zeetech_reel_reel_file_idx" ON "_pages_v_blocks_why_zeetech" USING btree ("reel_file_id");
  CREATE INDEX "_pages_v_blocks_why_zeetech_reel_reel_poster_idx" ON "_pages_v_blocks_why_zeetech" USING btree ("reel_poster_id");
  CREATE INDEX "_pages_v_blocks_why_zeetech_reel_reel_captions_idx" ON "_pages_v_blocks_why_zeetech" USING btree ("reel_captions_id");
  CREATE INDEX "_pages_v_blocks_client_stories_order_idx" ON "_pages_v_blocks_client_stories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_client_stories_parent_id_idx" ON "_pages_v_blocks_client_stories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_client_stories_path_idx" ON "_pages_v_blocks_client_stories" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_client_stories_locale_idx" ON "_pages_v_blocks_client_stories" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_services_order_idx" ON "_pages_v_blocks_how_we_deliver_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_services_parent_id_idx" ON "_pages_v_blocks_how_we_deliver_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_services_locale_idx" ON "_pages_v_blocks_how_we_deliver_services" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_services_image_idx" ON "_pages_v_blocks_how_we_deliver_services" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_order_idx" ON "_pages_v_blocks_how_we_deliver" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_parent_id_idx" ON "_pages_v_blocks_how_we_deliver" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_path_idx" ON "_pages_v_blocks_how_we_deliver" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_locale_idx" ON "_pages_v_blocks_how_we_deliver" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_how_we_deliver_preview_idx" ON "_pages_v_blocks_how_we_deliver" USING btree ("preview_id");
  CREATE INDEX "_pages_v_blocks_how_we_build_stages_order_idx" ON "_pages_v_blocks_how_we_build_stages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_we_build_stages_parent_id_idx" ON "_pages_v_blocks_how_we_build_stages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_we_build_stages_locale_idx" ON "_pages_v_blocks_how_we_build_stages" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_how_we_build_order_idx" ON "_pages_v_blocks_how_we_build" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_we_build_parent_id_idx" ON "_pages_v_blocks_how_we_build" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_we_build_path_idx" ON "_pages_v_blocks_how_we_build" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_how_we_build_locale_idx" ON "_pages_v_blocks_how_we_build" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_delivery_principles_cards_order_idx" ON "_pages_v_blocks_delivery_principles_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_delivery_principles_cards_parent_id_idx" ON "_pages_v_blocks_delivery_principles_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_delivery_principles_cards_locale_idx" ON "_pages_v_blocks_delivery_principles_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_delivery_principles_cards_image_idx" ON "_pages_v_blocks_delivery_principles_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_delivery_principles_order_idx" ON "_pages_v_blocks_delivery_principles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_delivery_principles_parent_id_idx" ON "_pages_v_blocks_delivery_principles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_delivery_principles_path_idx" ON "_pages_v_blocks_delivery_principles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_delivery_principles_locale_idx" ON "_pages_v_blocks_delivery_principles" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_comparison_rows_cells_order_idx" ON "_pages_v_blocks_comparison_rows_cells" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_rows_cells_parent_id_idx" ON "_pages_v_blocks_comparison_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_rows_cells_locale_idx" ON "_pages_v_blocks_comparison_rows_cells" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_comparison_rows_order_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_rows_parent_id_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_rows_locale_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_comparison_rows_icon_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_comparison_order_idx" ON "_pages_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_parent_id_idx" ON "_pages_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_path_idx" ON "_pages_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_comparison_locale_idx" ON "_pages_v_blocks_comparison" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_showreel_order_idx" ON "_pages_v_blocks_showreel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_showreel_parent_id_idx" ON "_pages_v_blocks_showreel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_showreel_path_idx" ON "_pages_v_blocks_showreel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_showreel_locale_idx" ON "_pages_v_blocks_showreel" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_locale_idx" ON "_pages_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_help_card_help_card_background_idx" ON "_pages_v_blocks_faq" USING btree ("help_card_background_id");
  CREATE INDEX "_pages_v_blocks_project_inquiry_prep_steps_order_idx" ON "_pages_v_blocks_project_inquiry_prep_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_inquiry_prep_steps_parent_id_idx" ON "_pages_v_blocks_project_inquiry_prep_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_inquiry_prep_steps_locale_idx" ON "_pages_v_blocks_project_inquiry_prep_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_project_inquiry_order_idx" ON "_pages_v_blocks_project_inquiry" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_inquiry_parent_id_idx" ON "_pages_v_blocks_project_inquiry" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_inquiry_path_idx" ON "_pages_v_blocks_project_inquiry" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_project_inquiry_locale_idx" ON "_pages_v_blocks_project_inquiry" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_project_inquiry_prep_person_prep_person__idx" ON "_pages_v_blocks_project_inquiry" USING btree ("prep_person_photo_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_texts_locale_parent" ON "_pages_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_pages_v_rels_case_studies_id_idx" ON "_pages_v_rels" USING btree ("case_studies_id","locale");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "case_studies__order_idx" ON "case_studies" USING btree ("_order");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_cover_idx" ON "case_studies" USING btree ("cover_id");
  CREATE INDEX "case_studies_person_person_avatar_idx" ON "case_studies" USING btree ("person_avatar_id");
  CREATE INDEX "case_studies_testimonial_idx" ON "case_studies" USING btree ("testimonial_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "case_studies_meta_meta_image_idx" ON "case_studies_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "case_studies_locales_locale_parent_id_unique" ON "case_studies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_media_id_idx" ON "case_studies_rels" USING btree ("media_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version__order_idx" ON "_case_studies_v" USING btree ("version__order");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_cover_idx" ON "_case_studies_v" USING btree ("version_cover_id");
  CREATE INDEX "_case_studies_v_version_person_version_person_avatar_idx" ON "_case_studies_v" USING btree ("version_person_avatar_id");
  CREATE INDEX "_case_studies_v_version_version_testimonial_idx" ON "_case_studies_v" USING btree ("version_testimonial_id");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_snapshot_idx" ON "_case_studies_v" USING btree ("snapshot");
  CREATE INDEX "_case_studies_v_published_locale_idx" ON "_case_studies_v" USING btree ("published_locale");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_version_meta_version_meta_image_idx" ON "_case_studies_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_case_studies_v_locales_locale_parent_id_unique" ON "_case_studies_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_media_id_idx" ON "_case_studies_v_rels" USING btree ("media_id");
  CREATE INDEX "testimonials__order_idx" ON "testimonials" USING btree ("_order");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_video_video_file_idx" ON "testimonials" USING btree ("video_file_id");
  CREATE INDEX "testimonials_video_video_poster_idx" ON "testimonials" USING btree ("video_poster_id");
  CREATE INDEX "testimonials_video_video_captions_idx" ON "testimonials" USING btree ("video_captions_id");
  CREATE INDEX "testimonials_source_source_logo_idx" ON "testimonials" USING btree ("source_logo_id");
  CREATE INDEX "testimonials_source_source_badge_idx" ON "testimonials" USING btree ("source_badge_id");
  CREATE INDEX "testimonials_feedback_request_idx" ON "testimonials" USING btree ("feedback_request_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version__order_idx" ON "_testimonials_v" USING btree ("version__order");
  CREATE INDEX "_testimonials_v_version_version_photo_idx" ON "_testimonials_v" USING btree ("version_photo_id");
  CREATE INDEX "_testimonials_v_version_video_version_video_file_idx" ON "_testimonials_v" USING btree ("version_video_file_id");
  CREATE INDEX "_testimonials_v_version_video_version_video_poster_idx" ON "_testimonials_v" USING btree ("version_video_poster_id");
  CREATE INDEX "_testimonials_v_version_video_version_video_captions_idx" ON "_testimonials_v" USING btree ("version_video_captions_id");
  CREATE INDEX "_testimonials_v_version_source_version_source_logo_idx" ON "_testimonials_v" USING btree ("version_source_logo_id");
  CREATE INDEX "_testimonials_v_version_source_version_source_badge_idx" ON "_testimonials_v" USING btree ("version_source_badge_id");
  CREATE INDEX "_testimonials_v_version_version_feedback_request_idx" ON "_testimonials_v" USING btree ("version_feedback_request_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_snapshot_idx" ON "_testimonials_v" USING btree ("snapshot");
  CREATE INDEX "_testimonials_v_published_locale_idx" ON "_testimonials_v" USING btree ("published_locale");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_testimonials_v_locales_locale_parent_id_unique" ON "_testimonials_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs__order_idx" ON "faqs" USING btree ("_order");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "feedback_requests_testimonial_idx" ON "feedback_requests" USING btree ("testimonial_id");
  CREATE UNIQUE INDEX "feedback_requests_token_idx" ON "feedback_requests" USING btree ("token");
  CREATE INDEX "feedback_requests_updated_at_idx" ON "feedback_requests" USING btree ("updated_at");
  CREATE INDEX "feedback_requests_created_at_idx" ON "feedback_requests" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_requests_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_links_order_idx" ON "header_links" USING btree ("_order");
  CREATE INDEX "header_links_parent_id_idx" ON "header_links" USING btree ("_parent_id");
  CREATE INDEX "header_links_locale_idx" ON "header_links" USING btree ("_locale");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_locale_idx" ON "footer_columns_links" USING btree ("_locale");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_locale_idx" ON "footer_columns" USING btree ("_locale");
  CREATE INDEX "footer_strip_order_idx" ON "footer_strip" USING btree ("_order");
  CREATE INDEX "footer_strip_parent_id_idx" ON "footer_strip" USING btree ("_parent_id");
  CREATE INDEX "footer_strip_locale_idx" ON "footer_strip" USING btree ("_locale");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_share_image_idx" ON "site_settings" USING btree ("default_share_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_statement" CASCADE;
  DROP TABLE "pages_blocks_client_logos_logos" CASCADE;
  DROP TABLE "pages_blocks_client_logos" CASCADE;
  DROP TABLE "pages_blocks_proof_stats_awards" CASCADE;
  DROP TABLE "pages_blocks_proof_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_proof_stats" CASCADE;
  DROP TABLE "pages_blocks_selected_work" CASCADE;
  DROP TABLE "pages_blocks_why_zeetech" CASCADE;
  DROP TABLE "pages_blocks_client_stories" CASCADE;
  DROP TABLE "pages_blocks_how_we_deliver_services" CASCADE;
  DROP TABLE "pages_blocks_how_we_deliver" CASCADE;
  DROP TABLE "pages_blocks_how_we_build_stages" CASCADE;
  DROP TABLE "pages_blocks_how_we_build" CASCADE;
  DROP TABLE "pages_blocks_delivery_principles_cards" CASCADE;
  DROP TABLE "pages_blocks_delivery_principles" CASCADE;
  DROP TABLE "pages_blocks_comparison_rows_cells" CASCADE;
  DROP TABLE "pages_blocks_comparison_rows" CASCADE;
  DROP TABLE "pages_blocks_comparison" CASCADE;
  DROP TABLE "pages_blocks_showreel" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_project_inquiry_prep_steps" CASCADE;
  DROP TABLE "pages_blocks_project_inquiry" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_statement" CASCADE;
  DROP TABLE "_pages_v_blocks_client_logos_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_client_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_proof_stats_awards" CASCADE;
  DROP TABLE "_pages_v_blocks_proof_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_proof_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_selected_work" CASCADE;
  DROP TABLE "_pages_v_blocks_why_zeetech" CASCADE;
  DROP TABLE "_pages_v_blocks_client_stories" CASCADE;
  DROP TABLE "_pages_v_blocks_how_we_deliver_services" CASCADE;
  DROP TABLE "_pages_v_blocks_how_we_deliver" CASCADE;
  DROP TABLE "_pages_v_blocks_how_we_build_stages" CASCADE;
  DROP TABLE "_pages_v_blocks_how_we_build" CASCADE;
  DROP TABLE "_pages_v_blocks_delivery_principles_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_delivery_principles" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_rows_cells" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison" CASCADE;
  DROP TABLE "_pages_v_blocks_showreel" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_project_inquiry_prep_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_project_inquiry" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_locales" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_locales" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "feedback_requests" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_links" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_strip" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_why_zeetech_reel_source";
  DROP TYPE "public"."enum_pages_blocks_delivery_principles_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_delivery_principles_cards_visual";
  DROP TYPE "public"."enum_pages_blocks_comparison_rows_cells_mark";
  DROP TYPE "public"."enum_pages_blocks_comparison_rows_ring";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_why_zeetech_reel_source";
  DROP TYPE "public"."enum__pages_v_blocks_delivery_principles_cards_theme";
  DROP TYPE "public"."enum__pages_v_blocks_delivery_principles_cards_visual";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_rows_cells_mark";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_rows_ring";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum__case_studies_v_published_locale";
  DROP TYPE "public"."enum_testimonials_type";
  DROP TYPE "public"."enum_testimonials_video_source";
  DROP TYPE "public"."enum_testimonials_source_platform";
  DROP TYPE "public"."enum_testimonials_origin";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_type";
  DROP TYPE "public"."enum__testimonials_v_version_video_source";
  DROP TYPE "public"."enum__testimonials_v_version_source_platform";
  DROP TYPE "public"."enum__testimonials_v_version_origin";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum__testimonials_v_published_locale";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_feedback_requests_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}

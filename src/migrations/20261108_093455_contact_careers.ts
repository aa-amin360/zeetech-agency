import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { runTolerant } from '../lib/tolerant-migration'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await runTolerant(db, `
   CREATE TYPE "public"."enum_pages_blocks_interest_cards_cards_icon" AS ENUM('buildings', 'frame', 'box', 'profile-2user');
  CREATE TYPE "public"."enum__pages_v_blocks_interest_cards_cards_icon" AS ENUM('buildings', 'frame', 'box', 'profile-2user');
  ALTER TYPE "public"."enum_pages_blocks_card_grid_style" ADD VALUE 'outlined';
  ALTER TYPE "public"."enum__pages_v_blocks_card_grid_style" ADD VALUE 'outlined';
  CREATE TABLE "pages_blocks_careers_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"label_kicker" varchar,
  	"label_title" varchar,
  	"label_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_interest_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"icon" "enum_pages_blocks_interest_cards_cards_icon" DEFAULT 'buildings',
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "pages_blocks_interest_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_careers_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"label_kicker" varchar,
  	"label_title" varchar,
  	"label_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_interest_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"icon" "enum__pages_v_blocks_interest_cards_cards_icon" DEFAULT 'buildings',
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_interest_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_project_inquiry" ADD COLUMN "full_width" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_project_inquiry" ADD COLUMN "full_width" boolean DEFAULT false;
  ALTER TABLE "services_blocks_project_inquiry" ADD COLUMN "full_width" boolean DEFAULT false;
  ALTER TABLE "_services_v_blocks_project_inquiry" ADD COLUMN "full_width" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_careers_hero" ADD CONSTRAINT "pages_blocks_careers_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_interest_cards_cards" ADD CONSTRAINT "pages_blocks_interest_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_interest_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_interest_cards" ADD CONSTRAINT "pages_blocks_interest_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_careers_hero" ADD CONSTRAINT "_pages_v_blocks_careers_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_interest_cards_cards" ADD CONSTRAINT "_pages_v_blocks_interest_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_interest_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_interest_cards" ADD CONSTRAINT "_pages_v_blocks_interest_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_careers_hero_order_idx" ON "pages_blocks_careers_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_careers_hero_parent_id_idx" ON "pages_blocks_careers_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_careers_hero_path_idx" ON "pages_blocks_careers_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_careers_hero_locale_idx" ON "pages_blocks_careers_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_interest_cards_cards_order_idx" ON "pages_blocks_interest_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_interest_cards_cards_parent_id_idx" ON "pages_blocks_interest_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_interest_cards_cards_locale_idx" ON "pages_blocks_interest_cards_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_interest_cards_order_idx" ON "pages_blocks_interest_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_interest_cards_parent_id_idx" ON "pages_blocks_interest_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_interest_cards_path_idx" ON "pages_blocks_interest_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_interest_cards_locale_idx" ON "pages_blocks_interest_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_careers_hero_order_idx" ON "_pages_v_blocks_careers_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_careers_hero_parent_id_idx" ON "_pages_v_blocks_careers_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_careers_hero_path_idx" ON "_pages_v_blocks_careers_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_careers_hero_locale_idx" ON "_pages_v_blocks_careers_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_interest_cards_cards_order_idx" ON "_pages_v_blocks_interest_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_interest_cards_cards_parent_id_idx" ON "_pages_v_blocks_interest_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_interest_cards_cards_locale_idx" ON "_pages_v_blocks_interest_cards_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_interest_cards_order_idx" ON "_pages_v_blocks_interest_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_interest_cards_parent_id_idx" ON "_pages_v_blocks_interest_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_interest_cards_path_idx" ON "_pages_v_blocks_interest_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_interest_cards_locale_idx" ON "_pages_v_blocks_interest_cards" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_careers_hero" CASCADE;
  DROP TABLE "pages_blocks_interest_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_interest_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_careers_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_interest_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_interest_cards" CASCADE;
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'figures'::text;
  DROP TYPE "public"."enum_pages_blocks_card_grid_style";
  CREATE TYPE "public"."enum_pages_blocks_card_grid_style" AS ENUM('figures', 'numbered');
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'figures'::"public"."enum_pages_blocks_card_grid_style";
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE "public"."enum_pages_blocks_card_grid_style" USING "style"::"public"."enum_pages_blocks_card_grid_style";
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'figures'::text;
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_style";
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_style" AS ENUM('figures', 'numbered');
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'figures'::"public"."enum__pages_v_blocks_card_grid_style";
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE "public"."enum__pages_v_blocks_card_grid_style" USING "style"::"public"."enum__pages_v_blocks_card_grid_style";
  ALTER TABLE "pages_blocks_project_inquiry" DROP COLUMN "full_width";
  ALTER TABLE "_pages_v_blocks_project_inquiry" DROP COLUMN "full_width";
  ALTER TABLE "services_blocks_project_inquiry" DROP COLUMN "full_width";
  ALTER TABLE "_services_v_blocks_project_inquiry" DROP COLUMN "full_width";
  DROP TYPE "public"."enum_pages_blocks_interest_cards_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_interest_cards_cards_icon";`)
}

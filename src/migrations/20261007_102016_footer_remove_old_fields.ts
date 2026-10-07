import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer_strip" CASCADE;
  ALTER TABLE "footer" DROP COLUMN "email_label";
  ALTER TABLE "footer_locales" DROP COLUMN "pitch_kicker";
  ALTER TABLE "footer_locales" DROP COLUMN "pitch_title";
  ALTER TABLE "footer_locales" DROP COLUMN "pitch_tagline";
  ALTER TABLE "footer_locales" DROP COLUMN "brand_location";
  ALTER TABLE "footer_locales" DROP COLUMN "bottom_meta_left";
  ALTER TABLE "footer_locales" DROP COLUMN "bottom_meta_right";
  ALTER TABLE "footer_locales" DROP COLUMN "bottom_built_with";`)

  // Footer redesign (Figma 587:4935): fill in the new content, but only where the footer still
  // holds the original starter content, so nothing the owner has edited is overwritten.
  const ctx = { disableRevalidate: true }
  const footer = await payload.findGlobal({ slug: 'footer', req, depth: 0, context: ctx })
  const data: Record<string, unknown> = {}

  const OLD_NAV = ['Work', 'Expertise', 'Studio', 'Insights', 'Contact', 'Lab']
  const columns = footer.columns ?? []
  const nav = columns[0]?.links?.map((l) => l.link?.label) ?? []
  if (nav.length === OLD_NAV.length && nav.every((label, i) => label === OLD_NAV[i])) {
    data.columns = columns.map((col, i) =>
      i === 0
        ? {
            ...col,
            links: [
              ['Our Work', '/#work'],
              ['Services', '/#expertise'],
              ['About Us', '/#studio'],
              ['Careers', ''],
              ['Contact', '/#contact'],
            ].map(([label, href]) => ({ link: { label, href } })),
          }
        : col,
    )
  }
  if (!footer.socials?.length) {
    data.socials = (['facebook', 'twitter', 'instagram', 'linkedin'] as const).map((platform) => ({ platform, url: '' }))
  }
  if (!footer.legal?.length) {
    data.legal = [
      { link: { label: 'Terms of Use', href: '' } },
      { link: { label: 'Privacy Policy', href: '' } },
      { link: { label: 'Sitemap', href: '/sitemap.xml' } },
    ]
  }
  if (/^© \d{4} ZeeTech\. All rights reserved\.$/.test(footer.bottom?.copyright ?? '')) {
    data.bottom = { copyright: '© All the rights reserved to @ZeeTech' }
  }
  if (Object.keys(data).length) {
    await payload.updateGlobal({ slug: 'footer', data, req, depth: 0, context: ctx })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "footer_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  ALTER TABLE "footer" ADD COLUMN "email_label" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "pitch_kicker" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "pitch_title" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "pitch_tagline" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "brand_location" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "bottom_meta_left" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "bottom_meta_right" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "bottom_built_with" varchar;
  ALTER TABLE "footer_strip" ADD CONSTRAINT "footer_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_strip_order_idx" ON "footer_strip" USING btree ("_order");
  CREATE INDEX "footer_strip_parent_id_idx" ON "footer_strip" USING btree ("_parent_id");
  CREATE INDEX "footer_strip_locale_idx" ON "footer_strip" USING btree ("_locale");`)
}

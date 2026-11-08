import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { CSSProperties } from 'react'
import type { CaseStudy, Testimonial } from '@/payload-types'
import { getCaseStudy, getPayloadClient, isPreview } from '@/lib/payload'
import { mediaList, mediaUrl } from '@/lib/media'
import { serverUrl } from '@/lib/url'
import { Img } from '@/components/Img'
import { JsonLd } from '@/components/JsonLd'
import { RefreshOnSave } from '@/components/RefreshOnSave'
import { ArrowUpRight, DisplayTitle, Eyebrow } from '@/components/ui'
import { RenderBlocks } from '@sections/render'
import { WorkCard } from '@sections/work/02-work-grid/WorkGrid'
import '../work.css'

export const revalidate = 3600
export const dynamicParams = true
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) return {}
  const image = mediaUrl(study.meta?.image, 'og') || mediaUrl(study.cover, 'og')
  return {
    // an SEO title is the full title; only the plain name gets the " — ZeeTech" ending
    title: study.meta?.title ? { absolute: study.meta.title } : study.title,
    description: study.meta?.description || study.summary || undefined,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { type: 'article', url: `/work/${study.slug}`, images: image ? [image] : undefined },
  }
}

/** Up to three other projects, in the order set in the admin. */
async function relatedStudies(study: CaseStudy): Promise<CaseStudy[]> {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { id: { not_equals: study.id } },
    sort: '_order',
    limit: 3,
    depth: 1,
    draft,
    overrideAccess: draft,
  })
  return docs
}

const absolute = (url: string) => (url.startsWith('/') ? `${serverUrl()}${url}` : url)

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()
  const [preview, related] = await Promise.all([isPreview(), relatedStudies(study)])
  const quote = typeof study.testimonial === 'object' ? (study.testimonial as Testimonial | null) : null
  const meta = [
    ['Duration', study.duration],
    ['Client', study.client],
    ['Status', study.status],
  ].filter(([, v]) => v) as [string, string][]
  const cover = mediaUrl(study.cover)

  return (
    <article className="study" style={{ '--case-bg': study.color || '#ff8648' } as CSSProperties}>
      {preview ? <RefreshOnSave /> : null}

      {/* Hero (Figma 530:14624): breadcrumb, cover, details, title */}
      <header className="study__hero">
        <div className="study__inner">
          <nav className="study__crumbs" aria-label="Breadcrumb">
            <a className="study__back" href="/work">
              <img src="/brand/icon-back.svg" width={42} height={42} alt="" />
              <span>All Works</span>
            </a>
            {study.projectLabel ? (
              <>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{study.projectLabel}</span>
              </>
            ) : null}
          </nav>

          <figure className="study__cover">
            <Img media={study.cover} priority sizes="(max-width: 1920px) 100vw, 1664px" />
          </figure>

          {meta.length || study.tags?.length ? (
            <div className="study__facts">
              {meta.length ? (
                <dl className="study__meta">
                  {meta.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {study.tags?.length ? (
                <ul className="study__tags">
                  {study.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="study__intro">
            <h1 className="study__title">
              {study.title}
              {study.titleAccent ? (
                <>
                  {' '}
                  <span className="study__title-accent">{study.titleAccent}</span>
                </>
              ) : null}
            </h1>
            {study.summary ? <p className="study__summary">{study.summary}</p> : null}
          </div>
        </div>
      </header>

      <div className="study__inner">
        {study.body ? (
          <div className="study__body">
            <RichText data={study.body} />
          </div>
        ) : null}

        {study.gallery?.length ? (
          <div className="study__gallery">
            {mediaList(study.gallery).map((m) => (
              <figure key={m.id}>
                <Img media={m} sizes="(max-width: 1920px) 100vw, 1664px" />
              </figure>
            ))}
          </div>
        ) : null}

        {quote ? (
          <blockquote className="study__quote">
            <p>“{quote.quote}”</p>
            <footer>
              {quote.name}
              {quote.role ? ` — ${quote.role}` : ''}
            </footer>
          </blockquote>
        ) : null}
      </div>

      {related.length ? (
        <section className="sec study__related" aria-labelledby="related-title">
          <div className="sec__inner">
            <header className="study__related-head">
              <div className="sec-head__main">
                <Eyebrow>More work</Eyebrow>
                <DisplayTitle heading={{ title: 'Related', accent: 'projects', accentOnNewLine: false }} id="related-title" />
              </div>
              <a className="btn btn--secondary" href="/work">
                <span>All Works</span>
                <ArrowUpRight />
              </a>
            </header>
            <div className="study__related-grid">
              {related.map((s) => (
                <WorkCard study={s} key={s.id} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {study.layout?.length ? (
        <RenderBlocks blocks={study.layout} />
      ) : (
        <div className="study__inner">
          <div className="study__cta">
            <p>Have a similar problem to solve?</p>
            <a className="btn btn--primary" href="/contact">
              <span>Start a project</span>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: study.title,
          headline: study.title,
          description: study.summary || undefined,
          // Blob storage URLs are already absolute; local uploads are site-relative
          image: cover ? absolute(cover) : undefined,
          url: `${serverUrl()}/work/${study.slug}`,
          creator: { '@type': 'Organization', name: 'ZeeTech', url: serverUrl() },
          dateModified: study.updatedAt,
        }}
      />
    </article>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { CSSProperties } from 'react'
import type { Testimonial } from '@/payload-types'
import { getCaseStudy, isPreview } from '@/lib/payload'
import { mediaList, mediaUrl } from '@/lib/media'
import { serverUrl } from '@/lib/url'
import { Img } from '@/components/Img'
import { JsonLd } from '@/components/JsonLd'
import { RefreshOnSave } from '@/components/RefreshOnSave'
import { ArrowUpRight, Eyebrow } from '@/components/ui'
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
    title: study.meta?.title || study.title,
    description: study.meta?.description || study.summary || undefined,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { type: 'article', url: `/work/${study.slug}`, images: image ? [image] : undefined },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()
  const preview = await isPreview()
  const quote = typeof study.testimonial === 'object' ? (study.testimonial as Testimonial | null) : null

  return (
    <article className="study" style={{ '--case-bg': study.color || '#ff8648' } as CSSProperties}>
      {preview ? <RefreshOnSave /> : null}
      <header className="study__hero">
        <div className="study__inner">
          <a className="study__back" href="/work">
            ← All work
          </a>
          {study.projectLabel || study.client ? (
            <Eyebrow>{[study.projectLabel, study.client].filter(Boolean).join(' // ')}</Eyebrow>
          ) : null}
          <h1 className="study__title">{study.title}</h1>
          {study.summary ? <p className="study__summary">{study.summary}</p> : null}
          <dl className="study__meta">
            {study.scope ? (
              <div>
                <dt>Scope</dt>
                <dd>{study.scope}</dd>
              </div>
            ) : null}
            {study.duration ? (
              <div>
                <dt>Duration</dt>
                <dd>{study.duration}</dd>
              </div>
            ) : null}
            {study.person?.name ? (
              <div>
                <dt>Client</dt>
                <dd>
                  {study.person.name}
                  {study.person.role ? `, ${study.person.role}` : ''}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      <div className="study__inner">
        <figure className="study__cover">
          <Img media={study.cover} priority sizes="(max-width: 1760px) 100vw, 1664px" />
        </figure>

        {study.body ? (
          <div className="study__body">
            <RichText data={study.body} />
          </div>
        ) : null}

        {study.gallery?.length ? (
          <div className="study__gallery">
            {mediaList(study.gallery).map((m) => (
              <figure key={m.id}>
                <Img media={m} sizes="(max-width: 900px) 100vw, 50vw" />
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

        <div className="study__cta">
          <p>Have a similar problem to solve?</p>
          <a className="btn btn--primary" href="/#contact">
            <span>Start a project</span>
            <ArrowUpRight />
          </a>
        </div>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: study.title,
          headline: study.title,
          description: study.summary || undefined,
          image: mediaUrl(study.cover) ? `${serverUrl()}${mediaUrl(study.cover)}` : undefined,
          url: `${serverUrl()}/work/${study.slug}`,
          creator: { '@type': 'Organization', name: 'ZeeTech', url: serverUrl() },
          dateModified: study.updatedAt,
        }}
      />
    </article>
  )
}

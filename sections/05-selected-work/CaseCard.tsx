import type { CSSProperties } from 'react'
import type { CaseStudy } from '@/payload-types'
import { Img } from '@/components/Img'

const Arrow = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function CaseCard({ study, headingLevel = 3 }: { study: CaseStudy; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  const href = `/work/${study.slug}`
  return (
    <article className="case" style={{ '--case-bg': study.color || '#ff8648' } as CSSProperties}>
      <div className="case__body">
        {study.projectLabel || study.client ? (
          <p className="case__kicker">
            {study.projectLabel ? <span>{study.projectLabel}</span> : null}{' '}
            {study.client ? <span className="case__client">{`// ${study.client}`}</span> : null}
          </p>
        ) : null}
        <H className="case__title">{study.title}</H>
        {study.summary ? <p className="case__desc">{study.summary}</p> : null}
        {study.scope || study.duration ? (
          <dl className="case__meta">
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
          </dl>
        ) : null}
        <a className="case__person" href={href}>
          {study.person?.avatar ? <Img media={study.person.avatar} alt="" sizes="80px" /> : null}
          <span className="case__person-text">
            <strong>{study.person?.name || study.client || study.title}</strong>
            {study.person?.role ? <span>{study.person.role}</span> : null}
          </span>
          <span className="case__go" aria-hidden="true">
            <Arrow />
          </span>
          <span className="visually-hidden">View the {study.title} case study</span>
        </a>
      </div>
      <figure className="case__media">
        <Img media={study.cover} sizes="(max-width: 900px) 100vw, 50vw" />
      </figure>
    </article>
  )
}

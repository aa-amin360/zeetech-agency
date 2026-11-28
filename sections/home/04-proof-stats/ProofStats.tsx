import { Fragment } from 'react'
import type { Media, ProofStatsBlock, Testimonial } from '@/payload-types'
import { Img } from '@/components/Img'
import { ReviewCard, Stars } from '@/components/ReviewCard'
import './proof-stats.css'

function RatingInner({ icon, value }: { icon?: number | Media | null; value: number }) {
  return (
    <>
      {icon ? <Img media={icon} className="proof__badge-img is-round" alt="" sizes="80px" /> : null}
      <div className="proof__rating">
        <Stars value={value} />
        <strong>{Number.isInteger(value) ? value : value.toFixed(1)}/5</strong>
      </div>
    </>
  )
}

export function ProofStats({ block }: { block: ProofStatsBlock }) {
  const t = typeof block.testimonial === 'object' ? (block.testimonial as Testimonial | null) : null
  const awards = block.awards ?? []
  // the stars beside the quote are that review's own rating, so they always match what the client gave
  const rating = t?.source?.rating ?? block.rating?.value ?? null
  const ratingUrl = t?.source?.rating ? t.source.reviewUrl : null
  const platform = t?.source?.platform ?? 'the platform'
  const stats = block.stats ?? []

  return (
    <section className="sec proof" aria-label="Client proof">
      {t ? (
        <div className="sec__inner proof__inner">
          <figure className="proof__person" data-reveal>
            {t.photo ? (
              <Img media={t.photo} className="proof__photo" alt={t.name} sizes="273px" />
            ) : (
              <div className="proof__photo proof__photo--card">
                <ReviewCard t={t} />
              </div>
            )}
            <figcaption>
              <strong className="proof__name">{t.name}</strong>
              <span className="proof__role">
                {t.role}
                {t.company ? (
                  <>
                    <br />
                    {t.company}
                  </>
                ) : null}
              </span>
            </figcaption>
          </figure>

          <div className="proof__main">
            <blockquote className="proof__quote" data-reveal>
              <p>
                <span className="proof__mark" aria-hidden="true">“ </span>
                {t.quote}
                <span className="proof__mark" aria-hidden="true">”</span>{' '}
                {t.source?.logo ? (
                  <span className="proof__source">
                    {t.source.reviewUrl ? (
                      <a href={t.source.reviewUrl} target="_blank" rel="noopener noreferrer">
                        <Img media={t.source.logo} alt={`Review on ${t.source.platform ?? 'the platform'}`} sizes="150px" />
                      </a>
                    ) : (
                      <Img media={t.source.logo} alt={`Review on ${t.source.platform ?? 'the platform'}`} sizes="150px" />
                    )}
                  </span>
                ) : null}
              </p>
            </blockquote>

            {rating || awards.length ? (
              <ul className="proof__badges" data-reveal>
                {rating ? (
                  <li className="proof__badge">
                    {ratingUrl ? (
                      <a className="proof__rating-link" href={ratingUrl} target="_blank" rel="noopener noreferrer">
                        <RatingInner icon={block.rating?.icon} value={rating} />
                        <span className="visually-hidden"> (opens the review on {platform})</span>
                      </a>
                    ) : (
                      <RatingInner icon={block.rating?.icon} value={rating} />
                    )}
                  </li>
                ) : null}
                {awards.map((a, i) => (
                  <Fragment key={a.id ?? i}>
                    {i > 0 || rating ? (
                      <li className="proof__rule" aria-hidden="true">
                        <img src="/brand/rule-v-grey.svg" width={1} height={115} alt="" />
                      </li>
                    ) : null}
                    <li className="proof__badge">
                      <span className={`proof__badge-label${a.label.length > 20 ? ' proof__badge-label--wide' : ''}`}>
                        {a.label}
                      </span>
                      <Img media={a.image} className={`proof__badge-img${a.round ? ' is-round' : ''}`} sizes="100px" />
                    </li>
                  </Fragment>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      {stats.length ? (
        <div className="stats">
          <div className="stats__inner">
            {stats.map((s, i) => (
              <Fragment key={s.id ?? i}>
                {i > 0 ? (
                  <img className="stat__rule" src="/brand/rule-v-white.svg" width={1} height={170} alt="" aria-hidden="true" />
                ) : null}
                <div className="stat" data-reveal>
                  <p className="stat__num" data-count={s.value} data-suffix={s.suffix ?? ''}>
                    {s.value}
                    {s.suffix}
                  </p>
                  <p className="stat__label">{s.label}</p>
                  {s.note ? <p className="stat__note">{s.note}</p> : null}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

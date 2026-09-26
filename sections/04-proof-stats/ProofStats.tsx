import { Fragment } from 'react'
import type { ProofStatsBlock, Testimonial } from '@/payload-types'
import { Img } from '@/components/Img'
import './proof-stats.css'

const Stars = ({ value }: { value: number }) => {
  const full = Math.floor(value)
  const half = value - full >= 0.25
  return (
    <span className="stars" role="img" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <span className="star" key={i}>
          <img src="/brand/star-full.svg" alt="" />
        </span>
      ))}
      {half ? (
        <span className="star">
          <img src="/brand/star-half.svg" alt="" />
        </span>
      ) : null}
    </span>
  )
}

export function ProofStats({ block }: { block: ProofStatsBlock }) {
  const t = typeof block.testimonial === 'object' ? (block.testimonial as Testimonial | null) : null
  const awards = block.awards ?? []
  const stats = block.stats ?? []

  return (
    <section className="sec proof" aria-label="Client proof">
      {t ? (
        <div className="sec__inner proof__inner">
          <figure className="proof__person" data-reveal>
            <Img media={t.photo} className="proof__photo" alt={t.name} sizes="273px" />
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
                “ {t.quote}”{' '}
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

            {block.rating?.value || awards.length ? (
              <ul className="proof__badges" data-reveal>
                {block.rating?.value ? (
                  <li className="proof__badge">
                    <Img media={block.rating.icon} className="proof__badge-img is-round" alt="" sizes="80px" />
                    <div className="proof__rating">
                      <Stars value={block.rating.value} />
                      <strong>{block.rating.value}/5</strong>
                    </div>
                  </li>
                ) : null}
                {awards.map((a, i) => (
                  <Fragment key={a.id ?? i}>
                    {i > 0 || block.rating?.value ? (
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

import type { Testimonial } from '@/payload-types'
import './review-card.css'

const PLATFORM: Record<string, string> = {
  fiverr: 'Fiverr',
  upwork: 'Upwork',
  clutch: 'Clutch',
  google: 'Google',
  linkedin: 'LinkedIn',
  direct: 'ZeeTech',
}

/** Star row for a rating out of 5 (full stars, plus a half star from .25). */
export function Stars({ value, className = 'stars' }: { value: number; className?: string }) {
  // nearest half star: 4.9 shows five stars, 4.3 four and a half
  const rounded = Math.round(value * 2) / 2
  const full = Math.floor(rounded)
  const half = rounded - full === 0.5
  return (
    <span className={className} role="img" aria-label={`Rated ${value} out of 5`}>
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

/** "Verified on Fiverr ↗": opens the original review so visitors can check it. */
export function VerifyLink({ t, className = 'rcard__verify' }: { t: Testimonial; className?: string }) {
  const url = t.source?.reviewUrl
  const platform = t.source?.platform && t.source.platform !== 'direct' ? PLATFORM[t.source.platform] : null
  if (!url || !platform) return null
  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer">
      Verified on {platform}
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="visually-hidden"> (opens the original review)</span>
    </a>
  )
}

/**
 * Stands in for the photo when a testimonial has none (e.g. a public Fiverr review, where the buyer's
 * picture is not ours to use): the first letter of the name, the star rating and a link to the original.
 */
export function ReviewCard({ t, compact = false }: { t: Testimonial; compact?: boolean }) {
  const letter = (t.name.trim().match(/[a-z0-9]/i)?.[0] ?? '?').toUpperCase()
  const rating = t.source?.rating
  const platform = t.source?.platform ? PLATFORM[t.source.platform] : null
  return (
    <div className={`rcard${compact ? ' rcard--compact' : ''}`}>
      <span className="rcard__avatar" aria-hidden="true">
        {letter}
      </span>
      {rating ? (
        <p className="rcard__rating">
          <Stars value={rating} />
          <strong>{Number.isInteger(rating) ? `${rating}.0` : rating}</strong>
        </p>
      ) : null}
      {platform && t.source?.platform !== 'direct' ? <p className="rcard__platform">{platform} review</p> : null}
      <VerifyLink t={t} />
    </div>
  )
}

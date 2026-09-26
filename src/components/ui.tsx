import type { ReactNode } from 'react'

type Heading = {
  eyebrow?: string | null
  title?: string | null
  accent?: string | null
  highlight?: string | null
  accentOnNewLine?: boolean | null
  subtitle?: string | null
}

export const ArrowUpRight = ({ className = 'btn__icon' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`eyebrow${light ? ' eyebrow--light' : ''}`}>
      <span className="eyebrow__badge" aria-hidden="true">
        <img src="/brand/icon-badge.svg" width={18} height={18} alt="" />
      </span>
      {children}
    </p>
  )
}

/** Two-tone display title: plain words + orange italic accent. */
export function DisplayTitle({
  heading,
  id,
  as: Tag = 'h2',
  className = '',
}: {
  heading: Heading
  id?: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  const { title, accent, highlight, accentOnNewLine = true } = heading
  const tail = (
    <>
      {highlight ? <span className="display__hl">{highlight}</span> : null}
      {highlight && accent ? ' ' : null}
      {accent ? <em className="display__em">{accent}</em> : null}
    </>
  )
  return (
    <Tag className={`display ${className}`.trim()} id={id}>
      {accentOnNewLine !== false ? (
        <>
          <span className="display__line">{title}</span>
          {tail}
        </>
      ) : (
        <>
          {title} {tail}
        </>
      )}
    </Tag>
  )
}

/** Eyebrow + title + subtitle in one of the three layouts used by the design. */
export function SectionHead({
  heading,
  id,
  layout = 'center',
  light,
  aside,
  mainClassName,
  subClassName = '',
}: {
  heading: Heading
  id?: string
  layout?: 'center' | 'split' | 'left'
  light?: boolean
  /** Extra content for the right column of a split heading. */
  aside?: ReactNode
  mainClassName?: string
  subClassName?: string
}) {
  const sub = heading.subtitle ? <p className={`sub ${subClassName}`.trim()}>{heading.subtitle}</p> : null
  const eyebrow = heading.eyebrow ? <Eyebrow light={light}>{heading.eyebrow}</Eyebrow> : null
  const title = <DisplayTitle heading={heading} id={id} className={light ? 'display--light' : ''} />

  if (layout === 'split') {
    return (
      <header className="sec-head sec-head--split" data-reveal>
        <div className={`sec-head__main ${mainClassName ?? ''}`.trim()}>
          {eyebrow}
          {title}
        </div>
        {aside ?? (sub ? <div className="sec-head__aside">{sub}</div> : null)}
      </header>
    )
  }
  return (
    <header className={`sec-head${layout === 'center' ? ' sec-head--center' : ''}`} data-reveal>
      {eyebrow}
      {title}
      {sub}
    </header>
  )
}

/** Renders nothing when the link has no label. */
export function Cta({
  link,
  className = 'btn btn--primary',
  icon = true,
}: {
  link?: { label?: string | null; href?: string | null } | null
  className?: string
  icon?: boolean
}) {
  if (!link?.label) return null
  return (
    <a className={className} href={link.href || '#'}>
      <span>{link.label}</span>
      {icon ? <ArrowUpRight /> : null}
    </a>
  )
}

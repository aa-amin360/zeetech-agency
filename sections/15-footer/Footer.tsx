import { Fragment } from 'react'
import type { Footer as FooterData } from '@/payload-types'
import { SOCIAL_PLATFORMS } from './global'
import './footer.css'

// Oversized wordmark pieces (Figma 587:4920), positioned in % of the 240 × 80 box
const WORDMARK = [
  [40.47, 79.5, 20.26, 5.06],
  [21.83, 72.94, 36.88, 11.52],
  [32.94, 60.26, 32.3, 30.06],
  [31.93, 4.74, 32.3, 86.6],
  [41.3, 23.54, 31.68, 67.39],
  [41.28, 40.83, 31.66, 50.11],
  [41.26, 50.6, 31.72, 40.37],
  [32.94, 31.85, 32.31, 58.86],
  [41.26, 14.3, 31.69, 77.21],
]

const isExternal = (href: string) => /^https?:/.test(href)
const newTab = (href: string) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})

type Link = { label?: string | null; href?: string | null } | null | undefined

/** A link when it has an address, plain text otherwise. */
const LinkOrText = ({ link, className }: { link: Link; className?: string }) =>
  link?.href ? (
    <a className={className} href={link.href} {...newTab(link.href)}>
      {link.label}
    </a>
  ) : (
    <span className={className}>{link?.label}</span>
  )

export function Footer({ data }: { data: FooterData }) {
  const { brand, bottom } = data
  const platformName = (v: string) => SOCIAL_PLATFORMS.find((p) => p.value === v)?.label ?? v

  return (
    <footer className="sec footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__top">
          <img className="footer__mark" src="/brand/footer/mark.svg" width={355} height={344} alt="" aria-hidden="true" />

          <div className="footer__brand">
            <img className="footer__logo" src="/brand/footer/logo.svg" width={180} height={60} alt="ZeeTech" />
            {brand?.text ? <p className="footer__about">{brand.text}</p> : null}
            {data.email || data.cta?.label ? (
              <div className="footer__pill">
                {data.email ? (
                  <a className="footer__email" href={`mailto:${data.email}`}>
                    {data.email}
                  </a>
                ) : (
                  <span />
                )}
                {data.cta?.label ? (
                  <a className="footer__start" href={data.cta.href || '/#contact'}>
                    {data.cta.label}
                    <span className="footer__start-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M7 17 17 7M8.5 7H17v8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {(data.columns ?? []).map((col, i) => (
            <nav key={col.id ?? i} className="footer__col" aria-label={col.title}>
              <p className="footer__heading">{col.title}</p>
              <ul>
                {(col.links ?? []).map((l, j) => (
                  <li key={l.id ?? j}>
                    <LinkOrText link={l.link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer__bar">
          {bottom?.copyright ? <p className="footer__copy">{bottom.copyright}</p> : <span />}

          {data.socials?.length ? (
            <ul className="footer__socials">
              {data.socials.map((s, i) => {
                const icon = <img src={`/brand/footer/${s.platform}.svg`} width={16} height={16} alt="" />
                return (
                  <li key={s.id ?? i}>
                    {s.url ? (
                      <a className="footer__social" href={s.url} target="_blank" rel="noopener noreferrer" aria-label={platformName(s.platform)}>
                        {icon}
                      </a>
                    ) : (
                      <span className="footer__social" aria-label={platformName(s.platform)} role="img">
                        {icon}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <span />
          )}

          {data.legal?.length ? (
            <p className="footer__legal">
              {data.legal.map((l, i) => (
                <Fragment key={l.id ?? i}>
                  {i ? <span className="footer__sep" aria-hidden="true"> ⁍ </span> : null}
                  <LinkOrText link={l.link} />
                </Fragment>
              ))}
            </p>
          ) : (
            <span />
          )}
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true">
        <div className="footer__wordmark-row">
          <span className="wordmark wordmark--footer">
            {WORDMARK.map(([t, r, b, l], i) => (
              <img
                key={i}
                src={`/brand/footer/wordmark-${i + 1}.svg`}
                alt=""
                loading="lazy"
                style={{ ['--t' as string]: `${t}%`, ['--r' as string]: `${r}%`, ['--b' as string]: `${b}%`, ['--l' as string]: `${l}%` }}
              />
            ))}
          </span>
          <span className="footer__studio">studio</span>
        </div>
      </div>
    </footer>
  )
}

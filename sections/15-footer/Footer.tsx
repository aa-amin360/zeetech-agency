import type { Footer as FooterData } from '@/payload-types'
import './footer.css'

// Oversized wordmark pieces (Figma 430:410), positioned in % of the 240 × 80 box
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

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

export function Footer({ data }: { data: FooterData }) {
  const { pitch, brand, bottom } = data
  return (
    <footer className="sec footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__cta" data-reveal>
          <div className="footer__pitch">
            {pitch?.kicker ? <p className="footer__kicker">{pitch.kicker}</p> : null}
            {pitch?.title ? <p className="footer__title">{pitch.title}</p> : null}
            {pitch?.tagline ? <p className="footer__tagline">{pitch.tagline}</p> : null}
          </div>
          <div className="footer__actions">
            {data.email ? (
              <a className="footer__email" href={`mailto:${data.email}`}>
                <span>{data.emailLabel}</span>
                {data.email}
              </a>
            ) : null}
            {data.cta?.label ? (
              <a className="footer__start" href={data.cta.href || '#contact'}>
                {data.cta.label} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/brand/logo-zeetech.svg" width={180} height={60} alt="ZeeTech" />
            {brand?.text ? <p>{brand.text}</p> : null}
            {brand?.location ? <p className="footer__kicker">{brand.location}</p> : null}
          </div>
          {(data.columns ?? []).map((col, i) => (
            <nav
              key={col.id ?? i}
              className={`footer__col${(col.links?.length ?? 0) > 5 && i === 1 ? ' footer__col--wide' : ''}`}
              aria-label={col.title}
            >
              <p className="footer__kicker">{col.title}</p>
              <ul>
                {(col.links ?? []).map((l, j) => (
                  <li key={l.id ?? j}>
                    {l.link?.href ? (
                      <a
                        href={l.link.href}
                        {...(isExternal(l.link.href) && !l.link.href.startsWith('mailto')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {l.link.label}
                      </a>
                    ) : (
                      l.link?.label
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="footer__rule" />

        {data.strip?.length ? (
          <dl className="footer__strip">
            {data.strip.map((s, i) => (
              <div key={s.id ?? i}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="footer__finale">
          <p className="footer__meta">
            <span>{bottom?.metaLeft}</span>
            <span>{bottom?.metaRight}</span>
          </p>
          <div className="footer__wordmark">
            <span className="wordmark" role="img" aria-label="ZeeTech">
              {WORDMARK.map(([t, r, b, l], i) => (
                <img
                  key={i}
                  src={`/brand/wordmark-${i + 1}.svg`}
                  alt=""
                  loading="lazy"
                  style={{ ['--t' as string]: `${t}%`, ['--r' as string]: `${r}%`, ['--b' as string]: `${b}%`, ['--l' as string]: `${l}%` }}
                />
              ))}
            </span>
            <span className="footer__studio">studio</span>
          </div>
        </div>

        <div className="footer__base">
          <p>{bottom?.copyright}</p>
          {bottom?.builtWith ? <p className="footer__built">{bottom.builtWith}</p> : null}
          <a className="footer__top" href="#top">
            BACK TO TOP ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

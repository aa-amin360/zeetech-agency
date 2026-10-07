import type { ClientLogosBlock } from '@/payload-types'
import { Img } from '@/components/Img'
import { Marquee } from '@/components/Marquee'
import './client-logos.css'

// Figma logo box widths, used for placeholders until real logos are added
const PLACEHOLDER_WIDTHS = [
  [200, 152, 166, 224, 154, 106, 82, 137, 267, 268],
  [153, 104, 131, 267, 60, 249, 153, 92, 152, 200],
]

type Logo = NonNullable<ClientLogosBlock['logos']>[number]

const LogoItem = ({ logo }: { logo: Logo }) => {
  const inner = logo.logo ? (
    // eager: the scrolling copies slide in from off-screen, and lazy loading would leave gaps
    <Img media={logo.logo} alt={logo.name} sizes="280px" loading="eager" />
  ) : (
    <span className="logo-slot__name">{logo.name}</span>
  )
  return logo.url ? (
    <a className="logo-slot" href={logo.url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <span className="logo-slot">{inner}</span>
  )
}

export function ClientLogos({ block }: { block: ClientLogosBlock }) {
  const logos = block.logos ?? []
  const rows: Logo[][] = [[], []]
  logos.forEach((l, i) => rows[i % 2].push(l))

  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="clients__inner">
        <div className="clients__head">
          <span className="clients__badge" aria-hidden="true">
            <img src="/brand/icon-badge.svg" width={18} height={18} alt="" />
          </span>
          <h2 className="clients__title" id="clients-title">
            {block.title}
          </h2>
        </div>

        <div className="clients__rows">
          {rows.map((row, r) =>
            row.length ? (
              <Marquee key={r} direction={r ? 'right' : 'left'} label={`Client logos, row ${r + 1}`}>
                {row.map((logo) => (
                  <LogoItem key={logo.id ?? logo.name} logo={logo} />
                ))}
              </Marquee>
            ) : (
              <Marquee key={r} direction={r ? 'right' : 'left'}>
                {PLACEHOLDER_WIDTHS[r].map((w, i) => (
                  <span key={i} className="logo-slot logo-slot--ph" style={{ ['--w' as string]: w }} aria-hidden="true">
                    <i className="logo-slot__mark" />
                    <i className="logo-slot__word" />
                  </span>
                ))}
              </Marquee>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

import type { DeliveryPrinciplesBlock } from '@/payload-types'
import { Img } from '@/components/Img'
import { Stamp } from '@/components/Stamp'
import { ArrowUpRight, SectionHead } from '@/components/ui'
import './delivery-principles.css'

const THEMES: Record<string, string> = {
  dark: '#252525',
  white: '#fff',
  yellow: '#fff7a3',
  blue: '#afd6ff',
  pink: '#ffc9dd',
  purple: '#cbc5ff',
}

/** The architecture diagram used on the first card (Figma 329:2076). */
const Orbit = () => (
  <div className="orbit" aria-hidden="true">
    <img className="orbit__ring" src="/brand/orbit-ring.png" alt="" />
    <img className="orbit__tick orbit__tick--n" src="/brand/orbit-tick-n.svg" alt="" />
    <img className="orbit__tick orbit__tick--s" src="/brand/orbit-tick-s.svg" alt="" />
    <img className="orbit__tick orbit__tick--e" src="/brand/orbit-tick-e.svg" alt="" />
    <img className="orbit__tick orbit__tick--w" src="/brand/orbit-tick-w.svg" alt="" />
    <span className="orbit__hub">
      <img src="/brand/mark-z-green.svg" alt="" />
    </span>
    <span className="orbit__node orbit__node--api">
      <img src="/brand/orbit-api.gif" alt="" loading="lazy" />
      API
    </span>
    <span className="orbit__node orbit__node--web">
      <img src="/brand/orbit-web.gif" alt="" loading="lazy" />
      WEB
    </span>
    <span className="orbit__node orbit__node--db">
      <span className="orbit__db">
        <img src="/brand/orbit-db.svg" alt="" />
      </span>
      DB
    </span>
    <span className="orbit__node orbit__node--ai">
      <img src="/brand/orbit-ai.gif" alt="" loading="lazy" />
      AI
    </span>
  </div>
)

export function DeliveryPrinciples({ block }: { block: DeliveryPrinciplesBlock }) {
  return (
    <section className="sec principles" aria-labelledby="principles-title">
      <img className="principles__deco" src="/brand/principles-deco.svg" width={800} height={800} alt="" aria-hidden="true" />
      <Stamp />
      <div className="sec__inner">
        <SectionHead heading={block.heading} id="principles-title" layout="split" mainClassName="principles__main" />

        <div className="principles__grid">
          {(block.cards ?? []).map((c, i) => {
            const theme = c.theme || 'white'
            return (
              <article
                key={c.id ?? i}
                className={`pcard${theme === 'dark' ? ' pcard--dark' : ''}${c.visual === 'fill' ? ' pcard--fill' : ''}`}
                style={theme === 'dark' ? undefined : ({ '--pcard-bg': THEMES[theme] } as React.CSSProperties)}
              >
                <div className="pcard__copy">
                  {c.kicker ? <p className="pcard__kicker">{c.kicker}</p> : null}
                  <h3 className="pcard__title">
                    {c.title} {c.accent ? <em>{c.accent}</em> : null}
                  </h3>
                  {c.description ? <p className="pcard__desc">{c.description}</p> : null}
                  {c.link?.label ? (
                    <a className="pcard__link" href={c.link.href || '#contact'}>
                      {c.link.label} <ArrowUpRight className="" />
                    </a>
                  ) : null}
                </div>
                {c.visual === 'orbit' ? (
                  <Orbit />
                ) : c.image ? (
                  <figure
                    className={`pcard__media ${c.visual === 'fill' ? 'pcard__media--fill' : theme === 'pink' ? '' : 'pcard__media--shadow'}`}
                  >
                    <Img media={c.image} sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, 33vw" />
                  </figure>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

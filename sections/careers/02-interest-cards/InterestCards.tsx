import type { InterestCardsBlock } from '@/payload-types'
import { Cta } from '@/components/ui'
import './interest-cards.css'

/** Areas people can work in, each with focus tags and a button (Careers, Figma 755:3050). */
export function InterestCards({ block }: { block: InterestCardsBlock }) {
  const id = `areas-${block.id ?? 'x'}`
  return (
    // id="areas": the Careers hero's "Explore opportunities" button scrolls here
    <section className="sec areas" id="areas" aria-labelledby={id}>
      <div className="sec__inner">
        <header className="areas__head" data-reveal>
          {block.label ? <p className="areas__label">{block.label}</p> : null}
          <div className="areas__intro">
            <h2 className="areas__title" id={id}>
              {block.title}
            </h2>
            {block.accent ? <p className="areas__accent">{block.accent}</p> : null}
            {block.text ? <p className="areas__text">{block.text}</p> : null}
          </div>
        </header>
        <ul className="areas__grid">
          {(block.cards ?? []).map((c, i) => (
            <li className="area" key={c.id ?? i} data-reveal>
              <div className="area__top">
                <p className="area__kicker">{c.kicker || `Area ${String(i + 1).padStart(2, '0')}`}</p>
                <span className="area__icon" aria-hidden="true">
                  <img src={`/brand/careers/${c.icon || 'buildings'}.svg`} width={36} height={36} alt="" />
                </span>
              </div>
              <h3 className="area__title">{c.title}</h3>
              {c.text ? <p className="area__text">{c.text}</p> : null}
              {c.focus?.length ? (
                <>
                  <p className="area__focus-label">Typical focus</p>
                  <ul className="area__tags">
                    {c.focus.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              <Cta link={c.link} className="btn btn--secondary" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import type { CardGridBlock } from '@/payload-types'
import { AsideText, DisplayTitle, Eyebrow, SectionHead } from '@/components/ui'
import './card-grid.css'

/**
 * Heading plus a row of cards led by an orange figure
 * (About 1088:3602 / 1088:3640, Careers 755:3030).
 */
export function CardGrid({ block }: { block: CardGridBlock }) {
  const id = `cards-${block.id ?? 'x'}`
  const style = block.style || 'figures'
  return (
    <section className={`sec cards cards--${style} sec--${block.background || 'white'}`} aria-labelledby={id}>
      <div className="sec__inner">
        {style === 'outlined' ? (
          // title, then the text underneath at full width
          <header className="sec-head" data-reveal>
            {block.heading.eyebrow ? <Eyebrow>{block.heading.eyebrow}</Eyebrow> : null}
            <DisplayTitle heading={block.heading} id={id} />
            <AsideText text={block.heading.subtitle} className="cards__lede" />
          </header>
        ) : (
          <SectionHead heading={block.heading} id={id} layout="split" aside={<AsideText text={block.heading.subtitle} />} />
        )}
        <ul className="cards__grid">
          {(block.cards ?? []).map((c, i) => (
            <li className="card" key={c.id ?? i} data-reveal>
              <p className="card__figure">{c.figure || String(i + 1).padStart(2, '0')}</p>
              <h3 className="card__title">{c.title}</h3>
              {c.text ? <p className="card__text">{c.text}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

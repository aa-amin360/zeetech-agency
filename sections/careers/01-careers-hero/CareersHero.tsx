import type { CareersHeroBlock } from '@/payload-types'
import { mediaList } from '@/lib/media'
import { Img } from '@/components/Img'
import { Cta } from '@/components/ui'
import './careers-hero.css'

/** Light hero with a highlighted title and a collage of pill-shaped photos (Careers, Figma 740:4147). */
export function CareersHero({ block, isFirst }: { block: CareersHeroBlock; isFirst?: boolean }) {
  const Title = isFirst ? 'h1' : 'h2'
  const [main, ...side] = mediaList(block.images)
  const { label } = block
  return (
    <section className="sec collage-hero" aria-labelledby="collage-hero-title">
      <div className="sec__inner">
        <div className="collage-hero__copy" data-reveal>
          {block.eyebrow ? <p className="collage-hero__eyebrow">{block.eyebrow}</p> : null}
          <Title className="collage-hero__title" id="collage-hero-title">
            <span className="collage-hero__line">{block.title}</span>
            {block.highlight ? <em className="collage-hero__hl">{block.highlight}</em> : null}
          </Title>
          {block.text ? <p className="collage-hero__text">{block.text}</p> : null}
          <Cta link={block.cta} />
        </div>

        {main ? (
          <div className="collage-hero__media" data-reveal>
            <figure className="pill pill--main">
              <Img media={main} sizes="(max-width: 900px) 100vw, 66vw" priority={isFirst} />
              {label?.title ? (
                <figcaption className="collage-hero__label">
                  {label.kicker ? <span className="collage-hero__label-kicker">{label.kicker}</span> : null}
                  <strong>{label.title}</strong>
                  {label.text ? <span>{label.text}</span> : null}
                </figcaption>
              ) : null}
            </figure>
            {side.length ? (
              <div className="collage-hero__side">
                {side.map((m) => (
                  <figure className="pill" key={m.id}>
                    <Img media={m} sizes="(max-width: 900px) 50vw, 390px" priority={isFirst} />
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

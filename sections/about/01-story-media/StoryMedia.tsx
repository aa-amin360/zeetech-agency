import type { StoryMediaBlock } from '@/payload-types'
import { mediaList } from '@/lib/media'
import { Img } from '@/components/Img'
import { AsideText, SectionHead } from '@/components/ui'
import './story-media.css'

/**
 * Split heading and a picture layout (About, Figma 1088:3572 / 1088:3582 / 1088:3625):
 * a pair, a stack of three, or a wide scene with a person card.
 */
export function StoryMedia({ block }: { block: StoryMediaBlock }) {
  const id = `story-${block.id ?? 'x'}`
  const layout = block.layout || 'pair'
  const images = mediaList(block.images)
  const half = '(max-width: 900px) 100vw, 50vw'

  return (
    <section className={`sec story story--${layout} sec--${block.background || 'white'}`} aria-labelledby={id}>
      <div className="sec__inner">
        <SectionHead heading={block.heading} id={id} layout="split" aside={<AsideText text={block.heading.subtitle} />} />

        {layout === 'stack' ? (
          <div className="story__media" data-reveal>
            <div className="story__col">
              {images.slice(0, 2).map((m) => (
                <figure className="story__img" key={m.id}>
                  <Img media={m} sizes={half} />
                </figure>
              ))}
            </div>
            {images[2] ? (
              <figure className="story__img story__img--tall">
                <Img media={images[2]} sizes={half} />
              </figure>
            ) : null}
          </div>
        ) : layout === 'person' ? (
          <div className="story__media" data-reveal>
            {images[0] ? (
              <figure className="story__img story__img--wide">
                <Img media={images[0]} sizes="(max-width: 900px) 100vw, 64vw" />
              </figure>
            ) : null}
            {images[1] ? (
              <figure className="person">
                <div className="person__photo">
                  <Img media={images[1]} sizes="(max-width: 900px) 100vw, 576px" alt={block.person?.name || undefined} />
                </div>
                {block.person?.name ? (
                  <figcaption className="person__caption">
                    <strong>{block.person.name}</strong>
                    {block.person.role ? <span>{block.person.role}</span> : null}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>
        ) : (
          <div className="story__media" data-reveal>
            {images.slice(0, 2).map((m) => (
              <figure className="story__img" key={m.id}>
                <Img media={m} sizes={half} />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

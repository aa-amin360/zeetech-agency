import type { WorkHeroBlock } from '@/payload-types'
import { Img } from '@/components/Img'
import './work-hero.css'

export function WorkHero({ block, isFirst }: { block: WorkHeroBlock; isFirst?: boolean }) {
  const Title = isFirst ? 'h1' : 'h2'
  const lines = (block.title || '').split('\n').filter((l) => l.trim())
  return (
    <section className="page-hero" aria-labelledby="page-hero-title">
      <Img media={block.background} className="page-hero__bg" sizes="100vw" priority={isFirst} alt="" />
      <div className="page-hero__inner">
        <Title className="page-hero__title" id="page-hero-title" data-reveal>
          {lines.map((line, i) => (
            <span className="page-hero__line" key={i}>
              {line}
              {i === lines.length - 1 && block.highlight ? (
                <>
                  {' '}
                  <em className="page-hero__hl">{block.highlight}</em>
                </>
              ) : null}
            </span>
          ))}
        </Title>
      </div>
    </section>
  )
}

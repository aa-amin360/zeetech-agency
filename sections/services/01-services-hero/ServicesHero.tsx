import type { ServicesHeroBlock } from '@/payload-types'
import { Img } from '@/components/Img'
import { asMedia, mediaUrl } from '@/lib/media'
import { ArrowUpRight, CalendarIcon } from '@/components/ui'
import { GlassScene } from './GlassScene'
import './services-hero.css'

/** Dark page hero (Services page, Figma 670:1857). The header turns light over it. */
export function ServicesHero({ block, isFirst }: { block: ServicesHeroBlock; isFirst?: boolean }) {
  const Title = isFirst ? 'h1' : 'h2'
  const { primaryCta, secondaryCta } = block
  // the 3D scene uses the background photo; the original unless it is huge
  const bg = asMedia(block.background)
  const sceneBg = bg?.mimeType?.startsWith('image/')
    ? ((bg.width ?? 0) > 2560 && mediaUrl(bg, 'large')) || mediaUrl(bg)
    : ''
  return (
    <section className="dark-hero" aria-labelledby="dark-hero-title" data-nav-theme="dark">
      <Img media={block.background} className="dark-hero__bg" sizes="100vw" priority={isFirst} alt="" />
      {block.visual ? (
        <Img media={block.visual} className="dark-hero__visual" sizes="(max-width: 900px) 90vw, 50vw" priority={isFirst} alt="" />
      ) : null}
      {sceneBg ? <GlassScene bg={sceneBg} /> : null}
      <div className="dark-hero__inner">
        <div className="dark-hero__copy" data-reveal>
          {block.eyebrow ? <p className="dark-hero__eyebrow">{block.eyebrow}</p> : null}
          <Title className="dark-hero__title" id="dark-hero-title">
            {block.title}
            {block.highlight ? (
              <>
                {' '}
                <em className="dark-hero__hl">{block.highlight}</em>
              </>
            ) : null}
          </Title>
          {block.text ? <p className="dark-hero__text">{block.text}</p> : null}
          {primaryCta?.label || secondaryCta?.label ? (
            <div className="dark-hero__ctas">
              {primaryCta?.label ? (
                <a className="btn btn--primary" href={primaryCta.href || '#contact'}>
                  <span>{primaryCta.label}</span>
                  <CalendarIcon />
                </a>
              ) : null}
              {secondaryCta?.label ? (
                <a className="btn btn--outline-light" href={secondaryCta.href || '/work'}>
                  <span>{secondaryCta.label}</span>
                  <ArrowUpRight />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

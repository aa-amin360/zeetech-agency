import type { HeroBlock } from '@/payload-types'
import { mediaList, mediaSrcSet, mediaUrl } from '@/lib/media'
import { Img } from '@/components/Img'
import { CalendarIcon } from '@/components/ui'
import { HeroScene } from './HeroScene'
import './hero.css'

const TONES = ['warm', 'mint', 'lilac', 'dark', 'rose']

const ArrowIcon = () => (
  <svg className="btn__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Hero({ block, isFirst }: { block: HeroBlock; isFirst?: boolean }) {
  const { trust, headline, lede, primaryCta, secondaryCta } = block
  const tiles = mediaList(block.collage).map((m, i) => ({
    src: mediaUrl(m, 'card') || mediaUrl(m),
    srcSet: mediaSrcSet(m),
    tone: TONES[i % TONES.length],
  }))
  const Title = isFirst ? 'h1' : 'h2'

  const buttons =
    primaryCta?.label || secondaryCta?.label ? (
      <>
        {primaryCta?.label ? (
          <a className="btn btn--primary" href={primaryCta.href || '#contact'}>
            <span>{primaryCta.label}</span>
            <CalendarIcon />
          </a>
        ) : null}
        {secondaryCta?.label ? (
          <a className="btn btn--secondary" href={secondaryCta.href || '#work'}>
            <span>{secondaryCta.label}</span>
            <ArrowIcon />
          </a>
        ) : null}
      </>
    ) : null

  return (
    <HeroScene
      tiles={tiles}
      // phones: the same buttons float at the bottom of the screen (see HeroScene)
      floating={buttons ? <div className="hero-float">{buttons}</div> : null}
    >
      <div className="hero__content">
        <div className="hero__text">
          {/* frosted panel behind the copy on phones (hero.css) */}
          <div className="hero__glass">
            {trust?.badge || trust?.prefix ? (
              <p className="trust" data-intro>
                {trust.prefix ? <span>{trust.prefix}</span> : null}
                {trust.badge ? <span className="trust__badge">{trust.badge}</span> : null}
                {trust.avatars?.length ? (
                  <span className="avatars" aria-hidden="true">
                    {mediaList(trust.avatars).map((m) => (
                      <span className="avatar" key={m.id}>
                        <Img media={m} alt="" sizes="28px" priority={isFirst} />
                      </span>
                    ))}
                  </span>
                ) : null}
                {trust.suffix ? <span>{trust.suffix}</span> : null}
              </p>
            ) : null}

            <Title className="headline" id="hero-title">
              <span className="headline__line" data-intro>
                {headline.line1}
              </span>
              {headline.line2 ? (
                <span className="headline__line" data-intro>
                  {headline.line2}
                </span>
              ) : null}
              {headline.line3 || headline.highlight ? (
                <span className="headline__line" data-intro>
                  {headline.line3}
                  {headline.highlight ? <> <em className="headline__hl">{headline.highlight}</em></> : null}
                </span>
              ) : null}
            </Title>

            {lede ? (
              <p className="lede" data-intro>
                {lede}
              </p>
            ) : null}
          </div>
        </div>

        {buttons ? (
          <div className="hero__ctas" data-intro>
            {buttons}
          </div>
        ) : null}
      </div>
    </HeroScene>
  )
}

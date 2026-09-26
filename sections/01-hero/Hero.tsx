import type { HeroBlock } from '@/payload-types'
import { mediaList, mediaSrcSet, mediaUrl } from '@/lib/media'
import { Img } from '@/components/Img'
import { HeroScene } from './HeroScene'
import './hero.css'

const TONES = ['warm', 'mint', 'lilac', 'dark', 'rose']

const CalendarIcon = () => (
  <svg className="btn__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M6.667 1.667v2.5M13.333 1.667v2.5M2.917 7.575h14.166M17.5 7.083v7.084c0 2.5-1.25 4.166-4.167 4.166H6.667c-2.917 0-4.167-1.666-4.167-4.166V7.083c0-2.5 1.25-4.166 4.167-4.166h6.666c2.917 0 4.167 1.666 4.167 4.166Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.08 11.417h.007M13.08 13.917h.007M9.996 11.417h.008M9.996 13.917h.008M6.912 11.417h.008M6.912 13.917h.008"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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

  return (
    <HeroScene tiles={tiles} showControls={block.showBackdropControls !== false}>
      <div className="hero__content">
        <div className="hero__text">
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

        {primaryCta?.label || secondaryCta?.label ? (
          <div className="hero__ctas" data-intro>
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
          </div>
        ) : null}
      </div>
    </HeroScene>
  )
}

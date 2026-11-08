import type { PageIntroBlock } from '@/payload-types'
import { Img } from '@/components/Img'
import { AsideText, DisplayTitle, Eyebrow } from '@/components/ui'
import './page-intro.css'

/** Opening section of an inner page (About, Figma 1088:3568): split title, then a wide picture. */
export function PageIntro({ block, isFirst }: { block: PageIntroBlock; isFirst?: boolean }) {
  const { heading } = block
  return (
    <section className="sec intro" aria-labelledby="intro-title">
      <div className="sec__inner">
        <header className="sec-head sec-head--split" data-reveal>
          <div className="sec-head__main">
            {heading.eyebrow ? <Eyebrow>{heading.eyebrow}</Eyebrow> : null}
            <DisplayTitle heading={heading} id="intro-title" as={isFirst ? 'h1' : 'h2'} />
          </div>
          <AsideText text={heading.subtitle} className="intro__text" />
        </header>
        <figure className="intro__media" data-reveal>
          <Img media={block.image} sizes="(max-width: 1920px) 100vw, 1824px" priority={isFirst} />
        </figure>
      </div>
    </section>
  )
}

import type { ShowreelBlock } from '@/payload-types'
import { mediaList } from '@/lib/media'
import { Img } from '@/components/Img'
import { Marquee } from '@/components/Marquee'
import { SectionHead } from '@/components/ui'
import './showreel.css'

export function Showreel({ block }: { block: ShowreelBlock }) {
  const images = mediaList(block.images)
  return (
    <section className="sec showreel" aria-labelledby="showreel-title">
      <div className="sec__inner showreel__inner">
        <SectionHead heading={block.heading} id="showreel-title" subClassName="sub--soft" />

        {block.topTicker?.length ? (
          <Marquee className="ticker" label="Capabilities">
            {block.topTicker.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </Marquee>
        ) : null}

        {images.length ? (
          <Marquee className="ticker ticker--media" speed={60} label="Recent product work">
            {images.map((m) => (
              <Img key={m.id} media={m} sizes="(max-width: 900px) 260px, 28vw" />
            ))}
          </Marquee>
        ) : null}

        {block.bottomTicker?.length ? (
          <Marquee className="ticker ticker--navy" direction="right" label="Engineering services">
            {block.bottomTicker.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </Marquee>
        ) : null}
      </div>
    </section>
  )
}

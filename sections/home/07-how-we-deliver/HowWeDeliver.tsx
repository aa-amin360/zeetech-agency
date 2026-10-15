import type { HowWeDeliverBlock } from '@/payload-types'
import { asMedia, mediaSrcSet, mediaUrl, type MediaRef } from '@/lib/media'
import { StickyHead } from '@/components/StickyHead'
import { SectionHead } from '@/components/ui'
import { ServicesList } from './ServicesList'
import './how-we-deliver.css'

const img = (m: MediaRef) => (asMedia(m) ? { src: mediaUrl(m, 'card') || mediaUrl(m), srcSet: mediaSrcSet(m) } : null)

export function HowWeDeliver({ block }: { block: HowWeDeliverBlock }) {
  const services = (block.services ?? []).map((s) => ({
    title: s.title,
    description: s.description,
    tag: s.tag,
    link: s.link,
    image: img(s.image),
  }))

  return (
    <section className="sec deliver" id="expertise" aria-labelledby="deliver-title">
      <div className="sec__inner">
        <div className="deliver__stack">
          <SectionHead heading={block.heading} id="deliver-title" light subClassName="sub--dim" />
          <ServicesList services={services} fallback={img(block.preview)} />
        </div>
        <StickyHead section=".deliver" head=".sec-head, .deliver__bar" last=".deliver__preview, .svc:last-child" />
      </div>
    </section>
  )
}

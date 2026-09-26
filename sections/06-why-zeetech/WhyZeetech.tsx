import type { WhyZeetechBlock } from '@/payload-types'
import { resolveVideo } from '@/lib/video'
import { SectionHead } from '@/components/ui'
import { Reel } from './Reel'
import './why-zeetech.css'

export function WhyZeetech({ block }: { block: WhyZeetechBlock }) {
  return (
    <section className="sec why" id="studio" aria-labelledby="why-title">
      <div className="sec__inner">
        <SectionHead heading={block.heading} id="why-title" />
        <Reel video={resolveVideo(block.reel)} title="ZeeTech studio reel" />
      </div>
    </section>
  )
}

import type { WhyZeetechBlock } from '@/payload-types'
import { resolveVideo } from '@/lib/video'
import { asMedia } from '@/lib/media'
import { SectionHead } from '@/components/ui'
import { Reel } from './Reel'
import './why-zeetech.css'

export function WhyZeetech({ block }: { block: WhyZeetechBlock }) {
  return (
    <section className="sec why" id="studio" aria-labelledby="why-title">
      <div className="sec__inner">
        <SectionHead heading={block.heading} id="why-title" />
        {/* the poster's alt text names the speaker, e.g. "Marlin, Principal of MBMG LLC" */}
        <Reel video={resolveVideo(block.reel)} title="ZeeTech studio reel" caption={asMedia(block.reel?.poster ?? null)?.alt} />
      </div>
    </section>
  )
}

import type { Page } from '@/payload-types'
import { Hero } from './01-hero/Hero'
import { Statement } from './02-statement/Statement'
import { ClientLogos } from './03-client-logos/ClientLogos'
import { ProofStats } from './04-proof-stats/ProofStats'
import { SelectedWork } from './05-selected-work/SelectedWork'
import { WhyZeetech } from './06-why-zeetech/WhyZeetech'
import { ClientStories } from './07-client-stories/ClientStories'
import { HowWeDeliver } from './08-how-we-deliver/HowWeDeliver'
import { HowWeBuild } from './09-how-we-build/HowWeBuild'
import { DeliveryPrinciples } from './10-delivery-principles/DeliveryPrinciples'
import { Comparison } from './11-comparison/Comparison'
import { Showreel } from './12-showreel/Showreel'
import { Faq } from './13-faq/Faq'
import { ProjectInquiry } from './14-project-inquiry/ProjectInquiry'

type Block = NonNullable<Page['layout']>[number]

/** Renders a page's sections in the order the editor arranged them. */
export function RenderBlocks({ blocks }: { blocks: Page['layout'] }) {
  return (
    <>
      {(blocks ?? []).map((block: Block, i) => {
        const key = block.id ?? i
        switch (block.blockType) {
          case 'hero':
            return <Hero key={key} block={block} isFirst={i === 0} />
          case 'statement':
            return <Statement key={key} block={block} />
          case 'clientLogos':
            return <ClientLogos key={key} block={block} />
          case 'proofStats':
            return <ProofStats key={key} block={block} />
          case 'selectedWork':
            return <SelectedWork key={key} block={block} />
          case 'whyZeetech':
            return <WhyZeetech key={key} block={block} />
          case 'clientStories':
            return <ClientStories key={key} block={block} />
          case 'howWeDeliver':
            return <HowWeDeliver key={key} block={block} />
          case 'howWeBuild':
            return <HowWeBuild key={key} block={block} />
          case 'deliveryPrinciples':
            return <DeliveryPrinciples key={key} block={block} />
          case 'comparison':
            return <Comparison key={key} block={block} />
          case 'showreel':
            return <Showreel key={key} block={block} />
          case 'faq':
            return <Faq key={key} block={block} />
          case 'projectInquiry':
            return <ProjectInquiry key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}

import type { Page } from '@/payload-types'
import { Hero } from './home/01-hero/Hero'
import { Statement } from './home/02-statement/Statement'
import { ClientLogos } from './home/03-client-logos/ClientLogos'
import { ProofStats } from './home/04-proof-stats/ProofStats'
import { SelectedWork } from './home/05-selected-work/SelectedWork'
import { WhyZeetech } from './home/06-why-zeetech/WhyZeetech'
import { HowWeDeliver } from './home/07-how-we-deliver/HowWeDeliver'
import { HowWeBuild } from './home/08-how-we-build/HowWeBuild'
import { DeliveryPrinciples } from './home/09-delivery-principles/DeliveryPrinciples'
import { Comparison } from './home/10-comparison/Comparison'
import { Showreel } from './home/11-showreel/Showreel'
import { ClientStories } from './shared/client-stories/ClientStories'
import { Faq } from './shared/faq/Faq'
import { ProjectInquiry } from './shared/project-inquiry/ProjectInquiry'
import { WorkHero } from './work/01-work-hero/WorkHero'
import { WorkGrid } from './work/02-work-grid/WorkGrid'

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
          case 'workHero':
            return <WorkHero key={key} block={block} isFirst={i === 0} />
          case 'workGrid':
            return <WorkGrid key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}

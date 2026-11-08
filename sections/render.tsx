import type { Page, Service } from '@/payload-types'
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
import { ServicesHero } from './services/01-services-hero/ServicesHero'
import { ServicesList } from './services/02-services-list/ServicesList'
import { PageIntro } from './shared/page-intro/PageIntro'
import { CardGrid } from './shared/card-grid/CardGrid'
import { StoryMedia } from './about/01-story-media/StoryMedia'
import { ContactBand } from './about/02-contact-band/ContactBand'
import { CareersHero } from './careers/01-careers-hero/CareersHero'
import { InterestCards } from './careers/02-interest-cards/InterestCards'

type Block = NonNullable<Page['layout']>[number] | NonNullable<Service['layout']>[number]

/** Renders a page's sections in the order the editor arranged them. */
export function RenderBlocks({ blocks }: { blocks: Block[] | null | undefined }) {
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
          case 'servicesHero':
            return <ServicesHero key={key} block={block} isFirst={i === 0} />
          case 'servicesList':
            return <ServicesList key={key} block={block} />
          case 'pageIntro':
            return <PageIntro key={key} block={block} isFirst={i === 0} />
          case 'storyMedia':
            return <StoryMedia key={key} block={block} />
          case 'cardGrid':
            return <CardGrid key={key} block={block} />
          case 'contactBand':
            return <ContactBand key={key} block={block} />
          case 'careersHero':
            return <CareersHero key={key} block={block} isFirst={i === 0} />
          case 'interestCards':
            return <InterestCards key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}

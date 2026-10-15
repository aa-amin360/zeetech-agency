// Every section block the page builder offers, in the order the "Add section" list shows them.
// Folders: home/ and work/ hold sections used by one page, shared/ the ones used on several.
// The footer (layout/footer) is site-wide, so it is a global rather than a block.
import { HeroBlock } from './home/01-hero/block'
import { StatementBlock } from './home/02-statement/block'
import { ClientLogosBlock } from './home/03-client-logos/block'
import { ProofStatsBlock } from './home/04-proof-stats/block'
import { SelectedWorkBlock } from './home/05-selected-work/block'
import { WhyZeetechBlock } from './home/06-why-zeetech/block'
import { HowWeDeliverBlock } from './home/07-how-we-deliver/block'
import { HowWeBuildBlock } from './home/08-how-we-build/block'
import { DeliveryPrinciplesBlock } from './home/09-delivery-principles/block'
import { ComparisonBlock } from './home/10-comparison/block'
import { ShowreelBlock } from './home/11-showreel/block'
import { ClientStoriesBlock } from './shared/client-stories/block'
import { FaqBlock } from './shared/faq/block'
import { ProjectInquiryBlock } from './shared/project-inquiry/block'
import { WorkHeroBlock } from './work/01-work-hero/block'
import { WorkGridBlock } from './work/02-work-grid/block'

export const pageBlocks = [
  HeroBlock,
  StatementBlock,
  ClientLogosBlock,
  ProofStatsBlock,
  SelectedWorkBlock,
  WhyZeetechBlock,
  ClientStoriesBlock,
  HowWeDeliverBlock,
  HowWeBuildBlock,
  DeliveryPrinciplesBlock,
  ComparisonBlock,
  ShowreelBlock,
  FaqBlock,
  ProjectInquiryBlock,
  WorkHeroBlock,
  WorkGridBlock,
]

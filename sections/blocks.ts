// Every section block the page builder offers, in page order.
// Section 15 (footer) is site-wide, so it is a global rather than a block.
import { HeroBlock } from './01-hero/block'
import { StatementBlock } from './02-statement/block'
import { ClientLogosBlock } from './03-client-logos/block'
import { ProofStatsBlock } from './04-proof-stats/block'
import { SelectedWorkBlock } from './05-selected-work/block'
import { WhyZeetechBlock } from './06-why-zeetech/block'
import { ClientStoriesBlock } from './07-client-stories/block'
import { HowWeDeliverBlock } from './08-how-we-deliver/block'
import { HowWeBuildBlock } from './09-how-we-build/block'
import { DeliveryPrinciplesBlock } from './10-delivery-principles/block'
import { ComparisonBlock } from './11-comparison/block'
import { ShowreelBlock } from './12-showreel/block'
import { FaqBlock } from './13-faq/block'
import { ProjectInquiryBlock } from './14-project-inquiry/block'

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
]

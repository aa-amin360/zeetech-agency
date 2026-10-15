import type { CaseStudy, SelectedWorkBlock } from '@/payload-types'
import { docs } from '@/lib/media'
import { getPayloadClient, isPreview } from '@/lib/payload'
import { StickyHead } from '@/components/StickyHead'
import { Cta, DisplayTitle, Eyebrow } from '@/components/ui'
import { CaseCard } from './CaseCard'
import { WorkBar } from './WorkBar'
import './selected-work.css'

export async function SelectedWork({ block }: { block: SelectedWorkBlock }) {
  let studies = docs<CaseStudy>(block.caseStudies)
  if (!studies.length) {
    const payload = await getPayloadClient()
    const draft = await isPreview()
    studies = (
      await payload.find({ collection: 'case-studies', limit: 5, depth: 1, sort: '_order', draft, overrideAccess: draft })
    ).docs
  }

  return (
    <section className="sec work" id="work" aria-labelledby="work-title">
      <div className="sec__inner">
        <div className="work__stack">
          <header className="work__head" data-reveal>
            <div className="work__intro">
              {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
              {block.note ? <p className="sub">{block.note}</p> : null}
            </div>
            <DisplayTitle heading={block} id="work-title" className="work__title" />
            <Cta link={block.button} className="btn btn--ink" />
          </header>

          <WorkBar label={block.eyebrow || 'Selected work'} total={studies.length} />

          <div className="work__list">
            {studies.map((s) => (
              <CaseCard key={s.id} study={s} />
            ))}
          </div>
        </div>
        <StickyHead section=".work" head=".work__head, .work__bar" last=".case:last-child" items=".case" fullHead=".work__head" />
      </div>
    </section>
  )
}

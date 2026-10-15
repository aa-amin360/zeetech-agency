import type { CaseStudy, WorkGridBlock } from '@/payload-types'
import { docs } from '@/lib/media'
import { getPayloadClient, isPreview } from '@/lib/payload'
import { Img } from '@/components/Img'
import { WorkFilter } from './WorkFilter'
import './work-grid.css'

// one filter per industry, however it was typed (SaaS, SAAS, saas)
const key = (industry?: string | null) => (industry || '').trim().toLowerCase()

function WorkCard({ study }: { study: CaseStudy }) {
  return (
    <a className="wcard" href={`/work/${study.slug}`}>
      <figure className="wcard__media">
        <Img media={study.cover} sizes="(max-width: 900px) 100vw, 50vw" alt="" />
      </figure>
      <div className="wcard__body">
        <h2 className="wcard__title">
          {study.title}
          {study.titleAccent ? <em className="wcard__accent">{study.titleAccent}</em> : null}
        </h2>
        {study.summary ? <p className="wcard__desc">{study.summary}</p> : null}
        {study.service || study.industry ? (
          <p className="wcard__tags">
            {study.service ? <span className="wcard__tag">{study.service}</span> : null}
            {study.service && study.industry ? <span className="wcard__dot" aria-hidden="true" /> : null}
            {study.industry ? <span className="wcard__tag">{study.industry}</span> : null}
          </p>
        ) : null}
      </div>
    </a>
  )
}

export async function WorkGrid({ block }: { block: WorkGridBlock }) {
  let studies = docs<CaseStudy>(block.caseStudies)
  if (!studies.length) {
    const payload = await getPayloadClient()
    const draft = await isPreview()
    studies = (
      await payload.find({ collection: 'case-studies', limit: 100, depth: 1, sort: '_order', draft, overrideAccess: draft })
    ).docs
  }

  // filter buttons in the order the industries first appear
  const filters = new Map<string, string>()
  for (const s of studies) {
    const k = key(s.industry)
    if (k && !filters.has(k)) filters.set(k, s.industry!.trim())
  }

  return (
    <section className="wgrid" aria-label="Our work">
      <WorkFilter
        allLabel={block.allLabel || 'All Projects'}
        filters={[...filters].map(([value, label]) => ({ value, label }))}
        items={studies.map((s) => ({ id: s.id, filter: key(s.industry), card: <WorkCard study={s} /> }))}
      />
    </section>
  )
}

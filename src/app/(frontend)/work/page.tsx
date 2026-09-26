import type { Metadata } from 'next'
import { getPayloadClient, isPreview } from '@/lib/payload'
import { DisplayTitle, Eyebrow } from '@/components/ui'
import { CaseCard } from '@sections/05-selected-work/CaseCard'
import '@sections/05-selected-work/selected-work.css'
import './work.css'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected product design and engineering work by ZeeTech.',
  alternates: { canonical: '/work' },
}

export default async function WorkIndex() {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  const { docs } = await payload.find({
    collection: 'case-studies',
    limit: 50,
    depth: 1,
    sort: '_order',
    draft,
    overrideAccess: draft,
  })

  return (
    <section className="sec work work-index" aria-labelledby="work-index-title">
      <div className="sec__inner">
        <header className="sec-head">
          <Eyebrow>Selected work</Eyebrow>
          <DisplayTitle as="h1" id="work-index-title" heading={{ title: 'Work that solves', accent: 'real problems.' }} />
        </header>
        <div className="work__list">
          {docs.map((s) => (
            <CaseCard key={s.id} study={s} headingLevel={2} />
          ))}
        </div>
      </div>
    </section>
  )
}

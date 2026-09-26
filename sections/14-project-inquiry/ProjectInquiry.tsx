import type { ProjectInquiryBlock } from '@/payload-types'
import { Img } from '@/components/Img'
import { Eyebrow, SectionHead } from '@/components/ui'
import { InquiryForm } from './InquiryForm'
import './project-inquiry.css'

export function ProjectInquiry({ block }: { block: ProjectInquiryBlock }) {
  const { prep } = block
  return (
    <section className="sec inquiry" id="contact" aria-labelledby="inquiry-title">
      <div className="sec__inner">
        <SectionHead heading={block.heading} id="inquiry-title" layout="left" />

        <div className="inquiry__card" data-reveal>
          <div className="inquiry__side">
            <div className="inquiry__prep">
              {prep?.eyebrow ? <Eyebrow light>{prep.eyebrow}</Eyebrow> : null}
              {prep?.title ? <h3 className="inquiry__title">{prep.title}</h3> : null}
              {prep?.steps?.length ? (
                <ol className="steps">
                  {prep.steps.map((s, i) => (
                    <li key={s.id ?? i}>
                      <span className="steps__num">{String(i + 1).padStart(2, '0')}</span>
                      <span>
                        <strong>{s.title}</strong>
                        {s.text}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
            {prep?.person?.photo ? (
              <figure className="inquiry__person">
                <Img media={prep.person.photo} alt={prep.person.name ?? ''} sizes="366px" />
                <figcaption>
                  {prep.person.name ? <strong>{prep.person.name}</strong> : null}
                  {prep.person.role ? <span>{prep.person.role}</span> : null}
                </figcaption>
              </figure>
            ) : null}
          </div>

          <InquiryForm
            budgets={block.budgets ?? []}
            submitLabel={block.submitLabel || 'Send Inquiry'}
            successMessage={block.successMessage || 'Thank you — we’ll be in touch soon.'}
          />
        </div>
      </div>
    </section>
  )
}

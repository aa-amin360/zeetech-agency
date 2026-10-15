import type { Faq as FaqDoc, FaqBlock } from '@/payload-types'
import { docs, mediaList } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { Img } from '@/components/Img'
import { JsonLd } from '@/components/JsonLd'
import { Stamp } from '@/components/Stamp'
import { Cta, SectionHead } from '@/components/ui'
import { Accordion } from './Accordion'
import './faq.css'

export async function Faq({ block }: { block: FaqBlock }) {
  let faqs = docs<FaqDoc>(block.faqs)
  if (!faqs.length) {
    const payload = await getPayloadClient()
    faqs = (await payload.find({ collection: 'faqs', limit: 30, sort: '_order' })).docs
  }
  const card = block.helpCard

  return (
    <section className="sec faq" id="faq" aria-labelledby="faq-title">
      <img className="faq__knot" src="/brand/faq-knot.png" width={501} height={511} alt="" aria-hidden="true" loading="lazy" />
      <Stamp />
      <div className="sec__inner">
        <SectionHead heading={block.heading} id="faq-title" layout="split" mainClassName="faq__main" />

        <div className="faq__body">
          {card?.title ? (
            <aside className="help" data-reveal>
              {card.background ? <Img media={card.background} className="help__bg" alt="" sizes="(max-width: 900px) 100vw, 34vw" /> : null}
              {card.avatars?.length ? (
                <span className="help__avatars" aria-hidden="true">
                  {mediaList(card.avatars).map((m) => (
                    <Img key={m.id} media={m} alt="" sizes="48px" />
                  ))}
                </span>
              ) : null}
              <h3 className="help__title">
                {card.title} {card.accent ? <em>{card.accent}</em> : null}
              </h3>
              {card.text ? <p className="help__text">{card.text}</p> : null}
              <Cta link={card.cta} className="btn btn--signal" />
            </aside>
          ) : null}

          <Accordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
    </section>
  )
}

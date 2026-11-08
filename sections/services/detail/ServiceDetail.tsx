import type { Service } from '@/payload-types'
import { serviceNumber, nextService } from '@/lib/services'
import { Img } from '@/components/Img'
import { ArrowUpRight, DisplayTitle } from '@/components/ui'
import { RenderBlocks } from '../../render'
import './service-detail.css'

type Heading = { title?: string | null; accent?: string | null } | null | undefined

const heading = (h: Heading, title: string, accent: string) => ({
  title: h?.title || title,
  accent: h?.accent || accent,
})

/**
 * One service's page (/services/<slug>, Figma 688:1996): hero, deliverables, process,
 * questions, the sections chosen in the admin (e.g. the project inquiry form), then a
 * banner leading on to the next service.
 */
export function ServiceDetail({ service, all }: { service: Service; all: Service[] }) {
  const number = serviceNumber(all, service)
  const next = nextService(all, service)
  const { hero } = service

  return (
    <>
      <section className="svc-hero" aria-labelledby="svc-hero-title" data-nav-theme="dark">
        <Img media={hero?.image} className="svc-hero__bg" sizes="100vw" priority alt="" />
        <div className="svc-hero__inner">
          <div className="svc-hero__copy" data-reveal>
            <p className="svc-hero__eyebrow">
              {number}
              {service.kicker ? ` / ${service.kicker}` : ''}
            </p>
            <h1 className="svc-hero__title" id="svc-hero-title">
              {service.name}
            </h1>
            {service.summary ? <p className="svc-hero__text">{service.summary}</p> : null}
            {hero?.highlight ? (
              <p className="svc-hero__hl">
                <em>{hero.highlight}</em>
              </p>
            ) : null}
          </div>
          <a className="btn btn--primary" href="#contact">
            <span>{hero?.buttonLabel || 'Discuss your project'}</span>
            <ArrowUpRight />
          </a>
        </div>
      </section>

      {service.deliverables?.length ? (
        <section className="sec svc-sec" aria-labelledby="svc-deliver-title">
          <div className="sec__inner">
            <DisplayTitle
              id="svc-deliver-title"
              heading={heading(service.deliverablesHeading, 'What we deliver.', 'Built around your product.')}
            />
            <ul className="svc-deliver">
              {service.deliverables.map((d, i) => (
                <li className="svc-block" key={d.id ?? i} data-reveal>
                  <img className="svc-block__icon" src="/brand/icon-tick-dark.svg" width={24} height={24} alt="" />
                  <h3 className="svc-block__title">{d.title}</h3>
                  {d.text ? <p className="svc-block__text">{d.text}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {service.process?.length ? (
        <section className="sec svc-sec svc-sec--tint" aria-labelledby="svc-process-title">
          <div className="sec__inner">
            <DisplayTitle
              id="svc-process-title"
              heading={heading(service.processHeading, 'A clear process.', 'From first step to handoff.')}
            />
            <ol className="svc-steps">
              {service.process.map((s, i) => (
                <li className="svc-step" key={s.id ?? i} data-reveal>
                  <span className="svc-step__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="svc-block">
                    <h3 className="svc-block__title">{s.title}</h3>
                    {s.text ? <p className="svc-block__text">{s.text}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {service.questions?.length ? (
        <section className="sec svc-sec" aria-labelledby="svc-questions-title">
          <div className="sec__inner">
            <DisplayTitle
              id="svc-questions-title"
              heading={heading(service.questionsHeading, 'Before we start.', 'A few useful answers.')}
            />
            <dl className="svc-questions">
              {service.questions.map((q, i) => (
                <div className="svc-block" key={q.id ?? i} data-reveal>
                  <dt className="svc-block__title">{q.question}</dt>
                  <dd className="svc-block__text">{q.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <RenderBlocks blocks={service.layout} />

      {next ? (
        <section className="sec svc-next" aria-labelledby="svc-next-title">
          <img className="svc-next__bg" src="/brand/services-next-bg.webp" width={736} height={414} alt="" loading="lazy" />
          <div className="sec__inner">
            <DisplayTitle
              id="svc-next-title"
              heading={heading(service.nextHeading, 'One connected team.', 'Explore the next step.')}
            />
            <a className="btn btn--primary" href={`/services/${next.slug}`}>
              <span>Explore {next.name}</span>
              <ArrowUpRight />
            </a>
          </div>
        </section>
      ) : null}
    </>
  )
}

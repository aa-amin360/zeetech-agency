import type { Service, ServicesListBlock } from '@/payload-types'
import { docs } from '@/lib/media'
import { getServices } from '@/lib/payload'
import { serviceNumber, ServiceName } from '@/lib/services'
import { Img } from '@/components/Img'
import { ArrowUpRight, Eyebrow } from '@/components/ui'
import './services-list.css'

function ServiceRow({ service, number, buttonLabel }: { service: Service; number: string; buttonLabel: string }) {
  const href = `/services/${service.slug}`
  return (
    <article className="svc-row" aria-labelledby={`svc-${service.id}`} data-reveal>
      <figure className="svc-row__media">
        <Img media={service.image} sizes="(max-width: 900px) 100vw, 50vw" alt="" />
      </figure>
      <div className="svc-row__body">
        <p className="svc-row__kicker">
          <span className="eyebrow__badge" aria-hidden="true">
            <img src="/brand/icon-badge.svg" width={18} height={18} alt="" />
          </span>
          {number}
          {service.kicker ? ` / ${service.kicker}` : ''}
        </p>
        <h3 className="svc-row__title" id={`svc-${service.id}`}>
          <ServiceName name={service.name} accent={service.accent} />
        </h3>
        {service.summary ? <p className="svc-row__summary">{service.summary}</p> : null}
        {service.deliverables?.length ? (
          <div className="svc-row__list">
            {service.deliverables.map((d, i) => (
              // one open at a time per service; the first starts open like the design
              <details className="svc-item" name={`svc-${service.id}`} open={i === 0} key={d.id ?? i}>
                <summary>
                  <span className="svc-item__num">{String(i + 1).padStart(2, '0')}</span>
                  <img className="svc-item__mark" src="/brand/icon-diamond.svg" width={12} height={12} alt="" />
                  <span className="svc-item__title">{d.title}</span>
                </summary>
                {d.text ? <p className="svc-item__text">{d.text}</p> : null}
              </details>
            ))}
          </div>
        ) : null}
        {service.tagline ? <p className="svc-row__tagline">{service.tagline}</p> : null}
        <a className="btn btn--signal" href={href} aria-label={`${buttonLabel}: ${service.name}`}>
          <span>{buttonLabel}</span>
          <ArrowUpRight />
        </a>
      </div>
    </article>
  )
}

/** Every service with its picture and deliverables (Services page, Figma 638:2130). */
export async function ServicesList({ block }: { block: ServicesListBlock }) {
  const all = await getServices()
  const chosen = docs<Service>(block.services)
  const services = chosen.length ? chosen : all
  const eyebrowLines = (block.eyebrow || '').split('\n').filter((l) => l.trim())

  return (
    <section className="sec svc-list" aria-label="Our services">
      <div className="sec__inner">
        {eyebrowLines.length || block.intro ? (
          <header className="svc-list__head" data-reveal>
            {eyebrowLines.length ? (
              <Eyebrow>
                <span>
                  {eyebrowLines.map((line, i) => (
                    <span className="svc-list__eyebrow-line" key={i}>
                      {line}
                    </span>
                  ))}
                </span>
              </Eyebrow>
            ) : null}
            {block.intro ? <p className="svc-list__intro">{block.intro}</p> : null}
          </header>
        ) : null}

        <div className="svc-list__rows">
          {services.map((s) => (
            <ServiceRow
              key={s.id}
              service={s}
              number={serviceNumber(all, s)}
              buttonLabel={block.buttonLabel || 'Explore This Service'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

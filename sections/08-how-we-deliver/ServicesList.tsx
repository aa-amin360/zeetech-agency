'use client'

import { useEffect, useRef, useState } from 'react'

export type ServiceItem = {
  title: string
  description?: string | null
  tag?: string | null
  link?: { label?: string | null; href?: string | null } | null
  image?: { src: string; srcSet?: string } | null
}

/** Hovering (or scrolling past) a discipline makes it active and swaps the preview. */
export function ServicesList({
  services,
  fallback,
}: {
  services: ServiceItem[]
  fallback: { src: string; srcSet?: string } | null
}) {
  const [active, setActive] = useState(0)
  const list = useRef<HTMLOListElement>(null)
  const frame = useRef<HTMLElement>(null)
  const barFrame = useRef<HTMLElement>(null)
  const preview = services[active]?.image || fallback

  // the discipline under the reading line becomes active (desktop only)
  useEffect(() => {
    let revert: (() => void) | undefined
    let cancelled = false
    ;(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled || !list.current) return
      gsap.registerPlugin(ScrollTrigger)
      // the reading line sits in the part of the screen the sticky header (desktop) or the
      // preview bar (phones, tablets) leaves free
      const section = list.current.closest<HTMLElement>('.deliver')
      const lineAt = () => {
        const head = [...(section?.querySelectorAll<HTMLElement>('.sec-head, .deliver__bar') ?? [])].find(
          (el) => el.getClientRects().length && getComputedStyle(el).position === 'sticky',
        )
        const h = head?.offsetHeight ?? 0
        return h ? h + (innerHeight - h) * 0.3 : innerHeight * 0.55
      }
      const mm = gsap.matchMedia()
      // phones and tablets follow the scroll too (they have no hover), unless motion is reduced
      mm.add('(min-width: 901px), (prefers-reduced-motion: no-preference)', () => {
        const items = [...(list.current?.querySelectorAll<HTMLElement>('.svc') ?? [])]
        items.forEach((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            // the last one also counts once it is fully on screen, since it may never reach the line
            start: () =>
              `top ${i === items.length - 1 ? Math.max(lineAt(), innerHeight - el.offsetHeight - 24) : lineAt()}px`,
            end: () => `bottom ${lineAt()}px`,
            onToggle: (self) => self.isActive && setActive(i),
          }),
        )
      })
      revert = () => mm.revert()
    })()
    return () => {
      cancelled = true
      revert?.()
    }
  }, [])

  // a small settle animation when the preview changes
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    for (const el of [frame.current, barFrame.current]) {
      el?.animate([{ transform: 'scale(0.97)', opacity: 0.6 }, { transform: 'scale(1)', opacity: 1 }], {
        duration: 500,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      })
    }
  }, [active])

  const number = String(active + 1).padStart(2, '0')

  return (
    <>
      {/* phones and tablets: the preview sticks at the top while the disciplines scroll under it */}
      <div className="deliver__bar" aria-hidden="true">
        <p className="deliver__bar-head">
          <span className="deliver__active">{number} / {String(services.length).padStart(2, '0')}</span>
          <span className="deliver__bar-title">{services[active]?.title}</span>
        </p>
        {preview ? (
          <figure className="deliver__frame" ref={barFrame}>
            <img src={preview.src} srcSet={preview.srcSet} sizes="100vw" alt="" loading="lazy" />
          </figure>
        ) : null}
      </div>

      <div className="deliver__body">
        <ol className="deliver__list" ref={list}>
          {services.map((s, i) => (
            <li
              key={i}
              className={`svc${i === active ? ' is-active' : ''}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <h3 className="svc__title">{s.title}</h3>
              {s.description ? <p className="svc__desc">{s.description}</p> : null}
              <div className="svc__meta">
                {s.tag ? <span className="svc__tag">{s.tag}</span> : <span />}
                {s.link?.label ? (
                  <a className="svc__link" href={s.link.href || '#contact'}>
                    {s.link.label}
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <aside className="deliver__preview" aria-hidden="true">
          {preview ? (
            <figure className="deliver__frame" ref={frame}>
              <img src={preview.src} srcSet={preview.srcSet} sizes="(max-width: 1440px) 40vw, 579px" alt="" loading="lazy" />
            </figure>
          ) : null}
          <p className="deliver__caption">
            <span className="deliver__active">ACTIVE DISCIPLINE / {number}</span>
            <span className="deliver__hint">Hover a discipline to explore how we deliver</span>
          </p>
        </aside>
      </div>
    </>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Scroll motion for the whole page (GSAP + ScrollTrigger).
 * Everything is fully visible without it — motion is only added on top.
 */
export function Motion() {
  const pathname = usePathname()

  useEffect(() => {
    let revert: (() => void) | undefined
    let cancelled = false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    ;(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      // follow wall-clock time so slow frames (WebGL on weak GPUs) never stretch animations
      gsap.ticker.lagSmoothing(0)

      const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)]
      const has = (sel: string) => Boolean(document.querySelector(sel))

      const ctx = gsap.context(() => {
        const intro = $$('[data-intro]')
        if (reduceMotion) {
          gsap.set(intro, { autoAlpha: 1 })
          return
        }

        // hero intro: copy rises line by line, the collage fades in behind it
        if (intro.length) {
          gsap.set(intro, { autoAlpha: 0 })
          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .to('.hero .trust', { autoAlpha: 1, y: 0, duration: 0.6, startAt: { y: 16 } })
            .to('.headline__line', { autoAlpha: 1, yPercent: 0, duration: 0.9, stagger: 0.1, startAt: { yPercent: 60 } }, '-=0.35')
            .fromTo('.headline__hl', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.inOut' }, '-=0.45')
            .to(['.lede', '.hero__ctas'], { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, startAt: { y: 20 } }, '-=0.5')
            .to('.collage', { autoAlpha: 1, duration: 1.2, ease: 'power1.out' }, 0.2)
        }
        document.documentElement.classList.remove('motion-ready')

        // statement: lines rise, then the hand-drawn swash writes itself in
        if (has('.statement')) {
          gsap
            .timeline({ scrollTrigger: { trigger: '.statement', start: 'top 80%', once: true } })
            .from('.statement__line', { yPercent: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
            .from('.statement__swash', { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power2.inOut' }, '-=0.3')
        }

        // client logos (the rows' own transform belongs to the CSS marquee)
        if (has('.clients')) {
          gsap
            .timeline({ scrollTrigger: { trigger: '.clients', start: 'top 80%', once: true } })
            .from('.clients__head', { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
            .from('.clients__rows', { y: 32, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        }

        // section reveals
        const reveals = $$('[data-reveal]')
        if (reveals.length) {
          gsap.set(reveals, { autoAlpha: 0, y: 40 })
          ScrollTrigger.batch(reveals, {
            start: 'top 88%',
            once: true,
            onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
          })
        }

        // stat counters
        $$('.stat__num[data-count]').forEach((el) => {
          const end = Number(el.dataset.count)
          const suffix = el.dataset.suffix || ''
          const n = { v: 0 }
          el.textContent = `0${suffix}`
          ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () =>
              gsap.to(n, {
                v: end,
                duration: 1.6,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = `${Math.round(n.v)}${suffix}`
                },
              }),
          })
        })

        const mm = gsap.matchMedia()

        // work cards: each card eases back as the next one slides over it
        mm.add('(min-width: 901px) and (min-height: 720px)', () => {
          const cards = $$('.case')
          cards.forEach((card, i) => {
            const next = cards[i + 1]
            if (!next) return
            gsap.to(card, {
              scale: 0.94,
              ease: 'none',
              scrollTrigger: {
                trigger: next,
                start: 'top bottom',
                end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
                scrub: true,
              },
            })
          })
        })

        // delivery map: hub pops, wires draw, stages rise
        if (has('.build__map')) {
          mm.add('(min-width: 1181px)', () => {
            const wires = $$<SVGPathElement>('.wire')
            wires.forEach((p) => {
              const len = p.getTotalLength()
              gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
            })
            gsap
              .timeline({ scrollTrigger: { trigger: '.build__map', start: 'top 75%', once: true } })
              .from('.build__hub', { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)' })
              .to(wires, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.08 }, '-=0.1')
              .from('.stage', { y: 36, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, '-=0.6')
          })
          mm.add('(max-width: 1180px)', () => {
            gsap.from('.stage', {
              y: 30,
              autoAlpha: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.06,
              scrollTrigger: { trigger: '.build__cards', start: 'top 85%', once: true },
            })
          })
        }

        // principles: cards rise in a cascade
        if (has('.pcard')) {
          ScrollTrigger.batch('.pcard', {
            start: 'top 90%',
            once: true,
            onEnter: (els) => gsap.from(els, { y: 48, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }),
          })
        }

        // decorative drift
        if (has('.principles__deco')) {
          gsap.to('.principles__deco', {
            yPercent: -18,
            ease: 'none',
            scrollTrigger: { trigger: '.principles', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }
        if (has('.faq__knot')) {
          gsap.to('.faq__knot', {
            yPercent: 14,
            rotation: 8,
            ease: 'none',
            scrollTrigger: { trigger: '.faq', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }

        // footer wordmark rises piece by piece
        if (has('.wordmark')) {
          gsap.from('.wordmark img', {
            yPercent: 60,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.05,
            scrollTrigger: { trigger: '.footer__wordmark', start: 'top 92%', once: true },
          })
        }
      })

      // images and fonts change heights after load
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      document.fonts?.ready.then(refresh)

      revert = () => {
        window.removeEventListener('load', refresh)
        ctx.revert()
      }
    })()

    return () => {
      cancelled = true
      revert?.()
    }
  }, [pathname])

  return null
}

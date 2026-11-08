import type { ContactBandBlock } from '@/payload-types'
import { getGlobals } from '@/lib/payload'
import { Cta, DisplayTitle, Eyebrow } from '@/components/ui'
import './contact-band.css'

/** Closing invitation with the studio's email (About, Figma 1095:3677). */
export async function ContactBand({ block }: { block: ContactBandBlock }) {
  const email = block.email || (await getGlobals()).settings.email
  const id = `band-${block.id ?? 'x'}`
  return (
    <section className="sec band" aria-labelledby={id}>
      <img className="band__bg" src="/brand/services-next-bg.webp" width={736} height={414} alt="" loading="lazy" />
      <div className="sec__inner">
        <div className="band__head" data-reveal>
          {block.heading.eyebrow ? <Eyebrow>{block.heading.eyebrow}</Eyebrow> : null}
          <DisplayTitle heading={block.heading} id={id} />
        </div>
        <div className="band__contact" data-reveal>
          {email ? (
            <a className="band__email" href={`mailto:${email}`}>
              {email}
            </a>
          ) : null}
          <Cta link={block.cta} />
        </div>
      </div>
    </section>
  )
}

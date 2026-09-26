import type { HowWeBuildBlock } from '@/payload-types'
import { mediaList } from '@/lib/media'
import { Img } from '@/components/Img'
import { Marquee } from '@/components/Marquee'
import { Cta, SectionHead } from '@/components/ui'
import './how-we-build.css'

const MAP_W = 1664
const GAP = 24

/** Connector paths from the hub to the centre of each stage card (Figma 274:53780). */
function wirePaths(count: number) {
  if (!count) return []
  const w = (MAP_W - GAP * (count - 1)) / count
  const centres = Array.from({ length: count }, (_, i) => +(i * (w + GAP) + w / 2).toFixed(1))
  const hub = MAP_W / 2
  return [
    `M${hub} 126V176`,
    `M${centres[0]} 176H${centres[centres.length - 1]}`,
    ...centres.map(
      (x) => `M${x} 176c0 12-8 20-17 20s-13-7-13-13c0-9 9-13 16-9 9 5 14 16 14 32v58M${x - 7} 259l7 7 7-7`,
    ),
  ]
}

export function HowWeBuild({ block }: { block: HowWeBuildBlock }) {
  const tools = mediaList(block.toolIcons)
  const rowA = tools.flatMap((t) => [t, t])
  const rowB = [...tools].reverse().flatMap((t) => [t, t])
  const stages = block.stages ?? []

  return (
    <section className="sec build" id="process" aria-labelledby="build-title">
      <img className="build__bg" src="/brand/build-bg.png" alt="" aria-hidden="true" loading="lazy" />
      <div className="sec__inner">
        <SectionHead heading={block.heading} id="build-title" />

        <div className="build__stage">
          {tools.length ? (
            <div className="build__tools" aria-hidden="true">
              {[rowA, rowB].map((row, r) => (
                <Marquee key={r} speed={28} direction={r ? 'right' : 'left'} className="build__row">
                  {row.map((m, i) => (
                    <span className="build__tile" key={`${m.id}-${i}`}>
                      <Img media={m} alt="" sizes="80px" />
                    </span>
                  ))}
                </Marquee>
              ))}
            </div>
          ) : null}

          <div className="build__map">
            <div className="build__hub">
              <img src="/brand/mark-z-orange.svg" width={60} height={60} alt="ZeeTech" />
            </div>

            <svg className="build__wires" viewBox="0 120 1664 155" fill="none" aria-hidden="true">
              {wirePaths(stages.length).map((d, i) => (
                <path key={i} className="wire" d={d} />
              ))}
            </svg>

            <ol className="build__cards" style={{ ['--stages' as string]: stages.length || 1 }}>
              {stages.map((s, i) => (
                <li className="stage" key={s.id ?? i}>
                  <div className="stage__top">
                    <span className="stage__num">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="stage__title">{s.title}</h3>
                    {s.tools?.length ? (
                      <span className="stage__tools">
                        {mediaList(s.tools).map((m) => (
                          <Img key={m.id} media={m} alt="" sizes="48px" />
                        ))}
                      </span>
                    ) : null}
                  </div>
                  {s.delivers?.length ? (
                    <>
                      <p className="stage__label">DELIVERS</p>
                      <ul className="chips">
                        {s.delivers.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {block.footerText || block.cta?.label ? (
          <footer className="build__foot" data-reveal>
            {block.footerText ? <p className="sub">{block.footerText}</p> : null}
            <Cta link={block.cta} className="btn btn--signal" />
          </footer>
        ) : null}
      </div>
    </section>
  )
}

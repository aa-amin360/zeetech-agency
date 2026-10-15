import type { CSSProperties } from 'react'
import type { ComparisonBlock } from '@/payload-types'
import { Img } from '@/components/Img'
import { SectionHead } from '@/components/ui'
import './comparison.css'

const MARKS: Record<string, { src: string; label: string; cls: string }> = {
  yes: { src: '/brand/icon-tick-circle.svg', label: 'Included', cls: '' },
  check: { src: '/brand/icon-check.svg', label: 'Included', cls: 'cmp__mark--check' },
  dot: { src: '/brand/icon-dot.svg', label: 'Partial', cls: 'cmp__mark--dot' },
  no: { src: '/brand/icon-x-circle.svg', label: 'Not covered', cls: '' },
}

/** Key under the compact table (phones and tablets). */
const KEY = [MARKS.check, MARKS.dot, MARKS.no]

const RINGS: Record<string, { ring: string; glow?: string }> = {
  orange: { ring: '#fd5600' },
  green: { ring: '#23d400', glow: 'rgba(185, 242, 39, 0.14)' },
  lime: { ring: '#b9f227' },
  yellow: { ring: '#fdc72e', glow: 'rgba(253, 199, 46, 0.14)' },
}

/** In the highlighted row, capital letters are orange (ZeeTech → Z…T…). */
const brandName = (name: string, highlight?: boolean | null) =>
  highlight
    ? name.split(/([A-Z])/).map((part, i) => (/^[A-Z]$/.test(part) ? <span className="o" key={i}>{part}</span> : part))
    : name

export function Comparison({ block }: { block: ComparisonBlock }) {
  const columns = block.columns ?? []
  const cols = { ['--cols' as string]: columns.length || 6 } as CSSProperties

  return (
    <section className="sec compare" aria-labelledby="compare-title">
      <img className="compare__bg" src="/brand/compare-bg.png" alt="" aria-hidden="true" loading="lazy" />
      <div className="sec__inner">
        <SectionHead heading={block.heading} id="compare-title" subClassName="sub--soft" />

        <div className="cmp-scroll">
          <div className="cmp" role="table" aria-label="Delivery model comparison" style={cols}>
            <div className="cmp__row cmp__row--head" role="row">
              <span className="cmp__label" role="columnheader">
                {block.firstColumnLabel}
              </span>
              {columns.map((c, i) => (
                <span className="cmp__cell" role="columnheader" key={i}>
                  <span className="cmp__col">{c}</span>
                </span>
              ))}
            </div>
            <div className="cmp__body">
              {(block.rows ?? []).map((r, i) => {
                const ring = RINGS[r.ring || 'orange'] ?? RINGS.orange
                return (
                  <div className={`cmp__row${r.highlight ? ' cmp__row--zee' : ''}`} role="row" key={r.id ?? i} data-reveal>
                    <div className="cmp__label" role="rowheader">
                      <span
                        className="cmp__bubble"
                        style={{ ['--ring' as string]: ring.ring, ...(ring.glow ? { ['--glow' as string]: ring.glow } : {}) } as CSSProperties}
                      >
                        <Img media={r.icon} alt="" sizes="60px" />
                      </span>
                      <span className="cmp__name">
                        <strong>{brandName(r.name, r.highlight)}</strong>
                        {r.description ? <span>{r.description}</span> : null}
                      </span>
                    </div>
                    {columns.map((_, j) => {
                      const mark = MARKS[r.cells?.[j]?.mark ?? 'dot'] ?? MARKS.dot
                      return (
                        <span className="cmp__cell" role="cell" key={j}>
                          <img className={`cmp__mark ${mark.cls}`.trim()} src={mark.src} alt={mark.label} />
                        </span>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* phones and tablets: what the marks mean */}
        <ul className="cmp-key" aria-hidden="true">
          {KEY.map((m) => (
            <li key={m.label}>
              <img className={`cmp__mark ${m.cls}`.trim()} src={m.src} alt="" />
              {m.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

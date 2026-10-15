import type { StatementBlock } from '@/payload-types'
import './statement.css'

export function Statement({ block }: { block: StatementBlock }) {
  return (
    <section className="statement" aria-label="What we believe">
      <div className="statement__inner">
        <h2 className="statement__title">
          <span className="statement__line">{block.line1}</span>
          {block.line2 || block.accent ? (
            <span className="statement__line">
              {block.line2}
              {block.accent ? (
                <>
                  {' '}
                  <span className="statement__accent">
                    <span className="statement__accent-text">{block.accent}</span>
                    <svg className="statement__swash" viewBox="0 0 528 7" preserveAspectRatio="none" aria-hidden="true">
                      <path
                        d="M.6 6.1C1.4 4.6 3 3.6 6.4 3.3 70 2.2 190 1.3 300 1.5c90 .2 170 1.2 227.4 2.6-.1.9-.3 1.4-.8 1.6C470 4.5 390 3.7 300 3.4 190 3.1 80 3.7 8 4.6 5 4.8 3 5.4 1.9 6.6z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </>
              ) : null}
            </span>
          ) : null}
        </h2>
      </div>
    </section>
  )
}

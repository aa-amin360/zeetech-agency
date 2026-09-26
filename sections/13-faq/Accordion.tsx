'use client'

import { useId, useState } from 'react'

/** One answer open at a time. */
export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0)
  const base = useId()

  return (
    <div className="acc">
      {items.map((item, i) => {
        const isOpen = open === i
        const q = `${base}-q${i}`
        const a = `${base}-a${i}`
        return (
          <div className={`acc__item${isOpen ? ' is-open' : ''}`} key={i}>
            <h3 className="acc__q">
              <button type="button" id={q} aria-expanded={isOpen} aria-controls={a} onClick={() => setOpen(isOpen ? -1 : i)}>
                {item.question}
                <span className="acc__icon" aria-hidden="true">
                  <img className="acc__plus" src="/brand/icon-plus.svg" alt="" />
                  <img className="acc__minus" src="/brand/icon-minus.svg" alt="" />
                </span>
              </button>
            </h3>
            <div className="acc__panel" id={a} role="region" aria-labelledby={q}>
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

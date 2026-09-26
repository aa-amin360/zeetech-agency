import './stamp.css'

/** Rotating "ZeeTech digital partners" stamp in a section's top-right corner. */
export function Stamp() {
  return (
    <div className="stamp" aria-hidden="true">
      <img className="stamp__outer" src="/brand/stamp-ring-outer.svg" width={315} height={315} alt="" />
      <img className="stamp__inner" src="/brand/stamp-ring-inner.svg" width={210} height={210} alt="" />
      <img className="stamp__dot" src="/brand/stamp-dot.svg" width={13} height={13} alt="" />
      <span className="stamp__title">
        ZEETECH
        <br />
        DIGITAL PARTNERS
      </span>
      <span className="stamp__small">
        IDEAS
        <br />
        SYSTEMS
        <br />
        REAL IMPACT
      </span>
    </div>
  )
}

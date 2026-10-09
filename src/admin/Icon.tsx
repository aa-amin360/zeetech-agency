/** Small mark at the top of the admin menu (replaces the Payload icon); a light version for dark theme. */
export function Icon() {
  return (
    <span className="zt-icon">
      <img className="zt-icon__light" src="/brand/mark-z-orange.svg" width={28} height={28} alt="ZeeTech" />
      <img className="zt-icon__dark" src="/brand/mark-z-light.svg" width={28} height={28} alt="ZeeTech" />
    </span>
  )
}

/** Admin login screen logo: the dark wordmark on light theme, the white one on dark theme. */
export function Logo() {
  return (
    <span className="zt-logo">
      <img className="zt-logo__light" src="/brand/logo-zeetech.svg" width={180} height={60} alt="ZeeTech" />
      <img className="zt-logo__dark" src="/brand/logo-zeetech-light.svg" width={180} height={60} alt="ZeeTech" />
    </span>
  )
}

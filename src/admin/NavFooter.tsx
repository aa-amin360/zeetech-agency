/** Bottom of the admin sidebar menu: a link to the live website. */
export function NavFooter() {
  return (
    <div className="zt-nav-bottom">
      <a className="nav__link zt-nav-link zt-nav-link--website" href="/" target="_blank" rel="noopener noreferrer">
        <span className="nav__link-label">View website</span>
      </a>
    </div>
  )
}

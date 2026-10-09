'use client'

import { useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

/** Top of the admin sidebar: the logo and a link back to the dashboard. */
export function NavBrand() {
  const { config } = useConfig()
  const admin = config.routes.admin
  const onDashboard = usePathname() === admin

  return (
    <div className="zt-nav-top">
      <a className="zt-nav-brand" href={admin}>
        <span className="zt-logo">
          <img className="zt-logo__light" src="/brand/logo-zeetech.svg" width={132} height={44} alt="ZeeTech" />
          <img className="zt-logo__dark" src="/brand/logo-zeetech-light.svg" width={132} height={44} alt="ZeeTech" />
        </span>
        <span className="zt-nav-brand__tag">Website admin</span>
      </a>
      {onDashboard ? (
        <div className="nav__link zt-nav-link zt-nav-link--dashboard" aria-current="page">
          <span className="nav__link-label">Dashboard</span>
        </div>
      ) : (
        <a className="nav__link zt-nav-link zt-nav-link--dashboard" href={admin}>
          <span className="nav__link-label">Dashboard</span>
        </a>
      )}
    </div>
  )
}

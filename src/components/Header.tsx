import type { AnchorHTMLAttributes } from 'react'
import type { Header as HeaderData, Service } from '@/payload-types'
import { ArrowUpRight } from './ui'
import { HeaderState } from './HeaderState'
import { MobileMenu } from './MobileMenu'
import './header.css'

type NavLink = { label: string; href?: string | null }

/** Rolling hover label used by every menu link. */
function RollLink({ link, ...rest }: { link: NavLink } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className="roll" href={link.href || '#'} {...rest}>
      <span className="roll__clip">
        <span className="roll__track">
          <span>{link.label}</span>
          <span aria-hidden="true">{link.label}</span>
        </span>
      </span>
    </a>
  )
}

/** The panel under "Services" (Figma 638:2629): every service in three columns. */
function ServicesMenu({ services }: { services: Service[] }) {
  const rows = Math.ceil(services.length / 3)
  return (
    <div className="svc-menu">
      <p className="svc-menu__label">Services</p>
      <ul className="svc-menu__grid">
        {services.map((s, i) => (
          // no rule under the last service of each column
          <li key={s.id} className={i % rows === rows - 1 || i === services.length - 1 ? 'is-last' : undefined}>
            <a className="svc-menu__item" href={`/services/${s.slug}`}>
              <img src={`/brand/menu/${s.icon || 'layers-3'}.svg`} width={32} height={32} alt="" />
              <span className="svc-menu__copy">
                <span className="svc-menu__name">{s.name} →</span>
                {s.kicker ? <span className="svc-menu__note">{s.kicker}</span> : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Header({ data, services = [] }: { data: HeaderData; services?: Service[] }) {
  const links = (data.links ?? []).map((l) => l.link).filter((l) => l?.label) as NavLink[]
  // the "Services" menu link (pointing at /services) gets the panel listing every service
  const isServices = (l: NavLink) => services.length > 0 && l.href?.replace(/\/$/, '') === '/services'
  return (
    <header className="site-header">
      <div className="nav">
        <div className="nav__inner">
          <a className="logo" href="/" aria-label="ZeeTech home">
            <img src="/brand/logo-zeetech.svg" width={180} height={60} alt="" />
            {/* shown instead while the header sits over a dark hero */}
            <img className="logo__light" src="/brand/logo-zeetech-light.svg" width={180} height={60} alt="" />
          </a>

          <nav className="nav__links" aria-label="Primary">
            {links.map((l) =>
              isServices(l) ? (
                <div className="nav__drop" key={l.label}>
                  <RollLink link={l} aria-haspopup="true" />
                  <ServicesMenu services={services} />
                </div>
              ) : (
                <RollLink link={l} key={l.label} />
              ),
            )}
          </nav>

          {data.cta?.label ? (
            <a className="btn btn--primary btn--nav" href={data.cta.href || '#contact'}>
              <span>{data.cta.label}</span>
              <ArrowUpRight />
            </a>
          ) : null}

          <MobileMenu
            links={links.map((l) =>
              isServices(l) ? { ...l, children: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })) } : l,
            )}
            cta={data.cta?.label ? { label: data.cta.label, href: data.cta.href || '#contact' } : null}
          />
        </div>
      </div>
      <HeaderState />
    </header>
  )
}

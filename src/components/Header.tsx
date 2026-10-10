import type { Header as HeaderData } from '@/payload-types'
import { ArrowUpRight } from './ui'
import { HeaderState } from './HeaderState'
import { MobileMenu } from './MobileMenu'
import './header.css'

export function Header({ data }: { data: HeaderData }) {
  const links = (data.links ?? []).map((l) => l.link).filter((l) => l?.label) as { label: string; href?: string | null }[]
  return (
    <header className="site-header">
      <div className="nav">
        <div className="nav__inner">
          <a className="logo" href="/" aria-label="ZeeTech home">
            <img src="/brand/logo-zeetech.svg" width={180} height={60} alt="" />
          </a>

          <nav className="nav__links" aria-label="Primary">
            {links.map((l) => (
              <a className="roll" href={l.href || '#'} key={l.label}>
                <span className="roll__clip">
                  <span className="roll__track">
                    <span>{l.label}</span>
                    <span aria-hidden="true">{l.label}</span>
                  </span>
                </span>
              </a>
            ))}
          </nav>

          {data.cta?.label ? (
            <a className="btn btn--primary btn--nav" href={data.cta.href || '#contact'}>
              <span>{data.cta.label}</span>
              <ArrowUpRight />
            </a>
          ) : null}

          <MobileMenu links={links} cta={data.cta?.label ? { label: data.cta.label, href: data.cta.href || '#contact' } : null} />
        </div>
      </div>
      <HeaderState />
    </header>
  )
}

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '@/styles/globals.css'
import { getGlobals } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { serverUrl } from '@/lib/url'
import { Attribution } from '@/components/Attribution'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { Motion } from '@/components/Motion'
import { Tracking } from '@/components/Tracking'
import { Footer } from '@sections/15-footer/Footer'
import { fontVariables } from './fonts'

// cached pages (including the 404 page) refresh at least hourly; admin edits refresh them at once
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getGlobals()
  const name = settings.siteName || 'ZeeTech'
  const image = mediaUrl(settings.defaultShareImage, 'og') || mediaUrl(settings.defaultShareImage)
  return {
    metadataBase: new URL(serverUrl()),
    title: { default: name, template: settings.titleTemplate || `%s — ${name}` },
    description: settings.defaultDescription || undefined,
    applicationName: name,
    openGraph: { siteName: name, type: 'website', locale: 'en_US', images: image ? [image] : undefined },
    twitter: { card: 'summary_large_image' },
    verification: settings.searchConsoleToken ? { google: settings.searchConsoleToken } : undefined,
    icons: { icon: '/brand/mark-z-orange.svg' },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fdfafe',
}

// Hides the hero copy before first paint only when JS will animate it in.
const motionReady = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ready')`

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const { header, footer, settings } = await getGlobals()

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName || 'ZeeTech',
    legalName: settings.legalName || undefined,
    url: serverUrl(),
    logo: `${serverUrl()}/brand/logo-zeetech.svg`,
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
    address: settings.address || undefined,
    sameAs: (settings.socials ?? []).map((s) => s.url).filter(Boolean),
  }

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionReady }} />
      </head>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header data={header} />
        <main id="main">{children}</main>
        <Footer data={footer} />
        <Motion />
        <Attribution />
        <Tracking settings={settings} />
        <JsonLd data={organization} />
      </body>
    </html>
  )
}

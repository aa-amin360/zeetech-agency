import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServices, isPreview } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { serverUrl } from '@/lib/url'
import { JsonLd } from '@/components/JsonLd'
import { RefreshOnSave } from '@/components/RefreshOnSave'
import { ServiceDetail } from '@sections/services/detail/ServiceDetail'

// Rendered on first request and cached; saving in the admin clears the cache.
export const revalidate = 3600
export const dynamicParams = true
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ slug: string }> }

const findService = async (params: Props['params']) => {
  const { slug } = await params
  const all = await getServices()
  return { all, service: all.find((s) => s.slug === slug) }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await findService(params)
  if (!service) return {}
  const image = mediaUrl(service.meta?.image, 'og') || mediaUrl(service.hero?.image, 'og')
  const path = `/services/${service.slug}`
  return {
    title: service.meta?.title || service.name,
    description: service.meta?.description || service.summary || undefined,
    alternates: { canonical: path },
    openGraph: { url: path, images: image ? [image] : undefined },
  }
}

export default async function ServicePage({ params }: Props) {
  const { all, service } = await findService(params)
  if (!service) notFound()
  const preview = await isPreview()

  return (
    <>
      {preview ? <RefreshOnSave /> : null}
      <ServiceDetail service={service} all={all} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: service.summary || undefined,
          url: `${serverUrl()}/services/${service.slug}`,
          provider: { '@type': 'Organization', name: 'ZeeTech', url: serverUrl() },
          hasOfferCatalog: service.deliverables?.length
            ? {
                '@type': 'OfferCatalog',
                name: service.name,
                itemListElement: service.deliverables.map((d) => ({
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: d.title, description: d.text || undefined },
                })),
              }
            : undefined,
        }}
      />
    </>
  )
}

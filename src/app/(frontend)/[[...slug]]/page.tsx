import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGlobals, getPage, isPreview } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { RefreshOnSave } from '@/components/RefreshOnSave'
import { RenderBlocks } from '@sections/render'

// Pages are rendered on first request and cached; saving in the admin clears the cache.
export const revalidate = 3600
export const dynamicParams = true
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ slug?: string[] }> }

const slugOf = async (params: Props['params']) => {
  const { slug } = await params
  return slug?.length ? slug.join('/') : 'home'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await slugOf(params)
  const [page, { settings }] = await Promise.all([getPage(slug), getGlobals()])
  if (!page) return {}
  const meta = page.meta
  const image = mediaUrl(meta?.image, 'og') || mediaUrl(meta?.image)
  const path = slug === 'home' ? '/' : `/${slug}`
  return {
    title: slug === 'home' ? { absolute: meta?.title || settings.siteName || page.title } : meta?.title || page.title,
    description: meta?.description || settings.defaultDescription || undefined,
    alternates: { canonical: path },
    openGraph: {
      title: meta?.title || page.title,
      description: meta?.description || settings.defaultDescription || undefined,
      url: path,
      images: image ? [image] : undefined,
    },
  }
}

export default async function Page({ params }: Props) {
  const slug = await slugOf(params)
  const page = await getPage(slug)
  if (!page) notFound()
  const preview = await isPreview()

  return (
    <>
      {preview ? <RefreshOnSave /> : null}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}

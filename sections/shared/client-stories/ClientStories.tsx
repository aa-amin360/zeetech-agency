import type { ClientStoriesBlock, Testimonial } from '@/payload-types'
import { docs, mediaUrl } from '@/lib/media'
import { getPayloadClient, isPreview } from '@/lib/payload'
import { resolveVideo } from '@/lib/video'
import { serverUrl } from '@/lib/url'
import { Img } from '@/components/Img'
import { DisplayTitle, Eyebrow } from '@/components/ui'
import { VideoFrame } from '@/components/VideoFrame'
import { JsonLd } from '@/components/JsonLd'
import { StoriesSlider } from './StoriesSlider'
import './client-stories.css'

function Slide({ t }: { t: Testimonial }) {
  const video = t.type === 'video' ? resolveVideo(t.video) : null
  const posterMedia = t.photo || t.video?.poster
  const platform = t.source?.platform ?? 'the platform'
  return (
    <>
      <figure className="testi__media">
        {posterMedia ? (
          <Img media={posterMedia} alt={t.name} sizes="(max-width: 900px) 100vw, 30vw" />
        ) : video?.poster ? (
          <img src={video.poster} alt={t.name} loading="lazy" />
        ) : null}
        {video ? (
          <VideoFrame
            video={video}
            title={`Video feedback from ${t.name}`}
            buttonClassName="testi__play-btn"
            buttonLabel={`Play video feedback from ${t.name}`}
          >
            <img className="testi__play" src="/brand/icon-play-lg.svg" width={48} height={48} alt="" />
          </VideoFrame>
        ) : null}
      </figure>
      <div className="testi__body">
        <blockquote className="testi__quote">
          <p>
            “{t.quote}”{' '}
            {t.source?.logo ? (
              <span className="testi__source">
                <span className="testi__crop">
                  <Img media={t.source.logo} alt={`Review on ${platform}`} sizes="120px" />
                </span>
              </span>
            ) : null}
          </p>
        </blockquote>
        <div className="testi__person">
          <div>
            <p className="testi__name">{t.name}</p>
            <p className="testi__role">{[t.role, t.company].filter(Boolean).join(' — ')}</p>
          </div>
          {t.source?.badge ? <Img media={t.source.badge} className="testi__crest" alt="" sizes="80px" /> : null}
        </div>
      </div>
    </>
  )
}

/** Structured data so video feedback can appear in Google video results. */
const videoSchema = (t: Testimonial) => {
  const video = t.type === 'video' ? resolveVideo(t.video) : null
  if (!video) return null
  const thumb = video.thumbnail || mediaUrl(t.photo, 'large')
  const abs = (u?: string) => (u && u.startsWith('/') ? `${serverUrl()}${u}` : u)
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${t.name}${t.company ? `, ${t.company}` : ''} on working with ZeeTech`,
    description: t.quote,
    thumbnailUrl: abs(thumb),
    uploadDate: t.createdAt,
    ...(video.kind === 'file' ? { contentUrl: abs(video.schemaUrl) } : { embedUrl: video.schemaUrl }),
    ...(t.video?.transcript ? { transcript: t.video.transcript } : {}),
  }
}

export async function ClientStories({ block }: { block: ClientStoriesBlock }) {
  let stories = docs<Testimonial>(block.testimonials)
  if (!stories.length) {
    const payload = await getPayloadClient()
    const draft = await isPreview()
    stories = (
      await payload.find({ collection: 'testimonials', limit: 12, depth: 1, sort: '_order', draft, overrideAccess: draft })
    ).docs
  }
  if (!stories.length) return null
  const schemas = stories.map(videoSchema).filter(Boolean)

  return (
    <section className="sec testi" id="testimonials" aria-labelledby="testi-title">
      <div className="sec__inner">
        <StoriesSlider
          note={block.note}
          heading={
            <>
              {block.heading.eyebrow ? <Eyebrow>{block.heading.eyebrow}</Eyebrow> : null}
              <DisplayTitle heading={block.heading} id="testi-title" />
            </>
          }
        >
          {stories.map((t) => (
            <Slide key={t.id} t={t} />
          ))}
        </StoriesSlider>
      </div>
      {schemas.length ? <JsonLd data={schemas} /> : null}
    </section>
  )
}

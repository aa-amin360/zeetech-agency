import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { Eyebrow } from '@/components/ui'
import { FeedbackForm } from './FeedbackForm'
import '@sections/14-project-inquiry/project-inquiry.css'
import './feedback.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Share your feedback',
  robots: { index: false, follow: false },
}

export default async function FeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'feedback-requests',
    where: { token: { equals: token } },
    limit: 1,
    overrideAccess: true,
  })
  const request = docs[0]
  const expired = request?.expiresAt && new Date(request.expiresAt).getTime() < Date.now()
  const active = request && request.status === 'open' && !expired
  const maxVideoMb = Number(process.env.FEEDBACK_MAX_VIDEO_MB || 150)

  return (
    <section className="fb">
      <div className="fb__inner">
        <header className="fb__head">
          <Eyebrow>Client feedback</Eyebrow>
          {active ? (
            <>
              <h1 className="display">
                <span className="display__line">Hi {request.clientName.split(' ')[0]},</span>
                <em className="display__em">how did it go?</em>
              </h1>
              <p className="fb__lede">
                Thank you for working with ZeeTech{request.project ? ` on ${request.project}` : ''}. A few honest lines — or a
                short video from your phone — help other teams decide if we are a good fit. Nothing is published without
                your permission, and we may lightly edit for length.
              </p>
            </>
          ) : (
            <>
              <h1 className="display">
                <span className="display__line">
                  {request?.status === 'submitted' ? 'Thank you —' : 'This link has'}
                </span>
                <em className="display__em">{request?.status === 'submitted' ? 'we have your feedback.' : 'expired.'}</em>
              </h1>
              <p className="fb__lede">
                {request?.status === 'submitted'
                  ? 'Your feedback reached us. We really appreciate you taking the time.'
                  : 'Please ask the ZeeTech team for a fresh feedback link, or email hello@zeetech.studio.'}
              </p>
            </>
          )}
        </header>

        {active ? (
          <FeedbackForm
            token={token}
            defaults={{ name: request.clientName, company: request.company || '' }}
            maxVideoMb={maxVideoMb}
            directUpload={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
          />
        ) : null}
      </div>
    </section>
  )
}

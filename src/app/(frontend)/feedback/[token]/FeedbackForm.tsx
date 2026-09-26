'use client'

import { useRef, useState, type FormEvent } from 'react'
import { upload } from '@vercel/blob/client'
import { track } from '@/lib/attribution'

type Mode = 'text' | 'upload' | 'link'

export function FeedbackForm({
  token,
  defaults,
  maxVideoMb,
  directUpload,
}: {
  token: string
  defaults: { name: string; company: string }
  maxVideoMb: number
  /** Vercel: files go straight from the browser to Blob storage before the form is sent. */
  directUpload: boolean
}) {
  const form = useRef<HTMLFormElement>(null)
  const [mode, setMode] = useState<Mode>('text')
  const [rating, setRating] = useState(5)
  const [progress, setProgress] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [videoName, setVideoName] = useState('')

  const fail = (msg: string) => {
    setProgress(null)
    setStatus('error')
    setMessage(msg)
  }
  const done = () => {
    setProgress(null)
    setStatus('done')
    setMessage('')
    track('feedback_submitted', { type: mode === 'text' ? 'written' : 'video' })
  }

  // Vercel: upload files to Blob first (with progress), then send the form as JSON
  const submitDirect = async (data: FormData) => {
    const toBlob = async (file: File, from: number, to: number) => {
      const blob = await upload(`feedback/${file.name || 'upload'}`, file, {
        access: 'public',
        handleUploadUrl: '/forms/feedback/upload',
        clientPayload: token,
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: (p) => setProgress(Math.round(from + (p.percentage / 100) * (to - from))),
      })
      return blob.url
    }
    try {
      const video = data.get('video')
      const photo = data.get('photo')
      const hasVideo = video instanceof File && video.size > 0
      const hasPhoto = photo instanceof File && photo.size > 0
      const videoBlobUrl = hasVideo ? await toBlob(video, 0, hasPhoto ? 90 : 100) : undefined
      const photoBlobUrl = hasPhoto ? await toBlob(photo, hasVideo ? 90 : 0, 100) : undefined
      const res = await fetch('/forms/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: data.get('name'),
          role: data.get('role'),
          company: data.get('company'),
          quote: data.get('quote'),
          consent: data.get('consent') === 'on',
          rating,
          videoLink: data.get('videoLink') || '',
          videoBlobUrl,
          photoBlobUrl,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok) done()
      else fail(body.error || 'Something went wrong. Please try again.')
    } catch (err) {
      fail(err instanceof Error ? err.message : 'The upload failed. Please try again — or paste a video link instead.')
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.current || status === 'sending') return
    const data = new FormData(form.current)
    const video = data.get('video')
    if (video instanceof File && video.size > maxVideoMb * 1024 * 1024) {
      setStatus('error')
      setMessage(`That video is larger than ${maxVideoMb} MB. Please trim it, or upload it to YouTube / Google Drive and paste the link.`)
      return
    }
    if (mode !== 'upload') data.delete('video')
    if (mode !== 'link') data.delete('videoLink')
    data.set('rating', String(rating))
    data.set('token', token)

    setStatus('sending')
    setMessage('Sending…')
    if (directUpload) {
      void submitDirect(data)
      return
    }

    // XHR rather than fetch so we can show upload progress for videos
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/forms/feedback')
    xhr.upload.onprogress = (ev) => ev.lengthComputable && setProgress(Math.round((ev.loaded / ev.total) * 100))
    xhr.onload = () => {
      setProgress(null)
      let body: { error?: string } = {}
      try {
        body = JSON.parse(xhr.responseText)
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) done()
      else fail(body.error || 'Something went wrong. Please try again.')
    }
    xhr.onerror = () => fail('The connection dropped. Please try again — or paste a video link instead of uploading.')
    xhr.send(data)
  }

  if (status === 'done') {
    return (
      <div className="fb__card fb__done" role="status">
        <h2>Thank you!</h2>
        <p>Your feedback is with the ZeeTech team. We’ll let you know before anything goes on the website.</p>
      </div>
    )
  }

  return (
    <form className="fb__card form" ref={form} onSubmit={onSubmit}>
      <div className="form__row">
        <div className="field">
          <label htmlFor="fb-name">Your name</label>
          <input id="fb-name" name="name" required maxLength={120} defaultValue={defaults.name} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="fb-role">Your role</label>
          <input id="fb-role" name="role" maxLength={120} placeholder="e.g. Head of Product" autoComplete="organization-title" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="fb-company">Company</label>
        <input id="fb-company" name="company" maxLength={120} defaultValue={defaults.company} autoComplete="organization" />
      </div>

      <fieldset className="field fb__rating">
        <legend>How would you rate working with us?</legend>
        <div className="fb__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={n <= rating ? 'is-on' : ''}
              aria-label={`${n} out of 5`}
              aria-pressed={n === rating}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>How would you like to share it?</legend>
        <div className="budget__chips fb__modes">
          {(
            [
              ['text', 'Write a few lines'],
              ['upload', 'Record / upload a video'],
              ['link', 'Paste a video link'],
            ] as const
          ).map(([value, label]) => (
            <label key={value}>
              <input type="radio" name="mode" value={value} checked={mode === value} onChange={() => setMode(value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="fb-quote">{mode === 'text' ? 'Your feedback' : 'A line or two to go with the video (optional)'}</label>
        <textarea
          id="fb-quote"
          name="quote"
          rows={mode === 'text' ? 6 : 3}
          maxLength={3000}
          required={mode === 'text'}
          placeholder="What problem did we solve, and what was it like working together?"
        />
      </div>

      {mode === 'upload' ? (
        <div className="field">
          <label htmlFor="fb-video">Video (up to {maxVideoMb} MB — about 1–2 minutes from a phone)</label>
          <label className="fb__drop">
            <input
              id="fb-video"
              name="video"
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              capture="user"
              required
              onChange={(e) => setVideoName(e.target.files?.[0]?.name || '')}
            />
            <span>{videoName || 'Tap to record with your camera or choose a video'}</span>
          </label>
          <p className="fb__hint">Tip: film in landscape, somewhere quiet, and talk for 30–90 seconds.</p>
        </div>
      ) : null}

      {mode === 'link' ? (
        <div className="field">
          <label htmlFor="fb-link">Video link (YouTube, Vimeo, Google Drive, Loom…)</label>
          <input id="fb-link" name="videoLink" type="url" required placeholder="https://" maxLength={500} />
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="fb-photo">A photo of you (optional)</label>
        <input id="fb-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="fb__file" />
      </div>

      <label className="fb__consent">
        <input type="checkbox" name="consent" required />
        <span>I’m happy for ZeeTech to publish this feedback, with my name, role and company, on its website and marketing.</span>
      </label>

      <div className="form__actions">
        <button className="btn btn--signal" type="submit" disabled={status === 'sending'}>
          <span>{status === 'sending' ? 'Sending…' : 'Send feedback'}</span>
        </button>
        {progress !== null ? (
          <span className="fb__progress" aria-label={`Uploading, ${progress}%`}>
            <span style={{ width: `${progress}%` }} />
          </span>
        ) : null}
        <p className="form__status" role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  )
}

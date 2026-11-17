'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DefaultCellComponentProps } from 'payload'
import { useConfig, useDocumentInfo, useFormFields, useFormModified } from '@payloadcms/ui'

type Status = 'draft' | 'published'

/** Publishes or unpublishes one document with a single request (same as Payload's own buttons). */
function useToggle(collection: string, id: string | number | undefined, initial: Status) {
  const { config } = useConfig()
  const router = useRouter()
  const [status, setStatus] = useState<Status>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    if (id == null || busy) return
    const next: Status = status === 'published' ? 'draft' : 'published'
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`${config.serverURL}${config.routes.api}/${collection}/${id}?depth=0`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _status: next }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.errors?.[0]?.message ?? `Request failed (${res.status})`)
      }
      setStatus(next)
      router.refresh()
      return next
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }
  return { status, busy, error, toggle }
}

function Toggle({
  status,
  busy,
  error,
  disabled,
  hint,
  onClick,
}: {
  status: Status
  busy: boolean
  error: string
  disabled?: boolean
  hint?: string
  onClick: () => void
}) {
  const live = status === 'published'
  return (
    <span className="zt-publish">
      <span className={`zt-status zt-status--${live ? 'green' : 'grey'}`}>{live ? 'Live' : 'Draft'}</span>
      <button
        type="button"
        className={`zt-publish__btn${live ? '' : ' zt-publish__btn--go'}`}
        disabled={busy || disabled}
        title={hint ?? (live ? 'Hide it from the website (kept as a draft)' : 'Show it on the website')}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }}
      >
        {busy ? 'Saving…' : live ? 'Unpublish' : 'Publish'}
      </button>
      {error ? <span className="zt-publish__error">{error}</span> : null}
    </span>
  )
}

/** "Visibility" column in the Case studies list: Live / Draft with a one-click Publish / Unpublish button. */
export function PublishToggleCell({ rowData, collectionSlug }: DefaultCellComponentProps) {
  const row = rowData as { id?: string | number; _status?: Status }
  const { status, busy, error, toggle } = useToggle(collectionSlug, row.id, row._status === 'published' ? 'published' : 'draft')
  return <Toggle status={status} busy={busy} error={error} onClick={toggle} />
}

/** The same switch in the sidebar of a case study. Reloads afterwards so the form shows the new state. */
export function PublishToggleField() {
  const { id, collectionSlug } = useDocumentInfo()
  const current = useFormFields(([fields]) => fields._status?.value) as Status | undefined
  const modified = useFormModified()
  const { status, busy, error, toggle } = useToggle(collectionSlug ?? 'case-studies', id, current === 'published' ? 'published' : 'draft')
  if (id == null) return null
  return (
    <div className="field-type zt-publish-field">
      <div className="field-label">Visibility on the website</div>
      <Toggle
        status={status}
        busy={busy}
        error={error}
        disabled={modified}
        hint={modified ? 'Save your changes first' : undefined}
        onClick={async () => {
          if (await toggle()) window.location.reload()
        }}
      />
      {modified ? <p className="zt-publish__note">Save your changes first, then switch.</p> : null}
    </div>
  )
}

'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/** In the admin's live preview, re-render the page each time the editor saves. */
export function RefreshOnSave() {
  const router = useRouter()
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || window.location.origin}
    />
  )
}

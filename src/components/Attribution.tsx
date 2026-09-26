'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'

/** Remembers the campaign a visitor arrived from, so leads carry it. */
export function Attribution() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}

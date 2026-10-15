'use client'

import { useEffect, useRef } from 'react'
import { initInquiryGlass } from './inquiry-glass'

/** The card's live fluted-glass backdrop; the still artwork shows until it's running. */
export function InquiryGlass() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const card = canvas?.parentElement
    return canvas && card ? initInquiryGlass(canvas, card) : undefined
  }, [])
  return <canvas className="inquiry__glass" ref={ref} aria-hidden="true" />
}

'use client'

import { useEffect, useRef } from 'react'
import { initPetals } from './petal-fall'

/** Falling cherry-blossom petals between the hero picture and the title. */
export function Petals() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    return canvas && host ? initPetals(canvas, host) : undefined
  }, [])
  return <canvas className="page-hero__petals" ref={ref} aria-hidden="true" />
}

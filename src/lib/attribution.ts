/* First-touch marketing attribution, kept in the browser for 90 days and
 * sent along with any form. Browser-only helpers. */

const KEY = 'zt_attribution'
const MAX_AGE = 90 * 86_400_000

export type Attribution = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  clickId?: string
  referrer?: string
  landingPage?: string
  at?: number
}

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search)
    const fromUrl: Attribution = {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmTerm: params.get('utm_term') || undefined,
      utmContent: params.get('utm_content') || undefined,
      clickId: params.get('gclid') || params.get('fbclid') || params.get('li_fat_id') || undefined,
    }
    const hasCampaign = Object.values(fromUrl).some(Boolean)
    const stored = readAttribution()
    // a new campaign visit replaces the old one; otherwise keep the first touch
    if (hasCampaign || !stored) {
      const external = document.referrer && !document.referrer.startsWith(window.location.origin)
      const data: Attribution = {
        ...fromUrl,
        referrer: external ? document.referrer : stored?.referrer,
        landingPage: window.location.pathname + window.location.search,
        at: Date.now(),
      }
      localStorage.setItem(KEY, JSON.stringify(data))
    }
  } catch {
    /* storage unavailable (private mode) — forms still work */
  }
}

export function readAttribution(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Attribution
    if (data.at && Date.now() - data.at > MAX_AGE) return null
    return data
  } catch {
    return null
  }
}

/** Push an event for Google Tag Manager / GA4 (no-op when tracking is off). */
export function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}

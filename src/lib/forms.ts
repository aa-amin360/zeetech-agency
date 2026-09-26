import 'server-only'
import type { NextRequest } from 'next/server'

/** Very small per-IP rate limiter (single server, in memory). */
const hits = new Map<string, number[]>()
export function rateLimited(req: NextRequest, key: string, max: number, windowMs: number) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
  const id = `${key}:${ip}`
  const now = Date.now()
  const recent = (hits.get(id) || []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(id, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > max
}

export const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

/** Addresses that receive notifications (NOTIFY_EMAIL, comma separated). */
export const notifyList = () =>
  (process.env.NOTIFY_EMAIL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

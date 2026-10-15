/* Performance levels: how much animation this device can take.
 *
 *   high — every effect as designed
 *   mid  — effects stay, but WebGL draws at lower resolution and there are fewer petals
 *   low  — no WebGL, canvas effects or frosted glass; still pictures and solid bars instead
 *
 * PERF_HEAD_SCRIPT runs in <head> before the first paint and picks a starting level from what
 * the browser tells us (CPU cores, memory, Data Saver, slow network). PerfWatch then measures
 * the real frame rate and steps the level down if the page struggles; the result is remembered
 * for a week. The level is on <html data-perf="…"> for CSS, and changes are announced with a
 * "zt:perf" event for scripts.
 *
 * Testing: add ?perf=low, ?perf=mid or ?perf=high to any address to force a level on this
 * browser (kept until ?perf=auto).
 */

export type PerfLevel = 'low' | 'mid' | 'high'

export const PERF_KEY = 'zt-perf'
export const PERF_EVENT = 'zt:perf'
const ORDER: PerfLevel[] = ['low', 'mid', 'high']

// Kept as a plain string: it runs before React, so it must not import anything.
export const PERF_HEAD_SCRIPT = `(function(){var d=document.documentElement,k='${PERF_KEY}',t;try{
var q=location.search.match(/[?&]perf=(low|mid|high|auto)\\b/);
if(q){if(q[1]==='auto')localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify({t:q[1],at:Date.now(),forced:1}))}
var s=JSON.parse(localStorage.getItem(k)||'null');
if(s&&(s.forced||Date.now()-s.at<6048e5))t=s.t;
if(!t){var n=navigator,c=n.hardwareConcurrency||4,m=n.deviceMemory||8,cn=n.connection||{},touch=matchMedia('(pointer: coarse)').matches;
if(cn.saveData||/2g/.test(cn.effectiveType||'')||c<=2||m<=2)t='low';
else if(c<=4||m<=4||(touch&&c<=6))t='mid';
else t='high'}
}catch(e){t='mid'}d.dataset.perf=t||'mid'})()`

/** The current level (set by the head script). */
export function perfLevel(): PerfLevel {
  const v = typeof document !== 'undefined' ? document.documentElement.dataset.perf : undefined
  return v === 'low' || v === 'high' ? v : 'mid'
}

/** Calls `fn` with the new level whenever it changes; returns an unsubscribe function. */
export function onPerfChange(fn: (level: PerfLevel) => void): () => void {
  const handler = (e: Event) => fn((e as CustomEvent<PerfLevel>).detail)
  window.addEventListener(PERF_EVENT, handler)
  return () => window.removeEventListener(PERF_EVENT, handler)
}

/** Moves to a lower level (never up), remembers it and tells every effect. */
export function lowerPerf(): PerfLevel | null {
  const now = perfLevel()
  const i = ORDER.indexOf(now)
  if (i <= 0) return null
  try {
    const saved = JSON.parse(localStorage.getItem(PERF_KEY) || 'null')
    if (saved?.forced) return null // a level forced with ?perf= stays put
  } catch {}
  const next = ORDER[i - 1]
  document.documentElement.dataset.perf = next
  try {
    localStorage.setItem(PERF_KEY, JSON.stringify({ t: next, at: Date.now() }))
  } catch {}
  window.dispatchEvent(new CustomEvent(PERF_EVENT, { detail: next }))
  return next
}

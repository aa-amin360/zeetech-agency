import type { Service } from '@/payload-types'

/** "01", "02"… — a service's position in the admin order. */
export const serviceNumber = (all: Service[], service: Service) =>
  String(Math.max(0, all.findIndex((s) => s.id === service.id)) + 1).padStart(2, '0')

/** The service after this one, wrapping round to the first. */
export const nextService = (all: Service[], service: Service) => {
  if (all.length < 2) return null
  const i = all.findIndex((s) => s.id === service.id)
  return all[(i + 1) % all.length]
}

/** The service name with its accent words (if they appear in it) in orange italic. */
export function ServiceName({ name, accent }: { name: string; accent?: string | null }) {
  const at = accent ? name.toLowerCase().indexOf(accent.toLowerCase()) : -1
  if (!accent || at < 0) return <>{name}</>
  return (
    <>
      {name.slice(0, at)}
      <em>{name.slice(at, at + accent.length)}</em>
      {name.slice(at + accent.length)}
    </>
  )
}

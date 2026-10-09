'use client'

import type { DefaultCellComponentProps } from 'payload'

// colour per status value (Leads and Feedback requests)
const TONES: Record<string, string> = {
  new: 'orange',
  contacted: 'blue',
  proposal: 'purple',
  won: 'green',
  lost: 'grey',
  open: 'blue',
  submitted: 'orange',
  closed: 'grey',
}

/** Status column in admin lists, shown as a coloured label. */
export function StatusCell({ cellData, field }: DefaultCellComponentProps) {
  const value = typeof cellData === 'string' ? cellData : ''
  if (!value) return null
  const options = 'options' in field && Array.isArray(field.options) ? field.options : []
  const option = options.find((o) => (typeof o === 'string' ? o : o.value) === value)
  const label = typeof option === 'object' && option && typeof option.label === 'string' ? option.label : value
  return <span className={`zt-status zt-status--${TONES[value] ?? 'grey'}`}>{label}</span>
}

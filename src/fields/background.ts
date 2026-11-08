import type { SelectField } from 'payload'

/** Section background: white, or the warm off-white the design alternates with. */
export const backgroundField = (defaultValue: 'white' | 'warm' = 'white'): SelectField => ({
  name: 'background',
  type: 'select',
  defaultValue,
  options: [
    { label: 'White', value: 'white' },
    { label: 'Warm grey', value: 'warm' },
  ],
  admin: { description: 'Alternate the two so neighbouring sections stand apart.' },
})

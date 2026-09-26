/** Public site URL without a trailing slash. */
export const serverUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL
  if (explicit) return explicit.replace(/\/$/, '')
  // on Vercel, fall back to the deployment's own address
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

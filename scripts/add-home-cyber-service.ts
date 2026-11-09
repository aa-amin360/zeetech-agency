/* Home page → "How we deliver": adds Cybersecurity & Blockchain as the 7th discipline and gives
 * every discipline its key features (the chips under the description).
 *
 *   npm run home-services   — local database
 *   On Vercel it runs once by itself during the build (scripts/deploy-steps.mjs).
 *
 * Safe to run more than once, and it never overwrites edits made in the admin:
 *   1. the Cybersecurity & Blockchain row is added only if no row links to its service page yet
 *   2. key features are filled in only for rows that have none
 *   3. the section's subtitle gains "secure" only if it still has the starting wording
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ctx = () => ({ disableRevalidate: true })
const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

const CYBER_HREF = '/services/cybersecurity-blockchain'
const CYBER_ROW = {
  title: 'Cybersecurity & Blockchain',
  description:
    'Security assessments, application and cloud hardening, plus smart contracts and on-chain features built with secure defaults — where they add real value.',
  tag: '07 / SECURITY + WEB3',
  link: { label: 'EXPLORE', href: CYBER_HREF },
}

/** Key features per service page (matched by the row's link, so renamed rows still match). */
const HIGHLIGHTS: Record<string, string[]> = {
  '/services/system-architecture-planning': ['Product discovery', 'System blueprint', 'Data flows', 'Tech stack selection', 'MVP roadmap'],
  '/services/ui-ux-design': ['User research', 'User flows', 'Wireframes', 'Interactive prototypes', 'Design systems'],
  '/services/backend-development-ai': ['REST & GraphQL APIs', 'Databases', 'Auth & permissions', 'Integrations', 'AI features & LLMs'],
  '/services/frontend-development': ['React & Next.js', 'Responsive web apps', 'Component libraries', 'API integration', 'Accessibility'],
  '/services/sqa-security-testing': ['Functional & regression', 'End-to-end testing', 'Cross-device QA', 'Security checks', 'Issue reports'],
  '/services/deployment-ongoing-support': ['CI/CD pipelines', 'Cloud deployment', 'Monitoring', 'Maintenance', 'New features'],
  [CYBER_HREF]: [
    'Security assessment',
    'Threat modelling',
    'App & cloud hardening',
    'Smart contracts',
    'dApp development',
    'Wallet integration',
    'Tokens & NFTs',
    'EVM chains',
  ],
}

const OLD_SUBTITLE =
  'We plan the system, design the experience, build the frontend and backend, implement AI where it adds real value, test rigorously and deploy — with the same team staying involved.'
const NEW_SUBTITLE =
  'We plan the system, design the experience, build the frontend and backend, implement AI where it adds real value, test rigorously, secure and deploy — with the same team staying involved.'

const pages = await payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false, draft: true })
for (const page of pages.docs) {
  let changed = false
  const layout = (page.layout ?? []).map((block) => {
    if (block.blockType !== 'howWeDeliver') return block
    const services = [...(block.services ?? [])]

    // 1. the new discipline
    if (!services.some((s) => s.link?.href === CYBER_HREF)) {
      services.push({ ...CYBER_ROW })
      changed = true
      log(`Added Cybersecurity & Blockchain to "${page.title}".`)
    }

    // 2. key features for rows without any
    const withHighlights = services.map((s) => {
      const list = s.link?.href ? HIGHLIGHTS[s.link.href] : undefined
      if (!list || s.highlights?.length) return s
      changed = true
      return { ...s, highlights: list }
    })

    // 3. subtitle
    const heading = block.heading?.subtitle === OLD_SUBTITLE ? { ...block.heading, subtitle: NEW_SUBTITLE } : block.heading
    if (heading !== block.heading) changed = true

    return { ...block, heading, services: withHighlights }
  })
  if (changed) {
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout },
      depth: 0,
      draft: page._status === 'draft',
      context: ctx(),
    })
    log(`Updated "How we deliver" on "${page.title}".`)
  }
}
log('Done.')
process.exit(0)

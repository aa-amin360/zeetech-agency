/* Marlin's review, step 2: copy changes and the "How a project runs" page.
 * Each change lists the old wording; it is only replaced while the old wording is still there, so
 * anything edited in the admin since is left alone. */

/** Positioning (M-R7): who ZeeTech builds for. Home hero text + About intro. */
export const OLD_LEDE =
  'Strategy, product design and engineering under one roof. Senior designers and engineers sit on your product from week one — no handover between agencies, no six-week kickoff, no guessing what ships next'
export const NEW_LEDE =
  'We build operations software for companies that have outgrown spreadsheets: dashboards, client portals and workflow platforms. Strategy, design and engineering under one roof, with no handover between agencies and no guessing what ships next.'

/** Every service page: the process heading promised a "handoff" (M-R1). */
export const PROCESS_ACCENT = { from: 'From first step to handoff.', to: 'One team, start to finish.' }

type Change = { path: string; from: string; to: string }

/** Per service (slug): field path → old → new. Paths use dots and [n] for list items. */
export const SERVICE_CHANGES: Record<string, Change[]> = {
  'system-architecture-planning': [
    { path: 'process[3].title', from: 'Prepare the build', to: 'Carry it into the build' },
    {
      path: 'process[3].text',
      from: 'Deliver the architecture, priorities and implementation roadmap.',
      to: 'The same team takes the architecture and roadmap straight into design and development.',
    },
    {
      path: 'questions[2].answer',
      from: 'An agreed requirements brief, architecture and data-flow documentation, technical recommendations and a prioritised delivery roadmap.',
      to: 'An agreed requirements brief, architecture and data-flow documentation, technical recommendations and a prioritised delivery roadmap. The people who write the plan then build from it, so nothing gets lost along the way.',
    },
  ],
  'ui-ux-design': [
    { path: 'process[3].title', from: 'Validate & hand over', to: 'Validate & build together' },
    {
      path: 'process[3].text',
      from: 'Review usability, document the system and support implementation.',
      to: 'Test usability, document the system and stay on the project while our developers build it.',
    },
    {
      path: 'questions[1].answer',
      from: 'Yes. The handoff includes organised screens, components and responsive guidance so your team can continue working with the design.',
      to: 'Yes. You get organised screens, components and responsive guidance, and the file is yours. Our developers build from the same file, so design and code stay in step.',
    },
    {
      path: 'questions[2].answer',
      from: 'Yes. We review feasibility early and explain interactions, edge cases and component behaviour during handoff.',
      to: 'Yes. If your own developers build it, we review feasibility early and stay available to explain interactions, edge cases and component behaviour. If our team builds it, the designers stay on the project through development.',
    },
  ],
  'backend-development-ai': [
    { path: 'process[3].title', from: 'Test & document', to: 'Test & keep it documented' },
    {
      path: 'process[3].text',
      from: 'Verify key paths and provide API documentation for your team.',
      to: 'Verify key paths with QA and keep the API documented as the product grows.',
    },
  ],
  'frontend-development': [
    {
      path: 'process[3].text',
      from: 'Review visual accuracy, accessibility and cross-device behaviour.',
      to: 'Review visual accuracy, accessibility and cross-device behaviour, then move straight into QA with the same team.',
    },
  ],
  'sqa-security-testing': [
    {
      path: 'process[3].text',
      from: 'Verify resolved issues and communicate remaining release risks.',
      to: 'Our developers fix, we verify, and you see any remaining release risks before launch.',
    },
    { path: 'questions[1].question', from: 'What does the testing handoff include?', to: 'What do we receive from testing?' },
  ],
  'deployment-ongoing-support': [
    {
      path: 'questions[0].answer',
      from: 'Yes. We begin with a technical review and an operational handover to understand the system and define a realistic support scope.',
      to: 'Yes. We begin with a technical review of the system, then agree a realistic support scope. For products we built, the same team simply carries on.',
    },
  ],
  // M-R6: security first, blockchain where it fits
  'cybersecurity-blockchain': [
    { path: 'kicker', from: 'Security & Web3', to: 'Security first, Web3 where it fits' },
    {
      path: 'summary',
      from: 'Protect what you build and the data it holds. We harden products against real threats and build secure blockchain features where they add genuine value.',
      to: 'Protect what you build and the data it holds. Security is part of every product we build, and when shared records or digital ownership solve a real problem, we add blockchain features with the same care.',
    },
    {
      path: 'meta.description',
      from: 'Protect what you build and the data it holds. We harden products against real threats and build secure blockchain features where they add genuine value.',
      to: 'Security assessments, application and cloud hardening, and blockchain features only where they solve a real problem. Security comes first in every product we build.',
    },
  ],
}

/** Home "How we deliver", row 07 (M-R6). */
export const HOME_CYBER = {
  from: 'Security assessments, application and cloud hardening, plus smart contracts and on-chain features built with secure defaults — where they add real value.',
  to: 'Security assessments and application and cloud hardening for every product, plus smart contracts and on-chain features when blockchain genuinely fits.',
}

/** Home stats: the visible "Metric pending verification" note under each number (owner: remove, 2026-11-26). */
export const STATS_NOTE = 'Metric pending verification'

/** Project inquiry budget options: "$5k - $20k" overlapped "$10k - $20k". */
export const BUDGET_FIX = { from: '$5k - $20k', to: '$5k - $10k' }

const heading = (eyebrow: string, title: string, accent: string, subtitle = '', accentOnNewLine = false) => ({
  eyebrow,
  title,
  accent,
  accentOnNewLine,
  subtitle,
})

/** M-R11: one page that follows a project through the six disciplines. Each stage is illustrated
 *  with a real project where ZeeTech did that part of the work (no single project covered all six). */
export const HOW_PAGE = {
  title: 'How we work',
  slug: 'how-we-work',
  meta: {
    title: 'How a project runs — ZeeTech',
    description:
      'One team carries your product through planning, design, frontend, backend, QA and launch. See each stage with examples from real ZeeTech projects.',
  },
}

export const HOW_INTRO_IMAGE = 'Supreme Prospects dashboard in light and dark mode'

export const HOW_SECTIONS = [
  {
    blockType: 'pageIntro',
    heading: heading(
      'How we work',
      'How a project runs:',
      'one team, start to finish.',
      'Software projects slow down at the handovers. One agency plans, another designs, a third builds, and context gets lost at every step.\nAt ZeeTech, one team carries your product through six disciplines. Below is each stage, with an example of that work from a real project.',
      true,
    ),
  },
  {
    blockType: 'cardGrid',
    heading: heading(
      'Six disciplines, one engagement',
      'Six stages.',
      'One team the whole way.',
      'Each stage builds on the one before, and the same people carry the context forward.',
      true,
    ),
    style: 'numbered',
    background: 'white',
    cards: [
      {
        title: 'Architecture & planning',
        text: 'We map users, data and rules before writing code. On Supreme Prospects, that meant planning six role portals, the recruiting rules and per-sport grading forms as configuration, so new sports can be added without new code.',
      },
      {
        title: 'UI/UX design',
        text: 'We design every screen around the job of the person using it. For Calliana we designed the agent, client and admin sides, with everything an agent needs during a live call on one screen.',
      },
      {
        title: 'Frontend development',
        text: 'We turn the design into fast, responsive interfaces. For Nexus Courier we built the admin and corporate client dashboards in Next.js and TypeScript: orders, tracking, dispatch and proof of delivery.',
      },
      {
        title: 'Backend development',
        text: 'We build the APIs, permissions and data behind the screens. Calliana’s Node.js backend links live calls to client context, with role-based access, audit logs and adapters that let a provider be swapped.',
      },
      {
        title: 'QA & security',
        text: 'We test the journeys that matter and build safeguards into the product. Supreme Prospects blocks restricted-period contact by itself, keeps academic records in an encrypted vault and logs every recruiting step.',
      },
      {
        title: 'Launch & ongoing support',
        text: 'A launch is the start of the next phase. On Nexus Courier we kept refining the dashboards and shipping feature updates as the business requirements evolved.',
      },
    ],
  },
  {
    blockType: 'cardGrid',
    heading: heading(
      'Between the stages',
      'What doesn’t change',
      'from start to finish.',
      'Whether you start with one stage or all six, the way we work stays the same.',
    ),
    style: 'outlined',
    background: 'warm',
    cards: [
      {
        title: 'The same people',
        text: 'The team that plans your product also designs, builds and supports it. Nobody has to re-learn your business halfway through.',
      },
      {
        title: 'One shared plan',
        text: 'Decisions, priorities and open questions live in one backlog that you can see at every stage.',
      },
      {
        title: 'A direct line to Amit',
        text: 'Amit Ghosh, CEO & Founder, stays part of the conversation from the first call to launch and beyond.',
      },
    ],
  },
  {
    blockType: 'contactBand',
    heading: {
      eyebrow: 'Start with one stage or all six',
      title: 'Bring us an idea or a product,',
      accent: 'and we’ll map the next step.',
      accentOnNewLine: true,
    },
    cta: { label: 'Start a project', href: '/#contact' },
  },
] as const

/** Menu link to the new page, placed after "Services". */
export const HOW_LINK = { label: 'How We Work', href: '/how-we-work' }

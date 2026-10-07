/* Loads the current ZeeTech site content into the CMS.
 *
 *   npm run seed            — only runs on an empty site (no "home" page yet)
 *   SEED_FORCE=1 npm run seed — wipes seeded content first and starts again
 *
 * Optional: SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD create the first admin user.
 * Images come from legacy/assets (the original static build).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import { CLIENT_LOGOS } from './client-logos.data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.resolve(dirname, '../legacy/assets')
// a fresh object per call: Payload and its plugins keep per-request state in `context`
// (the Blob storage plugin stores the file being uploaded there), so it must not be shared
const ctx = () => ({ disableRevalidate: true })

const payload: Payload = await getPayload({ config })

const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
if (existing.docs.length && !process.env.SEED_FORCE) {
  payload.logger.info('The site already has a home page — nothing to do. Run with SEED_FORCE=1 to start over.')
  process.exit(0)
}

if (process.env.SEED_FORCE) {
  payload.logger.info('SEED_FORCE: removing existing content…')
  for (const collection of ['pages', 'case-studies', 'testimonials', 'faqs', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, context: ctx() })
  }
}

if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
  const users = await payload.find({ collection: 'users', where: { email: { equals: process.env.SEED_ADMIN_EMAIL } } })
  if (!users.docs.length) {
    await payload.create({
      collection: 'users',
      data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, name: 'Admin' },
    })
    payload.logger.info(`Created admin user ${process.env.SEED_ADMIN_EMAIL}`)
  }
}

/* ---------- media ---------- */
const media: Record<string, number> = {}
async function upload(file: string, alt = '', focal?: { x: number; y: number }) {
  if (media[file]) return media[file]
  const doc = await payload.create({
    collection: 'media',
    data: { alt, ...(focal ? { focalX: focal.x, focalY: focal.y } : {}) },
    filePath: path.join(ASSETS, file),
    context: ctx(),
  })
  media[file] = doc.id as number
  return media[file]
}

payload.logger.info('Uploading images…')
const img = {
  andrew: await upload('quote-andrew.png', 'Andrew Baker'),
  fiverrFi: await upload('badge-fiverr-fi.png', 'Fiverr'),
  fiverrAward: await upload('badge-fiverr-award.png', 'Fiverr top product design agency 2025 badge'),
  upworkAward: await upload('badge-upwork-award.png', 'Upwork top design agency badge'),
  fiverrLogo: await upload('logo-fiverr.png', 'Fiverr'),
  upworkLogo: await upload('logo-upwork.png', 'Upwork'),
  avneet: await upload('avatar-avneet.jpg', 'Avneet Chattha'),
  laptop: await upload('work-laptop.png', 'FleetPulse dispatch dashboard on a laptop'),
  marcus: await upload('testi-marcus.jpg', 'Marcus Vance at his desk'),
  marcusReview: await upload('testi-next.jpg', 'Client recording a video review'),
  crest: await upload('badge-crest.png', 'Award crest'),
  deliverPreview: await upload('deliver-preview.png', 'Mobile app screens designed by ZeeTech'),
  p02: await upload('principle-02.png', 'A Figma design next to the matching code'),
  p03: await upload('principle-03.png', 'An interface connected to an API, database and integrations'),
  p04: await upload('principle-04.png', 'QA checklist: functional, responsive, edge cases, security and performance'),
  p05: await upload('principle-05.png', 'CI/CD to cloud deploy, monitoring and live', { x: 50, y: 57.8 }),
  markZ: await upload('mark-z-green.svg', 'ZeeTech'),
  team: await upload('icon-team.svg', ''),
  buildings: await upload('icon-buildings.svg', ''),
  user: await upload('icon-user.svg', ''),
  box: await upload('icon-box.svg', ''),
  reel1: await upload('reel-1.png', 'SaaS landing page design'),
  reel2: await upload('reel-2.png', 'iPhone device mockups', { x: 50, y: 0 }),
  reel3: await upload('reel-3.png', 'Link Bank mobile banking app'),
  reel4: await upload('reel-4.png', 'Online marketing mobile app'),
  faqCard: await upload('faq-card.png', ''),
  av1: await upload('faq-avatar-1.jpg', ''),
  av2: await upload('faq-avatar-2.jpg', ''),
  av3: await upload('faq-avatar-3.jpg', ''),
  iqbal: await upload('cta-iqbal.png', 'MD Iqbal Hasan'),
}
const tools: number[] = []
for (let i = 0; i < 10; i++) tools.push(await upload(`tool-${i}.png`, ''))
const clientLogos: { name: string; logo: number }[] = []
for (const { name, file } of CLIENT_LOGOS) clientLogos.push({ name, logo: await upload(`clients/${file}`, name) })

/* ---------- testimonials ---------- */
payload.logger.info('Creating testimonials, case studies and FAQs…')
const andrew = await payload.create({
  collection: 'testimonials',
  context: ctx(),
  data: {
    _status: 'published',
    name: 'Andrew Baker',
    role: 'Retirement Specialist, ARHQ',
    company: 'Ohio, United States',
    photo: img.andrew,
    quote: 'It’s great that I can work with just ZEE // TECH to get every aspect of what I need completed.',
    type: 'text',
    source: { platform: 'fiverr', rating: 4.9, logo: img.fiverrLogo },
    featured: true,
  },
})
const marcusQuote =
  'ZeeTech re-architected our entire telematics ingestion pipeline. We went from dropping WebSocket packets during morning dispatch rushes to handling 50,000 live vehicle GPS streams with 18ms latency.'
const marcus = await payload.create({
  collection: 'testimonials',
  context: ctx(),
  data: {
    _status: 'published',
    name: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'FleetPulse Logistics',
    photo: img.marcus,
    quote: marcusQuote,
    type: 'text',
    source: { platform: 'upwork', logo: img.upworkLogo, badge: img.crest },
  },
})
const marcusReview = await payload.create({
  collection: 'testimonials',
  context: ctx(),
  data: {
    _status: 'published',
    name: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'FleetPulse Logistics',
    photo: img.marcusReview,
    quote: marcusQuote,
    type: 'text',
    source: { platform: 'upwork', logo: img.upworkLogo, badge: img.crest },
  },
})

/* ---------- case studies ---------- */
const colours = ['#ff8648', '#b9f227', '#27d4f2', '#d66dff', '#ff8db7']
const studies: number[] = []
for (let i = 0; i < colours.length; i++) {
  const doc = await payload.create({
    collection: 'case-studies',
    context: ctx(),
    data: {
      _status: 'published',
      title: 'Real-Time Dispatch & Telematics Platform',
      slug: `fleetpulse-dispatch-platform${i ? `-${i + 1}` : ''}`,
      projectLabel: `Project 0${i + 1}`,
      client: 'FleetPulse Global',
      color: colours[i],
      summary: 'A fleet coordination platform handling live telemetry, routing and driver allocation at scale.',
      scope: 'Product strategy UX research Design system Web app engineering',
      duration: '3 Weeks',
      cover: img.laptop,
      person: { name: 'avneet Chattha', role: 'Bearister AI CEO', avatar: img.avneet },
      testimonial: marcus.id,
    },
  })
  studies.push(doc.id as number)
}

/* ---------- FAQs ---------- */
const faqData = [
  [
    'What can ZeeTech help us build?',
    'We work across SaaS platforms, web and mobile products, CRM and internal tools, AI-enabled workflows, dashboards, and the systems behind them. We can own the full delivery path or join at a focused stage.',
  ],
  [
    'Can you join an existing product or codebase?',
    'Yes. We start with a short review of what already exists — codebase, design files, infrastructure and backlog — then agree where we add the most value, from a focused feature to taking over delivery.',
  ],
  [
    'Do you handle both UI/UX and development?',
    'Yes. The same team plans the system, designs the experience in Figma and builds the frontend and backend, so the design system carries straight into production code without a handoff between agencies.',
  ],
  [
    'Where does AI fit into your process?',
    'Where it adds real value — search, automation, assistants, classification or data workflows. We scope AI features against the actual requirement, then build, test and monitor them like any other part of the system.',
  ],
  [
    'How do you handle QA, security and responsive testing?',
    'Testing runs alongside development: unit, integration and end-to-end tests, responsive and cross-browser checks, edge states, plus security and performance review before each release.',
  ],
  [
    'How do you define timeline and budget?',
    'After a short discovery call we map scope, priorities and technical risk, then share a phased plan with a timeline and cost for each stage — so you can start focused and expand with confidence.',
  ],
]
const faqs: number[] = []
for (const [question, answer] of faqData) {
  faqs.push((await payload.create({ collection: 'faqs', data: { question, answer }, context: ctx() })).id as number)
}

/* ---------- home page ---------- */
const marks = (list: string[]) => list.map((mark) => ({ mark }))
payload.logger.info('Building the home page…')
const layout = [
  {
    blockType: 'hero',
    trust: { prefix: 'Trusted by', badge: '40+', suffix: 'product teams worldwide', avatars: [img.av1, img.av2, img.av3] },
    headline: { line1: 'We design & build', line2: 'digital products', line3: 'people', highlight: 'want to use.' },
    lede: 'Strategy, product design and engineering under one roof. Senior designers and engineers sit on your product from week one — no handover between agencies, no six-week kickoff, no guessing what ships next.',
    primaryCta: { label: 'Book Intro Call', href: '#contact' },
    secondaryCta: { label: 'Explore Our Works', href: '#work' },
    collage: [img.reel1, img.reel2, img.laptop, img.reel3, img.p02, img.reel4, img.deliverPreview, img.p03, img.p04],
    showBackdropControls: true,
  },
  { blockType: 'statement', line1: 'Not more software.', line2: 'Better tools', accent: 'for real people.' },
  {
    blockType: 'clientLogos',
    title: 'Trusted by 40+ of the world’s top brands',
    logos: clientLogos,
  },
  {
    blockType: 'proofStats',
    testimonial: andrew.id,
    rating: { value: 4.9, icon: img.fiverrFi },
    awards: [
      { label: 'Top product design agency 2025', image: img.fiverrAward, round: false },
      { label: 'Top design agency', image: img.upworkAward, round: true },
    ],
    stats: [
      { value: 150, suffix: '+', label: 'Countries served', note: 'Metric pending verification' },
      { value: 14, suffix: '+', label: 'Projects shipped', note: 'Metric pending verification' },
      { value: 98, suffix: '%', label: 'Client retention', note: 'Metric pending verification' },
      { value: 5, suffix: '+', label: 'Years building', note: 'Metric pending verification' },
    ],
  },
  {
    blockType: 'selectedWork',
    eyebrow: 'Selected work',
    note: 'Sample cases — client names pending approval',
    title: 'Work that solves',
    accent: 'real problems.',
    button: { label: 'All Works', href: '/work' },
    caseStudies: studies,
  },
  {
    blockType: 'whyZeetech',
    heading: {
      eyebrow: 'What sets us apart',
      title: 'Why ZeeTech? Because your',
      accent: 'growth is a shared outcome.',
      subtitle:
        'A senior product team stays close from the first question to launch and beyond — fewer handoffs, clearer decisions, and better momentum.',
    },
    reel: { source: 'none' },
  },
  {
    blockType: 'clientStories',
    heading: { eyebrow: 'Client Stories', title: 'VERIFIED CLIENT', accent: 'ENDORSEMENTS.' },
    note: 'We value each and every client’s feedback which helps us to improve.',
    testimonials: [marcus.id, marcusReview.id],
  },
  {
    blockType: 'howWeDeliver',
    heading: {
      eyebrow: 'How we deliver',
      title: 'From architecture to launch.',
      highlight: 'One team,',
      accent: 'engineered end to end.',
      subtitle:
        'We plan the system, design the experience, build the frontend and backend, implement AI where it adds real value, test rigorously and deploy — with the same team staying involved.',
    },
    preview: img.deliverPreview,
    services: [
      ['System Architecture & Planning', 'We define the system structure, technical requirements, data flows and delivery roadmap before development begins.', '01 / ARCHITECTURE'],
      ['UI/UX Design', 'User flows, wireframes, polished Figma interfaces, prototypes and reusable design systems for web and mobile products.', '02 / DESIGN'],
      ['Backend Development & AI', "Business logic, APIs, databases, integrations and AI implementation engineered around the product's real requirements.", '03 / BACKEND + AI'],
      ['Frontend Development', 'Responsive, production-ready interfaces built from the approved design system with clean and maintainable implementation.', '04 / FRONTEND'],
      ['SQA & Security Testing', 'Unit, integration and end-to-end testing, usability checks and security-focused QA before release.', '05 / QA'],
      ['Deployment & Ongoing Support', 'Production deployment, monitoring, upgrades and ongoing customization so the product keeps improving after launch.', '06 / DEPLOYMENT'],
    ].map(([title, description, tag]) => ({ title, description, tag, link: { label: 'EXPLORE', href: '#contact' } })),
  },
  {
    blockType: 'howWeBuild',
    heading: {
      eyebrow: 'How we build',
      title: 'One connected delivery system.',
      accent: 'From plan to production.',
      subtitle:
        'Architecture, design, engineering, QA and deployment stay connected in one delivery loop — fewer handoffs, fewer surprises and a clearer path to launch.',
    },
    toolIcons: tools,
    stages: [
      ['Architecture & Planning', [0, 5, 1], ['System blueprint', 'Scope map', 'Tech stack']],
      ['UI/UX Design', [6, 2, 3], ['User flows', 'Prototype', 'Design system']],
      ['Backend & AI', [7, 4, 8], ['API layer', 'Database', 'AI workflows']],
      ['Frontend Development', [4, 8, 9], ['API layer', 'Database', 'AI workflows']],
      ['SQA & Security', [4, 8, 9], ['Test plan', 'QA report', 'Security checks']],
      ['Deployment & Support', [4, 8, 9], ['CI/CD', 'Cloud deploy', 'Monitoring']],
    ].map(([title, t, delivers]) => ({ title, tools: (t as number[]).map((n) => tools[n]), delivers })),
    footerText: 'One connected workflow. Clear ownership at every stage.',
    cta: { label: 'EXPLORE OUR PROCESS', href: '#contact' },
  },
  {
    blockType: 'deliveryPrinciples',
    heading: {
      eyebrow: 'Delivery principles',
      title: 'Speed comes from structure.',
      accent: 'Not shortcuts.',
      accentOnNewLine: false,
      subtitle:
        'We reduce delay by making important decisions early, keeping design and engineering connected, testing throughout the build, and carrying ownership through deployment.',
    },
    cards: [
      { kicker: '01 / Architecture first', title: 'Architecture before', accent: 'implementation', description: 'We define scope, system boundaries, data flow, integrations and the tech stack before development starts — reducing rework later.', link: { label: 'PLAN SMARTER', href: '#contact' }, theme: 'dark', visual: 'orbit' },
      { kicker: '02 / Design → code', title: 'The design system', accent: 'survives the handoff', description: 'Reusable Figma components, interaction states and responsive rules stay connected to implementation instead of being reinterpreted from screenshots.', link: { label: 'From Design to Reality', href: '#contact' }, theme: 'white', visual: 'fill', image: img.p02 },
      { kicker: '03 / full-stack alignment', title: 'Frontend and backend', accent: 'stay connected', description: 'we build UI implementation, aPIs, databases, and integrations as one system, keeping design and engineering in sync.', link: { label: 'PLAN SMARTER', href: '#contact' }, theme: 'yellow', visual: 'image', image: img.p03 },
      { kicker: '04 / Quality throughout', title: 'QA is part of the build,', accent: 'not the last week', description: 'Functional QA, responsive checks, edge states, security and performance review happen alongside development — not after everything is “done.”', theme: 'blue', visual: 'image', image: img.p04 },
      { kicker: '05 / Ownership after launch', title: 'Deployment is a stage,', accent: 'not a goodbye', description: 'We handle cloud deployment, CI/CD, monitoring and post-launch support so the same context stays with the product after release.', theme: 'pink', visual: 'image', image: img.p05 },
      { kicker: '06 / Support for what’s next', title: 'Support continues', accent: 'after launch', description: 'We provide ongoing support, iteration, fixes, and long-term product ownership to help you grow with confidence', theme: 'purple', visual: 'image', image: img.p03 },
    ],
  },
  {
    blockType: 'comparison',
    heading: {
      eyebrow: 'Why Zee Tech',
      title: 'A connected team. Better outcomes.',
      accent: 'Built to move products forward.',
      subtitle:
        'A typical digital product can involve separate strategy, design, frontend, backend, QA and deployment teams. ZeeTech keeps those disciplines in one delivery loop.',
    },
    firstColumnLabel: 'Delivery Model',
    columns: ['Strategy', 'Design', 'Engineering', 'QA', 'Launch', 'Support'],
    rows: [
      { name: 'ZeeTech', highlight: true, icon: img.markZ, ring: 'green', description: 'One integrated team across architecture, UI/UX, frontend, backend + AI, SQA, deployment and ongoing support.', cells: marks(['yes', 'yes', 'yes', 'yes', 'yes', 'yes']) },
      { name: 'In-house hiring', icon: img.team, ring: 'orange', description: 'Deep internal context, but usually needs several specialist hires, onboarding and day-to-day management.', cells: marks(['check', 'check', 'check', 'dot', 'dot', 'check']) },
      { name: 'Large agencies', icon: img.buildings, ring: 'lime', description: 'Broad capability, but delivery can involve more layers, handoffs and account-management overhead.', cells: marks(['check', 'check', 'check', 'check', 'check', 'dot']) },
      { name: 'Freelancers', icon: img.user, ring: 'orange', description: 'Fast and flexible for focused tasks; full-cycle consistency, QA and long-term ownership can vary.', cells: marks(['dot', 'check', 'dot', 'no', 'no', 'dot']) },
      { name: 'DIY / no-code tools', icon: img.box, ring: 'yellow', description: 'Useful for simple sites and prototypes; limited for complex systems, custom workflows and long-term ownership.', cells: marks(['no', 'dot', 'no', 'no', 'check', 'no']) },
    ],
  },
  {
    blockType: 'showreel',
    heading: {
      eyebrow: 'More of what we build',
      title: 'Different problems. One product team.',
      accent: 'From first idea to what ships.',
      subtitle: 'A quick reel across the products, interfaces and systems we help clients plan, design, build, test and launch.',
    },
    topTicker: ['Product Strategy', 'UI/UX Design', 'Design Systems', 'SaaS Platforms', 'AI Products', 'Mobile Apps', 'CRM & Internal Tools'],
    images: [img.reel1, img.reel2, img.reel1, img.reel3, img.reel2, img.reel4, img.reel3, img.reel4],
    bottomTicker: ['System Architecture', 'Backend Development', 'Frontend Development', 'SQA & Security', 'Cloud & DevOps', 'Deployment', 'Ongoing Support'],
  },
  {
    blockType: 'faq',
    heading: {
      eyebrow: 'FAQ / Before we start',
      title: 'Questions before we build?',
      accent: 'Good. Ask them early.',
      accentOnNewLine: false,
      subtitle: 'Clear answers on scope, product design, engineering, AI, QA and what happens after launch.',
    },
    helpCard: {
      background: img.faqCard,
      avatars: [img.av1, img.av2, img.av3],
      title: 'Still figuring out the brief?',
      accent: 'That’s a valid starting point.',
      text: 'Tell us what exists, what feels stuck, and what you want the product to do next. We can help define the right first step.',
      cta: { label: 'START A CONVERSATION', href: '#contact' },
    },
    faqs,
  },
  {
    blockType: 'projectInquiry',
    heading: {
      eyebrow: 'Start a project / Project inquiry',
      title: 'Tell us what you’re building.',
      accent: 'A few useful details are enough.',
      subtitle: 'We use the context to understand the problem before suggesting scope, timeline or the right next step.',
    },
    prep: {
      eyebrow: 'Before you send it',
      title: 'Three things make the first conversation useful.',
      steps: [
        { title: 'What exists today?', text: 'A new idea, a current product, or a system that already has users.' },
        { title: 'What is getting in the way?', text: 'User problems, technical debt, missing workflows, or delivery bottlenecks.' },
        { title: 'What should change?', text: 'The result you want for users, the team, or the business.' },
      ],
      person: { photo: img.iqbal, name: 'MD Iqbal Hasan', role: 'COO & Co-founder' },
    },
    budgets: ['Less than $5k', '$5k - $20k', '$10k - $20k', '$20k - $50k', 'More than $50k'],
    submitLabel: 'Send Inquiry',
    successMessage: 'Thank you — your inquiry is with us. We’ll reply within one business day.',
  },
]

await payload.create({
  collection: 'pages',
  context: ctx(),
  data: {
    _status: 'published',
    title: 'Home',
    slug: 'home',
    layout: layout as never,
    meta: {
      title: 'ZeeTech — We design & build digital products people want to use',
      description:
        'Strategy, product design and engineering under one roof. ZeeTech builds SaaS platforms, web and mobile products, CRM tools and AI-enabled workflows — from first idea to launch and beyond.',
      image: img.laptop,
    },
  },
})

/* ---------- globals ---------- */
payload.logger.info('Filling in the header, footer and site settings…')
await payload.updateGlobal({
  slug: 'header',
  context: ctx(),
  data: {
    links: [
      { link: { label: 'Work', href: '/#work' } },
      { link: { label: 'Expertise', href: '/#expertise' } },
      { link: { label: 'Studio', href: '/#studio' } },
      { link: { label: 'Insights', href: '/#faq' } },
    ],
    cta: { label: 'Start a project', href: '/#contact' },
  },
})

await payload.updateGlobal({
  slug: 'footer',
  context: ctx(),
  data: {
    brand: {
      text: 'A technology studio working across strategy, product design and engineering — for teams building what comes next.',
    },
    email: 'hello@zeetech.studio',
    cta: { label: 'START A PROJECT', href: '/#contact' },
    columns: [
      {
        title: 'NAVIGATE',
        links: [
          ['Our Work', '/#work'],
          ['Services', '/#expertise'],
          ['About Us', '/#studio'],
          ['Careers', ''],
          ['Contact', '/#contact'],
        ].map(([label, href]) => ({ link: { label, href } })),
      },
      {
        title: 'SERVICES',
        links: [
          'System Architecture & Planning',
          'UI/UX Design',
          'Backend Development & AI',
          'Frontend Development',
          'SQA & Security',
          'Deployment & Ongoing Support',
        ].map((label) => ({ link: { label, href: '/#expertise' } })),
      },
      {
        title: 'CONTACT',
        links: [
          { link: { label: 'hello@zeetech.studio', href: 'mailto:hello@zeetech.studio' } },
          { link: { label: 'Dhaka, Bangladesh' } },
          { link: { label: 'Working worldwide' } },
        ],
      },
    ],
    // add the real profile addresses in the admin (Site → Footer → Social links)
    socials: (['facebook', 'twitter', 'instagram', 'linkedin'] as const).map((platform) => ({ platform, url: '' })),
    bottom: { copyright: '© All the rights reserved to @ZeeTech' },
    legal: [
      { link: { label: 'Terms of Use', href: '' } },
      { link: { label: 'Privacy Policy', href: '' } },
      { link: { label: 'Sitemap', href: '/sitemap.xml' } },
    ],
  },
})

await payload.updateGlobal({
  slug: 'site-settings',
  context: ctx(),
  data: {
    siteName: 'ZeeTech',
    titleTemplate: '%s — ZeeTech',
    defaultDescription:
      'ZeeTech is a technology studio for strategy, product design and engineering — building SaaS, web and mobile products from first idea to launch.',
    defaultShareImage: img.laptop,
    legalName: 'ZeeTech',
    email: 'hello@zeetech.studio',
    address: 'Dhaka, Bangladesh',
  },
})

/* ---------- check the uploaded files are really reachable (Blob) ---------- */
if (process.env.BLOB_READ_WRITE_TOKEN) {
  const all = await payload.find({ collection: 'media', limit: 500, pagination: false, depth: 0 })
  const urls = all.docs.flatMap((d) => [d.url, ...Object.values(d.sizes ?? {}).map((s) => s?.url)])
  const missing: string[] = []
  for (const url of urls) {
    if (!url || !url.startsWith('http')) continue
    let status = 0
    for (let attempt = 0; attempt < 3 && !status; attempt++) {
      status = await fetch(url, { method: 'HEAD' }).then((r) => r.status, () => 0)
    }
    if (status !== 200) missing.push(`${status || 'no response'} ${url}`)
  }
  if (missing.length) {
    payload.logger.error(`${missing.length} image files are not reachable:\n${missing.join('\n')}`)
    process.exit(1)
  }
  payload.logger.info(`All ${urls.filter(Boolean).length} image files are reachable on Vercel Blob.`)
}

payload.logger.info('Done. Open /admin to edit the content.')
process.exit(0)

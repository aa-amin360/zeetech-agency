// The Services page (Figma 638:2111) and the service pages (Figma 688:1996 → 688:2001; the last
// one, Cybersecurity & blockchain, has no Figma design and follows the same layout).
// Pictures live in legacy/assets/services.

export const SERVICES_HERO = {
  eyebrow: 'Our services / Strategy · Design · Engineering',
  title: 'Everything your next product needs.',
  highlight: 'One connected team.',
  text: 'From the first product decision to the next release, we bring strategy, design and engineering together to build useful digital experiences.',
  primaryCta: { label: 'Start a project', href: '#contact' },
  secondaryCta: { label: 'Explore Our Works', href: '/work' },
  background: 'hero-bg.webp',
  visual: 'hero-visual.webp',
}

export const SERVICES_LIST = {
  eyebrow: 'Seven disciplines.\nOne delivery team.',
  intro: 'Bring us an idea, an existing product or a complex challenge. We’ll help define the right next step.',
}

type Pair = [title: string, text: string]

export type ServiceData = {
  name: string
  accent: string
  kicker: string
  /** Icon in the header's Services menu (see SERVICE_ICONS in src/collections/Services.ts) */
  icon: string
  summary: string
  tagline: string
  highlight: string
  image: string
  /** Which part of `image` stays in view when it is cropped (0–100, top → bottom). */
  imageFocalY?: number
  heroImage: string
  deliverables: Pair[]
  process: Pair[]
  questions: Pair[]
}

export const SERVICES: ServiceData[] = [
  {
    name: 'System architecture & planning',
    accent: 'architecture',
    kicker: 'Architecture blueprint',
    icon: 'layers-3',
    summary:
      'Turn a complex idea into a clear, buildable plan. We map the requirements, technical decisions and delivery priorities before development begins.',
    tagline: 'A clear foundation for what comes next.',
    highlight: 'Clarity before code.',
    image: 'row-architecture.webp',
    heroImage: 'hero-architecture.webp',
    deliverables: [
      ['Product discovery & technical requirements', 'Align the team on users, business goals, constraints and acceptance criteria. Leave with a shared requirements brief.'],
      ['System architecture & data flows', 'Map application boundaries, data models and service connections so each technical decision has a clear purpose.'],
      ['Technology selection & integrations', 'Compare the stack, hosting and third-party services against your product needs, maintenance effort and expected growth.'],
      ['MVP scope & delivery roadmap', 'Define the smallest valuable release, dependencies and delivery milestones. Turn the plan into an actionable backlog.'],
    ],
    process: [
      ['Understand the product', 'Review the idea, existing systems and the outcomes that matter.'],
      ['Map the system', 'Trace user journeys, data movement and integration boundaries.'],
      ['Resolve the trade-offs', 'Evaluate complexity, cost and technical risks with your team.'],
      ['Prepare the build', 'Deliver the architecture, priorities and implementation roadmap.'],
    ],
    questions: [
      ['Do we need a finished brief?', 'No. We can start with your idea, existing documents or a product walkthrough and define the missing requirements together.'],
      ['Can you review our existing architecture?', 'Yes. We can assess your current system, identify constraints and recommend focused changes before a larger rebuild.'],
      ['What do we receive?', 'An agreed requirements brief, architecture and data-flow documentation, technical recommendations and a prioritised delivery roadmap.'],
    ],
  },
  {
    name: 'UI/UX design',
    accent: 'design',
    kicker: 'Product experience',
    icon: 'pen-tool',
    summary:
      'Make every interaction easier to understand. We design web and mobile experiences around user needs, with a visual system your product can grow with.',
    tagline: 'An experience people can use with confidence.',
    highlight: 'Made for real people.',
    image: 'row-uiux.webp',
    // the design shows the phone at the top of this collage, not the captions below it
    imageFocalY: 25,
    // the Figma hero picture for this service can't be exported; replace it in the admin
    heroImage: 'row-uiux.webp',
    deliverables: [
      ['UX research & user journeys', 'Explore user goals, friction and the journeys that matter. Connect product decisions to evidence and a clear experience map.'],
      ['Wireframes & interactive prototypes', 'Test structure and behaviour before committing to visual detail, using wireframes and clickable Figma prototypes.'],
      ['Web, mobile & SaaS interfaces', 'Design responsive screens, interaction states and accessible patterns for the devices your customers actually use.'],
      ['Reusable Figma design systems', 'Create reusable components, typography and colour rules with developer-ready specifications and organised Auto Layout.'],
    ],
    process: [
      ['Discover the users', 'Review your audience, product goals and existing experience.'],
      ['Shape the journeys', 'Organise information and prototype the critical paths.'],
      ['Design the experience', 'Refine layouts, interaction states and the visual language.'],
      ['Validate & hand over', 'Review usability, document the system and support implementation.'],
    ],
    questions: [
      ['Can you improve an existing product?', 'Yes. We can focus on specific journeys, redesign key screens or establish a consistent design system across your existing product.'],
      ['Will we receive an editable Figma file?', 'Yes. The handoff includes organised screens, components and responsive guidance so your team can continue working with the design.'],
      ['Can you work with our developers?', 'Yes. We review feasibility early and explain interactions, edge cases and component behaviour during handoff.'],
    ],
  },
  {
    name: 'Backend development & AI',
    accent: 'development & AI',
    kicker: 'Connected services',
    icon: 'file-code-2',
    summary:
      'Build the logic behind a dependable product. We connect data, services and workflows, adding AI where it solves a practical problem.',
    tagline: 'Connected systems that do the heavy lifting.',
    highlight: 'Power behind the product.',
    image: 'row-backend.webp',
    heroImage: 'hero-backend.webp',
    deliverables: [
      ['APIs, business logic & databases', 'Build documented APIs, reliable business logic and a data model that supports the workflows your product needs.'],
      ['Authentication & permission systems', 'Define user roles, access boundaries and authentication flows, with careful handling of sensitive operations.'],
      ['Third-party integrations & automation', 'Connect payments, communications and other services with clear failure handling, retries and traceable workflows.'],
      ['AI features & workflow implementation', 'Implement practical AI features with evaluation criteria, human review where needed and clear limits on model behaviour.'],
    ],
    process: [
      ['Define the contract', 'Agree data structures, API responsibilities and acceptance criteria.'],
      ['Build the foundation', 'Implement core services, permissions and database migrations.'],
      ['Connect & evaluate', 'Integrate external systems and evaluate any AI workflows.'],
      ['Test & document', 'Verify key paths and provide API documentation for your team.'],
    ],
    questions: [
      ['Can you connect to our current frontend?', 'Yes. We review the existing API contract and application behaviour, then plan compatible integrations or a staged migration.'],
      ['Does every product need AI?', 'No. We recommend AI only when it addresses a useful problem and can be evaluated against a clear standard.'],
      ['How are access and data handled?', 'We define permissions and data boundaries during planning, then review validation, logging and sensitive workflows as part of implementation.'],
    ],
  },
  {
    name: 'Frontend development',
    accent: 'development',
    kicker: 'Responsive interfaces',
    icon: 'monitor-smartphone',
    summary:
      'Bring the approved design to life across screens. We build responsive interfaces with reusable components and careful attention to everyday interactions.',
    tagline: 'From polished design to a working product.',
    highlight: 'Designed. Then delivered.',
    image: 'row-frontend.webp',
    heroImage: 'hero-frontend.webp',
    deliverables: [
      ['Responsive websites & web applications', 'Translate approved designs into responsive layouts that adapt thoughtfully across desktop, tablet and mobile screens.'],
      ['Reusable interface components', 'Build reusable interface components with consistent styles and predictable behaviour, making future changes easier.'],
      ['API integration & application states', 'Connect the interface to real services and account for loading, empty, error, success and permission states.'],
      ['Accessibility & performance refinement', 'Refine keyboard access, semantics, media delivery and rendering performance, then check the experience across target browsers.'],
    ],
    process: [
      ['Review the design', 'Confirm responsive behaviour, interactions and the component inventory.'],
      ['Build the interface', 'Implement layouts and reusable components with the agreed stack.'],
      ['Connect the product', 'Integrate APIs and cover realistic application states.'],
      ['Polish & verify', 'Review visual accuracy, accessibility and cross-device behaviour.'],
    ],
    questions: [
      ['Can you build from our Figma design?', 'Yes. We review your frames, components and interaction requirements, clarify missing states and implement the agreed experience.'],
      ['Do you support mobile layouts?', 'Yes. Responsive behaviour is part of the scope we define together, including navigation, content reflow and touch interactions.'],
      ['Can you work in our existing codebase?', 'Yes. We first review the framework, component conventions and build setup, then follow compatible patterns.'],
    ],
  },
  {
    name: 'SQA & security testing',
    accent: 'testing',
    kicker: 'Release readiness',
    icon: 'square-mouse-pointer',
    summary:
      'Find problems before your users do. We test critical journeys, integrations and release quality so the product is ready for real-world use.',
    tagline: 'More confidence in every release.',
    highlight: 'Confidence in every release.',
    image: 'row-sqa.webp',
    heroImage: 'hero-sqa.webp',
    deliverables: [
      ['Functional & regression testing', 'Verify core functionality against acceptance criteria and repeat the essential checks when the product changes.'],
      ['Integration & end-to-end testing', 'Test how services and features work together, covering the end-to-end journeys most important to your users.'],
      ['Usability & cross-device checks', 'Check the experience on agreed browsers and devices, including layout issues, confusing behaviour and interaction failures.'],
      ['Security-focused testing & issue tracking', 'Review risk-sensitive workflows, access controls and input handling, and document reproducible issues for remediation.'],
    ],
    process: [
      ['Plan the coverage', 'Identify priority journeys, environments and release risks.'],
      ['Exercise the product', 'Run functional, integration and cross-device checks.'],
      ['Report clear issues', 'Record reproduction steps, evidence and issue severity.'],
      ['Retest the fixes', 'Verify resolved issues and communicate remaining release risks.'],
    ],
    questions: [
      ['Can you test a product built by another team?', 'Yes. We start with access to a suitable test environment, a product walkthrough and the scope you want us to assess.'],
      ['What does the testing handoff include?', 'You receive the agreed test coverage, reproducible issue reports, retest results and a summary of unresolved risks.'],
      ['Does testing guarantee complete security?', 'No. Testing reduces risk within an agreed scope. Specialist penetration testing or compliance assessment can be scoped separately when needed.'],
    ],
  },
  {
    name: 'Deployment & ongoing support',
    accent: 'ongoing support',
    kicker: 'Continuous improvement',
    icon: 'cloud-cog',
    summary:
      'Keep moving after launch. We help deploy the product, monitor its health and plan improvements as your users and business needs evolve.',
    tagline: 'A launch is a beginning, not a handoff.',
    highlight: 'Ready for what comes next.',
    image: 'row-deploy.webp',
    heroImage: 'hero-deploy.webp',
    deliverables: [
      ['Production deployment & configuration', 'Prepare environments, configuration and a repeatable release process with a clear launch checklist and rollback approach.'],
      ['Monitoring & issue resolution', 'Set up useful health signals and error visibility so issues can be investigated with the right context.'],
      ['Maintenance & dependency updates', 'Plan maintenance work, review dependency changes and keep the application’s operational needs visible.'],
      ['New features & ongoing customization', 'Prioritise new features and improvements against user feedback, product goals and the health of the existing system.'],
    ],
    process: [
      ['Prepare for launch', 'Review environments, dependencies and operational ownership.'],
      ['Release with a plan', 'Deploy through an agreed checklist and verify critical journeys.'],
      ['Observe & respond', 'Track application health and investigate reported issues.'],
      ['Improve continuously', 'Plan maintenance and product improvements in a shared backlog.'],
    ],
    questions: [
      ['Can you support an existing application?', 'Yes. We begin with a technical review and an operational handover to understand the system and define a realistic support scope.'],
      ['Is support available around the clock?', 'Support hours, response targets and escalation paths are agreed explicitly for your engagement.'],
      ['Who owns hosting and third-party accounts?', 'Ownership and access are agreed during setup. We can work within your organisation’s accounts and document configuration and responsibilities.'],
    ],
  },
  {
    name: 'Cybersecurity & blockchain',
    accent: 'blockchain',
    kicker: 'Security & Web3',
    icon: 'shield-check',
    summary:
      'Protect what you build and the data it holds. We harden products against real threats and build secure blockchain features where they add genuine value.',
    tagline: 'Security and trust, designed in from the start.',
    highlight: 'Trust, built in.',
    image: 'row-cyber-blockchain.webp',
    heroImage: 'hero-cyber-blockchain.webp',
    deliverables: [
      ['Security assessment & threat modelling', 'Review your architecture, data flows and access paths to find realistic threats, then prioritise the fixes that reduce the most risk.'],
      ['Application & cloud hardening', 'Strengthen authentication, secrets management, encryption, logging and infrastructure configuration across the application and its hosting.'],
      ['Smart contracts & dApp development', 'Design, build and test smart contracts and decentralised app features with clear upgrade paths, efficient logic and documented behaviour.'],
      ['Wallet, token & on-chain integrations', 'Connect wallets, payments, tokens and blockchain data to your product with careful key handling and transparent transaction flows.'],
    ],
    process: [
      ['Assess the risks', 'Map the assets, threats and parts of the system that need protection.'],
      ['Design for trust', 'Agree the security controls and, where useful, the on-chain architecture.'],
      ['Build & harden', 'Implement controls, contracts and integrations with secure defaults.'],
      ['Verify & monitor', 'Test, review and set up alerts so issues surface early.'],
    ],
    questions: [
      ['Does our product need blockchain?', 'Not always. We recommend it only when shared records, transparency or digital ownership solve a real problem, and suggest simpler options when they fit better.'],
      ['Can you review our existing application or smart contracts?', 'Yes. We review code, configuration and workflows, report issues by severity and help you fix them. Independent third-party audits can be arranged for high-value contracts.'],
      ['Which blockchains do you work with?', 'Mainly Ethereum and EVM-compatible networks such as Polygon, Base and BNB Chain. Other networks can be scoped around your requirements.'],
    ],
  },
]

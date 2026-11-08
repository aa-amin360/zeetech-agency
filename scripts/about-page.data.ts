// The About Us page (Figma 721:2419). Pictures live in legacy/assets/about.
// The wording is the design's starting copy — edit it in the admin (Pages → About).

const heading = (eyebrow: string, title: string, accent: string, subtitle = '', accentOnNewLine = false) => ({
  eyebrow,
  title,
  accent,
  accentOnNewLine,
  subtitle,
})

export const ABOUT_PAGE = {
  title: 'About',
  slug: 'about',
  meta: {
    title: 'About ZeeTech — Product design and engineering studio',
    description:
      'Strategy, product design and engineering under one roof. Senior designers and engineers sit on your product from week one.',
  },
}

/** Each entry becomes one section; `images` are file names in legacy/assets/about with their alt text. */
export const ABOUT_SECTIONS = [
  {
    blockType: 'pageIntro',
    heading: heading(
      'About ZeeTech Studio',
      'We design & build digital',
      'products people want to use.',
      'Strategy, product design and engineering under one roof. Senior designers and engineers sit on your product from week one — no handover between agencies, no six-week kickoff, no guessing what ships next.',
      true,
    ),
    image: ['studio-team.webp', 'ZeeTech team planning a product at the whiteboard'],
  },
  {
    blockType: 'storyMedia',
    heading: heading(
      'What we believe',
      'Good products feel simple to use—',
      'and thoughtful underneath.',
      'That starts with understanding people, not rushing to screens.\nWe design web and mobile experiences around user needs, with a visual system your product can grow with.',
    ),
    layout: 'stack',
    background: 'white',
    images: [
      ['phones-mockup.webp', 'Mobile app screens on two phones'],
      // the design shows the phone, not the captions under it
      ['product-interface.webp', 'Banking app interface on a phone', 30],
      ['studio-team.webp', 'ZeeTech team planning a product at the whiteboard'],
    ],
  },
  {
    blockType: 'storyMedia',
    heading: heading(
      'How we work',
      'Close collaboration,',
      'all the way through.',
      'Keep product intent visible as work moves from early questions into design, engineering and quality.\nBring us an idea, an existing product or a complex challenge. We’ll help define the right next step.',
    ),
    layout: 'pair',
    background: 'warm',
    images: [
      ['team-collaboration.webp', 'Product team reviewing work together'],
      ['founder-portrait.webp', 'Portrait of ZeeTech’s co-founder'],
    ],
  },
  {
    blockType: 'cardGrid',
    heading: heading(
      'Six disciplines. One delivery team.',
      'Six disciplines.',
      'One delivery team.',
      'From the first product decision to the next release, we bring strategy, design and engineering together to build useful digital experiences.',
      true,
    ),
    style: 'figures',
    background: 'white',
    cards: [
      { figure: '40+', title: 'Product teams worldwide', text: 'A proven product partner for teams around the world.' },
      { figure: '06', title: 'Disciplines. One delivery team.', text: 'Strategy, design, engineering, quality, deployment and support.' },
      { figure: 'Week 01', title: 'Senior people from day one.', text: 'Senior designers and engineers sit on your product from week one.' },
      { figure: 'No handoff', title: 'One connected delivery path.', text: 'No handover between agencies. Clear decisions from strategy to build.' },
    ],
  },
  {
    blockType: 'storyMedia',
    heading: heading(
      'Direct human partnership',
      'A real conversation behind',
      'every product decision.',
      'Amit Ghosh, COO & Co-founder, is part of the conversations where product direction takes shape. Clear questions and shared decisions help connect an idea to the work that follows.\nProduct context · Shared decisions · Clear next steps',
    ),
    layout: 'person',
    background: 'warm',
    images: [
      ['studio-team.webp', 'ZeeTech team planning a product at the whiteboard'],
      ['founder-portrait.webp', 'Portrait of ZeeTech’s co-founder'],
    ],
    person: { name: 'Amit Ghosh', role: 'COO & Co-founder' },
  },
  {
    blockType: 'cardGrid',
    heading: heading(
      'Core values',
      'Principles behind every',
      'product we shape.',
      'We keep people in view, connect decisions to context, and build with the next step in mind.',
      true,
    ),
    style: 'numbered',
    background: 'white',
    cards: [
      { title: 'Start with people', text: 'Understand the need before deciding what to build.' },
      { title: 'Keep the context close', text: 'Connect design and engineering decisions as the product takes shape.' },
      { title: 'Care beyond launch', text: 'Build with quality and the next product step in mind.' },
    ],
  },
  {
    blockType: 'contactBand',
    heading: { eyebrow: 'Let’s build what’s next', title: 'Let’s turn your next idea into', accent: 'a product people can use.', accentOnNewLine: true },
    cta: { label: 'Start a project', href: '/#contact' },
  },
] as const

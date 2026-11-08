// The Contact Us page (Figma 753:2877) and the Careers page (Figma 721:2420).
// Pictures live in legacy/assets/careers. The wording is the design's starting copy —
// edit it in the admin (Pages → Contact / Careers).

export const CONTACT_PAGE = {
  title: 'Contact',
  slug: 'contact',
  meta: {
    title: 'Contact ZeeTech — Start a project',
    description:
      'Share the idea, challenge or next step on your mind. A little context makes our first conversation more useful.',
  },
  intro: {
    heading: {
      eyebrow: 'Contact ZeeTech Studio',
      title: 'Tell us what you’re',
      accent: 'thinking about.',
      accentOnNewLine: true,
      subtitle: 'Share the idea, challenge or next step on your mind. A little context makes our first conversation more useful.',
    },
    image: ['studio-team.webp', 'ZeeTech team planning a product at the whiteboard'] as const,
  },
}

export const CAREERS_PAGE = {
  title: 'Careers',
  slug: 'careers',
  meta: {
    title: 'Careers at ZeeTech',
    description:
      'We work across product thinking, design and engineering. If you care about thoughtful digital products, tell us what you could bring to the studio.',
  },
  hero: {
    eyebrow: 'Careers at ZeeTech Studio',
    title: 'Bring your craft to',
    highlight: 'useful digital products.',
    text: 'We work across product thinking, design and engineering. If you care about thoughtful digital products, tell us what you could bring to the studio.',
    cta: { label: 'Explore opportunities', href: '#areas' },
    images: [
      ['studio-team.webp', 'ZeeTech team planning a product at the whiteboard'],
      ['code-desk.webp', 'Code on a monitor at a developer’s desk'],
      ['founder-portrait.webp', 'Portrait of ZeeTech’s co-founder'],
    ] as const,
    label: { kicker: 'How we work', title: 'A shared product journey', text: 'Product · design · engineering' },
  },
  principles: {
    heading: {
      eyebrow: 'The way we work',
      title: 'Good work happens between disciplines.',
      accent: 'Curiosity, context and care—carried through the work.',
      accentOnNewLine: true,
      subtitle: 'We stay close to the problem and to one another as a product moves from early thinking into design, engineering and quality.',
    },
    cards: [
      { title: 'Stay curious', text: 'Ask what the product needs and who it needs to work for.' },
      { title: 'Share the context', text: 'Bring design and engineering into the same conversation.' },
      { title: 'Care about the craft', text: 'Pay attention to the small details people notice every day.' },
    ],
  },
  areas: {
    label: 'Areas of interest',
    title: 'Find the kind of work you want to do.',
    accent: 'Bring your strengths to useful digital products.',
    text: 'These cards describe our work areas, not live openings. Tell us which one fits you.',
    cards: [
      {
        icon: 'buildings',
        title: 'Product planning & architecture',
        text: 'Turn a product brief into clear requirements, user flows and a thoughtful technical direction.',
        focus: ['Discovery', 'User flows', 'System planning'],
      },
      {
        icon: 'frame',
        title: 'Product & UI/UX design',
        text: 'Shape an intuitive journey and interface, from early exploration through a coherent design system.',
        focus: ['Research', 'UX flows', 'UI systems'],
      },
      {
        icon: 'box',
        title: 'Frontend development',
        text: 'Build responsive interfaces with clear states, reusable components and dependable interactions.',
        focus: ['Responsive UI', 'Components', 'Interaction'],
      },
      {
        icon: 'profile-2user',
        title: 'Backend, AI & quality',
        text: 'Connect product systems, build useful workflows and check the experience end to end.',
        focus: ['APIs', 'AI workflows', 'Quality'],
      },
    ],
  },
  /** the inquiry card's left side, reworded for people who want to join */
  inquiry: {
    eyebrow: 'Before you send it',
    title: 'Three things help us get to know you.',
    steps: [
      { title: 'What do you do best?', text: 'The craft you bring — design, engineering, quality or planning.' },
      { title: 'What have you built?', text: 'A portfolio, a repository or a product you worked on.' },
      { title: 'What would you like to work on?', text: 'The kind of products and teams that bring out your best work.' },
    ],
    submitLabel: 'Share interest',
    successMessage: 'Thank you — we read every message and will reply if there’s a fit.',
  },
}

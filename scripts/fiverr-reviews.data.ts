/* Real reviews from Amit's Fiverr profile (codegenix99), copied word for word from the owner's
 * screenshots on 2026-11-28. No buyer photos (not ours to use); the site shows a letter avatar
 * and a "Verified on Fiverr" link instead. Prices from Fiverr are left out on purpose. */
export const FIVERR_PROFILE = 'https://www.fiverr.com/codegenix99'

export type FiverrReview = {
  /** Fiverr username: how the review is found again */
  username: string
  /** shown name: the real name when the client agreed, otherwise the username */
  name: string
  /** photo in legacy/assets/testimonials, only when the client provided it */
  photo?: readonly [file: string, alt: string]
  company: string // shown as the location line
  role: string // what was built, from the review card
  quote: string
  rating: number
  featured?: boolean
  /** kept as a draft (not shown) until the owner decides */
  hidden?: string
}

/** In display order. */
export const FIVERR_REVIEWS: FiverrReview[] = [
  {
    // real name, title and photo provided via the owner (2026-11-28)
    username: 'devgaur1989',
    name: 'Devdurgaa',
    photo: ['devdurgaa.png', 'Devdurgaa, CEO & Founder of FunnelsGrid'],
    company: 'India · devgaur1989 on Fiverr',
    role: 'CEO & Founder, FunnelsGrid',
    quote: 'Nobin did the excellent work. thanks',
    rating: 5,
    featured: true, // owner's choice (2026-11-28): the big quote on the home page
  },
  {
    username: 'barbara_mo',
    name: 'barbara_mo',
    company: 'United States',
    role: 'SaaS landing page · 7 days',
    quote: 'Built a super sleek, dark-mode SaaS web app landing page for my startup. Recommended.',
    rating: 5,
  },
  {
    username: 'ermastover',
    name: 'ermastover',
    company: 'United States',
    role: 'Dashboard design · 5 days · Ongoing collaboration',
    quote:
      'I asked for a new dashboard design, did it in time, and appreciate the discount. You are really a good soul. Thank you for helping me out with the additional task and price. I pray you would get the recognition you deserve.',
    rating: 5,
  },
  {
    username: 'danilesaurdanet',
    name: 'danilesaurdanet',
    company: 'Venezuela',
    role: 'Full-stack web application · 5 weeks · Ongoing collaboration',
    quote:
      'Excelente atención, muy colaborador, trabajo excelente y rápido. (In English: Excellent service, very collaborative, excellent and fast work.)',
    rating: 4.3,
  },
]

/** The template testimonials these replace (unpublished, not deleted). */
export const TEMPLATE_TESTIMONIALS = ['Andrew Baker', 'Marcus Vance']

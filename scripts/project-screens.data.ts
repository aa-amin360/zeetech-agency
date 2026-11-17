// Real product screens (dummy data, shared by the owner) for the real projects, framed in a browser
// window. Files live in legacy/assets/work/<folder>/. Used by add-nexus-courier.ts,
// add-supreme-calliana.ts (new databases) and update-project-screens.ts (existing ones).
type Shot = [file: string, alt: string]
export type ProjectScreens = { slug: string; folder: string; cover: Shot; gallery: Shot[] }

export const NEXUS_SCREENS: ProjectScreens = {
  slug: 'nexus-courier-logistics-platform',
  folder: 'nexus-courier',
  cover: ['nexus-banner.webp', 'Nexus Courier brand banner'],
  gallery: [
    ['nexus-dashboard.webp', 'Nexus Courier admin dashboard: shipments, delivery performance and recent orders'],
    ['nexus-orders.webp', 'Nexus Courier order management'],
    ['nexus-tracking.webp', 'Nexus Courier shipment tracking with live map and tracking history'],
    ['nexus-proof-of-delivery.webp', 'Nexus Courier proof of delivery: signature, photo and verification'],
    ['nexus-client-portal.webp', 'Nexus Courier corporate client dashboard'],
    ['nexus-light-dark.webp', 'Nexus Courier admin dashboard in light and dark mode'],
  ],
}

export const SUPREME_SCREENS: ProjectScreens = {
  slug: 'supreme-prospects-athletic-recruitment-platform',
  folder: 'supreme-prospects',
  cover: ['supreme-banner.webp', 'Supreme Prospects brand banner'],
  gallery: [
    ['supreme-dashboard.webp', 'Supreme Prospects dashboard: recruitment activity, talent distribution and pipeline'],
    ['supreme-athlete-profile.webp', 'Supreme Prospects athlete profile with talent score and performance analytics'],
    ['supreme-talent-evaluation.webp', 'Supreme Prospects talent evaluation with sport-specific rubric'],
    ['supreme-scouting.webp', 'Supreme Prospects scouting and recruitment'],
    ['supreme-light-dark.webp', 'Supreme Prospects dashboard in light and dark mode'],
  ],
}

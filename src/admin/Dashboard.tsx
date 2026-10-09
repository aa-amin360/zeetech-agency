import type { ServerProps } from 'payload'

const qs = (where: Record<string, Record<string, string>>) =>
  '?' +
  Object.entries(where)
    .flatMap(([field, ops]) => Object.entries(ops).map(([op, v]) => `where[${field}][${op}]=${encodeURIComponent(v)}`))
    .join('&')

/**
 * Admin home: a welcome line, live numbers that need attention and shortcuts to the everyday
 * jobs. Shown above Payload's usual list of collections.
 */
export async function Dashboard({ payload, user }: ServerProps) {
  const admin = payload.config.routes.admin
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [newLeads, weekLeads, feedback, drafts, home] = await Promise.all([
    payload.count({ collection: 'leads', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'leads', where: { createdAt: { greater_than: weekAgo } } }),
    payload.count({ collection: 'feedback-requests', where: { status: { equals: 'submitted' } } }),
    payload.count({ collection: 'testimonials', where: { _status: { equals: 'draft' } } }),
    payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0, draft: true }),
  ])
  const homeId = home.docs[0]?.id

  const name = (user && 'name' in user && typeof user.name === 'string' && user.name.split(' ')[0]) || ''

  const stats = [
    {
      value: newLeads.totalDocs,
      label: 'New leads',
      hint: 'Not contacted yet',
      href: `${admin}/collections/leads${qs({ status: { equals: 'new' } })}`,
      urgent: newLeads.totalDocs > 0,
    },
    {
      value: weekLeads.totalDocs,
      label: 'Leads this week',
      hint: 'Last 7 days',
      href: `${admin}/collections/leads`,
    },
    {
      value: feedback.totalDocs,
      label: 'Feedback received',
      hint: 'Waiting for your review',
      href: `${admin}/collections/feedback-requests${qs({ status: { equals: 'submitted' } })}`,
      urgent: feedback.totalDocs > 0,
    },
    {
      value: drafts.totalDocs,
      label: 'Draft testimonials',
      hint: 'Not on the website yet',
      href: `${admin}/collections/testimonials${qs({ _status: { equals: 'draft' } })}`,
    },
  ]

  const actions = [
    {
      label: 'Edit the home page',
      text: 'Text, images and sections',
      href: homeId ? `${admin}/collections/pages/${homeId}` : `${admin}/collections/pages`,
      icon: 'M4 5h16v14H4zM4 9h16M9 9v10',
    },
    {
      label: 'Leads inbox',
      text: 'Project inquiries from the site',
      href: `${admin}/collections/leads`,
      icon: 'M4 7l8 6 8-6M4 7h16v11H4z',
    },
    {
      label: 'Ask a client for feedback',
      text: 'Create a private feedback link',
      href: `${admin}/collections/feedback-requests/create`,
      icon: 'M5 5h14v10H9l-4 4zM9 10h6',
    },
    {
      label: 'Upload images',
      text: 'Add photos, logos and videos',
      href: `${admin}/collections/media/create`,
      icon: 'M12 16V5M7 10l5-5 5 5M5 19h14',
    },
    {
      label: 'SEO & tracking',
      text: 'Site settings, Google tags',
      href: `${admin}/globals/site-settings`,
      icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
    },
    {
      label: 'View the website',
      text: 'Opens in a new tab',
      href: '/',
      icon: 'M14 5h5v5M19 5l-8 8M18 14v5H5V6h5',
      external: true,
    },
  ]

  return (
    <section className="zt-dash">
      <header className="zt-dash__head">
        <p className="zt-dash__kicker">ZeeTech admin</p>
        <h1 className="zt-dash__title">{name ? `Welcome back, ${name}` : 'Welcome back'}</h1>
        <p className="zt-dash__sub">Here is what needs your attention, and shortcuts to everyday jobs.</p>
      </header>

      <div className="zt-dash__stats">
        {stats.map((s) => (
          <a key={s.label} className={`zt-stat${s.urgent ? ' zt-stat--urgent' : ''}`} href={s.href}>
            <span className="zt-stat__value">{s.value}</span>
            <span className="zt-stat__label">{s.label}</span>
            <span className="zt-stat__hint">{s.hint}</span>
          </a>
        ))}
      </div>

      <h2 className="zt-dash__h2">Quick actions</h2>
      <div className="zt-dash__actions">
        {actions.map((a) => (
          <a
            key={a.label}
            className="zt-action"
            href={a.href}
            {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className="zt-action__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d={a.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="zt-action__text">
              <strong>{a.label}</strong>
              <span>{a.text}</span>
            </span>
          </a>
        ))}
      </div>

      <h2 className="zt-dash__h2">Everything else</h2>
    </section>
  )
}

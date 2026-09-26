import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { escapeHtml, isEmail, json, notifyList, rateLimited, str } from '@/lib/forms'
import { serverUrl } from '@/lib/url'

/** Project inquiry → Leads collection (+ email to the team when SMTP is set up). */
export async function POST(req: NextRequest) {
  if (rateLimited(req, 'inquiry', 5, 10 * 60_000)) {
    return json({ error: 'Too many messages in a short time. Please try again in a few minutes.' }, 429)
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  // spam traps: hidden field filled in, or sent faster than a person could type
  if (str(body.website) || Number(body.elapsedMs) < 2500) return json({ ok: true })

  const name = str(body.name, 120)
  const email = str(body.email, 160)
  const details = str(body.details, 5000)
  if (!name || !isEmail(email) || !details) {
    return json({ error: 'Please add your name, a valid email and a few project details.' }, 400)
  }
  const phone = str(body.phone, 30)
  const dial = str(body.dial, 6)
  const budget = str(body.budget, 60)
  const a = (typeof body.attribution === 'object' && body.attribution ? body.attribution : {}) as Record<string, unknown>

  const payload = await getPayloadClient()
  const lead = await payload.create({
    collection: 'leads',
    overrideAccess: true,
    data: {
      name,
      email,
      phone: phone ? `${dial} ${phone}`.trim() : undefined,
      budget: budget || undefined,
      details,
      attribution: {
        utmSource: str(a.utmSource, 200) || undefined,
        utmMedium: str(a.utmMedium, 200) || undefined,
        utmCampaign: str(a.utmCampaign, 200) || undefined,
        utmTerm: str(a.utmTerm, 200) || undefined,
        utmContent: str(a.utmContent, 200) || undefined,
        clickId: str(a.clickId, 300) || undefined,
        referrer: str(a.referrer, 500) || undefined,
        landingPage: str(a.landingPage, 500) || undefined,
        formPage: str(a.formPage, 500) || undefined,
      },
    },
  })

  const to = notifyList()
  if (to.length) {
    const rows = [
      ['Name', name],
      ['Email', email],
      ['WhatsApp', phone ? `${dial} ${phone}` : '—'],
      ['Budget', budget || '—'],
      ['Campaign', [a.utmSource, a.utmMedium, a.utmCampaign].filter(Boolean).join(' / ') || '—'],
    ]
    payload
      .sendEmail({
        to,
        replyTo: email,
        subject: `New project inquiry — ${name}`,
        html: `<h2>New project inquiry</h2>
<table>${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(String(v))}</td></tr>`).join('')}</table>
<p>${escapeHtml(details).replace(/\n/g, '<br>')}</p>
<p><a href="${serverUrl()}/admin/collections/leads/${lead.id}">Open in the admin panel</a></p>`,
      })
      .catch((err: unknown) => payload.logger.error({ err }, 'Could not email the new lead'))
  }

  return json({ ok: true })
}

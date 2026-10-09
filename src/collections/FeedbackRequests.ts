import crypto from 'node:crypto'
import type { CollectionConfig } from 'payload'
import { loggedIn } from '@/access'
import { serverUrl } from '@/lib/url'

const inDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString()

/**
 * A private link sent to a client so they can leave written or video feedback.
 * What they send arrives in Testimonials as a draft for review.
 */
export const FeedbackRequests: CollectionConfig = {
  slug: 'feedback-requests',
  admin: {
    group: 'Inbox',
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'company', 'status', 'expiresAt', 'createdAt'],
    description:
      'Create a request, then copy the private link (or tick “Email the link”) and send it to your client.',
  },
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'clientName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'company', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'clientEmail', type: 'email' },
    {
      name: 'project',
      type: 'text',
      admin: { description: 'Shown to the client on the form, e.g. “FleetPulse dispatch platform”.' },
    },
    {
      name: 'shareLink',
      type: 'text',
      virtual: true,
      label: 'Private feedback link',
      admin: { readOnly: true, description: 'Copy this link and send it to the client.' },
      hooks: {
        afterRead: [({ siblingData }) => (siblingData?.token ? `${serverUrl()}/feedback/${siblingData.token}` : '')],
      },
    },
    {
      name: 'emailClient',
      type: 'checkbox',
      label: 'Email the link to the client when saved',
      defaultValue: false,
      admin: { description: 'Needs SMTP to be set up on the server.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Waiting for client', value: 'open' },
        { label: 'Feedback received', value: 'submitted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar', components: { Cell: '/admin/StatusCell#StatusCell' } },
    },
    {
      name: 'expiresAt',
      type: 'date',
      defaultValue: () => inDays(30),
      admin: { position: 'sidebar', description: 'The link stops working after this date.' },
    },
    { name: 'invitedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'testimonial',
      type: 'relationship',
      relationTo: 'testimonials',
      admin: { position: 'sidebar', readOnly: true, description: 'Created when the client submits.' },
    },
    {
      name: 'token',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data && operation === 'create' && !data.token) {
          data.token = crypto.randomBytes(24).toString('base64url')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, context }) => {
        if (context?.skipInvite || !doc.emailClient || !doc.clientEmail || doc.invitedAt) return doc
        const link = `${serverUrl()}/feedback/${doc.token}`
        try {
          await req.payload.sendEmail({
            to: doc.clientEmail,
            subject: 'Could you share a few words about working with ZeeTech?',
            html: `<p>Hi ${doc.clientName},</p>
<p>Thank you for working with us${doc.project ? ` on ${doc.project}` : ''}. We would love to hear how it went — a few written lines or a short video from your phone are both perfect.</p>
<p><a href="${link}">Share your feedback</a></p>
<p>It only takes a couple of minutes, and nothing is published without your permission.</p>
<p>— The ZeeTech team</p>`,
          })
          await req.payload.update({
            collection: 'feedback-requests',
            id: doc.id,
            data: { invitedAt: new Date().toISOString() },
            context: { skipInvite: true },
            req,
          })
        } catch (err) {
          req.payload.logger.error({ err }, 'Could not send the feedback invitation email')
        }
        return doc
      },
    ],
  },
}

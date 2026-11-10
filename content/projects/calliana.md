# Calliana: site-ready case study copy

Source: internal project scope document (PDF, received 2026-11-10) plus the owner's status update.
**Not published from the source:** the client-side owner's name, the Fiverr conversation, pricing,
the internal phase plan, open questions, and the exact softphone/PBX product and version.

**Status (owner, 2026-11-10):** design and frontend complete; backend mostly done; some third-party
integrations not connected yet. The copy says exactly that and claims no results.

**Decisions:** name "Calliana" ✅ · duration 3 months ✅ · live status not shown (a "Where it stands"
section explains the stage instead) ✅ · illustrations instead of screenshots ✅ · Project 03.

`scripts/add-supreme-calliana.ts` reads the **Story** section of this file.

---

## Card & page fields (admin → Case studies)

| Field | Value |
|---|---|
| Title | Calliana — |
| Title accent (orange line) | Virtual Receptionist Call Platform |
| Client | Calliana |
| Service (1st tag) | Product design & full-stack development |
| Industry (2nd tag, filter) | Customer Service |
| Duration | 3 months |
| Status | *(not shown)* |
| Chips | Call workspace (CTI) · VoIP integration · Agent, client & admin portals · React & Node.js · PostgreSQL |
| Card colour | `#ff8db7` |
| Summary (card + Google) | A browser-based call workspace for virtual receptionists: caller ID, client context, scripts, calendars and voicemail in one place. |
| SEO title | Calliana: virtual receptionist call platform case study \| ZeeTech |
| SEO description | How ZeeTech designed and built Calliana, a call workspace for virtual receptionists with agent, client and admin portals, scripts, calendars, voicemail and messaging. |

---

## Story (admin → Case study story)

### About the project
Calliana runs a virtual receptionist service. Its agents answer calls on behalf of medical, dental
and professional practices, often from far away, and handle each call the way that practice wants:
identify the caller, follow the practice's instructions, book appointments, take messages and pass
the result back.

The company asked us to replace its ageing in-house system. This isn't a classic CRM. It's a
call workspace that links live phone calls to client context, scripts, calendars and follow-up.

**Our role:** product design and full-stack development: UX/UI for all three roles, the React
frontend, and the Node.js backend and database.

### The problem
- **A dated, crowded interface.** New agents struggled to know what to do next during a live call.
- **Context in too many places.** Caller history, the practice's instructions, the calendar and scripts all lived on different screens.
- **Easy-to-break call rules.** Missed calls must be called back and completed before the practice sees them as handled; after-hours calls follow different rules.
- **No proper client or admin side.** Practices and administrators needed their own tools, designed from scratch because the old screens weren't available.

### The solution
**Agent workspace: everything for the call on one screen**
- Incoming number shown and matched to a known contact and practice
- Practice and sub-client (e.g. the specific doctor) with the practice's local time and current appointment
- Fast note-taking, several categories per call (appointment, callback, urgent, quote, lead…), live call timer
- Earlier calls from the same caller, searchable call history, and recordings where the phone system provides them
- Keyboard shortcuts for saved responses and common call actions

**Scripts and dispositions**
- Decision-tree scripts that step the agent through each practice's protocol
- Quick-reference instructions and saved responses, all usable without leaving the call

**Calendar and tasks**
- A calendar per practice with day, week and month views, confirmations, and a record of who booked what
- Appointments made during a call flow straight into the call record
- Tasks linked to calls and clients, assigned to agents, with status and filters

**Voicemail and messaging**
- Voicemail inbox with playback, download, transcription and one-click callback
- SMS history and sending, WhatsApp, and a live chat between practices and the agent team

**Client portal and admin panel**
- Practices see their call log, add notes or request follow-up, and manage their profile, contacts, calendar and notifications
- Admins onboard practices and sub-clients, manage phone numbers and routing, assign agents to accounts, review recordings for QA and follow call analytics

**Missed calls, handled properly**
- A missed call becomes a callback task; only after the callback is completed does the practice see it as handled
- After-hours calls are kept separate with an explicit status

### Under the hood
- **Frontend:** React, responsive role-aware dashboards, real-time updates over WebSockets
- **Backend:** Node.js REST API, role-based access control, audit logs for important actions
- **Data:** PostgreSQL for practices, sub-clients, contacts, calls, scripts, calendars, tasks and messages
- **Integrations:** adapters for telephony, SMS/WhatsApp, email and voicemail transcription, so a provider can be swapped without touching the business logic

### Where it stands
The UX/UI for all three roles and the full frontend are complete, and the backend is mostly done.
The last step is connecting the remaining third-party services (telephony events, messaging, email
and transcription providers) and testing every call flow end to end before launch.

> “The live call is the product. Every other screen exists to help an agent answer correctly and pass the result to the right person.” — ZeeTech

---

## Visuals

**Real product screens** shared by the owner (2026-11-10), framed in a browser window on a soft
background (framing script kept in the session scratchpad; originals are the owner's). The two tall
agent dashboards are cropped to their top part. Files in `legacy/assets/work/calliana/`:

| File | Used as | Shows |
|---|---|---|
| `cover.webp` | Cover | Calliana logo banner (edges faded into a blurred copy so every crop works) |
| `signin.webp` | Gallery 1 | Sign-in page |
| `agent-dashboard.webp` | Gallery 2 | Agent dashboard: stats, live inbound call, today's schedule |
| `live-call.webp` | Gallery 3 | Live call workspace: caller profile, instructions, notes, categories, scripts |
| `client-portal.webp` | Gallery 4 | Client portal: inbound calls, appointments, conversations |
| `admin-overview.webp` | Gallery 5 | Admin overview: live calls, attention list, agent availability, audit trail |
| `light-dark.webp` | Gallery 6 | Agent dashboard in light and dark mode |

**Confirmed by the owner (2026-11-10):** all data in the screens is dummy data exported from Figma; the
client is happy for the screens to be shown; showing "Zoiper Connected" is fine.

(The earlier illustrated Calliana boards in [project-visuals.html](project-visuals.html) `#ca-…` are no longer used.)

# Nexus Courier: site-ready case study copy

Source: owner's write-up (received 2026-11-09). Rewritten in the agency's voice ("we" / ZeeTech).
The scope is kept honest: ZeeTech built the **web platform** (admin + corporate client
dashboards). The backend, driver app and infrastructure belong to the wider platform and are
described as the platform's architecture, not as our work.

**Decisions (2026-11-09):** name it "Nexus Courier" ✅ · duration 6 months ✅ · live status is
**not** shown ✅ · no screenshots, so illustrative visuals are used (see bottom) ✅ · no invented
client quote; a ZeeTech pull-quote closes the story, and a draft quote for the client to approve
is at the bottom.

`scripts/add-nexus-courier.ts` reads the **Story** section of this file, so edit the wording here,
not in the script. Once the case study exists, later edits go in the admin.

---

## Card & page fields (admin → Case studies)

| Field | Value |
|---|---|
| Title | Nexus Courier — |
| Title accent (orange line) | Logistics Operations Platform |
| Client | Nexus Courier |
| Service (1st tag) | Web platform development |
| Industry (2nd tag, filter) | Logistics |
| Duration | 6 months |
| Status | *(left empty on purpose, not shown)* |
| Chips | Admin dashboard · Client dashboard · Enterprise SaaS · Workflow automation · Next.js |
| Card colour | `#27d4f2` (suggested; cyan reads "logistics/tech", distinct from the orange brand) |
| Summary (card + Google, ≤160 chars) | An enterprise courier platform connecting clients, dispatchers and drivers. We built its admin and corporate client dashboards. |
| SEO title | Nexus Courier: enterprise logistics platform case study \| ZeeTech |
| SEO description | How ZeeTech built the admin and client dashboards for Nexus Courier, a multi-tenant platform for courier dispatch, parcel tracking and proof of delivery. |

---

## Story (admin → Case study story)

### About the project
Nexus Courier is an enterprise platform that helps courier companies run business deliveries
from one place: document runs, parcel tracking, dispatch and day-to-day operations.

It is built for clients who can't afford a lost envelope: title and escrow companies, law firms,
financial institutions and corporate offices. The platform connects four groups of people:
corporate clients, courier administrators, dispatchers and field drivers. Every step from
delivery request to proof of delivery is traceable.

**Our role:** web platform development. We built and refined the admin dashboard and the
corporate client dashboard, turning complex operational requirements into clear, usable workflows.

### The problem
Courier work still runs on phone calls, handwritten waybills and manual dispatching. That causes
problems as volume grows:

- **No visibility.** Once a parcel leaves, clients can't see where it is.
- **Manual dispatch.** Assigning drivers and routes slows down as orders increase.
- **Scattered communication.** Clients, dispatchers and drivers each use different channels.
- **Accountability gaps.** Without verified pickup and delivery records, disputes are hard to settle.
- **Operational complexity.** Service areas, sorting hubs, driver handoffs and rush jobs all need coordinating.
- **Admin overhead.** Clients, drivers, permissions, billing and exceptions are managed across different teams.

The goal: bring all of this into one platform without making it rigid or hard to use.

### The solution
One system with a dashboard for each role, a driver mobile app and a real-time backend. Each
person sees the information and actions relevant to their job.

**Admin dashboard**: full control for the courier operator
- Operational analytics and performance monitoring
- Order creation, assignment, tracking and management
- Driver onboarding, management and attendance
- Corporate client registration and invitations
- Service areas drawn on interactive maps
- Hub and sorting-bucket management
- Delivery run monitoring and dispatch
- Exception handling and resolution
- Custom roles and permissions
- Invoicing and client billing

**Corporate client dashboard**: business customers manage their own deliveries
- Pickup and delivery requests in a few steps
- Route, Rush and Round Trip service options
- Saved contacts and addresses
- Tracking numbers and printable QR shipping labels
- Live status and tracking timeline
- Proof of delivery with recipient name and signature
- Order history, filters and analytics
- Notification preferences
- Public tracking page, no account needed

**Tracking with a chain of custody**
Every parcel movement is recorded as a scan event: pickup, hub drop and delivery. Each event is
timestamped and carries a GPS location, the driver and the parcel. Together they form an
unbroken record from first pickup to signed delivery, with exceptions logged and resolved along the way.

**Dispatch and hub workflows**
- Driver assignment based on workload
- Geographic service areas
- Hub-and-spoke sorting with destination buckets
- Automatic grouping into delivery runs
- Manifest checks when a driver checks out
- Driver-to-driver parcel transfers
- Separate outbound and return flows

### Under the hood
The platform behind the dashboards solves several hard problems:

- **Multi-tenant:** several courier companies share one infrastructure, each with its data isolated.
- **Custom permissions:** administrators define their own roles and decide who can see and do what.
- **Real-time:** live updates over WebSockets; notifications and other jobs run in the background.
- **Maps and zones:** service areas, hub boundaries and address checks rely on geospatial data.
- **Scan validation:** QR scans and manifest checks stop parcels being handed to the wrong driver.
- **Security:** JWT sessions with refresh tokens, hashed passwords, optional two-factor login, trusted devices and server-side permission checks.

**Platform stack:** Next.js · TypeScript · NestJS · Node.js · Socket.IO · PostgreSQL + PostGIS ·
Redis · Drizzle ORM · BullMQ · Flutter (Android & iOS)

*Our part: the Next.js / TypeScript web platform. The backend and driver app were built by the wider team.*

### What we delivered
- Admin dashboard implementation and refinement
- Corporate client dashboard implementation and refinement
- Order management and tracking interfaces
- Role-specific navigation and screens
- Clear presentation of operational data
- Feature updates as the business requirements evolved
- One consistent experience across admin and client interfaces

### The result
Logistics processes that used to be separate now run in one place:

- Courier operations managed centrally
- Clear shipment visibility and traceability
- Accountable, verified handoffs
- Corporate clients who serve themselves
- Structured driver and dispatch workflows
- Coordinated deliveries across service areas
- Consistent records and proof of delivery

> “Enterprise software isn't only about features. It means understanding how a business really
> operates and building systems that make that work clearer, more transparent and ready to scale.”
> — ZeeTech

---

## Visuals

No screenshots exist, so these are **illustrations** drawn from the feature list (flat style,
placeholder bars instead of real data). They are not screenshots of the real product.

| File (`legacy/assets/work/nexus-courier/`) | Used as | Shows |
|---|---|---|
| `cover.webp` (2400×1500) | Cover | Admin overview + tracking timeline + QR label. Key content kept in the centre so the wide hero, 16:10 card and 4:3 phone crops all work |
| `admin.webp` (2400×1350) | Gallery 1 | Admin dashboard: KPIs, recent orders, deliveries chart, live map |
| `client.webp` (2400×1350) | Gallery 2 | Client dashboard: new delivery request (Route / Rush / Round Trip), QR label, public tracking |
| `tracking.webp` (2400×1350) | Gallery 3 | Service-area map with route + hub, chain-of-custody timeline, proof of delivery |
| `hubs.webp` (2400×1350) | Gallery 4 | Hub-and-spoke sorting: destination buckets, delivery runs, manifest checks, driver transfers |

Source: [nexus-courier-visuals.html](nexus-courier-visuals.html). Open it as
`nexus-courier-visuals.html#cover|1200|750` (or `admin|1200|675` …) and screenshot at 2× to re-render.
If real screenshots turn up later, swap them in via the admin (Case studies → Nexus Courier).

---

## Draft client quote (only for the client to approve; never publish unapproved)

Send to the client; publish only their approved wording, under their name and role.

> “ZeeTech turned a very complex set of courier operations into dashboards our admins and
> corporate clients could pick up quickly. They understood the workflows behind the screens and
> kept refining the platform as our requirements changed.”
> — *[Name], [Role], Nexus Courier*

Once approved: admin → Testimonials → new (written, source "Directly to ZeeTech"), then link it in
the case study's *Testimonial* field.

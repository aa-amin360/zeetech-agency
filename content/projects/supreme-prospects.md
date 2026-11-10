# Supreme Prospects: site-ready case study copy

Source: owner's write-up (received 2026-11-10). Rewritten in the agency's voice ("we" / ZeeTech).
Changes from the source: the outcome "Eliminated compliance violations" became "built to prevent"
(an outcome we can't prove publicly); otherwise the scope is as described.

**Decisions:** name "Supreme Prospects" ✅ · duration not shown ✅ · live status not shown ✅ ·
illustrations instead of screenshots ✅ · shown as Project 02.

`scripts/add-supreme-calliana.ts` reads the **Story** section of this file. Once the case study
exists, later edits go in the admin.

---

## Card & page fields (admin → Case studies)

| Field | Value |
|---|---|
| Title | Supreme Prospects — |
| Title accent (orange line) | Athletic Recruitment Platform |
| Client | Supreme Prospects |
| Service (1st tag) | Platform architecture & development |
| Industry (2nd tag, filter) | Sports Tech |
| Duration | *(not shown)* |
| Status | *(not shown)* |
| Chips | Multi-tenant SaaS · 6 role portals · Compliance engine · Talent scoring · Next.js |
| Card colour | `#22c55e` |
| Summary (card + Google) | A multi-tenant recruitment platform for athletes, parents, scouts, coaches and compliance staff, with recruiting rules built into every message. |
| SEO title | Supreme Prospects: athletic recruitment platform case study \| ZeeTech |
| SEO description | How ZeeTech built a multi-tenant recruitment platform with six role portals, a talent scoring engine and recruiting-compliance rules built into messaging. |

---

## Story (admin → Case study story)

### About the project
Supreme Prospects is a recruitment and talent-evaluation platform for the jump from high-school to
college sport. It brings athletes, parents, field scouts, college coaching staff and compliance
directors into one real-time system, with a single source of truth for every prospect.

**Our role:** platform architecture and full-stack development: the role-based portals, the
compliance and messaging engine, the scoring pipeline and the field-grading tools.

The hardest part wasn't the features. It was building recruiting regulations (student-privacy
rules, protections for minors and seasonal contact restrictions) into the communication and
scouting workflows themselves.

### The problem
College scouting is fragmented and heavily regulated:

- **Scattered stakeholders.** Athletes, coaches, evaluators and athletic directors worked across paper forms, separate spreadsheets and loose video links.
- **Strict contact rules.** When recruiters may contact minor athletes is limited by seasonal dead periods, contact limits and academic privacy law.
- **Very different jobs.** A scout grading on a phone at a combine and a compliance director auditing on a desktop need different tools, working on the same data.

### The solution
**Six portals, one platform**
- Separate portals for Athlete, Parent/Guardian, College Coach, Institution/Compliance, Field Scout and System Admin
- Token-based authentication (JWT) with granular access policies per role
- One shared design system: navigation, permissions and theme adapt to whoever is signed in

**Compliance built into messaging**
- A calendar-driven rules engine pauses direct recruiter-to-athlete messaging during dead periods
- Three-way messaging: parents automatically see conversations with minor athletes
- Age checks and an encrypted vault for academic records
- An audit trail of coach enquiries, campus visits and recruiting status, ready to export for compliance reviews

**One talent score**
- A pipeline that combines rankings from several sources, combine measurements and game performance into a single 0–1.0 rating with tiers
- Search filters, shortlists and comparison heat-maps that update in real time

**Grading forms that adapt**
- Evaluation rubrics defined as data, not hard-coded, rendering the right form for 15+ sports and each playing position
- Mobile controls built for the field: steppers, weighted sliders, benchmark markers and offline sync

**Plans and limits**
- Clean separation between standard and enterprise features: HD video storage and chapters, predictive fit scoring and depth-chart planning

### Under the hood
- **Frontend:** React / Next.js, TypeScript, design tokens, mobile-first PWA, WCAG 2.1 AA accessibility
- **Backend:** Node.js, PostgreSQL, REST and GraphQL APIs, encrypted document storage
- **Patterns:** event-driven state machines for the compliance calendar, schema-driven forms, multi-tenant permission layers, offline-first sync for mobile input

### The result
- Restricted-period contact is blocked by the product itself, not left to someone remembering the calendar
- Recruiting moved from scattered offline channels into one transparent, auditable pipeline
- New sports, rule sets and departments can be added through configuration rather than new code

> “Compliance shouldn't depend on someone remembering the calendar, so we built the rules into the product.” — ZeeTech

---

## Visuals

Illustrations drawn from the feature list (not screenshots), in `legacy/assets/work/supreme-prospects/`:

| File | Used as | Shows |
|---|---|---|
| `cover.webp` | Cover | Prospect profile with talent score, scouting board, dead-period message lock, field-grading phone |
| `search.webp` | Gallery 1 | Talent search: filters, tiered prospect list, comparison heat-map |
| `compliance.webp` | Gallery 2 | Compliance calendar with dead period, three-way messaging with parent, audit log |
| `grading.webp` | Gallery 3 | Mobile field grading: position rubric, weighted sliders, offline sync |
| `portals.webp` | Gallery 4 | The six role portals on one design system |

Source: [project-visuals.html](project-visuals.html) (`#sp-cover|1200|750`, `#sp-search|1200|675`, …).

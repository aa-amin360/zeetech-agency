# ZeeTech website: project tracker

What the site has, what is still dummy, what is missing, and what changed. Update it with
every change: tick the box, add a line to the **Change log** at the bottom.

- **Audit date:** 2026-11-09 (commit `7486de2`)
- **Figma:** https://www.figma.com/design/TvQWQEVYsK3sRZQhVuBxQ6/Agency-Website (page *Final Web Design*, `0:1`)
- **Stack:** Next.js 16 + Payload CMS 3 + Postgres. Local dev: `npm run dev` → http://localhost:3000, admin at `/admin`. Test deploy: Vercel (see `DEPLOY-VERCEL.md`)
- **Where content lives:** in the database, edited in `/admin`. The files in `scripts/*.data.ts` and `scripts/seed.ts` only hold the *starting* content. Changing them does not change a site that already has content, so real content goes in through the admin, or through a new one-off script added to `scripts/deploy-steps.mjs` for Vercel.

**Status key:** ⬜ to do · 🟡 in progress / waiting on info · ✅ done

---

## 1. Inputs needed from the owner

Nothing in sections 3–4 can be finished without these.

| # | Item | Status | Notes |
|---|---|---|---|
| I-1 | Real project details (2–3 projects): client, title, what was built, problem, solution, result, duration, services, industry, live link | 🟡 | The user has these. Send them over |
| I-2 | Project images (the messy ones) | 🟡 | Will need cropping/cleanup into a cover (≈1664×640 hero, 16:10 card) and gallery images |
| I-3 | The owner's list of corrections | 🟡 | Not received yet. Add each one to section 5 when it arrives |
| I-4 | Real numbers for the stats (countries, projects, retention, years) or a decision to remove them | ⬜ | Currently fake, see D-4 |
| I-5 | Real client logos, with permission to show them | ⬜ | Current 13 logos are from the template, see D-3 |
| I-6 | Real testimonials (name, role, company, quote, photo, platform) | ⬜ | Current ones are invented, see D-5 |
| I-7 | Real Fiverr/Upwork rating and badges, if the agency has them | ⬜ | See D-4 |
| I-8 | Business email and domain (is `hello@zeetech.studio` real?) | ⬜ | Used in footer, contact strip, SEO data |
| I-9 | Social profile links (Facebook, X, Instagram, LinkedIn) | ⬜ | All empty, so the icons do nothing |
| I-10 | Owner's photo / name / title confirmation ("Amit Ghosh, COO & Co-founder") | ⬜ | The photo is a stock/template image, and "COO & Co-founder" may not fit a one-person agency |
| I-11 | Team / studio photos, or a decision to keep stock photos | ⬜ | About, Contact and Careers all use stock team photos |
| I-12 | Showreel video for "Why ZeeTech" (optional) | ⬜ | The reel is set to *none* |
| I-13 | Terms of Use and Privacy Policy text | ⬜ | See M-1 |
| I-14 | Tracking IDs (GTM / GA4 / Meta Pixel / LinkedIn / Search Console) | ⬜ | All empty. Needed to measure ad campaigns |
| I-15 | Keep the Careers page? Hiring isn't the goal and the developers are freelancers | ⬜ | Could become "Work with us (freelancers)" or be hidden |
| I-16 | The client who wants to "promote" via this site: what do they need? (a case study, a landing page, a link?) | ⬜ | Affects whether we build a campaign page (`/<slug>`) |

---

## 2. Page inventory: built vs Figma

| Page | URL | Figma frame | Built? | Matches latest design? |
|---|---|---|---|---|
| Home | `/` | Landing Page `140:2036` | ✅ | ✅ (11 sections + FAQ + inquiry) |
| Our Work | `/work` | Work Page `599:812` | ✅ | ✅ |
| Case study | `/work/<slug>` | Work Details `558:1630` | ✅ partly | ⚠️ hero only, see M-3 |
| Services | `/services` | Services `638:2111` | ✅ | ✅ |
| Services menu (header dropdown) | n/a | `638:2629` | ✅ | ✅ |
| Service detail ×6 | `/services/<slug>` | `688:1996` → `688:2001` | ✅ | ✅ |
| Service detail: Cybersecurity & Blockchain | `/services/cybersecurity-blockchain` | **none** | ✅ | n/a, built by following the other service pages |
| About | `/about` | **newer:** `1069:3616` · built from older `721:2419` | ✅ | ❌ see M-4 |
| Careers | `/careers` | **newer:** `1069:3919` · built from older `721:2420` | ✅ | ❌ see M-5 |
| Contact | `/contact` | `753:2877` | ✅ | ✅ |
| 404 | any bad URL | none | ✅ | n/a |
| Client feedback form | `/feedback/<token>` | none | ✅ | n/a |
| Terms of Use | none | none | ❌ | n/a, see M-1 |
| Privacy Policy | none | none | ❌ | n/a, see M-1 |

All built pages return 200, typecheck passes (`npx tsc --noEmit`).

---

## 3. Dummy / placeholder content to replace

Grouped by page. "Admin" = where it is edited in `/admin`.

### Site-wide
| # | Item | Where it shows | Admin | Status |
|---|---|---|---|---|
| D-1 | `hello@zeetech.studio`, "Dhaka, Bangladesh", "Working worldwide" | Footer, Site settings, Organisation SEO data | Site → Footer, Site → Site settings | ⬜ confirm (I-8) |
| D-2 | Copyright "© All the rights reserved to @ZeeTech" (awkward wording) | Footer | Site → Footer → Bottom | ⬜ e.g. "© 2026 ZeeTech. All rights reserved." |
| D-2b | Default share image = template laptop mockup | Link previews (WhatsApp, LinkedIn…) | Site settings → SEO defaults | ⬜ |

### Home (`/`)
| # | Item | Status |
|---|---|---|
| D-3 | **Client logos:** 13 template brands (Al Rajhi Takaful, Pentair, Telr, RAK Properties…) and title "Trusted by 40+ of the world's top brands". These are **not** real clients, and showing them is a credibility and legal risk | ⬜ replace with real logos (I-5) or remove the section |
| D-3b | Hero trust line "Trusted by **40+** product teams worldwide" + 3 stock avatars | ⬜ |
| D-4 | **Proof stats:** 150+ countries, 14+ projects, 98% retention, 5+ years, each with a visible note **"Metric pending verification"** on the live page. Also rating 4.9 Fiverr, "Top product design agency 2025" (Fiverr), "Top design agency" (Upwork) badges | ⬜ real numbers or remove (I-4, I-7) |
| D-5 | **Testimonials:** "Andrew Baker, ARHQ" (featured) and "Marcus Vance, FleetPulse Logistics" (×2, the same quote twice) are invented | ⬜ (I-6) |
| D-6 | **Selected work:** shows the 6 template case studies, with the visible note **"Sample cases — client names pending approval"** | ⬜ real projects, remove the note |
| D-7 | Collage + showreel images: template mockups (reel-1…4, principle images) | ⬜ swap for real project shots when available |
| D-8 | Inquiry card person: "Amit Ghosh, COO & Co-founder" with a stock photo | ⬜ (I-10) |
| D-9 | Inquiry budget options include an **overlap**: "$5k - $20k" *and* "$10k - $20k" | ⬜ fix to e.g. <$5k / $5k–$10k / $10k–$20k / $20k–$50k / $50k+ |
| D-10 | Copy typos in Delivery Principles card 03: "we build UI implementation, **aPIs**…" (lowercase start, "aPIs") | ⬜ |
| D-11 | How We Build: stage "Frontend Development" lists the same deliverables as Backend ("API layer, Database, AI workflows"); stages 4–6 use identical tool icons | ⬜ |
| D-12 | Comparison table and FAQ: generic but usable copy. Review with owner | ⬜ |

### Our Work (`/work`) + case studies (`/work/<slug>`)
| # | Item | Status |
|---|---|---|
| D-13 | 6 template projects: Landify, UnifyIQ, Klyro Studio, Crimino, ZapMail, Astrix Builders. ~~Covers were unrelated Figma template images~~ → each now has an illustrated cover matching its description (2026-11-09, `scripts/update-project-covers.ts`). The projects themselves are still not real work | 🟡 covers done; still replace with real projects (I-1, I-2) and delete the rest |
| D-14 | Every case study page is just cover + title + summary: **no story, no gallery, no duration, no testimonial** (checked in the database) | ⬜ |
| D-15 | Industry filter buttons are generated from projects. With 2–3 projects the filter row may look thin; consider hiding it when there are < 4 projects | ⬜ |
| D-16 | Work page meta description mentions "Webflow sites and brand identities" (template wording) | ⬜ |

### Services (`/services`, `/services/<slug>`)
| # | Item | Status |
|---|---|---|
| D-17 | Copy is solid generic agency copy; confirm the owner actually offers all 7 services (esp. **Cybersecurity & Blockchain**, which has no Figma design) | ⬜ |
| D-18 | UI/UX design service hero reuses its row image (the Figma hero image couldn't be exported) | ⬜ |
| D-19 | Home "How we deliver" listed only 6 services (no Cybersecurity & Blockchain) | ✅ 2026-11-09: added as 07 / SECURITY + WEB3, linking to its service page; every discipline now shows key-feature chips (new *Key features* field per row, editable in admin) |

### About (`/about`)
| # | Item | Status |
|---|---|---|
| D-20 | Stock photos (team at whiteboard, "founder portrait", phone mockups) | ⬜ (I-10, I-11) |
| D-21 | Claims: "40+ product teams worldwide", "Senior designers and engineers…", "COO & Co-founder" | ⬜ confirm |

### Careers (`/careers`) and Contact (`/contact`)
| # | Item | Status |
|---|---|---|
| D-22 | Stock photos in careers hero and contact intro | ⬜ |
| D-23 | Careers form sends applications into **Inbox → Leads**, mixed with sales inquiries | ⬜ tag them or route separately |

---

## 4. Missing features / design gaps

| # | Item | Detail | Status |
|---|---|---|---|
| M-1 | **Terms of Use & Privacy Policy pages** | Footer links have no address. `/terms`, `/privacy` → 404. A privacy policy is needed anyway since the forms collect name/email/phone and tracking scripts can be turned on | ⬜ |
| M-2 | **Social links** | Footer icons have no URLs (I-9) | ⬜ |
| M-3 | **Case study page body (Figma `558:1630`)** | Design has a long structured story after the hero: *About the project → Problem → Solution → Challenge & Solution → Design process → Typography & colour system → User persona research → Mobile user flow → Grid & layout → Result → Related projects → Inquiry → Client endorsements*. Built page has only a free rich-text "story" + full-width gallery. Decide: (a) fill story + gallery per project in the admin (quick), or (b) build structured section blocks matching the design (closer to Figma). Real projects may not have all these sections, so pick based on what material we get | ⬜ |
| M-4 | **About page: newer design `1069:3616`** | Site follows the older `721:2419`. New design: editorial hero (text left + 3-photo collage right, "Thoughtful products *start with people.*", "Explore our approach" button) · **dark** "What we believe" band with 3 numbered values · **new** "From idea to product": 4 step cards (Understand / Plan / Design & build / Test & improve) · "How we work": photo + 3 numbered points · "Direct human partnership" · **project inquiry form** · **FAQ**. Drops: proof-points figures grid, core values grid, contact band | ⬜ confirm with owner which version is final |
| M-5 | **Careers page: newer design `1069:3919`** | Site follows older `721:2420`. New design: hero with text left + pill collage right (built has collage below the text) · "The way we work" as a **dark** band (built is light/warm cards) · area cards with **"Explore service"** buttons linking to the matching service page ("Each one links to the related service page"); built says "Share interest" → form · ends with **FAQ**, no application form | ⬜ confirm |
| M-6 | **Lead notifications** | Locally `NOTIFY_EMAIL` and `SMTP_HOST` are empty, so new leads are only saved in the admin and nobody gets an email. **Check the Vercel env vars**; for a sales site this matters most | ⬜ |
| M-7 | **Tracking** | No GTM/GA4/Pixel IDs (I-14). If used for EU/UK visitors, add a cookie banner | ⬜ |
| M-8 | **Production domain** | `NEXT_PUBLIC_SERVER_URL` must be the real domain on Vercel/VPS (used for canonical URLs, sitemap, share links, feedback links) | ⬜ |
| M-9 | **Favicon / app icons** | Only an SVG icon (`/brand/mark-z-orange.svg`). Add PNG/ICO + apple-touch-icon for iOS and older browsers | ⬜ |
| M-10 | **Per-page share images** | Pages fall back to the template laptop image | ⬜ |
| M-11 | Optional: WhatsApp contact | The form already asks for a WhatsApp number. A floating WhatsApp button could help a one-man sales operation | ⬜ idea |

---

## 5. Owner's corrections

Add each correction from the owner here as it arrives.

| # | Correction (owner's words) | Page / section | Status | Done in commit |
|---|---|---|---|---|
| C-1 | *(waiting for list, I-3)* | | 🟡 | |

---

## 6. Real projects

One block per project when details arrive (I-1, I-2).

| # | Project | Client | Details received | Images cleaned | Case study published | Notes |
|---|---|---|---|---|---|---|
| P-1 | Nexus Courier: Logistics Operations Platform (`/work/nexus-courier-logistics-platform`) | Nexus Courier ✅ name OK | ✅ 2026-11-09 | 🟡 no real images; **5 illustrations** made instead (cover + 4 gallery) in `legacy/assets/work/nexus-courier/` | ✅ **published** as Project 01 (first on Work page + home Selected work) | Copy: [content/projects/nexus-courier.md](content/projects/nexus-courier.md); script: `scripts/add-nexus-courier.ts` (`npm run nexus-courier`). Duration 6 months; live status deliberately not shown. Written as "we", with scope kept to the web platform. **No invented client quote:** a ZeeTech pull-quote closes the story; a draft quote for the client to approve is in the copy file. To do: swap illustrations for real screenshots if any appear; add approved client quote |
| P-2 | Supreme Prospects: Athletic Recruitment Platform (`/work/supreme-prospects-athletic-recruitment-platform`) | Supreme Prospects | ✅ 2026-11-10 | 🟡 no real images; 5 illustrations in `legacy/assets/work/supreme-prospects/` | ✅ published as Project 02 | Copy: [content/projects/supreme-prospects.md](content/projects/supreme-prospects.md). No duration or status shown (owner). The source's "eliminated compliance violations" was softened to "built to prevent" (not provable publicly) |
| P-3 | Calliana: Virtual Receptionist Call Platform (`/work/calliana-virtual-receptionist-call-platform`) | Calliana | ✅ 2026-11-10 (from the internal scope PDF + owner's status) | ✅ **real product screens** from the owner (2026-11-10): logo banner cover + 6 framed screens in `legacy/assets/work/calliana/` | ✅ published as Project 03 | Copy: [content/projects/calliana.md](content/projects/calliana.md). Duration 3 months. **Not finished yet:** design + frontend done, backend mostly done, some third-party integrations not connected. The page says so under "Where it stands" and claims no results. Kept out of the public copy: client owner's name, Fiverr, pricing, phase plan, softphone product/version. Owner confirmed (2026-11-10): screens are dummy data exported from Figma, client is happy for them to be shown, "Zoiper Connected" is fine. **Update the page when it launches** |

Real projects so far: Nexus Courier (01), Supreme Prospects (02), Calliana (03). When all real projects are live: delete the 6 template case studies (D-13) and remove the "Sample cases" note (D-6).

---

## 7. Notes for whoever works on this next

- **Content scripts vs admin.** `seed.ts` only runs on an empty DB. For changes that must reach the live (Vercel) DB, write an idempotent script and add it to `SCRIPTS` in `scripts/deploy-steps.mjs`; it runs once per database on the next deploy. Small text edits are easier in `/admin` directly.
- **Images** go into Media in the admin; they are converted to WebP automatically. Set the focal point so crops look right.
- Local screenshots with headless Chrome come out blank on Home/About because sections fade in on scroll. That's expected, not a bug.
- `legacy/` is the original static build; the seed and page scripts take their images from `legacy/assets`.

---

## Change log

| Date | Change | By |
|---|---|---|
| 2026-11-09 | Initial audit: codebase, database content, Figma file; created this tracker | Claude |
| 2026-11-09 | P-1 Nexus Courier details received (no images); site-ready copy written to `content/projects/nexus-courier.md` | Claude |
| 2026-11-09 | P-1: owner decisions (name OK, 6 months, no live status, no fake quote). Made 5 illustrations; added `scripts/add-nexus-courier.ts` (+ `npm run nexus-courier`, + Vercel deploy step) which creates the case study as a **draft**. Ran locally and checked the rendered page | Claude |
| 2026-11-09 | P-1 made live as **Project 01**: script now publishes it, puts it first in the project order and renumbers the template projects 02–07. Deployed via push to main | Claude |
| 2026-11-09 | D-13: new covers for the 6 template projects that match each project (real-estate dashboard, sales SaaS site, dark agency site, CRM, cold-email platform, construction brand board). Files `legacy/assets/work/*-cover.webp`, source `content/projects/template-covers.html`, script `npm run project-covers` (+ Vercel deploy step); starter data points at the new files. Deployed via push to main | Claude |
| 2026-11-09 | D-19: home "How we deliver" gets Cybersecurity & Blockchain (7th row) + new *Key features* chips on every row (field in `sections/home/07-how-we-deliver`; no migration needed: pages already store hasMany text in `pages_texts`). Content via `scripts/add-home-cyber-service.ts` (`npm run home-services` + Vercel deploy step). Subtitle now says "test rigorously, secure and deploy". Deployed via push to main | Claude |
| 2026-11-10 | P-2 Supreme Prospects and P-3 Calliana added and published as Projects 02 and 03 (template projects renumbered 04–09). 10 illustrations (source `content/projects/project-visuals.html`); shared helper `scripts/case-study-create.ts`; `scripts/add-supreme-calliana.ts` (`npm run supreme-calliana` + Vercel deploy step). Deployed via push to main | Claude |
| 2026-11-10 | P-3 Calliana: illustrations replaced by the real product screens the owner shared (logo banner cover; sign-in, agent dashboard, live call workspace, client portal, admin overview, light/dark). Owner wants this realistic style for every project: needs real screenshots for Nexus Courier and Supreme Prospects. Deployed via push to main | Claude |

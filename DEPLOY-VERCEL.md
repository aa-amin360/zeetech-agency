# Deploying to Vercel (test environment)

The same code runs on Vercel and on the VPS. On Vercel it uses:

| Need | Vercel | VPS |
|---|---|---|
| Database | **Neon Postgres** (Vercel Marketplace) | Postgres in Docker |
| Uploaded files | **Vercel Blob** | `./media` folder on the server |
| Large uploads (admin + client videos) | sent straight from the browser to Blob | sent through the server |

Nothing needs to change in the code to switch — only the environment variables.

---

## 1. Put the code on GitHub

Vercel deploys from a Git repository.

```bash
git init
git add .
git commit -m "ZeeTech website"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/zeetech-web.git
git push -u origin main
```

(`.gitignore` already keeps out `.env`, `node_modules`, `media` and the local database.)

## 2. Create the Vercel project

1. vercel.com → **Add New… → Project** → import the GitHub repo. Framework: **Next.js** (detected).
   Don't deploy yet — first add storage and settings (steps 3–4). If it deploys anyway and fails, that's fine.
2. **Storage → Create → Neon (Postgres)** → region **Singapore (ap-southeast-1)** → connect it to the project.
   This adds `DATABASE_URL` automatically.
3. **Storage → Create → Blob** → connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.

The project is set to run in Singapore (`vercel.json` → `sin1`), next to the database.

## 3. Environment variables

Project → **Settings → Environment Variables** (Production + Preview):

| Name | Value |
|---|---|
| `PAYLOAD_SECRET` | a long random string — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SERVER_URL` | the site address, e.g. `https://zeetech-web.vercel.app` (no trailing slash) |
| `NOTIFY_EMAIL` | where lead / feedback notifications go |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_ADDRESS`, `SMTP_FROM_NAME` | optional — without them nothing is emailed, but everything is still saved in the admin |
| `FEEDBACK_MAX_VIDEO_MB` | optional, default `150` |

`DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are already there from step 2.

## 4. Load the content (once, from your computer)

This creates the tables and copies the current site content and images into Neon + Blob.

```bash
npm i -g vercel
vercel link                                   # pick the project
vercel env pull .env.production.local         # downloads the Vercel settings (kept out of Git)
npm run vercel:setup                          # migrate + seed, using those settings
```

Optionally create the admin at the same time:

```powershell
# PowerShell
$env:SEED_ADMIN_EMAIL="you@example.com"; $env:SEED_ADMIN_PASSWORD="a-strong-password"; npm run vercel:setup
```

Otherwise open `/admin` after deploying — it asks you to create the first user.

> While `.env.production.local` exists, `npm run build` / `npm run start` on your computer also use the
> Vercel database. Delete the file when you're done (`npm run dev` is not affected).

## 5. Deploy

Vercel → **Deployments → Redeploy** (or push a commit). The build runs
`npm run vercel-build`, which applies any new database migrations and then builds the site.

Every push to `main` deploys to production; other branches get their own preview URL.

## 6. What to test on Vercel

- [ ] Home page, `/work`, a case study page, 404 page, `/sitemap.xml`, `/robots.txt`
- [ ] Phone, tablet and desktop layouts
- [ ] `/admin`: edit a section → Publish → the change is live on reload
- [ ] Live preview of a page draft
- [ ] Upload an image in **Media** (goes to Blob)
- [ ] Inquiry form → appears in **Inbox → Leads** (with UTM data if you add `?utm_source=test` to the URL)
- [ ] **Feedback requests** → create one → open the private link on a phone → send written feedback, then a
      new link with a recorded video → both arrive as draft testimonials; publish one and check the slider
- [ ] Site settings → Tracking: add a GTM / GA4 ID and check it loads

## Notes

- The rate limit on the forms is per server instance; on Vercel it is looser than on the VPS. Add
  Vercel's firewall rate-limit rules if spam appears.
- Client video uploads are stored in Blob and linked from the testimonial. For long videos, Bunny Stream
  or YouTube is still the better home (see README).
- Moving to the VPS later: follow the README's VPS section. Content can be moved with `pg_dump` from Neon
  → `pg_restore` on the VPS; Blob files stay reachable at their URLs, or can be re-uploaded.

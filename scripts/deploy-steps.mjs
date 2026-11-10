/* Deploy steps that run on Vercel during the build (see "vercel-build" in package.json).
 * They use the live settings Vercel already has, so nothing secret is needed on your computer.
 *
 *   node scripts/deploy-steps.mjs prepare   — before `payload migrate`
 *   node scripts/deploy-steps.mjs content   — after it, before `next build`
 *
 * prepare: removes Payload's "pushed in dev mode" marker. While it is there `payload migrate`
 *          waits for a yes/no answer that nobody can give on Vercel and quietly skips migrating.
 *          (The migrations skip whatever already exists, so removing it is safe.)
 * content: runs each content script below once per database, in order, and remembers which ones
 *          have run (table deploy_content_runs), so later deploys never repeat them and never
 *          bring back something you removed in the admin. A failing script fails the build and the
 *          previous deployment stays live.
 *
 * To add new starting content to the live site: write an idempotent script, add it to SCRIPTS,
 * push. To run one again, delete its row from deploy_content_runs.
 */
import { spawnSync } from 'node:child_process'
import pg from 'pg'

const SCRIPTS = [
  'scripts/add-work-page.ts',
  'scripts/add-services-page.ts',
  'scripts/add-about-page.ts',
  'scripts/add-contact-careers.ts',
  'scripts/update-content.ts', // after the pages above: they copy the inquiry section from Home
  'scripts/add-cybersecurity-blockchain.ts',
  'scripts/add-nexus-courier.ts', // first real project: published as Project 01
  'scripts/update-project-covers.ts', // starter projects get covers that match them
  'scripts/add-home-cyber-service.ts', // home: 7th discipline + key-feature chips
  'scripts/add-supreme-calliana.ts', // real projects 02 and 03
]

const step = process.argv[2]
const url = process.env.DATABASE_URL
if (!url) {
  console.log('[deploy] DATABASE_URL is not set; skipping', step)
  process.exit(0)
}

const db = new pg.Client({ connectionString: url })
await db.connect()
const tableExists = async (name) =>
  (await db.query('SELECT to_regclass($1) IS NOT NULL AS ok', [`public.${name}`])).rows[0].ok

try {
  if (step === 'prepare') {
    if (await tableExists('payload_migrations')) {
      const { rowCount } = await db.query('DELETE FROM payload_migrations WHERE batch = -1')
      console.log(rowCount ? '[deploy] Removed the dev-mode marker.' : '[deploy] No dev-mode marker.')
    } else console.log('[deploy] New database; nothing to prepare.')
  } else if (step === 'content') {
    // a database set up from scratch gets everything from the seed instead
    const { rows } = await db.query("SELECT count(*)::int AS n FROM pages WHERE slug = 'home'")
    await db.query('CREATE TABLE IF NOT EXISTS deploy_content_runs (name text PRIMARY KEY, ran_at timestamptz NOT NULL DEFAULT now())')
    if (!rows[0].n) {
      console.log('[deploy] No home page yet (run the seed first); skipping content scripts.')
    } else {
      const done = new Set((await db.query('SELECT name FROM deploy_content_runs')).rows.map((r) => r.name))
      for (const script of SCRIPTS) {
        if (done.has(script)) {
          console.log(`[deploy] ${script}: already ran`)
          continue
        }
        console.log(`[deploy] ${script}: running`)
        const r = spawnSync('npx', ['payload', 'run', script], {
          stdio: 'inherit',
          shell: true,
          env: { ...process.env, NODE_ENV: 'production', NODE_OPTIONS: '--no-deprecation' },
        })
        if (r.status !== 0) throw new Error(`${script} failed (exit ${r.status})`)
        await db.query('INSERT INTO deploy_content_runs (name) VALUES ($1) ON CONFLICT DO NOTHING', [script])
      }
    }
  } else {
    throw new Error(`unknown step "${step}" (use prepare or content)`)
  }
} catch (e) {
  console.error('[deploy]', e.message)
  process.exitCode = 1
} finally {
  await db.end()
}

// Local Postgres for development — no Docker or system install needed.
// Runs on 127.0.0.1:5433 and keeps its data in ./.dev-db.
//   node scripts/dev-db.mjs   → run it on its own (Ctrl+C to stop)
//   npm run dev               → started automatically together with Next.js
import EmbeddedPostgres from 'embedded-postgres'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const portInUse = (port) =>
  new Promise((resolve) => {
    const s = net.connect(port, '127.0.0.1')
    s.once('connect', () => {
      s.destroy()
      resolve(true)
    })
    s.once('error', () => resolve(false))
  })

export async function startDevDb({ quiet = false } = {}) {
  const dataDir = path.resolve('.dev-db')
  const firstRun = !fs.existsSync(path.join(dataDir, 'PG_VERSION'))

  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: 'postgres',
    password: 'postgres',
    port: 5433,
    persistent: true,
    // UTF-8 like the production server (the Windows default code page can't store “ → é …)
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
    onLog: quiet ? () => {} : console.log,
    onError: console.error,
  })

  if (firstRun) await pg.initialise()
  // a lock file left by a Postgres that was force-closed blocks the next start
  const lock = path.join(dataDir, 'postmaster.pid')
  if (fs.existsSync(lock) && !(await portInUse(5433))) fs.rmSync(lock)
  await pg.start()

  const client = pg.getPgClient()
  await client.connect()
  const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = 'zeetech'")
  if (!rowCount) await client.query("CREATE DATABASE zeetech ENCODING 'UTF8' TEMPLATE template0")
  await client.end()

  return pg
}

// run directly
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pg = await startDevDb()
  console.log('Postgres ready → postgresql://postgres:postgres@127.0.0.1:5433/zeetech  (Ctrl+C to stop)')
  const stop = async () => {
    await pg.stop()
    process.exit(0)
  }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
  setInterval(() => {}, 1 << 30)
}

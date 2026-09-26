// `npm run dev` — starts the local database (if the site uses it and it isn't
// running yet), then Next.js on port 3000. Ctrl+C stops both.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'

if (fs.existsSync('.env')) process.loadEnvFile('.env')

const PORT = Number(process.env.PORT || 3000)
const isOpen = (port) =>
  new Promise((resolve) => {
    const s = net.connect(port, '127.0.0.1')
    s.once('connect', () => {
      s.destroy()
      resolve(true)
    })
    s.once('error', () => resolve(false))
  })

if (await isOpen(PORT)) {
  console.error(
    `\n✖ Port ${PORT} is already in use — another dev server is probably still running.\n` +
      `  Close that terminal (or run: npx kill-port ${PORT}) and start again.\n`,
  )
  process.exit(1)
}

// start the embedded Postgres when DATABASE_URL points at it
let db = null
const dbUrl = (() => {
  try {
    return new URL(process.env.DATABASE_URL || '')
  } catch {
    return null
  }
})()
const usesLocalDb = dbUrl && ['127.0.0.1', 'localhost'].includes(dbUrl.hostname) && dbUrl.port === '5433'
if (usesLocalDb && !(await isOpen(5433))) {
  process.stdout.write('Starting the local database… ')
  const { startDevDb } = await import('./dev-db.mjs')
  db = await startDevDb({ quiet: true })
  console.log('ready.')
} else if (!dbUrl) {
  console.error('\n✖ DATABASE_URL is missing. Copy .env.example to .env and fill it in.\n')
  process.exit(1)
}

const next = spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'dev', '-p', String(PORT)], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --no-deprecation`.trim() },
})

let stopping = false
const stop = async (code = 0) => {
  if (stopping) return
  stopping = true
  if (!next.killed) next.kill()
  if (db) {
    process.stdout.write('\nStopping the local database… ')
    await db.stop().catch(() => {})
    console.log('done.')
  }
  process.exit(code)
}
process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
next.on('exit', (code) => stop(code ?? 0))

// Development only: empties the local database and uploaded files so `npm run seed` starts clean.
import fs from 'node:fs'
import pg from 'pg'

if (process.env.NODE_ENV === 'production') throw new Error('Refusing to reset a production database.')
const url = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5433/zeetech'
if (!/127\.0\.0\.1|localhost/.test(url)) throw new Error(`Refusing to reset a non-local database: ${url}`)

const client = new pg.Client({ connectionString: url })
await client.connect()
await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
await client.end()
fs.rmSync('media', { recursive: true, force: true })
console.log('Local database and media folder emptied.')

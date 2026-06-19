import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// DATA_DIR env var lets Railway volume persist the SQLite file across deploys
const dataDir = process.env.DATA_DIR || __dirname
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const dbPath = path.join(dataDir, 'pharmaconnect.db')

const isNew = !fs.existsSync(dbPath)
export const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
db.exec(schema)

// Safe migrations for existing DBs — SQLite throws if column already exists, ignore that
const migrations = [
  'ALTER TABLE pharmacies ADD COLUMN hours TEXT',
  'ALTER TABLE pharmacies ADD COLUMN review_count INTEGER NOT NULL DEFAULT 0',
]
for (const sql of migrations) {
  try { db.exec(sql) } catch { /* column already exists */ }
}

if (isNew) {
  const { seed } = await import('./seed.js')
  seed(db)
  console.log('Database created and seeded:', dbPath)
}

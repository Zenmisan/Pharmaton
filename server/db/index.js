import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'pharmaconnect.db')

const isNew = !fs.existsSync(dbPath)
export const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
db.exec(schema)

if (isNew) {
  const { seed } = await import('./seed.js')
  seed(db)
  console.log('Database created and seeded:', dbPath)
}

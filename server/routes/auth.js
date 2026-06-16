import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db/index.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function publicUser(u) {
  const { password_hash, ...rest } = u
  return rest
}

router.post('/signup', (req, res) => {
  const { email, password, name, role, orgName, location, licenseNumber } = req.body
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'email, password, name, role required' })
  }
  if (!['patient', 'pharmacist', 'hospital', 'supplier'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare(
    `INSERT INTO users (email,password_hash,name,role,org_name,location,license_number) VALUES (?,?,?,?,?,?,?)`
  ).run(email, hash, name, role, orgName || null, location || null, licenseNumber || null)

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: publicUser(user) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: publicUser(user) })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: publicUser(user) })
})

export default router

import express from 'express'
import { auth } from '../lib/firebase.js'
import { db } from '../db/index.js'

const router = express.Router()

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })

  // Dev-only: hardcoded demo tokens bypass Firebase entirely
  if (process.env.NODE_ENV !== 'production') {
    const demoMap = {
      'demo-patient':     'demo-uid-amara',
      'demo-pharmacist':  'demo-uid-grace',
    }
    if (demoMap[token]) {
      const user = db.prepare('SELECT id, role FROM users WHERE uid = ?').get(demoMap[token])
      if (user) {
        req.user = { id: user.id, role: user.role, uid: demoMap[token], email: 'demo' }
        return next()
      }
    }
  }

  let uid
  try {
    const decoded = await auth.verifyIdToken(token)
    uid = decoded.uid
  } catch (verifyErr) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Firebase token verification failed', verifyErr.message)
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    // Dev fallback: decode JWT payload without signature verification
    // Allows local dev without GOOGLE_APPLICATION_CREDENTIALS
    try {
      const raw = Buffer.from(token.split('.')[1], 'base64url').toString()
      const payload = JSON.parse(raw)
      uid = payload.sub || payload.user_id
      if (!uid) throw new Error('No uid in token')
      console.warn('[DEV] Firebase token unverified (no service account). Set GOOGLE_APPLICATION_CREDENTIALS for production.')
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }

  const user = db.prepare('SELECT id, role FROM users WHERE uid = ?').get(uid)
  if (!user) return res.status(401).json({ error: 'User not synced with local database' })

  req.user = { id: user.id, role: user.role, uid, email: '' }
  next()
}

function publicUser(u) {
  if (!u) return null
  const { password_hash, ...rest } = u
  return rest
}

router.post('/signup', async (req, res) => {
  const { uid, email, name, role, orgName, location, licenseNumber } = req.body
  if (!uid || !email || !name || !role) {
    return res.status(400).json({ error: 'uid, email, name, role required' })
  }
  if (!['patient', 'pharmacist', 'hospital', 'supplier'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }
  
  try {
    const existing = db.prepare('SELECT id FROM users WHERE uid = ? OR email = ?').get(uid, email)
    if (existing) {
      // If user exists, we just return it (sync case)
      return res.json({ user: publicUser(existing) })
    }

    const result = db.prepare(
      `INSERT INTO users (uid,email,password_hash,name,role,org_name,location,license_number) VALUES (?,?,'FIREBASE',?,?,?,?,?)`
    ).run(uid, email, name, role, orgName || null, location || null, licenseNumber || null)

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
    res.json({ user: publicUser(user) })
  } catch (e) {
    console.error('Signup sync failed', e)
    res.status(500).json({ error: 'Failed to sync user data' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE uid = ?').get(req.user.uid)
  if (!user) {
    return res.status(404).json({ error: 'User not found in local database' })
  }
  res.json({ user: publicUser(user) })
})

export default router

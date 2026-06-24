import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

// All admin routes require ADMIN_SECRET header
router.use((req, res, next) => {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return res.status(503).json({ error: 'ADMIN_SECRET not configured' })
  if (req.headers['x-admin-key'] !== secret) return res.status(403).json({ error: 'Forbidden' })
  next()
})

// GET /api/admin/pharmacists?status=pending
router.get('/pharmacists', (req, res) => {
  const { status } = req.query
  const rows = db.prepare(`
    SELECT u.id, u.name, u.email, u.org_name, u.location, u.license_number,
           u.pcn_status, u.pcn_notes, u.created_at,
           p.id AS pharmacy_id, p.nafdac_verified
    FROM users u
    LEFT JOIN pharmacies p ON p.owner_user_id = u.id
    WHERE u.role = 'pharmacist'
    ${status ? 'AND u.pcn_status = ?' : ''}
    ORDER BY u.created_at DESC
  `).all(...(status ? [status] : []))
  res.json({ pharmacists: rows })
})

// POST /api/admin/pharmacists/:id/verify
router.post('/pharmacists/:id/verify', (req, res) => {
  const { notes } = req.body
  const info = db.prepare(`
    UPDATE users SET pcn_status = 'verified', pcn_notes = ?
    WHERE id = ? AND role = 'pharmacist'
  `).run(notes || null, req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Pharmacist not found' })
  // Also mark their pharmacy as nafdac_verified
  db.prepare(`UPDATE pharmacies SET nafdac_verified = 1 WHERE owner_user_id = ?`).run(req.params.id)
  res.json({ ok: true, pcn_status: 'verified' })
})

// POST /api/admin/pharmacists/:id/reject
router.post('/pharmacists/:id/reject', (req, res) => {
  const { notes } = req.body
  const info = db.prepare(`
    UPDATE users SET pcn_status = 'rejected', pcn_notes = ?
    WHERE id = ? AND role = 'pharmacist'
  `).run(notes || 'PCN number could not be verified.', req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Pharmacist not found' })
  db.prepare(`UPDATE pharmacies SET nafdac_verified = 0 WHERE owner_user_id = ?`).run(req.params.id)
  res.json({ ok: true, pcn_status: 'rejected' })
})

// POST /api/admin/pharmacists/:id/reset
router.post('/pharmacists/:id/reset', (req, res) => {
  db.prepare(`UPDATE users SET pcn_status = 'pending', pcn_notes = NULL WHERE id = ? AND role = 'pharmacist'`).run(req.params.id)
  res.json({ ok: true, pcn_status: 'pending' })
})

export default router

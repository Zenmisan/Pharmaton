import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM supplier_requests WHERE supplier_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json({ requests: rows, pendingCount: rows.filter(r => r.status === 'pending').length })
})

router.patch('/:id', (req, res) => {
  const { status } = req.body
  if (!['accepted', 'declined', 'pending'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
  db.prepare('UPDATE supplier_requests SET status = ? WHERE id = ? AND supplier_id = ?').run(status, req.params.id, req.user.id)
  res.json({ request: db.prepare('SELECT * FROM supplier_requests WHERE id = ?').get(req.params.id) })
})

export default router

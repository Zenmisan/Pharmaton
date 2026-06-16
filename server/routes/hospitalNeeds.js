import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM hospital_needs WHERE hospital_id = ?').all(req.user.id)
  res.json({
    needs: rows,
    stats: {
      critical: rows.filter(r => r.priority === 'CRITICAL').length,
      total: rows.length,
    },
  })
})

router.patch('/:id', (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'status required' })
  db.prepare('UPDATE hospital_needs SET status = ? WHERE id = ? AND hospital_id = ?').run(status, req.params.id, req.user.id)
  res.json({ need: db.prepare('SELECT * FROM hospital_needs WHERE id = ?').get(req.params.id) })
})

router.post('/', (req, res) => {
  const { name, qty, priority } = req.body
  if (!name || !qty || !priority) return res.status(400).json({ error: 'name, qty, priority required' })
  const result = db.prepare('INSERT INTO hospital_needs (hospital_id,name,qty,priority,status) VALUES (?,?,?,?,?)')
    .run(req.user.id, name, qty, priority, 'Pending')
  res.json({ need: db.prepare('SELECT * FROM hospital_needs WHERE id = ?').get(result.lastInsertRowid) })
})

export default router

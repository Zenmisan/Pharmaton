import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM alerts ORDER BY created_at DESC').all()
  res.json({ alerts: rows })
})

router.post('/mark-all-read', (req, res) => {
  db.prepare('UPDATE alerts SET read = 1').run()
  res.json({ ok: true })
})

router.patch('/:id', (req, res) => {
  const { read } = req.body
  db.prepare('UPDATE alerts SET read = ? WHERE id = ?').run(read ? 1 : 0, req.params.id)
  res.json({ alert: db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id) })
})

export default router

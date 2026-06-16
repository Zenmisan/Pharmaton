import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  const { type } = req.query
  const rows = type
    ? db.prepare('SELECT * FROM pharmacies WHERE type = ?').all(type)
    : db.prepare('SELECT * FROM pharmacies').all()

  const withStatus = rows.map(p => {
    const items = db.prepare('SELECT status FROM inventory WHERE pharmacy_id = ?').all(p.id)
    let status = 'In Stock'
    if (items.length) {
      const outCount = items.filter(i => i.status === 'Out of Stock').length
      const lowCount = items.filter(i => i.status === 'Low Stock').length
      if (outCount > items.length / 2) status = 'Out of Stock'
      else if (lowCount > 0 || outCount > 0) status = 'Low Stock'
    }
    return { ...p, status }
  })

  res.json({ pharmacies: withStatus })
})

router.get('/:id', (req, res) => {
  const pharmacy = db.prepare('SELECT * FROM pharmacies WHERE id = ?').get(req.params.id)
  if (!pharmacy) return res.status(404).json({ error: 'Not found' })
  const inventory = db.prepare('SELECT * FROM inventory WHERE pharmacy_id = ?').all(pharmacy.id)
  res.json({ pharmacy, inventory })
})

export default router

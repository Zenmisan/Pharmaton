import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM supplier_requests WHERE supplier_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json({ requests: rows, pendingCount: rows.filter(r => r.status === 'pending').length })
})

router.post('/', (req, res) => {
  const { supplierId, medicine, qty, urgent } = req.body
  if (!supplierId || !medicine || !qty) return res.status(400).json({ error: 'supplierId, medicine, qty required' })
  
  // Get buyer info (from req.user)
  const buyer = db.prepare('SELECT id, name, org_name FROM users WHERE id = ?').get(req.user.id)
  const from_name = buyer?.org_name || buyer?.name || 'Unknown'

  const result = db.prepare(
    'INSERT INTO supplier_requests (supplier_id, buyer_id, from_name, medicine, qty, urgent) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(supplierId, req.user.id, from_name, medicine, qty, urgent ? 1 : 0)

  res.json({ request: db.prepare('SELECT * FROM supplier_requests WHERE id = ?').get(result.lastInsertRowid) })
})

router.patch('/:id', (req, res) => {
  const { status } = req.body
  if (!['accepted', 'declined', 'pending'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
  
  const request = db.prepare('SELECT * FROM supplier_requests WHERE id = ? AND supplier_id = ?').get(req.params.id, req.user.id)
  if (!request) return res.status(404).json({ error: 'Request not found' })

  db.prepare('UPDATE supplier_requests SET status = ? WHERE id = ?').run(status, req.params.id)

  if (status === 'accepted') {
    // Automatically create an order
    const order_code = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    db.prepare(
      'INSERT INTO orders (order_code, buyer_id, supplier_id, medicine, qty, status, eta, value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(order_code, request.buyer_id, req.user.id, request.medicine, request.qty, 'Confirmed', '2-3 days', 'TBD')
  }

  res.json({ request: db.prepare('SELECT * FROM supplier_requests WHERE id = ?').get(req.params.id) })
})

export default router

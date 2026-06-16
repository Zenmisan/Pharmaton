import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  const { role, id } = req.user
  const base = `
    SELECT o.*, s.name AS supplier_name, s.org_name AS supplier_org, b.name AS buyer_name, b.org_name AS buyer_org
    FROM orders o
    LEFT JOIN users s ON s.id = o.supplier_id
    LEFT JOIN users b ON b.id = o.buyer_id
    WHERE o.${role === 'supplier' ? 'supplier_id' : 'buyer_id'} = ?
    ORDER BY o.created_at DESC
  `
  const rows = db.prepare(base).all(id)
  res.json({ orders: rows })
})

router.post('/', (req, res) => {
  const { supplierId, medicine, qty, value } = req.body
  if (!medicine || !qty) return res.status(400).json({ error: 'medicine and qty required' })
  const code = 'ORD-' + Math.random().toString(36).slice(2, 7).toUpperCase()
  const result = db.prepare(
    `INSERT INTO orders (order_code,buyer_id,supplier_id,medicine,qty,status,eta,value) VALUES (?,?,?,?,?,?,?,?)`
  ).run(code, req.user.id, supplierId || null, medicine, qty, 'Processing', 'TBD', value || '—')
  res.json({ order: db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid) })
})

router.patch('/:id', (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'status required' })
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id)
  res.json({ order: db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) })
})

export default router

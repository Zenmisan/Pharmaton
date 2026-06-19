import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

function pharmacyForUser(userId) {
  return db.prepare('SELECT * FROM pharmacies WHERE owner_user_id = ?').get(userId)
}

router.get('/', (req, res) => {
  const pharmacy = pharmacyForUser(req.user.id)
  if (!pharmacy) return res.json({ items: [], stats: { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } })
  const items = db.prepare('SELECT * FROM inventory WHERE pharmacy_id = ?').all(pharmacy.id)
  const stats = {
    pharmacy_id: pharmacy.id,
    total: items.length,
    inStock: items.filter(i => i.status === 'In Stock').length,
    lowStock: items.filter(i => i.status === 'Low Stock').length,
    outOfStock: items.filter(i => i.status === 'Out of Stock').length,
  }
  res.json({ items, stats })
})

router.patch('/:id', (req, res) => {
  const pharmacy = pharmacyForUser(req.user.id)
  const item = db.prepare('SELECT * FROM inventory WHERE id = ? AND pharmacy_id = ?').get(req.params.id, pharmacy?.id)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  const { stock, price, expiry, status } = req.body
  db.prepare('UPDATE inventory SET stock = COALESCE(?, stock), price = COALESCE(?, price), expiry = COALESCE(?, expiry), status = COALESCE(?, status) WHERE id = ?')
    .run(stock ?? null, price ?? null, expiry ?? null, status ?? null, req.params.id)
  res.json({ item: db.prepare('SELECT * FROM inventory WHERE id = ?').get(req.params.id) })
})

router.post('/', (req, res) => {
  const pharmacy = pharmacyForUser(req.user.id)
  if (!pharmacy) return res.status(400).json({ error: 'No pharmacy linked to this account' })
  const { name, stock, price, expiry, status } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  const result = db.prepare('INSERT INTO inventory (pharmacy_id,name,stock,price,expiry,status) VALUES (?,?,?,?,?,?)')
    .run(pharmacy.id, name, stock || 0, price || '', expiry || '', status || 'In Stock')
  res.json({ item: db.prepare('SELECT * FROM inventory WHERE id = ?').get(result.lastInsertRowid) })
})

export default router

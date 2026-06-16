import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  const q = (req.query.q || '').toString().trim()
  if (!q) return res.json({ pharmacies: [] })

  const rows = db.prepare(`
    SELECT p.id, p.name, p.location, p.lat, p.lng, p.phone, p.nafdac_verified, p.rating,
           i.name AS medicine, i.stock, i.price, i.status
    FROM inventory i
    JOIN pharmacies p ON p.id = i.pharmacy_id
    WHERE i.name LIKE ? AND p.type = 'pharmacy'
    ORDER BY i.stock DESC
  `).all(`%${q}%`)

  res.json({ pharmacies: rows })
})

export default router

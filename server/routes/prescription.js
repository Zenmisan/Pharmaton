import express from 'express'
import { db } from '../db/index.js'

const router = express.Router()

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function parsePrescriptionText(text) {
  return text
    .split(/[\n,;]+/)
    .map(s => s.replace(/^\s*\d+[\.\)]\s*/, '').trim())
    .filter(s => s.length > 2)
}

function greedySetCover(allDrugs, pharmacies) {
  const remaining = new Set(allDrugs)
  const selected = []
  const pool = [...pharmacies]

  while (remaining.size > 0 && pool.length > 0) {
    let bestIdx = -1
    let bestCount = 0
    for (let i = 0; i < pool.length; i++) {
      const count = pool[i].foundDrugs.filter(d => remaining.has(d)).length
      if (count > bestCount) { bestCount = count; bestIdx = i }
    }
    if (bestIdx === -1 || bestCount === 0) break
    const best = pool.splice(bestIdx, 1)[0]
    selected.push(best)
    best.foundDrugs.forEach(d => remaining.delete(d))
  }

  return { pharmacies: selected, stillMissing: [...remaining] }
}

// POST /api/prescription/scan
router.post('/scan', async (req, res) => {
  const { imageBase64, mimeType, text } = req.body

  if (text) {
    return res.json({ drugs: parsePrescriptionText(text), rawText: text })
  }

  if (!imageBase64) return res.status(400).json({ error: 'Provide imageBase64 or text' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' })

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageBase64 }
            },
            {
              type: 'text',
              text: 'Extract all medicine and drug names from this prescription image. Include dosages if visible.\nReturn ONLY a valid JSON object, no explanation:\n{"drugs": ["Paracetamol 500mg", "Amoxicillin 250mg"], "rawText": "full extracted prescription text here"}'
            }
          ]
        }]
      }),
    })

    const d = await r.json()
    if (d.error) return res.status(500).json({ error: d.error.message })

    const content = (d.content?.map(i => i.text || '').join('') || '').trim()
    try {
      return res.json(JSON.parse(content))
    } catch {
      const match = content.match(/\{[\s\S]*\}/)
      if (match) return res.json(JSON.parse(match[0]))
      return res.json({ drugs: parsePrescriptionText(content), rawText: content })
    }
  } catch (err) {
    return res.status(502).json({ error: 'AI unavailable: ' + err.message })
  }
})

// POST /api/prescription/search
router.post('/search', (req, res) => {
  const { drugs, lat, lng } = req.body
  if (!Array.isArray(drugs) || drugs.length === 0) {
    return res.status(400).json({ error: 'drugs array required' })
  }

  const userLat = lat || 6.4541
  const userLng = lng || 3.3947

  const drugResults = drugs.map(drug => {
    const rows = db.prepare(`
      SELECT p.id, p.name, p.location, p.lat, p.lng, p.phone, p.nafdac_verified,
             p.rating, p.hours
      FROM inventory i
      JOIN pharmacies p ON p.id = i.pharmacy_id
      WHERE i.name LIKE ? AND i.stock > 0 AND p.type = 'pharmacy'
      GROUP BY p.id
    `).all(`%${drug}%`)
    return { drug, rows }
  })

  const pharmacyMap = new Map()
  for (const { drug, rows } of drugResults) {
    for (const row of rows) {
      if (!pharmacyMap.has(row.id)) {
        pharmacyMap.set(row.id, { pharmacy: row, foundDrugs: [], missingDrugs: [] })
      }
      const entry = pharmacyMap.get(row.id)
      if (!entry.foundDrugs.includes(drug)) entry.foundDrugs.push(drug)
    }
  }

  const entries = [...pharmacyMap.values()].map(e => {
    e.missingDrugs = drugs.filter(d => !e.foundDrugs.includes(d))
    e.distance = e.pharmacy.lat && e.pharmacy.lng
      ? Math.round(haversineKm(userLat, userLng, e.pharmacy.lat, e.pharmacy.lng) * 10) / 10
      : 999
    return e
  })

  const fullMatches = entries
    .filter(e => e.missingDrugs.length === 0)
    .sort((a, b) => a.distance - b.distance)

  const partialMatches = entries
    .filter(e => e.missingDrugs.length > 0 && e.foundDrugs.length > 0)
    .sort((a, b) => (b.foundDrugs.length - a.foundDrugs.length) || (a.distance - b.distance))

  const bestCombination = fullMatches.length === 0 && partialMatches.length > 0
    ? greedySetCover(drugs, partialMatches)
    : null

  const foundAnywhereSet = new Set(entries.flatMap(e => e.foundDrugs))
  const notFoundAnywhere = drugs.filter(d => !foundAnywhereSet.has(d))

  res.json({ drugs, fullMatches, partialMatches, bestCombination, notFoundAnywhere })
})

export default router

/**
 * Fetch all pharmacies in Lagos State from OpenStreetMap Overpass API.
 * No API key needed. Run: node scripts/fetch-lagos-pharmacies.js
 * Output: scripts/data/lagos_pharmacies_osm.csv
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'data', 'lagos_pharmacies_osm.csv')

const QUERY = `
[out:json][timeout:90];
area["name"="Lagos"]["admin_level"="4"]->.searchArea;
(
  node["amenity"="pharmacy"](area.searchArea);
  way["amenity"="pharmacy"](area.searchArea);
  relation["amenity"="pharmacy"](area.searchArea);
);
out center tags;
`.trim()

async function fetchWithRetry(attempt = 1) {
  console.log(`Querying Overpass API (attempt ${attempt})...`)
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(QUERY)}`,
      signal: AbortSignal.timeout(120_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    if (attempt === 1) {
      console.warn(`Attempt 1 failed (${err.message}). Retrying in 10s...`)
      await new Promise(r => setTimeout(r, 10_000))
      return fetchWithRetry(2)
    }
    console.error('Both attempts failed. Try splitting Lagos by LGA (see bottom of this file).')
    throw err
  }
}

function extractLatLng(el) {
  if (el.type === 'node') return { lat: el.lat, lng: el.lon }
  if (el.center) return { lat: el.center.lat, lng: el.center.lon }
  return { lat: null, lng: null }
}

function extractPhone(tags) {
  return (tags.phone || tags['contact:phone'] || tags['contact:mobile'] || '').replace(/\s+/g, '')
}

function dedupeKey(name, lat, lng) {
  const roundedLat = lat ? lat.toFixed(4) : 'x'
  const roundedLng = lng ? lng.toFixed(4) : 'x'
  return `${(name || '').toLowerCase().trim()}|${roundedLat}|${roundedLng}`
}

function escapeCsv(val) {
  if (!val) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
  return s
}

async function main() {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true })

  const data = await fetchWithRetry()
  const elements = data.elements || []
  console.log(`Raw elements from OSM: ${elements.length}`)

  const seen = new Set()
  const rows = []

  for (const el of elements) {
    const tags = el.tags || {}
    const name = tags.name || ''
    const { lat, lng } = extractLatLng(el)
    const key = dedupeKey(name, lat, lng)
    if (seen.has(key)) continue
    seen.add(key)

    const street = tags['addr:street'] || ''
    const city   = tags['addr:city'] || ''
    const address = [street, city].filter(Boolean).join(', ')
    const phone  = extractPhone(tags)

    rows.push({ name, address, latitude: lat ?? '', longitude: lng ?? '', phone })
  }

  const header = 'name,address,latitude,longitude,phone'
  const lines  = rows.map(r =>
    [r.name, r.address, r.latitude, r.longitude, r.phone].map(escapeCsv).join(',')
  )
  fs.writeFileSync(OUT, [header, ...lines].join('\n'), 'utf8')

  const withPhone = rows.filter(r => r.phone).length
  const withName  = rows.filter(r => r.name).length
  console.log(`\nDone!`)
  console.log(`Total pharmacies written : ${rows.length}`)
  console.log(`With name                : ${withName}`)
  console.log(`With phone number        : ${withPhone}`)
  console.log(`Output file              : ${OUT}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

/*
 * If the above times out, split Lagos by LGA with bounding boxes:
 *
 * const LGAS = [
 *   { name: 'Lagos Island',    bbox: '6.43,3.37,6.47,3.42' },
 *   { name: 'Victoria Island', bbox: '6.41,3.40,6.45,3.45' },
 *   { name: 'Lekki',           bbox: '6.43,3.47,6.49,3.60' },
 *   { name: 'Ikeja',           bbox: '6.57,3.31,6.63,3.38' },
 *   { name: 'Surulere',        bbox: '6.47,3.33,6.52,3.37' },
 *   { name: 'Yaba',            bbox: '6.49,3.36,6.53,3.39' },
 * ]
 * Then query each with: node["amenity"="pharmacy"](${bbox}); and merge results.
 */

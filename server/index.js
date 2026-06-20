import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { db } from './db/index.js'
import authRoutes, { requireAuth } from './routes/auth.js'
import inventoryRoutes from './routes/inventory.js'
import ordersRoutes from './routes/orders.js'
import supplierRequestsRoutes from './routes/supplierRequests.js'
import alertsRoutes from './routes/alerts.js'
import hospitalNeedsRoutes from './routes/hospitalNeeds.js'
import pharmaciesRoutes from './routes/pharmacies.js'
import searchRoutes from './routes/search.js'
import aiRoutes from './routes/ai.js'

const app = express()
app.use(cors())
app.use(express.json())
// Allow Google OAuth popup to communicate back
app.use((req, res, next) => {
  res.removeHeader('Cross-Origin-Opener-Policy')
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/inventory', requireAuth, inventoryRoutes)
app.use('/api/orders', requireAuth, ordersRoutes)
app.use('/api/supplier-requests', requireAuth, supplierRequestsRoutes)
app.use('/api/alerts', requireAuth, alertsRoutes)
app.use('/api/hospital-needs', requireAuth, hospitalNeedsRoutes)
app.use('/api/pharmacies', requireAuth, pharmaciesRoutes)
app.use('/api/search', requireAuth, searchRoutes)
app.use('/api/ai', requireAuth, aiRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`PharmaConnect API listening on http://localhost:${PORT}`))

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, MapPin, Phone, Navigation, Star, CheckCircle2,
  Clock, Package, AlertTriangle,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── PHARMACY DETAIL ────────────────────────────────────────── */
export function PharmacyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pharmacy, setPharmacy] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    api.pharmacy(id)
      .then(({ pharmacy, inventory }) => {
        setPharmacy(pharmacy)
        setInventory(inventory)
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-muted text-sm">
      Loading pharmacy...
    </div>
  )
  if (!pharmacy) return null

  const filtered = filter === "All" ? inventory : inventory.filter(i => i.status === filter)
  const inStock = inventory.filter(i => i.status === 'In Stock').length
  const lowStock = inventory.filter(i => i.status === 'Low Stock').length
  const outOfStock = inventory.filter(i => i.status === 'Out of Stock').length

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-muted text-sm font-semibold mb-6 bg-transparent border-0 cursor-pointer hover:text-text transition-colors">
        <ChevronLeft size={16}/> Back
      </button>

      {/* Header */}
      <div className="grain-overlay bg-grad-green rounded-[20px] px-8 py-7 mb-6 text-white">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            {!!pharmacy.nafdac_verified && (
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={14} className="text-[#86EFAC]"/>
                <span className="text-white/80 text-[13px] font-semibold">NAFDAC Verified</span>
              </div>
            )}
            <h1 className="font-display text-[28px] font-black mb-1">{pharmacy.name}</h1>
            <p className="text-white/80 text-sm flex items-center gap-1.5 mb-1">
              <MapPin size={13}/> {pharmacy.location}
            </p>
            {pharmacy.hours && (
              <p className="text-white/75 text-sm flex items-center gap-1.5 mb-1">
                <Clock size={13}/> {pharmacy.hours}
              </p>
            )}
            <p className="text-white/75 text-sm flex items-center gap-1.5">
              <Star size={13}/> {pharmacy.rating}
              {pharmacy.review_count > 0 && <span className="text-white/55">({pharmacy.review_count} reviews)</span>}
            </p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <a href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`} target="_blank" rel="noreferrer">
              <Btn size="sm" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}>
                <Navigation size={14}/> Directions
              </Btn>
            </a>
            <a href={`tel:${pharmacy.phone}`}>
              <Btn size="sm" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}>
                <Phone size={14}/> Call
              </Btn>
            </a>
          </div>
        </div>
      </div>

      {/* Stock summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'In Stock', count: inStock, color: '#16A34A' },
          { label: 'Low Stock', count: lowStock, color: '#D97706' },
          { label: 'Out of Stock', count: outOfStock, color: '#DC2626' },
        ].map(({ label, count, color }) => (
          <Card key={label} className="text-center !py-4">
            <div className="text-2xl font-black mb-0.5" style={{ color }}>{count}</div>
            <div className="text-muted text-xs font-semibold">{label}</div>
          </Card>
        ))}
      </div>

      {/* Inventory */}
      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Package size={18}/> Available Medicines
          </h2>
          <div className="flex gap-1.5">
            {["All", "In Stock", "Low Stock", "Out of Stock"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold border cursor-pointer transition-colors ${
                  filter === f ? 'border-blue-brand bg-blue-light text-blue-brand' : 'border-border bg-white text-muted hover:border-blue-brand/50'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted">
            <AlertTriangle size={32} className="mx-auto mb-2 text-warning"/>
            <p className="font-semibold">No medicines in this category</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                {["Medicine", "Stock", "Price", "Expiry", "Status"].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-muted text-xs font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="px-3 py-3 font-semibold text-sm">{item.name}</td>
                  <td className="px-3 py-3 text-muted text-sm">{item.stock}</td>
                  <td className="px-3 py-3 text-green-mid font-semibold text-sm">{item.price || '—'}</td>
                  <td className="px-3 py-3 text-muted text-[13px]">{item.expiry || '—'}</td>
                  <td className="px-3 py-3"><Badge status={item.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {inventory.length > 0 && (
          <p className="text-muted text-xs mt-4 pt-3 border-t border-border">
            Showing {filtered.length} of {inventory.length} medicines · Last updated: Today
          </p>
        )}
      </Card>
    </div>
  )
}

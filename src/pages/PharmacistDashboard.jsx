import { useState, useEffect } from 'react'
import {
  CheckCircle2, AlertTriangle, X, Package, MapPin, MessageSquare, BarChart3, ExternalLink,
} from 'lucide-react'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { callAI } from '@/lib/ai'
import { useAuth } from '@/lib/auth.jsx'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── PHARMACIST DASHBOARD ───────────────────────────────────── */
export function PharmacistDashboard({ setPage }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [iq, setIq] = useState(""); const [ir, setIr] = useState(""); const [il, setIl] = useState(false)
  const [inv, setInv] = useState([])
  const [invStats, setInvStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0, pharmacy_id: null })
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    api.inventory().then(({ items, stats }) => { setInv(items); setInvStats(stats) }).catch(() => {})
    api.orders().then(({ orders }) => setPendingOrders(orders.filter(o => o.status === 'Pending').length)).catch(() => {})
  }, [])

  const stats = [
    { v: String(invStats.inStock),    l:"In Stock",      Icon: CheckCircle2,   color:'#16A34A' },
    { v: String(invStats.lowStock),   l:"Low Stock",     Icon: AlertTriangle,  color:'#D97706' },
    { v: String(invStats.outOfStock), l:"Out of Stock",  Icon: X,              color:'#DC2626' },
    { v: String(pendingOrders),       l:"Pending Orders",Icon: Package,        color:'#1B3FC4' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          {user?.pcn_status === 'verified' ? (
            <p className="text-muted text-[13px] flex items-center gap-1.5 mb-1">
              <LocalPharmacyIcon sx={{ fontSize: 14 }}/> PCN Verified
              <CheckCircle2 size={13} className="text-green-brand"/>
            </p>
          ) : user?.pcn_status === 'rejected' ? (
            <p className="text-[13px] flex items-center gap-1.5 mb-1 text-danger">
              <AlertTriangle size={13}/> PCN Verification Failed
            </p>
          ) : (
            <p className="text-[13px] flex items-center gap-1.5 mb-1 text-amber-600">
              <AlertTriangle size={13}/> PCN Verification Pending
            </p>
          )}
          <h1 className="font-display text-[26px] font-black tracking-tight">{user?.org_name || user?.name}</h1>
          <p className="text-muted text-sm flex items-center gap-1 mt-0.5">
            <MapPin size={13}/> {user?.location || 'Location not set'}
            {user?.license_number ? ` · PCN ${user.license_number}` : ''}
          </p>
          {user?.pcn_status === 'rejected' && user?.pcn_notes && (
            <p className="text-[12px] text-danger mt-1 bg-red-50 px-3 py-1.5 rounded-lg">
              {user.pcn_notes}
            </p>
          )}
          {user?.pcn_status === 'pending' && (
            <p className="text-[12px] text-amber-700 mt-1 bg-amber-50 px-3 py-1.5 rounded-lg">
              Your PCN license is being reviewed. This usually takes 1–2 business days.
            </p>
          )}
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <Btn size="sm" variant="secondary" onClick={() => setPage('inventory')}>Manage Inventory</Btn>
          <Btn size="sm" variant="secondary" onClick={() => setPage('inventory')}>Update Stock</Btn>
          {invStats.pharmacy_id && (
            <Btn size="sm" onClick={() => navigate(`/pharmacy/${invStats.pharmacy_id}`)}>
              <ExternalLink size={13}/> View Listing
            </Btn>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5 mb-6">
        {stats.map(({ v, l, Icon, color }) => (
          <Card key={l} className="text-center !p-5">
            <Icon size={28} className="mx-auto mb-1" style={{ color }} />
            <div className="text-3xl font-black mb-1" style={{ color }}>{v}</div>
            <div className="text-muted text-[13px]">{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1fr_360px]">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold">Inventory Overview</h2>
            <Btn variant="ghost" size="sm" onClick={() => setPage("inventory")}>View all →</Btn>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[360px]">
            <thead>
              <tr className="border-b-2 border-border">
                {["Medicine","Stock","Status","Expiry"].map(h => <th key={h} className="text-left px-2.5 py-2 text-muted text-xs font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {inv.map(item => (
                <tr key={item.name} className="border-b border-border">
                  <td className="px-2.5 py-3 font-semibold text-sm">{item.name}</td>
                  <td className="px-2.5 py-3 text-muted text-sm">{item.stock}</td>
                  <td className="px-2.5 py-3"><Badge status={item.status}/></td>
                  <td className="px-2.5 py-3 text-muted text-[13px]">{item.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card style={{ background: `linear-gradient(135deg,rgba(232,237,251,1),rgba(220,252,231,1))`, border: '1px solid rgba(27,63,196,0.12)' }}>
            <h3 className="text-[15px] font-extrabold mb-3 flex items-center gap-2"><MessageSquare size={16}/> Demand Insight</h3>
            <textarea value={iq} onChange={e => setIq(e.target.value)} placeholder="Ask about demand trends, shortages, pricing..."
              className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none resize-none h-20 font-[inherit] box-border mb-2.5"/>
            <Btn full onClick={async () => {
              setIl(true)
              const r = await callAI("You are a market intelligence assistant for Nigerian community pharmacies. Give 2-3 actionable sentences about pharmaceutical demand, market trends, or sourcing advice specific to Nigeria.", iq)
              setIr(r); setIl(false)
            }}>
              {il ? "Searching..." : "Ask"}
            </Btn>
            {ir && (
              <p className={`fade-in text-[13px] leading-[1.7] mt-3 px-3 py-2.5 rounded-xl ${ir.startsWith('AI unavailable') ? 'bg-yellow-50 text-yellow-800' : 'bg-white text-text'}`}>
                {ir.startsWith('AI unavailable') ? 'Service temporarily unavailable. Please try again shortly.' : ir}
              </p>
            )}
          </Card>
          <Card>
            <h3 className="text-[15px] font-extrabold mb-3 flex items-center gap-2"><BarChart3 size={16}/> This Week</h3>
            {[["Paracetamol 500mg","High demand",'#16A34A'],["Augmentin 625mg","Shortage risk",'#DC2626'],["Metformin 850mg","Stable",'#1B3FC4']].map(([d,s,c]) => (
              <div key={d} className="flex justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-[13px] font-semibold">{d}</span>
                <span className="text-xs font-bold" style={{ color: c }}>{s}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

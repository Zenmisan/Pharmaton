import { useState, useEffect } from 'react'
import {
  CheckCircle2, AlertTriangle, X, Package, MapPin, Bot, BarChart3, ExternalLink,
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
      <div className="grain-overlay bg-grad-green rounded-[20px] px-8 py-7 mb-6 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-white/75 text-[13px] flex items-center gap-1.5">
              <LocalPharmacyIcon sx={{ fontSize: 14 }}/> Community Pharmacist · Verified Partner
              <CheckCircle2 size={13} className="text-[#86EFAC]"/>
            </p>
            <h1 className="font-display text-[28px] font-black my-1">{user?.org_name || user?.name}</h1>
            <p className="text-white/80 text-sm flex items-center gap-1"><MapPin size={13}/> {user?.location || "Location not set"}{user?.license_number ? ` · ${user.license_number}` : ""}</p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("inventory")}>Manage Inventory</Btn>
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("inventory")}>Update Stock</Btn>
            {invStats.pharmacy_id && (
              <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }}
                onClick={() => navigate(`/pharmacy/${invStats.pharmacy_id}`)}>
                <ExternalLink size={13}/> View My Listing
              </Btn>
            )}
          </div>
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

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 380px' }}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold">Inventory Overview</h2>
            <Btn variant="ghost" size="sm" onClick={() => setPage("inventory")}>View all →</Btn>
          </div>
          <table className="w-full border-collapse">
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
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card style={{ background: `linear-gradient(135deg,rgba(232,237,251,1),rgba(220,252,231,1))`, border: '1px solid rgba(27,63,196,0.12)' }}>
            <h3 className="text-[15px] font-extrabold mb-3 flex items-center gap-2"><Bot size={16}/> AI Demand Insight</h3>
            <textarea value={iq} onChange={e => setIq(e.target.value)} placeholder="Ask about demand trends, shortages, pricing..."
              className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none resize-none h-20 font-[inherit] box-border mb-2.5"/>
            <Btn full onClick={async () => {
              setIl(true)
              const r = await callAI("You are PharmaConnect AI for Nigerian community pharmacies. Give 2-3 actionable sentences about pharmaceutical demand, market trends, or sourcing advice specific to Nigeria.", iq)
              setIr(r); setIl(false)
            }}>
              {il ? "Analyzing..." : "Ask AI"}
            </Btn>
            {ir && <p className="fade-in text-text text-[13px] leading-[1.7] mt-3 px-3 py-2.5 bg-white rounded-xl">{ir}</p>}
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

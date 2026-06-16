import { useState, useEffect } from 'react'
import { Package, Bell, Truck, CheckCircle2, MapPin, X, Check, Bot } from 'lucide-react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth.jsx'
import { G } from '@/lib/gradients'
import { Card, Btn } from '@/components/ui'
import { timeAgo } from '@/components/AlertMeta'

/* ─── SUPPLIER DASHBOARD ─────────────────────────────────────── */
export function SupplierDashboard({ setPage }) {
  const { user } = useAuth()
  const [reqs, setReqs] = useState([])
  const [stockCount, setStockCount] = useState(0)
  const [dispatchedToday, setDispatchedToday] = useState(0)

  function load() {
    api.supplierRequests().then(({ requests }) => setReqs(requests)).catch(() => {})
  }
  useEffect(() => {
    load()
    api.inventory().then(({ stats }) => setStockCount(stats.total)).catch(() => {})
    api.orders().then(({ orders }) => setDispatchedToday(orders.filter(o => o.status === "In Transit" || o.status === "Delivered").length)).catch(() => {})
  }, [])

  async function act(id, status) {
    await api.updateSupplierRequest(id, status)
    load()
  }

  const pendingCount = reqs.filter(r=>r.status==="pending").length

  const stats = [
    { v: String(stockCount),     l:"In Stock",       Icon: Package,      color:'#16A34A' },
    { v:`${pendingCount}`,       l:"New Requests",   Icon: Bell,         color:'#DC2626' },
    { v: String(dispatchedToday),l:"Dispatched",     Icon: Truck,       color:'#1B3FC4' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="grain-overlay bg-grad-purple rounded-[20px] px-8 py-7 mb-6 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-white/75 text-[13px] flex items-center gap-1.5">
              <LocalShippingIcon sx={{ fontSize: 14 }}/> Supplier / Distributor · NAFDAC Verified
              <CheckCircle2 size={13} className="text-[#86EFAC]"/>
            </p>
            <h1 className="font-display text-[28px] font-black my-1">{user?.org_name || user?.name}</h1>
            <p className="text-white/80 text-sm flex items-center gap-1"><MapPin size={13}/> {user?.location || "Location not set"}{user?.license_number ? ` · ${user.license_number}` : ""}</p>
          </div>
          <div className="flex gap-2.5">
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("stock")}>Manage Stock</Btn>
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("analytics")}>Analytics</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 mb-6">
        {stats.map(({ v, l, Icon, color }) => (
          <Card key={l} className="text-center !p-5">
            <Icon size={26} className="mx-auto" style={{ color }}/>
            <div className="font-black my-1" style={{ fontSize: v.startsWith('₦')?20:30, color }}>{v}</div>
            <div className="text-muted text-[13px]">{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 360px' }}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold">Incoming Requests</h2>
            <span className="bg-danger text-white text-[11px] font-extrabold rounded-lg px-2.5 py-0.5">{pendingCount} New</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {reqs.map(r => (
              <div key={r.id} className={cn('rounded-[14px] p-4 border-[1.5px] transition-opacity duration-200', !!r.urgent&&r.status==="pending"?'border-danger':'border-border', r.status!=="pending"?'opacity-60':'')}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-bold text-sm">{r.from_name}</span>
                  {!!r.urgent && r.status==="pending" && <span className="bg-danger text-white text-[10px] font-extrabold rounded-md px-2 py-0.5">URGENT</span>}
                  {r.status!=="pending" && <span className={cn('text-[10px] font-extrabold rounded-md px-2 py-0.5', r.status==="accepted"?'bg-green-light text-green-brand':'bg-slate-100 text-muted')}>{r.status.toUpperCase()}</span>}
                </div>
                <p className="text-blue-brand font-bold text-sm mb-0.5">{r.medicine}</p>
                <p className="text-muted text-[13px] mb-3 last:mb-0">{r.qty} · {timeAgo(r.created_at)}</p>
                {r.status==="pending" && (
                  <div className="flex gap-2">
                    <Btn variant="ghost" size="sm" full onClick={() => act(r.id,"declined")}><X size={13}/> Decline</Btn>
                    <Btn size="sm" full onClick={() => act(r.id,"accepted")}><Check size={13}/> Accept</Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card>
            <h3 className="font-extrabold mb-3 flex items-center gap-2"><Package size={15}/> Upcoming Shipments</h3>
            {[["Augmentin 625mg","120 packs","Jun 10"],["IV Normal Saline","200 bags","Jun 12"],["Metformin 850mg","500 tabs","Jun 15"]].map(([d,q,dt]) => (
              <div key={d} className="py-2.5 border-b border-border last:border-0">
                <p className="font-semibold text-sm mb-0.5">{d}</p>
                <p className="text-muted text-xs">{q} · Arrival: {dt}</p>
              </div>
            ))}
          </Card>
          <Card style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)' }}>
            <h3 className="font-extrabold mb-2 text-purple-brand flex items-center gap-2"><Bot size={15}/> AI Market Intel</h3>
            <p className="text-muted text-[13px] mb-2.5">Get demand forecasts and pricing insights</p>
            <Btn full gradient={G.purple} onClick={() => setPage("analytics")}>Open AI Analytics →</Btn>
          </Card>
        </div>
      </div>
    </div>
  )
}

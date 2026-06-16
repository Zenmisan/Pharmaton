import { useState, useEffect } from 'react'
import {
  Building2, Siren, Package, Truck, CheckCircle2, ClipboardList, Bot,
} from 'lucide-react'
import { api } from '@/lib/api'
import { callAI } from '@/lib/ai'
import { useAuth } from '@/lib/auth.jsx'
import { G } from '@/lib/gradients'
import { Card, Btn } from '@/components/ui'

/* ─── HOSPITAL DASHBOARD ─────────────────────────────────────── */
export function HospitalDashboard({ setPage }) {
  const { user } = useAuth()
  const [eq, setEq] = useState(""); const [er, setEr] = useState(""); const [el, setEl] = useState(false)
  const [critical, setCritical] = useState([])
  const [needsStats, setNeedsStats] = useState({ critical: 0, total: 0 })
  const [orderStats, setOrderStats] = useState({ active: 0, inTransit: 0 })
  const [supplierCount, setSupplierCount] = useState(0)

  useEffect(() => {
    api.hospitalNeeds().then(({ needs, stats }) => { setCritical(needs); setNeedsStats(stats) }).catch(() => {})
    api.orders().then(({ orders }) => setOrderStats({
      active: orders.filter(o => o.status !== 'Delivered').length,
      inTransit: orders.filter(o => o.status === 'In Transit').length,
    })).catch(() => {})
    api.pharmacies('supplier').then(({ pharmacies }) => setSupplierCount(pharmacies.filter(p => p.nafdac_verified).length)).catch(() => {})
  }, [])

  const stats = [
    { v: String(needsStats.critical), l:"Critical Needs",     Icon: Siren,        color:'#DC2626' },
    { v: String(orderStats.active),   l:"Active Orders",      Icon: Package,      color:'#1B3FC4' },
    { v: String(orderStats.inTransit),l:"In Transit",         Icon: Truck,        color:'#D97706' },
    { v: String(supplierCount),       l:"Verified Suppliers", Icon: CheckCircle2, color:'#16A34A' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="grain-overlay bg-grad-teal rounded-[20px] px-8 py-7 mb-6 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-white/75 text-[13px] flex items-center gap-1.5"><Building2 size={14}/> Hospital Pharmacist</p>
            <h1 className="font-display text-[28px] font-black my-1">{user?.org_name || user?.name}</h1>
            <p className="text-white/80 text-sm">{user?.location || "Pharmacy Department"}</p>
          </div>
          <div className="flex gap-2.5">
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("emergency")}>
              <Siren size={14}/> Emergency Sourcing
            </Btn>
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("orders")}>
              <ClipboardList size={14}/> Track Orders
            </Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 mb-6">
        {stats.map(({ v, l, Icon, color }) => (
          <Card key={l} className="text-center !p-5">
            <Icon size={26} className="mx-auto" style={{ color }}/>
            <div className="text-3xl font-black my-1" style={{ color }}>{v}</div>
            <div className="text-muted text-[13px]">{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 380px' }}>
        <Card>
          <h2 className="text-lg font-extrabold mb-4 text-danger flex items-center gap-2"><Siren size={18}/> Critical Needs</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                {["Medicine","Quantity","Priority","Status"].map(h => <th key={h} className="text-left px-2.5 py-2 text-muted text-xs font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {critical.map(item => (
                <tr key={item.id} className="border-b border-border">
                  <td className="px-2.5 py-3 font-semibold text-sm">{item.name}</td>
                  <td className="px-2.5 py-3 text-muted text-[13px]">{item.qty}</td>
                  <td className="px-2.5 py-3">
                    <span className="text-[11px] font-extrabold rounded-md px-2 py-0.5"
                      style={{ background: item.priority==="CRITICAL"?'#DC2626':item.priority==="HIGH"?'#D97706':'#DBEAFE', color: item.priority==="CRITICAL"||item.priority==="HIGH"?'#fff':'#1B3FC4' }}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-2.5 py-3 text-muted text-[13px]">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card style={{ border: '1px solid rgba(13,148,136,0.3)', background: 'linear-gradient(135deg,rgba(13,148,136,0.06),rgba(27,63,196,0.06))' }}>
          <h3 className="text-[15px] font-extrabold mb-1.5 flex items-center gap-2"><Bot size={16}/> AI Emergency Sourcing</h3>
          <p className="text-muted text-[13px] mb-3">Describe what you need to source urgently</p>
          <textarea value={eq} onChange={e => setEq(e.target.value)} placeholder="e.g. Need 500 vials of Insulin Actrapid urgently for ICU patients with DKA..."
            className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none resize-none h-[88px] font-[inherit] box-border mb-2.5"/>
          <Btn full gradient={G.teal} onClick={async () => {
            setEl(true)
            const r = await callAI("You are PharmaConnect AI for hospital pharmacists in Nigeria. Provide specific emergency sourcing guidance: list 2-3 therapeutic alternatives if needed, types of verified suppliers to contact (NAFDAC-registered), estimated availability in Nigerian market, and any critical patient safety considerations. Be direct and clinical. 4 sentences max.", `Emergency sourcing needed: ${eq}`)
            setEr(r); setEl(false)
          }}>
            {el ? "AI Finding Suppliers..." : <><Siren size={15}/> Find Emergency Suppliers</>}
          </Btn>
          {er && <div className="fade-in mt-3 px-3.5 py-3 bg-white rounded-xl border border-teal-brand/30"><p className="text-text text-[13px] leading-[1.8]">{er}</p></div>}
        </Card>
      </div>
    </div>
  )
}

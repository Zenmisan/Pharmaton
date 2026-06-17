import { useState, useEffect } from 'react'
import { Bot, Search, CheckCircle2, MapPin, Star, X } from 'lucide-react'
import { api } from '@/lib/api'
import { callAI } from '@/lib/ai'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── SOURCING PAGE ──────────────────────────────────────────── */
export function SourcingPage() {
  const [q, setQ] = useState(""); const [r, setR] = useState(""); const [l, setL] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [stockOf, setStockOf] = useState(null)

  useEffect(() => {
    api.pharmacies('supplier').then(({ pharmacies }) => setSuppliers(pharmacies)).catch(() => {})
  }, [])

  async function viewStock(s) {
    const { inventory } = await api.pharmacy(s.id)
    setStockOf({ supplier: s, items: inventory || [] })
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-1">Medicine Sourcing</h1>
      <p className="text-muted mb-7">Find verified suppliers and source scarce medicines</p>

      <Card className="mb-6">
        <h3 className="font-extrabold mb-3 flex items-center gap-2"><Bot size={15}/> AI Sourcing Assistant</h3>
        <div className="flex gap-3 mb-2.5 flex-wrap">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="What medicine do you need to source? Include quantity and urgency..."
            className="flex-1 min-w-[250px] border-[1.5px] border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-brand transition-colors"/>
          <Btn onClick={async () => {
            setL(true)
            const res = await callAI("You are PharmaConnect AI sourcing agent for Nigerian community pharmacists. Provide specific sourcing advice: name 2-3 verified supplier types in Nigeria, suggest alternatives if shortage exists, mention typical turnaround times, and note any NAFDAC considerations. Be practical and specific. 4 sentences max.", q)
            setR(res); setL(false)
          }} className="gap-1.5">
            <Search size={15}/> {l ? "Finding..." : "Find Sources"}
          </Btn>
        </div>
        {r && <div className="fade-in px-4 py-3 bg-blue-light rounded-xl"><p className="text-sm leading-[1.8]">{r}</p></div>}
      </Card>

      <h3 className="font-extrabold mb-3.5">Verified Supplier Network</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
        {suppliers.map(s => (
          <Card key={s.id} className="transition-all duration-150 hover:shadow-md">
            <div className="flex justify-between mb-2">
              <h4 className="font-bold text-[15px]">{s.name}</h4>
              {!!s.nafdac_verified && <span className="text-green-brand text-[11px] font-bold flex items-center gap-1"><CheckCircle2 size={11}/> NAFDAC Verified</span>}
            </div>
            <p className="text-muted text-[13px] mb-0.5 flex items-center gap-1"><MapPin size={11}/> {s.location}</p>
            <p className="text-muted text-[13px] mb-3.5 flex items-center gap-1"><Star size={11}/> {s.rating}</p>
            <div className="flex gap-2">
              <Btn full variant="secondary" size="sm" onClick={() => viewStock(s)}>View Stock</Btn>
              <Btn full size="sm" onClick={() => api.createSupplierRequest({ supplierId: s.owner_user_id, medicine: "Supply Request", qty: "Bulk", urgent: false }).then(() => alert("Request sent to " + s.name))}>Request Supply</Btn>
            </div>
          </Card>
        ))}
      </div>

      {stockOf && (
        <Card className="mt-6 fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold">{stockOf.supplier.name} — Available Stock</h3>
            <Btn variant="ghost" size="sm" onClick={() => setStockOf(null)}><X size={14}/></Btn>
          </div>
          {stockOf.items.length === 0 ? <p className="text-muted text-sm">No stock listed.</p> : (
            <table className="w-full border-collapse">
              <thead><tr className="border-b-2 border-border">{["Medicine","Stock","Price","Status"].map(h => <th key={h} className="text-left px-2.5 py-2 text-muted text-xs font-bold">{h}</th>)}</tr></thead>
              <tbody>
                {stockOf.items.map(i => (
                  <tr key={i.id} className="border-b border-border">
                    <td className="px-2.5 py-3 font-semibold text-sm">{i.name}</td>
                    <td className="px-2.5 py-3 text-muted text-sm">{i.stock}</td>
                    <td className="px-2.5 py-3 text-green-mid font-semibold text-sm">{i.price}</td>
                    <td className="px-2.5 py-3"><Badge status={i.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  )
}

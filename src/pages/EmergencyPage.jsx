import { useState, useEffect } from 'react'
import {
  Siren, Bot, Loader2, CheckCircle2, MapPin, Star, Phone,
} from 'lucide-react'
import { api } from '@/lib/api'
import { callAI } from '@/lib/ai'
import { G } from '@/lib/gradients'
import { Card, Btn } from '@/components/ui'

/* ─── EMERGENCY PAGE ─────────────────────────────────────────── */
export function EmergencyPage() {
  const [eq, setEq] = useState(""); const [er, setEr] = useState(""); const [el, setEl] = useState(false)
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => {
    api.pharmacies('supplier').then(({ pharmacies }) => setSuppliers(pharmacies)).catch(() => {})
  }, [])

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="bg-red-50 border-2 border-danger rounded-[20px] px-6 py-5 mb-7 flex gap-3.5 items-center">
        <Siren size={32} className="text-danger shrink-0"/>
        <div>
          <h2 className="text-danger font-black text-lg mb-1">Emergency Medicine Sourcing</h2>
          <p className="text-red-700 text-sm">For critical and time-sensitive medicine needs. AI will suggest alternatives and verified suppliers.</p>
        </div>
      </div>

      <Card className="border-2 border-teal-brand/30 mb-5">
        <h3 className="font-extrabold text-base mb-3 flex items-center gap-2"><Bot size={16}/> AI Emergency Sourcing Assistant</h3>
        <textarea value={eq} onChange={e => setEq(e.target.value)}
          placeholder="Describe your emergency sourcing need in detail, e.g.: 'Need 500 vials of Insulin Actrapid urgently for ICU ward. Have 3 patients with DKA. Current stock depleted. Need within 2 hours if possible.'"
          className="w-full border-[1.5px] border-border rounded-[14px] px-4 py-3.5 text-sm outline-none resize-none h-[120px] font-[inherit] box-border mb-3.5"/>
        <Btn size="lg" full gradient={G.teal} onClick={async () => {
          setEl(true)
          const r = await callAI("You are PharmaConnect AI emergency sourcing for hospital pharmacists in Nigeria. Provide: (1) 2-3 therapeutic alternatives with the same class/mechanism, (2) specific types of NAFDAC-registered suppliers to contact, (3) estimated availability in Nigerian market, (4) critical patient safety notes. Format clearly with numbered points. Be direct and clinical.", `Emergency: ${eq}`)
          setEr(r); setEl(false)
        }}>
          {el ? <><Loader2 size={16} className="spin"/> AI Finding Emergency Suppliers...</> : <><Siren size={16}/> Find Emergency Suppliers Now</>}
        </Btn>
        {er && (
          <div className="fade-in mt-4 px-[18px] py-4" style={{ background: 'rgba(13,148,136,0.08)', borderRadius: 14, border: '1px solid rgba(13,148,136,0.3)' }}>
            <p className="font-extrabold text-teal-brand mb-2.5 flex items-center gap-2"><Bot size={14}/> AI Emergency Response:</p>
            <p className="text-text text-sm leading-[1.9] whitespace-pre-wrap">{er}</p>
          </div>
        )}
      </Card>

      <h3 className="font-extrabold mb-3.5">Verified Emergency Suppliers Near You</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
        {suppliers.map(s => (
          <Card key={s.id}>
            <div className="flex justify-between mb-2">
              <h4 className="font-bold text-[15px]">{s.name}</h4>
              {!!s.nafdac_verified && <span className="text-green-brand text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> NAFDAC</span>}
            </div>
            <p className="text-muted text-[13px] mb-0.5 flex items-center gap-1"><MapPin size={11}/> {s.location}</p>
            <p className="text-muted text-[13px] mb-3.5 flex items-center gap-1"><Star size={11}/> {s.rating}</p>
            <div className="flex gap-2">
              <a className="flex-1" href={`tel:${s.phone}`}>
                <Btn full variant="secondary" size="sm" className="gap-1"><Phone size={12}/> Call</Btn>
              </a>
              <Btn full size="sm" onClick={() => api.createOrder({ supplierId: s.owner_user_id, medicine: eq || "Emergency request", qty: "1" }).then(() => alert("Request sent to " + s.name))}>Request</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

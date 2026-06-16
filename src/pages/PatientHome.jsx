import { useState, useEffect } from 'react'
import {
  MapPin, Search, AlertTriangle, Bell, DollarSign, Map, Star, CheckCircle2,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── PATIENT HOME ───────────────────────────────────────────── */
export function PatientHome({ setPage }) {
  const [nearby, setNearby] = useState([])
  useEffect(() => {
    api.pharmacies('pharmacy').then(({ pharmacies }) => setNearby(pharmacies.slice(0, 3)))
  }, [])
  return (
    <div>
      <div className="grain-overlay bg-grad-main px-6 py-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-white/75 text-[13px] mb-1 flex items-center gap-1"><MapPin size={12}/> Surulere, Lagos</p>
          <h1 className="font-display text-white text-[clamp(24px,4vw,40px)] font-black mb-3">
            Good morning<br/>What medicine do you need?
          </h1>
          <div className="bg-white rounded-2xl p-3 px-4 flex gap-3 max-w-[600px] items-center">
            <Search size={20} className="text-muted shrink-0"/>
            <input placeholder="Search medicine name..." onClick={() => setPage("search")} readOnly
              className="flex-1 border-none outline-none text-base text-text cursor-pointer bg-transparent" />
            <button onClick={() => setPage("search")} className="bg-grad-main border-none rounded-xl px-5 py-2.5 text-white font-bold cursor-pointer text-sm">
              Search
            </button>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["Paracetamol","Amoxicillin","Augmentin","Metformin","Amlodipine"].map(s => (
              <button key={s} onClick={() => setPage("search")}
                className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs cursor-pointer font-medium hover:bg-white/25 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <div className="bg-yellow-50 border border-warning rounded-[14px] px-5 py-3.5 mb-7 flex gap-3 items-center flex-wrap">
          <AlertTriangle size={22} className="text-warning shrink-0"/>
          <div>
            <strong className="text-yellow-800 text-sm">NAFDAC Alert: </strong>
            <span className="text-yellow-800 text-[13px]">Counterfeit Tramadol 200mg reported across Lagos. Only purchase from verified pharmacies.</span>
          </div>
          <button onClick={() => setPage("alerts")}
            className="ml-auto px-3.5 py-1.5 rounded-xl border border-warning bg-transparent text-yellow-800 text-xs font-semibold cursor-pointer whitespace-nowrap hover:bg-yellow-100 transition-colors">
            View All Alerts
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5 mb-9">
          {[
            { Icon: Search,       label:"Search Medicine", sub:"AI-powered search", page:"search", color:'#1B3FC4' },
            { Icon: Map,          label:"Find Pharmacies", sub:"Near me now",       page:"map",    color:'#16A34A' },
            { Icon: Bell,         label:"Safety Alerts",   sub:"6 active alerts",   page:"alerts", color:'#D97706' },
            { Icon: DollarSign,   label:"Budget Search",   sub:"Filter by price",   page:"search", color:'#0D9488' },
          ].map(a => (
            <Card key={a.label} onClick={() => setPage(a.page)}
              className="flex items-center gap-3.5 !p-4 transition-all duration-150"
              onMouseEnter={e => e.currentTarget.style.boxShadow=`0 8px 24px ${a.color}20`}
              onMouseLeave={e => e.currentTarget.style.boxShadow=''}>
              <div className="size-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${a.color}15`, color: a.color }}>
                <a.Icon size={20}/>
              </div>
              <div>
                <p className="font-bold text-sm mb-0.5">{a.label}</p>
                <p className="text-muted text-xs">{a.sub}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold">Nearby Pharmacies</h2>
          <button onClick={() => setPage("map")} className="text-blue-brand bg-transparent border-none font-semibold text-sm cursor-pointer hover:underline">
            View map →
          </button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
          {nearby.map(p => (
            <Card key={p.id} className="!p-4">
              <div className="flex justify-between mb-1.5">
                <span className="font-bold text-sm">{p.name}</span>
                <Badge status={p.status}/>
              </div>
              <p className="text-muted text-xs mb-3 flex items-center gap-1">
                <MapPin size={10}/> {p.location} · <Star size={10}/> {p.rating}
                {!!p.nafdac_verified && <><CheckCircle2 size={10} className="text-green-brand ml-1"/> NAFDAC</>}
              </p>
              <div className="flex gap-2">
                <a className="flex-1" href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} target="_blank" rel="noreferrer">
                  <Btn full variant="secondary" size="sm">Directions</Btn>
                </a>
                <a className="flex-1" href={`tel:${p.phone}`}>
                  <Btn full size="sm">Call</Btn>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

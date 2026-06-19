import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Search, AlertTriangle, Bell, DollarSign, Map, Star,
  CheckCircle2, Clock, ChevronRight,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth.jsx'
import { haversineKm, fmtKm, LAGOS_DEFAULT } from '@/lib/utils'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── PATIENT HOME ───────────────────────────────────────────── */
export function PatientHome({ setPage }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [nearby, setNearby] = useState([])
  const [userPos, setUserPos] = useState(LAGOS_DEFAULT)

  const addDistances = useCallback((pharmacies, pos) => {
    return pharmacies
      .map(p => ({ ...p, distKm: (p.lat && p.lng) ? haversineKm(pos.lat, pos.lng, p.lat, p.lng) : 999 }))
      .sort((a, b) => a.distKm - b.distKm)
  }, [])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {} // stay on Lagos default
    )
  }, [])

  useEffect(() => {
    api.pharmacies('pharmacy').then(({ pharmacies }) => {
      setNearby(addDistances(pharmacies, userPos).slice(0, 3))
    })
  }, [userPos])

  return (
    <div>
      {/* Hero search bar */}
      <div className="grain-overlay bg-grad-main px-6 py-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-white/75 text-[13px] mb-1 flex items-center gap-1">
            <MapPin size={12}/> {user?.location || "Lagos, Nigeria"}
          </p>
          <h1 className="font-display text-white text-[clamp(24px,4vw,40px)] font-black mb-3">
            Hello, {user?.name?.split(' ')[0] || 'there'}<br/>What medicine do you need?
          </h1>
          <div className="bg-white rounded-2xl p-3 px-4 flex gap-3 max-w-[600px] items-center">
            <Search size={20} className="text-muted shrink-0"/>
            <input placeholder="Search medicine name..." onClick={() => navigate('/search')} readOnly
              className="flex-1 border-none outline-none text-base text-text cursor-pointer bg-transparent" />
            <button onClick={() => navigate('/search')}
              className="bg-grad-main border-none rounded-xl px-5 py-2.5 text-white font-bold cursor-pointer text-sm">
              Search
            </button>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["Paracetamol","Amoxicillin","Augmentin","Metformin","Amlodipine"].map(s => (
              <button key={s} onClick={() => navigate('/search')}
                className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs cursor-pointer font-medium hover:bg-white/25 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Alert banner */}
        <div className="bg-yellow-50 border border-warning rounded-[14px] px-5 py-3.5 mb-7 flex gap-3 items-center flex-wrap">
          <AlertTriangle size={22} className="text-warning shrink-0"/>
          <div>
            <strong className="text-yellow-800 text-sm">NAFDAC Alert: </strong>
            <span className="text-yellow-800 text-[13px]">Counterfeit Tramadol 200mg reported across Lagos. Only purchase from verified pharmacies.</span>
          </div>
          <button onClick={() => navigate('/alerts')}
            className="ml-auto px-3.5 py-1.5 rounded-xl border border-warning bg-transparent text-yellow-800 text-xs font-semibold cursor-pointer whitespace-nowrap hover:bg-yellow-100 transition-colors">
            View All Alerts
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5 mb-9">
          {[
            { Icon: Search,     label:"Search Medicine", sub:"AI-powered search",  page:"search", color:'#1B3FC4' },
            { Icon: Map,        label:"Find Pharmacies", sub:"Near me now",        page:"map",    color:'#16A34A' },
            { Icon: Bell,       label:"Safety Alerts",   sub:"Active alerts",      page:"alerts", color:'#D97706' },
            { Icon: DollarSign, label:"Budget Search",   sub:"Filter by price",    page:"search", color:'#0D9488' },
          ].map(a => (
            <Card key={a.label} onClick={() => navigate(`/${a.page}`)}
              className="flex items-center gap-3.5 !p-4 transition-all duration-150 cursor-pointer"
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

        {/* Nearby pharmacies */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold">Nearby Pharmacies</h2>
          <button onClick={() => navigate('/map')}
            className="text-blue-brand bg-transparent border-none font-semibold text-sm cursor-pointer hover:underline">
            View map →
          </button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
          {nearby.map(p => (
            <Card key={p.id} className="!p-4 cursor-pointer hover:shadow-md transition-all duration-150"
              onClick={() => navigate(`/pharmacy/${p.id}`)}>
              <div className="flex justify-between mb-1.5">
                <span className="font-bold text-sm">{p.name}</span>
                <Badge status={p.status}/>
              </div>
              {!!p.nafdac_verified && (
                <p className="text-green-brand text-xs font-semibold mb-1 flex items-center gap-1">
                  <CheckCircle2 size={11}/> NAFDAC Verified
                </p>
              )}
              <p className="text-muted text-xs mb-0.5 flex items-center gap-1.5">
                <MapPin size={10}/> {p.location}
                {p.distKm < 999 && <span className="text-blue-brand font-semibold">· {fmtKm(p.distKm)}</span>}
              </p>
              <p className="text-muted text-xs mb-1 flex items-center gap-1.5">
                <Star size={10}/> {p.rating}
                {p.review_count > 0 && <span>({p.review_count})</span>}
              </p>
              {p.hours && (
                <p className="text-muted text-xs mb-3 flex items-center gap-1"><Clock size={10}/> {p.hours}</p>
              )}
              <div className="flex gap-2 mt-auto">
                <a className="flex-1" href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                  target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                  <Btn full variant="secondary" size="sm">Directions</Btn>
                </a>
                <a className="flex-1" href={`tel:${p.phone}`} onClick={e => e.stopPropagation()}>
                  <Btn full size="sm">Call</Btn>
                </a>
                <button onClick={() => navigate(`/pharmacy/${p.id}`)}
                  className="p-2 rounded-xl border border-border bg-white text-muted hover:text-text hover:bg-surface transition-colors">
                  <ChevronRight size={15}/>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

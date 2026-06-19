import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Phone, Navigation, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { haversineKm, fmtKm, LAGOS_DEFAULT } from '@/lib/utils'
import { api } from '@/lib/api'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── MAP PAGE ───────────────────────────────────────────────── */
export function MapPage() {
  const navigate = useNavigate()
  const [sel, setSel] = useState(null)
  const [filter, setFilter] = useState("All")
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)
  const [userPos, setUserPos] = useState(LAGOS_DEFAULT)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }, [])

  useEffect(() => {
    api.pharmacies('pharmacy').then(({ pharmacies }) => {
      const lats = pharmacies.map(p => p.lat), lngs = pharmacies.map(p => p.lng)
      const minLat = Math.min(...lats), maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
      const withXY = pharmacies.map(p => ({
        ...p,
        x: 60 + ((p.lng - minLng) / ((maxLng - minLng) || 1)) * 420,
        y: 380 - ((p.lat - minLat) / ((maxLat - minLat) || 1)) * 320,
        distKm: (p.lat && p.lng) ? haversineKm(userPos.lat, userPos.lng, p.lat, p.lng) : 999,
      })).sort((a, b) => a.distKm - b.distKm)
      setPharmacies(withXY)
    }).finally(() => setLoading(false))
  }, [userPos])

  const dc = { "In Stock":"#16A34A", "Low Stock":"#D97706", "Out of Stock":"#DC2626" }
  const filtered = filter === "All" ? pharmacies : pharmacies.filter(p => p.status === filter)
  const selP = sel !== null ? pharmacies.find(p => p.id === sel) : null

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-1">Nearby Pharmacies</h1>
      <p className="text-muted text-sm mb-6">
        {pharmacies.length > 0
          ? `${pharmacies.length} pharmacies found · sorted by distance`
          : 'Finding pharmacies near you...'}
      </p>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All","In Stock","Low Stock","Out of Stock"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full border-[1.5px] font-semibold text-[13px] cursor-pointer transition-colors',
              filter === f ? 'border-blue-brand bg-blue-light text-blue-brand' : 'border-border bg-white text-muted hover:border-blue-brand/50'
            )}>
            {f}
          </button>
        ))}
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* SVG Map */}
        <div className="bg-[#E8F0E8] rounded-[20px] overflow-hidden border border-border relative min-h-[420px]">
          <svg width="100%" height="420" viewBox="0 0 540 420">
            {[80,180,280,380].map(y => <line key={y} x1="0" y1={y} x2="540" y2={y} stroke="white" strokeWidth="14"/>)}
            {[100,220,340,460].map(x => <line key={x} x1={x} y1="0" x2={x} y2="420" stroke="white" strokeWidth="14"/>)}
            {[[10,10,90,170],[110,10,210,170],[230,10,330,170],[350,10,450,170],
              [10,190,90,270],[110,190,210,270],[230,190,330,270],[350,190,450,270],
              [10,290,90,410],[110,290,210,410],[230,290,330,410]].map((b,i) => (
              <rect key={i} x={b[0]} y={b[1]} width={b[2]-b[0]} height={b[3]-b[1]} fill="#C8DEC8" rx="6"/>
            ))}
            <text x="12" y="340" fontSize="11" fill="#666">Surulere</text>
            <text x="360" y="340" fontSize="11" fill="#666">Lagos Island</text>
            <circle cx="270" cy="210" r="16" fill="#1B3FC4" opacity="0.18"/>
            <circle cx="270" cy="210" r="9"  fill="#1B3FC4"/>
            <circle cx="270" cy="210" r="4"  fill="white"/>
            <text x="270" y="234" textAnchor="middle" fontSize="10" fill="#1B3FC4" fontWeight="bold">You</text>
            {filtered.map(p => (
              <g key={p.id} onClick={() => setSel(sel===p.id?null:p.id)} style={{ cursor:'pointer' }}>
                <circle cx={p.x} cy={p.y} r={sel===p.id?22:16} fill={dc[p.status]} opacity="0.18"/>
                <circle cx={p.x} cy={p.y} r={sel===p.id?14:11} fill={dc[p.status]}/>
                <text x={p.x} y={p.y+4} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">+</text>
                {sel===p.id && <text x={p.x} y={p.y-20} textAnchor="middle" fontSize="10" fill="#0F172A" fontWeight="bold">{p.name.split(" ")[0]}</text>}
              </g>
            ))}
          </svg>
          <div className="absolute top-3 right-3 bg-white/95 rounded-xl p-2.5 px-3.5 backdrop-blur-sm">
            {[["In Stock","#16A34A"],["Low Stock","#D97706"],["Out of Stock","#DC2626"]].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1.5 mb-1 text-xs last:mb-0">
                <span className="size-2.5 rounded-full inline-block" style={{ background: c }} />
                <span className="text-muted font-medium">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar list */}
        <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[500px]">
          {loading && <p className="text-muted text-sm">Loading pharmacies...</p>}

          {/* Selected pharmacy expanded card */}
          {selP && (
            <Card className="fade-in border-2 border-blue-brand mb-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-extrabold">{selP.name}</h3>
                <Badge status={selP.status}/>
              </div>
              <p className="text-muted text-xs mb-0.5 flex items-center gap-1.5">
                <Star size={11}/> {selP.rating}
                {selP.review_count > 0 && <span>({selP.review_count})</span>}
                {selP.nafdac_verified ? ' · NAFDAC Verified' : ''}
              </p>
              <p className="text-muted text-xs mb-0.5 flex items-center gap-1">
                <MapPin size={11}/> {selP.location}
                {selP.distKm < 999 && <span className="text-blue-brand font-semibold ml-1">· {fmtKm(selP.distKm)}</span>}
              </p>
              {selP.hours && (
                <p className="text-muted text-xs mb-2.5 flex items-center gap-1"><Clock size={11}/> {selP.hours}</p>
              )}
              <div className="flex gap-2">
                <a className="flex-1" href={`https://www.google.com/maps/search/?api=1&query=${selP.lat},${selP.lng}`} target="_blank" rel="noreferrer">
                  <Btn full variant="secondary" size="sm" className="gap-1"><Navigation size={12}/> Directions</Btn>
                </a>
                <a className="flex-1" href={`tel:${selP.phone}`}>
                  <Btn full size="sm" className="gap-1"><Phone size={12}/> Call</Btn>
                </a>
              </div>
              <button onClick={() => navigate(`/pharmacy/${selP.id}`)}
                className="w-full mt-2 text-blue-brand text-xs font-semibold text-center bg-transparent border-0 cursor-pointer hover:underline flex items-center justify-center gap-1">
                View full profile <ChevronRight size={13}/>
              </button>
            </Card>
          )}

          {/* All pharmacy list items */}
          {filtered.map(p => (
            <Card key={p.id} onClick={() => setSel(sel===p.id?null:p.id)}
              className={cn('!p-3.5 transition-all duration-150 cursor-pointer', sel===p.id ? 'border-[1.5px] border-blue-brand' : 'border-[1.5px] border-border')}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{p.name}</span>
                <Badge status={p.status}/>
              </div>
              <p className="text-muted text-xs flex items-center gap-1.5">
                <MapPin size={10}/> {p.location}
                {p.distKm < 999 && <span className="text-blue-brand font-semibold">· {fmtKm(p.distKm)}</span>}
              </p>
              <p className="text-muted text-xs flex items-center gap-1.5 mt-0.5">
                <Star size={10}/> {p.rating}
                {p.review_count > 0 && <span>({p.review_count})</span>}
                {p.hours && <><Clock size={10} className="ml-1"/> {p.hours}</>}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

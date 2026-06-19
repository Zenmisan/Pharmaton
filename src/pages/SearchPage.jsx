import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Loader2, Bot, MapPin, Star, CheckCircle2, AlertTriangle,
  Navigation, Phone, ChevronLeft, DollarSign, Tag, Clock, ChevronRight,
} from 'lucide-react'
import { api } from '@/lib/api'
import { callAI } from '@/lib/ai'
import { haversineKm, fmtKm, LAGOS_DEFAULT } from '@/lib/utils'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── SEARCH PAGE ────────────────────────────────────────────── */
export function SearchPage() {
  const navigate = useNavigate()
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [pharmacies, setPharmacies] = useState(null)
  const [budget, setBudget] = useState("")
  const [lang, setLang] = useState("English")
  const [userPos, setUserPos] = useState(LAGOS_DEFAULT)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }, [])

  async function doSearch(overrideQ) {
    const query = overrideQ ?? q
    if (!query.trim()) return
    if (overrideQ) setQ(overrideQ)
    setLoading(true); setAiResult(null); setPharmacies(null)

    const systemPrompt = `You are PharmaConnect AI for Nigeria. Respond ONLY with valid JSON, no markdown${lang !== "English" ? `. Respond in ${lang}` : ""}:
{
  "drugName": "full medicine name",
  "category": "drug category",
  "uses": "what it treats in one clear sentence",
  "dosageForm": "tablet/syrup/injection/etc",
  "brandedVersion": {
    "name": "most common branded name in Nigeria",
    "priceRange": "₦XXX – ₦XXX",
    "manufacturer": "manufacturer name"
  },
  "genericVersion": {
    "name": "generic/unbranded name",
    "priceRange": "₦XXX – ₦XXX",
    "note": "short note on bioequivalence or quality"
  },
  "localAlternatives": [
    { "name": "alternative drug name", "type": "generic|herbal|off-brand", "priceRange": "₦XXX – ₦XXX", "note": "brief note" }
  ],
  "budgetOption": "most affordable verified option if budget is tight",
  "availability": "general availability status in Nigerian pharmacies",
  "commonBrands": ["brand1", "brand2"],
  "alternatives": ["alternative1", "alternative2"],
  "safetyNote": "one important safety or dispensing note for Nigeria"
}`

    const userPrompt = `Search for medicine: "${query}"${budget ? `. My budget is ${budget} — prioritize affordable options and highlight what fits my budget` : ""}${lang !== "English" ? `. Respond in ${lang}.` : ""}`

    const raw = await callAI(systemPrompt, userPrompt)
    try {
      setAiResult(JSON.parse(raw.replace(/```json|```/g, "").trim()))
    } catch {
      setAiResult({
        drugName: query,
        uses: "Medicine found. Check with your pharmacist for full details.",
        alternatives: [],
        safetyNote: "",
        availability: "Available at select pharmacies",
      })
    }

    try {
      const { pharmacies } = await api.search(query)
      // Add distances + sort by proximity
      let results = pharmacies.map(p => ({
        ...p,
        distKm: (p.lat && p.lng) ? haversineKm(userPos.lat, userPos.lng, p.lat, p.lng) : 999,
      })).sort((a, b) => a.distKm - b.distKm)
      // Filter by budget if provided
      if (budget) {
        const budgetNum = parseInt(budget.replace(/[^\d]/g, ''), 10)
        if (!isNaN(budgetNum)) {
          const filtered = results.filter(p => {
            const pNum = parseInt(String(p.price || '').replace(/[^\d]/g, ''), 10)
            return isNaN(pNum) || pNum <= budgetNum
          })
          results = filtered.length > 0 ? filtered : results
        }
      }
      setPharmacies(results)
    } catch {
      setPharmacies([])
    }
    setLoading(false)
  }

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-border bg-white hover:bg-surface transition-colors">
          <ChevronLeft size={18}/>
        </button>
        <div>
          <h1 className="text-[26px] font-extrabold leading-tight">Search Medicines</h1>
          <p className="text-muted text-sm">AI-powered · branded vs generic · local alternatives · budget aware</p>
        </div>
      </div>

      <Card className="mb-6 !p-5">
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr auto auto' }}>
          <div>
            <label className="text-[11px] font-bold text-muted block mb-1.5">MEDICINE NAME</label>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()}
              placeholder="e.g. Paracetamol, Augmentin, Insulin..."
              className="w-full border-[1.5px] border-border rounded-xl px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-blue-brand"/>
          </div>
          <div>
            <label className="text-[11px] font-bold text-muted block mb-1.5">LANGUAGE</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-text h-full">
              {["English","Yoruba","Hausa","Igbo","French"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-muted block mb-1.5">BUDGET</label>
            <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. ₦500"
              className="w-[120px] border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
          </div>
        </div>
        <div className="mt-3.5 flex gap-3 items-center flex-wrap">
          <Btn size="lg" onClick={() => doSearch()} className="min-w-[160px]">
            {loading ? <Loader2 size={16} className="spin"/> : <Search size={16}/>}
            Search
          </Btn>
          <div className="flex flex-wrap gap-2">
            {["Paracetamol","Amoxicillin","Metformin","Augmentin","Amlodipine","Insulin"].map(s => (
              <button key={s} onClick={() => doSearch(s)}
                className="px-3 py-1.5 rounded-full border border-border bg-white text-muted text-xs cursor-pointer font-medium hover:border-blue-brand/50 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="fade-in mb-5 text-center !p-10">
          <Bot size={40} className="text-blue-brand mx-auto mb-3"/>
          <p className="font-bold text-base mb-1">PharmaConnect AI is searching...</p>
          <p className="text-muted text-sm">Comparing branded · generic · local alternatives</p>
        </Card>
      )}

      {aiResult && !loading && (
        <Card className="fade-in mb-5 border-[1.5px] border-blue-brand/20"
          style={{ background: 'linear-gradient(135deg,rgba(232,237,251,0.4),rgba(220,252,231,0.4))' }}>
          <div className="flex gap-3.5 items-start mb-5">
            <div className="size-12 rounded-[14px] bg-grad-main flex items-center justify-center shrink-0 text-white">
              <Bot size={22}/>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black mb-0.5">{aiResult.drugName}</h2>
              {aiResult.category && <p className="text-muted text-[13px]">{aiResult.category}{aiResult.dosageForm ? ` · ${aiResult.dosageForm}` : ""}</p>}
              {aiResult.uses && <p className="text-[13px] text-text mt-1">{aiResult.uses}</p>}
            </div>
            <span className="bg-green-light text-green-brand text-[11px] font-bold rounded-lg px-2.5 py-1 shrink-0">AI VERIFIED</span>
          </div>

          {/* Branded vs Generic comparison */}
          {(aiResult.brandedVersion || aiResult.genericVersion) && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mb-4">
              {aiResult.brandedVersion && (
                <div className="bg-white rounded-xl p-3.5 border-l-4 border-blue-brand">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Tag size={13} className="text-blue-brand"/>
                    <span className="text-[11px] font-bold text-muted">BRANDED</span>
                  </div>
                  <p className="font-bold text-sm mb-0.5">{aiResult.brandedVersion.name}</p>
                  {aiResult.brandedVersion.manufacturer && <p className="text-muted text-xs mb-1">{aiResult.brandedVersion.manufacturer}</p>}
                  {aiResult.brandedVersion.priceRange && (
                    <p className="text-blue-brand font-bold text-sm flex items-center gap-1">
                      <DollarSign size={12}/> {aiResult.brandedVersion.priceRange}
                    </p>
                  )}
                </div>
              )}
              {aiResult.genericVersion && (
                <div className="bg-white rounded-xl p-3.5 border-l-4 border-green-brand">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 size={13} className="text-green-brand"/>
                    <span className="text-[11px] font-bold text-muted">GENERIC / UNBRANDED</span>
                  </div>
                  <p className="font-bold text-sm mb-0.5">{aiResult.genericVersion.name}</p>
                  {aiResult.genericVersion.note && <p className="text-muted text-xs mb-1">{aiResult.genericVersion.note}</p>}
                  {aiResult.genericVersion.priceRange && (
                    <p className="text-green-brand font-bold text-sm flex items-center gap-1">
                      <DollarSign size={12}/> {aiResult.genericVersion.priceRange}
                    </p>
                  )}
                </div>
              )}
              {aiResult.budgetOption && (
                <div className="bg-white rounded-xl p-3.5 border-l-4 border-warning">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <DollarSign size={13} className="text-warning"/>
                    <span className="text-[11px] font-bold text-muted">BUDGET PICK</span>
                  </div>
                  <p className="text-sm text-text">{aiResult.budgetOption}</p>
                </div>
              )}
            </div>
          )}

          {/* Local alternatives */}
          {aiResult.localAlternatives?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-muted mb-2">LOCAL ALTERNATIVES</p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
                {aiResult.localAlternatives.map(alt => (
                  <div key={alt.name} className="bg-white rounded-xl px-3 py-2.5 border border-border">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className="font-semibold text-[13px]">{alt.name}</p>
                      <span className="text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0"
                        style={{ background: alt.type === 'generic' ? '#dcfce7' : alt.type === 'herbal' ? '#fef9c3' : '#ede9fe',
                                 color: alt.type === 'generic' ? '#16a34a' : alt.type === 'herbal' ? '#ca8a04' : '#7c3aed' }}>
                        {alt.type}
                      </span>
                    </div>
                    {alt.priceRange && <p className="text-green-mid font-bold text-xs">{alt.priceRange}</p>}
                    {alt.note && <p className="text-muted text-[11px] mt-0.5">{alt.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI alternatives as chips */}
          {aiResult.alternatives?.length > 0 && (
            <div className="mb-3.5">
              <p className="text-xs font-bold text-muted mb-2">ALSO SEARCH FOR</p>
              <div className="flex flex-wrap gap-2">
                {aiResult.alternatives.map(a => (
                  <button key={a} onClick={() => doSearch(a)}
                    className="px-3 py-1.5 rounded-full border-[1.5px] border-green-mid bg-green-light text-green-brand text-[13px] font-semibold cursor-pointer hover:bg-green-light/80 transition-colors">
                    {a} →
                  </button>
                ))}
              </div>
            </div>
          )}

          {aiResult.availability && (
            <p className="text-muted text-[13px] mb-2"><strong>Availability:</strong> {aiResult.availability}</p>
          )}

          {aiResult.safetyNote && (
            <div className="bg-yellow-50 rounded-xl px-3.5 py-2.5 border border-warning/40 flex items-start gap-2 mt-2">
              <AlertTriangle size={15} className="text-warning mt-0.5 shrink-0"/>
              <p className="text-yellow-800 text-[13px]"><strong>Safety Note:</strong> {aiResult.safetyNote}</p>
            </div>
          )}
        </Card>
      )}

      {pharmacies && !loading && (
        <div className="fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <MapPin size={18}/> {pharmacies.length} Pharmacies Near You
            </h3>
            {budget && <span className="text-xs bg-blue-light text-blue-brand font-bold px-3 py-1.5 rounded-full">Filtered by {budget}</span>}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
            {pharmacies.map((p, i) => (
              <Card key={`${p.id}-${i}`} className="transition-all duration-150 hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/pharmacy/${p.id}`)}>
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold text-[15px]">{p.name}</h4>
                  <Badge status={p.status}/>
                </div>
                {!!p.nafdac_verified && (
                  <p className="text-green-brand text-xs font-semibold mb-1.5 flex items-center gap-1">
                    <CheckCircle2 size={12}/> NAFDAC Verified
                  </p>
                )}
                <p className="text-muted text-xs mb-0.5 flex items-center gap-1.5">
                  <MapPin size={10}/> {p.location}
                  {p.distKm < 999 && <span className="text-blue-brand font-semibold">· {fmtKm(p.distKm)}</span>}
                </p>
                <p className="text-muted text-xs mb-0.5 flex items-center gap-1.5">
                  <Star size={10}/> {p.rating}
                  {p.review_count > 0 && <span>({p.review_count} reviews)</span>}
                  <span className="text-muted">· {p.medicine} ({p.stock} in stock)</span>
                </p>
                {p.hours && (
                  <p className="text-muted text-xs mb-1 flex items-center gap-1"><Clock size={10}/> {p.hours}</p>
                )}
                <p className="text-green-mid font-bold text-[16px] mb-3.5">₦{p.price}</p>
                <div className="flex gap-2">
                  <a className="flex-1" href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                    target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                    <Btn full variant="secondary" size="sm" className="gap-1">
                      <Navigation size={12}/> Directions
                    </Btn>
                  </a>
                  <a className="flex-1" href={`tel:${p.phone}`} onClick={e => e.stopPropagation()}>
                    <Btn full size="sm" className="gap-1">
                      <Phone size={12}/> Call
                    </Btn>
                  </a>
                  <button onClick={() => navigate(`/pharmacy/${p.id}`)}
                    className="p-2 rounded-xl border border-border bg-white text-muted hover:text-text transition-colors">
                    <ChevronRight size={14}/>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

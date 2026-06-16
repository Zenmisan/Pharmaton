import { useState } from 'react'
import {
  Search, Loader2, Bot, MapPin, Star, CheckCircle2, AlertTriangle, Navigation, Phone,
} from 'lucide-react'
import { api } from '@/lib/api'
import { callAI } from '@/lib/ai'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── SEARCH PAGE ────────────────────────────────────────────── */
export function SearchPage() {
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [pharmacies, setPharmacies] = useState(null)
  const [budget, setBudget] = useState("")
  const [lang, setLang] = useState("English")

  async function doSearch() {
    if (!q.trim()) return
    setLoading(true); setAiResult(null); setPharmacies(null)
    const raw = await callAI(
      `You are PharmaConnect AI for Nigeria. Respond ONLY with valid JSON, no markdown, no extra text${lang !== "English" ? `. Respond in ${lang}` : ""}:
{"drugName":"full medicine name","category":"drug category","uses":"what it treats in one clear sentence","alternatives":["alternative1","alternative2","alternative3"],"safetyNote":"one important safety or dispensing note for Nigeria","availability":"general availability status in Nigerian pharmacies","dosageForm":"tablet/syrup/injection etc","commonBrands":["brand1","brand2"]}`,
      `Search for medicine: "${q}"${budget ? ` Budget: ${budget}` : ""}${lang !== "English" ? ` Respond in ${lang}.` : ""}`
    )
    try { setAiResult(JSON.parse(raw.replace(/```json|```/g, "").trim())) }
    catch { setAiResult({ drugName: q, uses: "Medicine found. Check with your pharmacist for full details.", alternatives: [], safetyNote: "", availability: "Available at select pharmacies" }) }
    try {
      const { pharmacies } = await api.search(q)
      setPharmacies(pharmacies)
    } catch { setPharmacies([]) }
    setLoading(false)
  }

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10">
      <h1 className="text-[28px] font-extrabold mb-1.5">Search for Medicines</h1>
      <p className="text-muted mb-8">AI-powered search with local language support, spelling correction and alternatives</p>

      <Card className="mb-6 !p-6">
        <div className="grid gap-3 items-end" style={{ gridTemplateColumns: '1fr auto auto' }}>
          <div>
            <label className="text-xs font-bold text-muted block mb-1.5">MEDICINE NAME</label>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key==="Enter"&&doSearch()}
              placeholder="e.g. Paracetamol, Augmentin, Insulin..."
              className="w-full border-[1.5px] border-border rounded-xl px-4 py-3 text-[15px] outline-none transition-colors focus:border-blue-brand"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted block mb-1.5">LANGUAGE</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="border-[1.5px] border-border rounded-xl px-3.5 py-3 text-sm outline-none bg-white text-text">
              {["English","Yoruba","Hausa","Igbo","French"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted block mb-1.5">BUDGET (OPTIONAL)</label>
            <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. ₦500"
              className="w-[130px] border-[1.5px] border-border rounded-xl px-3.5 py-3 text-sm outline-none" />
          </div>
        </div>
        <div className="mt-4 flex gap-3 items-center flex-wrap">
          <Btn size="lg" onClick={doSearch} className="min-w-[160px]">
            {loading ? <Loader2 size={16} className="spin"/> : <Search size={16}/>}
            Search Medicine
          </Btn>
          <div className="flex flex-wrap gap-2">
            {["Paracetamol","Amoxicillin","Metformin","Augmentin","Amlodipine","Insulin"].map(s => (
              <button key={s} onClick={() => setQ(s)}
                className="px-3.5 py-1.5 rounded-full border border-border bg-white text-muted text-xs cursor-pointer font-medium hover:border-blue-brand/50 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="fade-in mb-5 text-center !p-10">
          <div className="flex justify-center mb-3"><Bot size={40} className="text-blue-brand"/></div>
          <p className="font-bold text-base mb-1">PharmaConnect AI is searching...</p>
          <p className="text-muted text-sm">Checking spelling · Matching drugs · Finding alternatives</p>
        </Card>
      )}

      {aiResult && !loading && (
        <Card className="fade-in mb-5 border-[1.5px] border-blue-brand/25" style={{ background: 'linear-gradient(135deg,rgba(232,237,251,0.4),rgba(220,252,231,0.4))' }}>
          <div className="flex gap-3.5 items-start mb-4">
            <div className="size-12 rounded-[14px] bg-grad-main flex items-center justify-center shrink-0 text-white">
              <Bot size={22}/>
            </div>
            <div>
              <h2 className="text-xl font-black mb-0.5">{aiResult.drugName}</h2>
              {aiResult.category && <p className="text-muted text-[13px]">{aiResult.category}{aiResult.dosageForm ? ` · ${aiResult.dosageForm}` : ""}</p>}
            </div>
            <span className="ml-auto bg-green-light text-green-brand text-[11px] font-bold rounded-lg px-2.5 py-1">AI VERIFIED</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 mb-4">
            {aiResult.uses && <div className="bg-white rounded-xl p-3.5"><p className="text-[11px] font-bold text-muted mb-1">WHAT IT TREATS</p><p className="text-sm">{aiResult.uses}</p></div>}
            {aiResult.availability && <div className="bg-white rounded-xl p-3.5"><p className="text-[11px] font-bold text-muted mb-1">NIGERIA AVAILABILITY</p><p className="text-sm">{aiResult.availability}</p></div>}
            {aiResult.commonBrands?.length > 0 && <div className="bg-white rounded-xl p-3.5"><p className="text-[11px] font-bold text-muted mb-1">COMMON BRANDS</p><p className="text-sm">{aiResult.commonBrands.join(", ")}</p></div>}
          </div>
          {aiResult.alternatives?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-muted mb-2">AI-SUGGESTED ALTERNATIVES</p>
              <div className="flex flex-wrap gap-2">
                {aiResult.alternatives.map(a => (
                  <button key={a} onClick={() => { setQ(a); doSearch() }}
                    className="px-3.5 py-1.5 rounded-full border-[1.5px] border-green-mid bg-green-light text-green-brand text-[13px] font-semibold cursor-pointer hover:bg-green-light/80 transition-colors">
                    {a} →
                  </button>
                ))}
              </div>
            </div>
          )}
          {aiResult.safetyNote && (
            <div className="bg-yellow-50 rounded-xl px-3.5 py-2.5 border border-warning/40 flex items-start gap-2">
              <AlertTriangle size={15} className="text-warning mt-0.5 shrink-0"/>
              <p className="text-yellow-800 text-[13px]"><strong>Safety Note:</strong> {aiResult.safetyNote}</p>
            </div>
          )}
        </Card>
      )}

      {pharmacies && !loading && (
        <div className="fade-in">
          <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2"><MapPin size={18}/> {pharmacies.length} Pharmacies Near You</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
            {pharmacies.map((p, i) => (
              <Card key={`${p.id}-${i}`} className="transition-all duration-150 hover:shadow-md">
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold text-[15px]">{p.name}</h4><Badge status={p.status}/>
                </div>
                {!!p.nafdac_verified && <p className="text-green-brand text-xs font-semibold mb-1.5 flex items-center gap-1"><CheckCircle2 size={12}/> NAFDAC Verified</p>}
                <p className="text-muted text-xs mb-0.5 flex items-center gap-1"><MapPin size={10}/> {p.location}</p>
                <p className="text-muted text-xs mb-2 flex items-center gap-1"><Star size={10}/> {p.rating} · {p.medicine} ({p.stock} in stock)</p>
                <p className="text-green-mid font-bold text-[15px] mb-3.5">₦{p.price}</p>
                <div className="flex gap-2">
                  <a className="flex-1" href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} target="_blank" rel="noreferrer">
                    <Btn full variant="secondary" size="sm" className="gap-1"><Navigation size={12}/> Directions</Btn>
                  </a>
                  <a className="flex-1" href={`tel:${p.phone}`}>
                    <Btn full size="sm" className="gap-1"><Phone size={12}/> Call</Btn>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

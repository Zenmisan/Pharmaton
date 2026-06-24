import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Upload, Camera, ChevronRight, ChevronLeft, X,
  CheckCircle2, AlertCircle, MapPin, Star, Phone, Clock,
  Plus, Trash2, Search, Package
} from 'lucide-react'
import { api } from '@/lib/api'
import { Btn } from '@/components/ui'

const STEPS = ['input', 'confirm', 'results']

function StepBar({ step }) {
  const idx = STEPS.indexOf(step)
  const labels = ['Upload Prescription', 'Confirm Medicines', 'Find Pharmacies']
  return (
    <div className="flex items-center gap-0 mb-8">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-0 flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`size-8 rounded-full flex items-center justify-center text-[13px] font-black border-2 transition-colors ${
              i < idx ? 'bg-green-brand border-green-brand text-white' :
              i === idx ? 'bg-blue-brand border-blue-brand text-white' :
              'bg-white border-border text-muted'
            }`}>
              {i < idx ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-[11px] font-semibold mt-1.5 text-center leading-tight ${i === idx ? 'text-blue-brand' : 'text-muted'}`}>
              {label}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div className={`h-[2px] flex-1 mx-2 mb-5 ${i < idx ? 'bg-green-brand' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function PharmacyCard({ pharmacy, foundDrugs, missingDrugs, distance, highlight }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/pharmacy/${pharmacy.id}`)}
      className={`bg-white rounded-2xl border cursor-pointer hover:shadow-md transition-all p-4 ${
        highlight ? 'border-green-brand shadow-[0_0_0_2px_#15803D20]' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[15px] truncate">{pharmacy.name}</h3>
            {pharmacy.nafdac_verified === 1 && (
              <span className="text-[10px] font-bold text-green-brand bg-green-50 px-1.5 py-0.5 rounded-full shrink-0">NAFDAC ✓</span>
            )}
            {highlight && (
              <span className="text-[10px] font-bold text-white bg-green-brand px-1.5 py-0.5 rounded-full shrink-0">All in stock</span>
            )}
          </div>
          <p className="text-muted text-[12px] flex items-center gap-1 mt-0.5">
            <MapPin size={11} /> {pharmacy.location}
          </p>
          {pharmacy.hours && (
            <p className="text-muted text-[11px] flex items-center gap-1 mt-0.5">
              <Clock size={10} /> {pharmacy.hours}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[13px] font-bold text-blue-brand">{distance < 999 ? `${distance} km` : '—'}</p>
          <div className="flex items-center gap-0.5 justify-end mt-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-[12px] font-semibold">{pharmacy.rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {foundDrugs?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">Has in stock</p>
          <div className="flex flex-wrap gap-1">
            {foundDrugs.map(d => (
              <span key={d} className="text-[11px] bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full">{d}</span>
            ))}
          </div>
          {missingDrugs?.length > 0 && (
            <>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 mt-2">Not available</p>
              <div className="flex flex-wrap gap-1">
                {missingDrugs.map(d => (
                  <span key={d} className="text-[11px] bg-red-50 text-red-600 font-medium px-2 py-0.5 rounded-full">{d}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function PrescriptionPage() {
  const navigate = useNavigate()
  const fileRef = useRef()

  const [step, setStep]         = useState('input')
  const [mode, setMode]         = useState('text')     // 'text' | 'image'
  const [text, setText]         = useState('')
  const [imageFile, setImage]   = useState(null)
  const [imagePreview, setPreview] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [searching, setSearching] = useState(false)
  const [scanError, setScanError] = useState('')

  const [rawText, setRawText]   = useState('')
  const [drugs, setDrugs]       = useState([])
  const [newDrug, setNewDrug]   = useState('')

  const [results, setResults]   = useState(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function handleScan() {
    setScanError('')
    setScanning(true)
    try {
      if (mode === 'text') {
        const res = await api.prescriptionScan({ text })
        setDrugs(res.drugs)
        setRawText(res.rawText)
      } else {
        if (!imageFile) { setScanError('Select an image first'); setScanning(false); return }
        const base64 = imagePreview.split(',')[1]
        const res = await api.prescriptionScan({ imageBase64: base64, mimeType: imageFile.type })
        setDrugs(res.drugs)
        setRawText(res.rawText || '')
      }
      setStep('confirm')
    } catch (err) {
      setScanError(err.message)
    }
    setScanning(false)
  }

  async function handleSearch() {
    if (drugs.length === 0) return
    setSearching(true)
    try {
      const pos = await new Promise(resolve =>
        navigator.geolocation.getCurrentPosition(
          p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve({ lat: 6.4541, lng: 3.3947 })
        )
      )
      const res = await api.prescriptionSearch(drugs, pos.lat, pos.lng)
      setResults(res)
      setStep('results')
    } catch (err) {
      alert(err.message)
    }
    setSearching(false)
  }

  function addDrug() {
    const d = newDrug.trim()
    if (!d || drugs.includes(d)) return
    setDrugs(prev => [...prev, d])
    setNewDrug('')
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-white border-b border-border px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => step === 'input' ? navigate(-1) : setStep(STEPS[STEPS.indexOf(step) - 1])}
          className="p-2 rounded-xl border border-border hover:bg-surface transition-colors cursor-pointer">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-black text-[17px] tracking-tight">Prescription Search</h1>
          <p className="text-muted text-[12px]">Upload or type your prescription to find all medicines nearby</p>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 pt-8">
        <StepBar step={step} />

        {/* ── STEP 1: Input ── */}
        {step === 'input' && (
          <div>
            {/* Mode toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-surface rounded-2xl">
              {[
                { id: 'text', Icon: FileText, label: 'Type prescription' },
                { id: 'image', Icon: Camera, label: 'Upload photo' },
              ].map(({ id, Icon, label }) => (
                <button key={id} onClick={() => setMode(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    mode === id ? 'bg-white shadow text-blue-brand' : 'text-muted hover:text-text'
                  }`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            {mode === 'text' ? (
              <div>
                <label className="text-[11px] font-bold text-muted block mb-2 tracking-wider">
                  TYPE YOUR MEDICINES (one per line, or separate with commas)
                </label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={8}
                  placeholder={`e.g.\nParacetamol 500mg\nAmoxicillin 250mg\nOmeprazole 20mg`}
                  className="w-full border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-brand transition-colors bg-white font-[inherit] placeholder:text-subtle resize-none"
                />
              </div>
            ) : (
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-border">
                    <img src={imagePreview} alt="Prescription" className="w-full max-h-[380px] object-contain bg-surface" />
                    <button onClick={() => { setImage(null); setPreview(null) }}
                      className="absolute top-3 right-3 size-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-muted hover:border-blue-brand hover:text-blue-brand transition-colors cursor-pointer bg-white">
                    <Upload size={36} strokeWidth={1.5} />
                    <div className="text-center">
                      <p className="font-bold text-[15px] mb-1">Upload prescription photo</p>
                      <p className="text-[13px]">Tap to select — our AI reads handwritten & printed prescriptions</p>
                    </div>
                  </button>
                )}
              </div>
            )}

            {scanError && (
              <div className="mt-4 flex items-center gap-2 text-danger text-[13px] bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle size={15} /> {scanError}
              </div>
            )}

            <button onClick={handleScan} disabled={scanning || (mode === 'text' && !text.trim()) || (mode === 'image' && !imagePreview)}
              className="mt-6 w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#1B3FC4,#15803D)' }}>
              {scanning ? (
                <>
                  <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Reading prescription…
                </>
              ) : (
                <><Search size={15} /> Extract medicines</>
              )}
            </button>
          </div>
        )}

        {/* ── STEP 2: Confirm drugs ── */}
        {step === 'confirm' && (
          <div>
            {rawText && (
              <div className="bg-surface rounded-2xl p-4 mb-6">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Extracted text</p>
                <p className="text-[13px] text-muted leading-relaxed whitespace-pre-wrap">{rawText}</p>
              </div>
            )}

            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Medicines found ({drugs.length})
              </p>
              <p className="text-[11px] text-muted">Edit, add or remove below</p>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {drugs.map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5">
                  <Package size={14} className="text-blue-brand shrink-0" />
                  <input
                    value={d}
                    onChange={e => setDrugs(prev => prev.map((x, j) => j === i ? e.target.value : x))}
                    className="flex-1 text-[14px] font-medium outline-none bg-transparent"
                  />
                  <button onClick={() => setDrugs(prev => prev.filter((_, j) => j !== i))}
                    className="text-muted hover:text-danger transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <input
                value={newDrug}
                onChange={e => setNewDrug(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addDrug()}
                placeholder="Add a medicine manually…"
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors bg-white font-[inherit]"
              />
              <button onClick={addDrug}
                className="px-4 py-2.5 rounded-xl bg-blue-brand text-white font-bold text-sm cursor-pointer hover:opacity-90 flex items-center gap-1.5">
                <Plus size={14} /> Add
              </button>
            </div>

            {drugs.length === 0 && (
              <div className="text-center py-8 text-muted">
                <Package size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-[13px]">No medicines listed. Add some above.</p>
              </div>
            )}

            <button onClick={handleSearch} disabled={searching || drugs.length === 0}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#1B3FC4,#15803D)' }}>
              {searching ? (
                <>
                  <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Searching pharmacies…
                </>
              ) : (
                <><Search size={15} /> Find pharmacies near me</>
              )}
            </button>
          </div>
        )}

        {/* ── STEP 3: Results ── */}
        {step === 'results' && results && (
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {results.drugs.map(d => (
                <span key={d} className="text-[12px] bg-blue-light text-blue-brand font-semibold px-3 py-1 rounded-full">{d}</span>
              ))}
            </div>

            {results.notFoundAnywhere?.length > 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[13px] text-danger mb-1">Not found in any pharmacy</p>
                  <div className="flex flex-wrap gap-1">
                    {results.notFoundAnywhere.map(d => (
                      <span key={d} className="text-[12px] bg-red-100 text-red-700 font-medium px-2 py-0.5 rounded-full">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Full matches */}
            {results.fullMatches?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-6 rounded-full bg-green-brand flex items-center justify-center">
                    <CheckCircle2 size={13} className="text-white" />
                  </div>
                  <h2 className="font-black text-[16px] text-green-brand">
                    {results.fullMatches.length} pharmacy{results.fullMatches.length > 1 ? 'ies' : ''} with everything in stock
                  </h2>
                </div>
                <div className="flex flex-col gap-3">
                  {results.fullMatches.map(e => (
                    <PharmacyCard key={e.pharmacy.id} pharmacy={e.pharmacy}
                      foundDrugs={e.foundDrugs} missingDrugs={[]} distance={e.distance} highlight />
                  ))}
                </div>
              </div>
            )}

            {/* Smart combination */}
            {results.bestCombination && results.fullMatches?.length === 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-6 rounded-full bg-blue-brand flex items-center justify-center">
                    <span className="text-white text-[11px] font-black">✦</span>
                  </div>
                  <h2 className="font-black text-[16px] text-blue-brand">Best combination</h2>
                </div>
                <p className="text-muted text-[13px] mb-4 ml-8">
                  No single pharmacy has everything — visit these {results.bestCombination.pharmacies.length} to get all your medicines.
                </p>
                <div className="flex flex-col gap-3">
                  {results.bestCombination.pharmacies.map((e, i) => (
                    <div key={e.pharmacy.id}>
                      <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">Stop {i + 1}</p>
                      <PharmacyCard pharmacy={e.pharmacy} foundDrugs={e.foundDrugs}
                        missingDrugs={e.missingDrugs} distance={e.distance} />
                    </div>
                  ))}
                </div>
                {results.bestCombination.stillMissing?.length > 0 && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-[13px] font-bold text-amber-700 mb-1">Still unavailable after all stops</p>
                    <div className="flex flex-wrap gap-1">
                      {results.bestCombination.stillMissing.map(d => (
                        <span key={d} className="text-[12px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* All partial matches */}
            {results.partialMatches?.length > 0 && (
              <div>
                <h2 className="font-black text-[15px] mb-4 text-muted">Other pharmacies with partial stock</h2>
                <div className="flex flex-col gap-3">
                  {results.partialMatches.slice(0, 8).map(e => (
                    <PharmacyCard key={e.pharmacy.id} pharmacy={e.pharmacy}
                      foundDrugs={e.foundDrugs} missingDrugs={e.missingDrugs} distance={e.distance} />
                  ))}
                </div>
              </div>
            )}

            {results.fullMatches?.length === 0 && results.partialMatches?.length === 0 && (
              <div className="text-center py-16 text-muted">
                <Search size={48} className="mx-auto mb-3 opacity-20" />
                <p className="font-bold text-[15px] mb-1">No results found</p>
                <p className="text-[13px]">Try searching for individual medicines using the Search page.</p>
                <Btn variant="secondary" className="mt-4" onClick={() => navigate('/search')}>Go to Search</Btn>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border">
              <button onClick={() => { setStep('input'); setResults(null); setText(''); setImage(null); setPreview(null); setDrugs([]) }}
                className="text-[13px] text-muted font-semibold flex items-center gap-1 hover:text-text transition-colors cursor-pointer">
                <ChevronLeft size={14} /> Search another prescription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

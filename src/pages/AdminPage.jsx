import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'
import {
  CheckCircle2, XCircle, Clock, ExternalLink, RefreshCw,
  ShieldCheck, Search, ChevronDown, AlertTriangle
} from 'lucide-react'

const PCN_LOOKUP = 'https://www.pcn.gov.ng/index.php/pharmacists/verify-licence?q='

const STATUS_TAB = [
  { id: '',          label: 'All' },
  { id: 'pending',   label: 'Pending' },
  { id: 'verified',  label: 'Verified' },
  { id: 'rejected',  label: 'Rejected' },
]

const STATUS_STYLE = {
  pending:  { color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200', Icon: Clock },
  verified: { color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200', Icon: CheckCircle2 },
  rejected: { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',   Icon: XCircle },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${s.color} ${s.bg} ${s.border}`}>
      <s.Icon size={10} /> {status}
    </span>
  )
}

function PharmacistRow({ p, secret, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes]       = useState(p.pcn_notes || '')
  const [busy, setBusy]         = useState(false)

  async function act(fn) {
    setBusy(true)
    try { await fn(); onRefresh() } catch (e) { alert(e.message) }
    setBusy(false)
  }

  const pcnUrl = p.license_number
    ? `${PCN_LOOKUP}${encodeURIComponent(p.license_number)}`
    : 'https://www.pcn.gov.ng'

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-surface/50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[14px]">{p.org_name || p.name}</span>
            <StatusBadge status={p.pcn_status} />
          </div>
          <p className="text-muted text-[12px] mt-0.5">
            {p.name} · {p.email}
          </p>
          <p className="text-[12px] mt-0.5">
            <span className="font-mono text-blue-brand font-bold">{p.license_number || '—'}</span>
            {p.location && <span className="text-muted ml-2">· {p.location}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={pcnUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-brand hover:underline px-3 py-1.5 rounded-lg border border-blue-brand/20 bg-blue-50"
          >
            <ExternalLink size={12} /> Check PCN
          </a>
          <ChevronDown
            size={16}
            className={`text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 py-4 bg-surface/30 flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3 text-[12px]">
            <div>
              <p className="text-muted font-bold mb-0.5">PCN Registration #</p>
              <p className="font-mono font-bold text-[13px]">{p.license_number || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-muted font-bold mb-0.5">Registered</p>
              <p>{p.created_at?.slice(0, 10) || '—'}</p>
            </div>
            {p.pcn_notes && (
              <div className="sm:col-span-2">
                <p className="text-muted font-bold mb-0.5">Previous Notes</p>
                <p className="text-danger text-[12px]">{p.pcn_notes}</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted block mb-1 tracking-wider">
              NOTES (optional — shown to pharmacist on rejection)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. License number not found in PCN registry as of 2026-06-24"
              className="w-full border border-border rounded-xl px-3 py-2 text-[13px] outline-none focus:border-blue-brand transition-colors bg-white font-[inherit] resize-none"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              disabled={busy || p.pcn_status === 'verified'}
              onClick={() => act(() => adminApi.verify(secret, p.id, notes))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-brand text-white text-[13px] font-bold disabled:opacity-40 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 size={13} /> Mark Verified
            </button>
            <button
              disabled={busy || p.pcn_status === 'rejected'}
              onClick={() => act(() => adminApi.reject(secret, p.id, notes))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-danger text-white text-[13px] font-bold disabled:opacity-40 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <XCircle size={13} /> Reject
            </button>
            {p.pcn_status !== 'pending' && (
              <button
                disabled={busy}
                onClick={() => act(() => adminApi.reset(secret, p.id))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-[13px] font-semibold text-muted cursor-pointer hover:bg-surface transition-colors"
              >
                <RefreshCw size={12} /> Reset to Pending
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminPage() {
  const [secret, setSecret]   = useState(() => sessionStorage.getItem('admin_key') || '')
  const [authed, setAuthed]   = useState(false)
  const [input, setInput]     = useState('')
  const [tab, setTab]         = useState('pending')
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [q, setQ]             = useState('')

  async function load(key, status) {
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.list(key || secret, status)
      setData(res.pharmacists)
      setAuthed(true)
      sessionStorage.setItem('admin_key', key || secret)
    } catch (e) {
      setError(e.message)
      if (e.message === 'Forbidden') { setAuthed(false); sessionStorage.removeItem('admin_key') }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (secret) load(secret, tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  async function login(e) {
    e.preventDefault()
    setSecret(input)
    await load(input, tab)
  }

  const filtered = data.filter(p =>
    !q || [p.name, p.org_name, p.email, p.license_number].some(v => v?.toLowerCase().includes(q.toLowerCase()))
  )

  const counts = {
    pending:  data.filter(p => p.pcn_status === 'pending').length,
    verified: data.filter(p => p.pcn_status === 'verified').length,
    rejected: data.filter(p => p.pcn_status === 'rejected').length,
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl border border-border p-8 w-full max-w-[380px] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={22} className="text-blue-brand" />
            <h1 className="font-black text-[18px]">PharmaConnect Admin</h1>
          </div>
          <form onSubmit={login} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-muted block mb-1.5 tracking-wider">ADMIN SECRET KEY</label>
              <input
                type="password"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter ADMIN_SECRET"
                required
                className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-brand transition-colors bg-white font-[inherit]"
              />
            </div>
            {error && (
              <p className="text-danger text-[13px] flex items-center gap-1.5">
                <AlertTriangle size={13} /> {error}
              </p>
            )}
            <button type="submit"
              className="w-full py-3 rounded-xl bg-blue-brand text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-blue-brand" />
          <h1 className="font-black text-[17px]">PCN Verification Queue</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => load(secret, tab)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-text cursor-pointer transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => { setAuthed(false); sessionStorage.removeItem('admin_key') }}
            className="text-[13px] font-semibold text-danger cursor-pointer hover:underline">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pending Review', count: counts.pending,  color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Verified',       count: counts.verified, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Rejected',       count: counts.rejected, color: 'text-red-700',   bg: 'bg-red-50'   },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-[12px] font-semibold text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* PCN portal tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-3">
          <ExternalLink size={15} className="text-blue-brand shrink-0 mt-0.5" />
          <p className="text-[13px] text-blue-700">
            <strong>Workflow:</strong> Click "Check PCN" on any pharmacist to open the PCN Practitioners Register in a new tab.
            Search their license number, confirm the name matches, then mark Verified or Rejected below.
          </p>
        </div>

        {/* Tab + search */}
        <div className="flex gap-2 flex-wrap items-center mb-5">
          <div className="flex gap-1 p-1 bg-surface rounded-xl">
            {STATUS_TAB.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                  tab === t.id ? 'bg-white shadow text-blue-brand' : 'text-muted hover:text-text'
                }`}>
                {t.label}
                {t.id && counts[t.id] > 0 && (
                  <span className="ml-1.5 text-[10px] bg-border text-muted rounded-full px-1.5 py-0.5 font-bold">
                    {counts[t.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by name, pharmacy, email, or PCN #"
              className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-[13px] outline-none focus:border-blue-brand bg-white transition-colors font-[inherit]"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16 text-muted">
            <RefreshCw size={28} className="animate-spin mx-auto mb-3 opacity-30" />
            <p className="text-[13px]">Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <ShieldCheck size={36} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold">No pharmacists found</p>
            <p className="text-[13px] mt-1">
              {tab === 'pending' ? 'No pending reviews — all caught up.' : 'Nothing matching current filter.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(p => (
              <PharmacistRow key={p.id} p={p} secret={secret} onRefresh={() => load(secret, tab)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

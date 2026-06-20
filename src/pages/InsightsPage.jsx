import { useState } from 'react'
import { TrendingUp, AlertTriangle, MessageSquare } from 'lucide-react'
import { callAI } from '@/lib/ai'
import { Card, Btn } from '@/components/ui'

export function InsightsPage() {
  const [q, setQ] = useState('')
  const [r, setR] = useState('')
  const [l, setL] = useState(false)

  const sys = "You are a pharmaceutical market intelligence assistant for Nigerian pharmacists. Provide specific, actionable insight on medicine demand, shortage risks, sourcing strategies, and market conditions in Nigeria. 3-4 sentences."

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-1 tracking-tight">Market Insights</h1>
      <p className="text-muted mb-8">Demand intelligence for Lagos pharmacies</p>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <Card className="border border-green-mid/25">
          <h3 className="font-extrabold text-green-brand mb-3 flex items-center gap-2">
            <TrendingUp size={16} /> High Demand This Week
          </h3>
          {[
            ['Augmentin 625mg',   '+34%', '#DC2626'],
            ['Amlodipine 5mg',    '+18%', '#D97706'],
            ['Metformin 850mg',   '+12%', '#1B3FC4'],
            ['Paracetamol 500mg', '+8%',  '#16A34A'],
          ].map(([d, p, c]) => (
            <div key={d} className="flex justify-between py-2.5 border-b border-border last:border-0">
              <span className="text-sm font-semibold">{d}</span>
              <span className="font-extrabold text-sm" style={{ color: c }}>{p}</span>
            </div>
          ))}
        </Card>

        <Card className="border border-danger/25">
          <h3 className="font-extrabold text-danger mb-3 flex items-center gap-2">
            <AlertTriangle size={16} /> Shortage Risk
          </h3>
          {[
            ['Insulin Actrapid',    'CRITICAL', '#DC2626'],
            ['IV Normal Saline',    'HIGH',     '#DC2626'],
            ['Augmentin 625mg',     'MEDIUM',   '#D97706'],
            ['Metronidazole 200mg', 'LOW',      '#1B3FC4'],
          ].map(([d, rv, c]) => (
            <div key={d} className="flex justify-between py-2.5 border-b border-border last:border-0">
              <span className="text-sm font-semibold">{d}</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md" style={{ background: `${c}15`, color: c }}>{rv}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ background: 'linear-gradient(135deg,rgba(232,237,251,0.6),rgba(220,252,231,0.6))', border: '1px solid rgba(27,63,196,0.12)' }}>
        <h3 className="font-extrabold text-base mb-1.5 flex items-center gap-2">
          <MessageSquare size={16} /> Ask a Question
        </h3>
        <p className="text-muted text-[13px] mb-4">Ask about specific medicines, demand forecasts, pricing, or sourcing strategies</p>
        <div className="flex gap-3 mb-3 flex-wrap">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="e.g. What is the demand for Augmentin 625mg in Lagos this month?"
            className="flex-1 min-w-[280px] border-[1.5px] border-border rounded-xl px-4 py-3 text-sm outline-none bg-white focus:border-blue-brand transition-colors"
          />
          <Btn
            onClick={async () => { setL(true); const res = await callAI(sys, q); setR(res); setL(false) }}
            className="min-w-[120px]"
          >
            {l ? 'Searching...' : 'Ask'}
          </Btn>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'Demand forecast for Augmentin',
            'Best-selling medicines in Lagos',
            'Shortage prediction next 30 days',
            'Pricing trends for antibiotics',
          ].map(s => (
            <button
              key={s}
              onClick={() => setQ(s)}
              className="px-3 py-1.5 rounded-full border border-border bg-white text-muted text-xs cursor-pointer hover:border-blue-brand/50 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        {r && (
          <div className="fade-in bg-white rounded-xl px-4 py-3.5 border border-border">
            <p className="text-text text-sm leading-[1.8]">{r}</p>
          </div>
        )}
      </Card>
    </div>
  )
}

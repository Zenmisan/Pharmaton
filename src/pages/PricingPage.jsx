import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Zap, Shield, Star } from 'lucide-react'
import { Card } from '@/components/ui'

const BILLING = ['monthly', 'quarterly', 'yearly']
const BILLING_LABELS = { monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' }
const BILLING_SAVINGS = { monthly: '', quarterly: 'Save 10%', yearly: 'Save 20%' }

function getPrice(base, billing) {
  if (billing === 'quarterly') return Math.round(base * 0.9)
  if (billing === 'yearly')    return Math.round(base * 0.8)
  return base
}
function getPeriod(billing) {
  if (billing === 'quarterly') return '/mo · billed quarterly'
  if (billing === 'yearly')    return '/mo · billed yearly'
  return '/month'
}

const patientFeatures = {
  free:    ['3 medicine searches per day (1-month trial)', '10 searches per month after trial', 'Find nearby pharmacies', 'Get directions & call pharmacy', 'Safety alerts & recalls', 'Basic stock status'],
  premium: ['Unlimited medicine searches', 'Branded vs generic comparison', 'Budget-aware search', 'Save medicines to your list', 'Priority pharmacy results', 'Push notifications for alerts', 'Medicine price history'],
}

const pharmacistFeatures = {
  starter: ['1-month free trial — no card needed', 'List your pharmacy on PharmaConnect', 'Appear in patient searches', 'Manage up to 50 inventory items', 'Basic analytics dashboard', 'NAFDAC verified badge'],
  pro:     ['Everything in Starter', 'Unlimited inventory items', 'Priority ranking in search results', 'Demand & shortage insights', 'Patient request notifications', 'Delivery order management', 'Monthly performance reports', 'Priority support'],
}

function PlanCard({ name, price, period, color, highlight, badge, features, cta, onSelect }) {
  return (
    <Card className={`relative flex flex-col !p-6 transition-all ${highlight ? 'shadow-lg' : ''}`}
      style={highlight ? { boxShadow: `0 8px 32px ${color}22`, outline: `2px solid ${color}` } : {}}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-black text-white whitespace-nowrap"
          style={{ background: color }}>
          {badge}
        </div>
      )}
      <div className="mb-5">
        <p className="text-[13px] font-bold mb-1" style={{ color }}>{name}</p>
        <div className="flex items-end gap-1">
          <span className="text-[34px] font-black tracking-tight">{price}</span>
          <span className="text-muted text-sm mb-2">{period}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-[13px]">
            <Check size={14} className="shrink-0 mt-0.5" style={{ color }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button onClick={onSelect}
        className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:opacity-90"
        style={highlight ? { background: color, color: '#fff' } : { background: 'transparent', border: `1.5px solid ${color}`, color }}>
        {cta}
      </button>
    </Card>
  )
}

export function PricingPage() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')

  const premiumBase    = 800
  const proBase        = 2000
  const premiumMonthly = getPrice(premiumBase, billing)
  const proMonthly     = getPrice(proBase, billing)
  const period         = getPeriod(billing)

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-border bg-white hover:bg-surface transition-colors cursor-pointer">
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-base">Plans & Pricing</span>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-[clamp(26px,4vw,40px)] font-black mb-3 tracking-tight">Simple, Honest Pricing</h1>
          <p className="text-muted max-w-[480px] mx-auto mb-8">Start free. Upgrade when you're ready. No hidden fees, no contracts.</p>

          {/* Billing toggle */}
          <div className="inline-flex bg-surface border border-border rounded-2xl p-1 gap-1">
            {BILLING.map(b => (
              <button key={b} onClick={() => setBilling(b)}
                className="relative px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all border-0"
                style={billing === b ? { background: '#1B3FC4', color: '#fff' } : { background: 'transparent', color: '#6B6657' }}>
                {BILLING_LABELS[b]}
                {BILLING_SAVINGS[b] && billing !== b && (
                  <span className="ml-1.5 text-[10px] font-black text-green-brand">{BILLING_SAVINGS[b]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Patient plans */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Star size={18} className="text-blue-brand" />
            <h2 className="text-[18px] font-black tracking-tight">For Patients</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <PlanCard
              name="Free"
              price="₦0"
              period="1-month trial"
              color="#6B6657"
              highlight={false}
              features={patientFeatures.free}
              cta="Start Free Trial"
              onSelect={() => navigate('/auth?role=patient')}
            />
            <PlanCard
              name="Premium"
              price={`₦${premiumMonthly.toLocaleString()}`}
              period={period}
              color="#1B3FC4"
              highlight={true}
              badge="Most Popular"
              features={patientFeatures.premium}
              cta="Start Premium"
              onSelect={() => navigate('/auth?role=patient')}
            />
          </div>
        </div>

        {/* Pharmacist plans */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-green-brand" />
            <h2 className="text-[18px] font-black tracking-tight">For Pharmacists</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <PlanCard
              name="Starter"
              price="₦0"
              period="1-month trial"
              color="#16A34A"
              highlight={false}
              badge="Early Access"
              features={pharmacistFeatures.starter}
              cta="Start Free Trial"
              onSelect={() => navigate('/auth?role=pharmacist')}
            />
            <PlanCard
              name="Pro"
              price={`₦${proMonthly.toLocaleString()}`}
              period={period}
              color="#1B3FC4"
              highlight={true}
              badge="Best Value"
              features={pharmacistFeatures.pro}
              cta="Go Pro"
              onSelect={() => navigate('/auth?role=pharmacist')}
            />
          </div>
          {billing !== 'monthly' && (
            <p className="text-center text-muted text-xs mt-4">
              {billing === 'quarterly' ? 'Billed as ₦' + (proMonthly * 3).toLocaleString() + ' every 3 months' : 'Billed as ₦' + (proMonthly * 12).toLocaleString() + ' per year'}
            </p>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-8 border border-border">
          <h2 className="text-[18px] font-black mb-6 tracking-tight flex items-center gap-2">
            <Zap size={18} className="text-blue-brand" /> Common Questions
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              ['What counts as a search?', 'Each medicine name you look up counts as one search. Clicking pharmacy cards or getting directions does not count.'],
              ['Can I cancel anytime?', 'Yes. No contracts, no cancellation fees. Cancel from your profile page and billing stops at the end of your current period.'],
              ['How does the free trial work?', 'Your first month is completely free with limited searches. No card needed to start — you only pay if you choose to upgrade.'],
              ['Do you handle medicine payments?', 'No. PharmaConnect helps you find pharmacies and check stock. You pay the pharmacy directly when you visit or arrange delivery.'],
            ].map(([q, a]) => (
              <div key={q}>
                <p className="font-bold text-sm mb-1.5 tracking-tight">{q}</p>
                <p className="text-muted text-[13px] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

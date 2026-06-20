import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Zap, Shield, Star } from 'lucide-react'
import { Card, Btn } from '@/components/ui'

const patientPlans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    color: '#6B6657',
    highlight: false,
    features: [
      '3 medicine searches per day (first month)',
      '10 searches per month after',
      'Find nearby pharmacies',
      'Get directions & call pharmacy',
      'Safety alerts & recalls',
      'Basic stock status',
    ],
    cta: 'Get Started Free',
    role: 'patient',
  },
  {
    name: 'Premium',
    price: '₦800',
    period: '/month',
    color: '#1B3FC4',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited medicine searches',
      'Branded vs generic comparison',
      'Budget-aware search',
      'Save medicines to your list',
      'Priority pharmacy results',
      'Push notifications for alerts',
      'Medicine price history',
    ],
    cta: 'Start Premium',
    role: 'patient',
  },
]

const pharmacistPlans = [
  {
    name: 'Starter',
    price: '₦0',
    period: 'first 3 months',
    color: '#16A34A',
    highlight: false,
    badge: 'Early Access',
    features: [
      'List your pharmacy on PharmaConnect',
      'Appear in patient searches',
      'Manage up to 50 inventory items',
      'Basic analytics dashboard',
      'NAFDAC verified badge',
      'Direct patient calls',
    ],
    cta: 'Join Free',
    role: 'pharmacist',
  },
  {
    name: 'Pro',
    price: '₦4,500',
    period: '/month',
    color: '#1B3FC4',
    highlight: true,
    badge: 'Best Value',
    features: [
      'Everything in Starter',
      'Unlimited inventory items',
      'Priority ranking in search results',
      'Demand & shortage insights',
      'Patient request notifications',
      'Delivery order management',
      'Monthly performance reports',
      'Priority support',
    ],
    cta: 'Go Pro',
    role: 'pharmacist',
  },
]

function PlanCard({ plan, onSelect }) {
  return (
    <Card className={`relative flex flex-col !p-6 transition-all ${plan.highlight ? 'ring-2 shadow-lg' : ''}`}
      style={plan.highlight ? { ringColor: plan.color, boxShadow: `0 8px 32px ${plan.color}22` } : {}}>
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-black text-white whitespace-nowrap"
          style={{ background: plan.color }}>
          {plan.badge}
        </div>
      )}
      <div className="mb-5">
        <p className="text-[13px] font-bold mb-1" style={{ color: plan.color }}>{plan.name}</p>
        <div className="flex items-end gap-1">
          <span className="text-[36px] font-black tracking-tight">{plan.price}</span>
          <span className="text-muted text-sm mb-2">{plan.period}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-[13px]">
            <Check size={14} className="shrink-0 mt-0.5" style={{ color: plan.color }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan.role)}
        className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:opacity-90"
        style={plan.highlight ? { background: plan.color, color: '#fff' } : { background: 'transparent', border: `1.5px solid ${plan.color}`, color: plan.color }}>
        {plan.cta}
      </button>
    </Card>
  )
}

export function PricingPage() {
  const navigate = useNavigate()

  function onSelect(role) {
    navigate(`/auth?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-border bg-white hover:bg-surface transition-colors cursor-pointer">
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-base">Plans & Pricing</span>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-[clamp(26px,4vw,40px)] font-black mb-3 tracking-tight">Simple, Honest Pricing</h1>
          <p className="text-muted max-w-[480px] mx-auto">Start free. Upgrade when you're ready. No hidden fees, no contracts.</p>
        </div>

        {/* Patient plans */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Star size={18} className="text-blue-brand" />
            <h2 className="text-[18px] font-black tracking-tight">For Patients</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {patientPlans.map(p => <PlanCard key={p.name} plan={p} onSelect={onSelect} />)}
          </div>
        </div>

        {/* Pharmacist plans */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-green-brand" />
            <h2 className="text-[18px] font-black tracking-tight">For Pharmacists</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {pharmacistPlans.map(p => <PlanCard key={p.name} plan={p} onSelect={onSelect} />)}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-8 border border-border">
          <h2 className="text-[18px] font-black mb-6 tracking-tight flex items-center gap-2"><Zap size={18} className="text-blue-brand" /> Common Questions</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              ['What counts as a search?', 'Each medicine name you look up counts as one search. Clicking pharmacy cards or getting directions does not count.'],
              ['Can I cancel anytime?', 'Yes. No contracts, no cancellation fees. Cancel from your profile page and billing stops at the end of your current period.'],
              ['Is the free pharmacist tier really free?', 'Yes, completely free for 3 months. After that, continue free with basic features or upgrade to Pro.'],
              ['Do you handle medicine payments?', 'No. PharmaConnect helps you find pharmacies and check stock. You pay the pharmacy directly when you visit or arrange delivery with them.'],
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

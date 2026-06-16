import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  Bell, Search, MapPin, Star, Clock, Phone, Bot, Package,
  TrendingDown, TrendingUp, DollarSign, Globe, Link2, Shield,
  Lock, CreditCard, HelpCircle, FileText, RefreshCw, X, Check,
  ChevronRight, BarChart3, Timer, Loader2, Menu, Truck,
  Pill, AlertTriangle, CheckCircle2, UserRound, Building2,
  AlertOctagon, Map, Navigation, ClipboardList, Siren,
  Zap, TriangleAlert, Activity
} from 'lucide-react'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PersonIcon from '@mui/icons-material/Person'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth.jsx'

/* ─── GRADIENT STRINGS (only needed for inline SVG/dynamic) ──── */
const G = {
  main:   'linear-gradient(135deg,#1B3FC4 0%,#15803D 100%)',
  green:  'linear-gradient(135deg,#15803D 0%,#22C55E 100%)',
  teal:   'linear-gradient(135deg,#0D9488 0%,#1B3FC4 100%)',
  purple: 'linear-gradient(135deg,#7C3AED 0%,#1B3FC4 100%)',
}

/* ─── AI HELPER ──────────────────────────────────────────────── */
async function callAI(system, user) {
  try {
    const { result } = await api.ai(system, user)
    return result
  } catch (e) {
    return `AI unavailable: ${e.message}`
  }
}

/* ─── LOGO ───────────────────────────────────────────────────── */
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="18" cy="28" r="6" fill="#1B3FC4" />
      <circle cx="8"  cy="52" r="5" fill="#1B3FC4" />
      <circle cx="32" cy="14" r="5" fill="#1B3FC4" />
      <line x1="18" y1="28" x2="8"  y2="52" stroke="#1B3FC4"  strokeWidth="2.5" />
      <line x1="18" y1="28" x2="32" y2="14" stroke="#1B3FC4"  strokeWidth="2.5" />
      <line x1="18" y1="28" x2="46" y2="27" stroke="#1B3FC4"  strokeWidth="2.5" />
      <circle cx="82" cy="28" r="6" fill="#16A34A" />
      <circle cx="92" cy="52" r="5" fill="#16A34A" />
      <circle cx="68" cy="14" r="5" fill="#16A34A" />
      <line x1="82" y1="28" x2="92" y2="52" stroke="#16A34A" strokeWidth="2.5" />
      <line x1="82" y1="28" x2="68" y2="14" stroke="#16A34A" strokeWidth="2.5" />
      <line x1="82" y1="28" x2="54" y2="27" stroke="#16A34A" strokeWidth="2.5" />
      <path d="M50 8 C34 8 23 21 23 35 C23 53 50 80 50 80 C50 80 77 53 77 35 C77 21 66 8 50 8Z" fill="url(#lg)" />
      <defs>
        <linearGradient id="lg" x1="23" y1="8" x2="77" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1B3FC4" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <rect x="40" y="20" width="20" height="20" rx="3" fill="white" />
      <rect x="48" y="22" width="4"  height="16" rx="2" fill="#16A34A" />
      <rect x="41" y="28" width="18" height="4"  rx="2" fill="#16A34A" />
      <ellipse cx="50" cy="82" rx="9" ry="3.5" fill="rgba(0,0,0,0.12)" />
    </svg>
  )
}

/* ─── BADGE ──────────────────────────────────────────────────── */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold',
  {
    variants: {
      status: {
        'In Stock':     'bg-green-light text-green-brand',
        'Low Stock':    'bg-yellow-50 text-yellow-800',
        'Out of Stock': 'bg-red-50 text-danger',
      },
    },
    defaultVariants: { status: 'In Stock' },
  }
)

const dotColors = {
  'In Stock':     'bg-green-mid',
  'Low Stock':    'bg-warning',
  'Out of Stock': 'bg-danger',
}

function Badge({ status }) {
  return (
    <span className={badgeVariants({ status })}>
      <span className={cn('size-1.5 rounded-full', dotColors[status] || 'bg-green-mid')} />
      {status}
    </span>
  )
}

/* ─── CARD ───────────────────────────────────────────────────── */
function Card({ children, className, onClick, style, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className={cn(
        'bg-surface rounded-2xl p-5 border border-border shadow-[0_1px_2px_rgba(20,19,15,0.04)] transition-shadow duration-200',
        onClick && 'cursor-pointer hover:shadow-[0_8px_28px_rgba(20,19,15,0.08)]',
        className
      )}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}

/* ─── BUTTON ─────────────────────────────────────────────────── */
const btnVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all duration-150 cursor-pointer border-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:   'text-white shadow-[0_4px_14px_rgba(27,63,196,0.25)] hover:shadow-[0_6px_20px_rgba(27,63,196,0.35)] hover:-translate-y-0.5',
        secondary: 'bg-white text-blue-brand border-[1.5px] border-blue-brand hover:bg-blue-light hover:-translate-y-0.5',
        ghost:     'bg-transparent text-muted border border-border hover:bg-background hover:text-text',
        danger:    'bg-red-50 text-danger border border-danger/25 hover:bg-red-100',
      },
      size: {
        sm: 'px-3.5 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

function Btn({ children, variant = 'primary', onClick, className, full, size = 'md', gradient, style = {} }) {
  const gradStyle = variant === 'primary'
    ? { background: gradient || G.main, border: 'none' }
    : {}
  return (
    <button
      onClick={onClick}
      className={cn(btnVariants({ variant, size }), full && 'w-full', className)}
      style={{ ...gradStyle, ...style }}
    >
      {children}
    </button>
  )
}

/* ─── NAV ────────────────────────────────────────────────────── */
function Nav({ page, setPage, userType, onSignOut }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = userType === "patient"
    ? [["home","Home"],["search","Search Medicine"],["map","Find Pharmacies"],["alerts","Safety Alerts"]]
    : userType === "pharmacist"
    ? [["dashboard","Dashboard"],["inventory","Inventory"],["sourcing","Sourcing"],["insights","AI Insights"]]
    : userType === "hospital"
    ? [["dashboard","Dashboard"],["emergency","Emergency"],["orders","Orders"],["insights","AI Insights"]]
    : [["dashboard","Dashboard"],["stock","My Stock"],["requests","Requests"],["analytics","Analytics"]]

  return (
    <nav className={cn(
      'bg-surface/85 backdrop-blur-md border-b border-border sticky top-0 z-[100] transition-shadow duration-200',
      scrolled ? 'shadow-[0_4px_20px_rgba(20,19,15,0.06)]' : 'shadow-none'
    )}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-8">
        <button
          onClick={() => setPage("landing")}
          className="flex items-center gap-2.5 bg-transparent border-0 shrink-0 cursor-pointer"
        >
          <Logo size={34} />
          <span className="font-display font-black text-lg text-text">
            Pharma<span className="text-green-mid">Connect</span>
            <span className="text-[13px] font-extrabold ml-1 border border-border px-1.5 py-px rounded-md text-blue-brand">AI</span>
          </span>
        </button>

        <div className="hidden md:flex gap-1 flex-1">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)}
              className={cn(
                'relative px-3.5 py-1.5 rounded-lg border-0 font-semibold text-sm transition-all duration-150 cursor-pointer',
                page === id ? 'text-blue-brand' : 'bg-transparent text-muted hover:bg-blue-light/50'
              )}>
              {label}
              {page === id && <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] bg-blue-brand rounded-full" />}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={() => setPage("alerts")}
            className="relative bg-transparent border-0 p-1.5 cursor-pointer text-muted hover:text-text transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-danger border-2 border-white" />
          </button>
          <button onClick={() => setPage("profile")}
            className="px-4 py-1.5 rounded-xl border border-border bg-white text-muted text-[13px] font-semibold cursor-pointer hover:bg-background transition-colors">
            Profile
          </button>
          <button onClick={onSignOut}
            className="px-4 py-1.5 rounded-xl border border-border bg-white text-muted text-[13px] font-semibold cursor-pointer hover:bg-background transition-colors">
            Switch Role
          </button>
          <button className="md:hidden bg-transparent border-0 text-muted cursor-pointer p-1" onClick={() => setOpen(!open)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border p-4 flex flex-col gap-1 md:hidden">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => { setPage(id); setOpen(false) }}
              className={cn(
                'px-4 py-3 rounded-xl border-0 font-semibold text-[15px] text-left cursor-pointer transition-colors',
                page === id ? 'bg-blue-light text-blue-brand' : 'bg-transparent text-text hover:bg-background'
              )}>
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

/* ─── LANDING ────────────────────────────────────────────────── */
function Landing({ onChoose }) {
  const heroRef  = useRef(null)
  const badgeRef = useRef(null)
  const logoRef  = useRef(null)
  const titleRef = useRef(null)
  const descRef  = useRef(null)
  const ctaRef   = useRef(null)
  const cardsRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(badgeRef.current, { opacity: 0, y: -10, duration: 0.4 })
        .from(logoRef.current,  { opacity: 0, scale: 0.8, duration: 0.5 }, '-=0.1')
        .from(titleRef.current, { opacity: 0, y: 30, duration: 0.6 }, '-=0.2')
        .from(descRef.current,  { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from(ctaRef.current,   { opacity: 0, y: 15, duration: 0.4 }, '-=0.2')

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.role-card')
        gsap.from(cards, { opacity: 0, y: 40, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.5 })
      }

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll('.feature-item')
        gsap.from(items, {
          opacity: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
        })
      }

      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item')
        gsap.from(items, {
          opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const roles = [
    { id:"patient",    Icon: () => <PersonIcon sx={{ fontSize: 30 }} />, label:"Patient",               desc:"Search medicines, find nearby pharmacies, get safety alerts",        color:'#1B3FC4', grad:G.main   },
    { id:"pharmacist", Icon: () => <LocalPharmacyIcon sx={{ fontSize: 30 }} />, label:"Community Pharmacist", desc:"Manage inventory, source medicines, access AI insights",                color:'#16A34A', grad:G.green  },
    { id:"hospital",   Icon: () => <MedicalServicesIcon sx={{ fontSize: 30 }} />, label:"Hospital Pharmacist",  desc:"Emergency sourcing, bulk orders, verified supplier access",             color:'#0D9488', grad:G.teal   },
    { id:"supplier",   Icon: () => <LocalShippingIcon sx={{ fontSize: 30 }} />, label:"Supplier / Distributor",desc:"List stock, receive requests, monitor demand trends",                   color:'#7C3AED', grad:G.purple },
  ]

  const features = [
    { Icon: Globe,         title:"Multilingual AI Search",    desc:"Search in English, Yoruba, Hausa, Igbo or French. Our AI understands local names, corrects spelling, and finds matches." },
    { Icon: MapPin,        title:"Location-Based Visibility",  desc:"See only pharmacies near you with real-time stock status — In Stock, Low, or Out of Stock — at a glance." },
    { Icon: DollarSign,    title:"Budget-Aware Matching",      desc:"Search within your budget. Compare generic and branded options. Find the most affordable verified medicine nearby." },
    { Icon: Link2,         title:"Pharmacy-to-Pharmacy",       desc:"Pharmacists can source scarce medicines from other verified pharmacies when suppliers can't deliver fast enough." },
    { Icon: Shield,        title:"Verified Network",           desc:"Every pharmacy and supplier is PCN licensed, CAC registered, and NAFDAC approved before appearing on the platform." },
    { Icon: AlertOctagon,  title:"Safety & Recall Alerts",     desc:"Instant notifications on counterfeits, NAFDAC recalls, packaging updates, and supply-chain safety notices." },
  ]

  return (
    <div ref={heroRef}>
      {/* Hero — asymmetric two-column */}
      <div className="grain-overlay bg-grad-main px-6 pt-24 pb-28 relative overflow-hidden">
        <div className="absolute -top-24 -right-32 size-[480px] rounded-full bg-white/[0.05] float-soft" />
        <div className="absolute -bottom-20 -left-20 size-[320px] rounded-full bg-white/[0.04] float-soft" style={{ animationDelay: '-3s' }} />
        <div className="max-w-[1100px] mx-auto relative grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <div>
            <div ref={badgeRef} className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-7">
              <span className="size-2 rounded-full bg-[#86EFAC] inline-block" />
              <span className="text-white/90 text-[13px] font-semibold">AI-Powered Pharmaceutical Platform · Nigeria</span>
            </div>
            <h1 ref={titleRef} className="font-display text-white text-[clamp(36px,5.5vw,64px)] font-black mb-5 leading-[1.05] tracking-tight">
              Medicine Access,<br /><span className="text-[#86EFAC] italic">Reimagined</span> for Africa
            </h1>
            <p ref={descRef} className="text-white/80 text-[clamp(15px,2vw,18px)] max-w-[480px] mb-10 leading-[1.7]">
              Connecting patients, pharmacists, hospitals and suppliers through AI-driven medicine visibility and real-time availability.
            </p>
            <div ref={ctaRef} className="flex gap-3 flex-wrap">
              <Btn size="lg" onClick={() => onChoose(null)} style={{ background: '#fff', color: '#1B3FC4', borderRadius: 14 }}>
                Get Started Free
              </Btn>
              <Btn size="lg" variant="ghost" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.1)', borderRadius: 14 }}>
                Watch Demo
              </Btn>
            </div>
          </div>
          <div ref={logoRef} className="hidden lg:flex justify-center relative">
            <div className="absolute inset-0 rounded-full bg-white/[0.06] blur-2xl scale-110" />
            <div className="relative bg-white/10 border border-white/20 rounded-[32px] p-12 backdrop-blur-sm">
              <Logo size={140} />
            </div>
          </div>
        </div>
      </div>

      {/* Role cards */}
      <div className="max-w-[1100px] mx-auto px-6 py-20">
        <h2 className="font-display text-center text-[32px] font-black mb-2">Built for Everyone in the Chain</h2>
        <p className="text-center text-muted mb-12">Choose your role to access a tailored experience</p>
        <div ref={cardsRef} className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {roles.map(u => (
            <Card key={u.id} className="role-card group text-center p-7 transition-all duration-200 hover:-translate-y-1.5 border-t-[3px]"
              style={{ borderTopColor: u.color }}
              onClick={() => onChoose(u.id)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 36px ${u.color}28` }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '' }}>
              <div className="size-16 rounded-[18px] flex items-center justify-center mx-auto mb-4 transition-colors duration-200"
                style={{ background: `${u.color}15`, color: u.color }}>
                <u.Icon />
              </div>
              <h3 className="font-display text-base font-extrabold mb-2">{u.label}</h3>
              <p className="text-muted text-[13px] leading-relaxed mb-5">{u.desc}</p>
              <Btn full gradient={u.grad} onClick={() => onChoose(u.id)}>Enter as {u.label.split(" ")[0]}</Btn>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-center text-[32px] font-black mb-2">Why PharmaConnect AI?</h2>
          <p className="text-center text-muted mb-14">Because medicine access shouldn't depend on WhatsApp groups and guesswork.</p>
          <div ref={featuresRef} className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {features.map(f => (
              <div key={f.title} className="feature-item flex gap-4 py-5">
                <div className="size-12 rounded-[14px] bg-blue-light flex items-center justify-center shrink-0 text-blue-brand">
                  <f.Icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold mb-1.5 text-[15px]">{f.title}</h4>
                  <p className="text-muted text-[13px] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grain-overlay bg-grad-main py-16 px-6">
        <div ref={statsRef} className="max-w-[900px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 text-center">
          {[["10,000+","Verified Pharmacies"],["5 Languages","Multilingual AI"],["Real-time","Stock Visibility"],["NAFDAC","Compliance Ready"]].map(([v,l]) => (
            <div key={l} className="stat-item">
              <div className="font-display text-[#86EFAC] text-[30px] font-black mb-1.5">{v}</div>
              <div className="text-white/75 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-text py-14 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Logo size={28} />
              <span className="font-display text-white font-extrabold text-base">PharmaConnect AI</span>
            </div>
            <p className="text-subtle text-[13px] leading-relaxed">Connecting Care. Connecting Medicines. · Nigeria</p>
          </div>
          <div>
            <p className="text-white/90 font-bold text-[13px] mb-3">Platform</p>
            <p className="text-subtle text-[13px] mb-2">Search Medicines</p>
            <p className="text-subtle text-[13px] mb-2">Find Pharmacies</p>
            <p className="text-subtle text-[13px]">Safety Alerts</p>
          </div>
          <div>
            <p className="text-white/90 font-bold text-[13px] mb-3">Network</p>
            <p className="text-subtle text-[13px] mb-2">For Pharmacists</p>
            <p className="text-subtle text-[13px] mb-2">For Hospitals</p>
            <p className="text-subtle text-[13px]">For Suppliers</p>
          </div>
          <div>
            <p className="text-white/90 font-bold text-[13px] mb-3">Compliance</p>
            <p className="text-subtle text-[13px] mb-2">NAFDAC Approved</p>
            <p className="text-subtle text-[13px]">PCN · CAC Verified</p>
          </div>
        </div>
        <div className="max-w-[1100px] mx-auto border-t border-white/10 mt-10 pt-6 text-subtle text-xs">
          © 2026 PharmaConnect AI. Built for Nigeria's pharmaceutical supply chain.
        </div>
      </footer>
    </div>
  )
}

/* ─── CHOOSE ROLE ────────────────────────────────────────────── */
function ChooseRole({ onSelect }) {
  const types = [
    { id:"patient",    Icon: () => <PersonIcon sx={{ fontSize: 26 }} />,          label:"Patient",               desc:"Find medicines, compare prices, locate pharmacies",              color:'#1B3FC4' },
    { id:"pharmacist", Icon: () => <LocalPharmacyIcon sx={{ fontSize: 26 }} />,   label:"Community Pharmacist",  desc:"Manage inventory, source medicines, get AI demand insights",      color:'#16A34A' },
    { id:"hospital",   Icon: () => <MedicalServicesIcon sx={{ fontSize: 26 }} />, label:"Hospital Pharmacist",   desc:"Emergency sourcing, bulk orders, verified supplier access",       color:'#0D9488' },
    { id:"supplier",   Icon: () => <LocalShippingIcon sx={{ fontSize: 26 }} />,   label:"Supplier / Distributor",desc:"List medicines, receive pharmacy requests, market analytics",     color:'#7C3AED' },
  ]
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <Logo size={48} />
      <h2 className="text-[28px] font-extrabold mt-4 mb-1.5 text-center">Welcome to PharmaConnect AI</h2>
      <p className="text-muted mb-10 text-center">Select your role to get started</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5 max-w-[700px] w-full">
        {types.map(t => (
          <Card key={t.id} onClick={() => onSelect(t.id)}
            className="flex items-center gap-4 !p-[18px] transition-all duration-150 border-2 border-transparent"
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.boxShadow = `0 8px 24px ${t.color}20` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '' }}>
            <div className="size-[52px] rounded-[14px] flex items-center justify-center shrink-0" style={{ background: `${t.color}15`, color: t.color }}>
              <t.Icon />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px] mb-0.5">{t.label}</div>
              <div className="text-muted text-xs leading-relaxed">{t.desc}</div>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── ALERTS PAGE ────────────────────────────────────────────── */
const ALERT_META = {
  recall:       { Icon: AlertTriangle, cls: 'danger'  },
  shortage:     { Icon: TrendingDown,  cls: 'warning' },
  packaging:    { Icon: Package,       cls: 'info'    },
  safety:       { Icon: CheckCircle2,  cls: 'success' },
  supply:       { Icon: Bell,          cls: 'info'    },
  verification: { Icon: Search,        cls: 'warning' },
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso.replace(' ', 'T') + 'Z').getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.alerts().then(({ alerts }) => setAlerts(alerts)).finally(() => setLoading(false))
  }, [])

  async function markAllRead() {
    await api.markAllAlertsRead()
    setAlerts(prev => prev.map(a => ({ ...a, read: 1 })))
  }

  const colsCls = {
    danger:  { wrap:'bg-red-50 border-l-danger',   icon:'text-danger',            tag:'bg-red-100 text-danger'           },
    warning: { wrap:'bg-yellow-50 border-l-warning',icon:'text-warning',           tag:'bg-yellow-100 text-yellow-800'    },
    info:    { wrap:'bg-blue-50 border-l-blue-brand',icon:'text-blue-brand',       tag:'bg-blue-100 text-blue-brand'      },
    success: { wrap:'bg-green-50 border-l-green-brand',icon:'text-green-brand',    tag:'bg-green-light text-green-brand'  },
  }
  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Safety &amp; Alerts</h1>
          <p className="text-muted text-sm">Official NAFDAC notices, recalls and supply updates</p>
        </div>
        <Btn variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Btn>
      </div>
      {loading && <p className="text-muted text-sm">Loading alerts...</p>}
      <div className="flex flex-col gap-3">
        {alerts.map((a) => {
          const meta = ALERT_META[a.type] || ALERT_META.supply
          const c = colsCls[meta.cls]
          return (
            <div key={a.id} className={cn('fade-in rounded-[14px] p-5 border border-l-4', c.wrap, a.read ? 'opacity-60' : '')}>
              <div className="flex gap-3.5 items-start">
                <meta.Icon size={22} className={cn('shrink-0 mt-0.5', c.icon)} />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={cn('font-extrabold text-[15px]', c.icon)}>{a.title}</span>
                      <span className={cn('text-[10px] font-extrabold rounded-md px-2 py-0.5', c.tag)}>{a.tag}</span>
                    </div>
                    <span className="text-subtle text-xs">{timeAgo(a.created_at)}</span>
                  </div>
                  <p className="text-muted text-[13px] leading-[1.7]">{a.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── MAP PAGE ───────────────────────────────────────────────── */
function MapPage() {
  const [sel, setSel] = useState(null)
  const [filter, setFilter] = useState("All")
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.pharmacies('pharmacy').then(({ pharmacies }) => {
      // lay out on the mock map canvas using normalized lat/lng -> x/y
      const lats = pharmacies.map(p => p.lat), lngs = pharmacies.map(p => p.lng)
      const minLat = Math.min(...lats), maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
      const withXY = pharmacies.map(p => ({
        ...p,
        x: 60 + ((p.lng - minLng) / ((maxLng - minLng) || 1)) * 420,
        y: 380 - ((p.lat - minLat) / ((maxLat - minLat) || 1)) * 320,
      }))
      setPharmacies(withXY)
    }).finally(() => setLoading(false))
  }, [])

  const dc = { "In Stock":"#16A34A", "Low Stock":"#D97706", "Out of Stock":"#DC2626" }
  const filtered = filter === "All" ? pharmacies : pharmacies.filter(p => p.status === filter)
  const selP = sel !== null ? pharmacies.find(p => p.id === sel) : null

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-1">Nearby Pharmacies</h1>
      <p className="text-muted text-sm mb-6">Showing pharmacies within 10km of Surulere, Lagos</p>
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

        {/* List */}
        <div className="flex flex-col gap-2.5">
          {loading && <p className="text-muted text-sm">Loading pharmacies...</p>}
          {selP && (
            <Card className="fade-in border-2 border-blue-brand mb-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-extrabold">{selP.name}</h3>
                <Badge status={selP.status}/>
              </div>
              <p className="text-muted text-xs mb-0.5 flex items-center gap-1"><Star size={11}/> {selP.rating}{selP.nafdac_verified ? ' · NAFDAC Verified' : ''}</p>
              <p className="text-muted text-xs mb-2.5 flex items-center gap-1"><MapPin size={11}/> {selP.location}</p>
              <div className="flex gap-2">
                <a className="flex-1" href={`https://www.google.com/maps/search/?api=1&query=${selP.lat},${selP.lng}`} target="_blank" rel="noreferrer">
                  <Btn full variant="secondary" size="sm" className="gap-1"><Navigation size={12}/> Directions</Btn>
                </a>
                <a className="flex-1" href={`tel:${selP.phone}`}>
                  <Btn full size="sm" className="gap-1"><Phone size={12}/> Call</Btn>
                </a>
              </div>
            </Card>
          )}
          {filtered.map(p => (
            <Card key={p.id} onClick={() => setSel(sel===p.id?null:p.id)}
              className={cn('!p-3.5 transition-all duration-150', sel===p.id ? 'border-[1.5px] border-blue-brand' : 'border-[1.5px] border-border')}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{p.name}</span>
                <Badge status={p.status}/>
              </div>
              <p className="text-muted text-xs flex items-center gap-1"><MapPin size={10}/> {p.location} · <Star size={10}/> {p.rating}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── PATIENT HOME ───────────────────────────────────────────── */
function PatientHome({ setPage }) {
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

/* ─── SEARCH PAGE ────────────────────────────────────────────── */
function SearchPage() {
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

/* ─── PHARMACIST DASHBOARD ───────────────────────────────────── */
function PharmacistDashboard({ setPage }) {
  const { user } = useAuth()
  const [iq, setIq] = useState(""); const [ir, setIr] = useState(""); const [il, setIl] = useState(false)
  const [inv, setInv] = useState([])
  const [invStats, setInvStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 })
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    api.inventory().then(({ items, stats }) => { setInv(items); setInvStats(stats) }).catch(() => {})
    api.orders().then(({ orders }) => setPendingOrders(orders.filter(o => o.status === 'Pending').length)).catch(() => {})
  }, [])

  const stats = [
    { v: String(invStats.inStock),    l:"In Stock",      Icon: CheckCircle2,   color:'#16A34A' },
    { v: String(invStats.lowStock),   l:"Low Stock",     Icon: AlertTriangle,  color:'#D97706' },
    { v: String(invStats.outOfStock), l:"Out of Stock",  Icon: X,              color:'#DC2626' },
    { v: String(pendingOrders),       l:"Pending Orders",Icon: Package,        color:'#1B3FC4' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="grain-overlay bg-grad-green rounded-[20px] px-8 py-7 mb-6 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-white/75 text-[13px] flex items-center gap-1.5">
              <LocalPharmacyIcon sx={{ fontSize: 14 }}/> Community Pharmacist · Verified Partner
              <CheckCircle2 size={13} className="text-[#86EFAC]"/>
            </p>
            <h1 className="font-display text-[28px] font-black my-1">{user?.org_name || user?.name}</h1>
            <p className="text-white/80 text-sm flex items-center gap-1"><MapPin size={13}/> {user?.location || "Location not set"}{user?.license_number ? ` · ${user.license_number}` : ""}</p>
          </div>
          <div className="flex gap-2.5">
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("inventory")}>Manage Inventory</Btn>
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("inventory")}>Update Stock</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5 mb-6">
        {stats.map(({ v, l, Icon, color }) => (
          <Card key={l} className="text-center !p-5">
            <Icon size={28} className="mx-auto mb-1" style={{ color }} />
            <div className="text-3xl font-black mb-1" style={{ color }}>{v}</div>
            <div className="text-muted text-[13px]">{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 380px' }}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold">Inventory Overview</h2>
            <Btn variant="ghost" size="sm" onClick={() => setPage("inventory")}>View all →</Btn>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                {["Medicine","Stock","Status","Expiry"].map(h => <th key={h} className="text-left px-2.5 py-2 text-muted text-xs font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {inv.map(item => (
                <tr key={item.name} className="border-b border-border">
                  <td className="px-2.5 py-3 font-semibold text-sm">{item.name}</td>
                  <td className="px-2.5 py-3 text-muted text-sm">{item.stock}</td>
                  <td className="px-2.5 py-3"><Badge status={item.status}/></td>
                  <td className="px-2.5 py-3 text-muted text-[13px]">{item.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card style={{ background: `linear-gradient(135deg,rgba(232,237,251,1),rgba(220,252,231,1))`, border: '1px solid rgba(27,63,196,0.12)' }}>
            <h3 className="text-[15px] font-extrabold mb-3 flex items-center gap-2"><Bot size={16}/> AI Demand Insight</h3>
            <textarea value={iq} onChange={e => setIq(e.target.value)} placeholder="Ask about demand trends, shortages, pricing..."
              className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none resize-none h-20 font-[inherit] box-border mb-2.5"/>
            <Btn full onClick={async () => {
              setIl(true)
              const r = await callAI("You are PharmaConnect AI for Nigerian community pharmacies. Give 2-3 actionable sentences about pharmaceutical demand, market trends, or sourcing advice specific to Nigeria.", iq)
              setIr(r); setIl(false)
            }}>
              {il ? "Analyzing..." : "Ask AI"}
            </Btn>
            {ir && <p className="fade-in text-text text-[13px] leading-[1.7] mt-3 px-3 py-2.5 bg-white rounded-xl">{ir}</p>}
          </Card>
          <Card>
            <h3 className="text-[15px] font-extrabold mb-3 flex items-center gap-2"><BarChart3 size={16}/> This Week</h3>
            {[["Paracetamol 500mg","High demand",'#16A34A'],["Augmentin 625mg","Shortage risk",'#DC2626'],["Metformin 850mg","Stable",'#1B3FC4']].map(([d,s,c]) => (
              <div key={d} className="flex justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-[13px] font-semibold">{d}</span>
                <span className="text-xs font-bold" style={{ color: c }}>{s}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ─── INVENTORY PAGE ─────────────────────────────────────────── */
function InventoryPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [allInv, setAllInv] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ name: "", stock: "", price: "", expiry: "" })

  function load() {
    api.inventory().then(({ items }) => setAllInv(items)).catch(() => {})
  }
  useEffect(() => { load() }, [])

  async function updateItem(item) {
    const stock = window.prompt(`New stock count for ${item.name}:`, item.stock)
    if (stock === null) return
    const n = Number(stock)
    const status = n <= 0 ? "Out of Stock" : n < 20 ? "Low Stock" : "In Stock"
    await api.updateInventoryItem(item.id, { stock: n, status })
    load()
  }

  async function addMedicine() {
    if (!newItem.name.trim()) return
    await api.addInventoryItem({ ...newItem, stock: Number(newItem.stock) || 0 })
    setNewItem({ name: "", stock: "", price: "", expiry: "" })
    setShowAdd(false)
    load()
  }

  const shown = allInv.filter(i => (filter==="All"||i.status===filter) && i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Inventory Management</h1>
          <p className="text-muted text-sm">Manage your medicine stock and availability</p>
        </div>
        <Btn gradient={G.green} onClick={() => setShowAdd(v => !v)}>+ Add Medicine</Btn>
      </div>
      {showAdd && (
        <Card className="mb-5 !p-5">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-end">
            <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Medicine name"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} placeholder="Stock" type="number"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.expiry} onChange={e => setNewItem({ ...newItem, expiry: e.target.value })} placeholder="Expiry"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <Btn onClick={addMedicine}>Save</Btn>
          </div>
        </Card>
      )}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicines..."
            className="w-full border-[1.5px] border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
        </div>
        {["All","In Stock","Low Stock","Out of Stock"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2.5 rounded-xl border-[1.5px] font-semibold text-[13px] cursor-pointer transition-colors',
              filter===f ? 'border-green-brand bg-green-light text-green-brand' : 'border-border bg-white text-muted hover:border-green-brand/50'
            )}>
            {f}
          </button>
        ))}
      </div>
      <Card className="!p-0 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-background">
              {["Medicine Name","Stock","Status","Price","Expiry","Action"].map(h => (
                <th key={h} className="text-left px-[18px] py-3.5 text-muted text-xs font-bold border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(item => (
              <tr key={item.id} className="border-b border-border hover:bg-background transition-colors">
                <td className="px-[18px] py-3.5 font-semibold text-sm">{item.name}</td>
                <td className="px-[18px] py-3.5 text-muted">{item.stock}</td>
                <td className="px-[18px] py-3.5"><Badge status={item.status}/></td>
                <td className="px-[18px] py-3.5 text-green-mid font-semibold">{item.price}</td>
                <td className="px-[18px] py-3.5 text-muted text-[13px]">{item.expiry}</td>
                <td className="px-[18px] py-3.5"><Btn variant="ghost" size="sm" onClick={() => updateItem(item)}>Update</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

/* ─── AI INSIGHTS PAGE ───────────────────────────────────────── */
function InsightsPage({ userType }) {
  const [q, setQ] = useState(""); const [r, setR] = useState(""); const [l, setL] = useState(false)
  const sys = userType === "supplier"
    ? "You are PharmaConnect AI market intelligence for pharmaceutical suppliers and distributors in Nigeria. Provide specific, actionable insight on demand trends, pricing, distribution opportunities, and market conditions. 3-4 sentences."
    : "You are PharmaConnect AI demand and shortage intelligence for Nigerian pharmacists and hospital pharmacies. Provide specific, actionable insight on medicine demand, shortage risks, sourcing strategies, and market conditions. 3-4 sentences."

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-1">AI Market Insights</h1>
      <p className="text-muted mb-8">Real-time demand intelligence powered by PharmaConnect AI</p>
      <div className="grid grid-cols-2 gap-5 mb-6">
        <Card className="border border-green-mid/25">
          <h3 className="font-extrabold text-green-brand mb-3 flex items-center gap-2"><TrendingUp size={16}/> High Demand This Week</h3>
          {[["Augmentin 625mg","+34%",'#DC2626'],["Amlodipine 5mg","+18%",'#D97706'],["Metformin 850mg","+12%",'#1B3FC4'],["Paracetamol 500mg","+8%",'#16A34A']].map(([d,p,c]) => (
            <div key={d} className="flex justify-between py-2.5 border-b border-border last:border-0">
              <span className="text-sm font-semibold">{d}</span>
              <span className="font-extrabold text-sm" style={{ color: c }}>{p}</span>
            </div>
          ))}
        </Card>
        <Card className="border border-danger/25">
          <h3 className="font-extrabold text-danger mb-3 flex items-center gap-2"><AlertTriangle size={16}/> Shortage Risk</h3>
          {[["Insulin Actrapid","CRITICAL",'#DC2626'],["IV Normal Saline","HIGH",'#DC2626'],["Augmentin 625mg","MEDIUM",'#D97706'],["Metronidazole 200mg","LOW",'#1B3FC4']].map(([d,rv,c]) => (
            <div key={d} className="flex justify-between py-2.5 border-b border-border last:border-0">
              <span className="text-sm font-semibold">{d}</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md" style={{ background: `${c}15`, color: c }}>{rv}</span>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{ background: 'linear-gradient(135deg,rgba(232,237,251,0.6),rgba(220,252,231,0.6))', border: '1px solid rgba(27,63,196,0.12)' }}>
        <h3 className="font-extrabold text-base mb-1.5 flex items-center gap-2"><Bot size={16}/> Ask AI for Custom Insight</h3>
        <p className="text-muted text-[13px] mb-4">Ask about specific medicines, demand forecasts, pricing, or sourcing strategies</p>
        <div className="flex gap-3 mb-3 flex-wrap">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. What is the demand forecast for Augmentin 625mg in Lagos this month?"
            className="flex-1 min-w-[280px] border-[1.5px] border-border rounded-xl px-4 py-3 text-sm outline-none bg-white focus:border-blue-brand transition-colors"/>
          <Btn onClick={async () => { setL(true); const res = await callAI(sys, q); setR(res); setL(false) }} className="min-w-[120px] gap-1.5">
            <Bot size={15}/> {l ? "Analyzing..." : "Ask AI"}
          </Btn>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {["Demand forecast for Augmentin","Best-selling medicines in Lagos","Shortage prediction next 30 days","Pricing trends for antibiotics"].map(s => (
            <button key={s} onClick={() => setQ(s)}
              className="px-3 py-1.5 rounded-full border border-border bg-white text-muted text-xs cursor-pointer hover:border-blue-brand/50 transition-colors">
              {s}
            </button>
          ))}
        </div>
        {r && <div className="fade-in bg-white rounded-xl px-4 py-3.5 border border-border"><p className="text-text text-sm leading-[1.8]">{r}</p></div>}
      </Card>
    </div>
  )
}

/* ─── HOSPITAL DASHBOARD ─────────────────────────────────────── */
function HospitalDashboard({ setPage }) {
  const { user } = useAuth()
  const [eq, setEq] = useState(""); const [er, setEr] = useState(""); const [el, setEl] = useState(false)
  const [critical, setCritical] = useState([])
  const [needsStats, setNeedsStats] = useState({ critical: 0, total: 0 })
  const [orderStats, setOrderStats] = useState({ active: 0, inTransit: 0 })
  const [supplierCount, setSupplierCount] = useState(0)

  useEffect(() => {
    api.hospitalNeeds().then(({ needs, stats }) => { setCritical(needs); setNeedsStats(stats) }).catch(() => {})
    api.orders().then(({ orders }) => setOrderStats({
      active: orders.filter(o => o.status !== 'Delivered').length,
      inTransit: orders.filter(o => o.status === 'In Transit').length,
    })).catch(() => {})
    api.pharmacies('supplier').then(({ pharmacies }) => setSupplierCount(pharmacies.filter(p => p.nafdac_verified).length)).catch(() => {})
  }, [])

  const stats = [
    { v: String(needsStats.critical), l:"Critical Needs",     Icon: Siren,        color:'#DC2626' },
    { v: String(orderStats.active),   l:"Active Orders",      Icon: Package,      color:'#1B3FC4' },
    { v: String(orderStats.inTransit),l:"In Transit",         Icon: Truck,        color:'#D97706' },
    { v: String(supplierCount),       l:"Verified Suppliers", Icon: CheckCircle2, color:'#16A34A' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="grain-overlay bg-grad-teal rounded-[20px] px-8 py-7 mb-6 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-white/75 text-[13px] flex items-center gap-1.5"><Building2 size={14}/> Hospital Pharmacist</p>
            <h1 className="font-display text-[28px] font-black my-1">{user?.org_name || user?.name}</h1>
            <p className="text-white/80 text-sm">{user?.location || "Pharmacy Department"}</p>
          </div>
          <div className="flex gap-2.5">
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("emergency")}>
              <Siren size={14}/> Emergency Sourcing
            </Btn>
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("orders")}>
              <ClipboardList size={14}/> Track Orders
            </Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 mb-6">
        {stats.map(({ v, l, Icon, color }) => (
          <Card key={l} className="text-center !p-5">
            <Icon size={26} className="mx-auto" style={{ color }}/>
            <div className="text-3xl font-black my-1" style={{ color }}>{v}</div>
            <div className="text-muted text-[13px]">{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 380px' }}>
        <Card>
          <h2 className="text-lg font-extrabold mb-4 text-danger flex items-center gap-2"><Siren size={18}/> Critical Needs</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                {["Medicine","Quantity","Priority","Status"].map(h => <th key={h} className="text-left px-2.5 py-2 text-muted text-xs font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {critical.map(item => (
                <tr key={item.id} className="border-b border-border">
                  <td className="px-2.5 py-3 font-semibold text-sm">{item.name}</td>
                  <td className="px-2.5 py-3 text-muted text-[13px]">{item.qty}</td>
                  <td className="px-2.5 py-3">
                    <span className="text-[11px] font-extrabold rounded-md px-2 py-0.5"
                      style={{ background: item.priority==="CRITICAL"?'#DC2626':item.priority==="HIGH"?'#D97706':'#DBEAFE', color: item.priority==="CRITICAL"||item.priority==="HIGH"?'#fff':'#1B3FC4' }}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-2.5 py-3 text-muted text-[13px]">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card style={{ border: '1px solid rgba(13,148,136,0.3)', background: 'linear-gradient(135deg,rgba(13,148,136,0.06),rgba(27,63,196,0.06))' }}>
          <h3 className="text-[15px] font-extrabold mb-1.5 flex items-center gap-2"><Bot size={16}/> AI Emergency Sourcing</h3>
          <p className="text-muted text-[13px] mb-3">Describe what you need to source urgently</p>
          <textarea value={eq} onChange={e => setEq(e.target.value)} placeholder="e.g. Need 500 vials of Insulin Actrapid urgently for ICU patients with DKA..."
            className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none resize-none h-[88px] font-[inherit] box-border mb-2.5"/>
          <Btn full gradient={G.teal} onClick={async () => {
            setEl(true)
            const r = await callAI("You are PharmaConnect AI for hospital pharmacists in Nigeria. Provide specific emergency sourcing guidance: list 2-3 therapeutic alternatives if needed, types of verified suppliers to contact (NAFDAC-registered), estimated availability in Nigerian market, and any critical patient safety considerations. Be direct and clinical. 4 sentences max.", `Emergency sourcing needed: ${eq}`)
            setEr(r); setEl(false)
          }}>
            {el ? "AI Finding Suppliers..." : <><Siren size={15}/> Find Emergency Suppliers</>}
          </Btn>
          {er && <div className="fade-in mt-3 px-3.5 py-3 bg-white rounded-xl border border-teal-brand/30"><p className="text-text text-[13px] leading-[1.8]">{er}</p></div>}
        </Card>
      </div>
    </div>
  )
}

/* ─── ORDERS PAGE ────────────────────────────────────────────── */
function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [newOrder, setNewOrder] = useState({ medicine: "", qty: "", value: "" })
  const sc = { "In Transit":"#3B82F6", "Confirmed":"#D97706", "Delivered":"#16A34A", "Processing":"#7C3AED" }

  function load() {
    api.orders().then(({ orders }) => setOrders(orders)).catch(() => {})
  }
  useEffect(() => { load() }, [])

  async function createOrder() {
    if (!newOrder.medicine.trim() || !newOrder.qty.trim()) return
    await api.createOrder(newOrder)
    setNewOrder({ medicine: "", qty: "", value: "" })
    setShowNew(false)
    load()
  }

  const NEXT_STATUS = { Processing: "Confirmed", Confirmed: "In Transit", "In Transit": "Delivered" }

  async function advance(o) {
    const next = NEXT_STATUS[o.status]
    if (!next) return
    await api.updateOrder(o.id, { status: next })
    load()
  }

  const isSupplier = user?.role === "supplier"

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Order Tracking</h1>
          <p className="text-muted">Track all medicine orders and deliveries</p>
        </div>
        {!isSupplier && <Btn gradient={G.teal} onClick={() => setShowNew(v => !v)}>+ New Order</Btn>}
      </div>
      {showNew && (
        <Card className="mb-5 !p-5">
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
            <input value={newOrder.medicine} onChange={e => setNewOrder({ ...newOrder, medicine: e.target.value })} placeholder="Medicine"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newOrder.qty} onChange={e => setNewOrder({ ...newOrder, qty: e.target.value })} placeholder="Quantity"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newOrder.value} onChange={e => setNewOrder({ ...newOrder, value: e.target.value })} placeholder="Value (₦)"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <Btn onClick={createOrder}>Save</Btn>
          </div>
        </Card>
      )}
      <Card className="!p-0 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-background">
              {["Order ID","Medicine","Quantity",isSupplier?"Buyer":"Supplier","Status","ETA","Value","Action"].map(h => (
                <th key={h} className="text-left px-4 py-3.5 text-muted text-xs font-bold border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-border hover:bg-background transition-colors">
                <td className="px-4 py-3.5 text-muted text-[13px] font-semibold">{o.order_code}</td>
                <td className="px-4 py-3.5 font-bold text-sm">{o.medicine}</td>
                <td className="px-4 py-3.5 text-muted">{o.qty}</td>
                <td className="px-4 py-3.5 text-muted text-[13px]">{isSupplier ? (o.buyer_org || o.buyer_name || "—") : (o.supplier_org || o.supplier_name || "Unassigned")}</td>
                <td className="px-4 py-3.5">
                  <span className="font-bold text-[13px]" style={{ color: sc[o.status]||'#64748B' }}>● {o.status}</span>
                </td>
                <td className="px-4 py-3.5 text-muted text-[13px]">{o.eta}</td>
                <td className="px-4 py-3.5 text-green-mid font-bold">{o.value}</td>
                <td className="px-4 py-3.5">{o.status!=="Delivered"&&<Btn variant="ghost" size="sm" onClick={() => advance(o)}>{isSupplier ? "Advance" : "Track"}</Btn>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

/* ─── SUPPLIER DASHBOARD ─────────────────────────────────────── */
function SupplierDashboard({ setPage }) {
  const { user } = useAuth()
  const [reqs, setReqs] = useState([])
  const [stockCount, setStockCount] = useState(0)
  const [dispatchedToday, setDispatchedToday] = useState(0)

  function load() {
    api.supplierRequests().then(({ requests }) => setReqs(requests)).catch(() => {})
  }
  useEffect(() => {
    load()
    api.inventory().then(({ stats }) => setStockCount(stats.total)).catch(() => {})
    api.orders().then(({ orders }) => setDispatchedToday(orders.filter(o => o.status === "In Transit" || o.status === "Delivered").length)).catch(() => {})
  }, [])

  async function act(id, status) {
    await api.updateSupplierRequest(id, status)
    load()
  }

  const pendingCount = reqs.filter(r=>r.status==="pending").length

  const stats = [
    { v: String(stockCount),     l:"In Stock",       Icon: Package,      color:'#16A34A' },
    { v:`${pendingCount}`,       l:"New Requests",   Icon: Bell,         color:'#DC2626' },
    { v: String(dispatchedToday),l:"Dispatched",     Icon: Truck,       color:'#1B3FC4' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="grain-overlay bg-grad-purple rounded-[20px] px-8 py-7 mb-6 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-white/75 text-[13px] flex items-center gap-1.5">
              <LocalShippingIcon sx={{ fontSize: 14 }}/> Supplier / Distributor · NAFDAC Verified
              <CheckCircle2 size={13} className="text-[#86EFAC]"/>
            </p>
            <h1 className="font-display text-[28px] font-black my-1">{user?.org_name || user?.name}</h1>
            <p className="text-white/80 text-sm flex items-center gap-1"><MapPin size={13}/> {user?.location || "Location not set"}{user?.license_number ? ` · ${user.license_number}` : ""}</p>
          </div>
          <div className="flex gap-2.5">
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("stock")}>Manage Stock</Btn>
            <Btn size="sm" style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'#fff' }} onClick={() => setPage("analytics")}>Analytics</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 mb-6">
        {stats.map(({ v, l, Icon, color }) => (
          <Card key={l} className="text-center !p-5">
            <Icon size={26} className="mx-auto" style={{ color }}/>
            <div className="font-black my-1" style={{ fontSize: v.startsWith('₦')?20:30, color }}>{v}</div>
            <div className="text-muted text-[13px]">{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 360px' }}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold">Incoming Requests</h2>
            <span className="bg-danger text-white text-[11px] font-extrabold rounded-lg px-2.5 py-0.5">{pendingCount} New</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {reqs.map(r => (
              <div key={r.id} className={cn('rounded-[14px] p-4 border-[1.5px] transition-opacity duration-200', !!r.urgent&&r.status==="pending"?'border-danger':'border-border', r.status!=="pending"?'opacity-60':'')}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-bold text-sm">{r.from_name}</span>
                  {!!r.urgent && r.status==="pending" && <span className="bg-danger text-white text-[10px] font-extrabold rounded-md px-2 py-0.5">URGENT</span>}
                  {r.status!=="pending" && <span className={cn('text-[10px] font-extrabold rounded-md px-2 py-0.5', r.status==="accepted"?'bg-green-light text-green-brand':'bg-slate-100 text-muted')}>{r.status.toUpperCase()}</span>}
                </div>
                <p className="text-blue-brand font-bold text-sm mb-0.5">{r.medicine}</p>
                <p className="text-muted text-[13px] mb-3 last:mb-0">{r.qty} · {timeAgo(r.created_at)}</p>
                {r.status==="pending" && (
                  <div className="flex gap-2">
                    <Btn variant="ghost" size="sm" full onClick={() => act(r.id,"declined")}><X size={13}/> Decline</Btn>
                    <Btn size="sm" full onClick={() => act(r.id,"accepted")}><Check size={13}/> Accept</Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card>
            <h3 className="font-extrabold mb-3 flex items-center gap-2"><Package size={15}/> Upcoming Shipments</h3>
            {[["Augmentin 625mg","120 packs","Jun 10"],["IV Normal Saline","200 bags","Jun 12"],["Metformin 850mg","500 tabs","Jun 15"]].map(([d,q,dt]) => (
              <div key={d} className="py-2.5 border-b border-border last:border-0">
                <p className="font-semibold text-sm mb-0.5">{d}</p>
                <p className="text-muted text-xs">{q} · Arrival: {dt}</p>
              </div>
            ))}
          </Card>
          <Card style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)' }}>
            <h3 className="font-extrabold mb-2 text-purple-brand flex items-center gap-2"><Bot size={15}/> AI Market Intel</h3>
            <p className="text-muted text-[13px] mb-2.5">Get demand forecasts and pricing insights</p>
            <Btn full gradient={G.purple} onClick={() => setPage("analytics")}>Open AI Analytics →</Btn>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ─── EMERGENCY PAGE ─────────────────────────────────────────── */
function EmergencyPage() {
  const [eq, setEq] = useState(""); const [er, setEr] = useState(""); const [el, setEl] = useState(false)
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => {
    api.pharmacies('supplier').then(({ pharmacies }) => setSuppliers(pharmacies)).catch(() => {})
  }, [])

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="bg-red-50 border-2 border-danger rounded-[20px] px-6 py-5 mb-7 flex gap-3.5 items-center">
        <Siren size={32} className="text-danger shrink-0"/>
        <div>
          <h2 className="text-danger font-black text-lg mb-1">Emergency Medicine Sourcing</h2>
          <p className="text-red-700 text-sm">For critical and time-sensitive medicine needs. AI will suggest alternatives and verified suppliers.</p>
        </div>
      </div>

      <Card className="border-2 border-teal-brand/30 mb-5">
        <h3 className="font-extrabold text-base mb-3 flex items-center gap-2"><Bot size={16}/> AI Emergency Sourcing Assistant</h3>
        <textarea value={eq} onChange={e => setEq(e.target.value)}
          placeholder="Describe your emergency sourcing need in detail, e.g.: 'Need 500 vials of Insulin Actrapid urgently for ICU ward. Have 3 patients with DKA. Current stock depleted. Need within 2 hours if possible.'"
          className="w-full border-[1.5px] border-border rounded-[14px] px-4 py-3.5 text-sm outline-none resize-none h-[120px] font-[inherit] box-border mb-3.5"/>
        <Btn size="lg" full gradient={G.teal} onClick={async () => {
          setEl(true)
          const r = await callAI("You are PharmaConnect AI emergency sourcing for hospital pharmacists in Nigeria. Provide: (1) 2-3 therapeutic alternatives with the same class/mechanism, (2) specific types of NAFDAC-registered suppliers to contact, (3) estimated availability in Nigerian market, (4) critical patient safety notes. Format clearly with numbered points. Be direct and clinical.", `Emergency: ${eq}`)
          setEr(r); setEl(false)
        }}>
          {el ? <><Loader2 size={16} className="spin"/> AI Finding Emergency Suppliers...</> : <><Siren size={16}/> Find Emergency Suppliers Now</>}
        </Btn>
        {er && (
          <div className="fade-in mt-4 px-[18px] py-4" style={{ background: 'rgba(13,148,136,0.08)', borderRadius: 14, border: '1px solid rgba(13,148,136,0.3)' }}>
            <p className="font-extrabold text-teal-brand mb-2.5 flex items-center gap-2"><Bot size={14}/> AI Emergency Response:</p>
            <p className="text-text text-sm leading-[1.9] whitespace-pre-wrap">{er}</p>
          </div>
        )}
      </Card>

      <h3 className="font-extrabold mb-3.5">Verified Emergency Suppliers Near You</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
        {suppliers.map(s => (
          <Card key={s.id}>
            <div className="flex justify-between mb-2">
              <h4 className="font-bold text-[15px]">{s.name}</h4>
              {!!s.nafdac_verified && <span className="text-green-brand text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> NAFDAC</span>}
            </div>
            <p className="text-muted text-[13px] mb-0.5 flex items-center gap-1"><MapPin size={11}/> {s.location}</p>
            <p className="text-muted text-[13px] mb-3.5 flex items-center gap-1"><Star size={11}/> {s.rating}</p>
            <div className="flex gap-2">
              <a className="flex-1" href={`tel:${s.phone}`}>
                <Btn full variant="secondary" size="sm" className="gap-1"><Phone size={12}/> Call</Btn>
              </a>
              <Btn full size="sm" onClick={() => api.createOrder({ supplierId: s.owner_user_id, medicine: eq || "Emergency request", qty: "1" }).then(() => alert("Request sent to " + s.name))}>Request</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── STOCK PAGE (Supplier) ──────────────────────────────────── */
function StockPage() {
  const [search, setSearch] = useState("")
  const [stock, setStock] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ name: "", stock: "", price: "", expiry: "" })

  function load() {
    api.inventory().then(({ items }) => setStock(items)).catch(() => {})
  }
  useEffect(() => { load() }, [])

  async function editItem(item) {
    const price = window.prompt(`New price for ${item.name}:`, item.price)
    if (price === null) return
    await api.updateInventoryItem(item.id, { price })
    load()
  }

  async function updateStock(item) {
    const qty = window.prompt(`New available quantity for ${item.name}:`, item.stock)
    if (qty === null) return
    const n = Number(qty)
    const status = n <= 0 ? "Out of Stock" : n < 20 ? "Low Stock" : "In Stock"
    await api.updateInventoryItem(item.id, { stock: n, status })
    load()
  }

  async function addMedicine() {
    if (!newItem.name.trim()) return
    await api.addInventoryItem({ ...newItem, stock: Number(newItem.stock) || 0 })
    setNewItem({ name: "", stock: "", price: "", expiry: "" })
    setShowAdd(false)
    load()
  }

  const shown = stock.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold">Stock Management</h1>
        <Btn gradient={G.purple} onClick={() => setShowAdd(v => !v)}>+ List New Medicine</Btn>
      </div>
      {showAdd && (
        <Card className="mb-5 !p-5">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-end">
            <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Medicine name"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} placeholder="Stock" type="number"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.expiry} onChange={e => setNewItem({ ...newItem, expiry: e.target.value })} placeholder="Expiry"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <Btn onClick={addMedicine}>Save</Btn>
          </div>
        </Card>
      )}
      <div className="relative mb-5 max-w-[400px]">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stock..."
          className="w-full border-[1.5px] border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
      </div>
      <Card className="!p-0 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-background">
              {["Medicine","Available Qty","Price","Status","Action"].map(h => (
                <th key={h} className="text-left px-[18px] py-3.5 text-muted text-xs font-bold border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(item => (
              <tr key={item.id} className="border-b border-border hover:bg-background transition-colors">
                <td className="px-[18px] py-3.5 font-semibold text-sm">{item.name}</td>
                <td className="px-[18px] py-3.5 text-muted">{item.stock}</td>
                <td className="px-[18px] py-3.5 text-green-mid font-bold">{item.price}</td>
                <td className="px-[18px] py-3.5"><Badge status={item.status}/></td>
                <td className="px-[18px] py-3.5">
                  <div className="flex gap-2">
                    <Btn variant="ghost" size="sm" onClick={() => editItem(item)}>Edit</Btn>
                    <Btn variant="secondary" size="sm" onClick={() => updateStock(item)}>Update Stock</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

/* ─── SOURCING PAGE ──────────────────────────────────────────── */
function SourcingPage() {
  const [q, setQ] = useState(""); const [r, setR] = useState(""); const [l, setL] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [stockOf, setStockOf] = useState(null)

  useEffect(() => {
    api.pharmacies('supplier').then(({ pharmacies }) => setSuppliers(pharmacies)).catch(() => {})
  }, [])

  async function viewStock(s) {
    const { inventory } = await api.pharmacy(s.id)
    setStockOf({ supplier: s, items: inventory || [] })
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-1">Medicine Sourcing</h1>
      <p className="text-muted mb-7">Find verified suppliers and source scarce medicines</p>

      <Card className="mb-6">
        <h3 className="font-extrabold mb-3 flex items-center gap-2"><Bot size={15}/> AI Sourcing Assistant</h3>
        <div className="flex gap-3 mb-2.5 flex-wrap">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="What medicine do you need to source? Include quantity and urgency..."
            className="flex-1 min-w-[250px] border-[1.5px] border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-brand transition-colors"/>
          <Btn onClick={async () => {
            setL(true)
            const res = await callAI("You are PharmaConnect AI sourcing agent for Nigerian community pharmacists. Provide specific sourcing advice: name 2-3 verified supplier types in Nigeria, suggest alternatives if shortage exists, mention typical turnaround times, and note any NAFDAC considerations. Be practical and specific. 4 sentences max.", q)
            setR(res); setL(false)
          }} className="gap-1.5">
            <Search size={15}/> {l ? "Finding..." : "Find Sources"}
          </Btn>
        </div>
        {r && <div className="fade-in px-4 py-3 bg-blue-light rounded-xl"><p className="text-sm leading-[1.8]">{r}</p></div>}
      </Card>

      <h3 className="font-extrabold mb-3.5">Verified Supplier Network</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
        {suppliers.map(s => (
          <Card key={s.id} className="transition-all duration-150 hover:shadow-md">
            <div className="flex justify-between mb-2">
              <h4 className="font-bold text-[15px]">{s.name}</h4>
              {!!s.nafdac_verified && <span className="text-green-brand text-[11px] font-bold flex items-center gap-1"><CheckCircle2 size={11}/> NAFDAC Verified</span>}
            </div>
            <p className="text-muted text-[13px] mb-0.5 flex items-center gap-1"><MapPin size={11}/> {s.location}</p>
            <p className="text-muted text-[13px] mb-3.5 flex items-center gap-1"><Star size={11}/> {s.rating}</p>
            <div className="flex gap-2">
              <Btn full variant="secondary" size="sm" onClick={() => viewStock(s)}>View Stock</Btn>
              <Btn full size="sm" onClick={() => api.createOrder({ supplierId: s.owner_user_id, medicine: "Supply request", qty: "1" }).then(() => alert("Request sent to " + s.name))}>Request Supply</Btn>
            </div>
          </Card>
        ))}
      </div>

      {stockOf && (
        <Card className="mt-6 fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold">{stockOf.supplier.name} — Available Stock</h3>
            <Btn variant="ghost" size="sm" onClick={() => setStockOf(null)}><X size={14}/></Btn>
          </div>
          {stockOf.items.length === 0 ? <p className="text-muted text-sm">No stock listed.</p> : (
            <table className="w-full border-collapse">
              <thead><tr className="border-b-2 border-border">{["Medicine","Stock","Price","Status"].map(h => <th key={h} className="text-left px-2.5 py-2 text-muted text-xs font-bold">{h}</th>)}</tr></thead>
              <tbody>
                {stockOf.items.map(i => (
                  <tr key={i.id} className="border-b border-border">
                    <td className="px-2.5 py-3 font-semibold text-sm">{i.name}</td>
                    <td className="px-2.5 py-3 text-muted text-sm">{i.stock}</td>
                    <td className="px-2.5 py-3 text-green-mid font-semibold text-sm">{i.price}</td>
                    <td className="px-2.5 py-3"><Badge status={i.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  )
}

/* ─── PROFILE PAGE ───────────────────────────────────────────── */
function ProfilePage({ userType, onSwitchRole, onSignOut }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(null)
  const icons = {
    patient:    () => <PersonIcon sx={{ fontSize: 40 }}/>,
    pharmacist: () => <LocalPharmacyIcon sx={{ fontSize: 40 }}/>,
    hospital:   () => <MedicalServicesIcon sx={{ fontSize: 40 }}/>,
    supplier:   () => <LocalShippingIcon sx={{ fontSize: 40 }}/>,
  }
  const grads = { patient: G.main, pharmacist: G.green, hospital: G.teal, supplier: G.purple }
  const roleLabels = { patient: "Patient", pharmacist: "Community Pharmacist", hospital: "Hospital Pharmacist", supplier: "Supplier / Distributor" }
  const Icon = icons[userType] || icons.patient

  const menuItems = [
    { key: "notifications", Icon: Bell,        label:"Notifications",        desc:"Manage alerts and safety notices" },
    { key: "security",      Icon: Lock,        label:"Security & Privacy",   desc:"Password, 2FA, data settings" },
    { key: "language",      Icon: Globe,       label:"Language Settings",    desc:"English, Yoruba, Hausa, Igbo, French" },
    { key: "billing",       Icon: CreditCard,  label:"Subscription & Billing",desc:"Manage your plan" },
    { key: "help",          Icon: HelpCircle,  label:"Help & Support",       desc:"Documentation and support" },
    { key: "terms",         Icon: FileText,    label:"Terms & Privacy",      desc:"Legal information" },
  ]

  const panelContent = {
    notifications: <p className="text-sm text-muted">Email alerts go to <strong>{user?.email}</strong>. Low-stock, recall, and order alerts are on by default — manage them from the Alerts page.</p>,
    security:      <p className="text-sm text-muted">Signed in as <strong>{user?.email}</strong>. Sessions use a 7-day token; sign out below to revoke this device.</p>,
    language:      <p className="text-sm text-muted">Search supports English, Yoruba, Hausa, Igbo and French — choose a language on the Search page before asking PharmaConnect AI.</p>,
    billing:       <p className="text-sm text-muted">{user?.role === "patient" ? "Free Plan — no billing required." : "Verified partner account — no billing required during the pilot."}</p>,
    help:          <p className="text-sm text-muted">Need help? Email <a className="text-blue-brand underline" href="mailto:support@pharmaconnect.ng">support@pharmaconnect.ng</a>.</p>,
    terms:         <p className="text-sm text-muted">PharmaConnect is a demo medicine-availability platform. Medicine information is AI-generated and not a substitute for professional medical advice.</p>,
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <Card className="mb-5 !p-8 text-white" style={{ background: grads[userType] || G.main }}>
        <div className="flex gap-5 items-center flex-wrap">
          <div className="size-20 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Icon />
          </div>
          <div>
            <h1 className="text-2xl font-black mb-1">{user?.org_name || user?.name}</h1>
            <p className="text-white/80 text-sm mb-1">{roleLabels[userType] || roleLabels.patient}</p>
            <p className="text-white/70 text-[13px] flex items-center gap-1"><MapPin size={12}/> {user?.location || "Location not set"}</p>
          </div>
          <div className="ml-auto">
            <span className="bg-white/20 px-3.5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14}/> {user?.role === "patient" ? "Free Plan" : "Verified Partner"}
            </span>
          </div>
        </div>
      </Card>

      {menuItems.map(({ key, Icon: MIcon, label, desc }) => (
        <div key={key}>
          <Card className="mb-2.5 flex items-center gap-3.5 !p-4 !px-5 transition-all duration-150 hover:shadow-md cursor-pointer" onClick={() => setOpen(open === key ? null : key)}>
            <MIcon size={22} className="text-muted shrink-0"/>
            <div className="flex-1">
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-muted text-xs">{desc}</p>
            </div>
            <ChevronRight size={18} className={cn("text-muted transition-transform", open === key && "rotate-90")}/>
          </Card>
          {open === key && <Card className="mb-2.5 !p-4 !px-5 -mt-2 bg-background">{panelContent[key]}</Card>}
        </div>
      ))}

      <div className="flex gap-3 mt-5">
        <Btn full variant="secondary" onClick={onSwitchRole} className="gap-1.5"><RefreshCw size={15}/> Switch Role</Btn>
        <Btn full variant="danger" onClick={onSignOut}>Sign Out</Btn>
      </div>
    </div>
  )
}

/* ─── AUTH SCREEN (LOGIN / SIGNUP) ───────────────────────────── */
function AuthScreen({ initialRole, onDone }) {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState("signup")
  const [role, setRole] = useState(initialRole || "patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [location, setLocation] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [err, setErr] = useState("")
  const [busy, setBusy] = useState(false)

  const roleLabels = { patient: "Patient", pharmacist: "Community Pharmacist", hospital: "Hospital Pharmacist", supplier: "Supplier / Distributor" }

  async function submit(e) {
    e.preventDefault()
    setErr(""); setBusy(true)
    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await signup({ email, password, name, role, orgName, location, licenseNumber })
      }
      onDone()
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-[440px] mx-auto px-6 py-16">
      <div className="flex justify-center mb-6"><Logo size={44}/></div>
      <h1 className="text-2xl font-extrabold text-center mb-1">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="text-muted text-sm text-center mb-7">{mode === "login" ? "Sign in to PharmaConnect AI" : "Join PharmaConnect AI as a " + roleLabels[role]}</p>

      <Card>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <select value={role} onChange={e => setRole(e.target.value)}
              className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors">
              {Object.entries(roleLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          )}
          {mode === "signup" && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required
              className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required
            className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6}
            className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
          {mode === "signup" && role !== "patient" && (
            <>
              <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Organization name (e.g. Grace Pharmacy)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (e.g. Surulere, Lagos)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
              <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="License / CAC number (optional)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
            </>
          )}
          {err && <p className="text-danger text-[13px] font-semibold">{err}</p>}
          <Btn type="submit" full size="lg" className="mt-1">{busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}</Btn>
        </form>
      </Card>

      <p className="text-center text-muted text-[13px] mt-5">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-blue-brand font-bold bg-transparent border-0 cursor-pointer">
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  )
}

/* ─── APP (ROOT) ─────────────────────────────────────────────── */
function App() {
  const { user, loading, signOut: authSignOut } = useAuth()
  const [page, setPage] = useState("landing")
  const [pendingRole, setPendingRole] = useState(null)
  const pageContentRef = useRef(null)

  useEffect(() => {
    if (!pageContentRef.current) return
    const tween = gsap.fromTo(pageContentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,transform' }
    )
    return () => tween.kill()
  }, [page, user])

  function chooseRole(role) {
    if (role === null) {
      setPage("choose")
    } else {
      setPendingRole(role)
      setPage("auth")
    }
  }

  function signOut() {
    authSignOut()
    setPage("landing")
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading...</div>

  if (!user) {
    if (page === "auth") return (
      <div ref={pageContentRef}>
        <AuthScreen initialRole={pendingRole} onDone={() => setPage(pendingRole === "patient" ? "home" : "dashboard")} />
      </div>
    )
    if (page === "choose") return (
      <div ref={pageContentRef}>
        <ChooseRole onSelect={r => { setPendingRole(r); setPage("auth") }} />
      </div>
    )
    return (
      <div ref={pageContentRef}>
        <Landing onChoose={chooseRole} />
      </div>
    )
  }

  const userType = user.role

  function renderPage() {
    if (page === "alerts")  return <AlertsPage />
    if (page === "profile") return <ProfilePage userType={userType} onSwitchRole={signOut} onSignOut={signOut} />

    switch (userType) {
      case "patient":
        if (page === "home")   return <PatientHome setPage={setPage} />
        if (page === "search") return <SearchPage />
        if (page === "map")    return <MapPage />
        return <PatientHome setPage={setPage} />

      case "pharmacist":
        if (page === "dashboard") return <PharmacistDashboard setPage={setPage} />
        if (page === "inventory") return <InventoryPage />
        if (page === "sourcing")  return <SourcingPage />
        if (page === "insights")  return <InsightsPage userType={userType} />
        return <PharmacistDashboard setPage={setPage} />

      case "hospital":
        if (page === "dashboard") return <HospitalDashboard setPage={setPage} />
        if (page === "emergency") return <EmergencyPage />
        if (page === "orders")    return <OrdersPage />
        if (page === "insights")  return <InsightsPage userType={userType} />
        return <HospitalDashboard setPage={setPage} />

      case "supplier":
        if (page === "dashboard") return <SupplierDashboard setPage={setPage} />
        if (page === "stock")     return <StockPage />
        if (page === "requests")  return <SupplierDashboard setPage={setPage} />
        if (page === "analytics") return <InsightsPage userType={userType} />
        return <SupplierDashboard setPage={setPage} />

      default:
        return <PatientHome setPage={setPage} />
    }
  }

  return (
    <div>
      <Nav page={page} setPage={setPage} userType={userType} onSignOut={signOut} />
      <div ref={pageContentRef}>
        {renderPage()}
      </div>
    </div>
  )
}

export default App

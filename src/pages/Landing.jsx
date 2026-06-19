import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import {
  Globe, MapPin, DollarSign, Link2, Shield, AlertOctagon,
} from 'lucide-react'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import PersonIcon from '@mui/icons-material/Person'
import { G } from '@/lib/gradients'
import { Logo } from '@/components/Logo'
import { Card, Btn } from '@/components/ui'

/* ─── LANDING ────────────────────────────────────────────────── */
export function Landing() {
  const navigate = useNavigate()
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
        // Removed opacity: 0 to fix visibility issues
        gsap.from(cards, { y: 40, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.5 })
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
    { id:"patient",    Icon: () => <PersonIcon sx={{ fontSize: 30 }} />, label:"Patient",               desc:"Search medicines, compare branded & generic options, find nearby pharmacies with real prices", color:'#1B3FC4', grad:G.main  },
    { id:"pharmacist", Icon: () => <LocalPharmacyIcon sx={{ fontSize: 30 }} />, label:"Community Pharmacist", desc:"Manage inventory, respond to patient requests, access AI demand insights",                  color:'#16A34A', grad:G.green },
  ]

  const features = [
    { Icon: Globe,         title:"Multilingual AI Search",    desc:"Search in English, Yoruba, Hausa, Igbo or French. Our AI understands local names, corrects spelling, and finds matches." },
    { Icon: MapPin,        title:"Location-Based Visibility",  desc:"See only pharmacies near you with real-time stock status — In Stock, Low, or Out of Stock — at a glance." },
    { Icon: DollarSign,    title:"Budget-Aware Matching",      desc:"Search within your budget. Compare generic and branded options. Find the most affordable verified medicine nearby." },
    { Icon: Link2,         title:"Pharmacy-to-Pharmacy",       desc:"Pharmacists can source scarce medicines from other verified pharmacies when suppliers can't deliver fast enough." },
    { Icon: Shield,        title:"Verified Network",           desc:"Every pharmacy and supplier is PCN licensed, CAC registered, and NAFDAC approved before appearing on the platform." },
    { Icon: AlertOctagon,  title:"Safety & Recall Alerts",     desc:"Instant notifications on counterfeits, NAFDAC recalls, packaging updates, and supply-chain safety notices." },
  ]

  function onChoose(role) {
    if (!role) navigate('/choose')
    else navigate(`/auth?role=${role}`)
  }

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

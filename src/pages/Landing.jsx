import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import { MapPin, Shield, AlertOctagon, Clock, Phone } from 'lucide-react'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import PersonIcon from '@mui/icons-material/Person'
import { Logo } from '@/components/Logo'
import { Card, Btn } from '@/components/ui'

export function Landing() {
  const navigate  = useNavigate()
  const heroRef   = useRef(null)
  const titleRef  = useRef(null)
  const descRef   = useRef(null)
  const ctaRef    = useRef(null)
  const cardsRef  = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(titleRef.current, { opacity: 0, y: 40, duration: 0.7 })
        .from(descRef.current,  { opacity: 0, y: 24, duration: 0.5 }, '-=0.3')
        .from(ctaRef.current,   { opacity: 0, y: 18, duration: 0.4 }, '-=0.2')

      if (cardsRef.current) {
        gsap.from(cardsRef.current.querySelectorAll('.role-card'), {
          opacity: 0, y: 40, duration: 0.5, stagger: 0.12, ease: 'power3.out', delay: 0.4,
        })
      }
      if (featuresRef.current) {
        gsap.from(featuresRef.current.querySelectorAll('.feature-item'), {
          opacity: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
        })
      }
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const roles = [
    {
      id: 'patient',
      Icon: () => <PersonIcon sx={{ fontSize: 30 }} />,
      label: 'Patient',
      desc: 'Search medicines, compare branded & generic options, find nearby pharmacies with real prices.',
      color: '#1B3FC4',
    },
    {
      id: 'pharmacist',
      Icon: () => <LocalPharmacyIcon sx={{ fontSize: 30 }} />,
      label: 'Pharmacist',
      desc: 'Manage inventory, respond to patient queries, track stock levels and get demand insights.',
      color: '#16A34A',
    },
  ]

  const features = [
    { Icon: MapPin,       title: 'Location-Based Search',   desc: 'See only pharmacies near you with real-time stock status — In Stock, Low, or Out of Stock — at a glance.' },
    { Icon: Phone,        title: 'Direct Contact',           desc: 'Call pharmacies directly or get Google Maps directions to any pharmacy in one tap.' },
    { Icon: Clock,        title: 'Real-Time Availability',   desc: 'Know before you go. Check opening hours and current stock levels before making the trip.' },
    { Icon: Shield,       title: 'Verified Network',         desc: 'Every pharmacy is PCN licensed, CAC registered, and NAFDAC approved before appearing on the platform.' },
    { Icon: AlertOctagon, title: 'Safety & Recall Alerts',   desc: 'Instant notifications on counterfeits, NAFDAC recalls, packaging updates, and supply-chain safety notices.' },
  ]

  function onChoose(role) {
    if (!role) navigate('/choose')
    else navigate(`/auth?role=${role}`)
  }

  return (
    <div ref={heroRef}>

      {/* ── HERO — fullscreen with backdrop ── */}
      <div
        className="relative min-h-screen flex flex-col justify-center px-6"
        style={{
          backgroundImage: 'url(/backdrop.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* nav strip */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="text-white font-extrabold text-xl tracking-tight">PharmaConnect</span>
          </div>
          <button
            onClick={() => onChoose(null)}
            className="px-5 py-2 rounded-xl bg-white/15 border border-white/30 text-white text-sm font-semibold backdrop-blur-sm cursor-pointer hover:bg-white/25 transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* hero content */}
        <div className="relative z-10 max-w-[760px] mx-auto text-center pt-24">
          <h1
            ref={titleRef}
            className="text-white font-black text-[clamp(38px,6vw,72px)] leading-[1.05] tracking-tight mb-6"
          >
            Find Your Medicine.<br />
            <span style={{ color: '#86EFAC' }}>Right Around You.</span>
          </h1>
          <p
            ref={descRef}
            className="text-white/80 text-[clamp(16px,2.2vw,20px)] mb-10 leading-[1.7] max-w-[560px] mx-auto"
          >
            PharmaConnect connects patients with nearby pharmacies across Lagos — check stock, get directions, call directly.
          </p>
          <div ref={ctaRef} className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => onChoose('patient')}
              className="px-8 py-3.5 rounded-2xl font-bold text-base cursor-pointer transition-all hover:scale-[1.02]"
              style={{ background: '#1B3FC4', color: '#fff' }}
            >
              Find Medicine Near Me
            </button>
            <button
              onClick={() => onChoose('pharmacist')}
              className="px-8 py-3.5 rounded-2xl font-bold text-base cursor-pointer bg-white/15 border border-white/30 text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              I'm a Pharmacist
            </button>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      {/* ── ROLE CARDS ── */}
      <div className="max-w-[900px] mx-auto px-6 py-20">
        <h2 className="text-center text-[30px] font-black mb-2 tracking-tight">Built for Patients & Pharmacists</h2>
        <p className="text-center text-muted mb-12">Choose your role to access a tailored experience</p>
        <div ref={cardsRef} className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {roles.map(u => (
            <Card
              key={u.id}
              className="role-card text-center p-8 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 border-t-[3px]"
              style={{ borderTopColor: u.color }}
              onClick={() => onChoose(u.id)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 36px ${u.color}28` }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '' }}
            >
              <div
                className="size-16 rounded-[18px] flex items-center justify-center mx-auto mb-4"
                style={{ background: `${u.color}15`, color: u.color }}
              >
                <u.Icon />
              </div>
              <h3 className="text-base font-extrabold mb-2 tracking-tight">{u.label}</h3>
              <p className="text-muted text-[13px] leading-relaxed mb-6">{u.desc}</p>
              <button
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all hover:opacity-90"
                style={{ background: u.color }}
                onClick={e => { e.stopPropagation(); onChoose(u.id) }}
              >
                Enter as {u.label}
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-center text-[30px] font-black mb-2 tracking-tight">Why PharmaConnect?</h2>
          <p className="text-center text-muted mb-14">Because medicine access shouldn't depend on WhatsApp groups and guesswork.</p>
          <div ref={featuresRef} className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {features.map(f => (
              <div key={f.title} className="feature-item flex gap-4 py-5">
                <div className="size-12 rounded-[14px] bg-blue-light flex items-center justify-center shrink-0 text-blue-brand">
                  <f.Icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold mb-1.5 text-[15px] tracking-tight">{f.title}</h4>
                  <p className="text-muted text-[13px] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="py-16 px-6" style={{ background: '#1B3FC4' }}>
        <div className="max-w-[900px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 text-center">
          {[
            ['Lagos', 'Coverage Area'],
            ['Real-time', 'Stock Visibility'],
            ['Verified', 'Pharmacies Only'],
            ['NAFDAC', 'Compliance Ready'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-[#86EFAC] text-[28px] font-black mb-1.5 tracking-tight">{v}</div>
              <div className="text-white/75 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#14130F] py-14 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Logo size={28} />
              <span className="text-white font-extrabold text-base tracking-tight">PharmaConnect</span>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed">Connecting Patients to Pharmacies · Lagos, Nigeria</p>
          </div>
          <div>
            <p className="text-white/70 font-bold text-[13px] mb-3">Platform</p>
            <p className="text-white/40 text-[13px] mb-2">Search Medicines</p>
            <p className="text-white/40 text-[13px] mb-2">Find Pharmacies</p>
            <p className="text-white/40 text-[13px]">Safety Alerts</p>
          </div>
          <div>
            <p className="text-white/70 font-bold text-[13px] mb-3">For Pharmacists</p>
            <p className="text-white/40 text-[13px] mb-2">Manage Inventory</p>
            <p className="text-white/40 text-[13px]">Patient Requests</p>
          </div>
          <div>
            <p className="text-white/70 font-bold text-[13px] mb-3">Compliance</p>
            <p className="text-white/40 text-[13px] mb-2">NAFDAC Approved</p>
            <p className="text-white/40 text-[13px]">PCN · CAC Verified</p>
          </div>
        </div>
        <div className="max-w-[1000px] mx-auto border-t border-white/10 mt-10 pt-6 text-white/25 text-xs">
          © 2026 PharmaConnect. Built for Nigeria.
        </div>
      </footer>
    </div>
  )
}

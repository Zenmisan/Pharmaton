import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Heart, Shield, Zap } from 'lucide-react'
import { Logo } from '@/components/Logo'

const team = [
  {
    name: 'Oboerhiri Ogheneochuko Emmanuella',
    role: 'Pharmacy & Clinical Lead',
    bio: 'Future Pharmacist 💊 · Healthcare innovator · Passionate about improving medicine accessibility and patient care.',
    color: '#1B3FC4',
    initials: 'OE',
    photo: '/team-emmanuella.jpg',
  },
  {
    name: 'Amusa Zainab Atinuke',
    role: 'Healthcare Advocate',
    bio: 'Future Pharmacist · Healthcare advocate · Building bridges between patients and pharmacy care across Nigeria.',
    color: '#15803D',
    initials: 'ZA',
    photo: '/team-zainab.jpg',
  },
  {
    name: 'Babaniyi Daniel Oluwatosin',
    role: 'Healthcare Advocate',
    bio: 'Future pharmacist · Healthcare advocate · Committed to reimagining how patients access safe and affordable medicine.',
    color: '#0D9488',
    initials: 'BD',
    photo: '/team-daniel.jpg',
  },
  {
    name: 'Adigun Khadijah',
    role: 'Product & Strategy',
    bio: 'Sabi girl · Brings sharp product thinking and user insight to everything PharmaConnect does.',
    color: '#7C3AED',
    initials: 'AK',
    photo: null,
  },
  {
    name: 'Adedunye Imisioluwa Praise',
    role: 'Web Developer',
    bio: 'Builds the platform that powers it all — from search to pharmacy dashboards — with speed, care, and craft.',
    color: '#C2410C',
    initials: 'AP',
    photo: '/team-praise.jpg',
  },
]

const values = [
  { Icon: Heart,  title: 'Patient First',  desc: 'Every decision starts with what makes it easier for patients to access safe, affordable medicine.' },
  { Icon: Shield, title: 'Verified Only',  desc: 'Only PCN-licensed, NAFDAC-compliant pharmacies appear on our platform. No shortcuts on safety.' },
  { Icon: Zap,    title: 'Speed & Access', desc: 'Seconds matter in healthcare. We build for speed so patients find what they need before making the journey.' },
  { Icon: MapPin, title: 'Local First',    desc: 'Built specifically for Lagos and Nigeria — local pricing, local languages, local pharmacy networks.' },
]

function TeamAvatar({ member }) {
  const [imgError, setImgError] = useState(false)
  if (member.photo && !imgError) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        onError={() => setImgError(true)}
        className="w-[88px] h-[88px] rounded-full object-cover object-top border-[3px] border-white shadow-md mx-auto mb-3"
      />
    )
  }
  return (
    <div
      className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 border-[3px] border-white shadow-md"
      style={{ background: member.color }}
    >
      {member.initials}
    </div>
  )
}

export function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-border bg-white hover:bg-surface transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-base">About PharmaConnect</span>
      </div>

      {/* Hero */}
      <div className="bg-[#1B3FC4] text-white px-6 py-20 text-center">
        <div className="max-w-[640px] mx-auto">
          <div className="flex justify-center mb-6">
            <Logo size={72} />
          </div>
          <h1 className="text-[clamp(28px,5vw,48px)] font-black mb-4 tracking-tight">
            Medicine Access,<br />Built for Nigeria
          </h1>
          <p className="text-white/80 text-[clamp(15px,2vw,18px)] leading-[1.7]">
            PharmaConnect connects patients with verified pharmacies across Lagos —
            making it easy to check stock, compare prices, and get directions before you leave home.
          </p>
        </div>
      </div>

      {/* The Problem */}
      <div className="max-w-[800px] mx-auto px-6 py-16">
        <h2 className="text-[26px] font-black mb-4 tracking-tight">The Problem We're Solving</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-[15px] leading-[1.8] text-muted">
          <p>
            Every day in Lagos, patients travel from pharmacy to pharmacy looking for a specific medicine
            — only to find it out of stock or priced beyond their budget. There's no central way to know
            what's available and where.
          </p>
          <p>
            Pharmacists spend hours fielding phone calls for stock checks they can't handle at scale.
            Counterfeit medicines circulate because patients can't tell verified from unverified sellers.
            PharmaConnect fixes all of this.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[26px] font-black mb-10 tracking-tight text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="flex gap-4">
                <div className="size-11 rounded-[12px] bg-blue-light flex items-center justify-center shrink-0 text-blue-brand">
                  <v.Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1 tracking-tight">{v.title}</h4>
                  <p className="text-muted text-[13px] leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team — blurred group photo bg + individual cards */}
      <div className="relative py-20 overflow-hidden">
        {/* Blurred background */}
        <img
          src="/team-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'blur(6px)', opacity: 0.22 }}
        />
        <div className="absolute inset-0 bg-background/60" />

        <div className="relative z-10 max-w-[960px] mx-auto px-6">
          <h2 className="text-[26px] font-black mb-2 tracking-tight text-center">The Team</h2>
          <p className="text-center text-muted mb-12">Built by people who understand the problem firsthand</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map(m => (
              <div key={m.name} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6 text-center flex flex-col items-center">
                <TeamAvatar member={m} />
                <h3 className="font-extrabold text-[14px] leading-snug tracking-tight mb-0.5">{m.name}</h3>
                <p className="text-[11px] font-bold mb-3" style={{ color: m.color }}>{m.role}</p>
                <p className="text-muted text-[12px] leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#1B3FC4] text-white px-6 py-16 text-center">
        <h2 className="text-[24px] font-black mb-3 tracking-tight">Ready to find your medicine?</h2>
        <p className="text-white/75 mb-8">Join thousands of patients and pharmacies already on PharmaConnect</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3.5 rounded-2xl font-bold bg-white text-[#1B3FC4] cursor-pointer hover:bg-white/90 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

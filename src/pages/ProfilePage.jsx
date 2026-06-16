import { useState } from 'react'
import {
  Bell, Lock, Globe, CreditCard, HelpCircle, FileText, MapPin, CheckCircle2, ChevronRight, RefreshCw,
} from 'lucide-react'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '@/lib/auth.jsx'
import { cn } from '@/lib/utils'
import { G } from '@/lib/gradients'
import { Card, Btn } from '@/components/ui'

/* ─── PROFILE PAGE ───────────────────────────────────────────── */
export function ProfilePage({ userType, onSwitchRole, onSignOut }) {
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

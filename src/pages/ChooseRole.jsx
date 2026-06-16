import { ChevronRight } from 'lucide-react'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PersonIcon from '@mui/icons-material/Person'
import { Logo } from '@/components/Logo'
import { Card } from '@/components/ui'

/* ─── CHOOSE ROLE ────────────────────────────────────────────── */
export function ChooseRole({ onSelect }) {
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

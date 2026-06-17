import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'

/* ─── NAV ────────────────────────────────────────────────────── */
export function Nav({ userType, onSignOut }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = userType === "patient"
    ? [["/dashboard","Home"],["/search","Search Medicine"],["/map","Find Pharmacies"],["/alerts","Safety Alerts"]]
    : userType === "pharmacist"
    ? [["/dashboard","Dashboard"],["/inventory","Inventory"],["/sourcing","Sourcing"],["/insights","AI Insights"]]
    : userType === "hospital"
    ? [["/dashboard","Dashboard"],["/emergency","Emergency"],["/orders","Orders"],["/insights","AI Insights"]]
    : [["/dashboard","Dashboard"],["/stock","My Stock"],["/requests","Requests"],["/analytics","Analytics"]]

  return (
    <nav className={cn(
      'bg-surface/85 backdrop-blur-md border-b border-border sticky top-0 z-[100] transition-shadow duration-200',
      scrolled ? 'shadow-[0_4px_20px_rgba(20,19,15,0.06)]' : 'shadow-none'
    )}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 bg-transparent border-0 shrink-0 cursor-pointer"
        >
          <Logo size={34} />
          <span className="font-display font-black text-lg text-text">
            Pharma<span className="text-green-mid">Connect</span>
            <span className="text-[13px] font-extrabold ml-1 border border-border px-1.5 py-px rounded-md text-blue-brand">AI</span>
          </span>
        </button>

        <div className="hidden md:flex gap-1 flex-1">
          {links.map(([path, label]) => (
            <button key={path} onClick={() => navigate(path)}
              className={cn(
                'relative px-3.5 py-1.5 rounded-lg border-0 font-semibold text-sm transition-all duration-150 cursor-pointer',
                pathname === path ? 'text-blue-brand' : 'bg-transparent text-muted hover:bg-blue-light/50'
              )}>
              {label}
              {pathname === path && <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] bg-blue-brand rounded-full" />}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={() => navigate('/alerts')}
            className="relative bg-transparent border-0 p-1.5 cursor-pointer text-muted hover:text-text transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-danger border-2 border-white" />
          </button>
          <button onClick={() => navigate('/profile')}
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
          {links.map(([path, label]) => (
            <button key={path} onClick={() => { navigate(path); setOpen(false) }}
              className={cn(
                'px-4 py-3 rounded-xl border-0 font-semibold text-[15px] text-left cursor-pointer transition-colors',
                pathname === path ? 'bg-blue-light text-blue-brand' : 'bg-transparent text-text hover:bg-background'
              )}>
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

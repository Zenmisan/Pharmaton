import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShieldAlert, BarChart3,
  MessageSquare, FileText, Settings, Menu, Bell, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/lib/auth.jsx'

const NAV = [
  { Icon: LayoutDashboard, label: 'Dashboard',            path: '/dashboard' },
  { Icon: Package,         label: 'My Inventory',         path: '/inventory' },
  { Icon: ShieldAlert,     label: 'Safety & Alerts',      path: '/alerts'    },
  { Icon: BarChart3,       label: 'Analytics & Insights', path: '/insights'  },
]

const DISABLED = [
  { Icon: MessageSquare, label: 'Messages' },
  { Icon: FileText,      label: 'Reports'  },
]

function Sidebar({ onNavigate, onSignOut }) {
  const navigate    = useNavigate()
  const { pathname} = useLocation()
  const { user }    = useAuth()

  function go(path) { navigate(path); onNavigate?.() }

  return (
    <aside className="w-[240px] flex flex-col h-full bg-white border-r border-border">
      {/* Logo */}
      <div className="px-5 py-[18px] flex items-center gap-2.5 border-b border-border shrink-0">
        <Logo size={32} />
        <span className="font-display font-black text-[17px] text-text leading-none">
          Pharma<span className="text-green-mid">Connect</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-black text-subtle px-2 mb-2 tracking-[0.12em] uppercase">Menu</p>
        {NAV.map(({ Icon, label, path }) => {
          const active = pathname === path
          return (
            <button key={path} onClick={() => go(path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] mb-1 font-semibold text-[13.5px] text-left cursor-pointer border-0 transition-all',
                active
                  ? 'bg-blue-brand text-white shadow-[0_4px_12px_rgba(27,63,196,0.28)]'
                  : 'bg-transparent text-muted hover:bg-background hover:text-text'
              )}>
              <Icon size={16} />
              {label}
            </button>
          )
        })}

        <p className="text-[10px] font-black text-subtle px-2 mb-2 mt-5 tracking-[0.12em] uppercase">Coming Soon</p>
        {DISABLED.map(({ Icon, label }) => (
          <div key={label}
            className="flex items-center gap-3 px-3 py-[10px] rounded-[12px] mb-1 text-[13.5px] text-subtle/40 cursor-not-allowed select-none">
            <Icon size={16} />
            {label}
            <span className="ml-auto text-[9px] font-black bg-border text-subtle/60 px-1.5 py-0.5 rounded-full">SOON</span>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 py-2 border-t border-border shrink-0">
        <button onClick={() => go('/profile')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] font-semibold text-[13.5px] text-left cursor-pointer border-0 transition-all',
            pathname === '/profile' ? 'bg-blue-brand text-white' : 'bg-transparent text-muted hover:bg-background hover:text-text'
          )}>
          <Settings size={16} /> Settings
        </button>
      </div>

      {/* AI Assistant card */}
      <div className="mx-3 mb-4 p-4 rounded-2xl text-white shrink-0"
        style={{ background: 'linear-gradient(135deg,#1B3FC4 0%,#15803D 100%)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} />
          <span className="font-extrabold text-[13px]">AI Assistant</span>
        </div>
        <p className="text-[11px] text-white/70 mb-3 leading-[1.55]">Your smart pharma companion for demand & market insights</p>
        <button onClick={() => go('/insights')}
          className="w-full py-[9px] rounded-xl bg-white/20 border border-white/30 text-white text-[12px] font-bold cursor-pointer hover:bg-white/30 transition-colors">
          Ask PharmaConnect
        </button>
      </div>
    </aside>
  )
}

export function PharmacistLayout({ children, onSignOut }) {
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col w-[240px] shrink-0 h-screen overflow-y-auto">
        <Sidebar onSignOut={onSignOut} />
      </div>

      {/* Mobile sidebar drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-[240px] h-full flex flex-col shadow-2xl overflow-y-auto">
            <Sidebar onNavigate={() => setOpen(false)} onSignOut={onSignOut} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Right panel: topbar + scrollable content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center gap-3 px-5 py-3 bg-white border-b border-border shrink-0">
          {/* Mobile: hamburger */}
          <button onClick={() => setOpen(true)}
            className="md:hidden p-1.5 rounded-lg border border-border cursor-pointer bg-transparent text-text">
            <Menu size={20} />
          </button>
          {/* Mobile: logo */}
          <div className="md:hidden flex items-center gap-2">
            <Logo size={26} />
            <span className="font-display font-black text-[15px] text-text">
              Pharma<span className="text-green-mid">Connect</span>
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Alerts bell */}
          <button onClick={() => navigate('/alerts')}
            className="relative p-1.5 cursor-pointer bg-transparent border-0 text-muted hover:text-text transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 size-[7px] rounded-full bg-danger border-[1.5px] border-white" />
          </button>

          {/* User avatar + name */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-border">
            <div className="size-8 rounded-full bg-green-light flex items-center justify-center text-green-brand font-black text-sm shrink-0">
              {(user?.name || 'P')[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold text-text leading-none">{user?.name || 'Pharmacist'}</p>
              <p className="text-[11px] text-muted leading-none mt-0.5">{user?.org_name || 'Pharmacy'}</p>
            </div>
          </div>

          <button onClick={onSignOut}
            className="ml-1 px-3 py-1.5 rounded-xl border border-border bg-white text-muted text-[12px] font-semibold cursor-pointer hover:bg-background transition-colors">
            Sign out
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

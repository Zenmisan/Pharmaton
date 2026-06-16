import {
  AlertTriangle, TrendingDown, Package, CheckCircle2, Bell, Search,
} from 'lucide-react'

/* ─── ALERTS META ────────────────────────────────────────────── */
export const ALERT_META = {
  recall:       { Icon: AlertTriangle, cls: 'danger'  },
  shortage:     { Icon: TrendingDown,  cls: 'warning' },
  packaging:    { Icon: Package,       cls: 'info'    },
  safety:       { Icon: CheckCircle2,  cls: 'success' },
  supply:       { Icon: Bell,          cls: 'info'    },
  verification: { Icon: Search,        cls: 'warning' },
}

export function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso.replace(' ', 'T') + 'Z').getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

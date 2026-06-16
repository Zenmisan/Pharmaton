import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { Btn } from '@/components/ui'
import { ALERT_META, timeAgo } from '@/components/AlertMeta'

/* ─── ALERTS PAGE ────────────────────────────────────────────── */
export function AlertsPage() {
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

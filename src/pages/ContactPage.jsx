import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Mail, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Card, Btn } from '@/components/ui'

export function ContactPage() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', category: 'technical', message: '' })
  const [busy, setBusy] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    // Simulate send — replace with real email/form service (e.g. Formspree, Resend)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-border bg-white hover:bg-surface transition-colors cursor-pointer">
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-base">Contact & Support</span>
      </div>

      <div className="max-w-[600px] mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="size-14 rounded-2xl bg-blue-light flex items-center justify-center mx-auto mb-4 text-blue-brand">
            <MessageSquare size={28} />
          </div>
          <h1 className="text-[26px] font-black mb-2 tracking-tight">Get in Touch</h1>
          <p className="text-muted">Having trouble with the app or want to list your pharmacy? We respond within 24 hours.</p>
        </div>

        {sent ? (
          <Card className="text-center !p-10">
            <CheckCircle2 size={48} className="text-green-brand mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2 tracking-tight">Message Sent</h2>
            <p className="text-muted mb-6">We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
            <Btn onClick={() => navigate(-1)} variant="secondary">Go Back</Btn>
          </Card>
        ) : (
          <Card>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-muted block mb-1.5">YOUR NAME</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Amara Okonkwo" required
                    className="w-full border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted block mb-1.5">EMAIL ADDRESS</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required
                    className="w-full border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted block mb-1.5">TOPIC</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors bg-white">
                  <option value="technical">App or website not working</option>
                  <option value="pharmacy">List or update my pharmacy</option>
                  <option value="account">Account or login issue</option>
                  <option value="medicine">Medicine information query</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted block mb-1.5">MESSAGE</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Describe the issue or question..." required rows={5}
                  className="w-full border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors resize-none" />
              </div>

              <Btn type="submit" full size="lg" disabled={busy}>
                {busy ? 'Sending...' : 'Send Message'}
              </Btn>
            </form>
          </Card>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-muted text-sm">
          <Mail size={15} />
          <span>Or email us directly at <a href="mailto:support@pharmaconnect.ng" className="text-blue-brand font-semibold">support@pharmaconnect.ng</a></span>
        </div>
      </div>
    </div>
  )
}

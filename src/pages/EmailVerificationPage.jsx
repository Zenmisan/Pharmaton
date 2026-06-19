import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, RefreshCw, CheckCircle2, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth.jsx'
import { Logo } from '@/components/Logo'
import { Card, Btn } from '@/components/ui'

/* ─── EMAIL VERIFICATION ─────────────────────────────────────── */
export function EmailVerificationPage() {
  const { user, resendVerification, checkVerification, signOut } = useAuth()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)
  const [resent, setResent] = useState(false)
  const [err, setErr] = useState('')

  async function handleResend() {
    setErr('')
    try {
      await resendVerification()
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch (e) {
      setErr(e.message)
    }
  }

  async function handleCheck() {
    setChecking(true); setErr('')
    try {
      const verified = await checkVerification()
      if (verified) {
        navigate('/dashboard', { replace: true })
      } else {
        setErr('Email not verified yet. Check your inbox and click the link.')
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-surface">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-6"><Logo size={48}/></div>

        <Card className="text-center !p-8">
          <div className="size-16 rounded-full bg-blue-light flex items-center justify-center mx-auto mb-5">
            <Mail size={30} className="text-blue-brand"/>
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Check your email</h1>
          <p className="text-muted text-sm leading-relaxed mb-1">
            We sent a verification link to
          </p>
          <p className="font-bold text-sm mb-6">{user?.email || 'your email address'}</p>
          <p className="text-muted text-[13px] mb-7 leading-relaxed">
            Click the link in the email to verify your account, then come back here and tap "I've verified".
          </p>

          <div className="flex flex-col gap-3">
            <Btn full size="lg" onClick={handleCheck} disabled={checking}>
              {checking ? <><RefreshCw size={15} className="spin"/> Checking...</> : <><CheckCircle2 size={15}/> I've verified my email</>}
            </Btn>
            <Btn full variant="secondary" onClick={handleResend} disabled={resent}>
              {resent ? '✓ Email sent!' : 'Resend verification email'}
            </Btn>
          </div>

          {err && <p className="text-danger text-[13px] font-semibold mt-4">{err}</p>}
        </Card>

        <button onClick={signOut}
          className="flex items-center gap-1.5 text-muted text-[13px] font-semibold mx-auto mt-5 bg-transparent border-0 cursor-pointer hover:text-text transition-colors">
          <LogOut size={14}/> Sign out and use a different account
        </button>
      </div>
    </div>
  )
}

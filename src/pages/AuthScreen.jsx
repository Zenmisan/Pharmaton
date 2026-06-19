import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth.jsx'
import { Logo } from '@/components/Logo'
import { Card, Btn } from '@/components/ui'

/* Google "G" SVG icon */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

/* ─── AUTH SCREEN ─────────────────────────────────────────────── */
export function AuthScreen() {
  const { login, signup, signOut, googleLogin, completeGoogleSignup, devLogin } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get("role") === "pharmacist" ? "pharmacist" : "patient"

  const [mode, setMode]           = useState("signup")
  const [role, setRole]           = useState(initialRole)
  const [email, setEmail]         = useState("")
  const [password, setPassword]   = useState("")
  const [name, setName]           = useState("")
  const [orgName, setOrgName]     = useState("")
  const [location, setLocation]   = useState("")
  const [licenseNum, setLicenseNum] = useState("")
  const [err, setErr]             = useState("")
  const [busy, setBusy]           = useState(false)

  // Google new-user: show role selection inline
  const [googlePrefill, setGooglePrefill] = useState(null)
  const [googleRole, setGoogleRole]       = useState("patient")
  const [googleOrgName, setGoogleOrgName] = useState("")
  const [googleLocation, setGoogleLocation] = useState("")
  const [googleLicense, setGoogleLicense] = useState("")

  const roleLabels = { patient: "Patient", pharmacist: "Community Pharmacist" }

  async function submit(e) {
    e.preventDefault()
    setErr(""); setBusy(true)
    try {
      if (mode === "login") {
        await login(email, password)
        navigate('/dashboard')
      } else {
        await signup({ email, password, name, role, orgName, location, licenseNumber: licenseNum })
        // After signup → show email verification screen
        navigate('/verify-email')
      }
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setErr(""); setBusy(true)
    try {
      const result = await googleLogin()
      if (!result.needsProfile) {
        navigate('/dashboard')
      } else {
        setGooglePrefill(result.prefill)
        setGoogleRole("patient")
      }
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  async function submitGoogleProfile(e) {
    e.preventDefault()
    setErr(""); setBusy(true)
    try {
      await completeGoogleSignup({
        uid: googlePrefill.uid,
        email: googlePrefill.email,
        name: googlePrefill.name,
        role: googleRole,
        orgName: googleOrgName,
        location: googleLocation,
        licenseNumber: googleLicense,
      })
      navigate('/dashboard')
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDemoLogin(demoRole) {
    setBusy(true); setErr("")
    try {
      await devLogin(demoRole)
      navigate('/dashboard')
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  /* ── Google profile completion screen ── */
  if (googlePrefill) {
    return (
      <div className="max-w-[440px] mx-auto px-6 py-16 relative">
        <button onClick={() => { setGooglePrefill(null); signOut() }}
          className="absolute top-8 left-0 flex items-center gap-1.5 text-muted text-sm font-semibold bg-transparent border-0 cursor-pointer hover:text-text transition-colors">
          <ChevronLeft size={16}/> Back
        </button>
        <div className="flex justify-center mb-6 mt-4"><Logo size={44}/></div>
        <h1 className="text-2xl font-extrabold text-center mb-1">One last step</h1>
        <p className="text-muted text-sm text-center mb-7">
          Signed in as <strong>{googlePrefill.email}</strong>. Tell us your role to finish setup.
        </p>
        <Card>
          <form onSubmit={submitGoogleProfile} className="flex flex-col gap-3">
            <select value={googleRole} onChange={e => setGoogleRole(e.target.value)}
              className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors bg-white">
              <option value="patient">Patient</option>
              <option value="pharmacist">Community Pharmacist</option>
            </select>
            {googleRole === "pharmacist" && (
              <>
                <input value={googleOrgName} onChange={e => setGoogleOrgName(e.target.value)}
                  placeholder="Pharmacy name (e.g. Grace Pharmacy)"
                  className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
                <input value={googleLocation} onChange={e => setGoogleLocation(e.target.value)}
                  placeholder="Location (e.g. Surulere, Lagos)"
                  className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
                <input value={googleLicense} onChange={e => setGoogleLicense(e.target.value)}
                  placeholder="PCN license number (optional)"
                  className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
              </>
            )}
            {err && <p className="text-danger text-[13px] font-semibold">{err}</p>}
            <Btn type="submit" full size="lg" className="mt-1">{busy ? "Setting up..." : "Get Started"}</Btn>
          </form>
        </Card>
      </div>
    )
  }

  /* ── Main auth screen ── */
  return (
    <div className="max-w-[440px] mx-auto px-6 py-16 relative">
      <div className="absolute top-8 left-0">
        <Btn variant="ghost" size="sm" onClick={() => navigate('/choose')} className="gap-1.5">
          <ChevronLeft size={16}/> Back
        </Btn>
      </div>

      <div className="flex justify-center mb-6 mt-4"><Logo size={44}/></div>
      <h1 className="text-2xl font-extrabold text-center mb-1">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-muted text-sm text-center mb-7">
        {mode === "login" ? "Sign in to PharmaConnect AI" : "Join as a " + roleLabels[role]}
      </p>

      {/* Google Sign-In */}
      <button onClick={handleGoogle} disabled={busy}
        className="w-full flex items-center justify-center gap-3 border-[1.5px] border-border rounded-xl px-4 py-3 mb-4 bg-white font-semibold text-sm text-text cursor-pointer hover:bg-surface transition-colors disabled:opacity-50">
        <GoogleIcon/>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border"/>
        <span className="text-muted text-xs font-semibold">OR</span>
        <div className="flex-1 h-px bg-border"/>
      </div>

      {/* Email / Password form */}
      <Card className="mb-4">
        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <select value={role} onChange={e => setRole(e.target.value)}
              className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors bg-white">
              <option value="patient">Patient</option>
              <option value="pharmacist">Community Pharmacist</option>
            </select>
          )}
          {mode === "signup" && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required
              className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required
            className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6}
            className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
          {mode === "signup" && role === "pharmacist" && (
            <>
              <input value={orgName} onChange={e => setOrgName(e.target.value)}
                placeholder="Pharmacy name (e.g. Grace Pharmacy)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="Location (e.g. Surulere, Lagos)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
              <input value={licenseNum} onChange={e => setLicenseNum(e.target.value)}
                placeholder="PCN license number (optional)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
            </>
          )}
          {err && <p className="text-danger text-[13px] font-semibold">{err}</p>}
          <Btn type="submit" full size="lg" className="mt-1">
            {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Btn>
        </form>
      </Card>

      <p className="text-center text-muted text-[13px] mb-6">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-blue-brand font-bold bg-transparent border-0 cursor-pointer p-0">
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>

      {/* Demo login — dev only */}
      {import.meta.env.DEV && (
        <div className="border-t border-border pt-5">
          <p className="text-center text-muted text-xs font-semibold mb-3 flex items-center justify-center gap-1.5">
            <Sparkles size={12}/> DEMO — instant access, no signup needed
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="secondary" size="sm" disabled={busy} onClick={() => handleDemoLogin('patient')}>
              Demo: Patient
            </Btn>
            <Btn variant="secondary" size="sm" disabled={busy} onClick={() => handleDemoLogin('pharmacist')}>
              Demo: Pharmacist
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}

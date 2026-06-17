import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth.jsx'
import { Logo } from '@/components/Logo'
import { Card, Btn } from '@/components/ui'

/* ─── AUTH SCREEN (LOGIN / SIGNUP) ───────────────────────────── */
export function AuthScreen() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get("role") || "patient"
  
  const [mode, setMode] = useState("signup")
  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [location, setLocation] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [err, setErr] = useState("")
  const [busy, setBusy] = useState(false)

  const roleLabels = { patient: "Patient", pharmacist: "Community Pharmacist", hospital: "Hospital Pharmacist", supplier: "Supplier / Distributor" }

  async function submit(e) {
    e.preventDefault()
    setErr(""); setBusy(true)
    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await signup({ email, password, name, role, orgName, location, licenseNumber })
      }
      // Redirection handled by AuthProvider/App state mostly, but we can push to dashboard
      navigate('/dashboard')
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-[440px] mx-auto px-6 py-16 relative">
      <div className="absolute top-8 left-0">
        <Btn variant="ghost" size="sm" onClick={() => navigate('/choose')} className="gap-1.5">
          <ChevronLeft size={16} /> Back
        </Btn>
      </div>

      <div className="flex justify-center mb-6 mt-4"><Logo size={44}/></div>
      <h1 className="text-2xl font-extrabold text-center mb-1">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="text-muted text-sm text-center mb-7">{mode === "login" ? "Sign in to PharmaConnect AI" : "Join PharmaConnect AI as a " + roleLabels[role]}</p>

      <Card>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <select value={role} onChange={e => setRole(e.target.value)}
              className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors bg-white">
              {Object.entries(roleLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
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
          {mode === "signup" && role !== "patient" && (
            <>
              <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Organization name (e.g. Grace Pharmacy)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (e.g. Surulere, Lagos)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
              <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="License / CAC number (optional)"
                className="border-[1.5px] border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
            </>
          )}
          {err && <p className="text-danger text-[13px] font-semibold">{err}</p>}
          <Btn type="submit" full size="lg" className="mt-1">{busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}</Btn>
        </form>
      </Card>

      <p className="text-center text-muted text-[13px] mt-5">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-blue-brand font-bold bg-transparent border-0 cursor-pointer p-0">
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  )
}

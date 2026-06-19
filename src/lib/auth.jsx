import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { auth } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendEmailVerification,
  onIdTokenChanged,
  reload,
} from 'firebase/auth'
import { api, setToken, getToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null)
  const [loading, setLoading]             = useState(true)
  const [emailVerified, setEmailVerified] = useState(false)
  // Payload for Google new users waiting on role selection
  const [pendingGoogle, setPendingGoogle] = useState(null)
  const signingUp = useRef(false)

  useEffect(() => {
    // Dev mode: restore demo token without Firebase
    if (import.meta.env.DEV) {
      const stored = getToken()
      if (stored?.startsWith('demo-')) {
        api.me()
          .then(({ user: dbUser }) => { setUser(dbUser); setEmailVerified(true) })
          .catch(() => setToken(null))
          .finally(() => setLoading(false))
        return
      }
    }

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (signingUp.current) { setLoading(false); return }
        const token = await firebaseUser.getIdToken()
        setToken(token)
        setEmailVerified(firebaseUser.emailVerified)
        try {
          const { user: dbUser } = await api.me()
          setUser(dbUser)
        } catch {
          setUser(null)
        }
      } else {
        setToken(null)
        setUser(null)
        setEmailVerified(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  /* ── Email / Password login ───────────────────────────── */
  async function login(email, password) {
    const { user: fu } = await signInWithEmailAndPassword(auth, email, password)
    const token = await fu.getIdToken()
    setToken(token)
    setEmailVerified(fu.emailVerified)
    const { user: dbUser } = await api.me()
    setUser(dbUser)
    return dbUser
  }

  /* ── Email / Password signup ──────────────────────────── */
  async function signup(payload) {
    const { email, password, ...rest } = payload
    signingUp.current = true
    try {
      const { user: fu } = await createUserWithEmailAndPassword(auth, email, password)
      // Send verification email before anything else
      await sendEmailVerification(fu)
      const token = await fu.getIdToken()
      setToken(token)
      setEmailVerified(false) // just signed up — not yet verified
      const { user: dbUser } = await api.signup({
        uid: fu.uid,
        email: fu.email,
        ...rest,
      })
      setUser(dbUser)
      return dbUser
    } finally {
      signingUp.current = false
      setLoading(false)
    }
  }

  /* ── Google Sign-In ───────────────────────────────────── */
  async function googleLogin() {
    const provider = new GoogleAuthProvider()
    const { user: fu } = await signInWithPopup(auth, provider)
    const token = await fu.getIdToken()
    setToken(token)
    setEmailVerified(true) // Google accounts are always pre-verified

    try {
      // Existing user
      const { user: dbUser } = await api.me()
      setUser(dbUser)
      return { needsProfile: false }
    } catch {
      // First time Google user — need role selection
      setPendingGoogle({ uid: fu.uid, email: fu.email, name: fu.displayName || '' })
      return {
        needsProfile: true,
        prefill: { uid: fu.uid, email: fu.email, name: fu.displayName || '' },
      }
    }
  }

  /* ── Complete Google signup (after role selection) ────── */
  async function completeGoogleSignup(payload) {
    const { user: dbUser } = await api.signup(payload)
    setUser(dbUser)
    setPendingGoogle(null)
    return dbUser
  }

  /* ── Email verification helpers ───────────────────────── */
  async function resendVerification() {
    const fu = auth.currentUser
    if (fu) await sendEmailVerification(fu)
  }

  async function checkVerification() {
    const fu = auth.currentUser
    if (!fu) return false
    await reload(fu)
    const verified = fu.emailVerified
    setEmailVerified(verified)
    if (verified) {
      const token = await fu.getIdToken(true)
      setToken(token)
    }
    return verified
  }

  /* ── Dev-only demo login ──────────────────────────────── */
  async function devLogin(role) {
    if (!import.meta.env.DEV) throw new Error('devLogin only in dev mode')
    const tokenMap = { patient: 'demo-patient', pharmacist: 'demo-pharmacist' }
    const token = tokenMap[role]
    if (!token) throw new Error('Unknown demo role')
    setToken(token)
    const { user: dbUser } = await api.me()
    setUser(dbUser)
    setEmailVerified(true) // demo accounts skip verification
    return dbUser
  }

  /* ── Sign out ─────────────────────────────────────────── */
  async function signOut() {
    const stored = getToken()
    if (!stored?.startsWith('demo-')) {
      await firebaseSignOut(auth).catch(() => {})
    }
    setToken(null)
    setUser(null)
    setEmailVerified(false)
    setPendingGoogle(null)
  }

  return (
    <AuthContext.Provider value={{
      user, loading, emailVerified, pendingGoogle,
      login, signup, signOut,
      googleLogin, completeGoogleSignup,
      resendVerification, checkVerification,
      devLogin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

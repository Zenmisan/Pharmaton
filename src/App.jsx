import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '@/lib/auth.jsx'
import { Nav } from '@/components/Nav'
import { PharmacistLayout } from '@/components/PharmacistLayout'
import { Landing } from '@/pages/Landing'
import { ChooseRole } from '@/pages/ChooseRole'
import { AuthScreen } from '@/pages/AuthScreen'
import { AlertsPage } from '@/pages/AlertsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { EmailVerificationPage } from '@/pages/EmailVerificationPage'
import { PatientHome } from '@/pages/PatientHome'
import { SearchPage } from '@/pages/SearchPage'
import { MapPage } from '@/pages/MapPage'
import { PharmacyDetail } from '@/pages/PharmacyDetail'
import { PharmacistDashboard } from '@/pages/PharmacistDashboard'
import { InventoryPage } from '@/pages/InventoryPage'
import { InsightsPage } from '@/pages/InsightsPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { PricingPage } from '@/pages/PricingPage'

/* ─── PROTECTED ROUTE ────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { user, loading, emailVerified } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading...</div>
  if (!user) return <Navigate to="/" replace />
  if (!emailVerified) return <Navigate to="/verify-email" replace />
  return children
}

/* ─── APP (ROOT) ─────────────────────────────────────────────── */
function App() {
  const { user, loading, signOut: authSignOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const pageContentRef = useRef(null)

  useEffect(() => {
    if (!pageContentRef.current) return
    const tween = gsap.fromTo(pageContentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,transform' }
    )
    return () => tween.kill()
  }, [pathname])

  function signOut() {
    authSignOut()
    navigate('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading...</div>

  const userType = user?.role
  const isPharmacist = !loading && user && userType === 'pharmacist'

  const routes = (
    <Routes>
      {/* Public */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/choose" element={user ? <Navigate to="/dashboard" replace /> : <ChooseRole />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthScreen />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />

      {/* Role dashboards */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {userType === "patient" && <PatientHome setPage={p => navigate(`/${p}`)} />}
          {userType === "pharmacist" && <PharmacistDashboard setPage={p => navigate(`/${p}`)} />}
        </ProtectedRoute>
      } />

      {/* Patient routes */}
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
      <Route path="/pharmacy/:id" element={<ProtectedRoute><PharmacyDetail /></ProtectedRoute>} />

      {/* Pharmacist routes */}
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><InsightsPage userType={userType} /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><InsightsPage userType={userType} /></ProtectedRoute>} />

      {/* Shared */}
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage userType={userType} onSwitchRole={signOut} onSignOut={signOut} /></ProtectedRoute>} />

      {/* Public info pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

  if (isPharmacist) {
    return (
      <PharmacistLayout onSignOut={signOut}>
        <div ref={pageContentRef}>{routes}</div>
      </PharmacistLayout>
    )
  }

  return (
    <div>
      {user && <Nav userType={userType} onSignOut={signOut} />}
      <div ref={pageContentRef}>{routes}</div>
    </div>
  )
}

export default App

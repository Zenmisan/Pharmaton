import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '@/lib/auth.jsx'
import { Nav } from '@/components/Nav'
import { Landing } from '@/pages/Landing'
import { ChooseRole } from '@/pages/ChooseRole'
import { AuthScreen } from '@/pages/AuthScreen'
import { AlertsPage } from '@/pages/AlertsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PatientHome } from '@/pages/PatientHome'
import { SearchPage } from '@/pages/SearchPage'
import { MapPage } from '@/pages/MapPage'
import { PharmacistDashboard } from '@/pages/PharmacistDashboard'
import { InventoryPage } from '@/pages/InventoryPage'
import { SourcingPage } from '@/pages/SourcingPage'
import { InsightsPage } from '@/pages/InsightsPage'
import { HospitalDashboard } from '@/pages/HospitalDashboard'
import { EmergencyPage } from '@/pages/EmergencyPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { SupplierDashboard } from '@/pages/SupplierDashboard'
import { StockPage } from '@/pages/StockPage'

/* ─── PROTECTED ROUTE ────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading...</div>
  if (!user) return <Navigate to="/" replace />
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

  return (
    <div>
      {user && <Nav userType={userType} onSignOut={signOut} />}
      <div ref={pageContentRef}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/choose" element={user ? <Navigate to="/dashboard" replace /> : <ChooseRole />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthScreen />} />

          {/* Role-Based Dashboards */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {userType === "patient" && <PatientHome setPage={p => navigate(`/${p}`)} />}
              {userType === "pharmacist" && <PharmacistDashboard setPage={p => navigate(`/${p}`)} />}
              {userType === "hospital" && <HospitalDashboard setPage={p => navigate(`/${p}`)} />}
              {userType === "supplier" && <SupplierDashboard setPage={p => navigate(`/${p}`)} />}
            </ProtectedRoute>
          } />

          {/* Shared Protected Routes */}
          <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage userType={userType} onSwitchRole={signOut} onSignOut={signOut} /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><InsightsPage userType={userType} /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><InsightsPage userType={userType} /></ProtectedRoute>} />

          {/* Patient Routes */}
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />

          {/* Pharmacist Routes */}
          <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
          <Route path="/sourcing" element={<ProtectedRoute><SourcingPage /></ProtectedRoute>} />

          {/* Hospital Routes */}
          <Route path="/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

          {/* Supplier Routes */}
          <Route path="/stock" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><SupplierDashboard setPage={p => navigate(`/${p}`)} /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

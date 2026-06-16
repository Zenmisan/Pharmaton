import { useEffect, useRef, useState } from 'react'
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

/* ─── APP (ROOT) ─────────────────────────────────────────────── */
function App() {
  const { user, loading, signOut: authSignOut } = useAuth()
  const [page, setPage] = useState("landing")
  const [pendingRole, setPendingRole] = useState(null)
  const pageContentRef = useRef(null)

  useEffect(() => {
    if (!pageContentRef.current) return
    const tween = gsap.fromTo(pageContentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,transform' }
    )
    return () => tween.kill()
  }, [page, user])

  function chooseRole(role) {
    if (role === null) {
      setPage("choose")
    } else {
      setPendingRole(role)
      setPage("auth")
    }
  }

  function signOut() {
    authSignOut()
    setPage("landing")
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading...</div>

  if (!user) {
    if (page === "auth") return (
      <div ref={pageContentRef}>
        <AuthScreen initialRole={pendingRole} onDone={() => setPage(pendingRole === "patient" ? "home" : "dashboard")} />
      </div>
    )
    if (page === "choose") return (
      <div ref={pageContentRef}>
        <ChooseRole onSelect={r => { setPendingRole(r); setPage("auth") }} />
      </div>
    )
    return (
      <div ref={pageContentRef}>
        <Landing onChoose={chooseRole} />
      </div>
    )
  }

  const userType = user.role

  function renderPage() {
    if (page === "alerts")  return <AlertsPage />
    if (page === "profile") return <ProfilePage userType={userType} onSwitchRole={signOut} onSignOut={signOut} />

    switch (userType) {
      case "patient":
        if (page === "home")   return <PatientHome setPage={setPage} />
        if (page === "search") return <SearchPage />
        if (page === "map")    return <MapPage />
        return <PatientHome setPage={setPage} />

      case "pharmacist":
        if (page === "dashboard") return <PharmacistDashboard setPage={setPage} />
        if (page === "inventory") return <InventoryPage />
        if (page === "sourcing")  return <SourcingPage />
        if (page === "insights")  return <InsightsPage userType={userType} />
        return <PharmacistDashboard setPage={setPage} />

      case "hospital":
        if (page === "dashboard") return <HospitalDashboard setPage={setPage} />
        if (page === "emergency") return <EmergencyPage />
        if (page === "orders")    return <OrdersPage />
        if (page === "insights")  return <InsightsPage userType={userType} />
        return <HospitalDashboard setPage={setPage} />

      case "supplier":
        if (page === "dashboard") return <SupplierDashboard setPage={setPage} />
        if (page === "stock")     return <StockPage />
        if (page === "requests")  return <SupplierDashboard setPage={setPage} />
        if (page === "analytics") return <InsightsPage userType={userType} />
        return <SupplierDashboard setPage={setPage} />

      default:
        return <PatientHome setPage={setPage} />
    }
  }

  return (
    <div>
      <Nav page={page} setPage={setPage} userType={userType} onSignOut={signOut} />
      <div ref={pageContentRef}>
        {renderPage()}
      </div>
    </div>
  )
}

export default App

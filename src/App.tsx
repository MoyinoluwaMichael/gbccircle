import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

import { LoginPage } from '@/pages/auth/LoginPage'

import { BackofficeLayout } from '@/components/layouts/BackofficeLayout'
import { DashboardPage } from '@/pages/backoffice/DashboardPage'
import { ProductsPage } from '@/pages/backoffice/ProductsPage'
import { CategoriesPage } from '@/pages/backoffice/CategoriesPage'
import { InventoryPage } from '@/pages/backoffice/InventoryPage'
import { SalesPage } from '@/pages/backoffice/SalesPage'
import { StaffPage } from '@/pages/backoffice/StaffPage'
import { ChargingPage } from '@/pages/backoffice/ChargingPage'
import { ReportsPage } from '@/pages/backoffice/ReportsPage'
import { SettingsPage } from '@/pages/backoffice/SettingsPage'

import { StaffLayout } from '@/components/layouts/StaffLayout'
import { POSPage } from '@/pages/staff/POSPage'
import { StaffChargingPage } from '@/pages/staff/StaffChargingPage'
import { MySalesPage } from '@/pages/staff/MySalesPage'
import { ProfilePage } from '@/pages/staff/ProfilePage'

function RequireAuth({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'OWNER' | 'STAFF' }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'OWNER' ? '/backoffice/dashboard' : '/staff/pos'} replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'OWNER' ? '/backoffice/dashboard' : '/staff/pos'} replace /> : <LoginPage />} />

      {/* Backoffice */}
      <Route path="/backoffice" element={<RequireAuth requiredRole="OWNER"><BackofficeLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="charging" element={<ChargingPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Staff */}
      <Route path="/staff" element={<RequireAuth requiredRole="STAFF"><StaffLayout /></RequireAuth>}>
        <Route index element={<Navigate to="pos" replace />} />
        <Route path="pos" element={<POSPage />} />
        <Route path="charging" element={<StaffChargingPage />} />
        <Route path="sales" element={<MySalesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Default */}
      <Route path="/" element={user ? <Navigate to={user.role === 'OWNER' ? '/backoffice/dashboard' : '/staff/pos'} replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

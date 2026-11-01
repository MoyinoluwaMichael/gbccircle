import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package, Layers, BarChart3,
  Users, Zap, Settings, Menu, X, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/backoffice/dashboard' },
  { label: 'Sales', icon: ShoppingBag, to: '/backoffice/sales' },
  { label: 'Products', icon: Package, to: '/backoffice/products' },
  { label: 'Categories', icon: Layers, to: '/backoffice/categories' },
  { label: 'Inventory', icon: BarChart3, to: '/backoffice/inventory' },
  { label: 'Charging Requests', icon: Zap, to: '/backoffice/charging' },
  { label: 'Staff', icon: Users, to: '/backoffice/staff' },
  { label: 'Reports', icon: BarChart3, to: '/backoffice/reports' },
  { label: 'Settings', icon: Settings, to: '/backoffice/settings' },
]

function NavItem({ label, icon: Icon, to, onClick }: { label: string; icon: typeof LayoutDashboard; to: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  )
}

export function BackofficeLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <p className="font-bold text-ink-900 text-sm leading-tight">GBCcircle</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Backoffice</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{user ? getInitials(user.name) : 'OW'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-900 truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Owner</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={handleLogout} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-56 flex-col bg-white border-r border-slate-200 shrink-0">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="relative z-50 flex flex-col w-64 bg-white h-full shadow-xl">
              <div className="absolute top-3 right-3">
                <Button variant="ghost" size="icon-sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
            <Button variant="ghost" size="icon-sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <span className="font-bold text-sm text-ink-900">GBCcircle</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

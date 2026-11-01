import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ShoppingCart, Zap, ClipboardList, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'New Sale', icon: ShoppingCart, to: '/staff/pos' },
  { label: 'Requests', icon: Zap, to: '/staff/charging' },
  { label: 'My Sales', icon: ClipboardList, to: '/staff/sales' },
  { label: 'Profile', icon: User, to: '/staff/profile' },
]

export function StaffLayout() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoBanner />

      {/* Top bar */}
      <header className="bg-ink-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-sm">GBCcircle</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-white/90">{user?.name}</p>
          <p className="text-[10px] text-white/60">Staff</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-30">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-teal-600' : 'text-slate-500'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

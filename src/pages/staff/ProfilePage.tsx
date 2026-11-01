import { useNavigate } from 'react-router-dom'
import { LogOut, User, Phone, Mail, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { MOCK_STAFF, MOCK_SALES } from '@/data/mock'
import { getInitials, formatCurrency } from '@/lib/utils'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const staffProfile = MOCK_STAFF.find((s) => s.id === user?.staffId)
  const mySales = MOCK_SALES.filter((s) => s.staffId === user?.staffId && s.status !== 'CANCELLED')

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex flex-col items-center py-6 gap-3">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-2xl">{user ? getInitials(user.name) : 'S'}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="text-xl font-bold text-ink-900">{user?.name}</p>
          <p className="text-sm text-muted-foreground">Staff · {staffProfile?.staffCode}</p>
        </div>
      </div>

      {staffProfile && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Profile Details</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-muted-foreground" /><span>{staffProfile.phone}</span></div>
              {staffProfile.email && <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-muted-foreground" /><span>{staffProfile.email}</span></div>}
              <div className="flex items-center gap-2.5"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono">{staffProfile.staffCode}</span></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Sales', value: mySales.length },
          { label: 'Total', value: formatCurrency(mySales.reduce((s, sale) => s + sale.total, 0)) },
          { label: 'Collected', value: formatCurrency(mySales.reduce((s, sale) => s + sale.amountPaid, 0)) },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-base font-bold text-ink-900">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <Separator />

      <Button variant="outline" className="w-full gap-2 text-red-500 hover:text-red-600 hover:border-red-300" onClick={handleLogout}>
        <LogOut className="h-4 w-4" /> Sign Out
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-2">GBCcircle · 08139009923</p>
    </div>
  )
}

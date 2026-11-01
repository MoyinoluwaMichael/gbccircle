import { useState } from 'react'
import { Plus, Search, Users, Edit, ToggleRight, ToggleLeft, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_STAFF, MOCK_SALES } from '@/data/mock'
import { getInitials, formatCurrency } from '@/lib/utils'
import type { Staff } from '@/types'

function staffStats(staffId: string) {
  const sales = MOCK_SALES.filter((s) => s.staffId === staffId && s.status !== 'CANCELLED' && s.status !== 'REFUNDED')
  return {
    count: sales.length,
    total: sales.reduce((s, sale) => s + sale.total, 0),
    collected: sales.reduce((s, sale) => s + sale.amountPaid, 0),
  }
}

export function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editStaff, setEditStaff] = useState<Staff | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  const filtered = staff.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.staffCode.toLowerCase().includes(search.toLowerCase()))

  function openCreate() {
    setEditStaff(null)
    setForm({ name: '', phone: '', email: '' })
    setDialogOpen(true)
  }

  function openEdit(s: Staff) {
    setEditStaff(s)
    setForm({ name: s.name, phone: s.phone, email: s.email ?? '' })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.name || !form.phone) return
    if (editStaff) {
      setStaff((prev) => prev.map((s) => s.id === editStaff.id ? { ...s, name: form.name, phone: form.phone, email: form.email || undefined, updatedAt: new Date().toISOString() } : s))
    } else {
      const newStaff: Staff = {
        id: `stf_${Date.now()}`, name: form.name, phone: form.phone, email: form.email || undefined, staffCode: `GBC-${String(staff.length + 1).padStart(3, '0')}`, role: 'STAFF', active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'Adebayo Okorie',
      }
      setStaff((prev) => [...prev, newStaff])
    }
    setDialogOpen(false)
  }

  function toggleActive(id: string) {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active, updatedAt: new Date().toISOString() } : s))
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Staff</h1>
          <p className="text-sm text-muted-foreground">{staff.filter((s) => s.active).length} active staff members</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search name or code…" className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No staff found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s) => {
            const stats = staffStats(s.id)
            return (
              <Card key={s.id} className={`hover:shadow-md transition-shadow ${!s.active ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(s.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-sm text-ink-900">{s.name}</p>
                        {!s.active && <Badge variant="muted" className="text-[10px]">Inactive</Badge>}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{s.staffCode}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{s.phone}</div>
                    {s.email && <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{s.email}</div>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-2.5 mb-3 text-center">
                    <div><p className="text-sm font-bold text-ink-900">{stats.count}</p><p className="text-[10px] text-muted-foreground">Sales</p></div>
                    <div><p className="text-sm font-bold text-ink-900">{formatCurrency(stats.total)}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
                    <div><p className="text-sm font-bold text-teal-700">{formatCurrency(stats.collected)}</p><p className="text-[10px] text-muted-foreground">Collected</p></div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => openEdit(s)}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
                          {s.active ? <ToggleRight className="h-4 w-4 text-teal-600" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{s.active ? 'Deactivate' : 'Reactivate'} {s.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {s.active ? 'This staff member will lose access to the system.' : 'This staff member will regain system access.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => toggleActive(s.id)}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
            <DialogDescription>
              {editStaff ? 'Update staff details.' : 'Create a new staff account. A login invite would be sent in production.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1"><Label>Full Name *</Label><Input placeholder="e.g. Amara Obi" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Phone *</Label><Input placeholder="08012345678" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" placeholder="Optional" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.phone}>{editStaff ? 'Save' : 'Create Staff'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

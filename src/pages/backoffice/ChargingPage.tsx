import { useState } from 'react'
import { Plus, Zap, Search, ChevronRight, Smartphone, Monitor, Tablet, HelpCircle, Edit2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ChargingStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_CHARGING_JOBS, MOCK_STAFF } from '@/data/mock'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { ChargingJob, ChargingJobStatus, DeviceType } from '@/types'

const deviceIcons: Record<DeviceType, typeof Smartphone> = {
  PHONE: Smartphone, TABLET: Tablet, LAPTOP: Monitor, OTHER: HelpCircle,
}
const statusOrder: ChargingJobStatus[] = ['RECEIVED', 'CHARGING', 'COMPLETED', 'COLLECTED', 'CANCELLED']
const statusLabels: Record<ChargingJobStatus, string> = {
  RECEIVED: 'Received', CHARGING: 'Charging', COMPLETED: 'Completed', COLLECTED: 'Collected', CANCELLED: 'Cancelled',
}

type EditForm = {
  deviceType: DeviceType
  deviceBrand: string
  deviceModel: string
  customerName: string
  customerPhone: string
  chargingFee: string
  notes: string
}

function toEditForm(job: ChargingJob): EditForm {
  return {
    deviceType: job.deviceType,
    deviceBrand: job.deviceBrand ?? '',
    deviceModel: job.deviceModel ?? '',
    customerName: job.customerName ?? '',
    customerPhone: job.customerPhone ?? '',
    chargingFee: String(job.chargingFee),
    notes: job.notes ?? '',
  }
}

export function ChargingPage() {
  const [requests, setRequests] = useState<ChargingJob[]>(MOCK_CHARGING_JOBS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [staffFilter, setStaffFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ChargingJob | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({ deviceType: 'PHONE', deviceBrand: '', deviceModel: '', customerName: '', customerPhone: '', chargingFee: '', notes: '' })
  const [createForm, setCreateForm] = useState<EditForm>({ deviceType: 'PHONE', deviceBrand: '', deviceModel: '', customerName: '', customerPhone: '', chargingFee: '', notes: '' })

  const filtered = requests
    .filter((j) => {
      const matchSearch = !search || j.jobRef.toLowerCase().includes(search.toLowerCase()) || (j.customerName?.toLowerCase().includes(search.toLowerCase()) ?? false)
      const matchStatus = statusFilter === 'all' || j.status === statusFilter
      const matchStaff = staffFilter === 'all' || j.createdById === staffFilter
      return matchSearch && matchStatus && matchStaff
    })
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())

  function openDetail(job: ChargingJob) {
    setSelectedRequest(job)
    setIsEditing(false)
  }

  function startEdit(job: ChargingJob) {
    setEditForm(toEditForm(job))
    setIsEditing(true)
  }

  function saveEdit() {
    if (!selectedRequest || !editForm.chargingFee) return
    const updated: ChargingJob = {
      ...selectedRequest,
      deviceType: editForm.deviceType,
      deviceBrand: editForm.deviceBrand || undefined,
      deviceModel: editForm.deviceModel || undefined,
      customerName: editForm.customerName || undefined,
      customerPhone: editForm.customerPhone || undefined,
      chargingFee: Number(editForm.chargingFee),
      notes: editForm.notes || undefined,
      updatedAt: new Date().toISOString(),
    }
    setRequests((prev) => prev.map((j) => j.id === updated.id ? updated : j))
    setSelectedRequest(updated)
    setIsEditing(false)
  }

  function handleCreate() {
    if (!createForm.chargingFee) return
    const newReq: ChargingJob = {
      id: `job_${Date.now()}`,
      jobRef: `CHG-${String(requests.length + 1).padStart(3, '0')}`,
      deviceType: createForm.deviceType,
      deviceBrand: createForm.deviceBrand || undefined,
      deviceModel: createForm.deviceModel || undefined,
      customerName: createForm.customerName || undefined,
      customerPhone: createForm.customerPhone || undefined,
      chargingFee: Number(createForm.chargingFee),
      notes: createForm.notes || undefined,
      status: 'RECEIVED',
      paymentStatus: 'UNPAID',
      createdBy: 'Adebayo Okorie',
      createdById: 'usr_owner',
      receivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRequests((prev) => [newReq, ...prev])
    setCreateOpen(false)
    setCreateForm({ deviceType: 'PHONE', deviceBrand: '', deviceModel: '', customerName: '', customerPhone: '', chargingFee: '', notes: '' })
  }

  function advanceStatus(job: ChargingJob) {
    const idx = statusOrder.indexOf(job.status)
    if (idx < 0 || job.status === 'COLLECTED' || job.status === 'CANCELLED') return
    const next = statusOrder[idx + 1]
    if (!next || next === 'CANCELLED') return
    const updated = { ...job, status: next, collectedAt: next === 'COLLECTED' ? new Date().toISOString() : job.collectedAt, updatedAt: new Date().toISOString() }
    setRequests((prev) => prev.map((j) => j.id === job.id ? updated : j))
    setSelectedRequest(updated)
  }

  const canEditRequest = (job: ChargingJob) => job.status !== 'COLLECTED' && job.status !== 'CANCELLED'

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Device Charging</h1>
          <p className="text-sm text-muted-foreground">
            {requests.filter((j) => j.status === 'CHARGING' || j.status === 'RECEIVED').length} active requests
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Request ref or customer…" className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={staffFilter} onValueChange={setStaffFilter}>
          <SelectTrigger className="w-[150px] h-9">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="All Staff" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Staff</SelectItem>
            {MOCK_STAFF.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOrder.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={Zap} title="No charging requests found" description="Try adjusting your filters or create a new request." />
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => {
            const Icon = deviceIcons[req.deviceType]
            return (
              <Card key={req.id} className="hover:shadow-sm cursor-pointer" onClick={() => openDetail(req)}>
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-ink-800">{req.jobRef}</span>
                      <ChargingStatusBadge status={req.status} />
                      <PaymentStatusBadge status={req.paymentStatus} />
                    </div>
                    <p className="text-sm text-ink-700 truncate">
                      {req.deviceBrand ? `${req.deviceBrand}${req.deviceModel ? ` ${req.deviceModel}` : ''}` : req.deviceType.charAt(0) + req.deviceType.slice(1).toLowerCase()}
                    </p>
                    {req.customerName && <p className="text-xs text-muted-foreground">{req.customerName}</p>}
                    <div className="flex items-center gap-1 mt-0.5">
                      <User className="h-3 w-3 text-teal-600 shrink-0" />
                      <span className="text-xs font-medium text-ink-700">{req.createdBy}</span>
                      <span className="text-xs text-muted-foreground">· {formatDateTime(req.receivedAt)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatCurrency(req.chargingFee)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── Detail / Edit dialog ── */}
      <Dialog open={!!selectedRequest} onOpenChange={(o) => { if (!o) { setSelectedRequest(null); setIsEditing(false) } }}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          {selectedRequest && (() => {
            const Icon = deviceIcons[selectedRequest.deviceType]
            const idx = statusOrder.indexOf(selectedRequest.status)
            const canAdvance = selectedRequest.status !== 'COLLECTED' && selectedRequest.status !== 'CANCELLED' && idx < statusOrder.length - 2
            const nextStatus = canAdvance ? statusOrder[idx + 1] : null

            return isEditing ? (
              /* ── Edit mode ── */
              <>
                <DialogHeader>
                  <DialogTitle>Edit Request · {selectedRequest.jobRef}</DialogTitle>
                  <DialogDescription>Update the details for this charging request.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-1">
                  <div className="space-y-1">
                    <Label>Device Type</Label>
                    <Select value={editForm.deviceType} onValueChange={(v) => setEditForm((f) => ({ ...f, deviceType: v as DeviceType }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHONE">Phone</SelectItem>
                        <SelectItem value="TABLET">Tablet</SelectItem>
                        <SelectItem value="LAPTOP">Laptop</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Charging Fee (₦)</Label>
                    <Input
                      type="number" min="0"
                      value={editForm.chargingFee}
                      disabled={selectedRequest.paymentStatus === 'PAID'}
                      onChange={(e) => setEditForm((f) => ({ ...f, chargingFee: e.target.value }))}
                    />
                    {selectedRequest.paymentStatus === 'PAID' && (
                      <p className="text-[10px] text-muted-foreground">Fee is locked — payment already recorded.</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Brand</Label>
                    <Input placeholder="e.g. Samsung" value={editForm.deviceBrand} onChange={(e) => setEditForm((f) => ({ ...f, deviceBrand: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Model</Label>
                    <Input placeholder="e.g. Galaxy A14" value={editForm.deviceModel} onChange={(e) => setEditForm((f) => ({ ...f, deviceModel: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Customer Name</Label>
                    <Input value={editForm.customerName} onChange={(e) => setEditForm((f) => ({ ...f, customerName: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Customer Phone</Label>
                    <Input value={editForm.customerPhone} onChange={(e) => setEditForm((f) => ({ ...f, customerPhone: e.target.value }))} />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label>Notes</Label>
                    <Textarea rows={2} value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={saveEdit} disabled={!editForm.chargingFee}>Save Changes</Button>
                </DialogFooter>
              </>
            ) : (
              /* ── View mode ── */
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-teal-600" />
                        {selectedRequest.jobRef}
                      </DialogTitle>
                      <DialogDescription>{formatDateTime(selectedRequest.receivedAt)}</DialogDescription>
                    </div>
                    {canEditRequest(selectedRequest) && (
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 shrink-0" onClick={() => startEdit(selectedRequest)}>
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    )}
                  </div>
                </DialogHeader>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-2 flex-wrap">
                    <ChargingStatusBadge status={selectedRequest.status} />
                    <PaymentStatusBadge status={selectedRequest.paymentStatus} />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Device</p>
                      <p className="font-medium">
                        {selectedRequest.deviceBrand
                          ? `${selectedRequest.deviceBrand}${selectedRequest.deviceModel ? ` ${selectedRequest.deviceModel}` : ''}`
                          : selectedRequest.deviceType.charAt(0) + selectedRequest.deviceType.slice(1).toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Charging Fee</p>
                      <p className="font-bold text-teal-700">{formatCurrency(selectedRequest.chargingFee)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Recorded by</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <User className="h-3.5 w-3.5 text-teal-600" />
                        <p className="font-medium">{selectedRequest.createdBy}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Received at</p>
                      <p className="font-medium text-xs">{formatDateTime(selectedRequest.receivedAt)}</p>
                    </div>
                    {selectedRequest.customerName && (
                      <div>
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="font-medium">{selectedRequest.customerName}</p>
                      </div>
                    )}
                    {selectedRequest.customerPhone && (
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedRequest.customerPhone}</p>
                      </div>
                    )}
                    {selectedRequest.collectedAt && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Collected at</p>
                        <p className="font-medium">{formatDateTime(selectedRequest.collectedAt)}</p>
                      </div>
                    )}
                  </div>

                  {selectedRequest.notes && (
                    <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm text-ink-700">
                      <span className="text-xs text-muted-foreground block mb-0.5">Notes</span>
                      {selectedRequest.notes}
                    </div>
                  )}

                  {selectedRequest.cancelReason && (
                    <div className="bg-red-50 rounded-lg px-3 py-2 text-sm text-red-700">
                      <span className="text-xs text-muted-foreground block mb-0.5">Cancel reason</span>
                      {selectedRequest.cancelReason}
                    </div>
                  )}
                </div>

                {nextStatus && (
                  <Button className="w-full mt-2" onClick={() => advanceStatus(selectedRequest)}>
                    Mark as {statusLabels[nextStatus]}
                  </Button>
                )}
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* ── Create dialog ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Charging Request</DialogTitle>
            <DialogDescription>Record a device received for charging.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="space-y-1">
              <Label>Device Type *</Label>
              <Select value={createForm.deviceType} onValueChange={(v) => setCreateForm((f) => ({ ...f, deviceType: v as DeviceType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHONE">Phone</SelectItem>
                  <SelectItem value="TABLET">Tablet</SelectItem>
                  <SelectItem value="LAPTOP">Laptop</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Charging Fee (₦) *</Label>
              <Input type="number" min="0" placeholder="500" value={createForm.chargingFee} onChange={(e) => setCreateForm((f) => ({ ...f, chargingFee: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Brand</Label>
              <Input placeholder="e.g. Samsung" value={createForm.deviceBrand} onChange={(e) => setCreateForm((f) => ({ ...f, deviceBrand: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Model</Label>
              <Input placeholder="e.g. Galaxy A14" value={createForm.deviceModel} onChange={(e) => setCreateForm((f) => ({ ...f, deviceModel: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Customer Name</Label>
              <Input placeholder="Optional" value={createForm.customerName} onChange={(e) => setCreateForm((f) => ({ ...f, customerName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Customer Phone</Label>
              <Input placeholder="Optional" value={createForm.customerPhone} onChange={(e) => setCreateForm((f) => ({ ...f, customerPhone: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Notes</Label>
              <Textarea placeholder="Any special instructions…" rows={2} value={createForm.notes} onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!createForm.chargingFee}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

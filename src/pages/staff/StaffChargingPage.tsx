import { useState } from 'react'
import { Plus, Zap, Smartphone, Monitor, Tablet, HelpCircle, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ChargingStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { MOCK_CHARGING_JOBS } from '@/data/mock'
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
  customerName: string
  customerPhone: string
  chargingFee: string
  notes: string
}

export function StaffChargingPage() {
  const { user } = useAuth()
  const staffId = user?.staffId ?? ''
  const [requests, setRequests] = useState<ChargingJob[]>(
    MOCK_CHARGING_JOBS.filter((j) => j.createdById === staffId || j.assignedToId === staffId)
  )
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ChargingJob | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const emptyForm: EditForm = { deviceType: 'PHONE', deviceBrand: '', customerName: '', customerPhone: '', chargingFee: '500', notes: '' }
  const [createForm, setCreateForm] = useState<EditForm>(emptyForm)
  const [editForm, setEditForm] = useState<EditForm>(emptyForm)

  function openDetail(req: ChargingJob) {
    setSelectedRequest(req)
    setIsEditing(false)
  }

  function startEdit(req: ChargingJob) {
    setEditForm({ deviceType: req.deviceType, deviceBrand: req.deviceBrand ?? '', customerName: req.customerName ?? '', customerPhone: req.customerPhone ?? '', chargingFee: String(req.chargingFee), notes: req.notes ?? '' })
    setIsEditing(true)
  }

  function saveEdit() {
    if (!selectedRequest || !editForm.chargingFee) return
    const updated: ChargingJob = {
      ...selectedRequest,
      deviceType: editForm.deviceType,
      deviceBrand: editForm.deviceBrand || undefined,
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
      jobRef: `CHG-${String(Math.floor(Math.random() * 900) + 100)}`,
      deviceType: createForm.deviceType,
      deviceBrand: createForm.deviceBrand || undefined,
      customerName: createForm.customerName || undefined,
      customerPhone: createForm.customerPhone || undefined,
      chargingFee: Number(createForm.chargingFee),
      notes: createForm.notes || undefined,
      status: 'RECEIVED',
      paymentStatus: 'UNPAID',
      createdBy: user?.name ?? 'Staff',
      createdById: staffId,
      receivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRequests((prev) => [newReq, ...prev])
    setCreateOpen(false)
    setCreateForm(emptyForm)
  }

  function advanceStatus(req: ChargingJob) {
    const idx = statusOrder.indexOf(req.status)
    if (idx < 0 || req.status === 'COLLECTED' || req.status === 'CANCELLED') return
    const next = statusOrder[idx + 1]
    if (!next || next === 'CANCELLED') return
    const updated = { ...req, status: next, collectedAt: next === 'COLLECTED' ? new Date().toISOString() : req.collectedAt, updatedAt: new Date().toISOString() }
    setRequests((prev) => prev.map((j) => j.id === req.id ? updated : j))
    setSelectedRequest(updated)
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Charging Requests</h2>
          <p className="text-xs text-muted-foreground">Your active requests</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Zap className="h-10 w-10 text-slate-200 mb-2" />
          <p className="text-sm text-muted-foreground">No charging requests yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => {
            const Icon = deviceIcons[req.deviceType]
            return (
              <Card key={req.id} className="cursor-pointer hover:shadow-sm" onClick={() => openDetail(req)}>
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-1.5 flex-wrap mb-0.5">
                      <span className="text-xs font-mono font-semibold text-ink-800">{req.jobRef}</span>
                      <ChargingStatusBadge status={req.status} />
                    </div>
                    {req.deviceBrand && <p className="text-sm text-ink-700">{req.deviceBrand}</p>}
                    {req.customerName && <p className="text-xs text-muted-foreground">{req.customerName}</p>}
                    <p className="text-xs text-muted-foreground">{formatDateTime(req.receivedAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatCurrency(req.chargingFee)}</p>
                    <PaymentStatusBadge status={req.paymentStatus} />
                  </div>
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
            const canEdit = selectedRequest.status !== 'COLLECTED' && selectedRequest.status !== 'CANCELLED'

            return isEditing ? (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Request · {selectedRequest.jobRef}</DialogTitle>
                  <DialogDescription>Update the request details.</DialogDescription>
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
                    <Label>Fee (₦)</Label>
                    <Input
                      type="number" min="0"
                      value={editForm.chargingFee}
                      disabled={selectedRequest.paymentStatus === 'PAID'}
                      onChange={(e) => setEditForm((f) => ({ ...f, chargingFee: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Brand</Label>
                    <Input value={editForm.deviceBrand} onChange={(e) => setEditForm((f) => ({ ...f, deviceBrand: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Customer Name</Label>
                    <Input value={editForm.customerName} onChange={(e) => setEditForm((f) => ({ ...f, customerName: e.target.value }))} />
                  </div>
                  <div className="col-span-2 space-y-1">
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
                  <Button onClick={saveEdit} disabled={!editForm.chargingFee}>Save</Button>
                </DialogFooter>
              </>
            ) : (
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
                    {canEdit && (
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
                          ? `${selectedRequest.deviceBrand}`
                          : selectedRequest.deviceType.charAt(0) + selectedRequest.deviceType.slice(1).toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fee</p>
                      <p className="font-bold text-teal-700">{formatCurrency(selectedRequest.chargingFee)}</p>
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
                  </div>
                  {selectedRequest.notes && (
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                      <p>{selectedRequest.notes}</p>
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
              <Label>Fee (₦) *</Label>
              <Input type="number" min="0" value={createForm.chargingFee} onChange={(e) => setCreateForm((f) => ({ ...f, chargingFee: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Brand</Label>
              <Input placeholder="e.g. Samsung" value={createForm.deviceBrand} onChange={(e) => setCreateForm((f) => ({ ...f, deviceBrand: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Customer Name</Label>
              <Input placeholder="Optional" value={createForm.customerName} onChange={(e) => setCreateForm((f) => ({ ...f, customerName: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Customer Phone</Label>
              <Input placeholder="Optional" value={createForm.customerPhone} onChange={(e) => setCreateForm((f) => ({ ...f, customerPhone: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Notes</Label>
              <Textarea placeholder="Optional" rows={2} value={createForm.notes} onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))} />
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

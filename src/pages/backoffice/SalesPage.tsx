import { useState } from 'react'
import { Search, Filter, Eye, User, Plus, XCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SaleStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_SALES, MOCK_STAFF } from '@/data/mock'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Sale, Payment, PaymentMethod, PaymentStatus } from '@/types'

const paymentMethodLabel: Record<string, string> = {
  CASH: 'Cash', BANK_TRANSFER: 'Bank Transfer', POS_CARD: 'POS/Card', OTHER: 'Other',
}
const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'POS_CARD', label: 'POS / Card' },
  { value: 'OTHER', label: 'Other' },
]

function derivePaymentStatus(total: number, amountPaid: number): PaymentStatus {
  if (amountPaid <= 0) return 'UNPAID'
  if (amountPaid >= total) return 'PAID'
  return 'PARTIALLY_PAID'
}

type ActiveAction = 'payment' | 'cancel' | 'refund' | null

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES)
  const [search, setSearch] = useState('')
  const [staffFilter, setStaffFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Detail dialog
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [activeAction, setActiveAction] = useState<ActiveAction>(null)

  // Record payment form
  const [payForm, setPayForm] = useState({ amount: '', method: 'CASH' as PaymentMethod, reference: '' })

  // Cancel form
  const [cancelReason, setCancelReason] = useState('')

  // Refund form
  const [refundForm, setRefundForm] = useState({ amount: '', reason: '', method: 'CASH' as PaymentMethod })

  // ── Derived list ──────────────────────────────────────────────────────────
  const filtered = sales.filter((s) => {
    const matchSearch = !search
      || s.receiptRef.toLowerCase().includes(search.toLowerCase())
      || s.staffName.toLowerCase().includes(search.toLowerCase())
    const matchStaff = staffFilter === 'all' || s.staffId === staffFilter
    const matchPayment = paymentFilter === 'all' || s.paymentStatus === paymentFilter
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStaff && matchPayment && matchStatus
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalShown = filtered.reduce((sum, s) => sum + s.total, 0)
  const totalPaid = filtered.reduce((sum, s) => sum + s.amountPaid, 0)

  // ── Helpers ───────────────────────────────────────────────────────────────
  function updateSale(updated: Sale) {
    setSales((prev) => prev.map((s) => s.id === updated.id ? updated : s))
    setSelectedSale(updated)
  }

  function openDetail(sale: Sale) {
    setSelectedSale(sale)
    setActiveAction(null)
    setPayForm({ amount: '', method: 'CASH', reference: '' })
    setCancelReason('')
    setRefundForm({ amount: '', reason: '', method: 'CASH' })
  }

  function closeDetail() {
    setSelectedSale(null)
    setActiveAction(null)
  }

  // ── Record payment ────────────────────────────────────────────────────────
  function handleRecordPayment() {
    if (!selectedSale || !payForm.amount) return
    const amount = Math.min(Number(payForm.amount), selectedSale.balanceDue)
    if (amount <= 0) return

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      saleId: selectedSale.id,
      amount,
      method: payForm.method,
      status: 'CONFIRMED',
      reference: payForm.reference || undefined,
      recordedBy: 'Adebayo Okorie',
      recordedById: 'usr_owner',
      createdAt: new Date().toISOString(),
    }
    const newAmountPaid = selectedSale.amountPaid + amount
    const newBalance = Math.max(0, selectedSale.total - newAmountPaid)

    const updated: Sale = {
      ...selectedSale,
      payments: [...selectedSale.payments, newPayment],
      amountPaid: newAmountPaid,
      balanceDue: newBalance,
      paymentStatus: derivePaymentStatus(selectedSale.total, newAmountPaid),
      updatedAt: new Date().toISOString(),
    }
    updateSale(updated)
    setActiveAction(null)
    setPayForm({ amount: '', method: 'CASH', reference: '' })
  }

  // ── Cancel sale ───────────────────────────────────────────────────────────
  function handleCancelSale() {
    if (!selectedSale || !cancelReason.trim()) return
    const updated: Sale = {
      ...selectedSale,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString(),
    }
    updateSale(updated)
    setActiveAction(null)
    setCancelReason('')
  }

  // ── Process refund ────────────────────────────────────────────────────────
  function handleRefund() {
    if (!selectedSale || !refundForm.amount || !refundForm.reason) return
    const amount = Number(refundForm.amount)
    if (amount <= 0 || amount > selectedSale.amountPaid) return

    const isFullRefund = amount >= selectedSale.amountPaid
    const updated: Sale = {
      ...selectedSale,
      status: isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
      updatedAt: new Date().toISOString(),
    }
    updateSale(updated)
    setActiveAction(null)
    setRefundForm({ amount: '', reason: '', method: 'CASH' })
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-ink-900">Sales</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} transactions · {formatCurrency(totalShown)} total · {formatCurrency(totalPaid)} collected
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Receipt ref or staff…" className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PARTIALLY_PAID">Part. Paid</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={Filter} title="No sales found" description="Try adjusting your filters." />
      ) : (
        <div className="space-y-2">
          {filtered.map((sale) => (
            <Card key={sale.id} className="hover:shadow-sm transition-shadow cursor-pointer" onClick={() => openDetail(sale)}>
              <CardContent className="p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-ink-800">{sale.receiptRef}</span>
                      <SaleStatusBadge status={sale.status} />
                      <PaymentStatusBadge status={sale.paymentStatus} />
                      <Badge variant="muted" className="capitalize text-[10px]">{sale.saleType.toLowerCase()}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <User className="h-3 w-3 text-teal-600 shrink-0" />
                      <span className="text-xs font-medium text-ink-700">{sale.staffName}</span>
                      <span className="text-xs text-muted-foreground">· {formatDateTime(sale.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{sale.items.length} item{sale.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-ink-900">{formatCurrency(sale.total)}</p>
                    {sale.balanceDue > 0 && (
                      <p className="text-[11px] text-amber-600 font-medium">Balance: {formatCurrency(sale.balanceDue)}</p>
                    )}
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Sale detail dialog ── */}
      <Dialog open={!!selectedSale} onOpenChange={(o) => !o && closeDetail()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedSale && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono text-sm">{selectedSale.receiptRef}</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-0.5 mt-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="h-3.5 w-3.5 text-teal-600" />
                      <span className="font-medium text-ink-700">{selectedSale.staffName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDateTime(selectedSale.createdAt)}</p>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status row */}
                <div className="flex gap-2 flex-wrap">
                  <SaleStatusBadge status={selectedSale.status} />
                  <PaymentStatusBadge status={selectedSale.paymentStatus} />
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Items</p>
                  <div className="space-y-1.5">
                    {selectedSale.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-ink-700">{item.productName} × {item.quantity}</span>
                        <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span>{formatCurrency(selectedSale.subtotal)}</span>
                  </div>
                  {selectedSale.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>-{formatCurrency(selectedSale.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base text-ink-900">
                    <span>Total</span><span>{formatCurrency(selectedSale.total)}</span>
                  </div>
                  <div className="flex justify-between text-teal-700">
                    <span>Amount Paid</span><span>{formatCurrency(selectedSale.amountPaid)}</span>
                  </div>
                  {selectedSale.balanceDue > 0 && (
                    <div className="flex justify-between text-amber-600 font-semibold">
                      <span>Balance Due</span><span>{formatCurrency(selectedSale.balanceDue)}</span>
                    </div>
                  )}
                </div>

                {/* Payment history */}
                {selectedSale.payments.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Payment History</p>
                    <div className="space-y-1.5">
                      {selectedSale.payments.map((pay) => (
                        <div key={pay.id} className="flex justify-between text-sm">
                          <div>
                            <span className="text-ink-700">{paymentMethodLabel[pay.method]}</span>
                            {pay.reference && <span className="text-muted-foreground text-xs ml-1">({pay.reference})</span>}
                            <p className="text-[11px] text-muted-foreground">{formatDateTime(pay.createdAt)} · {pay.recordedBy}</p>
                          </div>
                          <span className="font-medium text-teal-700 shrink-0">{formatCurrency(pay.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* ── Actions ── */}
                {activeAction === null && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {/* Record payment — only if balance is outstanding and sale is not cancelled/refunded */}
                      {selectedSale.balanceDue > 0 && selectedSale.status === 'COMPLETED' && (
                        <Button
                          size="sm"
                          className="gap-1.5"
                          onClick={() => {
                            setPayForm({ amount: String(selectedSale.balanceDue), method: 'CASH', reference: '' })
                            setActiveAction('payment')
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" /> Record Payment
                        </Button>
                      )}
                      {/* Cancel — only if completed */}
                      {selectedSale.status === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-red-500 hover:text-red-600 hover:border-red-300"
                          onClick={() => setActiveAction('cancel')}
                        >
                          <XCircle className="h-3.5 w-3.5" /> Cancel Sale
                        </Button>
                      )}
                      {/* Refund — only if completed and something was paid */}
                      {selectedSale.status === 'COMPLETED' && selectedSale.amountPaid > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => {
                            setRefundForm({ amount: String(selectedSale.amountPaid), reason: '', method: 'CASH' })
                            setActiveAction('refund')
                          }}
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Process Refund
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Record Payment form ── */}
                {activeAction === 'payment' && (
                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-teal-800">Record Payment</p>
                      <p className="text-xs text-teal-600">Balance due: {formatCurrency(selectedSale.balanceDue)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Amount (₦) *</Label>
                        <Input
                          type="number"
                          min="1"
                          max={selectedSale.balanceDue}
                          value={payForm.amount}
                          onChange={(e) => setPayForm((f) => ({ ...f, amount: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Method *</Label>
                        <Select value={payForm.method} onValueChange={(v) => setPayForm((f) => ({ ...f, method: v as PaymentMethod }))}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Reference / Note</Label>
                        <Input
                          placeholder="Optional — e.g. transfer ref"
                          value={payForm.reference}
                          onChange={(e) => setPayForm((f) => ({ ...f, reference: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleRecordPayment} disabled={!payForm.amount}>
                        Confirm Payment
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setActiveAction(null)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {/* ── Cancel Sale form ── */}
                {activeAction === 'cancel' && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-red-700">Cancel Sale</p>
                    <p className="text-xs text-red-600">This action cannot be undone. The original sale record is preserved.</p>
                    <div className="space-y-1">
                      <Label className="text-xs">Reason *</Label>
                      <Textarea
                        placeholder="Why is this sale being cancelled?"
                        rows={2}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleCancelSale}
                        disabled={!cancelReason.trim()}
                      >
                        Confirm Cancellation
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setActiveAction(null)}>Back</Button>
                    </div>
                  </div>
                )}

                {/* ── Process Refund form ── */}
                {activeAction === 'refund' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink-800">Process Refund</p>
                      <p className="text-xs text-muted-foreground">Max: {formatCurrency(selectedSale.amountPaid)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Refund Amount (₦) *</Label>
                        <Input
                          type="number"
                          min="1"
                          max={selectedSale.amountPaid}
                          value={refundForm.amount}
                          onChange={(e) => setRefundForm((f) => ({ ...f, amount: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Refund Method *</Label>
                        <Select value={refundForm.method} onValueChange={(v) => setRefundForm((f) => ({ ...f, method: v as PaymentMethod }))}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Reason *</Label>
                        <Textarea
                          placeholder="Reason for refund…"
                          rows={2}
                          value={refundForm.reason}
                          onChange={(e) => setRefundForm((f) => ({ ...f, reason: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleRefund}
                        disabled={!refundForm.amount || !refundForm.reason}
                      >
                        Confirm Refund
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setActiveAction(null)}>Back</Button>
                    </div>
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => window.print()}>
                    Print Receipt
                  </Button>
                  <Button variant="outline" size="sm" onClick={closeDetail}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

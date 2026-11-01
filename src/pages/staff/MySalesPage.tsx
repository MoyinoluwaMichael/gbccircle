import { ClipboardList } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SaleStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { MOCK_SALES } from '@/data/mock'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export function MySalesPage() {
  const { user } = useAuth()
  const mySales = MOCK_SALES.filter((s) => s.staffId === user?.staffId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalSales = mySales.reduce((s, sale) => s + sale.total, 0)
  const totalCollected = mySales.reduce((s, sale) => s + sale.amountPaid, 0)

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-ink-900">My Sales</h2>
        <p className="text-xs text-muted-foreground">{mySales.length} transactions · {formatCurrency(totalSales)} total</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Transactions', value: mySales.length },
          { label: 'Total', value: formatCurrency(totalSales) },
          { label: 'Collected', value: formatCurrency(totalCollected) },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-base font-bold text-ink-900">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      {mySales.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <ClipboardList className="h-10 w-10 text-slate-200 mb-2" />
          <p className="text-sm text-muted-foreground">No sales yet. Complete a sale to see it here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {mySales.map((sale) => (
            <Card key={sale.id} className="hover:shadow-sm">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="text-xs font-mono font-semibold text-ink-800">{sale.receiptRef}</span>
                      <SaleStatusBadge status={sale.status} />
                      <PaymentStatusBadge status={sale.paymentStatus} />
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDateTime(sale.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">{sale.items.length} item{sale.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-ink-900">{formatCurrency(sale.total)}</p>
                    {sale.balanceDue > 0 && <p className="text-xs text-amber-600 font-medium">Bal: {formatCurrency(sale.balanceDue)}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

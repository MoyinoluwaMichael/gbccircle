import { Badge } from '@/components/ui/badge'
import type { SaleStatus, PaymentStatus, ChargingJobStatus, StockStatus } from '@/types'

export function SaleStatusBadge({ status }: { status: SaleStatus }) {
  const map: Record<SaleStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'muted' }> = {
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'muted' },
    REFUNDED: { label: 'Refunded', variant: 'destructive' },
    PARTIALLY_REFUNDED: { label: 'Part. Refunded', variant: 'warning' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
    PAID: { label: 'Paid', variant: 'success' },
    PARTIALLY_PAID: { label: 'Part. Paid', variant: 'warning' },
    UNPAID: { label: 'Unpaid', variant: 'destructive' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function ChargingStatusBadge({ status }: { status: ChargingJobStatus }) {
  const map: Record<ChargingJobStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'muted' }> = {
    RECEIVED: { label: 'Received', variant: 'muted' },
    CHARGING: { label: 'Charging', variant: 'warning' },
    COMPLETED: { label: 'Completed', variant: 'default' },
    COLLECTED: { label: 'Collected', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'destructive' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  const map: Record<StockStatus, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
    IN_STOCK: { label: 'In Stock', variant: 'success' },
    LOW_STOCK: { label: 'Low Stock', variant: 'warning' },
    OUT_OF_STOCK: { label: 'Out of Stock', variant: 'destructive' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

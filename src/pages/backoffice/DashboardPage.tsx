import { TrendingUp, ShoppingBag, CreditCard, AlertTriangle, Banknote, RefreshCw, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SaleStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { MOCK_DASHBOARD, MOCK_SALES_TREND, MOCK_TOP_PRODUCTS, MOCK_SALES, MOCK_PRODUCTS } from '@/data/mock'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { getStockStatus as getStock } from '@/types'
import { StockStatusBadge } from '@/components/shared/StatusBadge'

const lowStockProducts = MOCK_PRODUCTS.filter(
  (p) => p.active && (getStock(p) === 'LOW_STOCK' || getStock(p) === 'OUT_OF_STOCK')
).slice(0, 5)

const recentSales = [...MOCK_SALES].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

export function DashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview for today, 1 November 2026</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard title="Sales Today" value={formatCurrency(MOCK_DASHBOARD.totalSalesToday)} subtitle={`${MOCK_DASHBOARD.transactionCountToday} transactions`} icon={ShoppingBag} trend={{ value: '12% vs yesterday', positive: true }} />
        <StatCard title="Sales (7 days)" value={formatCurrency(MOCK_DASHBOARD.totalSales7Days)} icon={TrendingUp} />
        <StatCard title="This Month" value={formatCurrency(MOCK_DASHBOARD.totalSalesMonth)} subtitle={`${MOCK_DASHBOARD.transactionCountMonth} transactions`} icon={Banknote} />
        <StatCard title="Outstanding" value={formatCurrency(MOCK_DASHBOARD.outstandingBalances)} subtitle="Unpaid balances" icon={CreditCard} iconColor="text-amber-600" trend={{ value: '16 open sales', positive: false }} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard title="Collected (Month)" value={formatCurrency(MOCK_DASHBOARD.paymentsCollectedMonth)} icon={Banknote} iconColor="text-blue-600" />
        <StatCard title="Product Revenue" value={formatCurrency(MOCK_DASHBOARD.productRevenueMonth)} icon={ShoppingBag} />
        <StatCard title="Charging Revenue" value={formatCurrency(MOCK_DASHBOARD.chargingRevenueMonth)} icon={Zap} iconColor="text-amber-600" />
        <StatCard title="Refunds (Month)" value={formatCurrency(MOCK_DASHBOARD.refundsMonth)} icon={RefreshCw} iconColor="text-red-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Sales Trend (Last 8 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MOCK_SALES_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Sales']} labelStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Products (Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_TOP_PRODUCTS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.unitsSold} units</p>
                  </div>
                  <span className="text-xs font-semibold text-teal-700">{formatCurrency(p.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low stock + Recent sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Low / Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">All products are well-stocked.</p>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-800 truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold">{p.stockQuantity}</span>
                      <StockStatusBadge status={getStock(p)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2.5">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-medium text-ink-800">{sale.receiptRef}</p>
                    <p className="text-[11px] text-muted-foreground">{sale.staffName} · {formatDateTime(sale.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <PaymentStatusBadge status={sale.paymentStatus} />
                    <span className="text-sm font-semibold">{formatCurrency(sale.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

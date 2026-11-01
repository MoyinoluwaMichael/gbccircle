import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MOCK_SALES, MOCK_STAFF, MOCK_TOP_PRODUCTS, MOCK_DASHBOARD } from '@/data/mock'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#0d9488', '#14b8a6', '#5eead4', '#0f766e', '#99f6e4']

function staffReport() {
  return MOCK_STAFF.filter((s) => s.active).map((s) => {
    const sales = MOCK_SALES.filter((sale) => sale.staffId === s.id && sale.status !== 'CANCELLED')
    return {
      name: s.name.split(' ')[0],
      transactions: sales.length,
      total: sales.reduce((sum, sale) => sum + sale.total, 0),
      collected: sales.reduce((sum, sale) => sum + sale.amountPaid, 0),
    }
  })
}

const salesMixData = [
  { name: 'Products', value: MOCK_DASHBOARD.productRevenueMonth },
  { name: 'Charging', value: MOCK_DASHBOARD.chargingRevenueMonth },
]

export function ReportsPage() {
  const staff = staffReport()

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-ink-900">Reports</h1>
        <p className="text-sm text-muted-foreground">November 2026 · Sample data</p>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="charging">Charging</TabsTrigger>
        </TabsList>

        {/* Sales report */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Gross Sales', value: formatCurrency(MOCK_DASHBOARD.totalSalesMonth) },
              { label: 'Net Sales', value: formatCurrency(MOCK_DASHBOARD.totalSalesMonth - MOCK_DASHBOARD.refundsMonth) },
              { label: 'Collected', value: formatCurrency(MOCK_DASHBOARD.paymentsCollectedMonth) },
              { label: 'Outstanding', value: formatCurrency(MOCK_DASHBOARD.outstandingBalances) },
            ].map((m) => (
              <Card key={m.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase tracking-wide">{m.label}</p><p className="text-xl font-bold mt-1">{m.value}</p></CardContent></Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sales Mix (Month)</CardTitle></CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={salesMixData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {salesMixData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {salesMixData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-ink-800">{d.name}</span>
                    <span className="text-sm font-semibold ml-2">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Total Transactions', value: MOCK_DASHBOARD.transactionCountMonth },
              { label: 'Avg Sale Value', value: formatCurrency(MOCK_DASHBOARD.avgSaleValueMonth) },
              { label: 'Total Refunds', value: formatCurrency(MOCK_DASHBOARD.refundsMonth) },
            ].map((m) => (
              <Card key={m.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{m.label}</p><p className="text-xl font-bold mt-1">{m.value}</p></CardContent></Card>
            ))}
          </div>
        </TabsContent>

        {/* Staff report */}
        <TabsContent value="staff" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sales by Staff</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={staff} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} name="Total Sales" />
                  <Bar dataKey="collected" fill="#5eead4" radius={[4, 4, 0, 0]} name="Collected" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {staff.map((s) => (
              <Card key={s.name}><CardContent className="p-3.5 flex items-center justify-between gap-4">
                <p className="font-semibold text-ink-800">{s.name}</p>
                <div className="flex gap-6 text-sm text-right">
                  <div><p className="text-muted-foreground text-xs">Transactions</p><p className="font-bold">{s.transactions}</p></div>
                  <div><p className="text-muted-foreground text-xs">Total</p><p className="font-bold">{formatCurrency(s.total)}</p></div>
                  <div><p className="text-muted-foreground text-xs">Collected</p><p className="font-bold text-teal-700">{formatCurrency(s.collected)}</p></div>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        {/* Products report */}
        <TabsContent value="products" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Products by Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MOCK_TOP_PRODUCTS} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={140} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="revenue" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {MOCK_TOP_PRODUCTS.map((p, i) => (
              <Card key={p.name}><CardContent className="p-3.5 flex items-center gap-3">
                <span className="text-muted-foreground text-sm font-bold w-5">{i + 1}</span>
                <div className="flex-1"><p className="text-sm font-medium text-ink-800">{p.name}</p><p className="text-xs text-muted-foreground">{p.unitsSold} units sold</p></div>
                <span className="font-bold text-teal-700">{formatCurrency(p.revenue)}</span>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        {/* Charging report */}
        <TabsContent value="charging" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Charging Revenue', value: formatCurrency(MOCK_DASHBOARD.chargingRevenueMonth) },
              { label: 'Total Jobs', value: '47' },
              { label: 'Completed', value: '38' },
              { label: 'Active', value: '5' },
            ].map((m) => (
              <Card key={m.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{m.label}</p><p className="text-xl font-bold mt-1">{m.value}</p></CardContent></Card>
            ))}
          </div>
          <Card><CardContent className="p-4 text-sm text-muted-foreground text-center py-8">Detailed charging breakdown will be shown here. Connect to Convex for live data.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

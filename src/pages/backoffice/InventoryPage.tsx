import { useState } from 'react'
import { Search, ArrowUpDown, Package, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StockStatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_PRODUCTS, MOCK_MOVEMENTS } from '@/data/mock'
import { formatDateTime } from '@/lib/utils'
import type { Product, InventoryMovement } from '@/types'
import { getStockStatus } from '@/types'

const movementTypeLabel: Record<string, string> = {
  OPENING_STOCK: 'Opening Stock',
  MANUAL_INCREASE: 'Manual Increase',
  MANUAL_DECREASE: 'Manual Decrease',
  SALE_DEDUCTION: 'Sale Deduction',
  RETURN_RESTOCK: 'Return / Restock',
}

export function InventoryPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS.filter((p) => p.active))
  const [movements, setMovements] = useState<InventoryMovement[]>(MOCK_MOVEMENTS)
  const [search, setSearch] = useState('')
  const [adjustDialog, setAdjustDialog] = useState<Product | null>(null)
  const [adjustForm, setAdjustForm] = useState({ type: 'MANUAL_INCREASE', quantity: '', reason: '' })

  const filteredProducts = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))

  function handleAdjust() {
    if (!adjustDialog || !adjustForm.quantity || !adjustForm.reason) return
    const delta = adjustForm.type === 'MANUAL_DECREASE' ? -Number(adjustForm.quantity) : Number(adjustForm.quantity)
    const before = adjustDialog.stockQuantity
    const after = Math.max(0, before + delta)
    const newMovement: InventoryMovement = {
      id: `inv_${Date.now()}`, productId: adjustDialog.id, productName: adjustDialog.name, productSku: adjustDialog.sku, movementType: adjustForm.type as any, quantityDelta: delta, beforeQuantity: before, afterQuantity: after, reason: adjustForm.reason, actor: 'Adebayo Okorie', actorId: 'usr_owner', createdAt: new Date().toISOString(),
    }
    setMovements((prev) => [newMovement, ...prev])
    setProducts((prev) => prev.map((p) => p.id === adjustDialog.id ? { ...p, stockQuantity: after, updatedAt: new Date().toISOString() } : p))
    setAdjustDialog(null)
    setAdjustForm({ type: 'MANUAL_INCREASE', quantity: '', reason: '' })
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-ink-900">Inventory</h1>
        <p className="text-sm text-muted-foreground">Stock levels and movement history</p>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock Overview</TabsTrigger>
          <TabsTrigger value="history">Movement History</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4 mt-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search product…" className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="space-y-2">
            {filteredProducts.map((p) => {
              const stock = getStockStatus(p)
              return (
                <Card key={p.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-ink-800">{p.name}</span>
                        <StockStatusBadge status={stock} />
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{p.sku} · {p.categoryName}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-ink-900">{p.stockQuantity}</p>
                        <p className="text-[10px] text-muted-foreground">Threshold: {p.lowStockThreshold}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setAdjustDialog(p); setAdjustForm({ type: 'MANUAL_INCREASE', quantity: '', reason: '' }) }}>
                        <ArrowUpDown className="h-3.5 w-3.5 mr-1" /> Adjust
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="space-y-2">
            {movements.length === 0 ? (
              <EmptyState icon={Package} title="No movements yet" />
            ) : (
              movements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((m) => (
                <Card key={m.id}>
                  <CardContent className="p-3.5 flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.quantityDelta > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {m.quantityDelta > 0 ? <Plus className="h-4 w-4 text-green-600" /> : <Minus className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-800">{m.productName}</p>
                      <p className="text-xs text-muted-foreground">{movementTypeLabel[m.movementType]}{m.reason ? ` · ${m.reason}` : ''}</p>
                      <p className="text-xs text-muted-foreground">{m.actor} · {formatDateTime(m.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${m.quantityDelta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {m.quantityDelta > 0 ? '+' : ''}{m.quantityDelta}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.beforeQuantity} → {m.afterQuantity}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Adjust dialog */}
      <Dialog open={!!adjustDialog} onOpenChange={(o) => !o && setAdjustDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>{adjustDialog?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1">
              <Label>Adjustment Type *</Label>
              <Select value={adjustForm.type} onValueChange={(v) => setAdjustForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL_INCREASE">Manual Increase</SelectItem>
                  <SelectItem value="MANUAL_DECREASE">Manual Decrease</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Quantity *</Label>
              <Input type="number" min="1" placeholder="0" value={adjustForm.quantity} onChange={(e) => setAdjustForm((f) => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Reason *</Label>
              <Textarea placeholder="e.g. New stock delivery, damaged items disposal…" rows={2} value={adjustForm.reason} onChange={(e) => setAdjustForm((f) => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialog(null)}>Cancel</Button>
            <Button onClick={handleAdjust} disabled={!adjustForm.quantity || !adjustForm.reason}>Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

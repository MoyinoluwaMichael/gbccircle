import { useState } from 'react'
import { Plus, Search, Package, Edit, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { StockStatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/data/mock'
import { formatCurrency, generateSKU } from '@/lib/utils'
import type { Product } from '@/types'
import { getStockStatus as getStock } from '@/types'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const [form, setForm] = useState({ name: '', sku: '', categoryId: '', description: '', sellingPrice: '', costPrice: '', stockQuantity: '', lowStockThreshold: '10' })

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.categoryId === categoryFilter
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.active : !p.active)
    return matchSearch && matchCat && matchStatus
  })

  function openCreate() {
    setEditProduct(null)
    setForm({ name: '', sku: '', categoryId: '', description: '', sellingPrice: '', costPrice: '', stockQuantity: '', lowStockThreshold: '10' })
    setDialogOpen(true)
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setForm({ name: p.name, sku: p.sku, categoryId: p.categoryId, description: p.description ?? '', sellingPrice: String(p.sellingPrice), costPrice: String(p.costPrice ?? ''), stockQuantity: String(p.stockQuantity), lowStockThreshold: String(p.lowStockThreshold) })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.name || !form.categoryId || !form.sellingPrice) return
    const cat = MOCK_CATEGORIES.find((c) => c.id === form.categoryId)
    if (editProduct) {
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, name: form.name, sku: form.sku || p.sku, categoryId: form.categoryId, categoryName: cat?.name ?? p.categoryName, description: form.description, sellingPrice: Number(form.sellingPrice), costPrice: form.costPrice ? Number(form.costPrice) : undefined, lowStockThreshold: Number(form.lowStockThreshold), updatedAt: new Date().toISOString() } : p))
    } else {
      const newProduct: Product = {
        id: `prd_${Date.now()}`, name: form.name, sku: form.sku || generateSKU(form.name), categoryId: form.categoryId, categoryName: cat?.name ?? '', description: form.description, sellingPrice: Number(form.sellingPrice), costPrice: form.costPrice ? Number(form.costPrice) : undefined, stockQuantity: Number(form.stockQuantity) || 0, lowStockThreshold: Number(form.lowStockThreshold), active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      }
      setProducts((prev) => [newProduct, ...prev])
    }
    setDialogOpen(false)
  }

  function toggleActive(id: string) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active, updatedAt: new Date().toISOString() } : p))
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Products</h1>
          <p className="text-sm text-muted-foreground">{products.filter((p) => p.active).length} active products</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name or SKU…" className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MOCK_CATEGORIES.filter((c) => c.active).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((p) => {
            const stock = getStock(p)
            return (
              <Card key={p.id} className={`hover:shadow-md transition-shadow ${!p.active ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="flex gap-1">
                      {!p.active && <Badge variant="muted">Inactive</Badge>}
                      <StockStatusBadge status={stock} />
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-ink-900 leading-tight mb-0.5 line-clamp-2">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground mb-2 font-mono">{p.sku}</p>
                  <p className="text-xs text-muted-foreground mb-3">{p.categoryName}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-ink-900">{formatCurrency(p.sellingPrice)}</p>
                      <p className="text-[11px] text-muted-foreground">Qty: {p.stockQuantity}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => openEdit(p)}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
                          {p.active ? <ToggleRight className="h-4 w-4 text-teal-600" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{p.active ? 'Deactivate' : 'Reactivate'} product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {p.active ? 'This product will no longer be available for sale.' : 'This product will become available for sale again.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => toggleActive(p.id)}>Confirm</AlertDialogAction>
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

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>Fill in the product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label>Product Name *</Label>
                <Input placeholder="e.g. Indomie Noodles" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>SKU / Code</Label>
                <Input placeholder="Auto-generated" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {MOCK_CATEGORIES.filter((c) => c.active).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Selling Price (₦) *</Label>
                <Input type="number" min="0" placeholder="0" value={form.sellingPrice} onChange={(e) => setForm((f) => ({ ...f, sellingPrice: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Cost Price (₦)</Label>
                <Input type="number" min="0" placeholder="Optional" value={form.costPrice} onChange={(e) => setForm((f) => ({ ...f, costPrice: e.target.value }))} />
              </div>
              {!editProduct && (
                <div className="space-y-1">
                  <Label>Opening Stock</Label>
                  <Input type="number" min="0" placeholder="0" value={form.stockQuantity} onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))} />
                </div>
              )}
              <div className="space-y-1">
                <Label>Low Stock Threshold</Label>
                <Input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Description</Label>
                <Textarea placeholder="Optional product description" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.categoryId || !form.sellingPrice}>
              {editProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

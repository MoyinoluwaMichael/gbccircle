import { useState, useRef, useEffect } from 'react'
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle2, Printer, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { StockStatusBadge } from '@/components/shared/StatusBadge'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/data/mock'
import { formatCurrency, generateRef } from '@/lib/utils'
import type { CartItem, Product, PaymentMethod } from '@/types'
import { getStockStatus } from '@/types'

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'POS_CARD', label: 'POS / Card' },
  { value: 'OTHER', label: 'Other' },
]

export function POSPage() {
  const [products] = useState(MOCK_PRODUCTS.filter((p) => p.active))
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [amountTendered, setAmountTendered] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ ref: string; total: number; paid: number } | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => { searchRef.current?.focus() }, [])

  const filteredProducts = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.categoryId === categoryFilter
    return matchSearch && matchCat
  })

  const subtotal = cart.reduce((s, item) => s + item.lineTotal, 0)
  const tendered = Number(amountTendered) || 0
  const change = tendered > subtotal ? tendered - subtotal : 0
  const balance = tendered < subtotal ? subtotal - tendered : 0

  function addToCart(product: Product) {
    const stock = getStockStatus(product)
    if (stock === 'OUT_OF_STOCK') return
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prev
        return prev.map((c) => c.product.id === product.id ? { ...c, quantity: c.quantity + 1, lineTotal: (c.quantity + 1) * c.unitPrice } : c)
      }
      return [...prev, { product, quantity: 1, unitPrice: product.sellingPrice, lineTotal: product.sellingPrice }]
    })
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) { removeFromCart(productId); return }
    const product = products.find((p) => p.id === productId)
    if (product && qty > product.stockQuantity) return
    setCart((prev) => prev.map((c) => c.product.id === productId ? { ...c, quantity: qty, lineTotal: qty * c.unitPrice } : c))
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((c) => c.product.id !== productId))
  }

  async function handleCheckout() {
    if (cart.length === 0 || loading) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const ref = generateRef()
    setSuccess({ ref, total: subtotal, paid: tendered })
    setLoading(false)
  }

  function handleNewSale() {
    setCart([])
    setAmountTendered('')
    setPaymentMethod('CASH')
    setSearch('')
    setSuccess(null)
    searchRef.current?.focus()
  }

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)]">
      {/* Product panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search + filter */}
        <div className="p-3 bg-white border-b border-slate-200 space-y-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input ref={searchRef} placeholder="Search products…" className="pl-9 h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            <button onClick={() => setCategoryFilter('all')} className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${categoryFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</button>
            {MOCK_CATEGORIES.filter((c) => c.active).map((c) => (
              <button key={c.id} onClick={() => setCategoryFilter(c.id)} className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${categoryFilter === c.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {filteredProducts.map((p) => {
              const stock = getStockStatus(p)
              const inCart = cart.find((c) => c.product.id === p.id)
              const isOutOfStock = stock === 'OUT_OF_STOCK'
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={isOutOfStock}
                  className={`text-left rounded-xl border p-3 transition-all hover:shadow-md active:scale-[0.98] ${inCart ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white'} ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <p className="text-xs font-semibold text-ink-800 leading-tight line-clamp-2">{p.name}</p>
                    {inCart && <Badge variant="default" className="shrink-0 text-[10px] h-4 px-1.5">{inCart.quantity}</Badge>}
                  </div>
                  <p className="text-base font-bold text-teal-700">{formatCurrency(p.sellingPrice)}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">Qty: {p.stockQuantity}</span>
                    {stock !== 'IN_STOCK' && <StockStatusBadge status={stock} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Cart panel */}
      <div className="lg:w-72 xl:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-teal-600" />
            <span className="font-semibold text-sm text-ink-900">Cart</span>
            {cartCount > 0 && <Badge variant="default" className="h-5 px-1.5 text-[10px]">{cartCount}</Badge>}
          </div>
          {cart.length > 0 && <Button variant="ghost" size="icon-sm" onClick={() => setCart([])}><Trash2 className="h-3.5 w-3.5 text-slate-400" /></Button>}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ShoppingCart className="h-10 w-10 text-slate-200 mb-2" />
              <p className="text-sm text-muted-foreground">Tap a product to add it to the cart</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink-800 truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(item.unitPrice)} each</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="outline" size="icon-sm" className="h-6 w-6" onClick={() => updateQty(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                  <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon-sm" className="h-6 w-6" onClick={() => updateQty(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stockQuantity}><Plus className="h-3 w-3" /></Button>
                </div>
                <span className="text-sm font-semibold w-16 text-right shrink-0">{formatCurrency(item.lineTotal)}</span>
              </div>
            ))
          )}
        </div>

        {/* Totals + payment */}
        {cart.length > 0 && (
          <div className="p-3 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-base font-bold text-ink-900">
              <span>Total</span>
              <span className="text-teal-700">{formatCurrency(subtotal)}</span>
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Amount Tendered (₦)</Label>
                <Input type="number" min="0" placeholder={String(subtotal)} className="h-9" value={amountTendered} onChange={(e) => setAmountTendered(e.target.value)} />
              </div>
              {tendered > 0 && change > 0 && (
                <div className="flex justify-between text-sm bg-green-50 rounded px-2 py-1">
                  <span className="text-green-700 font-medium">Change</span>
                  <span className="text-green-700 font-bold">{formatCurrency(change)}</span>
                </div>
              )}
              {tendered > 0 && balance > 0 && (
                <div className="flex justify-between text-sm bg-amber-50 rounded px-2 py-1">
                  <span className="text-amber-700 font-medium">Balance due</span>
                  <span className="text-amber-700 font-bold">{formatCurrency(balance)}</span>
                </div>
              )}
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading || cart.length === 0}>
              {loading ? 'Processing…' : `Complete Sale · ${formatCurrency(subtotal)}`}
            </Button>
          </div>
        )}
      </div>

      {/* Success dialog */}
      <Dialog open={!!success} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" /> Sale Complete!
            </DialogTitle>
            <DialogDescription>Transaction recorded successfully.</DialogDescription>
          </DialogHeader>
          {success && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Receipt Ref</span><span className="font-mono font-semibold text-ink-800 text-xs">{success.ref}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-teal-700">{formatCurrency(success.total)}</span></div>
                {success.paid > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Paid</span><span>{formatCurrency(success.paid)}</span></div>}
                {success.paid < success.total && (
                  <div className="flex justify-between text-sm font-medium text-amber-600"><span>Balance Due</span><span>{formatCurrency(success.total - success.paid)}</span></div>
                )}
                {success.paid > success.total && (
                  <div className="flex justify-between text-sm font-medium text-green-600"><span>Change</span><span>{formatCurrency(success.paid - success.total)}</span></div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
                  <Printer className="h-3.5 w-3.5" /> Print
                </Button>
                <Button size="sm" onClick={handleNewSale} className="gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" /> New Sale
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Edit, ToggleRight, ToggleLeft, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/data/mock'
import type { Category } from '@/types'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  function productCount(catId: string) {
    return MOCK_PRODUCTS.filter((p) => p.categoryId === catId && p.active).length
  }

  function openCreate() {
    setEditCat(null)
    setForm({ name: '', description: '' })
    setDialogOpen(true)
  }

  function openEdit(c: Category) {
    setEditCat(c)
    setForm({ name: c.name, description: c.description ?? '' })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.name) return
    if (editCat) {
      setCategories((prev) => prev.map((c) => c.id === editCat.id ? { ...c, name: form.name, description: form.description || undefined, updatedAt: new Date().toISOString() } : c))
    } else {
      setCategories((prev) => [...prev, { id: `cat_${Date.now()}`, name: form.name, description: form.description || undefined, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }])
    }
    setDialogOpen(false)
  }

  function toggleActive(id: string) {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active, updatedAt: new Date().toISOString() } : c))
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories.filter((c) => c.active).length} active categories</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <Card key={c.id} className={`hover:shadow-md transition-shadow ${!c.active ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-teal-600" />
                </div>
                {!c.active && <Badge variant="muted">Inactive</Badge>}
              </div>
              <p className="font-semibold text-ink-900 mb-0.5">{c.name}</p>
              {c.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{c.description}</p>}
              <p className="text-xs text-muted-foreground mb-3">{productCount(c.id)} active products</p>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => openEdit(c)}>
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {c.active ? <ToggleRight className="h-4 w-4 text-teal-600" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{c.active ? 'Deactivate' : 'Reactivate'} "{c.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>Products in this category will not be affected individually.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toggleActive(c.id)}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editCat ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>Category details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1"><Label>Name *</Label><Input placeholder="e.g. Beverages" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Description</Label><Textarea placeholder="Optional" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name}>{editCat ? 'Save' : 'Add Category'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

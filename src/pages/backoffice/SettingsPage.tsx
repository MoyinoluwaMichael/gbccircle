import { useState } from 'react'
import { Building2, Phone, DollarSign, Bell, Receipt, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { MOCK_SETTINGS } from '@/data/mock'

export function SettingsPage() {
  const [settings, setSettings] = useState(MOCK_SETTINGS)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink-900">Settings</h1>
        <p className="text-sm text-muted-foreground">Business configuration and preferences</p>
      </div>

      {/* Business details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Building2 className="h-4 w-4 text-teal-600" />Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Business Name</Label>
              <Input value={settings.businessName} onChange={(e) => setSettings((s) => ({ ...s, businessName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Business Phone</Label>
              <Input value={settings.phone} onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input value={settings.currency} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Input value={settings.timezone} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Bell className="h-4 w-4 text-teal-600" />Inventory Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Default Low-Stock Threshold</Label>
            <Input type="number" min="0" className="max-w-[120px]" value={settings.lowStockDefaultThreshold} onChange={(e) => setSettings((s) => ({ ...s, lowStockDefaultThreshold: Number(e.target.value) }))} />
            <p className="text-xs text-muted-foreground">Applied to new products unless overridden.</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4 text-teal-600" />Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {([['CASH', 'Cash'], ['BANK_TRANSFER', 'Bank Transfer'], ['POS_CARD', 'POS / Card'], ['OTHER', 'Other']] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="font-normal">{label}</Label>
              <Switch
                checked={settings.paymentMethods.includes(key)}
                onCheckedChange={(checked) => setSettings((s) => ({ ...s, paymentMethods: checked ? [...s.paymentMethods, key] : s.paymentMethods.filter((m) => m !== key) }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Receipt */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Receipt className="h-4 w-4 text-teal-600" />Receipt Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label>Receipt Footer Message</Label>
            <Textarea placeholder="e.g. Thank you for shopping with us!" rows={2} value={settings.receiptFooter ?? ''} onChange={(e) => setSettings((s) => ({ ...s, receiptFooter: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="gap-2">
        <Save className="h-4 w-4" />
        {saved ? 'Saved!' : 'Save Settings'}
      </Button>
    </div>
  )
}

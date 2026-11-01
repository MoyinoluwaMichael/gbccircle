import { FlaskConical } from 'lucide-react'
import { IS_DEMO } from '@/data/mock'

export function DemoBanner() {
  if (!IS_DEMO) return null
  return (
    <div className="bg-amber-500 text-white text-xs font-semibold text-center py-1.5 px-4 flex items-center justify-center gap-1.5">
      <FlaskConical className="h-3.5 w-3.5" />
      DEMO MODE — All data is sample data and does not represent real transactions
    </div>
  )
}

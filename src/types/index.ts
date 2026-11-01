// ─── Roles & Auth ────────────────────────────────────────────────────────────

export type Role = 'OWNER' | 'STAFF'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  staffId?: string
  active: boolean
}

// ─── Categories ──────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  description?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  sku: string
  categoryId: string
  categoryName: string
  description?: string
  imageUrl?: string
  costPrice?: number
  sellingPrice: number
  stockQuantity: number
  lowStockThreshold: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export function getStockStatus(product: Product): StockStatus {
  if (product.stockQuantity <= 0) return 'OUT_OF_STOCK'
  if (product.stockQuantity <= product.lowStockThreshold) return 'LOW_STOCK'
  return 'IN_STOCK'
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export type MovementType =
  | 'OPENING_STOCK'
  | 'MANUAL_INCREASE'
  | 'MANUAL_DECREASE'
  | 'SALE_DEDUCTION'
  | 'RETURN_RESTOCK'

export interface InventoryMovement {
  id: string
  productId: string
  productName: string
  productSku: string
  movementType: MovementType
  quantityDelta: number
  beforeQuantity: number
  afterQuantity: number
  reason?: string
  relatedSaleId?: string
  actor: string
  actorId: string
  createdAt: string
}

// ─── Staff ───────────────────────────────────────────────────────────────────

export interface Staff {
  id: string
  name: string
  phone: string
  email?: string
  staffCode: string
  role: Role
  active: boolean
  authId?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ─── Sales ───────────────────────────────────────────────────────────────────

export type SaleType = 'PRODUCT' | 'CHARGING' | 'MIXED'
export type SaleStatus = 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID'
export type SaleItemType = 'PRODUCT' | 'SERVICE'

export interface SaleItem {
  id: string
  saleId: string
  itemType: SaleItemType
  productId?: string
  productName: string
  productSku?: string
  quantity: number
  unitPrice: number
  lineDiscount: number
  lineTotal: number
  stockTracked: boolean
}

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'POS_CARD' | 'OTHER'
export type PaymentRecordStatus = 'CONFIRMED' | 'PENDING' | 'REVERSED'

export interface Payment {
  id: string
  saleId: string
  amount: number
  method: PaymentMethod
  status: PaymentRecordStatus
  reference?: string
  note?: string
  recordedBy: string
  recordedById: string
  createdAt: string
}

export interface Sale {
  id: string
  receiptRef: string
  staffId: string
  staffName: string
  saleType: SaleType
  status: SaleStatus
  paymentStatus: PaymentStatus
  subtotal: number
  discount: number
  total: number
  amountPaid: number
  balanceDue: number
  notes?: string
  items: SaleItem[]
  payments: Payment[]
  createdAt: string
  updatedAt: string
}

// ─── Refunds ─────────────────────────────────────────────────────────────────

export interface Refund {
  id: string
  saleId: string
  receiptRef: string
  amount: number
  reason: string
  method?: PaymentMethod
  processedBy: string
  processedById: string
  restockedItems: { productId: string; quantity: number }[]
  createdAt: string
}

// ─── Device Charging ─────────────────────────────────────────────────────────

export type DeviceType = 'PHONE' | 'TABLET' | 'LAPTOP' | 'OTHER'
export type ChargingJobStatus =
  | 'RECEIVED'
  | 'CHARGING'
  | 'COMPLETED'
  | 'COLLECTED'
  | 'CANCELLED'

export interface ChargingJob {
  id: string
  jobRef: string
  linkedSaleId?: string
  linkedReceiptRef?: string
  deviceType: DeviceType
  deviceBrand?: string
  deviceModel?: string
  deviceDescription?: string
  customerName?: string
  customerPhone?: string
  chargingFee: number
  notes?: string
  status: ChargingJobStatus
  paymentStatus: PaymentStatus
  createdBy: string
  createdById: string
  assignedTo?: string
  assignedToId?: string
  receivedAt: string
  collectedAt?: string
  cancelledAt?: string
  cancelReason?: string
  updatedAt: string
}

// ─── Reports / Dashboard ─────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalSalesToday: number
  totalSales7Days: number
  totalSalesMonth: number
  transactionCountToday: number
  transactionCountMonth: number
  avgSaleValueMonth: number
  productRevenueMonth: number
  chargingRevenueMonth: number
  paymentsCollectedMonth: number
  outstandingBalances: number
  refundsMonth: number
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface BusinessSettings {
  businessName: string
  phone: string
  currency: string
  timezone: string
  lowStockDefaultThreshold: number
  paymentMethods: PaymentMethod[]
  receiptFooter?: string
}

// ─── Cart (POS) ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
  unitPrice: number
  lineTotal: number
}

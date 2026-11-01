import type {
  Category,
  Product,
  Staff,
  Sale,
  Payment,
  SaleItem,
  InventoryMovement,
  ChargingJob,
  Refund,
  DashboardMetrics,
  BusinessSettings,
  User,
} from '@/types'

// ─── Demo Mode Banner ─────────────────────────────────────────────────────────
export const IS_DEMO = true

// ─── Users ───────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'usr_owner', name: 'Adebayo Okorie', email: 'owner@gbccircle.ng', role: 'OWNER', active: true },
  { id: 'usr_staff1', name: 'Chioma Eze', email: 'chioma@gbccircle.ng', role: 'STAFF', staffId: 'stf_001', active: true },
  { id: 'usr_staff2', name: 'Tunde Akin', email: 'tunde@gbccircle.ng', role: 'STAFF', staffId: 'stf_002', active: true },
  { id: 'usr_staff3', name: 'Ngozi Obi', email: 'ngozi@gbccircle.ng', role: 'STAFF', staffId: 'stf_003', active: false },
]

// ─── Categories ──────────────────────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_001', name: 'Beverages', description: 'Drinks and soft drinks', active: true, createdAt: '2026-01-15T09:00:00Z', updatedAt: '2026-01-15T09:00:00Z' },
  { id: 'cat_002', name: 'Snacks', description: 'Biscuits, chips, and packaged snacks', active: true, createdAt: '2026-01-15T09:05:00Z', updatedAt: '2026-01-15T09:05:00Z' },
  { id: 'cat_003', name: 'Stationery', description: 'Pens, notebooks, and school supplies', active: true, createdAt: '2026-01-15T09:10:00Z', updatedAt: '2026-01-15T09:10:00Z' },
  { id: 'cat_004', name: 'Phone Accessories', description: 'Data cables, chargers, earphones', active: true, createdAt: '2026-01-15T09:15:00Z', updatedAt: '2026-01-15T09:15:00Z' },
  { id: 'cat_005', name: 'Food Items', description: 'Instant noodles, canned goods', active: true, createdAt: '2026-01-15T09:20:00Z', updatedAt: '2026-01-15T09:20:00Z' },
  { id: 'cat_006', name: 'Toiletries', description: 'Soap, toothpaste, and personal care', active: false, createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
]

// ─── Products ────────────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  { id: 'prd_001', name: 'Indomie Noodles (Chicken)', sku: 'INDO-CK01', categoryId: 'cat_005', categoryName: 'Food Items', description: 'Indomie instant noodles, chicken flavour', costPrice: 120, sellingPrice: 180, stockQuantity: 142, lowStockThreshold: 20, active: true, createdAt: '2026-01-16T08:00:00Z', updatedAt: '2026-10-28T10:00:00Z' },
  { id: 'prd_002', name: 'La Casera Apple Drink', sku: 'LACS-AP01', categoryId: 'cat_001', categoryName: 'Beverages', costPrice: 150, sellingPrice: 250, stockQuantity: 4, lowStockThreshold: 10, active: true, createdAt: '2026-01-16T08:05:00Z', updatedAt: '2026-10-30T14:00:00Z' },
  { id: 'prd_003', name: 'Bic Ballpoint Pen (Blue)', sku: 'BICP-BL01', categoryId: 'cat_003', categoryName: 'Stationery', costPrice: 40, sellingPrice: 80, stockQuantity: 0, lowStockThreshold: 15, active: true, createdAt: '2026-01-16T08:10:00Z', updatedAt: '2026-10-20T09:00:00Z' },
  { id: 'prd_004', name: 'Kinder Bueno (2-pack)', sku: 'KIND-2P01', categoryId: 'cat_002', categoryName: 'Snacks', costPrice: 350, sellingPrice: 500, stockQuantity: 27, lowStockThreshold: 8, active: true, createdAt: '2026-01-17T09:00:00Z', updatedAt: '2026-10-29T11:00:00Z' },
  { id: 'prd_005', name: 'USB-C Charging Cable (1m)', sku: 'USBC-1M01', categoryId: 'cat_004', categoryName: 'Phone Accessories', costPrice: 500, sellingPrice: 900, stockQuantity: 18, lowStockThreshold: 5, active: true, createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-10-25T12:00:00Z' },
  { id: 'prd_006', name: 'Chivita Orange Juice (50cl)', sku: 'CHIV-OJ01', categoryId: 'cat_001', categoryName: 'Beverages', costPrice: 200, sellingPrice: 350, stockQuantity: 33, lowStockThreshold: 10, active: true, createdAt: '2026-01-20T08:00:00Z', updatedAt: '2026-10-28T16:00:00Z' },
  { id: 'prd_007', name: 'A4 Ruled Notebook (80 pages)', sku: 'NOTE-A401', categoryId: 'cat_003', categoryName: 'Stationery', costPrice: 250, sellingPrice: 450, stockQuantity: 51, lowStockThreshold: 10, active: true, createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-10-22T08:00:00Z' },
  { id: 'prd_008', name: 'Indomie Noodles (Pepper)', sku: 'INDO-PP01', categoryId: 'cat_005', categoryName: 'Food Items', costPrice: 120, sellingPrice: 180, stockQuantity: 88, lowStockThreshold: 20, active: true, createdAt: '2026-02-01T09:05:00Z', updatedAt: '2026-10-30T09:00:00Z' },
  { id: 'prd_009', name: 'Pringles Original (40g)', sku: 'PRIN-OG01', categoryId: 'cat_002', categoryName: 'Snacks', costPrice: 600, sellingPrice: 900, stockQuantity: 14, lowStockThreshold: 5, active: true, createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-10-27T14:00:00Z' },
  { id: 'prd_010', name: 'Earphones (Standard)', sku: 'EARP-ST01', categoryId: 'cat_004', categoryName: 'Phone Accessories', costPrice: 800, sellingPrice: 1500, stockQuantity: 9, lowStockThreshold: 3, active: true, createdAt: '2026-02-10T11:00:00Z', updatedAt: '2026-10-15T11:00:00Z' },
  { id: 'prd_011', name: 'Malta Guinness (33cl)', sku: 'MALT-GN01', categoryId: 'cat_001', categoryName: 'Beverages', costPrice: 200, sellingPrice: 350, stockQuantity: 7, lowStockThreshold: 10, active: true, createdAt: '2026-03-01T08:00:00Z', updatedAt: '2026-10-28T10:00:00Z' },
  { id: 'prd_012', name: 'Gala Sausage Roll', sku: 'GALA-SR01', categoryId: 'cat_002', categoryName: 'Snacks', costPrice: 100, sellingPrice: 150, stockQuantity: 60, lowStockThreshold: 15, active: true, createdAt: '2026-03-05T09:00:00Z', updatedAt: '2026-10-30T08:00:00Z' },
  { id: 'prd_013', name: 'Milo Tin (200g)', sku: 'MILO-TN01', categoryId: 'cat_005', categoryName: 'Food Items', costPrice: 1200, sellingPrice: 1800, stockQuantity: 22, lowStockThreshold: 5, active: false, createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-09-01T10:00:00Z' },
  { id: 'prd_014', name: 'Phone Screen Protector', sku: 'SCRP-ST01', categoryId: 'cat_004', categoryName: 'Phone Accessories', costPrice: 300, sellingPrice: 600, stockQuantity: 25, lowStockThreshold: 5, active: true, createdAt: '2026-04-10T10:00:00Z', updatedAt: '2026-10-20T14:00:00Z' },
  { id: 'prd_015', name: 'Peak Milk Sachet (x5)', sku: 'PEAK-5S01', categoryId: 'cat_005', categoryName: 'Food Items', costPrice: 200, sellingPrice: 350, stockQuantity: 45, lowStockThreshold: 10, active: true, createdAt: '2026-04-15T09:00:00Z', updatedAt: '2026-10-29T09:00:00Z' },
]

// ─── Staff ───────────────────────────────────────────────────────────────────
export const MOCK_STAFF: Staff[] = [
  { id: 'stf_001', name: 'Chioma Eze', phone: '08012345678', email: 'chioma@gbccircle.ng', staffCode: 'GBC-001', role: 'STAFF', active: true, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z', createdBy: 'Adebayo Okorie' },
  { id: 'stf_002', name: 'Tunde Akin', phone: '08098765432', email: 'tunde@gbccircle.ng', staffCode: 'GBC-002', role: 'STAFF', active: true, createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z', createdBy: 'Adebayo Okorie' },
  { id: 'stf_003', name: 'Ngozi Obi', phone: '08055544433', staffCode: 'GBC-003', role: 'STAFF', active: false, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-07-01T10:00:00Z', createdBy: 'Adebayo Okorie' },
  { id: 'stf_004', name: 'Emeka Nwosu', phone: '07011223344', email: 'emeka@gbccircle.ng', staffCode: 'GBC-004', role: 'STAFF', active: true, createdAt: '2026-05-01T10:00:00Z', updatedAt: '2026-05-01T10:00:00Z', createdBy: 'Adebayo Okorie' },
]

// ─── Sales ───────────────────────────────────────────────────────────────────
export const MOCK_SALES: Sale[] = [
  {
    id: 'sale_001', receiptRef: 'GBC-M2DQ7K-AB12', staffId: 'stf_001', staffName: 'Chioma Eze',
    saleType: 'PRODUCT', status: 'COMPLETED', paymentStatus: 'PAID',
    subtotal: 1260, discount: 0, total: 1260, amountPaid: 1260, balanceDue: 0,
    items: [
      { id: 'si_001a', saleId: 'sale_001', itemType: 'PRODUCT', productId: 'prd_001', productName: 'Indomie Noodles (Chicken)', productSku: 'INDO-CK01', quantity: 3, unitPrice: 180, lineDiscount: 0, lineTotal: 540, stockTracked: true },
      { id: 'si_001b', saleId: 'sale_001', itemType: 'PRODUCT', productId: 'prd_004', productName: 'Kinder Bueno (2-pack)', productSku: 'KIND-2P01', quantity: 1, unitPrice: 500, lineDiscount: 0, lineTotal: 500, stockTracked: true },
      { id: 'si_001c', saleId: 'sale_001', itemType: 'PRODUCT', productId: 'prd_006', productName: 'Chivita Orange Juice (50cl)', productSku: 'CHIV-OJ01', quantity: 2, unitPrice: 350, lineDiscount: 0, lineTotal: 220, stockTracked: true },
    ],
    payments: [{ id: 'pay_001a', saleId: 'sale_001', amount: 1260, method: 'CASH', status: 'CONFIRMED', recordedBy: 'Chioma Eze', recordedById: 'stf_001', createdAt: '2026-11-01T08:15:00Z' }],
    createdAt: '2026-11-01T08:10:00Z', updatedAt: '2026-11-01T08:15:00Z',
  },
  {
    id: 'sale_002', receiptRef: 'GBC-M2DQ9P-CD34', staffId: 'stf_002', staffName: 'Tunde Akin',
    saleType: 'CHARGING', status: 'COMPLETED', paymentStatus: 'PAID',
    subtotal: 500, discount: 0, total: 500, amountPaid: 500, balanceDue: 0,
    items: [
      { id: 'si_002a', saleId: 'sale_002', itemType: 'SERVICE', productName: 'Device Charging – Phone', quantity: 1, unitPrice: 500, lineDiscount: 0, lineTotal: 500, stockTracked: false },
    ],
    payments: [{ id: 'pay_002a', saleId: 'sale_002', amount: 500, method: 'CASH', status: 'CONFIRMED', recordedBy: 'Tunde Akin', recordedById: 'stf_002', createdAt: '2026-11-01T09:05:00Z' }],
    createdAt: '2026-11-01T09:00:00Z', updatedAt: '2026-11-01T09:05:00Z',
  },
  {
    id: 'sale_003', receiptRef: 'GBC-M2DQB3-EF56', staffId: 'stf_001', staffName: 'Chioma Eze',
    saleType: 'PRODUCT', status: 'COMPLETED', paymentStatus: 'PARTIALLY_PAID',
    subtotal: 2700, discount: 0, total: 2700, amountPaid: 1500, balanceDue: 1200,
    items: [
      { id: 'si_003a', saleId: 'sale_003', itemType: 'PRODUCT', productId: 'prd_005', productName: 'USB-C Charging Cable (1m)', productSku: 'USBC-1M01', quantity: 1, unitPrice: 900, lineDiscount: 0, lineTotal: 900, stockTracked: true },
      { id: 'si_003b', saleId: 'sale_003', itemType: 'PRODUCT', productId: 'prd_010', productName: 'Earphones (Standard)', productSku: 'EARP-ST01', quantity: 1, unitPrice: 1500, lineDiscount: 0, lineTotal: 1500, stockTracked: true },
      { id: 'si_003c', saleId: 'sale_003', itemType: 'PRODUCT', productId: 'prd_014', productName: 'Phone Screen Protector', productSku: 'SCRP-ST01', quantity: 1, unitPrice: 600, lineDiscount: 0, lineTotal: 300, stockTracked: true },
    ],
    payments: [{ id: 'pay_003a', saleId: 'sale_003', amount: 1500, method: 'BANK_TRANSFER', status: 'CONFIRMED', reference: 'TRF/2026/8823', recordedBy: 'Chioma Eze', recordedById: 'stf_001', createdAt: '2026-11-01T10:30:00Z' }],
    createdAt: '2026-11-01T10:25:00Z', updatedAt: '2026-11-01T10:30:00Z',
  },
  {
    id: 'sale_004', receiptRef: 'GBC-M2DQCK-GH78', staffId: 'stf_004', staffName: 'Emeka Nwosu',
    saleType: 'MIXED', status: 'COMPLETED', paymentStatus: 'PAID',
    subtotal: 1430, discount: 0, total: 1430, amountPaid: 1430, balanceDue: 0,
    items: [
      { id: 'si_004a', saleId: 'sale_004', itemType: 'PRODUCT', productId: 'prd_012', productName: 'Gala Sausage Roll', productSku: 'GALA-SR01', quantity: 3, unitPrice: 150, lineDiscount: 0, lineTotal: 450, stockTracked: true },
      { id: 'si_004b', saleId: 'sale_004', itemType: 'PRODUCT', productId: 'prd_006', productName: 'Chivita Orange Juice (50cl)', productSku: 'CHIV-OJ01', quantity: 2, unitPrice: 350, lineDiscount: 0, lineTotal: 700, stockTracked: true },
      { id: 'si_004c', saleId: 'sale_004', itemType: 'SERVICE', productName: 'Device Charging – Laptop', quantity: 1, unitPrice: 500, lineDiscount: 0, lineTotal: 280, stockTracked: false },
    ],
    payments: [{ id: 'pay_004a', saleId: 'sale_004', amount: 1430, method: 'POS_CARD', status: 'CONFIRMED', recordedBy: 'Emeka Nwosu', recordedById: 'stf_004', createdAt: '2026-11-01T11:20:00Z' }],
    createdAt: '2026-11-01T11:15:00Z', updatedAt: '2026-11-01T11:20:00Z',
  },
  {
    id: 'sale_005', receiptRef: 'GBC-M2DQE9-IJ90', staffId: 'stf_002', staffName: 'Tunde Akin',
    saleType: 'PRODUCT', status: 'COMPLETED', paymentStatus: 'UNPAID',
    subtotal: 900, discount: 0, total: 900, amountPaid: 0, balanceDue: 900,
    items: [
      { id: 'si_005a', saleId: 'sale_005', itemType: 'PRODUCT', productId: 'prd_009', productName: 'Pringles Original (40g)', productSku: 'PRIN-OG01', quantity: 1, unitPrice: 900, lineDiscount: 0, lineTotal: 900, stockTracked: true },
    ],
    payments: [],
    createdAt: '2026-11-01T12:00:00Z', updatedAt: '2026-11-01T12:00:00Z',
  },
  {
    id: 'sale_006', receiptRef: 'GBC-M2DQG7-KL12', staffId: 'stf_001', staffName: 'Chioma Eze',
    saleType: 'PRODUCT', status: 'COMPLETED', paymentStatus: 'PAID',
    subtotal: 3600, discount: 200, total: 3400, amountPaid: 3400, balanceDue: 0,
    items: [
      { id: 'si_006a', saleId: 'sale_006', itemType: 'PRODUCT', productId: 'prd_007', productName: 'A4 Ruled Notebook (80 pages)', productSku: 'NOTE-A401', quantity: 4, unitPrice: 450, lineDiscount: 0, lineTotal: 1800, stockTracked: true },
      { id: 'si_006b', saleId: 'sale_006', itemType: 'PRODUCT', productId: 'prd_003', productName: 'Bic Ballpoint Pen (Blue)', productSku: 'BICP-BL01', quantity: 10, unitPrice: 80, lineDiscount: 0, lineTotal: 800, stockTracked: true },
      { id: 'si_006c', saleId: 'sale_006', itemType: 'PRODUCT', productId: 'prd_001', productName: 'Indomie Noodles (Chicken)', productSku: 'INDO-CK01', quantity: 5, unitPrice: 180, lineDiscount: 0, lineTotal: 900, stockTracked: true },
    ],
    payments: [{ id: 'pay_006a', saleId: 'sale_006', amount: 3400, method: 'CASH', status: 'CONFIRMED', recordedBy: 'Chioma Eze', recordedById: 'stf_001', createdAt: '2026-10-30T14:45:00Z' }],
    createdAt: '2026-10-30T14:40:00Z', updatedAt: '2026-10-30T14:45:00Z',
  },
  {
    id: 'sale_007', receiptRef: 'GBC-M2DQI5-MN34', staffId: 'stf_002', staffName: 'Tunde Akin',
    saleType: 'PRODUCT', status: 'REFUNDED', paymentStatus: 'PAID',
    subtotal: 1800, discount: 0, total: 1800, amountPaid: 1800, balanceDue: 0,
    items: [
      { id: 'si_007a', saleId: 'sale_007', itemType: 'PRODUCT', productId: 'prd_005', productName: 'USB-C Charging Cable (1m)', productSku: 'USBC-1M01', quantity: 2, unitPrice: 900, lineDiscount: 0, lineTotal: 1800, stockTracked: true },
    ],
    payments: [{ id: 'pay_007a', saleId: 'sale_007', amount: 1800, method: 'POS_CARD', status: 'CONFIRMED', recordedBy: 'Tunde Akin', recordedById: 'stf_002', createdAt: '2026-10-29T16:00:00Z' }],
    createdAt: '2026-10-29T15:55:00Z', updatedAt: '2026-10-29T17:00:00Z',
  },
  {
    id: 'sale_008', receiptRef: 'GBC-M2DQK2-OP56', staffId: 'stf_004', staffName: 'Emeka Nwosu',
    saleType: 'PRODUCT', status: 'COMPLETED', paymentStatus: 'PAID',
    subtotal: 2250, discount: 0, total: 2250, amountPaid: 2250, balanceDue: 0,
    items: [
      { id: 'si_008a', saleId: 'sale_008', itemType: 'PRODUCT', productId: 'prd_008', productName: 'Indomie Noodles (Pepper)', productSku: 'INDO-PP01', quantity: 5, unitPrice: 180, lineDiscount: 0, lineTotal: 900, stockTracked: true },
      { id: 'si_008b', saleId: 'sale_008', itemType: 'PRODUCT', productId: 'prd_015', productName: 'Peak Milk Sachet (x5)', productSku: 'PEAK-5S01', quantity: 3, unitPrice: 350, lineDiscount: 0, lineTotal: 1050, stockTracked: true },
      { id: 'si_008c', saleId: 'sale_008', itemType: 'PRODUCT', productId: 'prd_002', productName: 'La Casera Apple Drink', productSku: 'LACS-AP01', quantity: 1, unitPrice: 250, lineDiscount: 0, lineTotal: 300, stockTracked: true },
    ],
    payments: [{ id: 'pay_008a', saleId: 'sale_008', amount: 2250, method: 'BANK_TRANSFER', status: 'CONFIRMED', recordedBy: 'Emeka Nwosu', recordedById: 'stf_004', createdAt: '2026-10-28T10:30:00Z' }],
    createdAt: '2026-10-28T10:25:00Z', updatedAt: '2026-10-28T10:30:00Z',
  },
]

// ─── Charging Jobs ────────────────────────────────────────────────────────────
export const MOCK_CHARGING_JOBS: ChargingJob[] = [
  { id: 'job_001', jobRef: 'CHG-001', linkedSaleId: 'sale_002', linkedReceiptRef: 'GBC-M2DQ9P-CD34', deviceType: 'PHONE', deviceBrand: 'Samsung', deviceModel: 'Galaxy A14', customerName: 'Biodun Ojo', customerPhone: '08123456789', chargingFee: 500, status: 'COLLECTED', paymentStatus: 'PAID', createdBy: 'Tunde Akin', createdById: 'stf_002', receivedAt: '2026-11-01T09:00:00Z', collectedAt: '2026-11-01T10:45:00Z', updatedAt: '2026-11-01T10:45:00Z' },
  { id: 'job_002', jobRef: 'CHG-002', deviceType: 'LAPTOP', deviceBrand: 'HP', deviceDescription: 'Silver HP laptop', customerName: 'Amara Iwu', chargingFee: 800, notes: 'Handle with care', status: 'CHARGING', paymentStatus: 'UNPAID', createdBy: 'Chioma Eze', createdById: 'stf_001', assignedTo: 'Chioma Eze', assignedToId: 'stf_001', receivedAt: '2026-11-01T08:30:00Z', updatedAt: '2026-11-01T09:00:00Z' },
  { id: 'job_003', jobRef: 'CHG-003', deviceType: 'PHONE', deviceBrand: 'Tecno', deviceModel: 'Camon 20', customerName: 'Seun Adeyemi', customerPhone: '07033445566', chargingFee: 500, status: 'COMPLETED', paymentStatus: 'PAID', createdBy: 'Emeka Nwosu', createdById: 'stf_004', receivedAt: '2026-11-01T11:00:00Z', updatedAt: '2026-11-01T12:30:00Z' },
  { id: 'job_004', jobRef: 'CHG-004', deviceType: 'TABLET', deviceBrand: 'Apple', deviceModel: 'iPad', chargingFee: 1000, status: 'RECEIVED', paymentStatus: 'UNPAID', createdBy: 'Tunde Akin', createdById: 'stf_002', receivedAt: '2026-11-01T12:45:00Z', updatedAt: '2026-11-01T12:45:00Z' },
  { id: 'job_005', jobRef: 'CHG-005', deviceType: 'PHONE', deviceDescription: 'Broken screen phone', chargingFee: 500, status: 'CANCELLED', paymentStatus: 'UNPAID', createdBy: 'Chioma Eze', createdById: 'stf_001', receivedAt: '2026-10-30T14:00:00Z', cancelledAt: '2026-10-30T15:00:00Z', cancelReason: 'Customer picked up without waiting', updatedAt: '2026-10-30T15:00:00Z' },
]

// ─── Refunds ─────────────────────────────────────────────────────────────────
export const MOCK_REFUNDS: Refund[] = [
  { id: 'ref_001', saleId: 'sale_007', receiptRef: 'GBC-M2DQI5-MN34', amount: 1800, reason: 'Cable faulty on arrival. Customer returned both units.', method: 'CASH', processedBy: 'Adebayo Okorie', processedById: 'usr_owner', restockedItems: [{ productId: 'prd_005', quantity: 2 }], createdAt: '2026-10-29T17:00:00Z' },
]

// ─── Inventory Movements ─────────────────────────────────────────────────────
export const MOCK_MOVEMENTS: InventoryMovement[] = [
  { id: 'inv_001', productId: 'prd_001', productName: 'Indomie Noodles (Chicken)', productSku: 'INDO-CK01', movementType: 'OPENING_STOCK', quantityDelta: 200, beforeQuantity: 0, afterQuantity: 200, reason: 'Initial stock', actor: 'Adebayo Okorie', actorId: 'usr_owner', createdAt: '2026-01-16T08:00:00Z' },
  { id: 'inv_002', productId: 'prd_002', productName: 'La Casera Apple Drink', productSku: 'LACS-AP01', movementType: 'OPENING_STOCK', quantityDelta: 50, beforeQuantity: 0, afterQuantity: 50, reason: 'Initial stock', actor: 'Adebayo Okorie', actorId: 'usr_owner', createdAt: '2026-01-16T08:05:00Z' },
  { id: 'inv_003', productId: 'prd_001', productName: 'Indomie Noodles (Chicken)', productSku: 'INDO-CK01', movementType: 'SALE_DEDUCTION', quantityDelta: -3, beforeQuantity: 190, afterQuantity: 187, relatedSaleId: 'sale_001', actor: 'Chioma Eze', actorId: 'stf_001', createdAt: '2026-11-01T08:10:00Z' },
  { id: 'inv_004', productId: 'prd_004', productName: 'Kinder Bueno (2-pack)', productSku: 'KIND-2P01', movementType: 'SALE_DEDUCTION', quantityDelta: -1, beforeQuantity: 28, afterQuantity: 27, relatedSaleId: 'sale_001', actor: 'Chioma Eze', actorId: 'stf_001', createdAt: '2026-11-01T08:10:00Z' },
  { id: 'inv_005', productId: 'prd_005', productName: 'USB-C Charging Cable (1m)', productSku: 'USBC-1M01', movementType: 'RETURN_RESTOCK', quantityDelta: 2, beforeQuantity: 16, afterQuantity: 18, reason: 'Refund – sale GBC-M2DQI5-MN34', relatedSaleId: 'sale_007', actor: 'Adebayo Okorie', actorId: 'usr_owner', createdAt: '2026-10-29T17:00:00Z' },
  { id: 'inv_006', productId: 'prd_003', productName: 'Bic Ballpoint Pen (Blue)', productSku: 'BICP-BL01', movementType: 'MANUAL_DECREASE', quantityDelta: -5, beforeQuantity: 5, afterQuantity: 0, reason: 'Damaged stock disposal', actor: 'Adebayo Okorie', actorId: 'usr_owner', createdAt: '2026-10-20T09:00:00Z' },
  { id: 'inv_007', productId: 'prd_002', productName: 'La Casera Apple Drink', productSku: 'LACS-AP01', movementType: 'MANUAL_DECREASE', quantityDelta: -46, beforeQuantity: 50, afterQuantity: 4, reason: 'Sales deductions (bulk)', actor: 'Adebayo Okorie', actorId: 'usr_owner', createdAt: '2026-10-30T14:00:00Z' },
]

// ─── Dashboard Metrics ───────────────────────────────────────────────────────
export const MOCK_DASHBOARD: DashboardMetrics = {
  totalSalesToday: 6690,
  totalSales7Days: 42350,
  totalSalesMonth: 187640,
  transactionCountToday: 4,
  transactionCountMonth: 89,
  avgSaleValueMonth: 2108,
  productRevenueMonth: 154380,
  chargingRevenueMonth: 33260,
  paymentsCollectedMonth: 171200,
  outstandingBalances: 16440,
  refundsMonth: 1800,
}

export const MOCK_SALES_TREND = [
  { date: '25 Oct', sales: 18400, transactions: 9 },
  { date: '26 Oct', sales: 22100, transactions: 11 },
  { date: '27 Oct', sales: 15600, transactions: 7 },
  { date: '28 Oct', sales: 29800, transactions: 14 },
  { date: '29 Oct', sales: 31200, transactions: 15 },
  { date: '30 Oct', sales: 25800, transactions: 12 },
  { date: '31 Oct', sales: 27900, transactions: 13 },
  { date: '01 Nov', sales: 6690, transactions: 4 },
]

export const MOCK_TOP_PRODUCTS = [
  { name: 'Indomie Noodles (Chicken)', revenue: 28620, unitsSold: 159 },
  { name: 'USB-C Charging Cable (1m)', revenue: 16200, unitsSold: 18 },
  { name: 'Chivita Orange Juice (50cl)', revenue: 15750, unitsSold: 45 },
  { name: 'Kinder Bueno (2-pack)', revenue: 14000, unitsSold: 28 },
  { name: 'Gala Sausage Roll', revenue: 12600, unitsSold: 84 },
]

// ─── Settings ─────────────────────────────────────────────────────────────────
export const MOCK_SETTINGS: BusinessSettings = {
  businessName: 'GBCcircle',
  phone: '08139009923',
  currency: 'NGN',
  timezone: 'Africa/Lagos',
  lowStockDefaultThreshold: 10,
  paymentMethods: ['CASH', 'BANK_TRANSFER', 'POS_CARD', 'OTHER'],
  receiptFooter: 'Thank you for shopping with GBCcircle!',
}

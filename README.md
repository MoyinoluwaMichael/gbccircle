# GBCcircle — Inventory & Sales Management System

A full-featured Inventory and Sales Management System built for a small business operating in a student environment in Nigeria. The app covers point-of-sale, stock management, device charging requests, staff management, and an owner backoffice — all in Nigerian Naira (₦).

> **Status:** UI complete with mock data. Convex backend integration is the next phase.

---

## Features

### Owner Backoffice
| Page | What it does |
|---|---|
| Dashboard | KPI cards, sales trend chart, top products, low-stock alerts |
| Sales | Transaction list with staff/payment/status filters; record payments, cancel, process refunds |
| Products | Product catalogue with category/stock filters; create, edit, activate/deactivate |
| Categories | Category management with per-category product counts |
| Inventory | Stock overview and movement history; manual stock adjustments |
| Charging Requests | Device charging tracker with staff filter; view, edit, advance status |
| Staff | Staff profiles with sales stats; create, edit, activate/deactivate |
| Reports | Sales, staff performance, product, and charging analytics with charts |
| Settings | Business details, inventory defaults, payment method toggles, receipt footer |

### Staff POS
| Page | What it does |
|---|---|
| New Sale | Product grid with category filters, cart, multi-payment-method checkout |
| Charging Requests | Own requests; create new, edit details, advance status |
| My Sales | Personal sales history |
| Profile | Staff info and stats |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v3 |
| UI primitives | Radix UI (shadcn/ui style) |
| Routing | React Router v6 |
| Charts | Recharts |
| Date handling | date-fns |
| Icons | Lucide React |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check
npm run type-check

# Production build
npm run build
```

The app runs at `http://localhost:5173` by default.

---

## Demo Login

The app ships with mock data and three demo accounts. Any password is accepted.

| Role | Email |
|---|---|
| Owner | `owner@gbccircle.com` |
| Staff — Chioma | `chioma@gbccircle.com` |
| Staff — Tunde | `tunde@gbccircle.com` |

A demo mode banner is shown site-wide while `IS_DEMO = true` in `src/data/mock.ts`.

---

## Project Structure

```
src/
├── components/
│   ├── layouts/        # BackofficeLayout, StaffLayout
│   ├── shared/         # StatusBadge, StatCard, EmptyState, DemoBanner
│   └── ui/             # Radix-based primitives (Button, Dialog, Select…)
├── contexts/
│   └── AuthContext.tsx # Mock auth with role-based route guards
├── data/
│   └── mock.ts         # All mock data and IS_DEMO flag
├── lib/
│   └── utils.ts        # formatCurrency (NGN), formatDate, cn…
├── pages/
│   ├── auth/           # LoginPage
│   ├── backoffice/     # Owner pages
│   └── staff/          # Staff POS pages
└── types/
    └── index.ts        # All entity types
```

---

## Roles & Routing

- `/backoffice/*` — Owner only (`OWNER` role)
- `/staff/*` — Staff only (`STAFF` role)
- Unauthenticated users are redirected to `/login`

---

## Roadmap

- [ ] Convex backend integration (database, real auth, real-time sync)
- [ ] Receipt PDF generation
- [ ] WhatsApp/SMS customer notifications
- [ ] Multi-branch support

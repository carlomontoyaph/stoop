# Architecture

## Data Model

All app data is stored in a single JSON object under `localStorage` key `stoop_data_v1`.

### Properties
```json
{
  "id": "p1",
  "name": "Maple Court Duplex",
  "address": "412 Maple Ave, Portland, OR 97214",
  "units": 2
}
```

### Tenants
```json
{
  "id": "t1",
  "propertyId": "p1",
  "unit": "Unit A",
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "(503) 555-0142",
  "emergency": "Jane Doe — (503) 555-0143",
  "moveIn": "2024-08-01",
  "leaseStart": "2025-08-01",
  "leaseEnd": "2026-07-31",
  "rent": 1500,
  "status": "active"
}
```

`status`: `"active"` | `"inactive"`

### Payments
```json
{
  "id": "r1",
  "tenantId": "t1",
  "dueDate": "2026-06-01",
  "amount": 1500,
  "status": "paid",
  "paidDate": "2026-06-01",
  "daysOverdue": 0,
  "lateFee": 0
}
```

`status`: `"paid"` | `"due"` | `"late"`

### Maintenance
```json
{
  "id": "m1",
  "propertyId": "p1",
  "tenantId": "t1",
  "title": "Leaky faucet",
  "description": "...",
  "status": "reported",
  "priority": "low",
  "reported": "2026-06-05",
  "completed": null,
  "estCost": 150,
  "actualCost": null,
  "notes": ""
}
```

`status`: `"reported"` | `"assigned"` | `"in-progress"` | `"completed"`  
`priority`: `"low"` | `"medium"` | `"high"` | `"emergency"`

---

## Component Hierarchy

```
App
└── StoreProvider (React Context)
    └── AppRouter (view state machine)
        ├── Landing (pre-onboarding)
        ├── Onboarding (3-step wizard)
        └── AppLayout (app shell)
            ├── header (desktop)
            ├── aside.sidebar (desktop nav)
            ├── MobileDrawer (hamburger overlay)
            ├── MobileBottomNav (mobile tab bar)
            └── main#main-content (screen outlet)
                ├── Dashboard
                ├── Tenants
                ├── Rent
                ├── Leases
                ├── Maintenance
                ├── Settings
                └── Feedback
```

---

## State Management Flow

```
StoreProvider (store.jsx)
  │
  ├── loads from localStorage on mount (or seeds demo data)
  │
  ├── exposes { data, update, reset, clear, startDemo } via Context
  │
  └── any screen calls update(d => nextData)
        │
        └── persists to localStorage immediately (synchronous)
```

All state mutations follow the same pattern:

```js
const { data, update } = useStore()
update(d => ({ ...d, tenants: d.tenants.filter(t => t.id !== id) }))
```

Navigation state (`stoop_nav_v1`) is managed separately by `useNavigation()` in `navigation.js`.

---

## Navigation System

The app uses a string-keyed state machine instead of React Router — appropriate for a prototype with a fixed set of views.

```
'landing' → 'onboarding' → 'dashboard'
                                 ↕
   'tenants' ↔ 'rent' ↔ 'leases' ↔ 'maintenance' ↔ 'settings' ↔ 'feedback'
```

`go(view)` in `useNavigation()`:
1. Updates React state (triggers re-render)
2. Writes to `localStorage` (persists across refresh)
3. Scrolls to top
4. Moves keyboard focus to `<main id="main-content">`

Valid views are defined in `APP_VIEWS` and `ALL_VIEWS` in `src/store/navigation.js`.

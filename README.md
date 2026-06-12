# Stoop — Property Management for DIY Landlords

> A frontend-only prototype for validating the Stoop product concept with real users and investors.

**Stack:** React 18 · Vite 5 · Vanilla CSS · localStorage (no backend)

---

## Overview

Stoop is a property management dashboard designed for DIY landlords who manage 1–10 units. This repository is a **fully-functional frontend prototype** — all data lives in the browser's localStorage and state resets on demand. There is no backend, no authentication, and no database.

**What the prototype covers:**
- Landing page with pricing and FAQ
- 3-step onboarding wizard
- Dashboard with live stats
- Tenant roster with add/edit/search
- Rent tracking with calendar and mark-paid workflow
- Lease management with renewal alerts
- Maintenance request kanban board
- Settings (export, reset) and feedback form

---

## Quick Start

**Prerequisites:** Node.js 18 or later, npm 9+

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
# → http://localhost:5173
```

Open your browser at `http://localhost:5173`. The app loads straight to the landing page with pre-seeded demo data.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on `http://localhost:5173` with hot-reload |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Serve the production build locally for final checks |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 18 — functional components, hooks, Context API |
| Build tool | Vite 5 — esbuild, HMR, asset hashing |
| Styling | Vanilla CSS with custom properties — no CSS framework |
| State | React Context + localStorage (no Redux, no Zustand) |
| Icons | 49 inline SVG paths — no icon library dependency |
| Routing | State-machine view router in App.jsx — no React Router |
| Deployment | Static HTML/JS/CSS — any static host, CDN, or ngrok |

---

## Sharing via ngrok

To share the prototype over the internet for remote user testing:

1. **Install ngrok** — download from [ngrok.com/download](https://ngrok.com/download) and add it to your PATH, or use the Windows convenience script below.

2. **Start the dev server** in one terminal:
   ```bash
   npm run dev
   ```

3. **Start the tunnel** in a second terminal:
   ```bash
   ngrok http 5173
   ```
   ngrok prints a public URL like `https://abc123.ngrok.io`. Share that link — anyone with internet access can open the prototype.

**Windows one-liner (from this repo):**
```powershell
.\scripts\ngrok.ps1
```

> Note: The free ngrok tier requires an account for persistent URLs. Sessions expire when the terminal is closed.

---

## Demo Data

The app ships with realistic seed data so every screen is populated on first load.

| Entity | Count | Details |
|--------|-------|---------|
| Properties | 3 | Maple Court Duplex, Birchwood Apartments, 123 Main St |
| Tenants | 6 | 5 active, 1 inactive; mix of lease states |
| Payments | ~20 | Covering March–July 2026; mix of paid / due / late |
| Maintenance requests | 6 | Spread across all kanban statuses |

**Fixed reference date:** `2026-06-11` — all relative dates (days overdue, days until renewal) are calculated from this fixed value so the prototype renders consistently regardless of when it is opened.

### Resetting demo data

- **In-app:** Settings → "Reset demo data" button
- **Browser DevTools:** `localStorage.removeItem('stoop_data_v1')` then refresh

---

## localStorage

| Key | Purpose | How to clear |
|-----|---------|--------------|
| `stoop_data_v1` | All app data — properties, tenants, payments, maintenance | Settings → Reset, or DevTools |
| `stoop_nav_v1` | Last visited view (persists across refreshes) | `localStorage.removeItem('stoop_nav_v1')` |

Clearing `stoop_data_v1` and refreshing returns the app to its seed state.

---

## Project Structure

```
src/
  components/       Reusable UI — Button, Modal, Field, Icon, AppLayout, Toast, …
  screens/          Full-page views — Landing, Onboarding, Dashboard, Tenants, Rent, …
  store/            State management — store.jsx (Context + seed data), helpers.js, navigation.js
  utils/            Formatters — formatPhone.js
  styles/           CSS — tokens.css, reset.css, base.css, responsive.css, index.css
  App.jsx           Root component (view router)
  main.jsx          Entry point
```

---

## State Management

All app state lives in a single React Context (`src/store/store.jsx`). Access it with the `useStore()` hook:

```js
const { data, update, reset, clear } = useStore()
```

| Member | Description |
|--------|-------------|
| `data` | Live snapshot of the full store (properties, tenants, payments, maintenance) |
| `update(fn)` | Mutate state — receives current data, returns next data: `update(d => ({ ...d, tenants: [...d.tenants, newTenant] }))` |
| `reset()` | Reload seed data without clearing the onboarded flag |
| `clear()` | Wipe all data and return to the landing page |
| `startDemo(opts)` | Seed the full demo dataset and mark the user as onboarded |

State is persisted to `localStorage` on every `update()` call under the key `stoop_data_v1`. Navigation state (last visited view) is persisted separately under `stoop_nav_v1`.

---

## Component Inventory

Reusable UI components live in `src/components/`:

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `Button` | Styled button | `variant` (primary/secondary/ghost/outline/danger), `size` (sm/xs/lg), `icon`, `iconRight` |
| `Modal` | Accessible dialog | `title`, `onClose`, `footer` (sticky), `wide` (760px max), `badge` |
| `Field` | Form field wrapper | `label`, `hint`, `error` — wraps a single `<input>` or `<select>` and auto-links label |
| `Icon` | SVG icon | `name` (49 icons — see `src/components/Icon.jsx`), `size`, `stroke` |
| `Segmented` | Tab-style control | `options` (`[{value, label, icon?}]`), `value`, `onChange`, `label` (accessible) |
| `StatusBadge` | Colored status chip | `status` (paid/active/late/expired/renewing soon/…), `label` (override text) |
| `PriorityTag` | Priority indicator | `level` (emergency/high/medium/low), `dotOnly` (renders colored dot instead of label) |
| `StatCard` | KPI card | `label`, `value`, `trend`, `icon`, `color`, `bg` |
| `Confirm` | Confirmation dialog | `title`, `message`, `confirmLabel`, `danger`, `onConfirm`, `onClose` |
| `Toast` | Status notification | `msg`, `icon` (default: checkCircle) |
| `AppLayout` | App shell | `view`, `go`, `children` |

---

## Design System

CSS custom properties (design tokens) are defined in `src/styles/tokens.css`. All component styles use these tokens — no hardcoded color values outside the token file.

**Key color tokens:**

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#10B981` | Emerald — primary CTA, success states |
| `--secondary` | `#06B6D4` | Teal — accents, focus rings |
| `--text` | `#1F2937` | Primary body text |
| `--bg` | `#FFFFFF` | Page and card backgrounds |
| `--bg-light` | `#F9FAFB` | Subtle fills, table headers |
| `--error` | `#EF4444` | Validation errors, danger states |
| `--warning` | `#FBBF24` | Warning states |

**Responsive breakpoints** (`src/styles/responsive.css`):

| Breakpoint | Layout change |
|------------|--------------|
| `≤900px` | Stat grid collapses from 4 → 2 columns |
| `≤768px` | Sidebar hidden → mobile bottom nav; header compacts to 56px |
| `≤600px` | Typography scales down; modals go full-width |
| `≤480px` | All multi-column form grids → single column |

---

## Known Limitations

| Limitation | Detail |
|------------|--------|
| No backend | All data is in-memory + localStorage only |
| No real authentication | User is always "Sam Miller (SM)" — hardcoded |
| Data is browser-local | Clearing browser data or using a different browser loses all changes |
| Fixed reference date | `TODAY` is pinned to `2026-06-11` in `src/store/helpers.js` |
| Photo/document uploads | Dropzones are visual placeholders — no files are stored |
| Email/SMS notifications | Toggle switches in Settings are decorative (no real sends) |
| Export files | PDF/CSV export buttons show a spinner and a toast; no real file is generated |
| ngrok URL changes | Free-tier ngrok generates a new URL each session |

---

## Troubleshooting

**The dashboard is empty / data is missing**
All data lives in localStorage. If `stoop_data_v1` is absent the app re-seeds automatically. If it still looks empty, open DevTools → Application → Local Storage → delete `stoop_data_v1` and refresh.

**Dates and "days until" values look wrong**
The prototype uses a fixed reference date (`2026-06-11`) so relative dates are always consistent regardless of when you open the app. This is intentional — see `TODAY` in `src/store/helpers.js`.

**ngrok shows a different public URL every session**
The free ngrok tier assigns a random subdomain each time. Use a paid ngrok plan or `--domain` flag for a persistent URL.

**The app lands on the landing page instead of where I left off**
The last active view is stored in `stoop_nav_v1`. If that key is missing or the stored view name no longer exists, the app falls back to `landing`. Run `localStorage.removeItem('stoop_nav_v1')` in the console to reset navigation state.

**A modal doesn't close when I press Escape**
Confirm the modal's `onClose` prop is wired up. `Modal` handles the Escape key internally but delegates the close action to the caller.

---

## Browser Compatibility

| Browser | Minimum version |
|---------|----------------|
| Chrome / Edge | 110+ |
| Firefox | 115+ |
| Safari (macOS) | 16+ |
| iOS Safari | 16+ |
| Chrome Mobile (Android) | 110+ |

The prototype uses standard CSS custom properties, CSS Grid, and React 18. No polyfills are included.

---

## Accessibility

Built to WCAG 2.1 AA:

- **Focus management** — modals trap Tab focus and return focus on close; skip-to-main-content link visible on keyboard; Escape key closes any open modal
- **ARIA** — `role="dialog"` + `aria-modal="true"` + `aria-labelledby` on modals; `aria-current="page"` on nav items; `aria-expanded` on FAQ accordion; `aria-pressed` on segmented controls and toggles; `aria-label` on all icon-only buttons
- **Landmarks** — `<header>`, `<main id="main-content">`, `<aside aria-label="Main navigation">`, `<nav aria-label="Main navigation">` on mobile drawer and bottom nav
- **Form labels** — every `<Field>` auto-generates an `id` via React `useId()` and links it to its `<label>` via `htmlFor`; errors use `role="alert"`
- **Focus indicators** — 3px cyan outline on all interactive elements via `:focus-visible`; inputs show a teal border + box-shadow on keyboard focus
- **Touch targets** — icon buttons enforce `min-width: 44px; min-height: 44px`
- **Color contrast** — all text meets 4.5:1 AA ratio; badge text uses high-contrast token values
- **Screen reader announcements** — toast notifications use `role="status"` + `aria-live="polite"` + `aria-atomic="true"`; stepper uses `aria-current="step"`

---

## License

Prototype — not for production use. See [LICENSE](LICENSE) for details.

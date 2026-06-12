# Stoop App — CLAUDE.md

## Project Overview

**Stoop** is a property management prototype for DIY landlords. It is a **frontend-only SPA** — no backend, no API calls. All state lives in memory + `localStorage`. The goal is a production-quality prototype suitable for investor and user testing, tunnelable via ngrok.

**Working directory:** `C:\Users\LMPH\Desktop\Property-Manager\stoop-app`  
**Design reference files:** `C:\Users\LMPH\Desktop\Property-Manager\handoff-to-claude-code-files\Stoop\design_handoff_stoop\design_reference\`

## Tech Stack

- React 18 + Vite 5 + vanilla CSS (no Tailwind, no component libraries)
- `npm run dev` → localhost:5173
- `npm run build` → `dist/`

## Directory Structure

```
src/
  components/     # Reusable UI components (Button, Modal, Input, etc.)
  screens/        # Full-page screens (Landing, Dashboard, Tenants, etc.)
  store/          # State: data.jsx (seed + schema), store.jsx, navigation.jsx, hooks.js
  utils/          # formatters.js, validators.js
  styles/         # tokens.css, reset.css, base.css, responsive.css, index.css
  App.jsx         # Navigation switch (root component)
  main.jsx        # Entry point
```

## CSS Architecture

All styles are in `src/styles/`. **Never use inline styles or external CSS libraries.** Use CSS custom properties (design tokens) defined in `tokens.css`.

- `tokens.css` — all `--var` definitions (colors, spacing, radii, shadows, breakpoints)
- `reset.css` — browser normalization
- `base.css` — component and utility classes (`.btn`, `.card`, `.badge`, `.input`, `.app-shell`, `.sidebar`, `.modal`, `.toast`, etc.)
- `responsive.css` — `@media` breakpoints (900/768/600/480px)
- `index.css` — imports all four (do not import CSS elsewhere)

When building components, always reference existing class names from `base.css` and variables from `tokens.css`. Do not duplicate or approximate token values.

## State & Persistence

- `localStorage` keys: `stoop_data_v1` (main data), `stoop_nav_v1` (current view)
- `useAppState()` hook (in `src/store/hooks.js`) for all data access
- `useNavigation()` hook for view switching
- On every store mutation: persist to localStorage
- Never use external state libraries (no Redux, no Zustand)

## Data Model

```
Property  { id, name, address, units }
Tenant    { id, propertyId, unit, name, email, phone, emergency, moveIn, leaseStart, leaseEnd, rent, status }
Payment   { id, tenantId, dueDate, amount, status, paidDate, daysOverdue, lateFee }
MaintenanceRequest { id, propertyId, tenantId, title, description, status, priority, reported, completed, estCost, actualCost, notes }
```

Seed data: 3 properties, 6 tenants (5 active / 1 inactive), ~20 payments, 6 maintenance requests. Fixed "today" = `2026-06-11` in seed data.

Demo user: `{ name: "Sam Miller", initials: "SM" }`

## Navigation

State-based (no URL routing). Views: `landing`, `onboarding`, `dashboard`, `tenants`, `rent`, `leases`, `maintenance`, `settings`, `feedback`. `App.jsx` switches on `currentView`.

## 16-Phase Build Plan

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Project setup, CSS tokens, directory scaffold | ✅ Done |
| 2 | Core components + icon system + AppShell | ⬜ |
| 3 | State management + seed data + localStorage | ⬜ |
| 4 | Navigation state machine | ⬜ |
| 5 | Landing page (8 sections) | ⬜ |
| 6 | Onboarding wizard (3 steps) | ⬜ |
| 7 | Dashboard screen | ⬜ |
| 8 | Tenants screen (CRUD + modal tabs) | ⬜ |
| 9 | Rent screen (mark-paid, overdue) | ⬜ |
| 10 | Leases screen (renewals, urgency) | ⬜ |
| 11 | Maintenance screen (kanban) | ⬜ |
| 12 | Settings + Feedback screens | ⬜ |
| 13 | Modal system + Toast system + form validation | ⬜ |
| 14 | Responsive design (all breakpoints) | ⬜ |
| 15 | QA, accessibility (WCAG AA), Lighthouse ≥90 | ⬜ |
| 16 | Deployment + documentation | ⬜ |

Full phase specifications are in `DEVELOPMENT_PLAN.md`.

## Key Conventions

- **No backend calls** — everything is local state + localStorage
- **Design tokens are sacred** — copy exact values from `tokens.css`; never approximate
- **No external component libraries** — vanilla CSS classes only
- **No URL routing** — navigation is state-based via `useNavigation()`
- **Breakpoints:** 900px (landing 2-col → 1-col), 768px (sidebar → bottom-nav), 600px, 480px
- **Responsive modals:** centered on desktop, bottom-sheet on mobile (≤768px)
- **Toast auto-dismiss:** 3 seconds
- **Form validation:** inline errors on blur, disable submit while invalid

## Commands

```bash
npm run dev       # Start dev server on localhost:5173
npm run build     # Production bundle → dist/
npm run preview   # Preview production build locally
```

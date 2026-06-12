import { useState } from 'react'
import Icon from './Icon.jsx'

export const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'home' },
  { id: 'tenants',     label: 'Tenants',     icon: 'users' },
  { id: 'rent',        label: 'Rent',        icon: 'dollar' },
  { id: 'leases',      label: 'Leases',      icon: 'calendar' },
  { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
]

export const SECONDARY_NAV = [
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'feedback', label: 'Feedback', icon: 'message' },
]

function Sidebar({ view, go }) {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      {NAV_ITEMS.map((n) => (
        <button key={n.id} className={`nav-item${view === n.id ? ' active' : ''}`} onClick={() => go(n.id)} aria-current={view === n.id ? 'page' : undefined}>
          <Icon name={n.icon} size={20} /> {n.label}
        </button>
      ))}
      <div className="nav-divider" />
      {SECONDARY_NAV.map((n) => (
        <button key={n.id} className={`nav-item${view === n.id ? ' active' : ''}`} onClick={() => go(n.id)} aria-current={view === n.id ? 'page' : undefined}>
          <Icon name={n.icon} size={20} /> {n.label}
        </button>
      ))}
      <button className="nav-item" onClick={() => go('landing')}>
        <Icon name="logout" size={20} /> Exit Demo
      </button>
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
          <div className="row gap-sm" style={{ fontWeight: 700, fontSize: 13 }}>
            <Icon name="shield" size={15} style={{ color: 'var(--secondary-dark)' }} /> Demo mode
          </div>
          <p className="xsmall muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
            Your data is stored locally on this device only.
          </p>
        </div>
      </div>
    </aside>
  )
}

function MobileDrawer({ open, onClose, view, go }) {
  if (!open) return null
  return (
    <div
      className="modal-backdrop"
      style={{ alignItems: 'stretch', justifyContent: 'flex-start', padding: 0 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <nav
        aria-label="Main navigation"
        style={{
          width: 280, maxWidth: '82vw', background: '#fff', height: '100%',
          padding: 16, boxShadow: 'var(--sh-lg)', display: 'flex',
          flexDirection: 'column', gap: 4, animation: 'fade .2s',
        }}
      >
        <div className="row between" style={{ padding: '6px 8px 14px' }}>
          <div className="brand" style={{ fontSize: 17 }}>
            <span className="brand-mark" style={{ width: 28, height: 28 }}>
              <Icon name="doorOpen" size={17} />
            </span>
            Stoop
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close menu">
            <Icon name="x" size={22} />
          </button>
        </div>
        {NAV_ITEMS.concat(SECONDARY_NAV).map((n) => (
          <button
            key={n.id}
            className={`nav-item${view === n.id ? ' active' : ''}`}
            aria-current={view === n.id ? 'page' : undefined}
            onClick={() => { go(n.id); onClose() }}
          >
            <Icon name={n.icon} size={20} /> {n.label}
          </button>
        ))}
        <div className="nav-divider" />
        <button className="nav-item" onClick={() => { go('landing'); onClose() }}>
          <Icon name="logout" size={20} /> Exit Demo
        </button>
      </nav>
    </div>
  )
}

function MobileBottomNav({ view, go }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((n) => (
        <button key={n.id} className={`mnav${view === n.id ? ' active' : ''}`} onClick={() => go(n.id)} aria-current={view === n.id ? 'page' : undefined}>
          <Icon name={n.icon} size={22} /> {n.label}
        </button>
      ))}
    </nav>
  )
}

export default function AppLayout({ view, go, children }) {
  const [drawer, setDrawer] = useState(false)
  const allNav = NAV_ITEMS.concat(SECONDARY_NAV)
  const title = (allNav.find((n) => n.id === view) || {}).label || ''

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="app-header">
        <div className="row gap-md">
          <button className="btn-icon hamburger" onClick={() => setDrawer(true)} aria-label="Open navigation menu">
            <Icon name="menu" size={24} />
          </button>
          <div className="brand">
            <span className="brand-mark" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <Icon name="doorOpen" size={18} />
            </span>
            <span className="hide-mobile">Stoop</span>
          </div>
          <span className="hide-desktop" style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
        </div>
        <div className="row gap-md">
          <button className="btn-icon hide-mobile" aria-label="Notifications">
            <Icon name="bell" size={22} />
          </button>
          <div className="avatar" title="Sam Miller (you)" aria-label="Sam Miller">SM</div>
        </div>
      </header>
      <div className="app-body">
        <Sidebar view={view} go={go} />
        <main className="main-content" id="main-content" tabIndex={-1}>{children}</main>
      </div>
      <MobileBottomNav view={view} go={go} />
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} view={view} go={go} />
    </div>
  )
}

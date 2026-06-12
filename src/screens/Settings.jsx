import { useState } from 'react'
import { Icon, Button } from '../components/index.js'
import { useStore } from '../store/index.js'

function Toggle({ defaultOn, label }) {
  const [on, setOn] = useState(!!defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      aria-pressed={on}
      aria-label={`${label}: ${on ? 'on' : 'off'}`}
      style={{
        width: 50, height: 30, borderRadius: 999, position: 'relative',
        background: on ? 'var(--primary)' : 'var(--border-strong)',
        transition: 'background .2s', flex: 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 24, height: 24, borderRadius: '50%',
        background: '#fff', boxShadow: 'var(--sh-sm)',
        transition: 'left .2s',
      }} />
    </button>
  )
}

export default function Settings({ toast }) {
  const { reset } = useStore()
  const [exporting, setExporting] = useState(false)

  const doExport = () => {
    setExporting(true)
    setTimeout(() => { setExporting(false); toast('Report exported (demo)') }, 1200)
  }

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Manage your export, data, and preferences.</p>
      </div>

      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Export for CPA */}
        <div className="card" style={{ padding: 24 }}>
          <div className="row gap-md" style={{ alignItems: 'flex-start' }}>
            <span style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--success-bg)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <Icon name="receipt" size={22} />
            </span>
            <div className="grow">
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Export for CPA</h3>
              <p className="small muted mt-8">A clean, tax-ready report — tenant list, rent summary, lease status and expenses, pre-categorized. Your accountant will thank you.</p>
              <div className="row gap-md mt-16 wrap">
                <Button icon="download" onClick={doExport} disabled={exporting}>
                  {exporting ? 'Preparing…' : 'Export PDF'}
                </Button>
                <Button variant="outline" icon="fileText" onClick={doExport} disabled={exporting}>
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Notifications</h3>
          <div className="mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Rent due reminders', true],
              ['Lease renewal alerts (60 days)', true],
              ['New maintenance requests', false],
            ].map(([label, on]) => (
              <div key={label} className="row between" style={{ cursor: 'default' }}>
                <span className="small" style={{ fontWeight: 500 }}>{label}</span>
                <Toggle defaultOn={on} label={label} />
              </div>
            ))}
          </div>
        </div>

        {/* Demo data */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Demo data</h3>
          <p className="small muted mt-8">This prototype stores everything locally in your browser. Reset to reload the original demo data across 6 tenants (5 active) and 3 properties.</p>
          <Button variant="outline" className="mt-16" icon="spinner" onClick={() => { reset(); toast('Demo data reset') }}>
            Reset demo data
          </Button>
        </div>

      </div>
    </div>
  )
}

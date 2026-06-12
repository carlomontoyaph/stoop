import { useState } from 'react'
import { Icon, Button, Modal, StatusBadge, Confirm } from '../components/index.js'
import { useStore, propById, daysUntil, fmtDate, fmtMoney, leaseState, initials } from '../store/index.js'

const urgencyStyle = (days) =>
  days < 0   ? { bg: 'var(--bg-light)',   c: 'var(--text-secondary)' } :
  days <= 30 ? { bg: 'var(--error-bg)',   c: 'var(--error)' }          :
  days <= 60 ? { bg: 'var(--warning-bg)', c: '#B45309' }               :
               { bg: 'var(--success-bg)', c: 'var(--primary-dark)' }

function LeaseDetail({ tenant, onClose, toast }) {
  const { data, update } = useStore()
  const [confirming, setConfirming] = useState(false)
  const prop = propById(data, tenant.propertyId)
  const days = daysUntil(tenant.leaseEnd)
  const u = urgencyStyle(days)

  return (
    <>
    <Modal
      title={`Lease · ${tenant.name}`}
      onClose={onClose}
      badge={<StatusBadge status={leaseState(tenant.leaseEnd)} />}
      footer={
        <>
          <Button variant="danger" onClick={() => setConfirming(true)}>Mark as ended</Button>
          <Button icon="calendar" onClick={() => { onClose(); toast('Renewal offer sent') }}>Renew lease</Button>
        </>
      }
    >
      {/* Header */}
      <div className="row gap-md mb-24">
        <span className="avatar avatar-lg">{initials(tenant.name)}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{tenant.name}</div>
          <div className="small muted">{prop.name} · {tenant.unit}</div>
        </div>
      </div>

      {/* 3-col detail grid */}
      <div className="form-3col" style={{ marginBottom: 20 }}>
        <div>
          <div className="xsmall" style={{ fontWeight: 700 }}>Start</div>
          <div className="small muted mt-8">{fmtDate(tenant.leaseStart)}</div>
        </div>
        <div>
          <div className="xsmall" style={{ fontWeight: 700 }}>End</div>
          <div className="small muted mt-8">{fmtDate(tenant.leaseEnd)}</div>
        </div>
        <div>
          <div className="xsmall" style={{ fontWeight: 700 }}>Monthly rent</div>
          <div className="small muted mt-8">{fmtMoney(tenant.rent)}</div>
        </div>
      </div>

      {/* Countdown card */}
      <div className="card" style={{ padding: 18, background: u.bg }}>
        <div className="row gap-sm" style={{ fontWeight: 700 }}>
          <Icon name="clock" size={18} style={{ color: u.c }} />
          {days < 0 ? 'Lease has ended' : `${days} days until renewal`}
        </div>
        {days >= 0 && days <= 60 && (
          <p className="small muted mt-8">Renewal window is open. Send an offer now to avoid a vacancy.</p>
        )}
      </div>

      {/* Documents */}
      <div className="mt-24">
        <div className="xsmall" style={{ fontWeight: 700, marginBottom: 10 }}>DOCUMENTS</div>
        {['Signed lease.pdf', 'Renewal addendum.pdf'].map(d => (
          <div key={d} className="row between" style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 10 }}>
            <span className="row gap-sm">
              <Icon name="fileText" size={18} style={{ color: 'var(--secondary-dark)' }} />
              <span className="small" style={{ fontWeight: 500 }}>{d}</span>
            </span>
            <button className="btn-icon" aria-label="Download lease"><Icon name="download" size={18} /></button>
          </div>
        ))}
      </div>
    </Modal>
    {confirming && (
      <Confirm
        title="Mark lease as ended"
        message={`Set ${tenant.name}'s lease to inactive? This will remove them from active rent tracking.`}
        confirmLabel="Mark as ended"
        danger
        onConfirm={() => {
          update(d => ({ ...d, tenants: d.tenants.map(t => t.id === tenant.id ? { ...t, status: 'inactive' } : t) }))
          toast('Lease marked as ended')
          onClose()
        }}
        onClose={() => setConfirming(false)}
      />
    )}
    </>
  )
}

export default function Leases({ toast }) {
  const { data } = useStore()
  const [detail, setDetail] = useState(null)

  const active = data.tenants.filter(t => t.status === 'active')
  const upcoming = active
    .map(t => ({ t, days: daysUntil(t.leaseEnd) }))
    .filter(x => x.days >= 0 && x.days <= 60)
    .sort((a, b) => a.days - b.days)
  const all = [...data.tenants].sort((a, b) => a.leaseEnd.localeCompare(b.leaseEnd))

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Leases</h1>
        <p className="page-sub">Never get surprised by a renewal date again.</p>
      </div>

      {/* Upcoming renewals */}
      <h2 className="section-title">
        Upcoming renewals{' '}
        <span className="muted" style={{ fontWeight: 400, fontSize: 15 }}>· next 60 days</span>
      </h2>

      {upcoming.length === 0 ? (
        <div className="card empty mb-24">
          <div className="empty-icon"><Icon name="checkCircle" size={26} /></div>
          No renewals in the next 60 days. You're ahead of it.
        </div>
      ) : (
        <div className="mb-24" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {upcoming.map(({ t, days }) => {
            const u = urgencyStyle(days)
            return (
              <div key={t.id} className="card" style={{ padding: 18, borderLeft: `4px solid ${u.c}` }}>
                <div className="row between" style={{ alignItems: 'flex-start' }}>
                  <div className="row gap-sm">
                    <span className="avatar avatar-sm">{initials(t.name)}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <div className="xsmall muted">{propById(data, t.propertyId).name}</div>
                    </div>
                  </div>
                  <span className="badge" style={{ background: u.bg, color: u.c }}>{days} days</span>
                </div>
                <div className="row between mt-16" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <span className="xsmall muted">Ends {fmtDate(t.leaseEnd)}</span>
                  <Button variant="ghost" size="xs" onClick={() => setDetail(t)}>Review →</Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* All leases */}
      <h2 className="section-title">All leases</h2>

      <div className="tbl-wrap desktop-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Property</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {all.map(t => {
              const d = daysUntil(t.leaseEnd)
              const status = t.status === 'inactive' ? 'expired' : leaseState(t.leaseEnd)
              const btnLabel = d <= 60 && d >= 0 ? 'Renew' : 'View'
              return (
                <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setDetail(t)}>
                  <td>
                    <div className="row gap-sm">
                      <span className="avatar avatar-sm">{initials(t.name)}</span>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{t.name}</span>
                    </div>
                  </td>
                  <td className="muted">{propById(data, t.propertyId).name}</td>
                  <td className="muted">{fmtDate(t.leaseStart)}</td>
                  <td className="muted">{fmtDate(t.leaseEnd)}</td>
                  <td><StatusBadge status={status} /></td>
                  <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <Button variant="outline" size="xs" onClick={() => setDetail(t)}>{btnLabel}</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mobile-cards" style={{ flexDirection: 'column', gap: 12 }}>
        {all.map(t => {
          const status = t.status === 'inactive' ? 'expired' : leaseState(t.leaseEnd)
          return (
            <div key={t.id} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setDetail(t)}>
              <div className="row between">
                <div className="row gap-sm">
                  <span className="avatar avatar-sm">{initials(t.name)}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div className="xsmall muted">{propById(data, t.propertyId).name}</div>
                  </div>
                </div>
                <StatusBadge status={status} />
              </div>
              <div className="row between mt-16" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <span className="xsmall muted">{fmtDate(t.leaseStart)} – {fmtDate(t.leaseEnd)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {detail && <LeaseDetail tenant={detail} onClose={() => setDetail(null)} toast={toast} />}
    </div>
  )
}

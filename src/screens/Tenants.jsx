import { useState } from 'react'
import { Icon, Button, Modal, Field, StatusBadge } from '../components/index.js'
import { useStore, propById, daysUntil, fmtDate, fmtMoney, leaseState, initials } from '../store/index.js'
import { formatPhone } from '../utils/formatPhone.js'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

function TenantDetail({ tenant, onClose }) {
  const { data } = useStore()
  const [tab, setTab] = useState('info')
  const prop = propById(data, tenant.propertyId)
  const pays = data.payments
    .filter(p => p.tenantId === tenant.id && p.status !== 'due')
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
  const days = daysUntil(tenant.leaseEnd)
  const balance = data.payments
    .filter(p => p.tenantId === tenant.id && p.status === 'late')
    .reduce((s, p) => s + p.amount + (p.lateFee || 0), 0)

  const InfoRow = ({ label, value }) => (
    <div>
      <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text)' }}>{label}</div>
      <div className="small muted" style={{ marginTop: 2 }}>{value}</div>
    </div>
  )

  const TABS = [['info', 'Basic Info'], ['payments', 'Payments'], ['lease', 'Lease'], ['docs', 'Documents']]

  return (
    <Modal
      title={tenant.name}
      onClose={onClose}
      wide
      badge={<StatusBadge status={tenant.status} />}
      footer={
        <>
          <Button variant="outline" icon="download">Export tenant</Button>
          <Button variant="primary" icon="edit">Edit</Button>
        </>
      }
    >
      {/* Header row */}
      <div className="row gap-md mb-24" style={{ alignItems: 'center' }}>
        <span className="avatar avatar-lg">{initials(tenant.name)}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{tenant.name}</div>
          <div className="small muted">{prop.name} · {tenant.unit}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div className="xsmall muted">Balance due</div>
          <div style={{ fontWeight: 700, fontSize: 20, color: balance > 0 ? 'var(--error)' : 'var(--primary-dark)' }}>
            {fmtMoney(balance)}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="row gap-sm mb-24" style={{ borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '10px 4px', marginRight: 18, fontSize: 14, fontWeight: 600,
            color: tab === id ? 'var(--text)' : 'var(--text-secondary)',
            borderBottom: `2px solid ${tab === id ? 'var(--secondary)' : 'transparent'}`,
            marginBottom: -1, whiteSpace: 'nowrap',
          }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="form-2col" style={{ gap: 20 }}>
          <InfoRow label="Email" value={tenant.email} />
          <InfoRow label="Phone" value={tenant.phone} />
          <InfoRow label="Move-in date" value={fmtDate(tenant.moveIn)} />
          <InfoRow label="Monthly rent" value={fmtMoney(tenant.rent)} />
          <InfoRow label="Property" value={`${prop.name} · ${tenant.unit}`} />
          <InfoRow label="Emergency contact" value={tenant.emergency} />
        </div>
      )}

      {tab === 'payments' && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Due date</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {pays.map(p => (
                <tr key={p.id}>
                  <td>{fmtDate(p.dueDate)}</td>
                  <td style={{ fontWeight: 600 }}>
                    {fmtMoney(p.amount)}
                    {p.lateFee ? <span className="xsmall muted"> +{fmtMoney(p.lateFee)} fee</span> : null}
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" aria-label="Download receipt"><Icon name="download" size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'lease' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            <InfoRow label="Start" value={fmtDate(tenant.leaseStart)} />
            <InfoRow label="End" value={fmtDate(tenant.leaseEnd)} />
            <InfoRow label="Status" value={<StatusBadge status={leaseState(tenant.leaseEnd)} />} />
          </div>
          <div className="card" style={{
            padding: 18,
            background: days <= 30 && days >= 0 ? 'var(--error-bg)' : days <= 60 && days >= 0 ? 'var(--warning-bg)' : 'var(--bg-light)',
          }}>
            <div className="row gap-sm">
              <Icon name="clock" size={18} style={{ color: days < 0 ? 'var(--text-secondary)' : days <= 30 ? 'var(--error)' : 'var(--warning-text)' }} />
              <strong>{days < 0 ? 'Lease ended' : `${days} days until renewal`}</strong>
            </div>
            {days >= 0 && days <= 30 && (
              <p className="small muted mt-8">This lease ends soon. Consider sending a renewal offer.</p>
            )}
          </div>
          {days >= 0 && days <= 30 && (
            <Button className="mt-16" icon="calendar">Send renewal offer</Button>
          )}
        </div>
      )}

      {tab === 'docs' && (
        <div>
          {['Signed lease.pdf', 'Move-in checklist.pdf', 'ID verification.jpg'].map(d => (
            <div key={d} className="row between" style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 10 }}>
              <span className="row gap-sm">
                <Icon name="fileText" size={18} style={{ color: 'var(--secondary-dark)' }} />
                <span className="small" style={{ fontWeight: 500 }}>{d}</span>
              </span>
              <button className="btn-icon" aria-label="Download"><Icon name="download" size={18} /></button>
            </div>
          ))}
          <div style={{ border: '1.5px dashed var(--border-strong)', borderRadius: 10, padding: 24, textAlign: 'center', color: 'var(--text-secondary)', marginTop: 6 }}>
            <Icon name="upload" size={24} />
            <div className="small" style={{ marginTop: 8 }}>Drag files here or click to upload</div>
          </div>
        </div>
      )}
    </Modal>
  )
}

function AddTenantModal({ onClose }) {
  const { data, update } = useStore()
  const [f, setF] = useState({
    name: '', email: '', phone: '',
    propertyId: data.properties[0].id, unit: '',
    rent: '', leaseStart: '', leaseEnd: '',
  })
  const [errs, setErrs] = useState({})

  const submit = () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Name is required.'
    if (!f.email.trim()) e.email = 'Email is required.'
    else if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email.'
    setErrs(e)
    if (Object.keys(e).length) return
    const id = 't' + Date.now()
    update(d => ({ ...d, tenants: [...d.tenants, { ...f, id, rent: Number(f.rent) || 0, status: 'active', moveIn: f.leaseStart, emergency: '—' }] }))
    onClose(true)
  }

  return (
    <Modal
      title="Add tenant"
      onClose={() => onClose(false)}
      footer={
        <>
          <Button variant="outline" onClick={() => onClose(false)}>Cancel</Button>
          <Button onClick={submit}>Add tenant</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Full name" error={errs.name}>
          <input className={`input${errs.name ? ' has-error' : ''}`} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. Jordan Lee" />
        </Field>
        <div className="form-2col">
          <Field label="Email" error={errs.email}>
            <input className={`input${errs.email ? ' has-error' : ''}`} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="name@email.com" />
          </Field>
          <Field label="Phone" hint="Optional">
            <input className="input" type="tel" inputMode="tel" value={f.phone} onChange={e => setF({ ...f, phone: formatPhone(e.target.value) })} placeholder="(555) 555-1234" />
          </Field>
        </div>
        <div className="form-2col">
          <Field label="Property">
            <select className="select" value={f.propertyId} onChange={e => setF({ ...f, propertyId: e.target.value })}>
              {data.properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Unit" hint="Optional">
            <input className="input" value={f.unit} onChange={e => setF({ ...f, unit: e.target.value })} placeholder="Unit A" />
          </Field>
        </div>
        <div className="form-3col">
          <Field label="Lease start">
            <input className="input" type="date" value={f.leaseStart} onChange={e => setF({ ...f, leaseStart: e.target.value })} />
          </Field>
          <Field label="Lease end">
            <input className="input" type="date" value={f.leaseEnd} onChange={e => setF({ ...f, leaseEnd: e.target.value })} />
          </Field>
          <Field label="Monthly rent">
            <input className="input" type="number" value={f.rent} onChange={e => setF({ ...f, rent: e.target.value })} placeholder="1500" />
          </Field>
        </div>
      </div>
    </Modal>
  )
}

export default function Tenants({ toast }) {
  const { data } = useStore()
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState(null)
  const [adding, setAdding] = useState(false)
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })

  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })

  const sortVal = (t, key) => {
    if (key === 'name')     return t.name.toLowerCase()
    if (key === 'property') return (propById(data, t.propertyId).name + t.unit).toLowerCase()
    if (key === 'rent')     return t.rent
    if (key === 'leaseEnd') return t.leaseEnd
    if (key === 'status')   return t.status
    return ''
  }

  const filtered = data.tenants.filter(t => {
    const s = q.toLowerCase()
    return !s || t.name.toLowerCase().includes(s) || t.email.toLowerCase().includes(s) || t.phone.includes(s)
  })

  const list = [...filtered].sort((a, b) => {
    const va = sortVal(a, sort.key), vb = sortVal(b, sort.key)
    const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
    return sort.dir === 'asc' ? cmp : -cmp
  })

  const SortTh = ({ label, sortKey }) => {
    const active = sort.key === sortKey
    return (
      <th>
        <button onClick={() => toggleSort(sortKey)} className="sort-th"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'inherit', color: active ? 'var(--text)' : 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}
          aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
          {label}
          <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 0, color: active ? 'var(--secondary-dark)' : 'var(--text-tertiary)' }}>
            <Icon name="chevronDown" size={11} style={{ transform: 'rotate(180deg)', opacity: active && sort.dir === 'asc' ? 1 : active ? 0.25 : 0.55, marginBottom: -3 }} />
            <Icon name="chevronDown" size={11} style={{ opacity: active && sort.dir === 'desc' ? 1 : active ? 0.25 : 0.55 }} />
          </span>
        </button>
      </th>
    )
  }

  return (
    <div>
      <div className="page-head row between wrap gap-md">
        <div>
          <h1 className="page-title">Tenants</h1>
          <p className="page-sub">Showing {list.length} of {data.tenants.length} tenants</p>
        </div>
      </div>

      <div className="row between wrap gap-md mb-16">
        <div className="input-icon-wrap" style={{ flex: 1, maxWidth: 340, minWidth: 200 }}>
          <Icon name="search" size={18} />
          <input className="input" placeholder="Search by name, email, phone…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <Button icon="plus" onClick={() => setAdding(true)}>Add tenant</Button>
      </div>

      {/* Desktop table */}
      <div className="tbl-wrap desktop-table">
        <table className="tbl">
          <thead>
            <tr>
              <SortTh label="Name" sortKey="name" />
              <SortTh label="Property" sortKey="property" />
              <SortTh label="Rent" sortKey="rent" />
              <SortTh label="Lease ends" sortKey="leaseEnd" />
              <SortTh label="Status" sortKey="status" />
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => {
              const prop = propById(data, t.propertyId)
              return (
                <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setDetail(t)}>
                  <td>
                    <div className="row gap-sm">
                      <span className="avatar avatar-sm">{initials(t.name)}</span>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{t.name}</span>
                    </div>
                  </td>
                  <td className="muted">{prop.name}<span className="xsmall"> · {t.unit}</span></td>
                  <td style={{ fontWeight: 600 }}>{fmtMoney(t.rent)}</td>
                  <td className="muted">{fmtDate(t.leaseEnd)}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <div className="row gap-sm" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn-icon" aria-label="View tenant" onClick={() => setDetail(t)}><Icon name="eye" size={18} /></button>
                      <button className="btn-icon" aria-label="Edit tenant"><Icon name="edit" size={18} /></button>
                      <button className="btn-icon" aria-label="More actions"><Icon name="more" size={18} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mobile-cards" style={{ flexDirection: 'column', gap: 12 }}>
        <div className="row gap-sm" style={{ marginBottom: 4 }}>
          <select className="select" value={sort.key} onChange={e => setSort(s => ({ ...s, key: e.target.value }))} style={{ flex: 1, height: 40 }} aria-label="Sort by">
            <option value="name">Sort: Name</option>
            <option value="property">Sort: Property</option>
            <option value="rent">Sort: Rent</option>
            <option value="leaseEnd">Sort: Lease ends</option>
            <option value="status">Sort: Status</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={() => setSort(s => ({ ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }))} style={{ height: 40, flex: 'none' }} aria-label="Toggle sort direction">
            <Icon name="chevronDown" size={16} style={{ transform: sort.dir === 'asc' ? 'rotate(180deg)' : 'none' }} /> {sort.dir === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
        {list.map(t => {
          const prop = propById(data, t.propertyId)
          return (
            <div key={t.id} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setDetail(t)}>
              <div className="row between">
                <div className="row gap-sm">
                  <span className="avatar avatar-sm">{initials(t.name)}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div className="xsmall muted">{prop.name} · {t.unit}</div>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="row between mt-16" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <span className="xsmall muted">Rent <strong style={{ color: 'var(--text)' }}>{fmtMoney(t.rent)}</strong></span>
                <span className="xsmall muted">Ends {fmtDate(t.leaseEnd)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {list.length === 0 && (
        <div className="card empty">
          <div className="empty-icon"><Icon name="users" size={26} /></div>
          No tenants match "{q}". Try a different search.
        </div>
      )}

      {detail && <TenantDetail tenant={detail} onClose={() => setDetail(null)} />}
      {adding && <AddTenantModal onClose={(ok) => { setAdding(false); if (ok) toast('Tenant added') }} />}
    </div>
  )
}

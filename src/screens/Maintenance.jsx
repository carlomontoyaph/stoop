import { useState, useRef } from 'react'
import { Icon, Button, Modal, Field, StatCard, PriorityTag, Confirm } from '../components/index.js'
import { useStore, tenantById, propById, fmtDate, fmtDateShort, fmtMoney, parseDate, TODAY } from '../store/index.js'
import { PRIORITY } from '../components/PriorityTag.jsx'

const MAINT_COLS = [
  { id: 'reported',    label: 'Reported' },
  { id: 'assigned',    label: 'Assigned' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed',   label: 'Completed' },
]

function MaintCard({ m, onClick, draggable, onDragStart }) {
  const { data } = useStore()
  const t = tenantById(data, m.tenantId)
  const costVal = m.actualCost
    ? fmtMoney(m.actualCost)
    : m.estCost ? `~${fmtMoney(m.estCost)}` : ''
  return (
    <div
      className="card"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      style={{ padding: 14, marginBottom: 12, cursor: 'pointer', borderLeft: `3px solid ${PRIORITY[m.priority]?.color ?? '#ccc'}` }}
    >
      <div className="row between" style={{ alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.35 }}>{m.title}</span>
        <PriorityTag level={m.priority} dotOnly />
      </div>
      <div className="xsmall muted mt-8">{t ? t.name : '—'} · {propById(data, m.propertyId)?.name}</div>
      <div className="row between" style={{ marginTop: 10 }}>
        <span className="xsmall muted">{fmtDateShort(m.reported)}</span>
        <span className="xsmall" style={{ fontWeight: 600, color: m.actualCost ? 'var(--primary-dark)' : 'var(--text-secondary)' }}>
          {costVal}
        </span>
      </div>
    </div>
  )
}

function MaintDetail({ m, onClose, toast }) {
  const { data, update } = useStore()
  const t = tenantById(data, m.tenantId)
  const [confirming, setConfirming] = useState(false)

  const setStatus = (status) => {
    update(d => ({
      ...d,
      maintenance: d.maintenance.map(x =>
        x.id === m.id
          ? { ...x, status, completed: status === 'completed' ? TODAY.toISOString().slice(0, 10) : x.completed }
          : x
      ),
    }))
    toast('Status updated')
    onClose()
  }

  return (
    <>
    <Modal
      title={m.title}
      onClose={onClose}
      wide
      badge={<PriorityTag level={m.priority} />}
      footer={
        <>
          <Button variant="danger" icon="trash" onClick={() => setConfirming(true)}>Delete</Button>
          <Button icon="check" onClick={() => setStatus('completed')}>Mark complete</Button>
        </>
      }
    >
      <div className="md-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Left column */}
        <div>
          <div className="xsmall" style={{ fontWeight: 700 }}>DESCRIPTION</div>
          <p className="small muted mt-8" style={{ lineHeight: 1.6 }}>{m.description}</p>

          {m.notes && (
            <>
              <div className="xsmall mt-24" style={{ fontWeight: 700 }}>NOTES</div>
              <div className="card mt-8" style={{ padding: 14, background: 'var(--bg-light)' }}>
                <p className="small" style={{ lineHeight: 1.6 }}>{m.notes}</p>
              </div>
            </>
          )}

          <div className="xsmall mt-24" style={{ fontWeight: 700, marginBottom: 10 }}>PHOTOS</div>
          <div className="row gap-md wrap">
            {[0, 1].map(i => (
              <div key={i} style={{ width: 88, height: 88, borderRadius: 10, background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                <Icon name="camera" size={22} />
              </div>
            ))}
            <div style={{ width: 88, height: 88, borderRadius: 10, border: '1.5px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <Icon name="upload" size={18} />
              <span className="xsmall">Add</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="xsmall" style={{ fontWeight: 700 }}>Property</div>
            <div className="small muted mt-8">{propById(data, m.propertyId)?.name}</div>
          </div>
          <div>
            <div className="xsmall" style={{ fontWeight: 700 }}>Reported by</div>
            <div className="small muted mt-8">{t ? t.name : '—'}</div>
          </div>
          <Field label="Status">
            <select className="select" value={m.status} onChange={e => setStatus(e.target.value)}>
              {MAINT_COLS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Field>
          <div className="form-2col" style={{ gap: 12 }}>
            <div>
              <div className="xsmall" style={{ fontWeight: 700 }}>Reported</div>
              <div className="small muted mt-8">{fmtDate(m.reported)}</div>
            </div>
            <div>
              <div className="xsmall" style={{ fontWeight: 700 }}>Completed</div>
              <div className="small muted mt-8">{fmtDate(m.completed)}</div>
            </div>
          </div>
          <div className="form-2col" style={{ gap: 12 }}>
            <Field label="Est. cost">
              <input className="input" defaultValue={m.estCost || ''} placeholder="—" type="number" />
            </Field>
            <Field label="Actual cost">
              <input className="input" defaultValue={m.actualCost || ''} placeholder="—" type="number" />
            </Field>
          </div>
        </div>
      </div>
    </Modal>
    {confirming && (
      <Confirm
        title="Delete request"
        message={`Delete "${m.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          update(d => ({ ...d, maintenance: d.maintenance.filter(x => x.id !== m.id) }))
          toast('Request deleted')
          onClose()
        }}
        onClose={() => setConfirming(false)}
      />
    )}
    </>
  )
}

function AddMaintModal({ onClose }) {
  const { data, update } = useStore()
  const [f, setF] = useState({
    title: '', description: '',
    propertyId: data.properties[0].id, tenantId: '',
    priority: 'medium', estCost: '',
  })
  const [err, setErr] = useState('')

  const propTenants = data.tenants.filter(t => t.propertyId === f.propertyId)

  const submit = () => {
    if (!f.title.trim()) { setErr('A short title is required.'); return }
    update(d => ({
      ...d,
      maintenance: [{
        id: 'm' + Date.now(), ...f,
        estCost: Number(f.estCost) || null, actualCost: null,
        status: 'reported', reported: TODAY.toISOString().slice(0, 10),
        completed: null, notes: '',
      }, ...d.maintenance],
    }))
    onClose(true)
  }

  return (
    <Modal
      title="New maintenance request"
      onClose={() => onClose(false)}
      footer={
        <>
          <Button variant="outline" onClick={() => onClose(false)}>Cancel</Button>
          <Button onClick={submit}>Create request</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Title" error={err}>
          <input className={`input${err ? ' has-error' : ''}`} value={f.title} onChange={e => { setF({ ...f, title: e.target.value }); setErr('') }} placeholder="e.g. Leaky faucet in kitchen" />
        </Field>
        <Field label="Description">
          <textarea className="textarea" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} placeholder="What's the issue?" />
        </Field>
        <div className="form-2col">
          <Field label="Property">
            <select className="select" value={f.propertyId} onChange={e => setF({ ...f, propertyId: e.target.value, tenantId: '' })}>
              {data.properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Tenant" hint="Optional">
            <select className="select" value={f.tenantId} onChange={e => setF({ ...f, tenantId: e.target.value })}>
              <option value="">—</option>
              {propTenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
        </div>
        <div className="form-2col">
          <Field label="Priority">
            <select className="select" value={f.priority} onChange={e => setF({ ...f, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </Field>
          <Field label="Estimated cost" hint="Optional">
            <input className="input" type="number" value={f.estCost} onChange={e => setF({ ...f, estCost: e.target.value })} placeholder="150" />
          </Field>
        </div>
      </div>
    </Modal>
  )
}

export default function Maintenance({ toast }) {
  const { data, update } = useStore()
  const [detail, setDetail] = useState(null)
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('all')
  const dragId = useRef(null)

  const list = data.maintenance
  const open       = list.filter(m => m.status === 'reported' || m.status === 'assigned').length
  const inProg     = list.filter(m => m.status === 'in-progress').length
  const doneMonth  = list.filter(m =>
    m.status === 'completed' && m.completed &&
    parseDate(m.completed).getMonth() === TODAY.getMonth() &&
    parseDate(m.completed).getFullYear() === TODAY.getFullYear()
  ).length
  const spentMonth = list
    .filter(m => m.completed &&
      parseDate(m.completed).getMonth() === TODAY.getMonth() &&
      parseDate(m.completed).getFullYear() === TODAY.getFullYear()
    )
    .reduce((s, m) => s + (m.actualCost || 0), 0)

  const drop = (colId) => {
    const id = dragId.current
    if (id) update(d => ({ ...d, maintenance: d.maintenance.map(m => m.id === id ? { ...m, status: colId } : m) }))
    dragId.current = null
  }

  const visibleCols = filter === 'all' ? MAINT_COLS : MAINT_COLS.filter(c => c.id === filter)

  return (
    <div>
      <div className="page-head row between wrap gap-md">
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p className="page-sub">Every request in one place — drag a card to update its status.</p>
        </div>
      </div>

      <div className="stat-grid mb-24">
        <StatCard icon="wrench"       label="Open requests"          value={open}               color="var(--info)"          bg="var(--info-bg)" />
        <StatCard icon="clock"        label="In progress"            value={inProg}             color="#B45309"              bg="var(--warning-bg)" />
        <StatCard icon="checkCircle"  label="Completed this month"   value={doneMonth}          color="var(--primary)"       bg="var(--success-bg)" />
        <StatCard icon="dollar"       label="Spent this month"       value={fmtMoney(spentMonth)} color="var(--text-secondary)" bg="var(--bg-light)" />
      </div>

      <div className="row between wrap gap-md mb-16">
        <div className="row gap-sm wrap">
          {[['all', 'All'], ...MAINT_COLS.map(c => [c.id, c.label])].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} className="badge" style={{
              cursor: 'pointer', padding: '7px 14px', fontSize: 13,
              background: filter === v ? 'var(--primary)' : 'var(--bg-light)',
              color: filter === v ? '#fff' : 'var(--text-secondary)',
              border: filter === v ? 'none' : '1px solid var(--border)',
            }}>{l}</button>
          ))}
        </div>
        <Button icon="plus" onClick={() => setAdding(true)}>New request</Button>
      </div>

      {/* Kanban board */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleCols.length}, minmax(260px, 1fr))`, gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
        {visibleCols.map(col => {
          const cards = list.filter(m => m.status === col.id)
          return (
            <div
              key={col.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => drop(col.id)}
              style={{ background: 'var(--bg-light)', borderRadius: 12, padding: 14, minHeight: 120 }}
            >
              <div className="row between mb-16">
                <span style={{ fontWeight: 700, fontSize: 14 }}>{col.label}</span>
                <span className="badge badge-neutral">{cards.length}</span>
              </div>
              {cards.map(m => (
                <MaintCard
                  key={m.id}
                  m={m}
                  draggable
                  onDragStart={() => { dragId.current = m.id }}
                  onClick={() => setDetail(m)}
                />
              ))}
              {cards.length === 0 && (
                <div className="xsmall muted" style={{ textAlign: 'center', padding: '16px 0' }}>Nothing here</div>
              )}
            </div>
          )
        })}
      </div>

      {detail && <MaintDetail m={detail} onClose={() => setDetail(null)} toast={toast} />}
      {adding && <AddMaintModal onClose={(ok) => { setAdding(false); if (ok) toast('Request created') }} />}
    </div>
  )
}

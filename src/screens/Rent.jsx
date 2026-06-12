import { useState } from 'react'
import { Icon, Button, Modal, Field, StatCard, Segmented, StatusBadge } from '../components/index.js'
import { useStore, tenantById, monthPayments, currentMonthStats, fmtDate, fmtMoney, parseDate, TODAY, initials } from '../store/index.js'

function MarkPaidModal({ payment, onClose }) {
  const { data, update } = useStore()
  const t = tenantById(data, payment.tenantId)
  const [amount, setAmount] = useState(payment.amount)
  const [date, setDate] = useState(TODAY.toISOString().slice(0, 10))

  const submit = () => {
    update(d => ({
      ...d,
      payments: d.payments.map(p => p.id === payment.id
        ? { ...p, status: 'paid', paidDate: date, daysOverdue: 0 }
        : p),
    }))
    onClose(true)
  }

  return (
    <Modal
      title="Mark rent paid"
      onClose={() => onClose(false)}
      footer={
        <>
          <Button variant="outline" onClick={() => onClose(false)}>Cancel</Button>
          <Button icon="check" onClick={submit}>Mark paid</Button>
        </>
      }
    >
      <p className="small muted mb-16">
        Recording payment for <strong style={{ color: 'var(--text)' }}>{t?.name}</strong> · due {fmtDate(payment.dueDate)}.
      </p>
      <div className="form-2col" style={{ marginBottom: 16 }}>
        <Field label="Amount received">
          <input className="input" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        </Field>
        <Field label="Date paid">
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </Field>
      </div>
      <Field label="Note" hint="Optional">
        <textarea className="textarea" placeholder="e.g. Paid by check #1042" />
      </Field>
    </Modal>
  )
}

function RentCalendar({ year, month, onPick }) {
  const { data } = useStore()
  const first = new Date(year, month, 1)
  const startDay = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const byDay = {}
  monthPayments(data, year, month).forEach(p => {
    const day = parseDate(p.dueDate).getDate()
    ;(byDay[day] = byDay[day] || []).push(p)
  })

  const statusBg  = { paid: 'var(--success-bg)', late: 'var(--error-bg)', due: 'var(--warning-bg)' }
  const statusDot = { paid: 'var(--primary)',     late: 'var(--error)',    due: 'var(--warning)' }

  return (
    <div className="card" style={{ padding: 16, overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, minWidth: 640 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="xsmall" style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)', padding: '4px 0 8px' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const ev = byDay[d] || []
          const isToday = year === TODAY.getFullYear() && month === TODAY.getMonth() && d === TODAY.getDate()
          return (
            <div key={i} style={{
              minHeight: 92,
              border: `1px solid ${isToday ? 'var(--secondary)' : 'var(--border)'}`,
              borderRadius: 8, padding: 7,
              background: ev[0] ? statusBg[ev[0].status] : '#fff',
            }}>
              <div className="row between">
                <span className="xsmall" style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--secondary-dark)' : 'var(--text-secondary)' }}>{d}</span>
                {isToday && <span className="xsmall" style={{ color: 'var(--secondary-dark)', fontWeight: 700 }}>Today</span>}
              </div>
              {ev.map(p => {
                const t = tenantById(data, p.tenantId)
                return (
                  <button key={p.id} onClick={() => onPick(p)} style={{
                    display: 'block', width: '100%', textAlign: 'left', marginTop: 5,
                    background: '#fff', border: '1px solid var(--border)', borderRadius: 6,
                    padding: '4px 6px', fontSize: 11.5,
                  }}>
                    <span className="row gap-sm" style={{ alignItems: 'center' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusDot[p.status], flex: 'none' }} />
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t?.name.split(' ')[0]}
                      </span>
                    </span>
                    <span className="muted">{fmtMoney(p.amount)}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Rent({ toast }) {
  const { data } = useStore()
  const [tabView, setTabView] = useState('calendar')
  const [ym, setYm] = useState({ y: TODAY.getFullYear(), m: TODAY.getMonth() })
  const [filter, setFilter] = useState('all')
  const [paying, setPaying] = useState(null)

  const stats = currentMonthStats(data)
  const monthName = new Date(ym.y, ym.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const shift = (delta) => setYm(({ y, m }) => {
    let nm = m + delta, ny = y
    if (nm < 0)  { nm = 11; ny-- }
    if (nm > 11) { nm = 0;  ny++ }
    return { y: ny, m: nm }
  })

  const monthList = monthPayments(data, ym.y, ym.m).filter(p => filter === 'all' || p.status === filter)

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Rent</h1>
        <p className="page-sub">Track who's paid, who's due, and who's late — at a glance.</p>
      </div>

      <div className="stat-grid mb-24" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard icon="dollar" label="Owed this month" value={fmtMoney(stats.owed)} color="var(--text-secondary)" bg="var(--bg-light)" />
        <StatCard icon="alert" label={`Overdue (${stats.overdueCount})`} value={fmtMoney(stats.overdue)} valueColor="var(--error)" color="var(--error)" bg="var(--error-bg)" />
        <StatCard icon="checkCircle" label="Collected this month" value={fmtMoney(stats.collected)} valueColor="var(--primary-dark)" color="var(--primary)" bg="var(--success-bg)" />
      </div>

      <div className="row between wrap gap-md mb-16">
        <Segmented
          value={tabView}
          onChange={setTabView}
          options={[
            { value: 'calendar', label: 'Calendar', icon: 'calendar' },
            { value: 'list',     label: 'List',     icon: 'list' },
          ]}
        />
        <div className="row gap-md">
          <button className="btn-icon" onClick={() => shift(-1)} aria-label="Previous month"><Icon name="chevronLeft" size={20} /></button>
          <span style={{ fontWeight: 700, fontSize: 15, minWidth: 130, textAlign: 'center' }}>{monthName}</span>
          <button className="btn-icon" onClick={() => shift(1)} aria-label="Next month"><Icon name="chevronRight" size={20} /></button>
        </div>
      </div>

      {tabView === 'calendar' && (
        <RentCalendar year={ym.y} month={ym.m} onPick={p => p.status !== 'paid' && setPaying(p)} />
      )}

      {tabView === 'list' && (
        <div>
          <div className="row gap-sm wrap mb-16">
            {[['all', 'All'], ['paid', 'Paid'], ['due', 'Due'], ['late', 'Late']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} className="badge" style={{
                cursor: 'pointer', padding: '7px 14px', fontSize: 13,
                background: filter === v ? 'var(--text)' : 'var(--bg-light)',
                color: filter === v ? '#fff' : 'var(--text-secondary)',
                border: filter === v ? 'none' : '1px solid var(--border)',
              }}>{l}</button>
            ))}
          </div>

          <div className="tbl-wrap desktop-table">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Due date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {monthList.map(p => {
                  const t = tenantById(data, p.tenantId)
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="row gap-sm">
                          <span className="avatar avatar-sm">{initials(t?.name ?? '?')}</span>
                          <span style={{ fontWeight: 600, fontSize: 15 }}>{t?.name}</span>
                        </div>
                      </td>
                      <td className="muted">
                        {fmtDate(p.dueDate)}
                        {p.status === 'late' && <span className="xsmall" style={{ color: 'var(--error)' }}> · {p.daysOverdue}d late</span>}
                      </td>
                      <td style={{ fontWeight: 600 }}>{fmtMoney(p.amount)}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        {p.status !== 'paid'
                          ? <Button variant="outline" size="xs" icon="check" onClick={() => setPaying(p)}>Mark paid</Button>
                          : <button className="btn-icon" aria-label="View receipt"><Icon name="receipt" size={18} /></button>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards" style={{ flexDirection: 'column', gap: 12 }}>
            {monthList.map(p => {
              const t = tenantById(data, p.tenantId)
              return (
                <div key={p.id} className="card" style={{ padding: 16 }}>
                  <div className="row between">
                    <div className="row gap-sm">
                      <span className="avatar avatar-sm">{initials(t?.name ?? '?')}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{t?.name}</div>
                        <div className="xsmall muted">Due {fmtDate(p.dueDate)}</div>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="row between mt-16" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <strong>{fmtMoney(p.amount)}</strong>
                    {p.status !== 'paid' && (
                      <Button variant="outline" size="xs" icon="check" onClick={() => setPaying(p)}>Mark paid</Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {monthList.length === 0 && (
            <div className="card empty">
              <div className="empty-icon"><Icon name="dollar" size={26} /></div>
              No {filter !== 'all' ? filter : ''} payments for {monthName}.
            </div>
          )}
        </div>
      )}

      {paying && (
        <MarkPaidModal payment={paying} onClose={(ok) => { setPaying(null); if (ok) toast('Payment recorded') }} />
      )}
    </div>
  )
}

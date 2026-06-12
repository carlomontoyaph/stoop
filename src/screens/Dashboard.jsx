import { useStore, currentMonthStats, daysUntil, fmtMoney, fmtDate, relDate, tenantById } from '../store/index.js'
import { Icon, Button, StatCard } from '../components/index.js'
import { PRIORITY } from '../components/PriorityTag.jsx'

const TONE_COLOR = {
  error:   ['var(--error)',   'var(--error-bg)'],
  warning: ['#B45309',       'var(--warning-bg)'],
  info:    ['var(--info)',    'var(--info-bg)'],
}

function QuickAction({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} className="card"
      style={{ padding: 22, textAlign: 'left', background: 'var(--accent)', border: '1.5px dashed var(--secondary)', display: 'flex', gap: 14, alignItems: 'center', transition: 'transform .2s, background .2s', width: '100%' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'var(--accent-dark)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--accent)' }}
    >
      <span style={{ width: 44, height: 44, borderRadius: 10, background: '#fff', color: 'var(--secondary-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Icon name={icon} size={24} />
      </span>
      <span>
        <span style={{ display: 'block', fontWeight: 700, fontSize: 15 }}>{label}</span>
        <span className="xsmall muted">{sub}</span>
      </span>
    </button>
  )
}

export default function Dashboard({ go }) {
  const { data } = useStore()
  const stats = currentMonthStats(data)

  const activeLeases = data.tenants.filter(t => t.status === 'active')
  const upcomingLeases = activeLeases
    .map(t => ({ t, days: daysUntil(t.leaseEnd) }))
    .filter(x => x.days >= 0 && x.days <= 60)
    .sort((a, b) => a.days - b.days)
  const openMaint = data.maintenance.filter(m => m.status !== 'completed')

  const feed = []
  stats.list.filter(p => p.status === 'late').forEach(p => {
    const t = tenantById(data, p.tenantId)
    feed.push({ type: 'rent', icon: 'dollar', tone: 'error', title: 'Rent overdue', who: t?.name ?? '—', sub: `${fmtMoney(p.amount)} · ${p.daysOverdue} days late`, action: 'rent', btn: 'Mark paid' })
  })
  upcomingLeases.forEach(({ t, days }) => {
    feed.push({ type: 'lease', icon: 'calendar', tone: days <= 30 ? 'error' : 'warning', title: 'Lease renewal', who: t.name, sub: `Ends ${fmtDate(t.leaseEnd)} · ${relDate(t.leaseEnd)}`, action: 'leases', btn: 'Review' })
  })
  openMaint.filter(m => m.priority === 'high' || m.priority === 'emergency').forEach(m => {
    const t = tenantById(data, m.tenantId)
    feed.push({ type: 'maint', icon: 'wrench', tone: 'warning', title: 'Open maintenance', who: m.title, sub: `${t ? t.name : ''} · ${PRIORITY[m.priority].label} priority`, action: 'maintenance', btn: 'View' })
  })

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Good morning, Sam 👋</h1>
        <p className="page-sub">Here's what needs your attention across {data.properties.length} properties and {activeLeases.length} active tenants.</p>
      </div>

      <div className="stat-grid mb-24">
        <StatCard icon="dollar" label="Owed this month" value={fmtMoney(stats.owed)} trend={`${fmtMoney(stats.collected)} collected so far`} color="var(--primary)" bg="var(--success-bg)" />
        <StatCard icon="alert" label="Overdue payments" value={stats.overdueCount} trend={stats.overdueCount ? `${fmtMoney(stats.overdue)} outstanding` : 'All caught up'} color="var(--error)" bg="var(--error-bg)" valueColor={stats.overdueCount ? 'var(--error)' : undefined} />
        <StatCard icon="calendar" label="Leases renewing (60d)" value={upcomingLeases.length} trend={upcomingLeases.length ? `Soonest: ${upcomingLeases[0].t.name} (${upcomingLeases[0].t.unit})` : 'None soon'} color="#B45309" bg="var(--warning-bg)" />
        <StatCard icon="wrench" label="Open maintenance" value={openMaint.length} trend={`${openMaint.filter(m => m.priority === 'high' || m.priority === 'emergency').length} high priority`} color="var(--orange)" bg="#FFF7ED" />
      </div>

      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        <div>
          <h2 className="section-title">Upcoming deadlines</h2>
          <div className="card">
            {feed.length === 0 && (
              <div className="empty">
                <div className="empty-icon"><Icon name="checkCircle" size={26} /></div>
                You're all caught up. Nothing needs attention right now.
              </div>
            )}
            {feed.map((f, i) => {
              const [c, bg] = TONE_COLOR[f.tone] || TONE_COLOR.info
              return (
                <div key={i} className="row between" style={{ padding: '16px 18px', borderBottom: i < feed.length - 1 ? '1px solid var(--border)' : 'none', gap: 12 }}>
                  <div className="row gap-md" style={{ minWidth: 0 }}>
                    <span style={{ width: 38, height: 38, borderRadius: 10, background: bg, color: c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      <Icon name={f.icon} size={19} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{f.title}</div>
                      <div className="xsmall muted" style={{ marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.who} · {f.sub}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="xs" onClick={() => go(f.action)}>{f.btn}</Button>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="section-title">Quick actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <QuickAction icon="plusCircle" label="Add tenant" sub="New renter & lease" onClick={() => go('tenants')} />
            <QuickAction icon="dollar" label="Record a payment" sub="Mark rent as paid" onClick={() => go('rent')} />
            <QuickAction icon="wrench" label="New maintenance" sub="Log a repair request" onClick={() => go('maintenance')} />
          </div>
          <div className="card mt-24" style={{ padding: 18, background: 'var(--bg-light)' }}>
            <div className="row gap-sm" style={{ fontWeight: 700, fontSize: 14 }}>
              <Icon name="receipt" size={17} style={{ color: 'var(--secondary-dark)' }} /> Tax season ready
            </div>
            <p className="xsmall muted" style={{ marginTop: 6, lineHeight: 1.5 }}>Export a clean, tax-ready report for your accountant anytime.</p>
            <Button variant="ghost" size="sm" icon="download" style={{ marginTop: 10, paddingLeft: 0 }} onClick={() => go('settings')}>Export for CPA</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

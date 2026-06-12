import Icon from './Icon.jsx'

export default function StatCard({ icon, label, value, trend, color = 'var(--secondary)', bg = 'var(--accent)', valueColor }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ background: bg, color }}><Icon name={icon} size={20} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={valueColor ? { color: valueColor } : null}>{value}</div>
      {trend && <div className="stat-trend">{trend}</div>}
    </div>
  )
}

export const PRIORITY = {
  emergency: { color: '#EF4444', label: 'Emergency' },
  high:      { color: '#F97316', label: 'High' },
  medium:    { color: '#FBBF24', label: 'Medium' },
  low:       { color: '#3B82F6', label: 'Low' },
}

export default function PriorityTag({ level, dotOnly }) {
  const p = PRIORITY[level] || PRIORITY.low
  if (dotOnly) {
    return <span title={p.label} style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, display: 'inline-block', flex: 'none' }} />
  }
  return (
    <span className="row gap-sm" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
      {p.label}
    </span>
  )
}

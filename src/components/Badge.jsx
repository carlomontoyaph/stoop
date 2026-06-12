const STATUS_BADGE = {
  paid:           ['badge-success', 'Paid'],
  active:         ['badge-success', 'Active'],
  completed:      ['badge-success', 'Completed'],
  due:            ['badge-warning', 'Due'],
  'renewing soon':['badge-warning', 'Renewing soon'],
  late:           ['badge-error',   'Late'],
  overdue:        ['badge-error',   'Overdue'],
  expired:        ['badge-neutral', 'Expired'],
  inactive:       ['badge-neutral', 'Inactive'],
  open:           ['badge-info',    'Reported'],
  reported:       ['badge-info',    'Reported'],
  assigned:       ['badge-info',    'Assigned'],
  'in-progress':  ['badge-warning', 'In progress'],
}

export function StatusBadge({ status, label }) {
  const key = String(status || '').toLowerCase()
  const [cls, txt] = STATUS_BADGE[key] || ['badge-neutral', label || status]
  return <span className={`badge ${cls}`}>{label || txt}</span>
}

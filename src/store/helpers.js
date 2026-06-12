// Pinned to a fixed date so demo relative-dates render consistently regardless of when the app is opened.
export const TODAY = new Date('2026-06-11T12:00:00')

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}

export function fmtMoney(n) {
  return '$' + Number(n || 0).toLocaleString('en-US')
}

export function fmtDate(iso) {
  if (!iso) return '—'
  return parseDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtDateShort(iso) {
  if (!iso) return '—'
  return parseDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function daysUntil(iso) {
  return Math.round((parseDate(iso) - TODAY) / MS_PER_DAY)
}

export function relDate(iso) {
  const d = daysUntil(iso)
  if (d === 0)  return 'Today'
  if (d === 1)  return 'Tomorrow'
  if (d === -1) return 'Yesterday'
  if (d > 0)    return `in ${d} days`
  return `${Math.abs(d)} days ago`
}

export function leaseState(endIso) {
  const d = daysUntil(endIso)
  if (d < 0)   return 'expired'
  if (d <= 60) return 'renewing soon'
  return 'active'
}


export function tenantById(data, id)  { return data.tenants.find(t => t.id === id) }
export function propById(data, id)    { return data.properties.find(p => p.id === id) }

export function initials(name) {
  return name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
}

export function monthPayments(data, year, month) {
  return data.payments.filter(p => {
    const d = parseDate(p.dueDate)
    return d.getFullYear() === year && d.getMonth() === month
  })
}

export function currentMonthStats(data) {
  const y = TODAY.getFullYear(), m = TODAY.getMonth()
  const mp = monthPayments(data, y, m)
  const owed        = mp.reduce((s, p) => s + p.amount, 0)
  const collected   = mp.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const overdueList = mp.filter(p => p.status === 'late')
  const overdue     = overdueList.reduce((s, p) => s + p.amount, 0)
  return { owed, collected, overdue, overdueCount: overdueList.length, list: mp }
}

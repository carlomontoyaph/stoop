import { useState } from 'react'
import { Icon, Button, Field } from '../components/index.js'

export default function Feedback({ toast }) {
  const [sent, setSent] = useState(false)
  const [useful, setUseful] = useState('')
  const [would, setWould] = useState('')
  const [notes, setNotes] = useState('')
  const [email, setEmail] = useState('')

  if (sent) {
    return (
      <div className="empty" style={{ paddingTop: 80 }}>
        <div className="empty-icon" style={{ background: 'var(--success-bg)', color: 'var(--primary)' }}>
          <Icon name="checkCircle" size={28} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Thanks for the feedback!</h2>
        <p className="small mt-8">We read every response. Check your email for next steps.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Feedback</h1>
        <p className="page-sub">Help us validate Stoop — it takes 30 seconds.</p>
      </div>

      <div className="card" style={{ padding: 28, maxWidth: 560 }}>
        <Field label="Which feature is most useful to you?">
          <select className="select" value={useful} onChange={e => setUseful(e.target.value)}>
            <option value="">Choose one…</option>
            {['Tenants', 'Rent', 'Leases', 'Maintenance', 'Export for CPA'].map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>

        <div className="mt-24">
          <label className="field-label">Would you use this instead of spreadsheets?</label>
          <div className="row gap-sm mt-8 wrap">
            {['Definitely', 'Maybe', 'No'].map(o => (
              <button key={o} onClick={() => setWould(o)} className="badge" style={{
                cursor: 'pointer', padding: '9px 16px', fontSize: 14,
                background: would === o ? 'var(--primary)' : 'var(--bg-light)',
                color: would === o ? '#fff' : 'var(--text-secondary)',
                border: would === o ? 'none' : '1px solid var(--border)',
              }}>{o}</button>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <Field label="What's missing or could be better?">
            <textarea className="textarea" placeholder="Tell us anything…" value={notes} onChange={e => setNotes(e.target.value)} />
          </Field>
        </div>

        <div className="mt-16">
          <Field label="Email for follow-up" hint="Optional — we'll add you to the waitlist.">
            <input className="input" placeholder="you@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
        </div>

        <Button className="mt-24" onClick={() => { toast('Feedback sent — thank you!'); setSent(true) }} iconRight="arrowRight">
          Send feedback
        </Button>
      </div>
    </div>
  )
}

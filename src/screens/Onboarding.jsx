import { useState } from 'react'
import { Fragment } from 'react'
import Icon   from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import Field  from '../components/Field.jsx'
import { useStore } from '../store/index.js'
import { formatPhone } from '../utils/formatPhone.js'

function OnboardingStepper({ step }) {
  const steps = ['Property', 'Tenant', 'Done']
  return (
    <ol
      className="row"
      aria-label={`Setup progress: step ${step + 1} of ${steps.length}`}
      style={{ gap: 8, justifyContent: 'center', marginBottom: 36, listStyle: 'none', padding: 0 }}
    >
      {steps.map((s, i) => (
        <Fragment key={s}>
          <li className="row gap-sm" aria-current={i === step ? 'step' : undefined}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              background: i < step ? 'var(--primary)' : i === step ? 'var(--accent)' : 'var(--bg-light)',
              color: i < step ? '#fff' : i === step ? 'var(--secondary-dark)' : 'var(--text-tertiary)',
              border: i === step ? '2px solid var(--secondary)' : '1px solid var(--border)',
            }}>
              {i < step ? <Icon name="check" size={15} aria-label="Complete" /> : i + 1}
            </span>
            <span className="small" style={{ fontWeight: 600, color: i <= step ? 'var(--text)' : 'var(--text-tertiary)' }}>{s}</span>
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 28, height: 2, background: 'var(--border)', borderRadius: 2 }} />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  )
}

export default function Onboarding({ onFinish }) {
  const { startDemo } = useStore()
  const [step, setStep] = useState(0)
  const [prop, setProp] = useState({ name: 'Maple Court Duplex', address: '412 Maple Ave, Portland, OR 97214', units: 2 })
  const [tenant, setTenant] = useState({ name: '', email: '', phone: '', rent: 1500, leaseStart: '2025-08-01', leaseEnd: '2026-07-31' })
  const [errs, setErrs] = useState({})

  const validateTenant = () => {
    const e = {}
    if (!tenant.name.trim()) e.name = 'Tenant name is required.'
    if (!tenant.email.trim()) e.email = 'Email is required.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(tenant.email)) e.email = 'Please enter a valid email address.'
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const finish = () => { startDemo({ property: prop }); setStep(2) }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, var(--bg-light), #fff)', display: 'flex', flexDirection: 'column' }}>
      <div className="row between" style={{ padding: '20px 24px', maxWidth: 1120, margin: '0 auto', width: '100%' }}>
        <div className="brand">
          <span className="brand-mark"><Icon name="doorOpen" size={20} /></span> Stoop
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onFinish}>Skip setup →</button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 20px 64px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <OnboardingStepper step={step} />

          {step === 0 && (
            <div className="card" style={{ padding: 32, boxShadow: 'var(--sh-md)' }}>
              <h2 style={{ fontSize: 26, fontWeight: 700 }}>Let's set up your first property</h2>
              <p className="muted small mt-8">Just the basics — you can add more properties anytime. This takes about two minutes.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
                <Field label="Property name">
                  <input className="input" value={prop.name} onChange={(e) => setProp({ ...prop, name: e.target.value })} placeholder="My First Property" />
                </Field>
                <Field label="Address" hint="Optional for the demo.">
                  <input className="input" value={prop.address} onChange={(e) => setProp({ ...prop, address: e.target.value })} placeholder="123 Main St, City, State" />
                </Field>
                <Field label="Number of units">
                  <input className="input" type="number" min="1" value={prop.units} onChange={(e) => setProp({ ...prop, units: Number(e.target.value) || 1 })} style={{ maxWidth: 160 }} />
                </Field>
              </div>
              <div className="row" style={{ justifyContent: 'flex-end', marginTop: 28 }}>
                <Button onClick={() => setStep(1)} iconRight="chevronRight" disabled={!prop.name.trim()}>Continue</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="card" style={{ padding: 32, boxShadow: 'var(--sh-md)' }}>
              <h2 style={{ fontSize: 26, fontWeight: 700 }}>Add a tenant</h2>
              <p className="muted small mt-8">Add one tenant for <strong>{prop.name}</strong>. We'll pre-fill the rest with realistic demo data so you can explore right away.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
                <Field label="Full name" error={errs.name}>
                  <input className={`input${errs.name ? ' has-error' : ''}`} value={tenant.name} onChange={(e) => setTenant({ ...tenant, name: e.target.value })} placeholder="e.g. Jordan Lee" />
                </Field>
                <div className="ob-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Email" error={errs.email}>
                    <input className={`input${errs.email ? ' has-error' : ''}`} value={tenant.email} onChange={(e) => setTenant({ ...tenant, email: e.target.value })} placeholder="name@email.com" />
                  </Field>
                  <Field label="Phone" hint="Optional">
                    <input className="input" type="tel" inputMode="tel" value={tenant.phone} onChange={(e) => setTenant({ ...tenant, phone: formatPhone(e.target.value) })} placeholder="(555) 555-1234" />
                  </Field>
                </div>
                <div className="ob-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <Field label="Lease start">
                    <input className="input" type="date" value={tenant.leaseStart} onChange={(e) => setTenant({ ...tenant, leaseStart: e.target.value })} />
                  </Field>
                  <Field label="Lease end">
                    <input className="input" type="date" value={tenant.leaseEnd} onChange={(e) => setTenant({ ...tenant, leaseEnd: e.target.value })} />
                  </Field>
                  <Field label="Monthly rent">
                    <input className="input" type="number" value={tenant.rent} onChange={(e) => setTenant({ ...tenant, rent: Number(e.target.value) || 0 })} />
                  </Field>
                </div>
              </div>
              <div className="row between" style={{ marginTop: 28 }}>
                <Button variant="ghost" icon="chevronLeft" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => { if (validateTenant()) finish() }} iconRight="chevronRight">Create &amp; explore</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card" style={{ padding: 40, boxShadow: 'var(--sh-md)', textAlign: 'center' }}>
              <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <Icon name="checkCircle" size={34} />
              </span>
              <h2 style={{ fontSize: 26, fontWeight: 700, marginTop: 20 }}>You're all set!</h2>
              <p className="muted body" style={{ marginTop: 10, maxWidth: 400, marginInline: 'auto' }}>
                We loaded realistic demo data across <strong>6 tenants</strong> (5 active) and <strong>3 properties</strong> so you can explore every feature. Everything is editable.
              </p>
              <div className="row" style={{ justifyContent: 'center', marginTop: 28 }}>
                <Button size="lg" onClick={onFinish} iconRight="chevronRight">Go to dashboard</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

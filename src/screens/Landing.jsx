import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import { useStore, currentMonthStats, fmtMoney } from '../store/index.js'

function LandingNav({ onStart }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="brand">
          <span className="brand-mark"><Icon name="doorOpen" size={20} /></span> Stoop
        </div>
        <div className="row gap-lg hide-mobile" style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500 }}>
          <a href="#features" style={{ padding: '8px 4px' }}>Features</a>
          <a href="#pricing" style={{ padding: '8px 4px' }}>Pricing</a>
          <a href="#faq" style={{ padding: '8px 4px' }}>FAQ</a>
        </div>
        <Button onClick={onStart} iconRight="chevronRight">Try free demo</Button>
      </div>
    </nav>
  )
}

function HeroPreview() {
  const store = useStore()
  const collected = store?.data ? fmtMoney(currentMonthStats(store.data).collected) : '$5,850'
  const overdue   = store?.data ? fmtMoney(currentMonthStats(store.data).overdue)   : '$1,650'
  const tenants   = store?.data
    ? store.data.tenants.slice(0, 3).map(t => {
        const pay = store.data.payments.find(p => p.tenantId === t.id && p.dueDate.startsWith('2026-06'))
        const s   = pay?.status ?? 'due'
        return [t.name, s === 'paid' ? 'Paid' : s === 'late' ? 'Late' : 'Due', s === 'paid' ? 'badge-success' : s === 'late' ? 'badge-error' : 'badge-warning']
      })
    : [['John Doe', 'Paid', 'badge-success'], ['Maria Alvarez', 'Late', 'badge-error'], ['David Chen', 'Paid', 'badge-success']]

  return (
    <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ boxShadow: 'var(--sh-lg)', overflow: 'hidden', borderRadius: 16 }}>
        <div className="row between" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="brand" style={{ fontSize: 15 }}>
            <span className="brand-mark" style={{ width: 26, height: 26, borderRadius: 7 }}><Icon name="doorOpen" size={15} /></span> Stoop
          </div>
          <div className="avatar avatar-sm">SM</div>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>This month</div>
          <div className="row gap-md mt-8" style={{ flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120, background: 'var(--success-bg)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: 'var(--primary-dark)', fontWeight: 600 }}>Collected</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary-dark)' }}>{collected}</div>
            </div>
            <div style={{ flex: 1, minWidth: 120, background: 'var(--error-bg)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: '#B91C1C', fontWeight: 600 }}>Overdue</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#B91C1C' }}>{overdue}</div>
            </div>
          </div>
          <div className="mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tenants.map(([n, s, c]) => (
              <div key={n} className="row between" style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10 }}>
                <div className="row gap-sm">
                  <span className="avatar avatar-sm">{n.split(' ').map(x => x[0]).join('')}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{n}</span>
                </div>
                <span className={`badge ${c}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{ padding: '12px 16px', boxShadow: 'var(--sh-sm)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent)', color: 'var(--secondary-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Icon name="shield" size={18} />
        </span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Tax-ready export</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ready for tax time in one click</div>
        </div>
      </div>
    </div>
  )
}

function Hero({ onStart }) {
  return (
    <section style={{ background: 'linear-gradient(180deg, var(--bg-light) 0%, #fff 100%)' }}>
      <div className="hero-grid" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 88px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: 20 }}>
            <Icon name="sparkle" size={13} /> Built for DIY landlords · 1–10 properties
          </span>
          <h1 className="h1" style={{ marginTop: 0 }}>Stop drowning in spreadsheets.</h1>
          <p className="body-lg muted" style={{ marginTop: 18, maxWidth: 540 }}>
            The simple property management tool for landlords who manage 1–10 properties.
            No bloat. No $50/month fees. Just rent, tenants, leases, and maintenance —
            all in one place.
          </p>
          <div className="row gap-lg wrap" style={{ marginTop: 32 }}>
            <Button size="lg" onClick={onStart} iconRight="chevronRight">Try free demo</Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>See how it works</Button>
          </div>
          <div className="row gap-lg wrap mt-24" style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
            <span className="row gap-sm"><Icon name="check" size={16} style={{ color: 'var(--primary)' }} /> No credit card</span>
            <span className="row gap-sm"><Icon name="check" size={16} style={{ color: 'var(--primary)' }} /> Free up to 5 properties</span>
            <span className="row gap-sm"><Icon name="check" size={16} style={{ color: 'var(--primary)' }} /> 2-minute setup</span>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'center' }}><HeroPreview /></div>
      </div>
    </section>
  )
}

function PainPoints() {
  const items = [
    { old: '"I spend 8 hours a month hunting for tenant info and fixing spreadsheet errors."', oldH: 'The spreadsheet grind',
      newH: 'Everything in one place', neu: 'Tenants, rent, leases and repairs — searchable in seconds.' },
    { old: '"My CPA charges me extra because my books are scattered across files."', oldH: 'Messy books, bigger bills',
      newH: 'Tax-ready in seconds', neu: 'Clean, tax-ready reports your accountant will thank you for.' },
    { old: '"Maintenance comes by text, email, and call. I forget, and tenants get frustrated."', oldH: 'Requests fall through cracks',
      newH: 'Never miss a repair', neu: 'Log every request in one place and track it to done.' },
  ]
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <h2 className="h2" style={{ textAlign: 'center' }}>Why landlords switch to Stoop</h2>
        <p className="body muted" style={{ textAlign: 'center', marginTop: 12, maxWidth: 560, marginInline: 'auto' }}>
          You don't need 47 features. You need the four things that actually waste your time — fixed.
        </p>
        <div className="pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
          {items.map((it, i) => (
            <div key={i} className="card pain-card" style={{ padding: 28, transition: 'transform .25s, box-shadow .25s, border-color .25s' }}>
              <div className="row gap-sm" style={{ color: 'var(--error)', fontWeight: 700, fontSize: 13, letterSpacing: '.03em', textTransform: 'uppercase' }}>
                <Icon name="x" size={16} /> {it.oldH}
              </div>
              <p className="body" style={{ marginTop: 10, color: 'var(--text)' }}>{it.old}</p>
              <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
              <div className="row gap-sm" style={{ color: 'var(--primary-dark)', fontWeight: 700, fontSize: 13, letterSpacing: '.03em', textTransform: 'uppercase' }}>
                <Icon name="check" size={16} /> {it.newH}
              </div>
              <p className="body muted" style={{ marginTop: 10 }}>{it.neu}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const feats = [
    { icon: 'users',    title: 'Tenant Roster',    desc: 'One place for every tenant\'s info, lease, rent history, and documents. Search and find anything instantly.' },
    { icon: 'dollar',   title: 'Rent Tracking',    desc: 'Track due, paid, and late at a glance. Calculate late fees and export receipts for your records.' },
    { icon: 'calendar', title: 'Lease Timeline',   desc: 'See every renewal date before it sneaks up. Store lease documents and never miss a deadline.' },
    { icon: 'wrench',   title: 'Maintenance Log',  desc: 'Capture requests from anywhere, track status, log costs and receipts, and keep tenants happy.' },
  ]
  return (
    <section id="features" style={{ background: 'var(--bg-light)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <h2 className="h2" style={{ textAlign: 'center' }}>Built for the four things that matter</h2>
        <p className="body muted" style={{ textAlign: 'center', marginTop: 12 }}>Everything your accountant needs. Nothing you don't.</p>
        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 48 }}>
          {feats.map((f) => (
            <div key={f.title} className="card feat-card" style={{ padding: 28, transition: 'transform .25s, box-shadow .25s, border-color .25s' }}>
              <span style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--accent)', color: 'var(--secondary-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={f.icon} size={26} />
              </span>
              <h3 style={{ fontSize: 19, fontWeight: 600, marginTop: 18 }}>{f.title}</h3>
              <p className="small muted" style={{ marginTop: 10, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialProof() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div className="row" style={{ justifyContent: 'center', gap: 4, color: 'var(--warning)', marginBottom: 24 }}>
          {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={22} style={{ fill: 'var(--warning)' }} />)}
        </div>
        <p style={{ fontSize: 24, lineHeight: 1.5, fontWeight: 500, letterSpacing: '-0.01em' }}>
          "I switched from three different spreadsheets to Stoop. My CPA said it was the
          cleanest data he's ever seen from a DIY landlord — and it saved me $400 at tax time."
        </p>
        <div className="row" style={{ justifyContent: 'center', gap: 12, marginTop: 28 }}>
          <span className="avatar avatar-lg" style={{ background: 'var(--accent)' }}>MB</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700 }}>Marcus B.</div>
            <div className="small muted">Landlord of 6 properties · California</div>
          </div>
        </div>
        <div className="row trust-strip" style={{ justifyContent: 'center', gap: 32, marginTop: 48, flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>
          <span className="row gap-sm"><Icon name="shield" size={18} /> Your data stays yours</span>
          <span className="row gap-sm"><Icon name="receipt" size={18} /> Tax-ready reports</span>
          <span className="row gap-sm"><Icon name="clock" size={18} /> Saves up to 8 hrs / month</span>
        </div>
      </div>
    </section>
  )
}

function Pricing({ onStart }) {
  const Feature = ({ children }) => (
    <li className="row gap-sm" style={{ marginBottom: 12, alignItems: 'flex-start' }}>
      <Icon name="check" size={18} style={{ color: 'var(--primary)', flex: 'none', marginTop: 2 }} />
      <span className="body">{children}</span>
    </li>
  )
  return (
    <section id="pricing" style={{ background: 'var(--bg-light)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 className="h2" style={{ textAlign: 'center' }}>Simple, honest pricing</h2>
        <p className="body muted" style={{ textAlign: 'center', marginTop: 12 }}>Start free. Upgrade only if you need more.</p>
        <div className="price-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 48 }}>
          <div className="card" style={{ padding: '40px 32px', border: '2px solid var(--border)' }}>
            <div className="label">Free</div>
            <div className="row" style={{ alignItems: 'baseline', gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em' }}>$0</span>
              <span className="muted">/ month</span>
            </div>
            <ul style={{ listStyle: 'none', margin: '24px 0 28px' }}>
              <Feature>Up to 5 properties</Feature>
              <Feature>Unlimited tenants</Feature>
              <Feature>Rent, lease &amp; maintenance tracking</Feature>
              <Feature>Basic reporting</Feature>
            </ul>
            <Button variant="secondary" className="btn-block" onClick={onStart}>Get started free</Button>
          </div>
          <div className="card" style={{ padding: '40px 32px', border: '2px solid var(--primary)', position: 'relative', boxShadow: 'var(--sh-md)' }}>
            <span className="badge" style={{ position: 'absolute', top: -13, right: 24, background: 'var(--primary)', color: '#fff' }}>RECOMMENDED</span>
            <div className="label" style={{ color: 'var(--primary-dark)' }}>Unlimited</div>
            <div className="row" style={{ alignItems: 'baseline', gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em' }}>$8</span>
              <span className="muted">/ month · or $76/year</span>
            </div>
            <ul style={{ listStyle: 'none', margin: '24px 0 28px' }}>
              <Feature>Everything in Free</Feature>
              <Feature>Unlimited properties</Feature>
              <Feature>PDF &amp; CSV export for your CPA</Feature>
              <Feature>Document storage</Feature>
            </ul>
            <Button className="btn-block" onClick={onStart}>Start free, upgrade anytime</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const qs = [
    ['Do you store my data securely?', 'In this prototype your data is stored locally in your browser — nothing leaves your device. In the full product, data is encrypted in transit and at rest. Your data is always yours, and you can export it anytime.'],
    ['Can I export reports for my CPA?', 'Yes. Export clean PDF and CSV reports — tenant lists, rent summaries, lease status and expenses — pre-categorized and tax-ready.'],
    ['Do I need a credit card to start?', 'No. Try the demo free with no credit card. You\'re only charged if you choose to upgrade to Unlimited.'],
    ['Does it work on my phone?', 'Yes. Stoop works on phone, tablet, and desktop — manage rent or log a repair from anywhere.'],
  ]
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 className="h2" style={{ textAlign: 'center', marginBottom: 40 }}>Questions?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {qs.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ background: 'var(--bg-light)', border: `${isOpen ? 2 : 1}px solid ${isOpen ? 'var(--secondary)' : 'var(--border)'}`, borderRadius: 10, padding: isOpen ? '19px' : '20px', transition: 'border-color .2s' }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="row between"
                  style={{ width: '100%', textAlign: 'left', gap: 16 }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{q}</span>
                  <Icon name="chevronDown" size={20} style={{ color: 'var(--text-secondary)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flex: 'none' }} />
                </button>
                {isOpen && <p id={`faq-answer-${i}`} className="body muted" style={{ marginTop: 12 }}>{a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Footer({ onStart }) {
  return (
    <footer style={{ background: 'var(--text)', color: '#fff' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 40px' }}>
        <div className="footer-cta card" style={{ background: 'linear-gradient(120deg, var(--primary) 0%, var(--secondary) 100%)', border: 'none', padding: '40px', textAlign: 'center', marginBottom: 56 }}>
          <h2 className="h2" style={{ color: '#fff' }}>Ready to ditch the spreadsheets?</h2>
          <p className="body" style={{ color: 'rgba(255,255,255,0.9)', marginTop: 12 }}>Try the full demo free — no account, no credit card.</p>
          <div className="row" style={{ justifyContent: 'center', marginTop: 24 }}>
            <Button size="lg" variant="outline" onClick={onStart} iconRight="chevronRight" style={{ background: '#fff' }}>Try free demo</Button>
          </div>
        </div>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 32 }}>
          <div>
            <div className="brand" style={{ color: '#fff' }}><span className="brand-mark"><Icon name="doorOpen" size={20} /></span> Stoop</div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 12, maxWidth: 300, lineHeight: 1.6 }}>
              The simple, affordable property management tool built for DIY landlords. Spend less time on data, more time on your business.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Product</div>
            {['Features', 'Pricing', 'Security', 'FAQs'].map((l) => <div key={l} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginBottom: 10 }}>{l}</div>)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Legal</div>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => <div key={l} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginBottom: 10 }}>{l}</div>)}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 40, paddingTop: 28, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
          © 2026 Stoop. All rights reserved. · A prototype for DIY landlord validation.
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage({ onStart }) {
  return (
    <div style={{ background: '#fff' }}>
      <LandingNav onStart={onStart} />
      <Hero onStart={onStart} />
      <PainPoints />
      <Features />
      <SocialProof />
      <Pricing onStart={onStart} />
      <FAQ />
      <Footer onStart={onStart} />
    </div>
  )
}

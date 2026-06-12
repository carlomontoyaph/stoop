import Icon from './Icon.jsx'

/**
 * Segmented button control (radio-style, single selection).
 * @param {{ value: string, label: string, icon?: string }[]} props.options
 * @param {string}   props.value     - Currently selected value
 * @param {Function} props.onChange  - Called with the new value string on selection
 * @param {string}   [props.label]   - Accessible group label (announced by screen readers, not rendered visually)
 */
export default function Segmented({ options, value, onChange, label }) {
  return (
    <div
      className="row"
      role="group"
      aria-label={label}
      style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, gap: 4, width: 'fit-content' }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className="row gap-sm"
          style={{
            padding: '7px 14px', borderRadius: 7, fontSize: 14, fontWeight: 600,
            background: value === o.value ? '#fff' : 'transparent',
            color: value === o.value ? 'var(--text)' : 'var(--text-secondary)',
            boxShadow: value === o.value ? 'var(--sh-sm)' : 'none',
          }}
        >
          {o.icon && <Icon name={o.icon} size={16} />}{o.label}
        </button>
      ))}
    </div>
  )
}

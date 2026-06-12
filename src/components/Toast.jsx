import Icon from './Icon.jsx'

export default function Toast({ msg, icon = 'checkCircle' }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {msg && (
        <div className="toast">
          <Icon name={icon} size={18} style={{ color: 'var(--primary)' }} />
          {msg}
        </div>
      )}
    </div>
  )
}
